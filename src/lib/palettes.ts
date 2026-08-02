// Card colour tables. These are design, not content: an editor picks a named palette in the admin
// and the hexes live here, so a new card can't ship an unreadable ink-on-ground pair or a hex typo.
// Add a key and it appears in the admin select automatically (the blocks derive their options from
// Object.keys) — but the frontend still has to be able to read it, so eyeball contrast first.

// Who We Are case-study cards. Spread straight onto CaseStudy — the four keys ARE the four fields.
export const CARD_PALETTES = {
  olive: { bg: '#caca86', border: '#57570F', fg: '#313008', muted: '#57570F' },
  lilac: { bg: '#f3e8f2', border: '#716370', fg: '#443B43', muted: '#716370' },
} as const

// Strategy pillars. One colour each: it tints the title and mixes the card's hover glow.
export const STRATEGY_ACCENTS = {
  lilac: '#E5CBE2',
  amber: '#DFA854',
  olive: '#B5B449',
} as const

// Badge star tints, by position. Every pillar in the design runs this trio in this order, so the
// tint is layout rather than per-badge content and doesn't belong in the CMS at all. Cycles, so a
// fourth badge starts over rather than rendering an invisible star.
export const BADGE_COLORS = ['#A2A11C', '#F3E8F2', '#F5C882'] as const
