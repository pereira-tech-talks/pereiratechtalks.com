# Brand & Style Guide — Pereira Tech Talks (v3.0.0)

This is the **single source of truth** for the Pereira Tech Talks (PTT) visual
identity. All AI agents, designers, and developers reference this document when
making UI, color, typography, content, or brand decisions.

> **Palette & tokens:** this guide (§ Color Palette) plus `src/styles/global.css`
> (`@theme` `--ptt-*` tokens) are canonical. For **voice & tone** (including
> meetup page copy), see [`docs/WRITING_VOICE_GUIDE.md`](WRITING_VOICE_GUIDE.md).

## Brand Identity

**Pereira Tech Talks (PTT)** is a developer and tech community based in Pereira,
Colombia, with a clear international reach. The community runs:

- Monthly meetups (open to everyone, in-person + online).
- Pereira Tech Day, a yearly flagship event with its own brand identity per edition.
- Programs (verticals): Speaker School, La Biblioteca del Mañana, AI Channel.
- A bilingual blog (Spanish primary, English first-class) and a slides catalog
  for talk decks.
- A Code of Conduct, a Contributing pipeline, and a transparent governance model.

### Mission

Help builders in Pereira (and beyond) grow into great speakers, teachers, and
operators by sharing tech knowledge in a warm, plurally-inclusive,
community-first environment.

### Visual identity in one line

A **deep teal/petroleum primary** (calm, modern, technical) paired with a
**warm amber accent** (community, warmth) over a **near-white canvas** in light
mode and a **deep green-teal canvas** in dark mode.

---

## Color Palette

### Global PTT primary palette — Light mode

| Swatch | Role | Hex | CSS var | Tailwind class | Usage |
|:------:|------|-----|---------|----------------|-------|
| ![#1F6F73](https://placehold.co/20x20/1F6F73/1F6F73.png) | **Primary** | `#1F6F73` | `--ptt-primary` | `bg-ptt-primary text-ptt-primary` | Brand color, CTAs, links, focus rings |
| ![#155054](https://placehold.co/20x20/155054/155054.png) | **Primary strong** | `#155054` | `--ptt-primary-strong` | `bg-ptt-primary-strong` | Hover · active · pressed |
| ![#E1F2F1](https://placehold.co/20x20/E1F2F1/E1F2F1.png) | **Primary soft** | `#E1F2F1` | `--ptt-primary-soft` | `bg-ptt-primary-soft` | Tints · badges · subtle backgrounds |
| ![#E8A33D](https://placehold.co/20x20/E8A33D/E8A33D.png) | **Accent** | `#E8A33D` | `--ptt-accent` | `bg-ptt-accent text-ptt-accent` | Warm complement · highlights · pills |
| ![#FAFBFB](https://placehold.co/20x20/FAFBFB/FAFBFB.png) | **Bg** | `#FAFBFB` | `--ptt-bg` | `bg-ptt-bg` | Page background |
| ![#FFFFFF](https://placehold.co/20x20/FFFFFF/FFFFFF.png) | **Bg elevated** | `#FFFFFF` | `--ptt-bg-elevated` | `bg-ptt-bg-elevated` | Cards · modals |
| ![#E2E8E8](https://placehold.co/20x20/E2E8E8/E2E8E8.png) | **Border** | `#E2E8E8` | `--ptt-border` | `border-ptt-border` | Dividers |
| ![#0F2A2C](https://placehold.co/20x20/0F2A2C/0F2A2C.png) | **Text** | `#0F2A2C` | `--ptt-text` | `text-ptt` | Primary body text · headings |
| ![#4A6164](https://placehold.co/20x20/4A6164/4A6164.png) | **Text secondary** | `#4A6164` | `--ptt-text-secondary` | `text-ptt-secondary` | Secondary body text |
| ![#6E8589](https://placehold.co/20x20/6E8589/6E8589.png) | **Text muted** | `#6E8589` | `--ptt-text-muted` | `text-ptt-muted` | Metadata · large text only |

### Global PTT primary palette — Dark mode

| Swatch | Role | Hex | Usage |
|:------:|------|-----|-------|
| ![#3FA8AD](https://placehold.co/20x20/3FA8AD/3FA8AD.png) | Primary | `#3FA8AD` | Lighter petroleum on dark |
| ![#5BBFC4](https://placehold.co/20x20/5BBFC4/5BBFC4.png) | Primary strong | `#5BBFC4` | Hover (brighter) |
| ![#0F2A2C](https://placehold.co/20x20/0F2A2C/0F2A2C.png) | Primary soft | `#0F2A2C` | Subtle surfaces |
| ![#F4B95C](https://placehold.co/20x20/F4B95C/F4B95C.png) | Accent | `#F4B95C` | Softer amber on dark |
| ![#08191A](https://placehold.co/20x20/08191A/08191A.png) | **Bg (deep green-teal)** | `#08191A` | Page background — **the PTT dark identity** |
| ![#0F2A2C](https://placehold.co/20x20/0F2A2C/0F2A2C.png) | Bg elevated | `#0F2A2C` | Cards |
| ![#1E3D40](https://placehold.co/20x20/1E3D40/1E3D40.png) | Border | `#1E3D40` | Dividers |
| ![#E8F0EF](https://placehold.co/20x20/E8F0EF/E8F0EF.png) | Text | `#E8F0EF` | Primary text |
| ![#B5C7C9](https://placehold.co/20x20/B5C7C9/B5C7C9.png) | Text secondary | `#B5C7C9` | Secondary text |
| ![#8FA3A6](https://placehold.co/20x20/8FA3A6/8FA3A6.png) | Text muted | `#8FA3A6` | Metadata |

### Color do's and don'ts

**Do:**
- Use `--ptt-primary` for CTAs, links, focus rings — it carries the brand.
- Use `--ptt-accent` (amber) sparingly for warmth — pills, highlights, decorative.
- Use `--ptt-bg-elevated` for cards on the canvas; never overlap solid `--ptt-primary` blocks without checking contrast.
- In dark mode, prefer the dark green-teal `--ptt-bg` (`#08191A`) — it carries the PTT identity. Never use pure black.

**Don't:**
- Use the amber accent for body text on `--ptt-bg` light mode — contrast is ~2.4:1 (fails AA). Reserve for large text, icons, or pills.
- Use `text-gray-400`, `text-gray-500`, `dark:text-gray-400`, or `dark:text-gray-500` for body text. Forbidden by `AGENTS.md` (fails WCAG AA).
- Mix the global PTT palette with a Pereira Tech Day edition palette on the same page outside `[data-edition-theme]` — see Per-edition kits below.

### CSS implementation (lands in Task 5)

```css
@theme {
  --color-ptt-primary:        #1F6F73;
  --color-ptt-primary-strong: #155054;
  --color-ptt-primary-soft:   #E1F2F1;
  --color-ptt-accent:         #E8A33D;
  --color-ptt-bg:             #FAFBFB;
  --color-ptt-bg-elevated:    #FFFFFF;
  --color-ptt-border:         #E2E8E8;
  --color-ptt-text:           #0F2A2C;
  --color-ptt-text-secondary: #4A6164;
  --color-ptt-text-muted:     #6E8589;
}

.dark {
  --color-ptt-primary:        #3FA8AD;
  --color-ptt-primary-strong: #5BBFC4;
  --color-ptt-primary-soft:   #0F2A2C;
  --color-ptt-accent:         #F4B95C;
  --color-ptt-bg:             #08191A;
  --color-ptt-bg-elevated:    #0F2A2C;
  --color-ptt-border:         #1E3D40;
  --color-ptt-text:           #E8F0EF;
  --color-ptt-text-secondary: #B5C7C9;
  --color-ptt-text-muted:     #8FA3A6;
}
```

---

## Typography

| Role | Family | Weight | Tailwind |
|------|--------|--------|----------|
| Display / H1 | `Atkinson` | 700 | `text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight` |
| Section H2 | `Atkinson` | 700 | `text-3xl sm:text-4xl font-bold tracking-tight` |
| H3 | `Atkinson` | 600 | `text-xl font-semibold` |
| H4 | `Atkinson` | 600 | `text-lg font-semibold` |
| Body | `Atkinson` | 400 | `text-base leading-relaxed` |
| Small | `Atkinson` | 400 | `text-sm` |
| Caption / Eyebrow | `Atkinson` | 600 | `text-sm font-semibold uppercase tracking-widest` |
| Mono | system mono | 400 | `font-mono text-sm` |

Use `text-ptt` for primary text, `text-ptt-secondary` for secondary, `text-ptt-muted` only for large/decorative text. **Never** use `text-gray-400` / `text-gray-500` for body text.

### Per-edition typography overrides

Pereira Tech Day editions can opt into a custom heading family. The 2024
edition uses `'Bebas Neue', 'Arial Black', sans-serif` with `uppercase` and
`tracking 0.18em`. The override is **scoped** by `[data-edition-theme]` and
never leaks to other pages. See [`features/PEREIRA_TECH_DAYS.md`](features/PEREIRA_TECH_DAYS.md) (added in Task 4/5).

---

## Spacing, radius, motion

### Spacing scale (4px base)

`0 · 1 (4px) · 2 (8px) · 3 (12px) · 4 (16px) · 6 (24px) · 8 (32px) · 12 (48px) · 16 (64px) · 20 (80px) · 24 (96px) · 32 (128px)`

### Radius scale

`none · sm (4px) · md (8px) · lg (12px) · xl (16px) · 2xl (24px) · full`

### Motion

| Token | Value | Use |
|---|---|---|
| `duration-fast` | `120ms` | Hover · pill toggles |
| `duration-base` | `200ms` | Default UI transitions |
| `duration-slow` | `320ms` | Modal · drawer · page transitions |

All animations gated by `prefers-reduced-motion: reduce`.

---

## Iconography

- Pack: **Lucide** (free, MIT, broad coverage).
- Sizes: `16 / 20 / 24 / 32` (px).
- Stroke width: `1.5` default · `2` for emphasis.
- Icon-only buttons require `aria-label`.

---

## Logo & assets

> Vertical and horizontal raster marks live in
> `public/images/pereira-tech-talks/`. Regenerate light/dark vertical variants
> with `node scripts/generate-ptt-logo-variants.mjs` (forces ink to white while
> preserving alpha). Regenerate light-mode chrome wordmarks (header/footer) in
> `--ptt-primary-strong` green with `node scripts/generate-ptt-light-logos.mjs` (keeps
> `*-black.webp` as archived sources). Prefer SVG sources when available under
> `public/images/brand/`.

### Variants

| Token | File(s) | Use on |
|-------|---------|--------|
| `logo-vertical-color` | `logo-vertical-color.{png,webp}` | Light backgrounds |
| `logo-vertical-white` | `logo-vertical-white.{png,webp}` | Dark backgrounds / photo heroes |
| `logo-color` / `logo-white` | legacy aliases of the vertical pair | Existing components |
| `logo-horizontal-primary` | `logo-horizontal-primary.webp` | Footer wordmark (light) — `#155054` |
| `logo-horizontal` | `logo-horizontal.webp` | Footer wordmark (dark / white ink) |
| `logo-horizontal-black` | `logo-horizontal-black.webp` | Archived black source (do not use in chrome) |
| `topbar-logo-primary` | `topbar-logo-primary.webp` | Header / mobile menu (light) — `#155054` |
| `topbar-logo` | `topbar-logo.webp` | Header / mobile menu (dark / white ink) |
| `topbar-logo-black` | `topbar-logo-black.webp` | Archived black source (do not use in chrome) |
| `icon-color` / `icon-white` | square mark only | Favicons, avatars, social cards |

### Usage rules

**Do:**
- Use `logo-vertical-color` / `*-primary` horizontal marks on light backgrounds.
- Use `logo-vertical-white` / white marks on dark backgrounds (incl. `--ptt-bg` dark).
- Use `icon-color` / `icon-white` for favicons, avatars, social cards.
- Maintain aspect ratio.
- Keep `*-black.webp` assets for regeneration — regenerate primary with the script above.

**Don't:**
- Stretch, distort, recolor, or apply effects (drop shadow, bevel) to the logo.
- Place the white logo on light backgrounds without a dark container.
- Re-create the logo from primitives — always use the source files.

### Per-edition logos

Each Pereira Tech Day edition may have its own poster art / hero treatment
(see e.g. PTD 2024 hero). The PTT logo always remains the umbrella mark and
should appear in the header / footer of every edition page.

---

## Per-edition brand kits (Pereira Tech Days)

Each Pereira Tech Day edition has **its own visual identity** scoped to
`/pereira-tech-days/{year}/*`. The header, footer, language switcher, and
theme toggle keep the global PTT brand even on edition pages.

### Scoping mechanism

CSS attribute scope on a wrapper element:

```css
[data-edition-theme="2024"] {
  --ptt-primary: #1F3F59;
  --ptt-accent: #F06D6D;
  --ptt-bg: #FEF7F3;
  --ptt-bg-elevated: #FFFFFF;
  --ptt-text: #1F3F59;
  --ptt-text-muted: #B66844;
  --ptt-border: #E8E2D9;
}

[data-edition-theme="2024"] :is(h1, h2, h3, h4, h5, h6) {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
```

Implemented at runtime by `<EditionScope edition={edition}>` (Task 5).

### Reference kit — Pereira Tech Day 2024

| Token | Value |
|---|---|
| Primary | `#1F3F59` |
| Accent | `#F06D6D` |
| Bg | `#FEF7F3` |
| Bg elevated | `#FFFFFF` |
| Text | `#1F3F59` |
| Text muted | `#B66844` |
| Border | `#E8E2D9` |
| Heading family | `'Bebas Neue', 'Arial Black', sans-serif` |
| Heading transform | `uppercase`, tracking `0.18em` |

### Adding a new edition kit

1. Add the content entry at `src/content/pereiraTechDays/{year}.{json,yaml}` per Task 4 schema.
2. Set `brandKit.paletteLight` (required); add `brandKit.paletteDark` only if needed.
3. Set `brandKit.typography.fontSources` if a custom heading font is needed.
4. Add hero / poster art under `public/images/pereira-tech-days/{year}/`.
5. Visit `/pereira-tech-days/{year}` in dev to verify.
6. Verify isolation: visit non-edition routes (`/`, `/blog`, `/about-us`) — they keep the global PTT brand.

---

## Brand voice

Voice must stay consistent with the **[Writing Voice Guide](WRITING_VOICE_GUIDE.md)** —
four anchors (warm, professional, plurally inclusive, community-driven), anti-AI-slop
rules, and author-mode flex. Summary for brand and UI copy:

### English (international)

- Warm, professional, plurally inclusive, community-driven.
- Direct address (we / you), concrete examples, real numbers, real names — only when evidenced.
- Avoid: corporate jargon, slogans, hype, stacked exclamation marks, emoji-only headlines.

### Spanish (regional Colombian, accessible to LATAM)

- Cercano, profesional, comunitario, plural e inclusivo.
- Voz activa, tuteo (`tú`), ejemplos concretos.
- Ortografía completa: ñ, áéíóú, ¿¡ — sin excepción. Nunca voseo (`tenés`, `podés`).
- Evitar: jerga corporativa, anglicismos innecesarios, signos de admiración acumulados.

### Meetup pages (collection)

Canonical event copy lives in `src/content/meetups/` (not the blog). Organization
**“we”**; short scene → what we ran → practical details → optional resources. Never
ship bodies that are only “Originally published on Meetup.com / Luma…”. Descriptions
130–160 characters per language. **Sponsored by** / **Patrocinado por** → sponsors;
allied communities stay “comunidades aliadas” / “allied communities”; PTT as organizer
is never a sponsor. No fake attendance or invented talk titles/people.

Full do/don't tables, meetup vs blog-recap modes, and the orthography hard rule:
[`docs/WRITING_VOICE_GUIDE.md`](WRITING_VOICE_GUIDE.md) (§2, §3, §9.1).

---

## Quick reference for AI agents

### Colors to use

```
Primary:       #1F6F73 (Petroleum Teal)  → bg-ptt-primary, text-ptt-primary
Primary dark:  #3FA8AD (lighter on dark) → auto-applied via .dark
Accent:        #E8A33D (Warm Amber)      → bg-ptt-accent (large text/icons)
Bg light:      #FAFBFB                   → bg-ptt-bg
Bg dark:       #08191A (deep green-teal) → bg-ptt-bg (auto in .dark)
Text light:    #0F2A2C                   → text-ptt
Text dark:     #E8F0EF                   → text-ptt (auto in .dark)
Secondary:     #4A6164 light · #B5C7C9 dark → text-ptt-secondary
Muted:         #6E8589 light · #8FA3A6 dark → text-ptt-muted (large text only)
```

### Always remember

- Every UI element supports light + dark via the auto-themed `--ptt-*` tokens.
- Do not use `text-gray-400` / `text-gray-500` / dark variants for body text.
- Per-edition styles only apply inside `[data-edition-theme]` — never globally.
- Edition detail pages use PTD chrome (`PtdEditionHeader`: `PTD {year}` + in-page anchors + previous editions + language switcher); theme is locked per edition (no ThemeToggle; dark for 2024, light for 2026) so the footer matches.
- Content must exist in both English and Spanish.

### Checklist for new UI work

- [ ] Uses `--ptt-*` tokens (no raw HEX, no legacy `bg-secondary` / `bg-main` aliases from earlier site versions).
- [ ] Light + dark mode tested.
- [ ] Body text contrast ≥ 4.5:1 (use `text-ptt`, `text-ptt-secondary`, NOT `text-gray-400/500`).
- [ ] Images have explicit `width` and `height`.
- [ ] Heading hierarchy h1 → h2 → h3 (no skipping).
- [ ] Spanish content has proper orthography.
- [ ] If on a Pereira Tech Day edition page, content is wrapped in `<EditionScope>` and chrome (header/footer) is outside.

---

## Related documentation

- [Information Architecture](INFORMATION_ARCHITECTURE.md) — Routes, navigation, breadcrumbs (Task 3).
- [Pereira Tech Days feature](features/PEREIRA_TECH_DAYS.md) — Per-edition theming runtime + content model (Tasks 4 + 5 + 12).
- [Slides feature](features/SLIDES.md) — Slides system + per-edition opt-in palette (Task 13).
- [Accessibility](ACCESSIBILITY.md) — WCAG AA rules.
- [Writing Voice Guide](WRITING_VOICE_GUIDE.md) — Voice & tone in EN + ES (meetup pages, blog, anti-slop).
- [Design System](DESIGN.md) — Agent-facing UI contract for `--ptt-*` tokens.
- [Standards](STANDARDS.md) — Coding conventions including styling.
- [Public Assets](features/PUBLIC_ASSETS.md) — Static asset inventory.
