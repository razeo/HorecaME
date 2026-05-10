/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@horecame/ui', '@horecame/db', '@horecame/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
