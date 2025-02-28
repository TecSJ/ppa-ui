import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xura.tsj.mx',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
