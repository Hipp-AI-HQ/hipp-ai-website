/**
 * Push one sample demo-line lead through the real outboundCrm path.
 *
 * Run with the Railway service env (so GORILLADESK_API_KEY is present
 * without ever living on this machine):
 *
 *   cd apps/server && railway run npx tsx src/scripts/test-gorilladesk-push.ts
 *
 * Or locally after adding GORILLADESK_API_KEY to apps/server/.env:
 *
 *   npx dotenv -e .env -- tsx src/scripts/test-gorilladesk-push.ts
 *
 * Expected: "[gorilladesk] customer created id=..." then the note attach log,
 * and a "Sample Caller" customer visible in the GorillaDesk Customers screen.
 */
import { outboundCrm } from "../integrations/outboundCrm";

async function main() {
  const ok = await outboundCrm.pushDemoLead({
    source: "demo-line",
    persona: "pest",
    call_sid: "CAtest-gorilladesk-push",
    caller_name: "Sample Caller",
    callback_phone: "+12545550123",
    address: "123 Test Lane, Lorena, TX",
    pest_type: "ants in the kitchen",
    property_type: "home",
    preferred_window: "weekday mornings",
    notes: "Test push from test-gorilladesk-push.ts — safe to delete this customer.",
    received_at: new Date().toISOString(),
  });
  console.log(`[test-gorilladesk-push] pushed=${ok}`);
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error("[test-gorilladesk-push] FAILED:", (err as Error).message);
  process.exit(1);
});
