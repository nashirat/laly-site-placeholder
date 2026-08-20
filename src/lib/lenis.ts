import type Lenis from 'lenis'

// The page's Lenis instance, shared. SmoothScroll owns its lifetime and publishes it here; anything
// that needs to take the scroll away from the user for a moment — CompoundEffect's pinned phases —
// reads it back.
//
// A module singleton rather than context: there is exactly one, it is created in an effect, and a
// provider would put every consumer under a client boundary for a value that never changes identity
// during a page's life.
let current: Lenis | null = null

export const setLenis = (lenis: Lenis | null) => {
  current = lenis
}

// null before SmoothScroll's effect runs, and for the whole session under prefers-reduced-motion —
// SmoothScroll does not construct Lenis at all there. Callers must treat null as "no scroll
// control" and leave the page alone.
export const getLenis = () => current
