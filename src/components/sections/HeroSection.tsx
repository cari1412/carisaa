"use client";

import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900 transition-colors">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-x-4 text-xs">
              <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/30">
                New feature
              </span>
              <span className="text-gray-600 dark:text-gray-400">Enhanced AI capabilities now available</span>
            </div>
            
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Transform Your Business with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Intelligent Automation
              </span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Streamline workflows, boost productivity, and scale your operations with our cutting-edge SaaS platform. 
              Join thousands of businesses already experiencing the future of work.
            </p>
            
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/signup"
                className="rounded-md bg-blue-600 dark:bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 dark:hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400 transition-all hover:scale-105"
              >
                Start free trial
                <ArrowRight className="ml-2 -mr-1 inline h-4 w-4" />
              </Link>
              <button className="group flex items-center text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                <Play className="mr-2 h-10 w-10 flex-none rounded-full bg-gray-100 dark:bg-zinc-800 p-2.5 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-zinc-700 transition-colors" />
                Watch demo
              </button>
            </div>
            
            <div className="mt-10 flex items-center gap-x-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 ring-2 ring-white dark:ring-zinc-900"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Trusted by <span className="font-semibold">10,000+</span> companies
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="rounded-xl bg-gray-900/5 dark:bg-white/5 p-2 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="h-[448px] w-[768px] rounded-md bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10"></div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80b3ff] to-[#468ef9] opacity-20 dark:opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </section>
  );
}