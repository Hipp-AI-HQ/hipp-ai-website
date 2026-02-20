const weeklyData = [
  { day: "Mon", leads: 12, height: 55 },
  { day: "Tue", leads: 18, height: 80 },
  { day: "Wed", leads: 15, height: 68 },
  { day: "Thu", leads: 23, height: 100 },
  { day: "Fri", leads: 19, height: 85 },
  { day: "Sat", leads: 9, height: 40 },
  { day: "Sun", leads: 6, height: 27 },
];

const funnel = [
  { stage: "Leads contacted", pct: 100 },
  { stage: "Qualified", pct: 68 },
  { stage: "Appointments set", pct: 42 },
  { stage: "Closed", pct: 31 },
];

const stats = [
  { value: "<60s", label: "Avg AI response" },
  { value: "47%", label: "Conversion lift" },
  { value: "8hrs", label: "Saved per rep/week" },
  { value: "99.9%", label: "Follow-up rate" },
];

export function AnalyticsSection() {
  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden border-b border-white/[0.05]">
      {/* Section glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 10%, rgba(83,252,24,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1100px] mx-auto px-8">
        {/* Centered heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#53FC18]" />
            <span
              className="text-[#53FC18] text-[12px] font-medium uppercase tracking-[0.1em]"
              style={{ fontFamily: "var(--font-ibm-plex)" }}
            >
              Analytics
            </span>
          </div>
          <h2
            className="text-[40px] md:text-[48px] font-bold tracking-[-0.03em] text-[#f7f8f8] leading-[1.1] mb-5"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Your pipeline,
            <br />
            always visible.
          </h2>
          <p className="text-[#b4bcd0] text-[16px] leading-[1.7] max-w-[480px] mx-auto">
            Know exactly what&apos;s working, what&apos;s converting, and where
            revenue is coming from — in real time.
          </p>
        </div>

        {/* Two-col chart grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Bar chart card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[#f7f8f8] text-[14px] font-medium">
                  Weekly Leads
                </div>
                <div className="text-[#b4bcd066] text-[12px] mt-0.5">
                  This week · 102 total
                </div>
              </div>
              <div
                className="text-[12px] px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(83,252,24,0.1)",
                  color: "#53FC18",
                }}
              >
                ↑ 23% vs last week
              </div>
            </div>

            {/* Bars */}
            <div className="flex items-end gap-2 h-[120px]">
              {weeklyData.map((d) => (
                <div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex items-end" style={{ height: 96 }}>
                    <div
                      className="w-full rounded-t-md transition-opacity duration-200"
                      style={{
                        height: `${d.height}%`,
                        background:
                          d.day === "Thu"
                            ? "linear-gradient(to top, #3AD40E, #53FC18)"
                            : "linear-gradient(to top, rgba(83,252,24,0.25), rgba(83,252,24,0.45))",
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-[#b4bcd066]">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Funnel card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="mb-6">
              <div className="text-[#f7f8f8] text-[14px] font-medium">
                Conversion Funnel
              </div>
              <div className="text-[#b4bcd066] text-[12px] mt-0.5">
                Last 30 days
              </div>
            </div>

            <div className="space-y-4">
              {funnel.map((f) => (
                <div key={f.stage}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#b4bcd0] text-[13px]">
                      {f.stage}
                    </span>
                    <span className="text-[#f7f8f8] text-[13px] font-medium">
                      {f.pct}%
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${f.pct}%`,
                        background:
                          f.pct === 100
                            ? "#53FC18"
                            : `rgba(83,252,24,${0.3 + (f.pct / 100) * 0.7})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-6 pt-4 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-[#b4bcd066] text-[12px]">
                Industry avg close rate
              </span>
              <span className="text-[#b4bcd0] text-[12px]">~18%</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-5 text-center"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="text-[32px] font-bold tracking-[-0.03em] text-[#53FC18] mb-1"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {s.value}
              </div>
              <div className="text-[#b4bcd0] text-[13px]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
