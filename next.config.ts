import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Lets a phone on the same Wi-Fi use the dev server (npm run dev -- -H 0.0.0.0).
  allowedDevOrigins: ["192.168.1.170"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-*" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
