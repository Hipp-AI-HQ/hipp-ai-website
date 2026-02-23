"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { VoiceFormPanel } from "./voice-form-panel";

type WidgetState = "idle" | "connecting" | "active" | "ended";

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "";
const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "";

// Singleton instance — prevent re-initialization on re-renders
let vapiInstance: Vapi | null = null;
function getVapi(): Vapi {
  if (!vapiInstance) {
    vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
  }
  return vapiInstance;
}

export function VoiceWidget() {
  const [state, setState] = useState<WidgetState>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Smooth the volume for the wave animation
  const smoothVolume = useSpring(0, { stiffness: 200, damping: 30 });

  useEffect(() => {
    smoothVolume.set(volumeLevel);
  }, [volumeLevel, smoothVolume]);

  useEffect(() => {
    const vapi = getVapi();

    const onCallStart = () => setState("active");
    const onCallEnd = () => {
      setState("ended");
      setIsSpeaking(false);
      setVolumeLevel(0);
      setTimeout(() => setState("idle"), 2800);
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onVolumeLevel = (level: number) => setVolumeLevel(level);
    const onError = (err: Error) => {
      console.error("[vapi]", err);
      setState("idle");
      setIsSpeaking(false);
      setVolumeLevel(0);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("volume-level", onVolumeLevel);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("volume-level", onVolumeLevel);
      vapi.off("error", onError);
    };
  }, []);

  const handleClick = useCallback(async () => {
    const vapi = getVapi();
    if (state === "active") {
      vapi.stop();
      return;
    }
    if (state === "idle" || state === "ended") {
      setState("connecting");
      try {
        await vapi.start(VAPI_ASSISTANT_ID);
      } catch (err) {
        console.error("[vapi] start error", err);
        setState("idle");
      }
    }
  }, [state]);

  const statusLabel =
    state === "connecting"
      ? "Connecting..."
      : state === "active"
      ? isSpeaking
        ? "Speaking"
        : "Listening"
      : state === "ended"
      ? "Call ended"
      : "";

  return (
    <>
      {/* Global keyframe styles */}
      <style>{`
        @keyframes vapiPing1 {
          0% { transform: scale(1); opacity: 0.18; }
          70% { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        @keyframes vapiPing2 {
          0% { transform: scale(1); opacity: 0.1; }
          70% { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes vapiSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes vapiCheck {
          0% { stroke-dashoffset: 32; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes vapiBar0 {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
        @keyframes vapiBar1 {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(0.75); }
        }
        @keyframes vapiBar2 {
          0%, 100% { transform: scaleY(0.6); }
          50% { transform: scaleY(1); }
        }
        @keyframes vapiBar3 {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(0.85); }
        }
        @keyframes vapiBar4 {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
        .vapi-wave-bar {
          transform-origin: center;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
      `}</style>

      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
        style={{ gap: "10px" }}
        aria-live="polite"
      >
        {/* ── Tooltip / status badge ── */}
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="idle-badge"
              initial={{ opacity: 0, y: 6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 480, damping: 30 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-[10px] select-none pointer-events-none"
              style={{
                background: "rgba(0, 2, 18, 0.85)",
                border: "1px solid rgba(83,252,24,0.18)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(83,252,24,0.06)",
              }}
            >
              {/* Live pulse dot */}
              <span className="relative flex items-center justify-center w-[7px] h-[7px]">
                <span
                  className="absolute inset-0 rounded-full opacity-70"
                  style={{
                    background: "#53FC18",
                    animation: "vapiPing1 2s cubic-bezier(0,0,0.2,1) infinite",
                  }}
                />
                <span
                  className="relative rounded-full w-[7px] h-[7px]"
                  style={{ background: "#53FC18", boxShadow: "0 0 6px rgba(83,252,24,0.8)" }}
                />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sora)",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#c8d8c4",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                }}
              >
                Talk to Hipp AI
              </span>
            </motion.div>
          )}

          {(state === "connecting" || state === "active") && (
            <motion.div
              key="status-badge"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ type: "spring", stiffness: 480, damping: 30 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-[10px] select-none pointer-events-none"
              style={{
                background: "rgba(0, 2, 18, 0.88)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-ibm-plex)",
                  fontSize: "11.5px",
                  fontWeight: 400,
                  color: state === "active" && isSpeaking ? "#53FC18" : "#7a8899",
                  letterSpacing: "0.01em",
                  transition: "color 0.3s ease",
                }}
              >
                {statusLabel}
              </span>
            </motion.div>
          )}

          {state === "ended" && (
            <motion.div
              key="ended-badge"
              initial={{ opacity: 0, y: 6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ type: "spring", stiffness: 480, damping: 30 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-[10px] select-none pointer-events-none"
              style={{
                background: "rgba(0, 2, 18, 0.88)",
                border: "1px solid rgba(83,252,24,0.14)",
                backdropFilter: "blur(16px)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-ibm-plex)",
                  fontSize: "11.5px",
                  fontWeight: 400,
                  color: "#53FC18",
                  opacity: 0.75,
                }}
              >
                Call ended
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main button ── */}
        <motion.button
          onClick={handleClick}
          disabled={state === "connecting"}
          aria-label={
            state === "idle"
              ? "Start voice call with Hipp AI"
              : state === "connecting"
              ? "Connecting to Hipp AI"
              : state === "active"
              ? "End call"
              : "Call ended"
          }
          whileHover={{ scale: state === "connecting" ? 1 : 1.07 }}
          whileTap={{ scale: state === "connecting" ? 1 : 0.91 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className="relative flex items-center justify-center rounded-full outline-none disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            width: 56,
            height: 56,
            background:
              state === "active"
                ? "rgba(0,2,18,0.96)"
                : state === "ended"
                ? "rgba(83,252,24,0.1)"
                : "#53FC18",
            border:
              state === "active"
                ? "1.5px solid rgba(83,252,24,0.45)"
                : state === "ended"
                ? "1.5px solid rgba(83,252,24,0.3)"
                : "none",
            boxShadow:
              state === "active"
                ? "0 0 0 1px rgba(83,252,24,0.08), 0 0 28px rgba(83,252,24,0.1), 0 6px 20px rgba(0,0,0,0.7)"
                : state === "ended"
                ? "0 0 16px rgba(83,252,24,0.1), 0 4px 12px rgba(0,0,0,0.5)"
                : "0 0 28px rgba(83,252,24,0.4), 0 0 56px rgba(83,252,24,0.12), 0 4px 16px rgba(0,0,0,0.5)",
            // Focus ring colors
            // @ts-ignore
            "--tw-ring-color": "#53FC18",
            "--tw-ring-offset-color": "#000212",
          }}
        >
          {/* Pulse rings — active call only */}
          {state === "active" && (
            <>
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "rgba(83,252,24,0.12)",
                  animation: "vapiPing1 1.8s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "rgba(83,252,24,0.06)",
                  animation: "vapiPing2 2.4s cubic-bezier(0,0,0.2,1) infinite",
                  animationDelay: "0.5s",
                }}
              />
            </>
          )}

          {/* Icon layer */}
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.span
                key="mic"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="relative z-10"
              >
                <MicIcon color="#0B0F0C" />
              </motion.span>
            )}

            {state === "connecting" && (
              <motion.span
                key="spinner"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="relative z-10"
              >
                <SpinnerIcon />
              </motion.span>
            )}

            {state === "active" && (
              <motion.span
                key="active-icon"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="relative z-10"
              >
                {isSpeaking ? (
                  <WaveBars />
                ) : (
                  <EndCallIcon />
                )}
              </motion.span>
            )}

            {state === "ended" && (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="relative z-10"
              >
                <CheckIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Contact form panel — slides out during active/ended calls */}
      <AnimatePresence>
        {(state === "active" || state === "ended") && (
          <VoiceFormPanel visible={true} />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function MicIcon({ color = "#0B0F0C" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 10v2a7 7 0 0 1-14 0v-2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="12" y1="19" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="23" x2="16" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EndCallIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3" y="3"
        width="18" height="18"
        rx="3"
        stroke="rgba(83,252,24,0.6)"
        strokeWidth="1.75"
      />
      <line
        x1="8" y1="8" x2="16" y2="16"
        stroke="rgba(83,252,24,0.85)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="16" y1="8" x2="8" y2="16"
        stroke="rgba(83,252,24,0.85)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ animation: "vapiSpin 0.85s linear infinite" }}
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="rgba(11,15,12,0.15)"
        strokeWidth="2.5"
      />
      <path
        d="M22 12 A10 10 0 0 1 12 22"
        stroke="#0B0F0C"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function WaveBars() {
  const bars = [
    { delay: "0s", animation: "vapiBar0" },
    { delay: "0.1s", animation: "vapiBar1" },
    { delay: "0.05s", animation: "vapiBar2" },
    { delay: "0.15s", animation: "vapiBar3" },
    { delay: "0.08s", animation: "vapiBar4" },
  ];

  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden="true">
      {bars.map((bar, i) => (
        <rect
          key={i}
          x={i * 4.5 + 0.5}
          y={0}
          width={2.5}
          height={18}
          rx={1.25}
          fill="#53FC18"
          className="vapi-wave-bar"
          style={{
            animationName: bar.animation,
            animationDuration: "0.65s",
            animationDelay: bar.delay,
          }}
        />
      ))}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polyline
        points="4 12 9 17 20 6"
        stroke="#53FC18"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="32"
        style={{ animation: "vapiCheck 0.45s ease-out forwards" }}
      />
    </svg>
  );
}
