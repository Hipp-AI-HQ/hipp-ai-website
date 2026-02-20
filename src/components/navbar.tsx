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
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Pricing", href: "#pricing" },
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

        {/* CTA */}
        <a
          href="https://calendly.com/dillon-hippaihq/ai-automation-strategy-call"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 bg-[#53FC18] text-[#000212] text-[14px] font-semibold px-5 py-[10px] rounded-[8px] shadow-[0_0_20px_rgba(83,252,24,0.2)] hover:scale-[1.04] active:scale-[0.97] transition-transform duration-200 ease-out no-underline"
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
    </header>
  );
}
