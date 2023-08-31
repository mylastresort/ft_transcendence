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
        destination: 'http://192.168.1.9:3000/api/:path*',
      },
    ];
  },
  env: {
    FRONTEND_DOMAIN: 'http://192.168.1.9:5173',
    BACKEND_DOMAIN: 'http://192.168.1.9:3000',
    FORTYTWO_CLIENT_ID:
      'u-s4t2ud-a2fc95425f68d972571f0cbf28387e0ee0db176a5aa0ae746977485c23eb4689',
    FORTYTWO_CLIENT_SECRET:
      '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',
  },
};

module.exports = nextConfig;
