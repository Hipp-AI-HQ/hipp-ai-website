/**
 * Outbound push of demo-line leads to an external CRM.
 *
 * Dispatcher with two targets, in priority order:
 *   1. DEMO_LINE_WEBHOOK_URL set → POST the lead JSON there (middleware owns
 *      CRM specifics; this was the n8n path before the n8n cloud workspace
 *      was canceled — kept so a middleware revival needs zero code changes)
 *   2. GORILLADESK_API_KEY set   → direct GorillaDesk REST (customer + note)
 *   3. neither                   → warn-and-skip (demo persona still works;
 *      the always-fire Telegram/email notification carries the transcript)
 *
 * The caller (pest_lead_save in the bridge) catches failures and still
 * returns success to Gemini — a CRM outage must never stall the voice UX
 * mid-demo.
 */
import axios from "axios";
import { gorillaDesk, type DemoLeadPayload } from "./gorillaDesk";

export const outboundCrm = {
  async pushDemoLead(payload: DemoLeadPayload): Promise<boolean> {
    const url = process.env.DEMO_LINE_WEBHOOK_URL;
    if (url) {
      await axios.post(url, payload, {
        headers: { "X-Webhook-Token": process.env.DEMO_LINE_WEBHOOK_TOKEN ?? "" },
        timeout: 5000,
      });
      return true;
    }

    if (gorillaDesk.enabled()) {
      const customerId = await gorillaDesk.createLeadFromDemoCall(payload);
      return customerId !== null;
    }

    console.warn(
      "[outbound-crm] no CRM target configured (DEMO_LINE_WEBHOOK_URL / GORILLADESK_API_KEY both unset) — skipping lead push",
    );
    return false;
  },
};
