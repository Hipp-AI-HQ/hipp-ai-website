/**
 * Twilio Media Streams ↔ Gemini Live WebSocket bridge.
 *
 * Per-call lifecycle:
 *   connected         → log, allocate per-WS state holder
 *   start             → open Gemini Live session, init Supabase calls row,
 *                       send synthetic start cue so Gemini greets first
 *                       (Gemini Live has no native firstMessage like Vapi)
 *   media (inbound)   → mulaw 8k → PCM 16k → Gemini.sendAudio
 *   media (outbound)  → Gemini PCM 24k → buffer → chunk into 20ms frames
 *                       → mulaw 8k → Twilio media event
 *   stop              → close Gemini, fire buildPlanService.runForCall
 *                       with the assembled transcript (in-process — no
 *                       webhook hop because we own both sides)
 *
 * Tools are routed in-process (no HTTP) from Gemini's toolCall events to
 * the existing service modules. Same code path as the Vapi flow's HTTP
 * tool endpoints, just skipping the network.
 *
 * Persona (prompt/tools/greeting/voice) is selected per call by the DIALED
 * number via pickPersona() — the live Hipp AI line and the rotating demo
 * line share this bridge. Default/fallback is always the Hipp persona.
 */
import type { IncomingMessage } from "node:http";
import type { Server as HttpServer } from "node:http";
import type { Duplex } from "node:stream";
import { WebSocketServer, type WebSocket } from "ws";
import {
  mulaw8kBase64ToPcm16kBase64,
  pcm24kBase64ToMulaw8kBase64,
} from "../audio/converters";
import {
  connectGeminiLive,
  type GeminiLiveSession,
} from "../integrations/geminiLive";
import { pickPersona, type Persona } from "../config/personas";
import { outboundCrm } from "../integrations/outboundCrm";
import { demoIntakeService } from "./demoIntakeService";
import { knowledgeBaseService } from "./knowledgeBase";
import { notifyService } from "./notifyService";
import { callsService } from "./callsService";
import { crmService } from "./crmService";
import { buildPlanService, computeCallCostEstimate } from "./buildPlanService";
import { telegramClient } from "../integrations/telegram";
import { google } from "googleapis";

const GEMINI_MODEL = "gemini-3.1-flash-live-preview";

// ---------------------------------------------------------------------------
// Auto-hangup tuning
// ---------------------------------------------------------------------------
/** Hard ceiling — Twilio call gets force-ended regardless of state. */
const HARD_CAP_MS = 15 * 60 * 1000; // 15 minutes
/** Silence timeout — if no transcript activity in either direction for this
 *  long, end the call. Grace period before kicking in so the first turn has
 *  room to load. */
const IDLE_TIMEOUT_MS = 45 * 1000; // 45 seconds
/** After demo_intake_save fires + the agent finishes its closing turn, wait
 *  this long before terminating so the goodbye message fully plays through
 *  Twilio's outbound audio buffer. */
const POST_SAVE_HANGUP_GRACE_MS = 5 * 1000;
/** How often the auto-hangup timer ticks (cheap, no rush). */
const HANGUP_CHECK_INTERVAL_MS = 3000;

interface TwilioMediaEvent {
  event: "media";
  streamSid: string;
  media: { track: string; chunk: string; timestamp: string; payload: string };
}

interface TwilioStartEvent {
  event: "start";
  streamSid: string;
  start: {
    streamSid: string;
    accountSid: string;
    callSid: string;
    tracks: string[];
    mediaFormat: { encoding: string; sampleRate: number; channels: number };
    customParameters?: Record<string, string>;
  };
}

interface TwilioStopEvent {
  event: "stop";
  streamSid: string;
  stop: { accountSid: string; callSid: string };
}

type TwilioInboundEvent = { event: string; [k: string]: unknown };
type Speaker = "user" | "agent" | null;

interface CallState {
  callSid: string;
  streamSid: string;
  fromNumber: string;
  /** The number the caller dialed (Twilio `To`), passed via TwiML <Parameter>. */
  toNumber: string;
  /** Persona selected from toNumber at call start. Never changes mid-call. */
  persona: Persona;
  startedAtMs: number;
  inboundFrames: number;
  outboundFrames: number;
  gemini: GeminiLiveSession | null;
  /** Conversational transcript with speaker labels, ready for buildPlanService. */
  transcript: string;
  /** Tracks last speaker so we only emit a label on speaker change. */
  lastSpeaker: Speaker;
  /** Raw running buffers — kept for diagnostics; not used as primary transcript source. */
  agentTranscriptRaw: string;
  userTranscriptRaw: string;
  closed: boolean;
  /** Updated on any Gemini transcription event (user or agent). Drives the
   *  idle timeout — long stretches of no real conversation get hung up. */
  lastTranscriptMs: number;
  /** Wall-clock ms when demo_intake_save returned success. Once set, the
   *  next turnComplete schedules a graceful auto-hangup. */
  intakeSavedAtMs: number | null;
  /** True once a graceful hangup has been scheduled, so we don't queue
   *  multiple end-call timers. */
  hangupScheduled: boolean;
  /** Periodic timer handle for idle + hard-cap checks. */
  watchdogHandle: ReturnType<typeof setInterval> | null;
}

// ---------------------------------------------------------------------------
// Twilio call termination (REST API)
// ---------------------------------------------------------------------------

/**
 * Force-end a Twilio call from our side. Twilio doesn't end the call when
 * the agent stops talking — the WS stays connected until the caller hangs
 * up OR until we POST status=completed to the Calls resource.
 *
 * The Twilio `stop` event will fire after this returns; our existing stop
 * handler picks up and runs the normal end-of-call notification + buildPlan.
 */
async function endTwilioCall(callSid: string, reason: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const tok = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !tok) {
    console.error(`[twilio-bridge] [${callSid}] cannot end call — TWILIO credentials missing`);
    return;
  }
  console.log(`[twilio-bridge] [${callSid}] terminating Twilio call (reason: ${reason})`);
  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls/${callSid}.json`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${sid}:${tok}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "Status=completed",
      },
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(
        `[twilio-bridge] [${callSid}] Twilio end-call failed (${res.status}): ${body.slice(0, 200)}`,
      );
    } else {
      console.log(`[twilio-bridge] [${callSid}] Twilio call terminated`);
    }
  } catch (err) {
    console.error(`[twilio-bridge] [${callSid}] Twilio end-call threw: ${(err as Error).message}`);
  }
}

// ---------------------------------------------------------------------------
// Twilio framing helpers
// ---------------------------------------------------------------------------

function sendTwilioClear(ws: WebSocket, streamSid: string): void {
  ws.send(JSON.stringify({ event: "clear", streamSid }));
}

function sendTwilioMulawFrame(ws: WebSocket, streamSid: string, mulawBase64: string): void {
  ws.send(
    JSON.stringify({
      event: "media",
      streamSid,
      media: { payload: mulawBase64 },
    }),
  );
}

/**
 * Convert a single Gemini PCM 24k chunk → mulaw 8k → one Twilio frame.
 *
 * Sending each Gemini chunk as its own Twilio frame (no slicing into smaller
 * pieces) keeps the resampler's filter context intact within each chunk. The
 * downside is variable frame sizes (Gemini chunks vary ~50-200ms); Twilio
 * accepts variable-length outbound media per its Media Streams docs.
 */
function sendGeminiChunkToTwilio(ws: WebSocket, state: CallState, pcm24kBase64: string): void {
  try {
    const mulawBase64 = pcm24kBase64ToMulaw8kBase64(pcm24kBase64);
    if (mulawBase64) {
      sendTwilioMulawFrame(ws, state.streamSid, mulawBase64);
      state.outboundFrames++;
    }
  } catch (err) {
    console.error(
      `[twilio-bridge] [${state.callSid}] outbound audio convert/send failed: ${(err as Error).message}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Transcript turn tracking
// ---------------------------------------------------------------------------

function appendTranscriptChunk(state: CallState, text: string, isInput: boolean): void {
  const speaker: Speaker = isInput ? "user" : "agent";
  if (state.lastSpeaker !== speaker) {
    if (state.transcript.length > 0 && !state.transcript.endsWith("\n")) {
      state.transcript += "\n";
    }
    state.transcript += speaker === "user" ? "User: " : "AI: ";
    state.lastSpeaker = speaker;
  }
  state.transcript += text;
  if (isInput) state.userTranscriptRaw += text;
  else state.agentTranscriptRaw += text;
  // Any new transcript text == real conversation activity. Resets idle timer.
  state.lastTranscriptMs = Date.now();
}

// ---------------------------------------------------------------------------
// Tool routing — Gemini toolCall events route in-process to existing services.
// Same business logic the Vapi HTTP tool endpoints use, just no network hop.
// ---------------------------------------------------------------------------

interface ToolResponse {
  id: string;
  name: string;
  response: Record<string, unknown>;
}

async function runTool(
  state: CallState,
  call: { id: string; name: string; args: Record<string, unknown> },
): Promise<ToolResponse> {
  const { name, args, id } = call;
  console.log(
    `[twilio-bridge] [${state.callSid}] toolCall name=${name} args=${JSON.stringify(args).slice(0, 200)}`,
  );

  try {
    switch (name) {
      case "demo_intake_save": {
        const source = args.source ? String(args.source).toLowerCase() : "linkedin";
        const socialHandle = args.social_handle ? String(args.social_handle) : undefined;
        const smsConsent = args.sms_consent === true;
        // Default delivery: social leads get a text (we have caller ID); LinkedIn
        // leads keep the existing LinkedIn-DM path unless they asked otherwise.
        const deliveryChannel = args.delivery_channel
          ? String(args.delivery_channel)
          : source === "linkedin"
            ? "linkedin_dm"
            : "sms";
        const callerName = String(args.caller_name ?? "");
        const company = String(args.company ?? "");
        const result = await demoIntakeService.save({
          callId: state.callSid,
          phone: state.fromNumber,
          caller_name: callerName,
          company,
          role: args.role ? String(args.role) : undefined,
          task: String(args.task ?? ""),
          tools_used: args.tools_used ? String(args.tools_used) : undefined,
          frequency: String(args.frequency ?? ""),
          time_per_occurrence: String(args.time_per_occurrence ?? ""),
          output: String(args.output ?? ""),
          edge_cases: args.edge_cases ? String(args.edge_cases) : undefined,
          recommendation: String(args.recommendation ?? ""),
          notes: args.notes ? String(args.notes) : undefined,
          source,
          social_handle: socialHandle,
          delivery_channel: deliveryChannel,
          sms_consent: smsConsent,
        });
        // Enrich the master CRM contact with what we learned (best-effort).
        void crmService.enrichContact(state.fromNumber, {
          name: callerName || undefined,
          company: company || undefined,
          source,
          social_handle: socialHandle,
          sms_consent: smsConsent,
        });
        // Mark when the save fired — auto-hangup arms once the agent finishes
        // its closing turn after this point.
        state.intakeSavedAtMs = Date.now();
        console.log(
          `[twilio-bridge] [${state.callSid}] demo_intake_save success (source=${source}, delivery=${deliveryChannel}) — auto-hangup armed`,
        );
        return {
          id,
          name,
          response: {
            success: true,
            demoIntakeId: result.demoIntakeId,
            message: "Saved. Dillon will get started on it this week.",
          },
        };
      }

      case "pest_lead_save": {
        // Demo-line lead capture. The webhook (n8n → external CRM, e.g.
        // GorillaDesk) is the system of record for demo leads — deliberately
        // NO demo_intakes/master-CRM writes here, so the Hipp buildPlan
        // pipeline and growth sheets never see demo traffic.
        const callbackRaw = String(args.callback_phone ?? "").trim();
        const payload = {
          source: "demo-line",
          persona: state.persona.key,
          call_sid: state.callSid,
          caller_name: String(args.caller_name ?? ""),
          callback_phone: callbackRaw || state.fromNumber,
          address: String(args.address ?? ""),
          pest_type: String(args.pest_type ?? ""),
          property_type: String(args.property_type ?? ""),
          preferred_window: String(args.preferred_window ?? ""),
          notes: String(args.notes ?? ""),
          received_at: new Date().toISOString(),
        };
        // Webhook failure must NEVER stall the voice UX mid-demo: catch here,
        // log loudly, still return success — the always-fire Telegram/email
        // notification carries the transcript so no lead is actually lost.
        try {
          const pushed = await outboundCrm.pushDemoLead(payload);
          console.log(
            `[twilio-bridge] [${state.callSid}] pest_lead_save ${pushed ? "pushed to CRM webhook" : "captured (webhook env unset)"}`,
          );
        } catch (err) {
          console.error(
            `[twilio-bridge] [${state.callSid}] pest_lead_save webhook FAILED (voice continues): ${(err as Error).message}`,
          );
        }
        // Arms the same graceful goodbye-then-hangup flow as demo_intake_save.
        state.intakeSavedAtMs = Date.now();
        return {
          id,
          name,
          response: {
            success: true,
            message:
              "Lead saved. Briefly confirm what you captured in one sentence, then close the call.",
          },
        };
      }

      case "knowledge_base_search": {
        const query = String(args.query ?? "");
        const topK = typeof args.top_k === "number" ? args.top_k : 4;
        const results = await knowledgeBaseService.search({ query, top_k: topK });
        return {
          id,
          name,
          response: { results },
        };
      }

      case "notify_escalate": {
        const priority = (String(args.priority ?? "normal").toLowerCase() as
          | "low"
          | "normal"
          | "high"
          | "urgent");
        await notifyService.escalate({
          priority,
          subject: String(args.subject ?? "(no subject)"),
          message: String(args.message ?? ""),
          callId: state.callSid,
          lead: (args.lead as Record<string, unknown> | undefined) ?? {
            phone: state.fromNumber,
          },
        });
        return {
          id,
          name,
          response: { delivered: true, channel: "slack", priority },
        };
      }

      case "calls_log_final": {
        const outcome = (String(args.outcome ?? "other") as
          | "booked"
          | "link_sent"
          | "message_taken"
          | "resolved"
          | "escalated"
          | "other");
        await callsService.logFinal({
          callId: state.callSid,
          transcript: String(args.transcript ?? state.transcript),
          summary: String(args.summary ?? ""),
          outcome,
          leadId: args.leadId ? String(args.leadId) : undefined,
        });
        return { id, name, response: { logged: true } };
      }

      default:
        console.warn(
          `[twilio-bridge] [${state.callSid}] unknown tool name=${name}, returning generic ok`,
        );
        return { id, name, response: { ok: true, unknown_tool: true } };
    }
  } catch (err) {
    console.error(
      `[twilio-bridge] [${state.callSid}] tool ${name} failed: ${(err as Error).message}`,
    );
    return {
      id,
      name,
      response: { error: (err as Error).message, ok: false },
    };
  }
}

// ---------------------------------------------------------------------------
// Gemini session lifecycle
// ---------------------------------------------------------------------------

async function attachGeminiSession(ws: WebSocket, state: CallState): Promise<void> {
  console.log(
    `[twilio-bridge] [${state.callSid}] opening Gemini Live (model=${GEMINI_MODEL}, persona=${state.persona.key}, voice=${state.persona.voiceName})`,
  );

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(`[twilio-bridge] [${state.callSid}] GEMINI_API_KEY not set — aborting`);
    return;
  }

  try {
    const session = await connectGeminiLive({
      apiKey,
      model: GEMINI_MODEL,
      voiceName: state.persona.voiceName,
      systemPrompt: state.persona.systemPrompt,
      tools: state.persona.tools,
      temperature: 0.4,
      maxOutputTokens: 4096,
      enableInputTranscription: true,
      enableOutputTranscription: true,
      // Snappy turn-taking for phone calls. Defaults are tuned for desktop
      // "polite waiting" cadence which leaves dead air after the caller cuts
      // the agent off and stops talking.
      vad: {
        startSensitivity: "high", // pick up barge-in faster
        endSensitivity: "high",   // commit to end-of-speech faster (= faster response)
        silenceDurationMs: 500,   // half a second of silence is enough to confirm turn end
        prefixPaddingMs: 20,      // trigger speech-start on the first 20ms of audio
      },
      callbacks: {
        onSetupComplete: () => {
          console.log(`[twilio-bridge] [${state.callSid}] Gemini setupComplete`);
        },
        onAudio: (pcm24kBase64) => {
          if (state.closed) return;
          sendGeminiChunkToTwilio(ws, state, pcm24kBase64);
        },
        onTranscript: (text, isInput) => {
          try {
            appendTranscriptChunk(state, text, isInput);
          } catch (err) {
            console.error(
              `[twilio-bridge] [${state.callSid}] transcript append failed: ${(err as Error).message}`,
            );
          }
        },
        onToolCall: (call) => {
          // Route in-process to the actual service. Fire-and-forget the async
          // work; reply to Gemini when it resolves.
          runTool(state, call)
            .then((resp) => {
              if (state.closed) return;
              state.gemini?.sendToolResponses([resp]);
            })
            .catch((err: Error) => {
              console.error(
                `[twilio-bridge] [${state.callSid}] tool route threw: ${err.message}`,
              );
              if (!state.closed) {
                state.gemini?.sendToolResponses([
                  { id: call.id, name: call.name, response: { error: err.message, ok: false } },
                ]);
              }
            });
        },
        onInterrupted: () => {
          // Caller barged in — tell Twilio to drop any queued playback.
          console.log(`[twilio-bridge] [${state.callSid}] Gemini interrupted (barge-in)`);
          sendTwilioClear(ws, state.streamSid);
        },
        onTurnComplete: () => {
          console.log(`[twilio-bridge] [${state.callSid}] Gemini turnComplete`);
          // If the intake was already saved, this turnComplete is most likely
          // the agent's closing message. Schedule graceful hangup after the
          // outbound audio buffer drains.
          if (state.intakeSavedAtMs && !state.hangupScheduled && !state.closed) {
            state.hangupScheduled = true;
            console.log(
              `[twilio-bridge] [${state.callSid}] intake-saved + turnComplete → graceful hangup in ${POST_SAVE_HANGUP_GRACE_MS}ms`,
            );
            setTimeout(() => {
              if (state.closed) return;
              void endTwilioCall(state.callSid, "intake_saved_turn_complete");
            }, POST_SAVE_HANGUP_GRACE_MS);
          }
        },
        onError: (err) => {
          console.error(`[twilio-bridge] [${state.callSid}] Gemini error: ${err.message}`);
        },
        onClose: (code, reason) => {
          console.log(
            `[twilio-bridge] [${state.callSid}] Gemini WS closed: code=${code} reason="${reason}"`,
          );
        },
      },
    });

    state.gemini = session;
    await session.setupCompletePromise;

    // Gemini Live has no native firstMessage. Send a synthetic cue so the
    // agent greets first.
    //
    // CRITICAL: the cue must NOT also tell Gemini to "begin the discovery
    // flow" — earlier version did that and Gemini chained the greeting +
    // discovery step 1 ("Awesome, who am I talking to?") in a single turn,
    // before the caller had said anything. The cue below says ONLY: say the
    // greeting, then stop and wait.
    const startCue =
      `The phone just connected. The caller has not said anything yet. ` +
      `Your immediate response — the very first thing the caller will hear — ` +
      `must be the greeting below, said verbatim. Say only this greeting, ` +
      `then stop and wait silently for the caller to reply. Do NOT continue ` +
      `to any discovery question until the caller has spoken first.\n\n` +
      `Greeting to say verbatim: "${state.persona.firstMessage}"`;
    console.log(`[twilio-bridge] [${state.callSid}] sending start cue to Gemini`);
    session.sendText(startCue);
  } catch (err) {
    console.error(
      `[twilio-bridge] [${state.callSid}] Gemini connect failed: ${(err as Error).message}`,
    );
  }
}

// ---------------------------------------------------------------------------
// End-of-call orchestration
// ---------------------------------------------------------------------------

function vapiCallLink(callSid: string): string {
  // Twilio call logs (the analogue of Vapi's per-call dashboard URL)
  return `https://console.twilio.com/us1/monitor/logs/calls/${callSid}`;
}

function getGmailAuth() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return auth;
}

/**
 * Fires for EVERY call regardless of whether demo_intake_save was called.
 * Sends Telegram + email so Dillon knows a call happened even if the lead
 * hung up mid-discovery. If the call DID complete a full intake, the
 * separate build-plan email lands ~30s later with the rich data.
 */
async function sendCallEndedNotification(state: CallState, intakeSaved: boolean): Promise<void> {
  const callSid = state.callSid;
  const durationSec = Math.round((Date.now() - state.startedAtMs) / 1000);
  const costEstimate = computeCallCostEstimate(durationSec, intakeSaved);
  const transcript = state.transcript.trim();
  const transcriptPreview = transcript.slice(0, 1200);
  const callLink = vapiCallLink(callSid);

  const headline = intakeSaved
    ? state.persona.key === "hipp"
      ? "✅ Demo intake saved — full build plan email coming in ~30s"
      : "✅ Demo-line lead captured (pushed to the CRM webhook)"
    : "📞 Call ended before intake was saved (caller hung up mid-discovery or call was short)";

  // ----- Telegram -----
  const tgLines = [
    `📞 *${state.persona.label} — Call*`,
    `*From:* ${state.fromNumber || "(unknown)"}`,
    `*Duration:* ${durationSec}s`,
    `*Cost (est.):* $${costEstimate.toFixed(4)}`,
    `*Status:* ${headline}`,
    "",
    "*Transcript:*",
    "```",
    transcriptPreview || "(no transcript captured)",
    "```",
    "",
    `[Open in Twilio →](${callLink})`,
  ];
  await telegramClient.send(tgLines.join("\n")).catch((err: Error) => {
    console.error(`[twilio-bridge] [${callSid}] Telegram send failed: ${err.message}`);
  });

  // ----- Email -----
  try {
    const gmail = google.gmail({ version: "v1", auth: getGmailAuth() });
    const subject = intakeSaved
      ? state.persona.key === "hipp"
        ? `📞 Call received — full intake saved (${state.fromNumber || "unknown"})`
        : `📞 Demo line — lead captured (${state.fromNumber || "unknown"})`
      : `📞 Short call received (${state.fromNumber || "unknown"}) — no intake saved`;
    const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
    const escapedTranscript = transcriptPreview
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:760px;margin:0 auto;">
        <div style="background:#000212;padding:20px 24px;border-radius:10px 10px 0 0;">
          <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.08em;color:#53FC18;text-transform:uppercase;">Hipp AI · Voice Agent · Call</p>
          <h1 style="margin:6px 0 0;font-size:20px;color:#f7f8f8;font-weight:600;">${state.fromNumber || "Unknown caller"}</h1>
          <p style="margin:6px 0 0;font-size:12px;color:#a3a3a3;">Duration ${durationSec}s · Est. cost $${costEstimate.toFixed(4)} · ${headline}</p>
        </div>
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;padding:20px 24px;">
          <h2 style="margin:0 0 6px;font-size:14px;color:#111;">Transcript</h2>
          <pre style="margin:0 0 16px;font-size:12px;line-height:1.5;color:#374151;background:#f9fafb;padding:16px;border-radius:6px;white-space:pre-wrap;word-wrap:break-word;">${escapedTranscript || "(no transcript captured)"}</pre>
          <p style="margin:16px 0 0;font-size:12px;color:#666;">
            <a href="${callLink}" style="color:#53FC18;text-decoration:none;font-weight:600;">Open in Twilio →</a>
          </p>
        </div>
      </div>
    `;
    const raw = Buffer.from(
      [
        `From: Hipp AI Voice Agent <dillon@hippaihq.com>`,
        `To: dillon@hippaihq.com`,
        `Subject: ${encodedSubject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=utf-8`,
        ``,
        html,
      ].join("\r\n"),
    ).toString("base64url");
    await gmail.users.messages.send({ userId: "me", requestBody: { raw } });
    console.log(`[twilio-bridge] [${callSid}] call-ended email sent`);
  } catch (err) {
    console.error(`[twilio-bridge] [${callSid}] call-ended email failed: ${(err as Error).message}`);
  }
}

function fireEndOfCall(state: CallState): void {
  const transcript = state.transcript.trim();
  console.log(
    `[twilio-bridge] [${state.callSid}] firing end-of-call: transcript_len=${transcript.length}`,
  );

  // Mark calls row as ended (best-effort).
  callsService
    .markEnded({
      id: state.callSid,
      endedAt: new Date().toISOString(),
      transcript,
    })
    .catch((err: Error) => {
      console.error(
        `[twilio-bridge] [${state.callSid}] markEnded failed: ${err.message}`,
      );
    });

  // Check for demo_intake row + ALWAYS fire the call-ended notification
  // (with intake-saved flag so the message reflects what happened).
  // Demo-line personas never write demo_intakes — their "saved" signal is
  // the in-memory pest_lead_save timestamp instead of a Supabase lookup.
  setImmediate(async () => {
    let intakeSaved = false;
    if (state.persona.key === "hipp") {
      try {
        const intake = await demoIntakeService.lookupByCallId(state.callSid);
        intakeSaved = !!intake;
      } catch (err) {
        console.error(`[twilio-bridge] [${state.callSid}] intake lookup failed: ${(err as Error).message}`);
      }
    } else {
      intakeSaved = state.intakeSavedAtMs !== null;
    }

    // ALWAYS notify, regardless of intake save state. Short calls get the
    // "no intake" version; full discoveries get the "intake saved + build
    // plan coming" version.
    await sendCallEndedNotification(state, intakeSaved).catch((err: Error) => {
      console.error(`[twilio-bridge] [${state.callSid}] notification failed: ${err.message}`);
    });

    // If intake exists AND transcript is rich enough, fire the build-plan
    // generator. It emails Dillon separately with the full build plan +
    // Claude Code Prompt + Follow-up DM cells written to the sheet.
    // Hipp persona ONLY — demo-line calls have no warm queue to match and
    // no build plan to write (belt-and-braces: they also never satisfy the
    // demo_intakes lookup above).
    if (state.persona.key === "hipp" && intakeSaved && transcript.length >= 50) {
      const durationSec = Math.round((Date.now() - state.startedAtMs) / 1000);
      buildPlanService.runForCall(state.callSid, transcript, durationSec).catch((err: Error) => {
        console.error(
          `[twilio-bridge] [${state.callSid}] buildPlanService.runForCall failed: ${err.message}`,
        );
      });
    } else {
      console.log(
        `[twilio-bridge] [${state.callSid}] skipping buildPlan (persona=${state.persona.key}, intakeSaved=${intakeSaved}, transcript_len=${transcript.length})`,
      );
    }
  });
}

// ---------------------------------------------------------------------------
// WebSocket connection handler
// ---------------------------------------------------------------------------

function handleConnection(ws: WebSocket, req: IncomingMessage): void {
  const remoteIp = req.socket.remoteAddress ?? "unknown";
  console.log(`[twilio-bridge] WS connected from ${remoteIp}`);

  let state: CallState | null = null;

  ws.on("message", (raw: Buffer) => {
    let evt: TwilioInboundEvent;
    try {
      evt = JSON.parse(raw.toString("utf8")) as TwilioInboundEvent;
    } catch (err) {
      console.error(`[twilio-bridge] WS message parse failed: ${(err as Error).message}`);
      return;
    }

    switch (evt.event) {
      case "connected":
        console.log(`[twilio-bridge] connected: protocol=${String(evt.protocol)}`);
        break;

      case "start": {
        const s = evt as unknown as TwilioStartEvent;
        const fromNumber = String(s.start.customParameters?.From ?? "");
        const toNumber = String(s.start.customParameters?.To ?? "");
        const persona = pickPersona(toNumber);
        state = {
          callSid: s.start.callSid,
          streamSid: s.streamSid,
          fromNumber,
          toNumber,
          persona,
          startedAtMs: Date.now(),
          inboundFrames: 0,
          outboundFrames: 0,
          gemini: null,
          transcript: "",
          lastSpeaker: null,
          agentTranscriptRaw: "",
          userTranscriptRaw: "",
          closed: false,
          lastTranscriptMs: Date.now(),
          intakeSavedAtMs: null,
          hangupScheduled: false,
          watchdogHandle: null,
        };
        console.log(
          `[twilio-bridge] start callSid=${s.start.callSid} streamSid=${s.streamSid} from=${fromNumber} to=${toNumber} persona=${persona.key}`,
        );

        // Watchdog timer: enforces hard cap + idle timeout. Fires every few
        // seconds; ends the call if either limit is exceeded.
        state.watchdogHandle = setInterval(() => {
          if (!state || state.closed || state.hangupScheduled) return;
          const now = Date.now();
          const elapsed = now - state.startedAtMs;
          const sinceTranscript = now - state.lastTranscriptMs;

          if (elapsed > HARD_CAP_MS) {
            console.log(
              `[twilio-bridge] [${state.callSid}] hard cap reached (${Math.round(elapsed / 1000)}s) → ending`,
            );
            state.hangupScheduled = true;
            void endTwilioCall(state.callSid, "hard_cap_15min");
            return;
          }
          // Grace: give the first 30s before idle check (call setup + greeting)
          if (elapsed > 30_000 && sinceTranscript > IDLE_TIMEOUT_MS) {
            console.log(
              `[twilio-bridge] [${state.callSid}] idle timeout (${Math.round(sinceTranscript / 1000)}s no transcript activity) → ending`,
            );
            state.hangupScheduled = true;
            void endTwilioCall(state.callSid, "idle_45s");
            return;
          }
        }, HANGUP_CHECK_INTERVAL_MS);

        // Master CRM + calls row. Upsert the contact first (captures EVERY
        // caller by phone, incl. hang-ups) so we have the lead id to link, then
        // init the calls row. Both best-effort — never block the call.
        // Demo-line personas skip the master-CRM upsert so demo/test callers
        // never pollute the Hipp AI leads sheet; the calls row still logs.
        void (async () => {
          let leadId: string | undefined;
          try {
            if (persona.key === "hipp") {
              leadId =
                (await crmService.upsertContactOnCall(fromNumber, s.start.callSid)) ?? undefined;
            }
          } catch (err) {
            console.error(
              `[twilio-bridge] [${s.start.callSid}] CRM upsert failed: ${(err as Error).message}`,
            );
          }
          await callsService
            .initCall({
              id: s.start.callSid,
              fromNumber,
              startedAt: new Date().toISOString(),
              leadId,
            })
            .catch((err: Error) => {
              console.error(
                `[twilio-bridge] [${s.start.callSid}] initCall failed: ${err.message}`,
              );
            });
        })();

        // Open Gemini async — never let an unhandled rejection escape.
        attachGeminiSession(ws, state).catch((err: Error) => {
          console.error(
            `[twilio-bridge] [${state?.callSid ?? "<no-state>"}] attachGeminiSession threw: ${err.message}`,
          );
        });
        break;
      }

      case "media": {
        const m = evt as unknown as TwilioMediaEvent;
        if (!state || state.closed) return;
        state.inboundFrames++;
        if (state.gemini) {
          try {
            const pcm16kBase64 = mulaw8kBase64ToPcm16kBase64(m.media.payload);
            if (pcm16kBase64) state.gemini.sendAudio(pcm16kBase64);
          } catch (err) {
            console.error(
              `[twilio-bridge] [${state.callSid}] inbound audio convert/send failed: ${(err as Error).message}`,
            );
          }
        }
        if (state.inboundFrames % 250 === 0) {
          console.log(
            `[twilio-bridge] [${state.callSid}] heartbeat: inbound=${state.inboundFrames} outbound=${state.outboundFrames} transcript_len=${state.transcript.length}`,
          );
        }
        break;
      }

      case "mark":
        break;

      case "stop": {
        const s = evt as unknown as TwilioStopEvent;
        if (!state) return;
        const callSid = s.stop.callSid;
        const localState = state;
        localState.closed = true;
        if (localState.watchdogHandle) {
          clearInterval(localState.watchdogHandle);
          localState.watchdogHandle = null;
        }
        const durationMs = Date.now() - localState.startedAtMs;
        console.log(
          `[twilio-bridge] stop callSid=${callSid} duration=${durationMs}ms ` +
            `inbound=${localState.inboundFrames} outbound=${localState.outboundFrames} ` +
            `transcript_len=${localState.transcript.length}`,
        );

        try {
          localState.gemini?.close();
        } catch (err) {
          console.error(
            `[twilio-bridge] [${callSid}] error closing Gemini session: ${(err as Error).message}`,
          );
        }

        fireEndOfCall(localState);
        break;
      }

      default:
        console.log(`[twilio-bridge] unknown event: ${evt.event}`);
    }
  });

  ws.on("close", (code: number, reason: Buffer) => {
    console.log(
      `[twilio-bridge] WS closed callSid=${state?.callSid ?? "<no-start>"} code=${code} reason="${reason.toString()}"`,
    );
    if (state && !state.closed) {
      const localState = state;
      localState.closed = true;
      if (localState.watchdogHandle) {
        clearInterval(localState.watchdogHandle);
        localState.watchdogHandle = null;
      }
      try {
        localState.gemini?.close();
      } catch {
        // ignore
      }
      // If we got a transcript before the WS closed without a clean stop event,
      // still try to fire end-of-call so the lead doesn't fall through.
      if (localState.transcript.length > 50) {
        console.log(
          `[twilio-bridge] [${localState.callSid}] WS closed without stop event — firing end-of-call anyway`,
        );
        fireEndOfCall(localState);
      }
    }
  });

  ws.on("error", (err: Error) => {
    console.error(
      `[twilio-bridge] WS error callSid=${state?.callSid ?? "<no-start>"} ${err.message}`,
    );
  });
}

// ---------------------------------------------------------------------------
// Public: attach to existing HTTP server
// ---------------------------------------------------------------------------

export function attachTwilioMediaStreamWss(server: HttpServer): void {
  const wss = new WebSocketServer({ noServer: true });
  wss.on("connection", handleConnection);

  server.on("upgrade", (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    if (!req.url) {
      socket.destroy();
      return;
    }
    const path = new URL(req.url, "http://placeholder").pathname;
    if (path === "/twilio/media-stream") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  });

  console.log("[twilio-bridge] WSS attached to /twilio/media-stream (Gemini Live + real tools + end-of-call)");
}
