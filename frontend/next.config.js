/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      // {
      //   source: '/api/:path*',
      //   destination: 'http://localhost:4400/api/:path*',
      // },
    ];
  },
  env: {
    // BACKEND_URL:http://localhost:4400/api/chat
  }
};

module.exports = nextConfig;
