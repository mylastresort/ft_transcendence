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
        destination: 'http://137.184.7.150:3000/api/:path*',
      },
    ];
  },
  env: {
    FRONTEND_DOMAIN: 'http://192.168.1.9:5173',
    BACKEND_DOMAIN: 'http://192.168.1.9:3000',
    FORTYTWO_CLIENT_ID:
      'u-s4t2ud-5bb57665a5f45d59c6ca9a2d310d6a1a17052426b99d6f59c371a3a696daa8c8',
    FORTYTWO_CLIENT_SECRET:
      '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',
  }
};

module.exports = nextConfig;
