// Entry choreography, in seconds.
//
// Preloader holds before its client state changes to `preloading-done`, which closes the curtain.
// Hero entry is also gated on that state; its own inline delay controls its start.
//
// Below the fold there is no cascade to time either: those sections animate only their bracket label
// (its own gated transition), and their copy renders static.

export const PRELOADER_HOLD = 0.6 // curtain sits still, logo visible, before it lifts
export const PRELOADER_CLOSE_DURATION = 1.2
