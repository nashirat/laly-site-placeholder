import { Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'

// Self-hosted woff2 (converted from the ttf/otf under /public).
// ONLY the weights actually rendered are declared, because next/font preloads every declared src.
// Declaring the unused ones forces a bad trade: preload:true would fetch 9 fonts up front, and
// preload:false (the old setting) pushed the fonts to depth 3 of the critical path — discovered
// only after the CSS parsed. One weight each means we can preload and still fetch the minimum.
// Add a weight back the moment a component needs it; until then the browser never fetches it anyway.
// ponytail: 2 weights, not a type system.

/** Neue Haas Grotesk Display — headings/display. Exposed as --font-display in @theme. */
export const neueHaas = localFont({
  src: [{ path: '../../../../fonts/neue-haas-medium.woff2', weight: '500', style: 'normal' }],
  display: 'swap',
  preload: true,
  variable: '--font-neue-haas',
})

/** New Spirit Condensed — serif, body text. Exposed as --font-sans in @theme (body default). */
export const newSpirit = localFont({
  src: [
    { path: '../../../../fonts/new-spirit-condensed-regular.woff2', weight: '400', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-new-spirit',
})

/** Geist Mono — neo-grotesque monospace, button/scramble labels. Exposed as --font-mono in @theme.
 *  Variable Google font (self-hosted + subsetted by next/font at build). */
export const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
})

/** Concatenated CSS-variable classes to spread on <body>. */
export const fontVariables = `${neueHaas.variable} ${newSpirit.variable} ${geistMono.variable}`
