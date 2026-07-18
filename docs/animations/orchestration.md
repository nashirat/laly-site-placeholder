# Orchestration — WHEN a reveal fires

The reveal technique (the *what* — char-rise, fade-up, …) is independent of the clock that triggers it (the *when*). This project has used four orchestration models. The control panel should expose this as a separate axis from the reveal style.

---

## 1. Paint-clock (pure CSS, inline delay)

The animation runs at first paint via `animation-delay`. No JS. All animations share one timeline and stay aligned by arithmetic.

- **Pro:** zero hydration offset, fires before JS, cheapest.
- **Con:** the delay is a magic number you must hand-tune to match whatever it's waiting for (e.g. the preloader). If that thing's duration changes, every delay drifts.
- **Was used for:** the original hero cascade (`ENTRY_BASE = 1.2s` + per-element offsets).

```tsx
<h1 className="fade-up" style={{ animationDelay: `${ENTRY_BASE}s` }}>…</h1>
```

---

## 2. Delay-cascade (paint-clock, layered offsets) — ARCHIVED

A structured set of paint-clock delays so a section's label → heading → desc → cards enter as one overlapping movement. Deleted when below-fold content went static.

```ts
// motion.ts (deleted)
export const SECTION_STEP = 0.2          // card-to-card + line-to-line offset
const AFTER_LABEL = 0.7                   // the single pacing knob
export const SECTION_DELAY = {
  label:   0,
  heading: AFTER_LABEL,        // 0.7
  desc:    AFTER_LABEL + 0.2,  // 0.9
  cards:   AFTER_LABEL + 0.3,  // 1.0, then cards stagger among themselves by SECTION_STEP
}
```

- **Pro:** rich, deliberately choreographed.
- **Con:** this is exactly what read **tacky / slow** in review. Lots of knobs, easy to overcook.
- **Lesson:** "overlapping, not queued" (each step starts a beat after the previous *starts*) was the fix for it feeling too slow — but the whole approach was ultimately dropped.

---

## 3. Event-gate (`html.entered`) — CURRENT for the hero

State-driven, not delay-driven. The `Preloader` stamps `class="entered"` on `<html>` at the curtain's `animationend`; gated CSS animations run only under `html.entered`. The hero starts *exactly* when the preloader is done — retune the curtain and the hero follows for free, no magic number.

```tsx
// Preloader.tsx (client)
onAnimationEnd={(e) => {
  if (e.animationName.includes('preloader-up')) {
    document.documentElement.classList.add('entered')
  }
}}
```
```css
html.entered .entry-copy { animation-name: fade-up; … }
```

- Reduced-motion: the curtain is `display:none` (no `animationend`), so the Preloader adds `entered` immediately on mount. A `setTimeout` fallback covers a missed event.
- **Base state must equal the keyframe's from-state** so attaching the animation causes no flash, and JS-dead degrades gracefully. See [fade-up.md](fade-up.md).

---

## 4. InView-gate (IntersectionObserver) — CURRENT for below-fold

A per-section observer adds `.is-visible` when the section scrolls into view, releasing its bracket. **Fires once** — disconnects on first intersection (replaying on scroll-back read as tacky).

```tsx
// InView.tsx
const io = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) {
    setVisible(true)
    io.disconnect() // played once — never rearm
  }
})
```

- **Earlier version rearmed** (`setVisible(false)` when the section went fully below the viewport again). Removed — animations should fire once.
- **Gate must strip `animation-name`, not use `animation-play-state: paused`.** A paused transform animation keeps a compositor layer and can rasterize a mid-animation frame (this is what pixelated char-rise). `none → keyframe` also restarts from t=0 for free.

---

## Summary for the panel

| Model | Trigger | JS? | Fires |
|---|---|---|---|
| paint-clock | first paint + delay | no | once |
| delay-cascade | first paint + layered delays | no | once |
| event-gate | preloader `animationend` → `html.entered` | yes | once |
| inview-gate | IntersectionObserver → `.is-visible` | yes | once (disconnects) |

Any reveal technique can pair with any of these. The tacky-vs-premium verdict lives mostly in the **reveal + stagger**, not the orchestration — but the orchestration decides whether the timing feels intentional or guessed.
