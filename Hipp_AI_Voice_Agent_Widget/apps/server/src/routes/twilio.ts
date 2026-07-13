/**
 * Twilio-facing routes for the Voice + Media Streams flow that powers the
 * AI demo intake line.
 *
 *   POST /twilio/incoming     → returns TwiML that opens a Media Streams
 *                               WebSocket on /twilio/media-stream
 *   WSS  /twilio/media-stream → handled by attachTwilioMediaStreamWss()
 *                               in services/twilioMediaStreamBridge.ts
 */
import { Router, type Request, type Response } from "express";
import { crmService } from "../services/crmService";

export const twilioRouter = Router();

// Words that mean "stop texting me" (TCPA opt-out). Carriers also auto-handle
// these, but we record the opt-out in the CRM so future sends skip the contact.
const SMS_STOP_WORDS = new Set([
  "stop",
  "stopall",
  "unsubscribe",
  "cancel",
  "end",
  "quit",
  "optout",
]);

function publicWssUrl(req: Request): string {
  // Prefer the explicit override (set in Railway env once we know the
  // public host), otherwise derive from the incoming request's host header.
  const override = process.env.PUBLIC_WSS_URL;
  if (override) return override;
  const host = req.get("host") ?? "hipp-ai-voice-server-production.up.railway.app";
  return `wss://${host}/twilio/media-stream`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

twilioRouter.post("/incoming", (req: Request, res: Response) => {
  const wss = publicWssUrl(req);
  const body = (req.body ?? {}) as Record<string, unknown>;
  // Twilio POSTs form-encoded fields including CallSid, From, To, AccountSid.
  // The Media Streams `start` event natively includes callSid but NOT From/To,
  // so we pass both through as Stream <Parameter>s the bridge can read. `To`
  // (the number the caller dialed) is what routes persona selection — the
  // rotating demo line vs the live Hipp AI line share this server.
  const from = typeof body.From === "string" ? body.From : "";
  const to = typeof body.To === "string" ? body.To : "";
  const callSid = typeof body.CallSid === "string" ? body.CallSid : "";
  console.log(`[twilio] /incoming callSid=${callSid} from=${from} to=${to} → TwiML to ${wss}`);

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wss}">
      <Parameter name="From" value="${escapeXml(from)}"/>
      <Parameter name="To" value="${escapeXml(to)}"/>
      <Parameter name="CallSid" value="${escapeXml(callSid)}"/>
    </Stream>
  </Connect>
</Response>`;
  res.type("text/xml").status(200).send(twiml);
});

// Health check that confirms the route is mounted even without a real call.
twilioRouter.get("/health", (req: Request, res: Response) => {
  res.json({
    ok: true,
    incoming: `${req.protocol}://${req.get("host")}/twilio/incoming`,
    mediaStream: publicWssUrl(req),
  });
});

// Vapi failover endpoint. Set as Twilio +1 (888) `VoiceFallbackUrl` — Twilio
// hits this if /twilio/incoming returns 4xx/5xx or times out (~15s). Returns
// TwiML that dials the Vapi-managed line on +1 (717), so callers reach the
// proven Vapi assistant when our Gemini bridge fails open.
//
// Known limit: if the whole Railway service is unreachable (yesterday's
// outage), this endpoint is ALSO down, so the failover doesn't fire. For
// that case, manual rollback via Twilio REST API to flip VoiceUrl is the
// procedure (one curl, ~30 sec).
twilioRouter.post("/fallback-vapi", (_req: Request, res: Response) => {
  console.log("[twilio] /fallback-vapi → dialing Vapi line +1 (717) 702-7833");
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>
    <Number>+17177027833</Number>
  </Dial>
</Response>`;
  res.type("text/xml").status(200).send(twiml);
});

// Allow GET too for easy verification with curl
twilioRouter.get("/fallback-vapi", (_req: Request, res: Response) => {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>
    <Number>+17177027833</Number>
  </Dial>
</Response>`;
  res.type("text/xml").status(200).send(twiml);
});

// Inbound SMS webhook. Set this as the Messaging webhook on the 888 number in
// the Twilio console. Two jobs:
//   1. STOP / UNSUBSCRIBE / etc.  → mark the CRM contact opted-out (compliance).
//   2. A short handle-like reply  → store it as the caller's social handle
//      (a typed reply is far more accurate than a voice-transcribed @).
// Anything else is just acknowledged. Best-effort; always returns 200 TwiML.
twilioRouter.post("/sms-incoming", async (req: Request, res: Response) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const from = typeof body.From === "string" ? body.From : "";
  const text = (typeof body.Body === "string" ? body.Body : "").trim();
  const lower = text.toLowerCase();
  console.log(`[twilio] /sms-incoming from=${from} body="${text.slice(0, 80)}"`);

  let reply = "";
  try {
    if (from && SMS_STOP_WORDS.has(lower)) {
      await crmService.recordSmsReply(from, { optedOut: true });
      // (Twilio's carrier layer also auto-confirms STOP — no app reply needed.)
    } else if (from && text) {
      // Capture the reply as their social handle. Prefer a clean @handle found
      // anywhere in the message; otherwise store the whole reply verbatim (capped)
      // so a conversational answer like "At Hipp AI on Instagram?" isn't lost.
      const atMatch = text.match(/@[A-Za-z0-9._]{2,30}/);
      const handle = atMatch ? atMatch[0] : text.slice(0, 80);
      await crmService.recordSmsReply(from, { handle });
      reply = "Got it, thanks! Dillon will reach out there.";
    }
  } catch (err) {
    console.error(`[twilio] /sms-incoming handler failed: ${(err as Error).message}`);
  }

  const twiml = reply
    ? `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Message>${escapeXml(reply)}</Message>\n</Response>`
    : `<?xml version="1.0" encoding="UTF-8"?>\n<Response></Response>`;
  res.type("text/xml").status(200).send(twiml);
});
