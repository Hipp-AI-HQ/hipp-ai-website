/**
 * Outbound push of demo-line leads to an external CRM via webhook.
 *
 * The server stays CRM-agnostic on purpose: it POSTs the lead JSON to
 * DEMO_LINE_WEBHOOK_URL (an n8n Webhook node), and the n8n workflow owns the
 * CRM specifics (today: GorillaDesk POST /v1/customers + a call-summary
 * note). Re-pointing a demo at a prospect's real account = swap the n8n
 * credential/field map. No server redeploy.
 *
 * Same shape as slack.ts: env-gated, warn-and-skip when unset. The caller
 * (pest_lead_save in the bridge) catches failures and still returns success
 * to Gemini — a webhook outage must never stall the voice UX mid-demo; the
 * always-fire Telegram/email notification still carries the transcript.
 */
import axios from "axios";

export const outboundCrm = {
  async pushDemoLead(payload: Record<string, unknown>): Promise<boolean> {
    const url = process.env.DEMO_LINE_WEBHOOK_URL;
    if (!url) {
      console.warn("[outbound-crm] DEMO_LINE_WEBHOOK_URL not set — skipping lead push");
      return false;
    }
    await axios.post(url, payload, {
      headers: { "X-Webhook-Token": process.env.DEMO_LINE_WEBHOOK_TOKEN ?? "" },
      timeout: 5000,
    });
    return true;
  },
};
