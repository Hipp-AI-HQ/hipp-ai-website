"use client";

import { motion } from "framer-motion";

const snap = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };
const view = { once: true, margin: "-80px" as const };

const STEPS = [
  {
    n: "01",
    name: "Assess",
    body: "We find where time and money are actually leaking — the tasks done by hand fifty times a week, the follow-ups that slip, the after-hours calls nobody catches.",
  },
  {
    n: "02",
    name: "Optimize",
    body: "We fix the process before automating it. Automating a broken process just makes the mess faster — so first, we straighten the line.",
  },
  {
    n: "03",
    name: "Automate",
    body: "I build the system that runs it — then keep it running. Monitored around the clock, fixed before you notice, improved every month.",
  },
];

export function Process() {
  return (
    <section id="how-it-works" className="scroll-mt-[72px] border-t border-white/6">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={snap}
        >
          <p className="font-display mb-5 text-xs tracking-[0.3em] text-[#00D4FF]">
            How it works
          </p>
          <h2 className="font-display max-w-3xl text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] text-white">
            Assess. Optimize. Automate.
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={view}
              transition={{ ...snap, delay: i * 0.07 }}
              className="bg-black p-8 lg:p-10"
            >
              <span className="font-display text-sm text-[#00D4FF]">
                {step.n}
              </span>
              <h3 className="font-display mt-4 text-2xl text-white">
                {step.name}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
