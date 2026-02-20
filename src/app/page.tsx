import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { LeadsSection } from "@/components/leads-section";
import { AnalyticsSection } from "@/components/analytics-section";
import { IntegrationsSection } from "@/components/integrations-section";
import { PerformanceSection } from "@/components/performance-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <HeroSection />
        <LeadsSection />
        <AnalyticsSection />
        <IntegrationsSection />
        <PerformanceSection />
        <CtaSection />
        <Footer />
      </main>
    </>
  );
}
