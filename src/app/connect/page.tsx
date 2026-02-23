"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ??
  "https://hipp-ai-voice-server-production.up.railway.app";

const CALENDLY_URL =
  "https://calendly.com/dillon-hippaihq/ai-automation-strategy-call";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ConnectPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

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
          message: message.trim() || undefined,
          source: "Phone Call",
        }),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#f0f4ef",
    fontSize: 14,
    fontFamily: "var(--font-ibm-plex)",
    outline: "none",
    transition: "border-color 0.2s ease, background 0.2s ease",
    boxSizing: "border-box",
  };

  const labelBase: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(200,216,196,0.55)",
    fontFamily: "var(--font-ibm-plex)",
    letterSpacing: "0.07em",
    textTransform: "uppercase" as const,
    marginBottom: 5,
    display: "block",
  };

  function Field({
    label,
    required,
    type = "text",
    value,
    onChange,
    placeholder,
  }: {
    label: string;
    required?: boolean;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
  }) {
    return (
      <div>
        <label style={labelBase}>
          {label}
          {required && (
            <span style={{ color: "#53FC18", marginLeft: 3 }}>*</span>
          )}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={inputBase}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(83,252,24,0.35)";
            e.target.style.background = "rgba(83,252,24,0.03)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.08)";
            e.target.style.background = "rgba(255,255,255,0.04)";
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000212",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(83,252,24,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(83,252,24,0.03) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: 480,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo / wordmark */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#53FC18",
                boxShadow: "0 0 10px rgba(83,252,24,0.7)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#53FC18",
                textTransform: "uppercase",
              }}
            >
              Hipp AI
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-sora)",
              fontSize: 26,
              fontWeight: 600,
              color: "#f0f4ef",
              margin: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
            }}
          >
            Let&apos;s connect
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ibm-plex)",
              fontSize: 14,
              color: "rgba(200,216,196,0.5)",
              margin: "8px 0 0",
              lineHeight: 1.6,
            }}
          >
            Fill in your details below, or book a strategy call directly.
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(83,252,24,0.1)",
            borderRadius: 18,
            padding: "28px 28px 24px",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 1px 0 rgba(83,252,24,0.06) inset, 0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: "center", padding: "20px 0 16px" }}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "1.5px solid rgba(83,252,24,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <polyline
                      points="5 12 10 17 19 7"
                      stroke="#53FC18"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
                <p
                  style={{
                    fontFamily: "var(--font-sora)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#53FC18",
                    margin: "0 0 6px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Got it — we&apos;ll be in touch.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-ibm-plex)",
                    fontSize: 13,
                    color: "rgba(200,216,196,0.5)",
                    margin: "0 0 24px",
                    lineHeight: 1.6,
                  }}
                >
                  Want to skip the wait? Book a call right now.
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    padding: "12px 0",
                    borderRadius: 10,
                    background: "#53FC18",
                    color: "#0B0F0C",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "var(--font-sora)",
                    textAlign: "center",
                    textDecoration: "none",
                    letterSpacing: "-0.01em",
                    transition: "opacity 0.15s ease, transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.88";
                    e.currentTarget.style.transform = "scale(0.99)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Book a Strategy Call &rarr;
                </a>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <Field
                        label="First name"
                        required
                        value={firstName}
                        onChange={setFirstName}
                        placeholder="Jane"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Field
                        label="Last name"
                        required
                        value={lastName}
                        onChange={setLastName}
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  <Field
                    label="Email"
                    required
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="jane@company.com"
                  />

                  <Field
                    label="Phone"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    placeholder="(555) 123-4567"
                  />

                  <Field
                    label="Company"
                    value={company}
                    onChange={setCompany}
                    placeholder="Acme Corp"
                  />

                  <div>
                    <label style={labelBase}>
                      What are you looking to solve?
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. We want to automate our lead follow-up and reduce manual data entry"
                      rows={3}
                      style={{
                        ...inputBase,
                        resize: "vertical",
                        minHeight: 80,
                        lineHeight: 1.55,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(83,252,24,0.35)";
                        e.target.style.background = "rgba(83,252,24,0.03)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.08)";
                        e.target.style.background = "rgba(255,255,255,0.04)";
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    style={{
                      width: "100%",
                      padding: "12px 0",
                      borderRadius: 10,
                      border: "none",
                      background: canSubmit
                        ? "#53FC18"
                        : "rgba(83,252,24,0.12)",
                      color: canSubmit ? "#0B0F0C" : "rgba(83,252,24,0.35)",
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "var(--font-sora)",
                      cursor: canSubmit ? "pointer" : "not-allowed",
                      letterSpacing: "-0.01em",
                      transition:
                        "opacity 0.15s ease, transform 0.15s ease, background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (canSubmit) {
                        e.currentTarget.style.opacity = "0.88";
                        e.currentTarget.style.transform = "scale(0.99)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    {status === "submitting"
                      ? "Saving..."
                      : status === "error"
                        ? "Something went wrong — retry"
                        : "Send My Details"}
                  </button>

                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      padding: "11px 0",
                      borderRadius: 10,
                      border: "1px solid rgba(83,252,24,0.2)",
                      background: "transparent",
                      color: "rgba(83,252,24,0.7)",
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: "var(--font-sora)",
                      textAlign: "center",
                      textDecoration: "none",
                      letterSpacing: "-0.01em",
                      transition: "background 0.2s ease, color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(83,252,24,0.06)";
                      e.currentTarget.style.color = "#53FC18";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(83,252,24,0.7)";
                    }}
                  >
                    Book a Strategy Call &rarr;
                  </a>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-ibm-plex)",
                    fontSize: 11,
                    color: "rgba(200,216,196,0.3)",
                    textAlign: "center",
                    margin: "14px 0 0",
                    lineHeight: 1.5,
                  }}
                >
                  Your info is only used to follow up with you.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
