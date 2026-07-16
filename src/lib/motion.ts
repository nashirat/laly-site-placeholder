// Entry choreography, in seconds. Single source of truth: the preloader curtain and the hero
// cascade are both pure-CSS on the first-paint clock, so they share one timeline and stay aligned
// by arithmetic rather than by luck. Tune here, not at the call sites.
// (Durations/easings live in styles.css alongside their keyframes — this file is delays only.)

export const PRELOADER_HOLD = 0.6 // curtain sits still, logo visible, before it lifts

// Hero content starts as the curtain begins lifting, so the copy rises into view behind it instead
// of having already finished by the time the page is uncovered.
export const ENTRY_BASE = 1.2
