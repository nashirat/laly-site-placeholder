// Content contracts for the frontend. Shaped to match what Payload will hand us later, so Phase 3/4
// is a data-source swap (mock -> Local API) and not a component rewrite.
// Superseded by the generated payload-types.ts once collections exist.

// A Payload Media doc, narrowed to what rendering actually needs.
// `blurDataURL` comes from the blurhash plugin; absent -> the wrapper skips the blur placeholder.
export type MediaDoc = {
  url: string
  width: number
  height: number
  alt: string
  blurDataURL?: string
}

export type LinkField = {
  label: string
  href?: string
}

// Hero block. Newlines in heading/description are the explicit line breaks the reveals animate on
// (a Payload textarea field maps to this 1:1 — that's why TextReveal/LineReveal take `text`).
export type HeroContent = {
  heading: string
  description: string
  button: LinkField
  slides: MediaDoc[]
}

// Header global.
export type HeaderContent = {
  nav: Required<LinkField>[]
}
