import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hippaihq.com"),
  title: "Hipp AI — You Run the Business. I'll Automate the Rest.",
  description:
    "AI systems that take repetitive work off your team's plate — built, run, and monitored for you. Don't take my word for it: call the AI receptionist I built, +1 (888) 861-5661.",
  openGraph: {
    title: "Hipp AI — You Run the Business. I'll Automate the Rest.",
    description:
      "AI systems that take repetitive work off your team's plate — built, run, and monitored for you. Call the AI I built: +1 (888) 861-5661.",
    url: "https://hippaihq.com",
    siteName: "Hipp AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${inter.variable} font-[family-name:var(--font-inter)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
