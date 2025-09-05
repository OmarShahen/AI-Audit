import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARNING !!
    // This allows production builds to complete
    // even if your code has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
