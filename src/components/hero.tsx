"use client";

import { motion } from "framer-motion";
import { TalkToAi } from "@/components/talk-to-ai";
import { CALENDLY_URL, CTA_LABEL } from "@/lib/site";

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
          className="flex flex-col items-center gap-6 rounded-3xl border border-white/8 bg-white/[0.02] px-8 py-12"
        >
          <p className="font-display text-center text-xs tracking-[0.25em] text-white/50">
            Don&apos;t take my word for it
          </p>
          <TalkToAi />
        </motion.div>
      </div>
    </section>
  );
}
