import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["mongoose"],
  async redirects() {
    return [
      {
        source: "/boutique",
        destination: "/nos-mailles",
        permanent: true,
      },
      {
        source: "/boutique/:path*",
        destination: "/nos-mailles/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
