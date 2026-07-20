"use client";

import { motion } from "framer-motion";
import { CALENDLY_URL, CTA_LABEL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

const snap = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* single quiet glow anchoring the orb side */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-[560px] w-[560px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.14) 0%, rgba(0,0,0,0) 65%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-16 px-6 pb-24 pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pb-32 lg:pt-36">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={snap}
            className="font-display mb-6 text-xs tracking-[0.3em] text-[#00D4FF]"
          >
            AI systems — built and run for you
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snap, delay: 0.05 }}
            className="font-display text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.02] text-white"
          >
            You run the business.
            <br />
            <span className="text-glow text-[#00D4FF]">
              I&apos;ll automate the rest.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snap, delay: 0.12 }}
            className="mt-7 max-w-[52ch] text-lg leading-relaxed text-white/70"
          >
            I turn the repetitive work eating your team&apos;s week into AI
            systems that run 24/7 — built, monitored, and fixed before you ever
            notice a problem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snap, delay: 0.18 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display inline-flex items-center rounded-full bg-[#00D4FF] px-7 py-4 text-sm tracking-wide text-black transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              {CTA_LABEL}
            </a>
            <span className="text-sm text-white/50">
              15 minutes. No pitch. Free.
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...snap, delay: 0.22 }}
          className="flex flex-col items-center gap-7 rounded-3xl border border-white/8 bg-white/[0.02] px-8 py-12"
        >
          <p className="font-display text-center text-xs tracking-[0.25em] text-white/50">
            Don&apos;t take my word for it
          </p>

          <a
            href={PHONE_TEL}
            aria-label="Call the AI receptionist"
            className="group relative flex h-44 w-44 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00D4FF] sm:h-52 sm:w-52"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full opacity-60 transition-opacity group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,212,255,0.22) 0%, rgba(0,212,255,0.07) 55%, rgba(0,0,0,0) 72%)",
              }}
            />
            <motion.span
              aria-hidden
              className="absolute inset-4 rounded-full border border-[#00D4FF]/50"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="absolute inset-9 rounded-full border border-white/10 bg-[#050505] transition-colors group-hover:border-[#00D4FF]/40" />
            <span className="font-display relative z-10 flex flex-col items-center gap-2 text-[13px] tracking-[0.2em] text-white">
              <PhoneRingIcon />
              Call the AI
            </span>
          </a>

          <div className="text-center">
            <a
              href={PHONE_TEL}
              className="font-display text-xl text-[#00D4FF] transition-opacity hover:opacity-80"
            >
              {PHONE_DISPLAY}
            </a>
            <p className="mx-auto mt-3 max-w-[30ch] text-sm leading-relaxed text-white/60">
              A real AI receptionist answers 24/7. Try to stump it — I see a
              log of every call.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PhoneRingIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 16.9v2.6a1.8 1.8 0 0 1-1.96 1.8 17.8 17.8 0 0 1-7.76-2.76 17.5 17.5 0 0 1-5.4-5.4A17.8 17.8 0 0 1 3.12 5.36 1.8 1.8 0 0 1 4.9 3.4h2.7a1.8 1.8 0 0 1 1.8 1.55c.11.9.32 1.78.63 2.63a1.8 1.8 0 0 1-.4 1.9l-1.14 1.14a14.4 14.4 0 0 0 5.4 5.4l1.13-1.13a1.8 1.8 0 0 1 1.9-.41c.85.3 1.74.52 2.63.63A1.8 1.8 0 0 1 21 16.9Z"
        stroke="#00D4FF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 4.5a5.5 5.5 0 0 1 4 4M15.9 1.6a8.6 8.6 0 0 1 6.5 6.4"
        stroke="#00D4FF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
