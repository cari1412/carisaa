"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative isolate overflow-hidden bg-gray-50 dark:bg-gradient-to-b dark:from-gray-925 dark:to-gray-950 transition-colors">
      <div className="px-4 py-16 sm:px-6 sm:py-24 md:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
              Ready to transform your business?
              <br className="hidden sm:inline" />
              <span className="block sm:inline mt-1 sm:mt-0">Start using our platform today.</span>
            </h2>
            <p className="mx-auto mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 dark:text-gray-300 px-4 sm:px-0">
              Join thousands of companies already using our platform to streamline their operations and boost productivity.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <Link
                href="/signup"
                className="w-full sm:w-auto rounded-md bg-blue-600 dark:bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold text-white dark:text-gray-900 shadow-sm hover:bg-blue-500 dark:hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-white transition-all hover:scale-105 inline-flex items-center justify-center"
              >
                Get started for free
                <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-gray-300 transition-colors inline-flex items-center"
              >
                Contact sales <span aria-hidden="true" className="ml-1">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background decoration - оптимизирован для мобильных */}
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[32rem] w-[32rem] sm:h-[48rem] sm:w-[48rem] md:h-[64rem] md:w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
        aria-hidden="true"
      >
        <circle cx={512} cy={512} r={512} fill="url(#gradient-cta)" fillOpacity="0.7" />
        <defs>
          <radialGradient id="gradient-cta">
            <stop stopColor="#7775D6" />
            <stop offset={1} stopColor="#2563eb" />
          </radialGradient>
        </defs>
      </svg>
    </section>
  );
}