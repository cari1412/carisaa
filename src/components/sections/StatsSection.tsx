"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  { id: 1, name: "Active Users", value: 50000, suffix: "+", prefix: "" },
  { id: 2, name: "Revenue Generated", value: 100, suffix: "M+", prefix: "$" },
  { id: 3, name: "Customer Satisfaction", value: 99.9, suffix: "%", prefix: "" },
  { id: 4, name: "Uptime SLA", value: 99.99, suffix: "%", prefix: "" },
];

export default function StatsSection() {
  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32">
      {/* Gradient background with metallic blue effect */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
        
        {/* Metallic blue overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 via-blue-600/30 to-cyan-500/20" />
        
        {/* Additional depth layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-800/20 to-slate-900/50" />
        
        {/* Flowing wave pattern */}
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
              <stop offset="50%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0.4)" />
            </linearGradient>
            <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(96, 165, 250, 0.3)" />
              <stop offset="50%" stopColor="rgba(37, 99, 235, 0.2)" />
              <stop offset="100%" stopColor="rgba(79, 70, 229, 0.3)" />
            </linearGradient>
          </defs>
          
          {/* Multiple wave layers for depth */}
          <path
            fill="url(#wave-gradient)"
            d="M0,200 C320,100 640,300 960,200 C1280,100 1440,250 1440,250 L1440,800 L0,800 Z"
            opacity="0.5"
          >
            <animate
              attributeName="d"
              values="M0,200 C320,100 640,300 960,200 C1280,100 1440,250 1440,250 L1440,800 L0,800 Z;
                      M0,250 C320,150 640,250 960,150 C1280,50 1440,200 1440,200 L1440,800 L0,800 Z;
                      M0,200 C320,100 640,300 960,200 C1280,100 1440,250 1440,250 L1440,800 L0,800 Z"
              dur="20s"
              repeatCount="indefinite"
            />
          </path>
          
          <path
            fill="url(#wave-gradient-2)"
            d="M0,300 C480,200 960,400 1440,300 L1440,800 L0,800 Z"
            opacity="0.4"
          >
            <animate
              attributeName="d"
              values="M0,300 C480,200 960,400 1440,300 L1440,800 L0,800 Z;
                      M0,350 C480,250 960,350 1440,250 L1440,800 L0,800 Z;
                      M0,300 C480,200 960,400 1440,300 L1440,800 L0,800 Z"
              dur="15s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        
        {/* Metallic shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-sky-400/10 to-transparent" />
        
        {/* Decorative glows */}
        <div className="absolute left-[20%] top-[10%] h-64 w-64 rounded-full bg-blue-500/30 blur-[100px]" />
        <div className="absolute right-[20%] bottom-[10%] h-64 w-64 rounded-full bg-cyan-500/30 blur-[100px]" />
        <div className="absolute left-[50%] top-[50%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          >
            Trusted by teams worldwide
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-6 text-lg leading-8 text-gray-300"
          >
            Join thousands of companies that have transformed their operations with our platform.
          </motion.p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col gap-y-3 border-l border-white/20 pl-6"
            >
              <dt className="text-sm leading-6 text-gray-300">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}