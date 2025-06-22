"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative isolate overflow-hidden bg-gray-900">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your business?
              <br />
              Start using our platform today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join thousands of companies already using our platform to streamline their operations and boost productivity.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signup"
                className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:scale-105"
              >
                Get started for free
                <ArrowRight className="ml-2 -mr-1 inline h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors"
              >
                Contact sales <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background decoration */}
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
        aria-hidden="true"
      >
        <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.7" />
        <defs>
          <radialGradient id="gradient">
            <stop stopColor="#7775D6" />
            <stop offset={1} stopColor="#4338CA" />
          </radialGradient>
        </defs>
      </svg>
    </section>
  );
}