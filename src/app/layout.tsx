import type { Metadata } from "next";
import { Sora, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/chat-widget";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hipp AI — AI Systems That Run Your Business",
  description:
    "We design and deploy AI-powered automation systems that capture leads, follow up instantly, and book appointments — without adding headcount.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${ibmPlexSans.variable} font-[family-name:var(--font-ibm-plex)] antialiased`}
      >
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
