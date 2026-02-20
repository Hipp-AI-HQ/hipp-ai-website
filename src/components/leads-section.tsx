const features = [
  {
    label: "Instant response",
    description:
      "AI replies to new leads in under 60 seconds — day, night, weekends.",
  },
  {
    label: "Smart qualification",
    description:
      "Automatically asks the right questions to separate serious buyers from tire-kickers.",
  },
  {
    label: "Auto booking",
    description:
      "Qualified leads go straight to your calendar. No back-and-forth required.",
  },
  {
    label: "Automatic follow-up",
    description:
      "If a lead goes cold, AI follows up automatically — up to 5 touch points.",
  },
];

const leads = [
  {
    initials: "AM",
    name: "Alex Morrison",
    industry: "Real Estate · San Diego",
    status: "Qualified",
    time: "47s",
    statusColor: "rgba(255,193,7,0.15)",
    statusText: "#FFC107",
  },
  {
    initials: "MC",
    name: "Maria Chen",
    industry: "General Contractor · Austin",
    status: "Booked",
    time: "32s",
    statusColor: "rgba(83,252,24,0.12)",
    statusText: "#53FC18",
  },
  {
    initials: "JP",
    name: "Jordan Price",
    industry: "HVAC Services · Miami",
    status: "New",
    time: "12s",
    statusColor: "rgba(180,188,208,0.1)",
    statusText: "#b4bcd0",
  },
];

export function LeadsSection() {
  return (
    <section id="features" className="relative py-24 overflow-hidden border-b border-white/[0.05]">
      {/* Section glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(83,252,24,0.035) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1100px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Label */}
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#53FC18]" />
              <span
                className="text-[#53FC18] text-[12px] font-medium uppercase tracking-[0.1em]"
                style={{ fontFamily: "var(--font-ibm-plex)" }}
              >
                Lead Automation
              </span>
            </div>

            {/* Heading */}
            <h2
              className="text-[40px] font-bold tracking-[-0.03em] text-[#f7f8f8] leading-[1.15] mb-5"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Stop losing leads to
              <br />
              slow response times.
            </h2>

            {/* Body */}
            <p className="text-[#b4bcd0] text-[16px] leading-[1.7] mb-10 max-w-[440px]">
              Every lead that goes unanswered is revenue left on the table. Hipp
              AI responds in under 60 seconds — qualifying, following up, and
              booking appointments automatically.
            </p>

            {/* Feature items */}
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

          {/* Right: Mockup cards */}
          <div className="relative h-[420px]">
            {/* Main pipeline card */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#53FC18]" />
                  <span className="text-[#f7f8f8] text-[13px] font-medium">
                    Lead Pipeline
                  </span>
                </div>
                <span
                  className="text-[11px] px-2 py-1 rounded-full"
                  style={{
                    background: "rgba(83,252,24,0.1)",
                    color: "#53FC18",
                  }}
                >
                  3 active
                </span>
              </div>

              {/* Lead rows */}
              <div className="px-5 pt-2 pb-4 space-y-1">
                {leads.map((lead) => (
                  <div
                    key={lead.name}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-150"
                    style={{ cursor: "default" }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[12px] font-bold"
                      style={{
                        background: "rgba(83,252,24,0.1)",
                        color: "#53FC18",
                        fontFamily: "var(--font-sora)",
                      }}
                    >
                      {lead.initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[#f7f8f8] text-[14px] font-medium leading-tight">
                        {lead.name}
                      </div>
                      <div className="text-[#b4bcd0] text-[12px] mt-0.5 truncate">
                        {lead.industry}
                      </div>
                    </div>

                    {/* Status + time */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: lead.statusColor,
                          color: lead.statusText,
                        }}
                      >
                        {lead.status}
                      </span>
                      <span className="text-[11px] text-[#b4bcd066]">
                        {lead.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card footer */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-[#b4bcd066] text-[12px]">
                  AI responded to 3 leads
                </span>
                <span className="text-[#53FC18] text-[12px] font-medium">
                  avg 30s
                </span>
              </div>
            </div>

            {/* Floating AI message card */}
            <div
              className="absolute -bottom-5 -right-4 w-[220px] rounded-xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
              style={{
                background: "rgba(20,22,28,0.98)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-[#f7f8f8] text-[12px] font-medium">
                  AI Response
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: "rgba(83,252,24,0.8)" }}
                >
                  ✓ Sent
                </span>
              </div>
              <div className="px-4 py-3">
                <p className="text-[#b4bcd0] text-[12px] leading-[1.6]">
                  Hi Alex! Thanks for reaching out. I&apos;d love to connect
                  you with our team — when are you free for a quick call?
                </p>
                <div className="mt-2 text-[11px] text-[#b4bcd066]">
                  Just now · 47s after inquiry
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
