# Animation catalog

Every entry/reveal technique this project has used — current and archived — each documented in its own file with full source, so any of them can be re-implemented or swapped.

**Why this exists:** we're going to build a **floating control panel** to A/B the reveal styles live and pick the best per surface (hero heading, body copy, section content). Each file below is self-contained enough to wire into that panel as one selectable option.

## The variants

| File | Technique | Status | Where |
|---|---|---|---|
| [char-rise.md](char-rise.md) | Per-letter masked rise (letter-by-letter) | **Archived** (deleted) | was hero heading |
| [line-rise.md](line-rise.md) | Per-word masked rise | **Archived** (deleted) | was body copy |
| [fade-up.md](fade-up.md) | Subtle opacity + translate | **Current** | hero copy |
| [fade-in.md](fade-in.md) | Opacity only | **Current** | image-strip slides |
| [bracket-label.md](bracket-label.md) | `[ … ]` bracket wipe (`@property` + clip-path) | **Current** | section eyebrows |
| [static.md](static.md) | No entry animation | **Current** | below-fold section content |

## Orchestration (WHEN a reveal fires — separate from WHICH reveal)

| File | Model | Status |
|---|---|---|
| [orchestration.md](orchestration.md) | paint-clock vs delay-cascade vs state-gate (`html.preloading-done`) vs InView-gate | mixed — see file |

A reveal technique (the *what*) is independent of the clock that triggers it (the *when*). The control panel should treat these as two separate dropdowns.

## Suggested control-panel shape (for later)

Two axes, per surface:

```
Reveal:        [ char-rise | line-rise | fade-up | fade-in | static ]
Orchestration: [ paint-clock | delay-cascade | event-gate | inview-gate ]
Stagger:       [ 0 … 0.08s ]   (per char/word/item)
Duration:      [ 0.3 … 1.2s ]
```

Cleanest implementation: a client context holding the current selection, written to CSS custom properties / class names on `<html>`, so the existing CSS gates (`.entry-copy`, `.reveal-gate`, etc.) switch without re-rendering the sections. Persist to `localStorage` so a refresh keeps the choice.

## Design verdict so far

Team review (see HANDOVER.md): the letter-by-letter + per-section staggers read **tacky**; reference sites (karoverse, noart) animate **only brackets**. Current production choice = **fade-up for the hero, bracket-only + static for everything below the fold, fires once.** The archived variants are kept here precisely so that verdict can be re-tested, not lost.
