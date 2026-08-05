// Content contracts for the frontend. Shaped to match what Payload will hand us later, so Phase 3/4
// is a data-source swap (mock -> Local API) and not a component rewrite.
// Superseded by the generated payload-types.ts once collections exist.

// A Payload Media doc, narrowed to what rendering actually needs.
// `blurDataURL` is written on upload by the beforeChange hook in src/collections/Media.ts (and comes
// free from StaticImageData in the mock); absent -> the wrapper skips the blur placeholder.
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

// Hero block. The `\n` in heading is an explicit line break (split into block spans at render); a
// Payload textarea field maps to this 1:1.
export type HeroContent = {
  heading: string
  description: string
  button: LinkField
  slides: MediaDoc[]
}

// A case-study card: image + copy + a headline stat + an "Explore" link, on its own tinted ground.
// Each card carries its full palette — ground, keyline, and the two text tones — so a green card and
// a lilac card read as siblings without the section hardcoding either.
export type CaseStudy = {
  image: MediaDoc // also the video poster when `video` is set
  video?: string // optional looping clip URL; replaces the still on the card
  title: string
  body: string
  stat: { value: string; label: string } // e.g. "133%" / "Lead Increase"
  link: LinkField
  bg: string
  border: string
  fg: string // heading + stat value
  muted: string // body + stat label
}

// Who We Are block. `label` is the bracketed eyebrow — the brackets are CSS pseudos, so the CMS
// value is the bare text ("WHO WE ARE"), never the punctuation.
export type WhoWeAreContent = {
  label: string
  heading: string
  description: string
  cards: CaseStudy[]
}

// A service pillar card on the dark ground: title, a row of tagged capabilities, a hook line with an
// arrow link, and the explainer at the bottom. `fg` tints the title; each badge carries its own star
// colour, so the accent trio is data, not CSS.
export type ServicePillar = {
  title: string
  badges: { label: string; color: string }[]
  // \n in hook/title is a hard break the designer set by hand, not a wrap. hookMobile is only set
  // when the mobile breaks differ from desktop's; absent -> hook serves both.
  hook: string
  hookMobile?: string
  body: string
  link: LinkField
  fg: string
}

// Strategy block — dark ground, same label/heading/desc stack as WhoWeAre, three pillars below.
export type StrategyContent = {
  label: string
  heading: string
  description: string
  cards: ServicePillar[]
}

// A team member in the About carousel. `photo` is optional until real headshots exist — the carousel
// renders a placeholder frame when it's absent, so the section ships before the assets do. Maps 1:1 to
// a Payload array row (or a Team-collection relationship) later.
//
// Two crops, same split as ContactContent: the carousel frame is 112:75 landscape at md+ but a
// 430px-tall column below it, so one file can't serve both without gutting the composition.
// `photoMobile` is optional and falls back to `photo`.
export type TeamMember = {
  photo?: MediaDoc
  photoMobile?: MediaDoc
  name: string
  role: string
}

// About Us block — cream ground, same label/heading/desc stack. Below it: the team carousel (one
// member at a time, prev/next arrows) with a dark footer bar carrying the "Our Story" link.
export type AboutContent = {
  label: string
  heading: string
  description: string
  members: TeamMember[]
  story: LinkField
}

// Contact block — brand-pink ground, oversized display heading, two CTAs.
// A social account. `platform` picks the icon (see the Icon registry) — it isn't free text, so a
// Payload select field with these four options maps straight onto it.
export type SocialLink = {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook'
  href?: string
}

export type ContactContent = {
  label: string
  heading: string
  buttons: LinkField[]
  socials: SocialLink[]
  photo: MediaDoc // portrait crop, md+
  photoMobile: MediaDoc // landscape crop, below md
}

// Dark band under Contact — a single paragraph. The `\n` is an authored break (the closing line
// sits on its own row), rendered via whitespace-pre-line.
export type NoteContent = {
  body: string
}

// The whole home page. Shared by the mock and by getHome() so the two can't drift.
export type HomeContent = {
  hero: HeroContent
  whoWeAre: WhoWeAreContent
  strategy: StrategyContent
  about: AboutContent
  contact: ContactContent
  note: NoteContent
}

// Header global.
export type HeaderContent = {
  nav: Required<LinkField>[]
}

// Footer global — logo + nav column + contact column + copyright line.
export type FooterContent = {
  nav: Required<LinkField>[]
  email: string
  phone: string
  copyright: string
}
