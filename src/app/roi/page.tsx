"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const ACCENT = "#53FC18";
const BG = "#000212";
const TEXT = "#f7f8f8";
const MUTED = "#b4bcd0";
const BORDER = "1px solid rgba(255,255,255,0.08)";

const CALENDLY_URL =
  "https://calendly.com/dillon-hippaihq/ai-automation-strategy-call";
const DEMO_LINE_TEL = "tel:+18888615661";
const DEMO_LINE_DISPLAY = "+1 (888) 861-5661";

// Loaded-cost assumptions (shown transparently in "How this math works")
const BENEFITS_MULTIPLIER = 1.3; // salary + payroll taxes + benefits
const RECRUIT_RAMP = 4500; // recruiting + job ads + ramp-up, one-time
const SPRINT = 2500; // 2-week build
const MAINTAIN_MO = 750; // monthly maintenance
const WORK_HOURS_YR = 2080;

const PRESETS = [
  { label: "Customer support rep", salary: 45000, hours: 28 },
  { label: "Data entry clerk", salary: 42000, hours: 32 },
  { label: "Admin / executive assistant", salary: 55000, hours: 25 },
  { label: "Scheduling coordinator", salary: 45000, hours: 30 },
  { label: "Bookkeeper / AP clerk", salary: 52000, hours: 22 },
  { label: "Custom role", salary: 50000, hours: 20 },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function RoiPage() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [salary, setSalary] = useState(PRESETS[0].salary);
  const [hours, setHours] = useState(PRESETS[0].hours);

  function pickPreset(i: number) {
    setPresetIdx(i);
    setSalary(PRESETS[i].salary);
    setHours(PRESETS[i].hours);
  }

  const calc = useMemo(() => {
    const loaded = salary * BENEFITS_MULTIPLIER;
    const hireYear1 = loaded + RECRUIT_RAMP;
    const systemYear1 = SPRINT + MAINTAIN_MO * 12;
    const hourly = loaded / WORK_HOURS_YR;
    const freedValueYr = hourly * hours * 52;
    const savings = hireYear1 - systemYear1;
    const paybackWeeks = Math.max(1, Math.ceil(SPRINT / (hourly * hours)));
    return { loaded, hireYear1, systemYear1, freedValueYr, savings, paybackWeeks };
  }, [salary, hours]);

  const partialRole = hours < 15;

  const label: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: MUTED,
    marginBottom: 8,
    letterSpacing: 0.2,
  };

  const card: React.CSSProperties = {
    border: BORDER,
    borderRadius: 14,
    padding: "28px 24px",
    background: "rgba(255,255,255,0.02)",
  };

  return (
    <>
      <Navbar />
      <main
        className="pt-[72px]"
        style={{ background: BG, color: TEXT, minHeight: "100vh" }}
      >
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "56px 20px 80px" }}>
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <p style={{ color: ACCENT, fontWeight: 700, fontSize: 14, letterSpacing: 1.2 }}>
              THE HIRE VS AI CALCULATOR
            </p>
            <h1
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: "clamp(30px, 5vw, 46px)",
                fontWeight: 700,
                lineHeight: 1.15,
                margin: "10px 0 12px",
              }}
            >
              See what your next hire really costs.
            </h1>
            <p style={{ color: MUTED, fontSize: 17, maxWidth: 640, lineHeight: 1.6 }}>
              Fully loaded salary math vs an AI system doing the repetitive part of
              the role. Thirty seconds, no email required.
            </p>
          </motion.div>

          {/* Calculator */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
              marginTop: 36,
            }}
          >
            {/* Inputs */}
            <div style={card}>
              <label style={label}>The role you&apos;re hiring for</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {PRESETS.map((p, i) => (
                  <button
                    key={p.label}
                    onClick={() => pickPreset(i)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      border:
                        i === presetIdx
                          ? `1px solid ${ACCENT}`
                          : "1px solid rgba(255,255,255,0.12)",
                      background: i === presetIdx ? "rgba(83,252,24,0.08)" : "transparent",
                      color: i === presetIdx ? ACCENT : MUTED,
                      transition: "all 0.11s ease-out",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <label style={label}>
                Base salary: <span style={{ color: TEXT }}>{fmt(salary)}</span>
              </label>
              <input
                type="range"
                min={30000}
                max={120000}
                step={1000}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                style={{ width: "100%", accentColor: ACCENT, marginBottom: 24 }}
              />

              <label style={label}>
                Hours per week spent on repetitive tasks:{" "}
                <span style={{ color: TEXT }}>{hours} hrs</span>
              </label>
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                style={{ width: "100%", accentColor: ACCENT }}
              />
              <p style={{ color: MUTED, fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>
                Think: answering the same questions, moving data between tools,
                scheduling, follow-ups, reports.
              </p>
            </div>

            {/* Results */}
            <div style={{ ...card, display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <p style={{ ...label, marginBottom: 4 }}>Year-one cost of the hire</p>
                <p style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-sora)" }}>
                  {fmt(calc.hireYear1)}
                </p>
                <p style={{ color: MUTED, fontSize: 12 }}>
                  {fmt(salary)} salary → {fmt(calc.loaded)} loaded + {fmt(RECRUIT_RAMP)}{" "}
                  recruiting &amp; ramp-up
                </p>
              </div>

              <div>
                <p style={{ ...label, marginBottom: 4 }}>Year-one cost of the AI system</p>
                <p style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-sora)" }}>
                  {fmt(calc.systemYear1)}
                </p>
                <p style={{ color: MUTED, fontSize: 12 }}>
                  {fmt(SPRINT)} two-week build + {fmt(MAINTAIN_MO)}/mo to keep it running
                </p>
              </div>

              <div
                style={{
                  borderTop: BORDER,
                  paddingTop: 18,
                }}
              >
                <p style={{ ...label, marginBottom: 4 }}>
                  {partialRole ? "Value of the hours bought back" : "Kept in your pocket, year one"}
                </p>
                <motion.p
                  key={partialRole ? calc.freedValueYr : calc.savings}
                  initial={{ opacity: 0.4, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  style={{
                    fontSize: 40,
                    fontWeight: 800,
                    color: ACCENT,
                    fontFamily: "var(--font-sora)",
                    lineHeight: 1.1,
                  }}
                >
                  {fmt(partialRole ? calc.freedValueYr - calc.systemYear1 : calc.savings)}
                </motion.p>
                <p style={{ color: MUTED, fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
                  {hours} hrs/week freed. The build pays for itself in about{" "}
                  <span style={{ color: TEXT, fontWeight: 600 }}>
                    {calc.paybackWeeks} week{calc.paybackWeeks === 1 ? "" : "s"}
                  </span>{" "}
                  of recovered time.
                </p>
                {partialRole && (
                  <p style={{ color: MUTED, fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>
                    Honest note: under ~15 repetitive hours a week, a full hire might
                    still make sense — the system just takes the repetitive slice off
                    whoever does it today.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* How the math works */}
          <details
            style={{
              marginTop: 20,
              border: BORDER,
              borderRadius: 10,
              padding: "14px 18px",
              color: MUTED,
              fontSize: 14,
            }}
          >
            <summary style={{ cursor: "pointer", color: TEXT, fontWeight: 600 }}>
              How this math works
            </summary>
            <ul style={{ margin: "12px 0 4px 18px", lineHeight: 1.7 }}>
              <li>
                Loaded cost = salary × {BENEFITS_MULTIPLIER} (payroll taxes, benefits,
                overhead — typical US range is 1.25-1.4).
              </li>
              <li>
                Recruiting + ramp-up = {fmt(RECRUIT_RAMP)} one-time (job ads, screening
                time, months at partial productivity).
              </li>
              <li>
                AI system = {fmt(SPRINT)} fixed-price two-week build + {fmt(MAINTAIN_MO)}
                /month maintenance. No seats, no per-task fees.
              </li>
              <li>
                These are estimates. Your real number comes out of a five-minute scoping
                call — that&apos;s what the demo line below is for.
              </li>
            </ul>
          </details>

          {/* Guarantee */}
          <div
            style={{
              marginTop: 20,
              border: `1px solid rgba(83,252,24,0.35)`,
              borderRadius: 10,
              padding: "16px 18px",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: ACCENT, fontWeight: 700 }}>The No Empty Desk Guarantee: </span>
            <span style={{ color: MUTED }}>
              if the system doesn&apos;t save you at least 20 hours a week within 30 days
              of going live, I keep building for free until it does. No time limit.
            </span>
          </div>

          {/* CTAs */}
          <div style={{ marginTop: 36, textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Want the real number for your business?
            </p>
            <p style={{ color: MUTED, fontSize: 15, marginBottom: 20 }}>
              Call the demo line. An AI answers, scopes your build in about five
              minutes, and a working demo comes back within a couple business days.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href={DEMO_LINE_TEL}
                style={{
                  background: ACCENT,
                  color: "#000",
                  fontWeight: 800,
                  padding: "14px 22px",
                  borderRadius: 8,
                  fontSize: 15,
                  textDecoration: "none",
                  letterSpacing: 0.4,
                }}
              >
                CALL {DEMO_LINE_DISPLAY}
              </a>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  border: `1px solid rgba(255,255,255,0.25)`,
                  color: TEXT,
                  fontWeight: 600,
                  padding: "14px 22px",
                  borderRadius: 8,
                  fontSize: 15,
                  textDecoration: "none",
                }}
              >
                Book 15 minutes instead
              </a>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
