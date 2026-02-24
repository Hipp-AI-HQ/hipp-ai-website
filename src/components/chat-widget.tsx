"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ??
  "https://hipp-ai-voice-server-production.up.railway.app";

type Message = { role: "user" | "assistant"; content: string };

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Hi! I'm the Hipp AI assistant. What can I help you with today?",
};

// Splits message text into plain-text and link segments so URLs and phone
// numbers render as tappable anchors.
function renderContent(text: string, isUser: boolean) {
  const linkColor = isUser ? "#000212" : "#53FC18";
  const pattern =
    /(https?:\/\/[^\s]+)|(\+1\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4})/g;

  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }

    const raw = match[0];
    if (raw.startsWith("http")) {
      // Show a shortened label for long URLs
      const label =
        raw.length > 40
          ? raw.replace(/^https?:\/\//, "").slice(0, 38) + "…"
          : raw;
      parts.push(
        <a
          key={match.index}
          href={raw}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: linkColor, textDecoration: "underline", fontWeight: 600 }}
        >
          {label}
        </a>
      );
    } else {
      // Phone number — strip to digits for tel: href
      const digits = raw.replace(/\D/g, "");
      parts.push(
        <a
          key={match.index}
          href={`tel:+${digits}`}
          style={{ color: linkColor, textDecoration: "underline", fontWeight: 600 }}
        >
          {raw}
        </a>
      );
    }

    last = match.index + raw.length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    inputRef.current?.focus();

    try {
      const res = await fetch(`${SERVER_URL}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.ok && data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        if (data.leadCaptured) setLeadCaptured(true);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Something went wrong — try again in a moment." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error — please try again." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" style={{ gap: 10 }}>
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            style={{
              width: 340,
              height: 480,
              background: "rgba(0, 2, 18, 0.96)",
              border: "1px solid rgba(83,252,24,0.15)",
              borderRadius: 16,
              backdropFilter: "blur(24px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(83,252,24,0.05) inset",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: "#53FC18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 10px rgba(83,252,24,0.35)",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-sora)",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#000212",
                    }}
                  >
                    H
                  </span>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-sora)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#f7f8f8",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Hipp AI
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#53FC18",
                        boxShadow: "0 0 5px rgba(83,252,24,0.8)",
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-ibm-plex)",
                        fontSize: 11,
                        color: "rgba(180,188,208,0.6)",
                      }}
                    >
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "rgba(180,188,208,0.5)",
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px 14px 8px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                scrollbarWidth: "none",
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "9px 12px",
                      borderRadius:
                        msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                      background:
                        msg.role === "user"
                          ? "#53FC18"
                          : "rgba(255,255,255,0.06)",
                      border:
                        msg.role === "user"
                          ? "none"
                          : "1px solid rgba(255,255,255,0.07)",
                      color: msg.role === "user" ? "#000212" : "#e8ede6",
                      fontSize: 13,
                      lineHeight: 1.55,
                      fontFamily: "var(--font-ibm-plex)",
                      fontWeight: msg.role === "user" ? 500 : 400,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {renderContent(msg.content, msg.role === "user")}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "12px 12px 12px 3px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      display: "flex",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#53FC18",
                          opacity: 0.6,
                          animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                          display: "inline-block",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: "10px 12px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Hipp AI..."
                disabled={loading}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 10,
                  padding: "9px 12px",
                  color: "#f7f8f8",
                  fontSize: 13,
                  fontFamily: "var(--font-ibm-plex)",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(83,252,24,0.35)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: input.trim() && !loading ? "#53FC18" : "rgba(83,252,24,0.12)",
                  border: "none",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s ease, transform 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  if (input.trim() && !loading) e.currentTarget.style.transform = "scale(1.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                aria-label="Send message"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  style={{ transform: "rotate(90deg)" }}
                >
                  <path
                    d="M7.5 2v11M3 6l4.5-4.5L12 6"
                    stroke={input.trim() && !loading ? "#000212" : "rgba(83,252,24,0.35)"}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip badge */}
      <AnimatePresence mode="wait">
        {!open && (
          <motion.div
            key="badge"
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
            <span className="relative flex items-center justify-center w-[7px] h-[7px]">
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "#53FC18",
                  animation: "chatPing 2s cubic-bezier(0,0,0.2,1) infinite",
                  opacity: 0.7,
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
              Chat with Hipp AI
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.91 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: open ? "rgba(0,2,18,0.96)" : "#53FC18",
          border: open ? "1.5px solid rgba(83,252,24,0.4)" : "none",
          boxShadow: open
            ? "0 0 20px rgba(83,252,24,0.1), 0 6px 20px rgba(0,0,0,0.7)"
            : "0 0 28px rgba(83,252,24,0.4), 0 0 56px rgba(83,252,24,0.12), 0 4px 16px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          outline: "none",
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, scale: 0.7, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 90 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M4.5 4.5l9 9M13.5 4.5l-9 9"
                  stroke="rgba(83,252,24,0.8)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  stroke="#000212"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Keyframe styles */}
      <style>{`
        @keyframes chatPing {
          0% { transform: scale(1); opacity: 0.7; }
          70% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes chatDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
