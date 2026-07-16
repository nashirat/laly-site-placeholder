/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // WebP/AVIF delivery via next/image — perf priority
    formats: ['image/avif', 'image/webp'],
    // Vercel Blob media (wired in Payload phase)
    remotePatterns: [
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
}

export default nextConfig
