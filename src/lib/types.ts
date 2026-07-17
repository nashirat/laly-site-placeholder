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

// Who We Are block. `label` is the bracketed eyebrow — the brackets are CSS pseudos, so the CMS
// value is the bare text ("WHO WE ARE"), never the punctuation.
export type WhoWeAreContent = {
  label: string
  heading: string
  description: string
}

// Strategy block — dark ground, same label/heading/desc stack as WhoWeAre. Identical shape today;
// kept as its own type because the cards diverge (three service pillars vs two case studies).
export type StrategyContent = {
  label: string
  heading: string
  description: string
}

// About Us block — cream ground, same label/heading/desc stack. The card below it becomes the team
// carousel (one member at a time, prev/next arrows, name + role + "Our Story" link).
export type AboutContent = {
  label: string
  heading: string
  description: string
}

// Contact block — brand-pink ground, oversized display heading, two CTAs.
export type ContactContent = {
  label: string
  heading: string
  buttons: LinkField[]
}

// Header global.
export type HeaderContent = {
  nav: Required<LinkField>[]
}
