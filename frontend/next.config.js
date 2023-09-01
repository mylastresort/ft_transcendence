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
        destination: 'http://10.13.1.15:3000/api/:path*',
      },
    ];
  },
  env: {
    FRONTEND_DOMAIN: 'http://10.13.1.15:5173',
    BACKEND_DOMAIN: 'http://10.13.1.15:3000',
    FORTYTWO_CLIENT_ID:
      'u-s4t2ud-5980f22b8a44c6b6f182b3c4ae059cb1abdad774f4fe24988c70d81374caaa44',
    FORTYTWO_CLIENT_SECRET:
      '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',
  },
};

module.exports = nextConfig;
