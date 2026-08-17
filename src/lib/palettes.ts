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

// /paid-advertising hero pills. Same deal as BADGE_COLORS — the tint follows the position in the
// row, not the ad platform, so the CMS stores four labels and nothing else.
export const PILL_COLORS = ['#A2A11C', '#CBB1C9', '#FF8A88', '#F5C882'] as const

// The warm ember wash the dark sections put behind a panel: near-black on the left, full brand pink
// at the right edge. The hero pills fade it out to 0.1; every panel that uses it holds 0.25 the
// whole way, so this is that flat version. Same 90deg stops in Figma either way.
export const EMBER_WASH =
  'linear-gradient(90deg, rgba(28,25,23,0.25) 35%, rgba(85,47,42,0.25) 65%, rgba(141,68,60,0.25) 85%, rgba(255,111,97,0.25) 100%)'
