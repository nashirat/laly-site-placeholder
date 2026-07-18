# Animation catalog

Every entry/reveal technique this project has used — current and archived — each documented in its own file with full source, so any of them can be re-implemented or swapped.

**Why this exists:** we have a **floating control panel** to A/B the reveal styles live and pick the best per surface (hero heading, body copy, section content). Each file below is self-contained enough to wire into that panel as one selectable option.

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

## Control-panel shape

Current implemented axes:

```
Heading:  [ fade-up | letters | mix ]
Sections: [ bracket + media | fade-up | brackets only ]
```

Implementation: `AnimationControlPanel` writes class names on `<html>` and persists to `localStorage`. Current scope is deliberately small: hero heading A/B plus section content levels. `mix` uses letter-by-letter heading, then fades desc and button together 0.3s after the heading starts, then carousel 0.6s after the heading starts. Default section mode keeps bracket animation and fades up only non-text content (`.section-media-reveal`) when 4% of that media block enters the viewport. Full fade-up includes text (`.section-text-reveal`) too, and text/media run together from the bracket wrapper observer after 0.4s. Brackets-only disables extra content motion.

## Design verdict so far

Team review (see HANDOVER.md): the letter-by-letter + per-section staggers read **tacky**; reference sites (karoverse, noart) animate **only brackets**. Current production choice = **fade-up for the hero, bracket-only + static for everything below the fold, fires once.** The archived variants are kept here precisely so that verdict can be re-tested, not lost.
