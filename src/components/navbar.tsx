export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-[72px] border-b border-white/[0.08] bg-[#000212]/80 backdrop-blur-[20px]">
      <div className="max-w-[1100px] mx-auto px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-7 h-7 rounded-[7px] bg-[#53FC18] flex items-center justify-center shadow-[0_0_14px_rgba(83,252,24,0.45)]">
            <span
              className="text-[#000212] font-extrabold text-[11px]"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              H
            </span>
          </div>
          <span
            className="text-[#f7f8f8] font-semibold text-[15px] tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Hipp AI
          </span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Lead System", href: "#features" },
            { label: "Intelligence", href: "#how-it-works" },
            { label: "Implementation", href: "#pricing" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[14px] text-[#b4bcd0] hover:text-[#f7f8f8] transition-colors duration-150 no-underline"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Mobile: phone icon only */}
        <a
          href="tel:+17177027833"
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-[8px] text-[#b4bcd0] hover:text-[#f7f8f8] transition-colors duration-150"
          style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
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
        </a>

        {/* Right side: phone + CTA */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href="tel:+17177027833"
            className="flex items-center gap-2 text-[14px] text-[#b4bcd0] hover:text-[#f7f8f8] transition-colors duration-150 no-underline"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M12.5 9.98v1.75a1.17 1.17 0 0 1-1.275 1.167A11.57 11.57 0 0 1 6.178 11.2a11.4 11.4 0 0 1-3.5-3.5A11.57 11.57 0 0 1 .982 2.625 1.167 1.167 0 0 1 2.144 1.5H3.9a1.167 1.167 0 0 1 1.167 1.004c.073.583.21 1.156.408 1.708a1.167 1.167 0 0 1-.263 1.232L4.48 6.177a9.333 9.333 0 0 0 3.5 3.5l.733-.733a1.167 1.167 0 0 1 1.233-.263c.552.198 1.125.335 1.708.408A1.167 1.167 0 0 1 12.5 9.98Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            (717) 702-7833
          </a>

          <a
            href="https://calendly.com/dillon-hippaihq/ai-automation-strategy-call"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#53FC18] text-[#000212] text-[14px] font-semibold px-5 py-[10px] rounded-[8px] shadow-[0_0_20px_rgba(83,252,24,0.2)] hover:scale-[1.04] active:scale-[0.97] transition-transform duration-200 ease-out no-underline"
          >
            Book a Call
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6h8M7 3l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
