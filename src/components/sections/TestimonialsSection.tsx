"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    content: "This platform has completely transformed how we manage our projects. The automation features alone have saved us countless hours every week.",
    author: {
      name: "Sarah Johnson",
      role: "CEO at TechStart",
      image: "/avatars/avatar-1.jpg",
    },
    rating: 5,
  },
  {
    content: "The best investment we've made for our team. The collaboration features are intuitive and the analytics give us insights we never had before.",
    author: {
      name: "Michael Chen",
      role: "Product Manager at InnovateCo",
      image: "/avatars/avatar-2.jpg",
    },
    rating: 5,
  },
  {
    content: "Customer support is exceptional. They helped us migrate from our old system seamlessly. The platform itself is powerful yet easy to use.",
    author: {
      name: "Emily Rodriguez",
      role: "Operations Director at ScaleUp",
      image: "/avatars/avatar-3.jpg",
    },
    rating: 5,
  },
  {
    content: "We've seen a 40% increase in productivity since switching. The AI features are game-changing and the API integration was smooth.",
    author: {
      name: "David Kim",
      role: "CTO at DataDrive",
      image: "/avatars/avatar-4.jpg",
    },
    rating: 5,
  },
  {
    content: "Finally, a platform that grows with our business. Started with the basic plan and seamlessly upgraded as we expanded.",
    author: {
      name: "Lisa Thompson",
      role: "Founder at GrowthLab",
      image: "/avatars/avatar-5.jpg",
    },
    rating: 5,
  },
  {
    content: "The ROI was evident within the first month. Our team loves the interface and the automation capabilities are exactly what we needed.",
    author: {
      name: "James Wilson",
      role: "VP of Sales at RevBoost",
      image: "/avatars/avatar-6.jpg",
    },
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-gray-50 dark:bg-gradient-to-b dark:from-gray-875 dark:to-gray-900 py-24 sm:py-32 transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Loved by teams everywhere
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-white dark:bg-gray-800/50 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-colors"
              >
                <div className="flex gap-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 flex-none text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-6 text-base leading-7 text-gray-900 dark:text-gray-100">
                  <p>"{testimonial.content}"</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author.name}</div>
                    <div className="text-sm leading-6 text-gray-600 dark:text-gray-400">{testimonial.author.role}</div>
                  </div>
                </figcaption>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}