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
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
  env: {
    FRONTEND_DOMAIN: 'http://localhost:5173',
    BACKEND_DOMAIN: 'http://localhost:3000',
    FORTYTWO_CLIENT_ID:
      'u-s4t2ud-c7cf869f2fe58529181018154bf2c29d31b386d6b2148955dea3b266636800c2',
    FORTYTWO_CLIENT_SECRET:
      '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',
  },
};

module.exports = nextConfig;
