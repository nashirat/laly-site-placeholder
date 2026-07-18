# Laly Agency — Website Handover

Pick-up doc for continuing on another machine. Snapshot as of the last session.

---

## What this is

Marketing website for **Laly Agency**. Next.js 15 (App Router) + React 19, Tailwind v4 (CSS `@theme`, no config file), Payload CMS planned but not yet installed. Built to be **Payload-ready** — the static homepage is prop-driven with typed content contracts, so wiring the CMS later is a data-source swap, not a rewrite.

**Top priority: Lighthouse Performance.** Every stack and animation choice is made to protect it (self-hosted fonts, minimal JS, no animation libraries — the reveals are hand-rolled CSS).

Reference project (pattern source, git-ignored): `sia-cms/` — the older Senft Legal build. Same stack minus localization and bloat.

Full build plan lives at `~/.claude/plans/in-this-project-we-iterative-puzzle.md` (Phases 1–4). This doc summarizes; that file is the source of truth for the roadmap.

---

## Hard constraints (read before touching anything)

- **bun only.** No pnpm/npm. No lockfiles from other managers. `sharp` is in `trustedDependencies` so its install script runs.
- **Builds happen on Windows, not WSL.** WSL cannot build this repo (a prior WSL `npm install` shredded `node_modules`). Run `bun install` / `bun run dev` / `bun run build` from Windows.
- **No localization**, no i18n routing.
- Tailwind breakpoints: default `md` (768) / `xl` (1280) / `2xl` (1536), plus custom `3xl` (1920) and `4xl` (2560). Responsive pattern is mobile → `md` → `3xl`.

---

## Where we are

**Phase 2 (static homepage) — in progress.** Payload (Phase 3/4) **not started** — no `@payloadcms/*` deps installed yet. Homepage renders from a local mock.

Homepage sections built (top to bottom), all with placeholder cards, real copy:

| Section | File | Ground | Notes |
|---|---|---|---|
| Hero | `src/components/sections/Hero.tsx` | cream `#fffcf9` | heading + desc + button + auto-scrolling image strip |
| Who We Are | `src/components/sections/WhoWeAre.tsx` | cream `#fcf7f3` | 2 stacked case-study card placeholders |
| Strategy | `src/components/sections/Strategy.tsx` | dark `#292624` | 3-across service card placeholders |
| About us | `src/components/sections/About.tsx` | cream `#fffcf9` | team-carousel placeholder |
| Contact | `src/components/sections/Contact.tsx` | pink `#ff6d6a` | oversized display heading, 2 CTAs, photo placeholder |

All sections are RSC taking a typed `content` prop. Mock data: `src/lib/mock/home.ts`. Content types: `src/lib/types.ts`.

---

## The animation model (important — it was heavily reworked)

Team review flagged the old motion as tacky/not-skimmable. Current model, after the rework:

**1. Hero entry is event-driven, not delay-driven.**
- The `Preloader` (`src/components/Preloader.tsx`) is a full-screen curtain that covers from first paint, holds, then slides up. When its slide-up `animationend` fires, it stamps `class="entered"` on `<html>`.
- Hero copy (`.entry-copy`) and the image strip (`.entry-fade`) animate **only** under `html.entered` (see `src/app/(frontend)/styles.css`). So the hero starts exactly when the preloader finishes — no hand-tuned delay guessing the curtain's duration.
- Base state = the animation's from-state, so attaching the animation causes no flash; JS-dead degrades to half-visible copy, not blank.
- Reduced-motion: Preloader adds `entered` immediately (curtain is `display:none`, so `animationend` never fires); a `setTimeout` is the safety net if the event is ever missed.
- Per-element sequencing is a small inline `animationDelay` (0 / .15 / .3s) counted from `entered`.

**2. Below-fold sections: bracket only, fires once.**
- The only motion is the bracketed eyebrow label (`[ WHO WE ARE ]`, `src/components/ui/BracketLabel.tsx`) wiping in — a pure-CSS `@property --x-translate` + clip-path effect (recreated from karocrafts.com without GSAP).
- Heading / desc / cards render **static** (no entry animation). This was a deliberate call: reference sites (karoverse, noart) animate only brackets; per-section content motion read as tacky.
- `src/components/ui/InView.tsx` is an IntersectionObserver gate that adds `.is-visible` to release the bracket. **Fires once** — disconnects on first intersection, never replays on scroll-back.

**3. Smooth scroll:** Lenis, `src/components/SmoothScroll.tsx`. Animates real `scrollTop` (so IntersectionObserver + `position:fixed` keep working). Bails entirely under reduced-motion. Its CSS is inlined in `styles.css`.

**4. Scroll resets to top on refresh:** `history.scrollRestoration = 'manual'` in `SmoothScroll.tsx`.

`src/lib/motion.ts` now holds only `PRELOADER_HOLD` (the curtain's one timing knob). `ENTRY_BASE`, `SECTION_DELAY`, `SECTION_STEP` were all deleted along with the old per-letter reveal components (`TextReveal`/`LineReveal` — gone).

**Every animation technique this project has used — current and archived (char-rise, line-rise, fade-up, fade-in, bracket-label, static) plus the four orchestration models — is catalogued with full source in [`docs/animations/`](docs/animations/README.md).** The archived (deleted) ones are documented there so they can be re-tested, not lost. See [What's left](#whats-left) for the planned control panel that will A/B them.

---

## What was just done (last session)

1. Killed the letter-by-letter / staggered reveals everywhere (deleted `TextReveal.tsx`, `LineReveal.tsx`, and the `char-rise`/`line-rise` keyframes).
2. Below-fold sections → bracket-only, static content, fire-once (removed the rearm-on-scroll-back).
3. Retuned the entry fade to subtle (`opacity .5→1`, 0.6s).
4. **Reworked the hero entry to be state/event-driven** off the preloader's `animationend` (`html.entered` gate) instead of a magic delay number.

---

## What's left

**Immediate / this phase:**
- **Real card content** (currently all placeholders). Each section's real cards bring their own field shape:
  - Who We Are → case-study cards (image + copy + stat + "Explore" link)
  - Strategy → 3 service pillars (title + pill list + hook + arrow link + body)
  - About → team carousel (member photo, name, role, prev/next arrows, "Our Story" button)
  - Contact → real team photo + social icons row (no assets yet)
- **Contact heading** gets a bespoke animation later (currently static, reserved).
- **Floating animation control panel** — a dev-only floating panel to switch reveal style (char-rise / line-rise / fade-up / fade-in / static) and orchestration (paint-clock / delay-cascade / event-gate / inview-gate) live, plus stagger/duration sliders, to pick the best per surface. All the options are documented in [`docs/animations/`](docs/animations/README.md), which includes a suggested panel shape (two dropdowns writing to `<html>` classes / CSS vars, persisted to `localStorage`).
- **`/alternative` route** — parked. A second homepage variant to A/B the motion. User will spec it.
- **Lighthouse re-check** of the font preload. Three Neue Haas weights (400/500/700) currently preload (~50KB critical path); only 500 is above the fold. If flagged, split 400/700 into a second `localFont` with `preload:false` (below-fold late swap is invisible). See the comment in `src/app/(frontend)/components/Fonts/index.tsx`.

**Later (Payload — Phase 3/4, not started, blocked until cards are real):**
- Install Payload 3.47 + `@payloadcms/db-mongodb` + `@payloadcms/storage-vercel-blob` + `@payloadcms/richtext-lexical`.
- `src/payload.config.ts`, `(payload)` route group, collections (Users, Media, Pages), globals (Header, Footer), blur-hash hook (user has own plugin to drop in).
- Convert `page.tsx` → `[[...slug]]/page.tsx` fetching via Payload Local API; block dispatcher; seed homepage doc from mock; delete `src/lib/mock/home.ts`.
- Blocked deliberately: modeling collections around empty placeholder divs means modeling them twice.

---

## Running it (on Windows)

```bash
bun install          # first time on a new machine
bun run dev          # http://localhost:3000
bun run build        # production build — run before handing off, must be clean
```

If you hit `Invalid or unexpected token` from a `layout.js` line (Next's own webpack eval, not our code) after adding a dep: stale `.next` cache — `rm -rf .next` and restart dev.

---

## Key files map

```
src/
  app/(frontend)/
    layout.tsx              # html/body, fonts, renders SmoothScroll + Preloader + Header
    page.tsx                # homepage — renders the 5 sections from mock
    styles.css              # @theme tokens, Lenis CSS, ALL keyframes + the entry/bracket gates
    components/Fonts/        # self-hosted next/font (Neue Haas, New Spirit, Geist Mono)
  components/
    Preloader.tsx           # curtain + stamps html.entered (hero start signal)
    SmoothScroll.tsx        # Lenis driver + scroll reset
    ImageMarquee.tsx        # hero auto-scroll strip (Embla)
    Header.tsx, NavMenu.tsx
    sections/               # Hero, WhoWeAre, Strategy, About, Contact
    ui/
      BracketLabel.tsx      # the [ ... ] eyebrow (CSS @property animation)
      InView.tsx            # scroll gate, fires once
      Button.tsx
    Media/Image.tsx         # the one next/image wrapper (Payload swap seam)
  lib/
    motion.ts               # PRELOADER_HOLD (only timing constant left)
    types.ts                # content contracts (match future Payload block shapes)
    mock/home.ts            # stand-in homepage data (Phase 4 deletes this)
```
