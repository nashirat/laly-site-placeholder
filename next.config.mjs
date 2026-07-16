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
  webpack(config) {
    // svgr: import x from './foo.svg' -> React component. `./foo.svg?url` still yields a URL.
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test?.test?.('.svg'),
    )
    config.module.rules.push(
      { ...fileLoaderRule, test: /\.svg$/i, resourceQuery: /url/ },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        // svgo:false — its css-tree pass crashes on some svgs ("Missed `structure` field").
        // Raw passthrough is fine; className sizes via the preserved viewBox.
        use: [{ loader: '@svgr/webpack', options: { icon: true, svgo: false } }],
      },
    )
    fileLoaderRule.exclude = /\.svg$/i
    return config
  },
}

export default nextConfig
