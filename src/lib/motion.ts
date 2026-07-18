// Entry choreography, in seconds.
//
// The preloader curtain is pure-CSS on the first-paint clock (this is its only knob). The hero entry
// is NOT on a delay anymore: the Preloader stamps `entered` on <html> at the curtain's animationend,
// and the hero copy + image strip are gated on that class (see .entry-copy / .entry-fade in
// styles.css). So the hero always starts exactly when the preloader is done — retune the curtain and
// the hero follows for free, no magic number to keep in sync.
//
// Below the fold there is no cascade to time either: those sections animate only their bracket label
// (its own gated transition), and their copy renders static.

export const PRELOADER_HOLD = 0.6 // curtain sits still, logo visible, before it lifts
