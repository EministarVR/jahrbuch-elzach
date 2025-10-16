import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/unauthorized", destination: "/zugriff-verweigert" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
