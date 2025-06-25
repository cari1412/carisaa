import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "./providers/auth-provider";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SaaS Platform - Modern Solution for Your Business",
    template: "%s | SaaS Platform"
  },
  description: "Transform your business with our cutting-edge SaaS platform. Streamline operations, boost productivity, and scale effortlessly.",
  keywords: ["saas", "business software", "productivity tools", "cloud platform", "automation"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SaaS Platform - Modern Solution for Your Business",
    description: "Transform your business with our cutting-edge SaaS platform.",
    url: "http://localhost:3000",
    siteName: "SaaS Platform",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SaaS Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Platform - Modern Solution for Your Business",
    description: "Transform your business with our cutting-edge SaaS platform.",
    images: ["/twitter-image.png"],
    creator: "@yoursaas",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SaaS Platform",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1250"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}