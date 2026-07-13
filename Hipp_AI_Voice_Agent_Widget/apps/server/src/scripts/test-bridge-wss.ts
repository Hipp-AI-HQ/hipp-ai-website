/**
 * Test the deployed Twilio bridge WSS endpoint by simulating a Twilio
 * Media Streams client. Reveals whether the upgrade fails (Railway proxy /
 * path mismatch), whether Gemini connects, and whether we send audio back.
 */
import WebSocket from "ws";

const URL = process.env.TEST_WSS_URL ?? "wss://hipp-ai-voice-server-production.up.railway.app/twilio/media-stream";

async function main() {
  console.log(`[test-bridge] Connecting to ${URL}...`);
  const ws = new WebSocket(URL, {
    headers: { "User-Agent": "TwilioProxy/1.1" },
  });

  let msgCount = 0;
  let totalOutboundBytes = 0;

  ws.on("open", () => {
    console.log("[test-bridge] WS open. Sending Twilio handshake events...");
    ws.send(JSON.stringify({ event: "connected", protocol: "Call", version: "1.0.0" }));
    ws.send(
      JSON.stringify({
        event: "start",
        streamSid: "MZtest123",
        start: {
          streamSid: "MZtest123",
          accountSid: "ACtest",
          callSid: "CAtestdebug",
          tracks: ["inbound"],
          mediaFormat: { encoding: "audio/x-mulaw", sampleRate: 8000, channels: 1 },
          customParameters: {
            From: "+17175551234",
            // Set TEST_TO_NUMBER to exercise persona routing (e.g. the demo
            // line number → pest persona). Omitted = default Hipp persona.
            ...(process.env.TEST_TO_NUMBER ? { To: process.env.TEST_TO_NUMBER } : {}),
          },
        },
      }),
    );
    const silentMulaw = Buffer.alloc(160, 0xff).toString("base64");
    let i = 0;
    const interval = setInterval(() => {
      ws.send(
        JSON.stringify({
          event: "media",
          streamSid: "MZtest123",
          media: { track: "inbound", chunk: String(i), timestamp: String(i * 20), payload: silentMulaw },
        }),
      );
      i++;
      if (i > 50) clearInterval(interval);
    }, 20);

    setTimeout(() => {
      console.log("[test-bridge] Closing after 12s...");
      ws.send(
        JSON.stringify({
          event: "stop",
          streamSid: "MZtest123",
          stop: { accountSid: "ACtest", callSid: "CAtestdebug" },
        }),
      );
      setTimeout(() => ws.close(), 500);
    }, 12_000);
  });

  ws.on("message", (data) => {
    msgCount++;
    const text = data.toString("utf8");
    try {
      const parsed = JSON.parse(text);
      if (parsed.event === "media") {
        totalOutboundBytes += Buffer.from(parsed.media?.payload ?? "", "base64").byteLength;
      } else {
        console.log(`[recv #${msgCount}] event=${parsed.event} ${text.slice(0, 120)}`);
      }
    } catch {
      console.log(`[recv #${msgCount}] raw: ${text.slice(0, 200)}`);
    }
  });

  ws.on("close", (code: number, reason: Buffer) => {
    console.log(`[test-bridge] WS closed: code=${code} reason="${reason.toString()}"`);
    console.log(`[test-bridge] Total messages received: ${msgCount}, outbound audio bytes: ${totalOutboundBytes}`);
    process.exit(0);
  });

  ws.on("error", (err) => {
    console.error(`[test-bridge] WS error: ${err.message}`);
    process.exit(1);
  });

  ws.on("unexpected-response", (_req, res) => {
    console.error(`[test-bridge] Unexpected HTTP response: ${res.statusCode} ${res.statusMessage}`);
    let body = "";
    res.on("data", (chunk) => (body += chunk.toString()));
    res.on("end", () => {
      console.error(`[test-bridge] Body: ${body.slice(0, 500)}`);
      process.exit(1);
    });
  });
}

main().catch((err) => {
  console.error("[test-bridge] Failed:", err);
  process.exit(1);
});
