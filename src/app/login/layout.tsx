import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - SaaS Platform",
  description: "Sign in to your SaaS Platform account to access your dashboard and manage your projects.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}