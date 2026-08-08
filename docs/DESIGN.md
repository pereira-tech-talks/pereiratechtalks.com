# DESIGN.md — Pereira Tech Talks design system

> Interface-design context for AI coding agents. When generating or editing any
> user-facing UI in this repo, follow this file. Prefer the named `--ptt-*`
> tokens below over ad-hoc values.
>
> **Profile:** `visual-ui` only. This repo has no styled-CLI surface (no
> chalk/ora/picocolors; `scripts/*.mjs` use plain `console.log`) and no
> conversational surface (no chat/email SDK — `functions/api/contact.ts` is a
> plain form handler), so those profiles are not applied.
>
> **Sources of truth:** [`../src/styles/global.css`](../src/styles/global.css)
> (Tailwind 4 `@theme` block) and [`BRAND_GUIDE.md`](BRAND_GUIDE.md). This file is
> the *operational contract* for agents; `BRAND_GUIDE.md` carries the wider brand
> rationale, logo rules, and per-edition kits. Refresh with `/design-system`.

## Overview

Pereira Tech Talks is a warm, community-first developer community in Pereira,
Colombia, with international reach. The visual identity is a **deep petroleum
teal** primary (calm, modern, technical) paired with a **warm amber** accent
(community, warmth), over a **near-white canvas** in light mode and a **deep
green-teal canvas** in dark mode — never pure black. The design is content-first
and generous with whitespace: static-rendered pages, hairline borders, restrained
elevation, and motion used only as punctuation. Every surface must work in light
**and** dark mode, and every string must exist in Spanish (primary) and English.

## Colors

Declared as `--color-ptt-*` in the `@theme` block of `src/styles/global.css`;
Tailwind 4 generates `bg-ptt-*` / `text-ptt-*` / `border-ptt-*` utilities. Dark
mode is class-based (`darkMode: ['class']`) and swaps the same token names under
`.dark`, so **components never need `dark:` variants for palette tokens** — use
`bg-ptt-bg` and it re-skins automatically.

| Token | Light | Dark | Role / usage |
|---|---|---|---|
| `ptt-primary` | `#1F6F73` | `#3FA8AD` | Brand color — CTAs, links, focus rings |
| `ptt-primary-strong` | `#155054` | `#5BBFC4` | Hover · active · pressed |
| `ptt-primary-soft` | `#E1F2F1` | `#0F2A2C` | Tints · badges · subtle surfaces |
| `ptt-accent` | `#E8A33D` | `#F4B95C` | Warm highlights — icons, pills, large text **only** |
| `ptt-bg` | `#FAFBFB` | `#08191A` | Page background |
| `ptt-bg-elevated` | `#FFFFFF` | `#0F2A2C` | Cards · modals |
| `ptt-bg-dark` | `#08191A` | `#08191A` | Always-dark hero canvas (identical in both modes) |
| `ptt-border` | `#E2E8E8` | `#1E3D40` | Dividers · card hairlines |
| `ptt-border-strong` | `#C9D4D5` | `#2A5256` | Emphasized dividers |
| `ptt-text` | `#0F2A2C` | `#E8F0EF` | Primary body text · headings |
| `ptt-text-secondary` | `#4A6164` | `#B5C7C9` | Secondary text — meets AA |
| `ptt-text-muted` | `#6E8589` | `#8FA3A6` | Metadata · **large text only** |
| `ptt-success` | `#2E8757` | `#4FB07F` | Success states |
| `ptt-warning` | `#C68417` | `#E2A848` | Warnings |
| `ptt-danger` | `#B83A3A` | `#E0635F` | Errors · destructive actions |
| `ptt-info` | `#1F6F73` | `#3FA8AD` | Informational (aliases primary) |

**Contrast contract.** `ptt-text` and `ptt-text-secondary` on `ptt-bg` /
`ptt-bg-elevated` meet WCAG AA (≥ 4.5:1). `ptt-accent` on `ptt-bg` is **~2.4:1
and fails AA** — never body text. `ptt-text-muted` is for large or decorative
text only.

**Two extras exist for edge cases:** `ptt-primary-dark` (`#3FA8AD`) and
`ptt-accent-dark` (`#F4B95C`) are fixed utilities that don't flip with the mode —
use them when a component sits on a dark canvas (e.g. `bg-ptt-bg-dark` hero)
while the page is in light mode.

**Legacy aliases** `--color-main` / `--color-secondary` / `--color-gray-50` are
transitional remaps to the PTT brand. **Never use them in new components.**

## Typography

Public pages use **Atkinson Hyperlegible** (`--font-sans` in `global.css`),
loaded from `public/fonts/atkinson-{regular,bold}.woff` with `font-display: swap`.
Fallbacks: system UI sans. Do **not** introduce Inter or another display family
on public chrome without updating this contract and the Brand Guide together.

| Level | Size / weight / tracking | Used for |
|---|---|---|
| Display / H1 | `text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight` | Hero, page title |
| Section H2 | `text-3xl sm:text-4xl font-bold tracking-tight` | `Section.astro` titles |
| H3 | `text-xl font-semibold` | Sub-sections, card titles (large) |
| H4 | `text-lg font-semibold` | Card titles |
| Body | `text-base leading-relaxed` | Paragraphs, featured descriptions |
| Lead | `text-lg text-ptt-secondary` | Section subtitles, intros |
| Small | `text-sm` | Meta, captions, secondary card body |
| Eyebrow | `text-sm font-semibold uppercase tracking-widest` | Kickers (`Eyebrow` / Section) |
| Caption | `text-xs font-semibold uppercase tracking-widest` | Dense meta only (year pills, badges) — **never** primary readable body |
| Mono | `font-mono text-sm` | Code |

**Hard rules**

- Never use arbitrary sizes below `text-xs` for UI copy (`text-[11px]`, `text-[10px]`).
- Primary paragraphs use **Body** (`text-base`), not `text-sm`.
- Eyebrows stay `text-sm` for WCAG readability on colored/dark heroes.
- Long-form content uses `@tailwindcss/typography` (`.prose`).

> Historical note: Brand Guide once listed Inter Variable; Atkinson was declared
> but unused. As of this plan, Atkinson is wired via `--font-sans` and is the
> single shipped family for public UI.

## Layout & spacing

- **Spacing scale — 4px base:** `1 (4px) · 2 (8px) · 3 (12px) · 4 (16px) ·
  6 (24px) · 8 (32px) · 12 (48px) · 16 (64px) · 20 (80px) · 24 (96px)`.
- **Dominant rhythm in practice:** `py-16` for major sections (`py-12` / `py-20`
  as the tighter/looser variants), `gap-6` for card grids, `gap-4` for inline
  clusters.
- **Containers:** `.main-container` (`max-w-7xl mx-auto py-4 px-4 md:px-6`, defined
  in `global.css`) is the page shell (1280px). Content widths: `max-w-3xl` for prose/reading,
  `max-w-5xl`–`max-w-6xl` for grids and directories; keep reading columns narrow on long-form pages.
- **Whitespace principle:** let sections breathe vertically; the canvas is the
  separator. Reach for spacing before adding a border or a shadow.

## Elevation & depth

Depth is **restrained and mostly hairline-based**. The canvas/elevated pair
(`ptt-bg` → `ptt-bg-elevated`) plus a `border-ptt-border` hairline does most of
the work; shadows are an accent, not the structure.

- `shadow-sm` — the default for cards, buttons, and resting surfaces (most common).
- `shadow-md` → `shadow-lg` — hover lift on interactive cards, dropdowns, popovers.
- `shadow-xl` / `shadow-2xl` — reserved for modals and overlays only.

In dark mode shadows read weakly against `#08191A`; prefer raising
`bg-ptt-bg-elevated` and a `border-ptt-border` hairline over deepening a shadow.

## Shapes

Radius scale: `sm (4px) · md (8px) · lg (12px) · xl (16px) · 2xl (24px) · full`.

The corner language is **soft**: `rounded-full` for pills, badges, avatars, and
buttons (by far the most used); `rounded-xl` / `rounded-2xl` for cards and
panels; `rounded-lg` for inputs and smaller surfaces; `rounded-md` sparingly.
Borders are single-pixel hairlines in `ptt-border` — no heavy strokes.

## Components

Described in terms of the tokens above. Reuse these patterns rather than
re-deriving them; canonical live examples are the `src/components/ui/` primitives
and `src/components/pages/*Page.astro`.

- **Button (primary)** — `inline-flex items-center gap-2 rounded-full
  bg-ptt-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm
  transition-colors hover:bg-ptt-primary/90 focus-visible:outline-2
  focus-visible:outline-offset-2 focus-visible:outline-ptt-primary`, plus
  `dark:bg-ptt-primary-dark dark:text-gray-950 dark:hover:bg-ptt-primary-dark/90`
  so the label stays legible on the lighter dark-mode teal. See
  `src/components/ui/EmptyState.astro:55`.
- **Pill / badge** — `rounded-full px-3 py-1 text-xs font-semibold uppercase
  tracking-wider`; primary variant `bg-ptt-primary text-white`, soft variant
  `bg-ptt-primary-soft text-ptt`. Amber is allowed here (pill on
  `ptt-bg-elevated`), never as loose body text. See `src/components/ui/Pill.astro`.
- **Card / surface** — `bg-ptt-bg-elevated border border-ptt-border rounded-xl`
  (or `rounded-2xl`) `shadow-sm`, with `hover:shadow-md transition-shadow` when
  the whole card is a link. Card titles `text-lg font-semibold text-ptt`, body
  `text-sm text-ptt-secondary`.
- **Input** — `rounded-lg border border-ptt-border bg-ptt-bg-elevated px-4 py-2.5
  text-base text-ptt`; always pair with a real `<label>` and an `autocomplete`
  attribute. Error state uses `ptt-danger` for both the border and the message.
- **Focus ring (global)** — `global.css` applies
  `focus-visible:ring-2 focus-visible:ring-ptt-primary focus-visible:ring-offset-2`
  to `a, button, input, select, textarea, [role="button"]`. **Don't remove it**;
  components that need a different treatment use `focus-visible:outline-*` in the
  brand color (as the primary button does).
- **Nav / header** — `Header.svelte` + `MobileMenu.svelte`. Dropdowns use the
  **disclosure pattern** (`aria-expanded` + `aria-controls`), never `role="menu"`.
  Header, footer, language switcher, and theme toggle always keep the **global**
  PTT palette — including on Pereira Tech Day edition pages.

### Chrome personality

Site chrome (header, footer, language switcher, theme toggle) reads the user
theme and stays on the **global PTT palette** — never an edition kit.

- **Header** — `Header.svelte`. Light: `bg-ptt-bg-elevated/95` with
  `logo-color.png` / `logo-vertical-color.webp` (`dark:hidden`). Dark: `bg-ptt-bg-dark/95` with
  `logo-white.png` / `logo-vertical-white.webp` (`dark:block`). Nav links inherit via `.nav-link` in
  `global.css` (`text-ptt-secondary` → `dark:text-white/85`).
  Vertical marks: regenerate with `node scripts/generate-ptt-logo-variants.mjs`.
  Light chrome wordmarks (`topbar-logo-primary`, `logo-horizontal-primary`):
  `node scripts/generate-ptt-light-logos.mjs` (from archived `*-black.webp`).
- **Hero CTAs on dark canvases** — white pill buttons use
  `text-ptt-bg-dark`, **not** `text-ptt` — `text-ptt` auto-flips light in
  dark mode and becomes illegible on white. Accent pills pair
  `bg-ptt-accent text-ptt-bg-dark`. See `HeroSection.astro`.
- **Dark heroes** — body copy on photo/dark overlays uses `text-white/85` or
  `text-white/90`, not `text-gray-200` / `dark:text-gray-300` (fails the
  no-gray-muted rule on tinted backgrounds).
- **Theme toggle** — `ThemeToggle.astro` FAB: morphing SVG sun/moon icons only
  (no emoji), `bg-ptt-bg-elevated` + token borders. Icon/fab transitions are
  disabled under `prefers-reduced-motion: reduce` (see `global.css`).
- **PTD edition pages** — `EditionScope` skins only the edition body. Edition
  detail routes use `chrome="ptd-edition"` (`PtdEditionHeader`: `PTD {year}` +
  in-page anchors + previous editions + language switcher) instead of the
  global Meetups/Blog nav; footer stays
  global but the theme is locked (no ThemeToggle; 2024 dark / 2026 light).
  See Per-edition theming below.

### Per-edition theming

Pereira Tech Day editions ship their own `brandKit` in
`src/content/pereiraTechDays/{year}.{json,yaml}`. `EditionScope` writes the
overrides under `[data-edition-theme="{year}"]`, so the edition palette applies
**only inside the edition body**. Chrome renders as a sibling of that wrapper.
Edition detail pages swap the global header for `PtdEditionHeader` via
`MainLayout` `chrome="ptd-edition"`; footer and theme toggle stay global.
Editions may also override the heading family
(2024 uses `'Bebas Neue'`, uppercase, `tracking 0.18em`) — scoped the same way.
Every edition kit must clear WCAG AA before publishing.

## Responsive behavior

Default Tailwind breakpoints; the codebase is effectively **mobile-first with
three active steps** (`sm` 240 uses, `lg` 125, `md` 115, `xl` 7).

| Breakpoint | Min width | Notes |
|---|---|---|
| `sm` | 640px | Most-used step — stacked → inline, type bumps |
| `md` | 768px | `.main-container` padding `px-4` → `px-8`; prose figure constraints (`.fig-narrow-70/60`); table horizontal scroll disengages |
| `lg` | 1024px | Multi-column grids, desktop nav replaces mobile menu |
| `xl` | 1280px | Rare — wide-canvas refinements only |

Touch targets are ≥ 44×44px. Wide content must scroll inside its own container
(`.table-responsive`), never the page body — verified by the Playwright
overflow suite down to 280px (Galaxy Z Fold folded, iPhone SE).

### Homepage hero viewport contract

The home hero fills the **remaining viewport below sticky chrome**, not a fixed
`100vh` that ignores the header.

`--ptt-chrome-height` is set on `:root` by an inline script in `MainLayout`
that measures `[data-ptt-chrome]` (notification bar + header) via
`ResizeObserver`. When the top notification bar collapses on scroll (or is
absent), the measured height updates and the hero grows/shrinks by the same
amount — chrome shrink and hero grow cancel, so content below the hero does
not jump. The same variable drives `html { scroll-padding-top }` (and
`scroll-mt-*` on `#main-after-hero`) so in-page anchors clear the sticky
chrome instead of landing underneath it.

| Chrome state | SSR fallback | Live value |
|---|---|---|
| Header only (no notification) | `4.25rem` | Measured header height |
| Header + top notification bar | `6.3rem` (`body.has-top-notification`) | Measured sticky chrome height |
| Bar collapsed after scroll | (same class; live measure) | Header height only |

Height uses `min-height: calc(100dvh − var(--ptt-chrome-height))` (`svh` as
cascade fallback before `dvh`). From `lg` upward the hero also locks exact
`height` so the first paint is one cinematic frame. Short viewports
(`max-height: 720px` / `560px`) hide the scroll cue / social row and clamp
description so CTAs stay in view. Narrow phones (`max-width: 379px`) stack
CTAs full-width.

**Motion:** `duration-fast 120ms` (hover, pill toggles), `duration-base 200ms`
(default transitions), `duration-slow 320ms` (modals, drawers). All non-essential
animation is gated by the global `prefers-reduced-motion: reduce` block in
`global.css`, which also disables `.animate-chevron-bounce`. Hero ken-burns and
scroll-chevron animations respect the same preference inside `HeroSection`.

## Do's and Don'ts

**Do**

- Use `--ptt-*` tokens and their `bg-ptt-*` / `text-ptt-*` / `border-ptt-*`
  utilities — they auto-flip for dark mode.
- Keep body text at WCAG AA (≥ 4.5:1): `text-ptt` and `text-ptt-secondary`.
- Give every `<img>` explicit `width` and `height`; add `decoding="async"` and
  `loading="lazy"` below the fold.
- Keep heading hierarchy strict (h1 → h2 → h3, no skipping) and use semantic
  landmarks.
- Prefer CSS over JS, and `.astro` over Svelte unless the component is genuinely
  interactive; when it is, use the laziest directive that works (`client:visible`
  / `client:idle`).
- Wrap Pereira Tech Day edition content in `<EditionScope>`, chrome outside it.

**Don't**

- **Don't** use `text-gray-400`, `text-gray-500`, `dark:text-gray-400`, or
  `dark:text-gray-500` for body text — fails AA and is forbidden by `AGENTS.md`.
- **Don't** use `ptt-accent` (amber) for body text — ~2.4:1 on `ptt-bg`.
- **Don't** set `--ptt-*` variables outside `src/styles/global.css` or a
  `[data-edition-theme]` scope — no inline `style="--ptt-primary: …"`.
- **Don't** let an edition palette reach the header, footer, language switcher,
  or theme toggle.
- **Don't** use the legacy `--color-main` / `--color-secondary` aliases, or raw
  hex values, in new components.
- **Don't** use pure black (`#000`) as a dark background — the PTT dark identity
  is `#08191A`.
- **Don't** use `role="menu"` for nav dropdowns — use the disclosure pattern.
- **Don't** remove the global `focus-visible` ring.
- **Don't** import Reveal.js CSS outside `SlideLayout.astro`.

## Agent prompt guide

**For coding agents working in this repo:** this `DESIGN.md` is the source of
truth for the visual UI. Before generating or editing any user-facing markup:

1. **Use the named tokens** — `ptt-primary`, `ptt-bg-elevated`, `ptt-text-secondary`,
   the 4px spacing steps, the radius scale. Don't introduce values outside this file.
2. **Pick by role, not by eye** — `ptt-primary` for actions and links,
   `ptt-danger` for destructive states, `ptt-accent` for warmth in icons/pills only.
3. **Keep integrity** — body text ≥ 4.5:1; both light and dark verified; images
   dimensioned; motion gated by `prefers-reduced-motion`.
4. **Match the documented patterns** — reuse the Button, Pill, Card, Input, and
   nav patterns above with their hover/focus/disabled states, and the
   `src/components/ui/` primitives that implement them.
5. **When something isn't covered**, choose the option most consistent with these
   conventions and note the gap rather than inventing an unrelated style.

Suggested instruction to paste into an agent prompt:

> "Follow `docs/DESIGN.md` strictly. Build the UI using its `--ptt-*` tokens,
>  roles, and documented component patterns; keep the integrity rules (WCAG AA
>  contrast, light + dark, reduced motion, edition-scoped palettes) intact."

Run `/design-system` to refresh this file after design changes.

---

**Related:** [`BRAND_GUIDE.md`](BRAND_GUIDE.md) ·
[`ACCESSIBILITY.md`](ACCESSIBILITY.md) · [`PERFORMANCE.md`](PERFORMANCE.md) ·
[`ARCHITECTURE.md`](ARCHITECTURE.md)
