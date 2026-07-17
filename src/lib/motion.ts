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
export const SECTION_STEP = 0.2 // card-to-card stagger, and TextReveal's line-to-line offset

// AFTER_LABEL — the gap from the bracket label to the heading, and the knob to turn for section
// pacing. The label is the slowest thing in a section (1s of brackets plus a 0.1s-trailing text
// wipe), so the copy waits out part of that instead of stepping on it. Everything else hangs off
// this, so nudging it slides the whole copy stack and the internal rhythm survives. The label keeps
// its 0 and still leads.
const AFTER_LABEL = 0.7
export const SECTION_DELAY = {
  label: 0,
  heading: AFTER_LABEL, // 0.7
  desc: AFTER_LABEL + 0.2, // 0.9 — tighter than the hero's 0.4: the heading rises as one block here
  // (stagger 0) rather than rippling per-char, so it finishes sooner and a wider gap read as a pause
  cards: AFTER_LABEL + 0.3, // 1.0, then cards stagger among themselves by SECTION_STEP
}
