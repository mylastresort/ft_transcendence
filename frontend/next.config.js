/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://10.13.1.7:4400/api/:path*',
      },
    ];
  },
  env: {
    // BACKEND_URL:http://10.13.1.7:4400/api/chat
  }
};

module.exports = nextConfig;
