import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["animejs"],
  },
};

export default config;
