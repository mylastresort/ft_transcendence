
require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'dist',
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_DOMAIN}/api/:path*`,
      },
    ];
  },
  env: {
    FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN,
    BACKEND_DOMAIN: process.env.BACKEND_DOMAIN,
    FORTYTWO_CLIENT_ID: process.env.FORTYTWO_CLIENT_ID,
    FORTYTWO_CLIENT_SECRET: process.env.FORTYTWO_CLIENT_SECRET,
  },
  
};

module.exports = nextConfig;
