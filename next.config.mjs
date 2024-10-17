/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/vcard-preview/:id',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://vcardserver.vercel.app; font-src 'self' data:;",
          },
        ],
      },
    ];
  },
  transpilePackages: ['qrcode'],
  images: {
    domains: ['vcardserver.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vcardserver.vercel.app',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
