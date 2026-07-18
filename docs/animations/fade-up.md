# fade-up — subtle opacity + translate

**Status:** Current. Used for the hero copy (heading, desc, button).
**Verdict:** the premium/skimmable choice. One movement, legible immediately, doesn't make you wait.

## What it does

The element fades from half-opacity while rising a few pixels: `opacity .5 → 1`, `translateY(12px) → 0`, over 0.6s. Starts **half-visible on purpose** — the copy is readable the instant it appears and just settles, rather than materializing from nothing (which reads as "waiting for an animation").

## The non-obvious bits

- **Not on a delay — gated on `html.entered`.** The hero waits for the preloader curtain to finish (see [orchestration.md](orchestration.md)), then all `.entry-copy` elements animate. Per-element sequencing (heading → desc → button) is a small inline `animation-delay` (0 / .15 / .3s) counted from `entered`.
- **Base state = the keyframe's from-state** (`opacity .5`, `translateY 12px`). So attaching the animation causes no jump, and if JS never runs the copy degrades to half-visible rather than blank.
- `animation-fill-mode: forwards` holds the resting state (the base already covers the from-state, so backwards fill is unnecessary).

## CSS (current, gated form)

```css
@keyframes fade-up {
  from { opacity: 0.5; transform: translateY(12px); }
  to   { opacity: 1;   transform: translateY(0); }
}
.entry-copy {
  opacity: 0.5;
  transform: translateY(12px);
}
html.entered .entry-copy {
  animation-name: fade-up;
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); /* easeOutQuint */
  animation-fill-mode: forwards;
  /* animation-delay comes from each element's inline style */
}
@media (prefers-reduced-motion: reduce) {
  .entry-copy { opacity: 1; transform: none; }
  html.entered .entry-copy { animation: none; }
}
```

## Standalone (paint-clock) form — the earlier version

Before the event-gate, fade-up ran on the paint clock via an inline delay. Kept for reference / the panel's "paint-clock" orchestration option:

```css
.fade-up {
  animation: fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```
```tsx
<h1 className="fade-up" style={{ animationDelay: `${ENTRY_BASE}s` }}>…</h1>
```

(The original pre-tuning version started from `opacity: 0` and ran 1.2s — stronger, less subtle.)

## Panel wiring notes

- Dials: start-opacity (0 = pop-in, 0.5 = subtle settle), translateY distance, duration.
- Pairs with any orchestration model; the base-state trick only matters when gated.
