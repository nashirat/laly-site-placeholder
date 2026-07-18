# static — no entry animation

**Status:** Current. Used for all below-fold section content (headings, descriptions, cards) in WhoWeAre / Strategy / About / Contact.
**Verdict:** the production default below the fold. Only the bracket label moves; the copy is just *there*.

## What it does

Nothing. The element renders at its resting state with no keyframe, no gate, no delay.

## Why it's a deliberate choice, not an absence

Team review: per-section content animation read as tacky and made the page feel slow to skim. Reference sites (karoverse, noart) animate **only** their brackets. So below-fold copy renders static and legible immediately — you can scan the page without waiting for anything. The only motion per section is the [bracket-label](bracket-label.md) wipe.

## Implementation

Plain elements, no animation class:

```tsx
<h2 className="font-display text-[32px] font-normal … md:text-6xl 3xl:text-7xl">
  {heading.split('\n').map((line) => (
    <span key={line} className="block">{line}</span>
  ))}
</h2>
<p className="mx-auto mt-6 max-w-[760px] font-sans …">{description}</p>
```

The `\n` in a heading is split into block spans so the authored line break survives; on mobile each line wraps beneath it.

## Panel wiring notes

- This is the "off" option in the Reveal dropdown — the baseline every other technique is measured against.
- Cheapest possible (no layer, no JS), so it's also the perf ceiling to compare against.
