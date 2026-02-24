export function CtaSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Strong green glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(83,252,24,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Subtle top border */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(83,252,24,0.2), transparent)",
        }}
      />

      <div className="max-w-[1100px] mx-auto px-8 text-center">
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#53FC18]" />
          <span
            className="text-[#53FC18] text-[12px] font-medium uppercase tracking-[0.1em]"
            style={{ fontFamily: "var(--font-ibm-plex)" }}
          >
            Work With Us
          </span>
        </div>

        <h2
          className="text-[48px] md:text-[64px] font-bold tracking-[-0.04em] text-[#f7f8f8] leading-[1.05] mb-6"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          Ready to run
          <br />
          on autopilot?
        </h2>

        <p className="text-[#b4bcd0] text-[18px] leading-[1.7] max-w-[460px] mx-auto mb-10">
          Book a strategy call. We&apos;ll map where automation creates the most
          leverage in your business — and outline exactly how we&apos;d build
          it.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary CTA */}
          <a
            href="https://calendly.com/dillon-hippaihq/ai-automation-strategy-call"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#53FC18] text-[#000212] text-[15px] font-semibold px-7 py-4 rounded-[10px] shadow-[0_0_30px_rgba(83,252,24,0.25)] hover:scale-[1.04] active:scale-[0.97] transition-transform duration-200 ease-out no-underline"
          >
            Book a Strategy Call
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2.5 7h9M8.5 4l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* Secondary CTA — phone */}
          <a
            href="tel:+17177027833"
            className="inline-flex items-center gap-2.5 text-[15px] font-medium px-7 py-4 rounded-[10px] transition-colors duration-150 no-underline hover:border-[rgba(83,252,24,0.3)] hover:text-[#f7f8f8]"
            style={{
              color: "#b4bcd0",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M13.5 10.73v1.875A1.25 1.25 0 0 1 12.138 13.9a12.437 12.437 0 0 1-5.42-1.928 12.25 12.25 0 0 1-3.75-3.75A12.437 12.437 0 0 1 1.04 2.775 1.25 1.25 0 0 1 2.288 1.5H4.163a1.25 1.25 0 0 1 1.25 1.075c.079.625.225 1.24.438 1.832a1.25 1.25 0 0 1-.281 1.32L4.782 6.51a10 10 0 0 0 3.75 3.75l.788-.788a1.25 1.25 0 0 1 1.32-.281c.592.213 1.207.359 1.832.437A1.25 1.25 0 0 1 13.5 10.73Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            +1 (717) 702-7833
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 text-[13px] text-[#b4bcd066]">
          <span className="flex items-center gap-2">
            <span className="text-[#53FC18]">✓</span> Strategy-first approach
          </span>
          <span
            className="hidden sm:block w-1 h-1 rounded-full"
            style={{ background: "rgba(180,188,208,0.2)" }}
          />
          <span className="flex items-center gap-2">
            <span className="text-[#53FC18]">✓</span> Custom-built systems
          </span>
          <span
            className="hidden sm:block w-1 h-1 rounded-full"
            style={{ background: "rgba(180,188,208,0.2)" }}
          />
          <span className="flex items-center gap-2">
            <span className="text-[#53FC18]">✓</span> No templates. No shortcuts.
          </span>
        </div>
      </div>
    </section>
  );
}
