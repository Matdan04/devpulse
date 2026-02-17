import AmbientGlow from "@/components/ambient-glow";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import DashboardPreview from "@/components/sections/dashboard-preview";
import SignalsSection from "@/components/sections/signals-section";
import HowItWorksSection from "@/components/sections/how-it-works-section";
import PrivacySection from "@/components/sections/privacy-section";
import CtaSection from "@/components/sections/cta-section";

export default function Home() {
  return (
    <>
      <AmbientGlow />
      <Navbar />
      <HeroSection />
      <DashboardPreview />
      <SignalsSection />
      <HowItWorksSection />
      <PrivacySection />
      <CtaSection />
      <Footer />
    </>
  );
}
