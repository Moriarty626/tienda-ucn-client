import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.com",
      },
      {
        protocol: "http",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
