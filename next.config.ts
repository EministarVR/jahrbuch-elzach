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
  serverActions: {
    bodySizeLimit: '50mb',
  },
};

export default nextConfig;
