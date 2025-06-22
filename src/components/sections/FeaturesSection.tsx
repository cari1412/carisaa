"use client";

import { motion } from "framer-motion";
import { 
  Zap, Shield, Users, BarChart3, Globe, Palette,
  Smartphone, Cloud, Lock, Gauge, Layers, Sparkles
} from "lucide-react";

const features = [
  {
    name: "Lightning Fast Performance",
    description: "Experience blazing-fast load times and seamless interactions with our optimized infrastructure.",
    icon: Zap,
    color: "bg-yellow-500",
  },
  {
    name: "Enterprise Security",
    description: "Bank-level encryption and security protocols to keep your data safe and compliant.",
    icon: Shield,
    color: "bg-green-500",
  },
  {
    name: "Team Collaboration",
    description: "Work together in real-time with powerful collaboration tools and shared workspaces.",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    name: "Advanced Analytics",
    description: "Get deep insights into your business with comprehensive analytics and reporting.",
    icon: BarChart3,
    color: "bg-purple-500",
  },
  {
    name: "Global CDN",
    description: "Deliver content at lightning speed worldwide with our distributed network.",
    icon: Globe,
    color: "bg-indigo-500",
  },
  {
    name: "Custom Branding",
    description: "Make it yours with extensive customization options and white-label solutions.",
    icon: Palette,
    color: "bg-pink-500",
  },
];

const additionalFeatures = [
  {
    name: "Mobile Optimized",
    description: "Access your platform anywhere with our mobile-first design approach.",
    icon: Smartphone,
  },
  {
    name: "Cloud Storage",
    description: "Unlimited secure cloud storage with automatic backups and versioning.",
    icon: Cloud,
  },
  {
    name: "API Access",
    description: "Integrate with your existing tools using our comprehensive REST API.",
    icon: Lock,
  },
  {
    name: "Performance Monitoring",
    description: "Real-time monitoring and alerts to ensure optimal performance.",
    icon: Gauge,
  },
  {
    name: "Scalable Infrastructure",
    description: "Grow without limits with our auto-scaling cloud infrastructure.",
    icon: Layers,
  },
  {
    name: "AI-Powered Features",
    description: "Leverage cutting-edge AI to automate tasks and gain insights.",
    icon: Sparkles,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful features for modern teams
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform provides all the tools you need to streamline your workflow and boost productivity.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className={`${feature.color} flex h-10 w-10 items-center justify-center rounded-lg`}>
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* Additional features grid */}
        <div className="mx-auto mt-20 max-w-7xl">
          <h3 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-12">
            And so much more...
          </h3>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <feature.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}