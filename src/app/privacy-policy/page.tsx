import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Hipp AI",
  description:
    "How Hipp AI collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "Information We Collect",
    body: "We collect information you voluntarily provide when contacting us through our website or phone system. This may include your first name, last name, email address, phone number, company name, and a description of what you are looking to solve. We collect only what is necessary to respond to your inquiry.",
  },
  {
    title: "How We Use Your Information",
    body: "Information you provide is used exclusively to: follow up on your inquiry, schedule strategy calls, and deliver any content you explicitly requested (such as an SMS link during a phone call). We do not use your data for advertising, resale, or any purpose beyond serving your request.",
  },
  {
    title: "SMS Communications",
    body: "Hipp AI sends SMS messages only when a caller explicitly requests a link during an active phone call with our AI assistant. This is a one-time, transactional message. We do not send recurring marketing texts. Reply STOP to any message to opt out immediately. See our SMS Policy for full details.",
  },
  {
    title: "Data Storage",
    body: "Submitted information is stored securely in our internal systems, including Supabase (a managed cloud database) and a private Google Sheet accessible only to Hipp AI staff. Data is retained only as long as needed to serve your request or fulfill a business relationship.",
  },
  {
    title: "Data Sharing",
    body: "We do not sell, rent, or share your personal information with third parties for their marketing purposes. We may share data with service providers (e.g., email delivery, scheduling tools) strictly for the purpose of fulfilling your request, under appropriate confidentiality agreements.",
  },
  {
    title: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal information at any time by contacting us at the address below. We will respond within a reasonable timeframe.",
  },
  {
    title: "Cookies & Analytics",
    body: "Our website may use minimal analytics to understand aggregate traffic patterns. We do not use cross-site tracking cookies or sell browsing data.",
  },
  {
    title: "Policy Updates",
    body: "We may update this policy from time to time. The effective date at the top of this page reflects the most recent revision. Continued use of our services constitutes acceptance of the current policy.",
  },
  {
    title: "Contact",
    body: "For any privacy-related questions or requests, contact us at dillon@hippaihq.com or call +1 (888) 861-5661.",
  },
];

export default function PrivacyPolicyPage() {
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
            "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(83,252,24,0.025) 0%, transparent 60%)",
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
          Privacy Policy
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
            Hipp AI (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This policy
            explains what information we collect, how we use it, and the choices
            you have. By using our website or services, you agree to the
            practices described here.
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
              href="/sms-policy"
              style={{
                fontFamily: "var(--font-ibm-plex)",
                fontSize: 13,
                color: "rgba(83,252,24,0.7)",
                textDecoration: "none",
              }}
            >
              SMS Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
