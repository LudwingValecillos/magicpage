import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["animejs"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "magicstore.com.ar", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default config;
