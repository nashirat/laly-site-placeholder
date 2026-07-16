import { Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'

// Self-hosted woff2 (converted from the ttf/otf under /public). Core weights only —
// italics + ultra-thins skipped until a layout needs them.
// ponytail: preload:false for now — enable selectively once we know above-the-fold weights.

/** Neue Haas Grotesk Display — headings/display. Exposed as --font-display in @theme. */
export const neueHaas = localFont({
  src: [
    { path: '../../../../fonts/neue-haas-light.woff2', weight: '300', style: 'normal' },
    { path: '../../../../fonts/neue-haas-regular.woff2', weight: '400', style: 'normal' },
    { path: '../../../../fonts/neue-haas-medium.woff2', weight: '500', style: 'normal' },
    { path: '../../../../fonts/neue-haas-bold.woff2', weight: '700', style: 'normal' },
    { path: '../../../../fonts/neue-haas-black.woff2', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  preload: false,
  variable: '--font-neue-haas',
})

/** New Spirit Condensed — serif, body text. Exposed as --font-sans in @theme. */
export const newSpirit = localFont({
  src: [
    { path: '../../../../fonts/new-spirit-condensed-regular.woff2', weight: '400', style: 'normal' },
    { path: '../../../../fonts/new-spirit-condensed-medium.woff2', weight: '500', style: 'normal' },
    { path: '../../../../fonts/new-spirit-condensed-semibold.woff2', weight: '600', style: 'normal' },
    { path: '../../../../fonts/new-spirit-condensed-bold.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  preload: false,
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
