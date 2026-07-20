import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { Process } from "@/components/process";
import { Proof } from "@/components/proof";
import { Pricing } from "@/components/pricing";
import { Founder } from "@/components/founder";
import { AssessmentCta } from "@/components/assessment-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <Hero />
        <Problem />
        <Process />
        <Proof />
        <Pricing />
        <Founder />
        <AssessmentCta />
        <Footer />
      </main>
    </>
  );
}
