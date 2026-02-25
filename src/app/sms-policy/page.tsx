import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SMS Policy — Hipp AI",
  description:
    "How Hipp AI handles SMS communications and consent. One-time transactional messages sent only after explicit verbal request.",
};

const sections = [
  {
    title: "How We Send SMS Messages",
    body: "Hipp AI may send a follow-up SMS message only after a user initiates a phone call with our AI assistant and explicitly requests a scheduling link during that call. No SMS is ever sent without this direct, verbal request from the caller.",
  },
  {
    title: "Consent",
    body: "By verbally requesting a link during a call with Hipp AI, the caller provides express consent to receive a single SMS containing the requested information. Consent is voluntary and can be revoked at any time.",
  },
  {
    title: "Message Frequency",
    body: "Message frequency is one (1) message per request. We do not send recurring, promotional, or marketing SMS messages unless separate written consent is obtained.",
  },
  {
    title: "Opt-Out Instructions",
    body: 'Reply STOP to any message to opt out immediately. You will receive one confirmation message, then no further messages will be sent. Reply HELP for assistance or contact us directly at dillon@hippaihq.com.',
  },
  {
    title: "Message & Data Rates",
    body: "Standard message and data rates may apply depending on your mobile carrier and plan.",
  },
  {
    title: "Privacy",
    body: "Your phone number is used solely to deliver the requested SMS. It is not sold, rented, or shared with third parties for marketing purposes. See our Privacy Policy for full details.",
  },
];

export default function SmsPolicyPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000212",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "64px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glows */}
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
            "radial-gradient(ellipse 40% 40% at 80% 80%, rgba(83,252,24,0.025) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 680,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Back link */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-ibm-plex)",
            fontSize: 13,
            color: "rgba(83,252,24,0.6)",
            textDecoration: "none",
            marginBottom: 40,
            letterSpacing: "0.01em",
          }}
        >
          ← hippaihq.com
        </Link>

        {/* Logo wordmark */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
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

        {/* Page title */}
        <h1
          style={{
            fontFamily: "var(--font-sora)",
            fontSize: 32,
            fontWeight: 600,
            color: "#f0f4ef",
            margin: "0 0 8px",
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
          }}
        >
          SMS Communication Policy
        </h1>
        <p
          style={{
            fontFamily: "var(--font-ibm-plex)",
            fontSize: 14,
            color: "rgba(200,216,196,0.45)",
            margin: "0 0 48px",
            lineHeight: 1.6,
          }}
        >
          Last updated: February 2026
        </p>

        {/* Content card */}
        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(83,252,24,0.1)",
            borderRadius: 18,
            padding: "36px 40px",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 1px 0 rgba(83,252,24,0.06) inset, 0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* Intro */}
          <p
            style={{
              fontFamily: "var(--font-ibm-plex)",
              fontSize: 15,
              color: "rgba(200,216,196,0.7)",
              lineHeight: 1.75,
              margin: "0 0 36px",
            }}
          >
            Hipp AI is committed to responsible, consent-based SMS communication.
            We only send text messages when a user explicitly requests one during
            an active phone call. This page documents our consent process as
            required by carriers and regulatory guidelines.
          </p>

          {/* Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {sections.map((section) => (
              <div key={section.title}>
                <h2
                  style={{
                    fontFamily: "var(--font-sora)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#53FC18",
                    margin: "0 0 8px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {section.title}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-ibm-plex)",
                    fontSize: 14,
                    color: "rgba(200,216,196,0.65)",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              margin: "36px 0",
            }}
          />

          {/* Footer links */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px 24px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-ibm-plex)",
                fontSize: 13,
                color: "rgba(200,216,196,0.4)",
              }}
            >
              Questions?
            </span>
            <a
              href="mailto:dillon@hippaihq.com"
              style={{
                fontFamily: "var(--font-ibm-plex)",
                fontSize: 13,
                color: "rgba(83,252,24,0.7)",
                textDecoration: "none",
              }}
            >
              dillon@hippaihq.com
            </a>
            <Link
              href="/privacy-policy"
              style={{
                fontFamily: "var(--font-ibm-plex)",
                fontSize: 13,
                color: "rgba(83,252,24,0.7)",
                textDecoration: "none",
              }}
            >
              Privacy Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
