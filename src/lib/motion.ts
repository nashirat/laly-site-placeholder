// Entry choreography, in seconds. Single source of truth: the preloader curtain and the hero
// cascade are both pure-CSS on the first-paint clock, so they share one timeline and stay aligned
// by arithmetic rather than by luck. Tune here, not at the call sites.
// (Durations/easings live in styles.css alongside their keyframes — this file is delays only.)

export const PRELOADER_HOLD = 0.6 // curtain sits still, logo visible, before it lifts

// Hero content starts as the curtain begins lifting, so the copy rises into view behind it instead
// of having already finished by the time the page is uncovered.
export const ENTRY_BASE = 1.2

// Below-fold sections. Measured from when their <InView> fires, not from page load — the hero is the
// only thing on the paint clock. Overlapping, not queued: each step starts a beat after the previous
// one STARTS, so the section reads as one movement instead of a sequence of separate ones.
export const SECTION_STEP = 0.2 // one beat — also TextReveal's line-to-line offset, so it's on-grid
export const SECTION_DELAY = {
  label: 0,
  heading: SECTION_STEP, // 0.2
  desc: SECTION_STEP + 0.4, // 0.6 — the heading->desc gap is the hero's, so the rhythm matches
  cards: SECTION_STEP + 0.6, // 0.8, then cards stagger between themselves by SECTION_STEP
}
