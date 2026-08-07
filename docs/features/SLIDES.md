# Slides Feature — Multi-Type Deck Catalog

## Overview

The slides feature adds a **unified presentation deck catalog** to Pereira Tech Talks v3.0.0, integrated into the `/slides` and `/es/slides` routes. Three deck types coexist under a single Astro Content Collection:

| Type | When to Use | Renders As |
|---|---|---|
| `internal` | Author decks in Markdown with Reveal.js | Fullscreen Reveal.js presentation |
| `external-embed` | Third-party deck that supports iframe (Google Slides published, Speaker Deck) | Fullscreen iframe in the same chrome |
| `external-link` | Third-party deck without iframe support (private Drive, Google Docs) | Stub info page with CTA to external URL |

## Schema

The `slides` collection uses a Zod discriminated union defined in `src/content.config.ts`. The `type` field narrows which additional fields are required.

### Base Fields (all types)

```yaml
title: string (max 100)
description: string (130-160 chars)
pubDate: date
updatedDate: date (optional)
heroImage: string (optional)
tags: string[] (max 5, optional)
draft: boolean (default false)
eventName: string (optional)
eventDate: date (optional)
eventUrl: URL (optional)
relatedPost: string (optional, blog slug)
```

### Internal Deck

```yaml
type: internal
theme: dark | light (default: dark)
transition: none | fade | slide | convex | concave | zoom (default: slide)
syntaxHighlight: boolean (default: true)
math: boolean (default: false)
```

### External Link

```yaml
type: external-link
externalUrl: URL (required)
provider: string (optional, e.g. "google-slides")
```

### External Embed

```yaml
type: external-embed
externalUrl: URL (required, canonical link)
embedUrl: URL (required, iframe-friendly URL)
provider: string (optional)
aspectRatio: 16:9 | 4:3 | 1:1 (default: 16:9)
```

## Authoring Internal Decks

### File Location

Place deck files in `src/content/slides/{en,es}/` with date-prefix naming:

```
src/content/slides/en/2026-04-25_my-deck-slug.md
src/content/slides/es/2026-04-25_my-deck-slug.md
```

**Slugs must be English-only** on both language versions.

### Slide Separators

- `---` (three dashes on its own line) — horizontal slide separator
- `--` (two dashes on its own line) — vertical sub-slide separator

### Fragments (Click-to-Reveal)

```markdown
- First point <!-- .element: class="fragment fade-up" -->
- Second point <!-- .element: class="fragment fade-up" -->
```

Fragment animations: `fade-up`, `fade-in`, `fade-out`, `fade-in-then-out`, `grow`, `shrink`, `highlight-red`, `highlight-blue`, `strike`.

### Slide Attributes

```markdown
<!-- .slide: data-background-color="#1a1a2e" -->
<!-- .slide: data-background-image="url" data-background-opacity="0.3" -->
<!-- .slide: data-auto-animate -->
<!-- .slide: data-transition="zoom" -->
```

### Code Highlight with Stepped Reveal

````markdown
```typescript [1-2|4-6|8-10]
// Lines 1-2 highlighted first
// Then 4-6 on next click
// Then 8-10
```
````

### Custom Layouts with Tailwind

Markdown supports inline HTML. Use Tailwind utilities for custom layouts:

```html
<div class="grid grid-cols-2 gap-8">
  <div>Left column content</div>
  <div>Right column content</div>
</div>
```

### Speaker Notes

```markdown
Note: These are speaker notes visible only in speaker view (press S).
```

### Math (KaTeX)

Set `math: true` in frontmatter, then use LaTeX:

```markdown
$$e^{i\pi} + 1 = 0$$
```

## Theming & Tokens

The slide system v2 (April 2026) replaces ad-hoc inline styles with a token layer driven by CSS custom properties. Tokens live in `src/styles/slides.css` — imported only by `src/layouts/SlideLayout.astro` so Reveal.js styles never leak to non-deck routes.

### Token names

**Chrome (toolbar, back link):**

```
--slide-bg / --slide-surface / --slide-text / --slide-text-muted
--slide-accent / --slide-border
--slide-toolbar-bg / --slide-toolbar-fg / --slide-toolbar-fg-hover / --slide-toolbar-border
```

**Reveal.js (full set documented at https://revealjs.com/themes/):**

```
--r-background-color / --r-main-color / --r-heading-color
--r-link-color / --r-link-color-hover
--r-controls-color / --r-progress-color
--r-main-font / --r-heading-font / --r-code-font
--r-heading{1,2,3,4}-size / --r-main-font-size
--r-selection-background-color / --r-selection-color
```

### How light/dark cascade

`<html class="dark">` (set by the site's theme toggle) flips the `.dark` selector inside `slides.css`. Tokens redefine themselves; Reveal's variables override automatically; the body class `reveal-theme-{dark,light}` swaps backgrounds. There is **one** source of truth — change a token once, every deck and every primitive updates.

### Forced-readable rules

Slides with explicit dark backgrounds always render white text:

- `<!-- .slide: data-background-color="#1a1a2e" -->`
- `<!-- .slide: data-background-gradient="..." -->`
- `<!-- .slide: data-background-image="..." -->`
- `<!-- .slide: class="has-dark-background" -->` (manual override)
- `<!-- .slide: class="has-light-background" -->` (force dark text)

For text over arbitrary images/videos, drop the helper overlay class:

- `class="slide-bg-overlay--dark"` — 60% black scrim (image backgrounds composite over forced-black base for theme-independent rendering)
- `class="slide-bg-overlay--light"` — 65% white scrim

## Layouts Catalog

19 reusable layout primitives ship as Markdown snippets in `src/content/slides/_layouts/`. Each snippet is a copy-paste reference with a header describing when to use it. The `_layouts/` directory is excluded from the `slides` content collection glob, so snippets never appear as deck pages.

The kitchen-sink reference deck is `/slides/demo-revealjs-features` (and `/es/slides/demo-revealjs-features`).

| Primitive | When to use | Source |
|---|---|---|
| `title-hero` | Opening cover with title, subtitle, author, event | [`title-hero.md`](../../src/content/slides/_layouts/title-hero.md) |
| `section-divider` | Announce a new chapter / section | [`section-divider.md`](../../src/content/slides/_layouts/section-divider.md) |
| `two-column-split` | Compare two ideas, before/after, problem/solution | [`two-column-split.md`](../../src/content/slides/_layouts/two-column-split.md) |
| `three-column-cards` | Three parallel concepts with icon + title + body | [`three-column-cards.md`](../../src/content/slides/_layouts/three-column-cards.md) |
| `image-left` | Walk through screenshot/photo/diagram with text | [`image-left.md`](../../src/content/slides/_layouts/image-left.md) |
| `image-right` | Same with text-first reading flow | [`image-right.md`](../../src/content/slides/_layouts/image-right.md) |
| `image-full-bleed` | Image IS the message (hero, chart, photo) | [`image-full-bleed.md`](../../src/content/slides/_layouts/image-full-bleed.md) |
| `quote` | Single short pull quote + attribution | [`quote.md`](../../src/content/slides/_layouts/quote.md) |
| `code-with-callout` | Explain code with side-by-side notes | [`code-with-callout.md`](../../src/content/slides/_layouts/code-with-callout.md) |
| `big-stat` | A single big number that lands a point | [`big-stat.md`](../../src/content/slides/_layouts/big-stat.md) |
| `comparison-table` | 2-4 options across 3-5 attributes | [`comparison-table.md`](../../src/content/slides/_layouts/comparison-table.md) |
| `process-steps` | 3-5 step linear process or workflow | [`process-steps.md`](../../src/content/slides/_layouts/process-steps.md) |
| `timeline` | 4-8 dated events forming a story arc | [`timeline.md`](../../src/content/slides/_layouts/timeline.md) |
| `team-avatars` | Introduce your team or co-presenters | [`team-avatars.md`](../../src/content/slides/_layouts/team-avatars.md) |
| `closing-cta` | Final slide with CTA + contact channels | [`closing-cta.md`](../../src/content/slides/_layouts/closing-cta.md) |
| `video-centered` | Single video centered with title and optional caption | [`video-centered.md`](../../src/content/slides/_layouts/video-centered.md) |
| `video-left` | Video on left, text on right (mirrors image-left) | [`video-left.md`](../../src/content/slides/_layouts/video-left.md) |
| `video-right` | Text on left, video on right (mirrors image-right) | [`video-right.md`](../../src/content/slides/_layouts/video-right.md) |
| `image-centered` | Single image centered with title and optional caption | [`image-centered.md`](../../src/content/slides/_layouts/image-centered.md) |

Helper classes (`.slide-grid-2`, `.slide-grid-3`, `.slide-card`, `.slide-quote`, `.slide-stat`, `.slide-table`, `.slide-steps`, `.slide-timeline`, `.slide-team`, `.slide-cta`, `.slide-section-divider`, `.slide-image-full`, `.slide-video`, `.slide-caption-overlay`) are defined in `src/styles/slides.css`. All scale responsively (stack vertically below 768px) and use the token system.

## Backgrounds Catalog

8 background modes documented in `src/content/slides/_layouts/backgrounds/`. Each snippet documents its dark/light text contract.

| Mode | Snippet | Text contract |
|---|---|---|
| Solid color | [`solid-color.md`](../../src/content/slides/_layouts/backgrounds/solid-color.md) | Reveal auto-applies `has-dark-background` by luminance |
| Gradient | [`gradient.md`](../../src/content/slides/_layouts/backgrounds/gradient.md) | Forced white via `[data-background-gradient]` cascade |
| Image + text | [`image.md`](../../src/content/slides/_layouts/backgrounds/image.md) | Add `slide-bg-overlay--dark` for guaranteed contrast |
| Image fullscreen | [`image-fullscreen.md`](../../src/content/slides/_layouts/backgrounds/image-fullscreen.md) | No text — pure visual impact slide |
| Video + text | [`video.md`](../../src/content/slides/_layouts/backgrounds/video.md) | Must be muted to autoplay (iOS); same overlay rule |
| Video fullscreen | [`video-fullscreen.md`](../../src/content/slides/_layouts/backgrounds/video-fullscreen.md) | No text — cinematic mood slide; muted + looped |
| Pattern (CSS) | [`pattern.md`](../../src/content/slides/_layouts/backgrounds/pattern.md) | `slide-bg-pattern--dots` / `slide-bg-pattern--grid` helpers |
| Iframe | [`iframe.md`](../../src/content/slides/_layouts/backgrounds/iframe.md) | Heavy; X-Frame-Options blocks some sites |

### Gradient presets

```
Void-Navy:    linear-gradient(135deg, #0f1124 0%, #152e45 100%)
Warm sunset:  linear-gradient(135deg, #7c2d12 0%, #f59e0b 100%)
Brand:        linear-gradient(135deg, #0f1124 0%, #152e45 50%, #1a3a5a 100%)
Neutral:      linear-gradient(180deg, #1f2937 0%, #111827 100%)
Radial:       radial-gradient(circle at top, #d81540 0%, #0f1124 80%)
```

## Responsive Authoring

- **When to use Tailwind grid vs Reveal `r-stretch`:** use `.slide-grid-2` / `.slide-grid-3` for content layouts that should adapt to mobile (the helpers stack vertically below 768px). Use Reveal's `r-stretch` only when you want a single element to fill remaining vertical space (rare on slides).
- **Image sizing:** always include `width` and `height` attributes (CLS protection). Use `class="slide-image-full"` for a full-width image with shadow + rounded corners. For backgrounds, `data-background-size="cover"` works at every viewport; switch to `"contain"` for tall portrait images.
- **Font scaling:** Reveal scales the slide container based on viewport; let it do the work. Use `em` (not `px`) for content text inside slides so it scales with the deck.
- **Mobile fallbacks:** tables shrink font-size below 640px (`.slide-table` rule). Process steps switch to vertical below 768px. Three-column grids stack at the same breakpoint.
- **Verify before shipping:** open every new slide at 375px / 768px / 1440px in both light and dark themes. Don't ship visual work without a real browser pass.

### Vertical centering and images (Reveal.js)

Reveal’s default `center: true` positions each slide by setting an inline `top` on `<section>`:

`top = max((slideHeight − section.scrollHeight) / 2, 0)` inside `layout()` (see Reveal source: `layout()` in `reveal.js`).

That runs **whenever `layout()` runs** — often **before** raster images have finished decoding. While `scrollHeight` is still too small, `top` is computed too large; after the image paints, the block sits **too low** with empty space above and the **bottom may clip** off the 1280×720 canvas. This is not a Tailwind bug; it’s a timing interaction with Reveal’s vertical centering.

**What we do:** `RevealDeck.svelte` wires `load` / `error` (once) on `<img>` elements in each slide and schedules `deck.layout()` on the next animation frame so centering uses the final `scrollHeight`.

**What authors should still do:** keep `width` and `height` on every `<img>` (intrinsic box before decode), avoid single-huge unbounded images without `max-height`, and use `.slide-content-top` when you intentionally want top-aligned content (see `src/styles/slides.css`).

If you add another Reveal host (second deck component), mirror the same image → `layout()` hook or you may see the regression again.

## Anti-patterns

| Don't | Do |
|---|---|
| `<h1 style="color:#fff">…</h1>` | `# …` — let `slides.css` cascade handle color via the `data-background-*` rules |
| `<div style="width:800px">…</div>` | Use a responsive helper (`.slide-grid-2`, `.slide-image-full`, etc.) so it adapts on mobile |
| Text directly on a busy photo | Add `class="slide-bg-overlay--dark"` (or `--light`) to the slide |
| `<img src="…">` without `width`/`height` | Always include both attributes — prevents layout shift |
| Skip a heading level (`h1` → `h3`) | Keep the hierarchy — speaker view and AEO twins read it |
| `style="background:#1a1a2e"` on a section | `<!-- .slide: data-background-color="#1a1a2e" -->` |
| Hardcoded English in the deck UI | Translate via `src/lib/translations/{en,es}.ts` |
| New deck in only one language | Both `src/content/slides/en/` and `es/` versions, identical slug |
| Image-only slide: huge empty area on top, image clipped at bottom after load | Reveal `center` uses `scrollHeight` before images decode — fixed globally in `RevealDeck.svelte` (`layout()` after `img` load); still author `width`/`height` and sensible `max-height` |

## SEO & AEO

Every internal deck ships with:

- **Per-deck `<title>`, meta description, keywords.** Keywords derived from frontmatter `tags` plus a base set per language (`SlideDeckPage.astro`).
- **Open Graph + Twitter card** via `BaseHead.astro`, including `heroImage` if defined in frontmatter.
- **Canonical URL** + **hreflang** to the alternate-language version.
- **JSON-LD `PresentationDigitalDocument`** with `name`, `description`, `datePublished`, `dateModified` (when `updatedDate` is set), `inLanguage`, `image`, `keywords`, `author`, `url`, plus `about: Event` if the deck has `eventName`.
- **Markdown twin endpoint** at `/slides/<slug>.md` (and `/es/slides/<slug>.md`) with a structured `## Metadata` block (type, language, dates, tags, event, related post, author) and the full slide body — the canonical AEO surface.
- **Sitemap inclusion** automatic via Astro's sitemap integration.

External-link decks emit `CreativeWork` JSON-LD instead of `PresentationDigitalDocument`. External-embed decks add `embedUrl` to their twin.

To improve a deck's AEO surface:

1. Write a tight `description` (130-160 chars) that summarizes the talk's thesis.
2. Set 2-4 specific `tags` — they become both keywords and JSON-LD entries.
3. If the deck reflects a published blog post, set `relatedPost: <blog-slug>` (no leading `/blog/`).
4. If you update the deck, set `updatedDate` so `dateModified` lands in JSON-LD.

## Adding External Decks

### External Embed

1. Publish your deck for embedding (e.g., Google Slides: File > Share > Publish to web > Embed)
2. Copy the embed URL (the `src` from the iframe code)
3. Create the deck file with `type: external-embed`, `externalUrl` (canonical), and `embedUrl` (iframe)

### External Link

1. Get the URL to your deck (any format)
2. Create the deck file with `type: external-link` and `externalUrl`
3. The site renders a stub info page with a CTA button

### Tested Providers

- Google Slides (published embed)
- Speaker Deck
- Pitch

## Theming

Internal decks sync with the site's dark/light mode toggle:

- `SlideLayout.astro` loads `reveal.js/reveal.css` (base only) + custom `slides.css` (no official theme files)
- `RevealDeck.svelte` observes `<html class="dark">` changes via MutationObserver
- Theme switches instantly without page reload

## Reveal.js Configuration

RevealDeck.svelte initializes Reveal with these settings:

| Setting | Value | Rationale |
|---------|-------|-----------|
| `width` | 1280 | 16:9 widescreen, matches modern projectors |
| `height` | 720 | Standard 720p virtual canvas |
| `hash` | true | URL updates with slide number for sharing |
| `slideNumber` | `'c/t'` | Shows "current / total" counter |
| `controls` | true | Navigation arrows visible |
| `progress` | true | Bottom progress bar |
| `transition` | per-deck | Configurable via frontmatter |

### Font Sizing

- **Base font:** `--r-main-font-size: 32px` in the 1280×720 virtual canvas
- **h1:** 2.5em (80px effective) — titles, hero slides
- **h2:** 1.6em (51px effective) — section headings
- **h3:** 1.3em (42px effective) — sub-headings
- **h4:** 1em (32px effective) — detail headings

Reveal.js scales the entire canvas to fit the viewport. On a 1080p projector, scale ≈ 1.5×; on a 4K monitor, scale ≈ 3×. Content looks identical on every display.

### Post-Init Hooks

After `deck.initialize()`, RevealDeck runs:
- **Image background fix:** Sets `background-color: #000` on `.slide-background` elements for slides with `data-background-image`, ensuring the semi-transparent image composites over black regardless of theme. This makes light/dark mode look identical on image slides.

## Chrome UI

The slide chrome (back-link and toolbar) floats above the deck and auto-hides in fullscreen.

### Back Link (top-left)

- Displays the site logo (`/images/pereira-tech-talks/logo-white.webp`) with a `←` arrow
- **Always uses dark background** (`#0f1124`, the site's `bg-main` color) regardless of theme
- Inline `style="height:18px;width:auto;"` prevents FOUC before CSS loads
- Hidden on mobile (< 480px) — only the arrow shows
- Links to the slides catalog (`{prefix}/slides`)

### Toolbar (top-right)

- **Language toggle:** EN/ES switch linking to the alternate-language deck
- **Theme toggle:** Sun/moon icons show current state (sun = light mode, moon = dark mode)
- **Fullscreen:** Enter/exit fullscreen; hides both toolbar and back-link when active
- **Draft badge:** Purple badge appears when `draft: true`

### Slide Number (bottom-right)

- Dark translucent pill (`rgba(0,0,0,0.45)`) with white text
- Readable on any background (light slides, dark slides, images, gradients)
- Navigation arrows have `drop-shadow` for contrast on all backgrounds

## Performance

- **Asset isolation**: Reveal.js CSS and JS only load on internal deck pages. No Reveal bytes on home, blog, `/tech-talks` index, or any other route.
- **Build-time rendering**: Deck Markdown is embedded in static HTML. Reveal parses it on hydration.
- **Anti-FOUC**: Logo back-link uses inline `style="height:18px;width:auto;"` to prevent flash at native SVG size.
- **Lazy plugin loading**: Highlight and Math plugins loaded only when enabled in frontmatter.
- **`client:only="svelte"`**: RevealDeck uses `client:only` since Reveal needs DOM access.

## AEO Twins

Every deck has a Markdown twin endpoint:

- `/slides/<slug>.md` (EN)
- `/es/slides/<slug>.md` (ES)

Behavior per type:
- **Internal**: serves the raw Markdown body (human and agent readable)
- **External-link**: structured stub with title, description, event metadata, external URL
- **External-embed**: same stub plus embed URL

## i18n Conventions

- Both EN and ES versions required for all deck types
- Title, description, event metadata always translated
- External deck body can include `slides.languageNotice` when original is in a different language
- Slugs English-only (project rule)
- Spanish: tuteo only, full diacritics

## Images

Store deck images in `public/images/slides/<slug>/`:

```
public/images/slides/<slug>/hero.{webp,png,jpg}        # shared between EN and ES
public/images/slides/<slug>/hero-en.{webp,png,jpg}     # EN-specific (optional)
public/images/slides/<slug>/hero-es.{webp,png,jpg}     # ES-specific (optional)
```

### Per-language preview images

Each deck file (`en/<slug>.md` and `es/<slug>.md`) sets its own `heroImage`
in frontmatter — that's how per-language previews work. Reference whichever
file lives in the slug's folder. There is no `heroImageEs` field; the
language is implicit from the deck file's location.

Example — same hero for both languages:

```yaml
# src/content/slides/en/2026-04-25_demo.md
heroImage: /images/slides/demo/hero.webp

# src/content/slides/es/2026-04-25_demo.md
heroImage: /images/slides/demo/hero.webp
```

Example — different hero per language:

```yaml
# src/content/slides/en/2026-04-25_demo.md
heroImage: /images/slides/demo/hero-en.webp

# src/content/slides/es/2026-04-25_demo.md
heroImage: /images/slides/demo/hero-es.webp
```

### Optimization

The slide-image staging flow mirrors blog posts. Drop source files in the
slides staging directory using the `{slug}--{name}.{ext}` convention:

```
public/images/slides/_staging/demo--hero.png            # → demo/hero.{jpg|webp}
public/images/slides/_staging/demo--hero-en.png         # → demo/hero-en.{jpg|webp}
public/images/slides/_staging/demo--hero-es.png         # → demo/hero-es.{jpg|webp}
```

Then run:

```bash
pnpm run images:optimize:slides              # Process slide staging
pnpm run images:optimize:slides -- --webp    # Also generate WebP variants
pnpm run images:optimize:slides -- --dry-run # Preview without writing
```

The optimizer applies the same hero-aware presets (1400px landscape, 800px
square) and JPEG/WebP encoding settings used for blog posts. Optimized files
land in `public/images/slides/<slug>/` and are removed from `_staging/` on
success.

## Related

- [Blog Posts Guide](./BLOG_POSTS.md) — parallel content surface
- [Architecture Guide](../ARCHITECTURE.md) — Content Collections, layouts
- [I18N Guide](../I18N_GUIDE.md) — multilingual conventions
