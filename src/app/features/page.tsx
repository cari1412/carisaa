import type { Metadata } from "next";
import FeaturesSection from "@/components/sections/FeaturesSection";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Features - Powerful Tools for Modern Teams",
  description: "Explore all the powerful features our SaaS platform offers to transform your business operations.",
};

export default function FeaturesPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Modern Teams
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Everything you need to streamline your workflow, boost productivity, and scale your business.
            </p>
          </div>
        </div>
      </section>
      <FeaturesSection />
      <CTASection />
    </>
  );
}