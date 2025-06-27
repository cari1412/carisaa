"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long is the free trial?",
    answer: "We offer a 14-day free trial with full access to all features. No credit card required to start.",
  },
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and wire transfers for enterprise customers.",
  },
  {
    question: "Is there a setup fee?",
    answer: "No, there are no setup fees for any of our plans. You only pay the monthly or yearly subscription fee.",
  },
  {
    question: "How secure is my data?",
    answer: "We use bank-level encryption and security protocols. Your data is stored in SOC 2 compliant data centers with regular security audits.",
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer: "Yes, our Enterprise plan includes custom solutions tailored to your specific needs. Contact our sales team for more information.",
  },
  {
    question: "What kind of support do you provide?",
    answer: "All plans include 24/7 email support. Professional and Enterprise plans also include priority support with faster response times.",
  },
  {
    question: "Can I export my data?",
    answer: "Yes, you can export all your data at any time in various formats including CSV, JSON, and PDF.",
  },
];

export default function FAQSection() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-white dark:bg-zinc-950 transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Two column layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left column - Title and description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-8"
            >
              <div className="text-sm border border-dashed border-gray-300 dark:border-gray-700 rounded-full px-4 py-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 w-fit whitespace-nowrap mb-6">
                <span className="text-gray-900 dark:text-gray-100 text-[13.5px] flex items-center gap-2 [&_svg]:w-4 [&_svg]:h-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-help" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                  Got Questions? We've Got Answers
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-6 leading-tight md:leading-[3.25rem] max-w-sm md:max-w-xl">
                Frequently<br className="hidden md:block" />
                <span className="md:block">Asked Questions</span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We're here to help! If you have any questions or need assistance, our support team is ready to assist you.
              </p>

              {/* Bottom decoration for desktop */}
              <div className="hidden lg:block mt-16">
                <div className="w-32 h-32 rounded-2xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-xl bg-white dark:bg-zinc-800 shadow-sm dark:shadow-zinc-900 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column - FAQ items */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-zinc-700 transition-colors duration-200"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors duration-200 focus:outline-none focus-visible:border-blue-600 dark:focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-600/50 dark:focus-visible:ring-blue-400/50 rounded-md"
                    aria-expanded={openItem === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-base font-medium text-gray-900 dark:text-white pr-2 flex-1 text-left">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openItem === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 text-gray-400 dark:text-gray-500 pointer-events-none"
                    >
                      <ChevronDown className="w-4 h-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openItem === index && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: "auto", 
                          opacity: 1,
                          transition: {
                            height: { duration: 0.3, ease: "easeInOut" },
                            opacity: { duration: 0.2, delay: 0.1 }
                          }
                        }}
                        exit={{ 
                          height: 0, 
                          opacity: 0,
                          transition: {
                            height: { duration: 0.3, ease: "easeInOut" },
                            opacity: { duration: 0.2 }
                          }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 -mt-2">
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Mobile bottom decoration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:hidden mt-12 flex justify-center"
          >
            <div className="w-32 h-32 rounded-2xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
              <div className="w-20 h-20 rounded-xl bg-white dark:bg-zinc-800 shadow-sm dark:shadow-zinc-900 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}