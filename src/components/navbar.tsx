import { CALENDLY_URL, PHONE_TEL } from "@/lib/site";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-white/[0.07] bg-black/80 backdrop-blur-[20px]">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        {/* Wordmark */}
        <a href="/" className="font-display text-[15px] tracking-[0.08em] text-white no-underline">
          HIPP<span className="text-[#00D4FF]">AI</span>
        </a>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { label: "How it works", href: "/#how-it-works" },
            { label: "Proof", href: "/#proof" },
            { label: "Pricing", href: "/#pricing" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[14px] text-white/55 no-underline transition-colors duration-150 hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Mobile: phone icon only */}
        <a
          href={PHONE_TEL}
          aria-label="Call the AI receptionist"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/55 transition-colors duration-150 hover:text-[#00D4FF] md:hidden"
        >
          <PhoneIcon />
        </a>

        {/* Right side: phone + CTA */}
        <div className="hidden items-center gap-5 md:flex">
          <a
            href={PHONE_TEL}
            className="flex items-center gap-2 text-[14px] text-white/55 no-underline transition-colors duration-150 hover:text-[#00D4FF]"
          >
            <PhoneIcon />
            (888) 861-5661
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display inline-flex items-center rounded-full bg-[#00D4FF] px-5 py-2.5 text-[12px] tracking-wide text-black no-underline transition-transform duration-200 ease-out hover:scale-[1.04] active:scale-[0.97]"
          >
            Free AI Assessment
          </a>
        </div>
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M12.5 9.98v1.75a1.17 1.17 0 0 1-1.275 1.167A11.57 11.57 0 0 1 6.178 11.2a11.4 11.4 0 0 1-3.5-3.5A11.57 11.57 0 0 1 .982 2.625 1.167 1.167 0 0 1 2.144 1.5H3.9a1.167 1.167 0 0 1 1.167 1.004c.073.583.21 1.156.408 1.708a1.167 1.167 0 0 1-.263 1.232L4.48 6.177a9.333 9.333 0 0 0 3.5 3.5l.733-.733a1.167 1.167 0 0 1 1.233-.263c.552.198 1.125.335 1.708.408A1.167 1.167 0 0 1 12.5 9.98Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
