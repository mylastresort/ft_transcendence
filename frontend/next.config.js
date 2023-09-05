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
        destination: 'http://10.13.2.7:3000/api/:path*',
      },
    ];
  },
  env: {
    FRONTEND_DOMAIN: 'http://10.13.2.7:5173',
    BACKEND_DOMAIN: 'http://10.13.2.7:3000',
    FORTYTWO_CLIENT_ID: "u-s4t2ud-30e8e768b5e6a93c2075ffca4693f8f6b7b9583992f5b0cf97d284417b61f394",
    FORTYTWO_CLIENT_SECRET: "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",
  }
};

module.exports = nextConfig;
