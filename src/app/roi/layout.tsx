import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire vs AI Calculator — Hipp AI",
  description:
    "The real math on your next hire: what the role costs fully loaded, what an AI system doing the repetitive work costs, and what you keep. Estimates in 30 seconds, no email required.",
};

export default function RoiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
