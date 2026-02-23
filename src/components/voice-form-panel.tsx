"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ??
  "https://hipp-ai-voice-server-production.up.railway.app";

const CALENDLY_URL =
  "https://calendly.com/dillon-hippaihq/ai-automation-strategy-call";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function VoiceFormPanel({ visible }: { visible: boolean }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const canSubmit =
    status === "idle" &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("submitting");
    try {
      const res = await fetch(`${SERVER_URL}/api/leads/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          company: company.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  if (!visible) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "#f7f8f8",
    fontSize: 13,
    fontFamily: "var(--font-ibm-plex)",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: "rgba(200,216,196,0.7)",
    fontFamily: "var(--font-ibm-plex)",
    letterSpacing: "0.02em",
    marginBottom: 3,
    display: "block",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      style={{
        position: "fixed",
        bottom: 88,
        right: 24,
        width: 272,
        zIndex: 49,
        background: "rgba(0, 2, 18, 0.94)",
        border: "1px solid rgba(83,252,24,0.1)",
        borderRadius: 14,
        backdropFilter: "blur(20px)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(83,252,24,0.04)",
        padding: "16px 14px",
        overflow: "hidden",
      }}
    >
      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            style={{ margin: "0 auto 10px" }}
          >
            <circle cx="12" cy="12" r="11" stroke="#53FC18" strokeWidth="1.5" opacity={0.3} />
            <polyline
              points="6 12 10 16 18 8"
              stroke="#53FC18"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <p
            style={{
              fontFamily: "var(--font-sora)",
              fontSize: 13,
              fontWeight: 500,
              color: "#53FC18",
              margin: "0 0 4px",
            }}
          >
            Got it!
          </p>
          <p
            style={{
              fontFamily: "var(--font-ibm-plex)",
              fontSize: 11.5,
              color: "rgba(200,216,196,0.6)",
              margin: 0,
            }}
          >
            We&apos;ll be in touch.
          </p>

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              marginTop: 14,
              padding: "9px 0",
              borderRadius: 8,
              border: "1px solid rgba(83,252,24,0.25)",
              background: "transparent",
              color: "#53FC18",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "var(--font-sora)",
              textAlign: "center",
              textDecoration: "none",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(83,252,24,0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Book a Strategy Call &rarr;
          </a>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p
            style={{
              fontFamily: "var(--font-sora)",
              fontSize: 13,
              fontWeight: 500,
              color: "#e8ede6",
              margin: "0 0 12px",
              letterSpacing: "-0.01em",
            }}
          >
            Your Details
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>First name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(83,252,24,0.4)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                  }
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Last name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(83,252,24,0.4)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                  }
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(83,252,24,0.4)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(83,252,24,0.4)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(83,252,24,0.4)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: "100%",
              marginTop: 12,
              padding: "9px 0",
              borderRadius: 8,
              border: "none",
              background: canSubmit ? "#53FC18" : "rgba(83,252,24,0.15)",
              color: canSubmit ? "#0B0F0C" : "rgba(83,252,24,0.4)",
              fontSize: 12.5,
              fontWeight: 600,
              fontFamily: "var(--font-sora)",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "opacity 0.2s ease, transform 0.15s ease",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              if (canSubmit) e.currentTarget.style.opacity = "0.88";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            {status === "submitting" ? "Saving..." : status === "error" ? "Failed — retry" : "Submit Details"}
          </button>

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              marginTop: 8,
              padding: "8px 0",
              borderRadius: 8,
              border: "1px solid rgba(83,252,24,0.18)",
              background: "transparent",
              color: "rgba(83,252,24,0.75)",
              fontSize: 11.5,
              fontWeight: 500,
              fontFamily: "var(--font-sora)",
              textAlign: "center",
              textDecoration: "none",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(83,252,24,0.06)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Book a Strategy Call &rarr;
          </a>
        </form>
      )}
    </motion.div>
  );
}
