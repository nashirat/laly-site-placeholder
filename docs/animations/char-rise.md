# char-rise — per-letter masked rise

**Status:** Archived (deleted from code — kept here to re-test).
**Was used for:** hero heading (letter-by-letter ripple), briefly all section headings.
**Verdict:** flagged **tacky** in team review when used per-section. Fine as a rare hero-only flourish; wallpaper if repeated.

## What it does

Each letter is wrapped in its own inline-block span and rises up + un-squashes (`scaleY 0.5 → 1`) behind a per-word overflow mask, staggered by character index. Reads as a wave sweeping across the word.

## The non-obvious bits

- **Mask is per WORD, not per line.** A word never wraps inside itself, so the overflow-hidden mask stays intact at any viewport. A per-line mask leaks the moment the line wraps.
- **`scaleY(0.5)` un-squash is what caused the pixelation bug.** If the animation is *paused* (e.g. by a scroll gate using `animation-play-state: paused`) it keeps a compositor layer and rasterizes at half height, then stretches that stale bitmap on play → pixelated text. If you gate it, strip `animation-name` instead of pausing.
- Pure CSS + server component → fires at first paint, no hydration offset.

## CSS

```css
@keyframes char-rise {
  from { transform: translateY(60%) scaleY(0.5); }
  to   { transform: translateY(0)   scaleY(1); }
}
.char-rise {
  display: inline-block;
  transform-origin: bottom;
  animation: char-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; /* expo.out */
}
@media (prefers-reduced-motion: reduce) {
  .char-rise { animation: none; }
}
```

## Component (`TextReveal.tsx`)

```tsx
import { Fragment, type ElementType } from 'react'

// Masked, per-letter slide-up reveal (karocrafts.com SplitText style). Pure CSS → server component,
// fires at first paint. Mask is per WORD (a word never wraps inside itself).
export function TextReveal({
  lines,
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,       // base offset (cascade position)
  stagger = 0,     // seconds per char. 0 = line rises as one piece. Hero opts in explicitly.
  lineDelay = 0.25 // offset added per line
}: {
  lines?: string[]
  text?: string
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  lineDelay?: number
}) {
  const rows = lines ?? (text ? text.split('\n').map((s) => s.trim()).filter(Boolean) : [])
  return (
    <Tag className={className} aria-label={rows.join(' ')}>
      {rows.map((line, li) => {
        let ci = 0 // char index resets per line
        return (
          <span key={li} aria-hidden className="block">
            {line.split(' ').map((word, wi) => (
              <Fragment key={wi}>
                {wi > 0 && ' '}
                <span className="inline-block overflow-hidden">
                  {[...word].map((ch, i) => (
                    <span
                      key={i}
                      className="char-rise"
                      style={{ animationDelay: `${delay + li * lineDelay + ci++ * stagger}s` }}
                    >
                      {ch}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
        )
      })}
    </Tag>
  )
}
```

## Panel wiring notes

- Toggle `stagger` between 0 (whole line rises together) and ~0.05 (per-letter ripple) — that single number is the tacky/premium dial.
- Accessibility is handled: `aria-label` on the tag, `aria-hidden` on the split spans.
