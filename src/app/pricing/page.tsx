import type { Metadata } from "next";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

export const metadata: Metadata = {
  title: "Pricing - Choose Your Plan",
  description: "Simple, transparent pricing for teams of all sizes. Start with a 14-day free trial.",
};

export default function PricingPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Simple Pricing for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Every Team
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choose the perfect plan for your needs. Always flexible to scale up or down.
            </p>
          </div>
        </div>
      </section>
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  );
}