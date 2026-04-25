import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thhbntdet8mivemz.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
