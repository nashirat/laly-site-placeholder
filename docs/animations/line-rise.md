# line-rise — per-word masked rise

**Status:** Archived (deleted from code — kept here to re-test).
**Was used for:** body copy / descriptions (hero desc, section descs).
**Verdict:** softer than char-rise, but per-section repetition still read slow/tacky. Dropped with the rest of the staggered reveals.

## What it does

Each word sits in its own overflow-hidden mask and slides up from `translateY(100%)` to `0`, staggered by word index. Because wrapping puts later words on later rows, the stagger reads as a rise flowing **down** the paragraph — the per-line feel without any JS line-measurement.

## The non-obvious bits

- **Per-word masks, natural wrap, no authored line breaks.** A hard break authored for one viewport orphans words on every other one. Word masks stay correct at any width.
- Avoids JS line measurement, so it stays on the first-paint clock (server component) — no hydration offset.
- Whole word rises solid (no scaleY), so no pixelation risk like char-rise.

## CSS

```css
@keyframes line-rise {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
.line-rise {
  display: inline-block;
  animation: line-rise 1.2s cubic-bezier(0.22, 1, 0.36, 1) both; /* easeOutQuint */
}
@media (prefers-reduced-motion: reduce) {
  .line-rise { animation: none; }
}
```

## Component (`LineReveal.tsx`)

```tsx
import { Fragment, type ElementType } from 'react'

// Masked slide-up reveal for body copy. Pure CSS (server component, fires at first paint). Text wraps
// naturally; each WORD is its own mask and staggers by word index, so the rise flows down the wrap.
export function LineReveal({
  text,
  as: Tag = 'p',
  className = '',
  delay = 0,   // base offset (cascade position)
  stagger = 0  // seconds between words. 0 = paragraph rises as one. Hero opts in.
}: {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
}) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span aria-hidden className="inline-block overflow-hidden">
            <span className="line-rise" style={{ animationDelay: `${delay + i * stagger}s` }}>
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </Tag>
  )
}
```

## Panel wiring notes

- `stagger` 0 → whole paragraph rises together; ~0.03 → word-by-word wave down the wrap.
- Same accessibility handling as char-rise (`aria-label` + `aria-hidden`).
