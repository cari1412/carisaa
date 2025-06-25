import type { Metadata } from "next";
import { Users, Target, Award, Globe } from "lucide-react";

import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "About Us - Our Story and Mission",
  description: "Learn about our mission to transform businesses through innovative SaaS solutions.",
};

const values = [
  {
    name: "Customer First",
    description: "We prioritize our customers' success above everything else.",
    icon: Users,
  },
  {
    name: "Innovation",
    description: "Constantly pushing boundaries to deliver cutting-edge solutions.",
    icon: Target,
  },
  {
    name: "Excellence",
    description: "Committed to delivering the highest quality in everything we do.",
    icon: Award,
  },
  {
    name: "Global Impact",
    description: "Making a positive difference for businesses worldwide.",
    icon: Globe,
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              We're on a mission to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                transform business
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Founded in 2020, we've been helping businesses streamline their operations and achieve 
              unprecedented growth through innovative technology solutions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Our Values</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What drives us forward
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <value.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                    {value.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{value.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      
      <CTASection />
    </>
  );
}