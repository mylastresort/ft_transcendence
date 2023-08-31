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
        destination: 'http://localhost:4400/api/:path*',
      },
    ];
  },
  env: {
    FRONTEND_DOMAIN:'http://localhost:3000',
    BACKEND_DOMAIN:'http://localhost:4400'
  }
};

module.exports = nextConfig;
