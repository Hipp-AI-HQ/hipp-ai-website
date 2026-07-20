"use client";

import { motion } from "framer-motion";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

const snap = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };
const view = { once: true, margin: "-80px" as const };

const SYSTEMS = [
  {
    name: "AI lead-gen + outreach engine",
    body: "Finds, scores, and researches 25 targeted prospects every day for my own pipeline — then preps the personalized outreach for me to review.",
    tag: "Runs my business",
  },
  {
    name: "Content engine",
    body: "Researches AI news overnight and hands me post drafts and full video production packages every morning before 7 AM.",
    tag: "Runs my business",
  },
  {
    name: "Event-ROI intelligence platform",
    body: "Tracks whether client events actually produce revenue — built for a $12B-AUM investment firm.",
    tag: "Client build",
  },
  {
    name: "AI content workflow",
    body: "A repeatable content production system built for a paying creator client.",
    tag: "Client build",
  },
];

export function Proof() {
  return (
    <section id="proof" className="scroll-mt-[72px] border-t border-white/6">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={snap}
        >
          <p className="font-display mb-5 text-xs tracking-[0.3em] text-[#00D4FF]">
            Proof
          </p>
          <h2 className="font-display max-w-3xl text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] text-white">
            Real systems. Running right now.
          </h2>
          <p className="mt-6 max-w-[56ch] text-base leading-relaxed text-white/60">
            No stock dashboards, no invented logos, no made-up testimonials.
            Every system on this page is real — most of them run my own
            business every single day.
          </p>
        </motion.div>

        {/* Featured: the callable receptionist */}
        <motion.a
          href={PHONE_TEL}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ ...snap, delay: 0.08 }}
          className="group mt-14 flex flex-col justify-between gap-6 rounded-2xl border border-[#00D4FF]/35 bg-[#00D4FF]/[0.04] p-8 transition-colors hover:bg-[#00D4FF]/[0.08] sm:flex-row sm:items-center lg:p-10"
        >
          <div>
            <span className="font-display inline-flex items-center gap-2 text-xs tracking-[0.25em] text-[#00D4FF]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00D4FF] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00D4FF]" />
              </span>
              Live · answers 24/7
            </span>
            <h3 className="font-display mt-4 text-2xl text-white lg:text-3xl">
              AI phone receptionist
            </h3>
            <p className="mt-3 max-w-[50ch] text-[15px] leading-relaxed text-white/60">
              Answers, qualifies, and books — around the clock. It picks up
              this number right now. Call it and try to stump it.
            </p>
          </div>
          <span className="font-display whitespace-nowrap text-xl text-[#00D4FF] transition-transform group-hover:scale-[1.03] lg:text-2xl">
            {PHONE_DISPLAY} →
          </span>
        </motion.a>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {SYSTEMS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={view}
              transition={{ ...snap, delay: i * 0.05 }}
              className="rounded-2xl border border-white/6 bg-white/[0.02] p-8"
            >
              <span className="font-display text-[10px] tracking-[0.25em] text-white/40">
                {s.tag}
              </span>
              <h3 className="font-display mt-3 text-xl text-white">{s.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* The honest math */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ ...snap, delay: 0.1 }}
          className="mt-6 rounded-2xl border border-white/6 bg-white/[0.02] p-8 text-center lg:p-12"
        >
          <p className="font-display text-xs tracking-[0.3em] text-white/40">
            The math
          </p>
          <p className="font-display mt-6 text-[clamp(1.5rem,3.5vw,2.6rem)] leading-tight">
            <span className="relative text-white/45">
              A $70–100K/yr hire
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-[#00D4FF]"
              />
            </span>
            <br />
            <span className="text-white">
              or an AI system at a fraction of that —{" "}
              <span className="text-[#00D4FF]">working 24/7.</span>
            </span>
          </p>
          <p className="mx-auto mt-6 max-w-[54ch] text-sm leading-relaxed text-white/50">
            That&apos;s a cost comparison, not a promise — every business is
            different. The assessment is where we find out what the math looks
            like for yours.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
