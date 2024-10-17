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
    domains: ['https://vcardserver.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://vcardserver.vercel.app',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
