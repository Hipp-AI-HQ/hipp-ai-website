const features = [
  {
    label: "CRM sync",
    description:
      "All lead data, conversations, and bookings sync automatically to your CRM.",
  },
  {
    label: "Calendar integration",
    description:
      "Connects directly to Google Calendar, Calendly, or Acuity — no double booking.",
  },
  {
    label: "Ad platform connections",
    description:
      "Pulls leads directly from Facebook Ads, Google Ads, and TikTok in real time.",
  },
  {
    label: "Communication channels",
    description:
      "Runs over email, SMS, and direct message — wherever your leads are.",
  },
];

const integrations = [
  { name: "GoHighLevel", active: true },
  { name: "HubSpot", active: true },
  { name: "Salesforce", active: false },
  { name: "Calendly", active: true },
  { name: "Google Ads", active: true },
  { name: "Facebook Ads", active: true },
  { name: "Twilio", active: false },
  { name: "SendGrid", active: true },
  { name: "Zapier", active: true },
  { name: "Make", active: false },
  { name: "Google Calendar", active: true },
  { name: "Acuity", active: false },
  { name: "Slack", active: true },
  { name: "TikTok Ads", active: false },
  { name: "Mailchimp", active: false },
];

export function IntegrationsSection() {
  return (
    <section className="relative py-24 overflow-hidden border-b border-white/[0.05]">
      {/* Section glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(83,252,24,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1100px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#53FC18]" />
              <span
                className="text-[#53FC18] text-[12px] font-medium uppercase tracking-[0.1em]"
                style={{ fontFamily: "var(--font-ibm-plex)" }}
              >
                Integrations
              </span>
            </div>

            <h2
              className="text-[40px] font-bold tracking-[-0.03em] text-[#f7f8f8] leading-[1.15] mb-5"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Plugs into the tools
              <br />
              you already use.
            </h2>

            <p className="text-[#b4bcd0] text-[16px] leading-[1.7] mb-10 max-w-[440px]">
              We connect to your existing CRM, calendar, ad platforms, and
              communication stack. No ripping and replacing. No new logins to
              manage. Just results.
            </p>

            <div className="space-y-6">
              {features.map((f) => (
                <div key={f.label} className="flex gap-4">
                  <div className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#53FC18] flex-shrink-0" />
                  <div>
                    <div className="text-[#f7f8f8] text-[15px] font-medium mb-1">
                      {f.label}
                    </div>
                    <div className="text-[#b4bcd0] text-[14px] leading-[1.65]">
                      {f.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Integration grid card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="flex items-center justify-between mb-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-[#f7f8f8] text-[13px] font-medium pb-4">
                Connected integrations
              </span>
              <span
                className="text-[11px] px-2 py-1 rounded-full mb-4"
                style={{
                  background: "rgba(83,252,24,0.1)",
                  color: "#53FC18",
                }}
              >
                {integrations.filter((i) => i.active).length} active
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-colors duration-150"
                  style={{
                    background: integration.active
                      ? "rgba(83,252,24,0.08)"
                      : "rgba(255,255,255,0.04)",
                    border: integration.active
                      ? "1px solid rgba(83,252,24,0.2)"
                      : "1px solid rgba(255,255,255,0.06)",
                    color: integration.active ? "#f7f8f8" : "#b4bcd066",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      background: integration.active
                        ? "#53FC18"
                        : "rgba(180,188,208,0.3)",
                    }}
                  />
                  {integration.name}
                </div>
              ))}
            </div>

            <div
              className="mt-5 pt-4 text-[12px] text-[#b4bcd066]"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              + Zapier means 1,000+ more apps available
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
