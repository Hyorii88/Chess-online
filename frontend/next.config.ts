import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tối ưu hóa để giảm RAM
  reactStrictMode: true,

  // Giảm memory usage trong development
  experimental: {
    // Tắt các features không cần thiết
    optimizePackageImports: ['react-icons', 'framer-motion'],
  },

  // Turbopack config (Next.js 16 mặc định dùng Turbopack)
  turbopack: {
    // Empty config để tắt warning
  },
};

export default nextConfig;
