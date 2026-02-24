"use client";

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";

export function HeroSection() {
  return (
    <Card className="w-full h-[500px] bg-[#000212] relative overflow-hidden rounded-none border-0 border-b border-white/[0.07] shadow-none py-0">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#53FC18"
      />

      <div className="flex h-full">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-sora)] tracking-[-0.03em] bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Your operations.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#53FC18] to-[#3AD40E]">
              Fully automated.
            </span>
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg leading-[1.7]">
            Hipp AI designs and deploys custom AI workflow infrastructure for
            real estate teams, contractors, and service operators — replacing
            manual processes with intelligent systems built around your exact
            stack.
          </p>
          <div className="mt-6 flex flex-col items-start gap-3">
            <a
              href="https://calendly.com/dillon-hippaihq/ai-automation-strategy-call"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-[#53FC18] px-8 py-3.5 text-sm font-semibold text-[#0B0F0C] shadow-[0_0_24px_rgba(83,252,24,0.25)] transition-transform duration-200 ease-out hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#53FC18] active:scale-95"
            >
              Book a Strategy Call
            </a>
            <a
              href="tel:+17177027833"
              className="md:hidden flex items-center gap-2 text-[13px] text-[#b4bcd0] hover:text-[#f7f8f8] transition-colors duration-150 no-underline"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M11.917 9.438v1.625A1.083 1.083 0 0 1 10.786 12.1a10.646 10.646 0 0 1-4.638-1.65A10.483 10.483 0 0 1 2.94 7.242a10.646 10.646 0 0 1-1.65-4.659A1.083 1.083 0 0 1 2.37 1.5H3.99a1.083 1.083 0 0 1 1.083.933c.069.542.195 1.076.379 1.59a1.083 1.083 0 0 1-.244 1.143l-.683.683a8.667 8.667 0 0 0 3.25 3.25l.683-.683a1.083 1.083 0 0 1 1.144-.244c.513.184 1.047.31 1.589.379a1.083 1.083 0 0 1 .926 1.099Z"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              or call (717) 702-7833
            </a>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative hidden md:block">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}
