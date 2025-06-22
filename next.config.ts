import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'dev.prospecttrade.org'],
  },
  eslint: {
    // Предупреждение: Это позволит продакшн сборкам успешно завершаться, даже если
    // в вашем проекте есть ошибки ESLint.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Предупреждение: Это позволит продакшн сборкам успешно завершаться, даже если
    // в вашем проекте есть ошибки типов.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;