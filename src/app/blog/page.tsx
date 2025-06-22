import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - Latest Insights and Updates",
  description: "Stay updated with the latest trends, tips, and insights from our team.",
};

const posts = [
  {
    id: 1,
    title: "10 Ways to Boost Your Team's Productivity with Automation",
    excerpt: "Discover how automation can transform your workflow and save hours of manual work every week.",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Productivity",
  },
  {
    id: 2,
    title: "The Future of SaaS: AI Integration and Beyond",
    excerpt: "Explore the latest trends in SaaS and how AI is reshaping the industry landscape.",
    author: "Michael Chen",
    date: "2024-01-10",
    readTime: "7 min read",
    category: "Industry Insights",
  },
  {
    id: 3,
    title: "Security Best Practices for Cloud-Based Teams",
    excerpt: "Essential security measures every team should implement to protect their data in the cloud.",
    author: "Emily Rodriguez",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Security",
  },
  {
    id: 4,
    title: "Scaling Your Business: When to Upgrade Your Tools",
    excerpt: "Learn the key indicators that it's time to upgrade your business tools and infrastructure.",
    author: "David Kim",
    date: "2023-12-28",
    readTime: "4 min read",
    category: "Business Growth",
  },
  {
    id: 5,
    title: "Remote Team Collaboration: Tips from Industry Leaders",
    excerpt: "Best practices for managing and collaborating with distributed teams effectively.",
    author: "Lisa Thompson",
    date: "2023-12-20",
    readTime: "8 min read",
    category: "Remote Work",
  },
  {
    id: 6,
    title: "Data-Driven Decision Making: A Beginner's Guide",
    excerpt: "How to leverage analytics and data to make better business decisions.",
    author: "James Wilson",
    date: "2023-12-15",
    readTime: "6 min read",
    category: "Analytics",
  },
];

export default function BlogPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Latest{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Insights & Updates
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Stay ahead with expert insights, product updates, and industry trends.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="flex flex-col items-start">
                <div className="w-full rounded-2xl bg-gray-100 p-6 h-48"></div>
                <div className="flex items-center gap-x-4 text-xs mt-8">
                  <span className="text-gray-500">{post.category}</span>
                  <div className="flex items-center gap-x-2 text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                  </div>
                  <div className="flex items-center gap-x-2 text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-blue-600">
                    <Link href={`/blog/${post.id}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt}</p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-300" />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      {post.author}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/blog/${post.id}`}
                  className="mt-4 flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500"
                >
                  Read more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}