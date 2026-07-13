/**
 * GorillaDesk REST integration for demo-line leads.
 *
 * Direct integration (no middleware): the planned n8n middle layer died with
 * the hippai.app.n8n.cloud workspace (canceled with the cold-email stack,
 * 2026-04). outboundCrm.ts still prefers a webhook when DEMO_LINE_WEBHOOK_URL
 * is set, so a future middleware swap needs zero code changes here.
 *
 * API facts (verified against https://api.gorilladesk.com/v1/specs 2026-07-13):
 *   - Bearer auth; per-company API keys generated on GorillaDesk's Addons page
 *   - POST /customers        → { data: { id } }; requires first_name + location
 *     (location requires address_line_1/city/state/zip KEYS — empty strings ok
 *     until proven otherwise against the trial account)
 *   - POST /customers/{id}/notes → multipart/form-data, `content` required
 *   - phones[] items require { phone, type } where type is an ACCOUNT-SPECIFIC
 *     phone-type id from GET /phone-types — fetched once and cached; phones are
 *     omitted entirely if the lookup fails (the number still lands in the note)
 *
 * Env: GORILLADESK_API_KEY (Dillon pastes into Railway — never handled here in
 * code or logs). Unset = integration inert.
 */
import axios from "axios";

const BASE = "https://api.gorilladesk.com/v1";
const TIMEOUT_MS = 6000;

export interface DemoLeadPayload {
  source: string;
  persona: string;
  call_sid: string;
  caller_name: string;
  callback_phone: string;
  address: string;
  pest_type: string;
  property_type: string;
  preferred_window: string;
  notes: string;
  received_at: string;
}

let cachedPhoneTypeId: string | null | undefined; // undefined = not looked up yet

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${process.env.GORILLADESK_API_KEY}` };
}

async function lookupPhoneTypeId(): Promise<string | null> {
  if (cachedPhoneTypeId !== undefined) return cachedPhoneTypeId;
  try {
    const res = await axios.get(`${BASE}/phone-types`, {
      headers: authHeaders(),
      timeout: TIMEOUT_MS,
    });
    const list = (res.data?.data ?? res.data ?? []) as Array<{ id?: string }>;
    cachedPhoneTypeId = Array.isArray(list) && list[0]?.id ? String(list[0].id) : null;
  } catch (err) {
    console.warn(`[gorilladesk] phone-types lookup failed (phones will be omitted): ${(err as Error).message}`);
    cachedPhoneTypeId = null;
  }
  return cachedPhoneTypeId;
}

function buildNoteContent(p: DemoLeadPayload): string {
  const lines = [
    "New lead captured by the AI receptionist (nobody typed this in).",
    "",
    `Caller: ${p.caller_name || "(not given)"}`,
    `Callback: ${p.callback_phone || "(not given)"}`,
    `Pest issue: ${p.pest_type || "(not given)"}`,
    `Property: ${p.property_type || "(not given)"}`,
    `Address: ${p.address || "(not given)"}`,
    `Preferred window: ${p.preferred_window || "(not given)"}`,
  ];
  if (p.notes) lines.push(`Notes: ${p.notes}`);
  lines.push("", `Captured ${p.received_at} · call ${p.call_sid}`);
  return lines.join("\n");
}

export const gorillaDesk = {
  enabled(): boolean {
    return !!process.env.GORILLADESK_API_KEY;
  },

  /**
   * Create a customer from a demo-line call, then attach the full call
   * summary as a note. Returns the new customer id, or null when disabled.
   * Throws on hard API failure (caller decides how loud to be).
   */
  async createLeadFromDemoCall(p: DemoLeadPayload): Promise<string | null> {
    if (!this.enabled()) return null;

    const nameParts = p.caller_name.trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] ?? "Unknown";
    const lastName = nameParts.slice(1).join(" ");

    const phoneTypeId = p.callback_phone ? await lookupPhoneTypeId() : null;

    const customer: Record<string, unknown> = {
      first_name: firstName,
      ...(lastName ? { last_name: lastName } : {}),
      ...(phoneTypeId && p.callback_phone
        ? { phones: [{ phone: p.callback_phone, type: phoneTypeId }] }
        : {}),
      location: {
        name: p.property_type.toLowerCase() === "business" ? "Business" : "Home",
        address_line_1: p.address || "(address not captured on call)",
        city: "",
        state: "",
        zip: "",
      },
    };

    const createRes = await axios.post(`${BASE}/customers`, customer, {
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      timeout: TIMEOUT_MS,
    });
    const customerId = String(createRes.data?.data?.id ?? "");
    if (!customerId) {
      throw new Error(`create customer returned no id (body: ${JSON.stringify(createRes.data).slice(0, 200)})`);
    }
    console.log(`[gorilladesk] customer created id=${customerId} (${firstName}${lastName ? " " + lastName : ""})`);

    // Note carries EVERYTHING verbatim — even if structured fields above are
    // thin, no call detail is lost. Best-effort: a note failure shouldn't
    // undo the fact the customer landed.
    try {
      // Native (Node 18+) FormData — axios sets the multipart boundary itself.
      const form = new FormData();
      form.append("content", buildNoteContent(p));
      await axios.post(`${BASE}/customers/${customerId}/notes`, form, {
        headers: authHeaders(),
        timeout: TIMEOUT_MS,
      });
      console.log(`[gorilladesk] call-summary note attached to customer ${customerId}`);
    } catch (err) {
      console.error(`[gorilladesk] note attach failed (customer ${customerId} still created): ${(err as Error).message}`);
    }

    return customerId;
  },
};
