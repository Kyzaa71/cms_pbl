import type { NextConfig } from "next";

const nextConfig: NextConfig = {
experimental: {
    optimizeCss: false, // ⛔️ Matikan LightningCSS sementara
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
