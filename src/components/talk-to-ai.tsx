"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { motion, useSpring, useTransform } from "framer-motion";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

type CallState = "idle" | "connecting" | "active" | "ended";

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "";
const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "";

let vapiSingleton: Vapi | null = null;
function getVapi(): Vapi | null {
  if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) return null;
  if (!vapiSingleton) vapiSingleton = new Vapi(VAPI_PUBLIC_KEY);
  return vapiSingleton;
}

export function TalkToAi() {
  const [state, setState] = useState<CallState>("idle");
  const [speaking, setSpeaking] = useState(false);
  const endedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const volume = useSpring(0, { stiffness: 220, damping: 28 });
  const glow = useTransform(volume, [0, 1], [0.25, 1]);
  const ringScale = useTransform(volume, [0, 1], [1, 1.18]);

  useEffect(() => {
    const vapi = getVapi();
    if (!vapi) return;

    const onStart = () => setState("active");
    const onEnd = () => {
      setState("ended");
      setSpeaking(false);
      volume.set(0);
      endedTimer.current = setTimeout(() => setState("idle"), 6000);
    };
    const onSpeechStart = () => setSpeaking(true);
    const onSpeechEnd = () => setSpeaking(false);
    const onVolume = (level: number) => volume.set(level);
    const onError = () => {
      setState("idle");
      setSpeaking(false);
      volume.set(0);
    };

    vapi.on("call-start", onStart);
    vapi.on("call-end", onEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("volume-level", onVolume);
    vapi.on("error", onError);
    return () => {
      vapi.off("call-start", onStart);
      vapi.off("call-end", onEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("volume-level", onVolume);
      vapi.off("error", onError);
      if (endedTimer.current) clearTimeout(endedTimer.current);
    };
  }, [volume]);

  const toggle = useCallback(() => {
    const vapi = getVapi();
    if (!vapi) return;
    if (state === "idle" || state === "ended") {
      setState("connecting");
      vapi.start(VAPI_ASSISTANT_ID);
    } else if (state === "active") {
      vapi.stop();
    }
  }, [state]);

  // Env keys missing (local dev without .env) — phone-only fallback
  if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) {
    return (
      <a
        href={PHONE_TEL}
        className="font-display inline-flex items-center gap-3 rounded-full border border-[#00D4FF]/40 px-6 py-4 text-sm text-[#00D4FF] transition-colors hover:bg-[#00D4FF]/10"
      >
        Call the AI · {PHONE_DISPLAY}
      </a>
    );
  }

  const label =
    state === "idle"
      ? "Talk to it"
      : state === "connecting"
        ? "Connecting"
        : state === "active"
          ? speaking
            ? "It's talking"
            : "Listening"
          : "That was real";

  return (
    <div className="flex flex-col items-center gap-5">
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.96 }}
        aria-label={state === "active" ? "End the call" : "Start talking to the AI"}
        className="group relative flex h-44 w-44 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00D4FF] sm:h-52 sm:w-52"
      >
        {/* volume-reactive glow */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            opacity: state === "active" ? glow : 0.25,
            scale: state === "active" ? ringScale : 1,
            background:
              "radial-gradient(circle, rgba(0,212,255,0.25) 0%, rgba(0,212,255,0.08) 55%, rgba(0,0,0,0) 72%)",
          }}
        />
        {/* idle breathing ring */}
        <motion.span
          aria-hidden
          className="absolute inset-4 rounded-full border border-[#00D4FF]/50"
          animate={
            state === "connecting"
              ? { rotate: 360 }
              : state === "active"
                ? {}
                : { scale: [1, 1.04, 1] }
          }
          transition={
            state === "connecting"
              ? { duration: 1, repeat: Infinity, ease: "linear" }
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
          style={
            state === "connecting"
              ? { borderStyle: "dashed" }
              : undefined
          }
        />
        <span className="absolute inset-9 rounded-full border border-white/10 bg-[#050505] transition-colors group-hover:border-[#00D4FF]/30" />

        <span className="font-display relative z-10 flex flex-col items-center gap-2 text-[13px] tracking-[0.2em] text-white">
          {state === "active" ? <Bars speaking={speaking} /> : <Mic />}
          <span className={state === "ended" ? "text-[#00D4FF]" : undefined}>
            {label}
          </span>
          {state === "active" && (
            <span className="text-[9px] tracking-[0.25em] text-white/40">
              tap to end
            </span>
          )}
        </span>
      </motion.button>

      <p className="max-w-[26ch] text-center text-sm leading-relaxed text-white/60">
        Live from this page — mic required.
        <br />
        Prefer the phone?{" "}
        <a
          href={PHONE_TEL}
          className="whitespace-nowrap text-[#00D4FF] underline-offset-4 transition-colors hover:underline"
        >
          {PHONE_DISPLAY}
        </a>
      </p>
    </div>
  );
}

function Mic() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"
        stroke="#00D4FF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M19 10v2a7 7 0 0 1-14 0v-2"
        stroke="#00D4FF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line x1="12" y1="19" x2="12" y2="22" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Bars({ speaking }: { speaking: boolean }) {
  return (
    <span className="flex h-[26px] items-center gap-[3px]" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-[#00D4FF]"
          animate={
            speaking
              ? { height: [6, 20 - (i % 3) * 4, 8, 22 - (i % 2) * 6, 6] }
              : { height: 6 }
          }
          transition={
            speaking
              ? { duration: 0.7, repeat: Infinity, delay: i * 0.06 }
              : { duration: 0.15 }
          }
        />
      ))}
    </span>
  );
}
