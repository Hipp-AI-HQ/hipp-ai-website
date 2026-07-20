"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const snap = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };
const view = { once: true, margin: "-80px" as const };

export function Founder() {
  return (
    <section className="border-t border-white/6">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={snap}
        >
          <p className="font-display mb-5 text-xs tracking-[0.3em] text-[#00D4FF]">
            Who&apos;s building this
          </p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] text-white">
            I&apos;m Dillon.
            <br />
            Solo founder. Builder.
          </h2>
          <div className="mt-7 max-w-[54ch] space-y-5 text-base leading-relaxed text-white/65">
            <p>
              I build AI systems for my own business first — the outreach
              engine, the content machine, the receptionist you can call at the
              top of this page. Then I bring the ones that actually work to
              yours.
            </p>
            <p>
              No agency layers, no account managers, no hand-offs. When you
              work with Hipp AI, you work directly with the person who designs,
              builds, and runs your systems — and I&apos;m building all of it
              in public.
            </p>
            <p className="font-display text-sm tracking-wide text-white">
              Small on purpose.{" "}
              <span className="text-[#00D4FF]">Fast because of it.</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={view}
          transition={{ ...snap, delay: 0.08 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div
            aria-hidden
            className="absolute inset-x-8 bottom-0 top-16 rounded-3xl"
            style={{
              background:
                "radial-gradient(circle at 50% 30%, rgba(0,212,255,0.16) 0%, rgba(0,0,0,0) 70%)",
            }}
          />
          <Image
            src="/dillon-founder.png"
            alt="Dillon Hippensteel, founder of Hipp AI"
            width={1100}
            height={1097}
            className="relative z-10 w-full"
            priority={false}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-20 h-24"
            style={{
              background:
                "linear-gradient(to top, #000 8%, rgba(0,0,0,0) 100%)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
