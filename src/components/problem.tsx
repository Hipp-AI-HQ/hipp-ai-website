"use client";

import { motion } from "framer-motion";

const snap = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };
const view = { once: true, margin: "-80px" as const };

const LEAKS = [
  "Calls that ring out after 5 PM — and the job goes to whoever answered.",
  "Leads that wait two days for a reply that took two minutes to write.",
  "Invoices chased by hand, again, at the end of every month.",
  "The same quote, email, and follow-up typed for the fortieth time.",
  "Monday mornings lost to assembling the same report as last Monday.",
];

export function Problem() {
  return (
    <section className="border-t border-white/6">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={snap}
        >
          <p className="font-display mb-5 text-xs tracking-[0.3em] text-[#00D4FF]">
            The problem
          </p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] text-white">
            Repetitive work is quietly your most expensive employee.
          </h2>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-white/60">
            None of it needs judgment. All of it needs doing. So it lands on
            your best people — and eats the hours you actually hired them for.
          </p>
        </motion.div>

        <div className="flex flex-col justify-center gap-4">
          {LEAKS.map((leak, i) => (
            <motion.div
              key={leak}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={view}
              transition={{ ...snap, delay: i * 0.05 }}
              className="flex items-start gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4"
            >
              <span className="font-display mt-0.5 text-xs text-[#00D4FF]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[15px] leading-relaxed text-white/75">{leak}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
