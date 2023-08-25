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
    FRONTEND_DOMAIN:'http://10.13.1.5:3000',
    BACKEND_DOMAIN:'http://10.13.1.5:4400'
  }
};

module.exports = nextConfig;
