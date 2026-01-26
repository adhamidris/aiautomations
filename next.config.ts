import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {
    // Reduce memory usage
    workerThreads: false,
    cpus: 1,
  }
};

export default nextConfig;
