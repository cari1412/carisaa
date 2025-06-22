import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import StatsSection from "@/components/sections/StatsSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}