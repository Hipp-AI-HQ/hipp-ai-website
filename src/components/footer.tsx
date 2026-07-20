import { CALENDLY_URL, EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div>
            <a
              href="/"
              className="font-display text-[15px] tracking-[0.08em] text-white no-underline"
            >
              HIPP<span className="text-[#00D4FF]">AI</span>
            </a>
            <p className="mt-3 max-w-[28ch] text-[13px] leading-relaxed text-white/40">
              AI systems that take repetitive work off your team&apos;s plate —
              built, run, and monitored for you.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-[13px]">
            <span className="font-display text-[11px] tracking-[0.25em] text-white/35">
              Contact
            </span>
            <a
              href={PHONE_TEL}
              className="text-[#00D4FF] no-underline transition-opacity hover:opacity-80"
            >
              {PHONE_DISPLAY} — the AI answers
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="text-white/55 no-underline transition-colors hover:text-white"
            >
              {EMAIL}
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/55 no-underline transition-colors hover:text-white"
            >
              Book the free AI assessment
            </a>
          </div>

          <div className="flex flex-col gap-3 text-[13px]">
            <span className="font-display text-[11px] tracking-[0.25em] text-white/35">
              More
            </span>
            <a
              href="/roi"
              className="text-white/55 no-underline transition-colors hover:text-white"
            >
              ROI calculator
            </a>
            <a
              href="/privacy-policy"
              className="text-white/55 no-underline transition-colors hover:text-white"
            >
              Privacy policy
            </a>
            <a
              href="/sms-policy"
              className="text-white/55 no-underline transition-colors hover:text-white"
            >
              SMS policy
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-7 sm:flex-row sm:items-center">
          <span className="text-[13px] text-white/35">
            © 2026 Hipp AI LLC. All rights reserved.
          </span>
          <span className="text-[13px] text-white/35">
            Solo-built. Running 24/7.
          </span>
        </div>
      </div>
    </footer>
  );
}
