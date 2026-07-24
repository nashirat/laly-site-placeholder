/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // React Compiler (1.0) — auto-memoizes client components. Runs as a Babel pass, so it costs build
  // time; needs babel-plugin-react-compiler installed.
  experimental: {
    reactCompiler: true,
    // Inline the critical CSS and defer the rest — the stylesheet is otherwise render-blocking and
    // sits at depth 2 of the critical path, gating the fonts behind it.
    optimizeCss: true,
  },
  images: {
    // WebP/AVIF delivery via next/image — perf priority. AVIF first: ~30-50% smaller than WebP at
    // equal quality, and non-supporting browsers fall back to WebP off the Accept header.
    formats: ['image/avif', 'image/webp'],
    // default deviceSizes jump 2048 -> 3840, so any box wanting 2049-3839 device px gets a 3840
    // encode. 2560 fills that gap (the 1120-wide team carousel at DPR2 needs 2320).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
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
