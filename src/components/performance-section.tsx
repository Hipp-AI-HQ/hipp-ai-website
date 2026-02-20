const metrics = [
  {
    value: "01",
    unit: "",
    label: "Audit & mapping",
    description:
      "We analyze your current workflow infrastructure, document manual bottlenecks, and define the full system architecture before any build begins.",
  },
  {
    value: "02",
    unit: "",
    label: "System architecture & build",
    description:
      "Every automation layer is custom-designed to your stack — from API connections and webhook routing to CRM logic, sequencing rules, and qualification criteria.",
  },
  {
    value: "03",
    unit: "",
    label: "Testing, deployment & optimization",
    description:
      "Systems are validated against live scenarios before deployment. Post-launch, we monitor workflow performance and refine continuously.",
  },
];

const smallStats = [
  { value: "Audit", label: "Workflow analysis" },
  { value: "Architect", label: "System design" },
  { value: "Deploy", label: "Validated rollout" },
  { value: "Optimize", label: "Continuous refinement" },
];

export function PerformanceSection() {
  return (
    <section id="pricing" className="relative py-24 overflow-hidden border-b border-white/[0.05]">
      {/* Section glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 20%, rgba(83,252,24,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1100px] mx-auto px-8">
        {/* Centered heading */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#53FC18]" />
            <span
              className="text-[#53FC18] text-[12px] font-medium uppercase tracking-[0.1em]"
              style={{ fontFamily: "var(--font-ibm-plex)" }}
            >
              Implementation
            </span>
          </div>
          <h2
            className="text-[40px] md:text-[48px] font-bold tracking-[-0.03em] text-[#f7f8f8] leading-[1.1] mb-5"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            How we build
            <br />
            your system.
          </h2>
          <p className="text-[#b4bcd0] text-[16px] leading-[1.7] max-w-[460px] mx-auto">
            Every engagement follows a structured implementation framework —
            from audit through deployment. No shortcuts, no templates,
            no guesswork.
          </p>
        </div>

        {/* 3-col metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl p-7 group transition-colors duration-200"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Big number */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-[52px] font-bold tracking-[-0.04em] text-[#53FC18] leading-none"
                    style={{ fontFamily: "var(--font-sora)" }}
                  >
                    {m.value}
                  </span>
                  <span
                    className="text-[18px] font-medium text-[#53FC18] opacity-70"
                    style={{ fontFamily: "var(--font-sora)" }}
                  >
                    {m.unit}
                  </span>
                </div>
              </div>

              <div
                className="text-[#f7f8f8] text-[15px] font-medium mb-2"
              >
                {m.label}
              </div>
              <div className="text-[#b4bcd0] text-[14px] leading-[1.65]">
                {m.description}
              </div>
            </div>
          ))}
        </div>

        {/* Small stats row */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {smallStats.map((s, i) => (
            <div
              key={s.label}
              className="px-6 py-5 text-center"
              style={{
                borderRight:
                  i < smallStats.length - 1
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "none",
              }}
            >
              <div
                className="text-[24px] font-bold tracking-[-0.02em] text-[#f7f8f8] mb-1"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {s.value}
              </div>
              <div className="text-[#b4bcd066] text-[12px]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
