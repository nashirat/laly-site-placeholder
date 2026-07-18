# bracket-label — `[ … ]` bracket wipe

**Status:** Current. The signature motion for section eyebrows (`[ WHO WE ARE ]`, `[ STRATEGY ]`, …).
**Verdict:** the one below-fold animation we kept. Reference sites (karoverse, noart) animate only this. Recreated from karocrafts.com **without GSAP** — pure CSS.

## What it does

Two brackets sit at the container's left/right edges. On reveal they slide inward toward the text while the label text itself wipes up from a clip-path mask. Reads as the brackets "snapping onto" the word.

## The non-obvious bits

- **`@property --x-translate` is what makes it work without JS.** An unregistered CSS custom property is an untyped string and won't interpolate. Declaring it `<number>` lets a plain CSS `transition` tween it — no GSAP loop (which is what karocrafts used).
- **`inherits: true` is mandatory.** The value is set on the container but *read* by its `::before`/`::after` (the brackets). Pseudos only see it by inheritance; `inherits: false` pins them to `initial-value` and they never move.
- **Brackets are `::before`/`::after`, spread by flex `justify-between`**, then pulled back by `--x-translate` (1 = stacked over the text center, 0 = resting at the edges).
- **`--ref-size: 50cqw`** = half the label's own width, derived via container query so the caller just sets a normal responsive width class and the travel distance follows. An element can't query itself, but its pseudos can query the container.
- The `0.325em` in the transforms is the bracket glyph's own width, backed out so the two meet flush instead of overlapping at center.
- **`white-space: pre`** — the space inside `"[ "` is meaningful (it's the gap).

## CSS

```css
@property --x-translate {
  syntax: "<number>";
  inherits: true;      /* MUST inherit — set on container, read by ::before/::after */
  initial-value: 1;
}
.bracket-label {
  container-type: inline-size;
  --ref-size: 50cqw;   /* half the label's own width */
  --x-translate: 1;
  white-space: pre;
  transition: --x-translate 1s cubic-bezier(0.87, 0, 0.13, 1); /* expo.inOut */
}
.bracket-label::before,
.bracket-label::after { display: block; } /* real flex items so justify-between spreads them */
.bracket-label::before {
  content: "[ ";
  transform: translateX(calc(var(--x-translate) * (var(--ref-size) - 0.325em)));
}
.bracket-label::after {
  content: " ]";
  transform: translateX(calc(var(--x-translate) * (var(--ref-size) * -1 + 0.325em)));
}
.bracket-label > * {
  transform: translateY(100%);
  clip-path: inset(0 0 100% 0);
  transition:
    transform 1s cubic-bezier(0.87, 0, 0.13, 1),
    clip-path 1s cubic-bezier(0.87, 0, 0.13, 1);
  transition-delay: 0.1s; /* text trails the brackets */
}

/* released by the scroll gate (see orchestration.md) */
.reveal-gate.is-visible .bracket-label { --x-translate: 0; }
.reveal-gate.is-visible .bracket-label > * {
  transform: translateY(0);
  clip-path: inset(0 0 0 0);
}

@media (prefers-reduced-motion: reduce) {
  .bracket-label { --x-translate: 0; transition: none; }
  .bracket-label > * { transform: none; clip-path: none; transition: none; }
}
```

## Component (`BracketLabel.tsx`)

```tsx
export function BracketLabel({ children, className = '' }: { children: string; className?: string }) {
  return (
    <div
      aria-label={children}
      className={`bracket-label mx-auto flex justify-between font-mono text-[16px] font-normal uppercase leading-[1.4] tracking-tight md:text-[18px] 3xl:text-[20px] ${className}`}
    >
      <p aria-hidden>{children}</p>
    </div>
  )
}
```

CMS value is the bare text (`"WHO WE ARE"`) — the `[ ]` are CSS pseudo content, never stored. Color + width come from the caller's className (`text-[#867A72] w-44 md:w-56 3xl:w-64`).

## Panel wiring notes

- Dials: transition duration (currently 1s), the easing, the text trail delay (0.1s).
- Triggered by the InView gate today; could also be triggered by `html.entered` if a bracket ever lives above the fold.
