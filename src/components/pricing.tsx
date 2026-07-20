"use client";

import { motion } from "framer-motion";
import { CALENDLY_URL } from "@/lib/site";

const snap = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };
const view = { once: true, margin: "-80px" as const };

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-[72px] border-t border-white/6">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={snap}
        >
          <p className="font-display mb-5 text-xs tracking-[0.3em] text-[#00D4FF]">
            Ways to work with me
          </p>
          <h2 className="font-display max-w-3xl text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] text-white">
            Start free. Scale when it works.
          </h2>
          <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-white/60">
            Every engagement starts with the free 15-minute assessment. Flat
            prices. No hourly billing. The Roadmap is credited in full when you
            continue.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* Free Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={view}
            transition={snap}
            className="flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-8"
          >
            <p className="font-display text-xs tracking-[0.25em] text-white/40">
              Step one
            </p>
            <h3 className="font-display mt-3 text-xl text-white">
              Free AI Assessment
            </h3>
            <p className="font-display mt-4 text-4xl text-white">
              $0
            </p>
            <p className="mt-4 text-sm italic leading-relaxed text-white/50">
              15 minutes. I ask questions, you talk. No pitch.
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-[15px] leading-relaxed text-white/70">
              <Li>We find the #1 place your business is leaking time</Li>
              <Li>You get the exact fix: the tool, the cost, the first step</Li>
              <Li>Yours to keep whether we ever talk again</Li>
            </ul>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display mt-8 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm text-white transition-colors hover:border-[#00D4FF] hover:text-[#00D4FF]"
            >
              Book the free assessment
            </a>
          </motion.div>

          {/* AI Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={view}
            transition={{ ...snap, delay: 0.06 }}
            className="flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-8"
          >
            <p className="font-display text-xs tracking-[0.25em] text-white/40">
              The plan
            </p>
            <h3 className="font-display mt-3 text-xl text-white">AI Roadmap</h3>
            <p className="font-display mt-4 text-4xl text-white">
              $1,000
            </p>
            <p className="mt-4 text-sm italic leading-relaxed text-white/50">
              The full map of what AI can take off your plate.
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-[15px] leading-relaxed text-white/70">
              <Li>Every repetitive workflow in the business mapped, tip to tail</Li>
              <Li>5–7 automation opportunities scored by effort vs. impact</Li>
              <Li>Tools, costs, and the build order — a plan you could hand to anyone</Li>
              <Li>
                <span className="text-white">100% credited</span> toward a build
                or your first month if you continue
              </Li>
            </ul>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display mt-8 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm text-white transition-colors hover:border-[#00D4FF] hover:text-[#00D4FF]"
            >
              Start with the assessment
            </a>
            <p className="mt-5 rounded-xl border border-white/6 bg-black px-4 py-3 text-[13px] leading-relaxed text-white/50">
              Just want one thing built?{" "}
              <span className="text-white">Sprint — $2,500 one-time.</span> I
              build the single highest-ROI workflow from your Roadmap. Roadmap
              credited.
            </p>
          </motion.div>

          {/* AI Employee — featured */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={view}
            transition={{ ...snap, delay: 0.12 }}
            className="relative flex flex-col rounded-2xl border border-[#00D4FF]/50 bg-[#00D4FF]/[0.05] p-8"
          >
            <span className="font-display absolute -top-3 left-8 rounded-full bg-[#00D4FF] px-3 py-1 text-[10px] tracking-[0.2em] text-black">
              Flagship
            </span>
            <p className="font-display text-xs tracking-[0.25em] text-[#00D4FF]/80">
              The managed service
            </p>
            <h3 className="font-display mt-3 text-xl text-white">AI Employee</h3>
            <p className="font-display mt-4 text-4xl text-white">
              $5,000
              <span className="text-lg text-white/50">/mo</span>
            </p>
            <p className="mt-4 text-sm italic leading-relaxed text-white/60">
              Your business gets an AI employee. You just text it.
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-[15px] leading-relaxed text-white/75">
              <Li>Unlimited usage. Flat rate. No hourly billing, no caps.</Li>
              <Li>
                Works 24/7 — message it in Slack, text, or email, like any
                employee
              </Li>
              <Li>
                Connected to your tools with one-click approval — no passwords
                shared
              </Li>
              <Li>I build it, I run it, and I fix issues before you ever notice them</Li>
              <Li>New workflows added every month as your team finds them</Li>
              <Li>
                <span className="text-[#00D4FF]">
                  First agent live in 48 hours — or month one is free
                </span>
              </Li>
            </ul>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display mt-8 inline-flex items-center justify-center rounded-full bg-[#00D4FF] px-6 py-3.5 text-sm text-black transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Book the free assessment
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span aria-hidden className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#00D4FF]" />
      <span>{children}</span>
    </li>
  );
}
