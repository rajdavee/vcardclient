/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/vcard-preview/:id',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://vcardserver.vercel.app https://res.cloudinary.com; font-src 'self' data:;",
          },
        ],
      },
    ];
  },
  transpilePackages: ['qrcode'],
  images: {
    domains: ['localhost', 'vcardserver.vercel.app', 'images.unsplash.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vcardserver.vercel.app',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dlxihgzbs/**',
      },
    ],
  },
  output: 'standalone',
};

export default nextConfig;
