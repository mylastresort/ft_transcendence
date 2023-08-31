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
        destination: 'http://137.184.7.150:4400/api/:path*',
      },
    ];
  },
  env: {
    FRONTEND_DOMAIN: 'http://137.184.7.150:3000',
    BACKEND_DOMAIN: 'http://137.184.7.150:4400'
  }
};

module.exports = nextConfig;
