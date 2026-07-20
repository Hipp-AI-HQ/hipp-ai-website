"use client";

import { motion } from "framer-motion";
import { CALENDLY_URL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

const snap = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };
const view = { once: true, margin: "-80px" as const };

export function AssessmentCta() {
  return (
    <section className="border-t border-white/6">
      <div className="mx-auto max-w-4xl px-6 py-28 text-center lg:py-36">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={snap}
          className="font-display text-xs tracking-[0.3em] text-[#00D4FF]"
        >
          The free 15-minute AI assessment
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ ...snap, delay: 0.05 }}
          className="font-display mt-6 text-[clamp(2rem,5vw,3.6rem)] leading-[1.03] text-white"
        >
          Fifteen minutes.
          <br />
          <span className="text-[#00D4FF]">One real fix.</span> No pitch.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ ...snap, delay: 0.1 }}
          className="mx-auto mt-7 max-w-[52ch] text-base leading-relaxed text-white/60"
        >
          I ask questions about how work actually moves through your business.
          A couple of days later, you get the single biggest fix I can see —
          the tool, the cost, the first step. It&apos;s yours whether we ever
          talk again.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ ...snap, delay: 0.15 }}
          className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display inline-flex items-center rounded-full bg-[#00D4FF] px-8 py-4 text-sm tracking-wide text-black transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Book the free assessment
          </a>
          <a
            href={PHONE_TEL}
            className="font-display text-sm text-white/60 transition-colors hover:text-[#00D4FF]"
          >
            Or call the AI first · {PHONE_DISPLAY}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
