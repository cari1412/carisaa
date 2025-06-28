"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative isolate overflow-hidden bg-gray-50 dark:bg-gradient-to-b dark:from-gray-925 dark:to-gray-950 transition-colors">
      {/* Lamp effect container */}
      <div className="relative flex w-full flex-1 items-center justify-center isolate">
        {/* Left lamp effect */}
        <motion.div
          initial={{ opacity: 0.5, width: "10rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-40 sm:h-56 overflow-visible w-[20rem] bg-gradient-conic from-blue-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 bg-gray-50 dark:bg-gray-925 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-gray-50 dark:bg-gray-925 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        
        {/* Right lamp effect */}
        <motion.div
          initial={{ opacity: 0.5, width: "10rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-40 sm:h-56 w-[20rem] bg-gradient-conic from-transparent via-transparent to-blue-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-40 h-[100%] right-0 bg-gray-50 dark:bg-gray-925 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-gray-50 dark:bg-gray-925 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        
        {/* Center glow effects */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-gray-50 dark:bg-gray-925 blur-2xl"></div>
        <div className="absolute inset-auto z-50 h-36 w-[20rem] -translate-y-1/2 rounded-full bg-blue-500 opacity-30 blur-3xl"></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-blue-400 opacity-20 blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: "10rem" }}
          whileInView={{ width: "20rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[20rem] -translate-y-[7rem] bg-blue-400 opacity-50"
        ></motion.div>
      </div>

      {/* Content */}
      <div className="relative z-50 px-4 py-16 sm:px-6 sm:py-24 md:py-32 lg:px-8">
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
                className="w-full sm:w-auto rounded-md bg-blue-600 dark:bg-blue-500 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 dark:hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400 transition-all hover:scale-105 inline-flex items-center justify-center"
              >
                Get started for free
                <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center"
              >
                Contact sales <span aria-hidden="true" className="ml-1">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}