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
            Your Business
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#53FC18] to-[#3AD40E]">
              Runs Itself.
            </span>
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg leading-[1.7]">
            We design and deploy AI-powered systems that capture leads, follow
            up instantly, and book appointments — without adding headcount.
          </p>
          <div className="mt-6">
            <a
              href="#book"
              className="inline-block rounded-lg bg-[#53FC18] px-8 py-3.5 text-sm font-semibold text-[#0B0F0C] shadow-[0_0_24px_rgba(83,252,24,0.25)] transition-transform duration-200 ease-out hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#53FC18] active:scale-95"
            >
              Book a Strategy Call
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
