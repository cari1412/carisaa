import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - SaaS Platform",
  description: "Create your free SaaS Platform account and start transforming your business today.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}