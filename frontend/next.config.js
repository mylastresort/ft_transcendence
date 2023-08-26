/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://10.13.10.18:4400/api/:path*',
      },
    ];
  },
  env: {
    FRONTEND_DOMAIN:'http://10.13.10.18:3000',
    BACKEND_DOMAIN:'http://10.13.10.18:4400'
  }
};

module.exports = nextConfig;
