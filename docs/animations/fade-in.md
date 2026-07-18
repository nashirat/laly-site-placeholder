# fade-in — opacity only

**Status:** Current. Used for the hero image-strip slides (`ImageMarquee`).
**Verdict:** the safe choice when a transform would fight another transform.

## What it does

Pure opacity `0 → 1`. No translate, no scale.

## Why opacity-only here

The image strip is an Embla carousel with an auto-scroll plugin — it's continuously applying its own `transform: translate3d(...)` to loop. A transform-based entry (fade-**up**) would fight Embla's loop transform and jitter. Opacity is orthogonal to transform, so it composits cleanly on top.

## The non-obvious bits

- Gated on `html.preloading-done` like hero copy (`.entry-fade`). Slides stagger left→right via inline `animation-delay` (`BASE_DELAY + i * STAGGER`), shortly after button starts.
- Base `opacity: 0` (not 0.5) — the strip is client-only anyway (Embla needs JS), so there's no JS-dead degradation to protect; hidden-until-ready is fine.

## CSS

```css
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.entry-fade {
  opacity: 0;
}
html.preloading-done .entry-fade,
html.preloader-done .entry-fade {
  animation-name: fade-in;
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  animation-fill-mode: forwards;
}
@media (prefers-reduced-motion: reduce) {
  .entry-fade { opacity: 1; }
  html.preloading-done .entry-fade,
  html.preloader-done .entry-fade { animation: none; }
}
```

## Usage (`ImageMarquee.tsx`)

```tsx
const BASE_DELAY = 1.2 // shortly after button starts, counted from `preloading-done`
const STAGGER = 0.05   // per-slide, left->right

<div className="entry-fade …" style={{ animationDelay: `${BASE_DELAY + i * STAGGER}s` }}>
  <MediaImage … />
</div>
```

## Panel wiring notes

- The "neutral" reveal — use it wherever an element is also being transformed by something else (carousels, parallax, marquees).
