---
name: add-slide-deck
description: Create slide decks — internal Reveal.js, external-embed, or external-link. Use proactively when creating new presentation decks.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
argument-hint: "[title, description, and type]"
# === Documentation (ignored by tools, useful for humans) ===
tier: 2
intent: create
max-files: 4
max-loc: 800
---

# Skill: Add Slide Deck

## Objective

Create multilingual slide decks (currently English + Spanish) for Pereira Tech Talks v3.0.0 using Astro Content Collections. Supports three deck types:

- **Internal** (default): Creates a Reveal.js Markdown deck with layout snippets from `_layouts/`.
- **External-embed**: Creates a deck file with `embedUrl` for iframe embedding (Google Slides, Speaker Deck, Pitch).
- **External-link**: Creates a deck file with `externalUrl` as a CTA stub info page.

The skill auto-detects the deck type based on the `$TYPE` parameter.

## Mandatory Invocation Policy (CRITICAL)

This skill is the mandatory workflow for creating new slide decks in this repository.

- All AI agents and assistants MUST use `/add-slide-deck` when creating new files in `src/content/slides/`.
- Do NOT create new deck files manually unless the user explicitly requests bypassing the skill.
- Always produce both language files (currently EN + ES) in the same task.
- If creation starts outside this skill, stop and switch to `/add-slide-deck` before writing files.

## Non-Goals

- Does NOT modify the Content Collections schema (`src/content.config.ts`)
- Does NOT create new tags (uses existing tags from `src/content/tags/`)
- Does NOT create or optimize images (use `/optimize-image` skill or `pnpm run images:optimize:slides`)
- Does NOT modify existing decks (use `doc-edit` for minor edits)
- Does NOT create pages or routes (deck routing is already handled by `src/pages/`)
- Does NOT create interactive Svelte components

## Tier Classification

**Tier: 2** - Standard

**Reasoning:** Creating multilingual deck files requires moderate reasoning for frontmatter accuracy, type-specific field selection, and natural translation. Internal decks additionally need slide structure scaffolding from layout primitives.

## Inputs

### Type Detection

| `$TYPE` value | Mode | What happens |
|---------------|------|--------------|
| `internal` (default) | Internal | Creates Reveal.js Markdown deck with scaffolded slide structure |
| `external-embed` | External embed | Creates deck file with `embedUrl` for iframe rendering |
| `external-link` | External link | Creates deck file with `externalUrl` as CTA stub |

### Parameters

#### Required (all types)

- `$TITLE`: Deck title *(required)*
- `$DESCRIPTION`: Deck description, 130-160 characters *(required)*

#### Common (all types)

- `$TYPE`: `internal` | `external-embed` | `external-link` (default: `internal`)
- `$SLUG`: Custom slug (default: kebab-case of title, English only)
- `$LANG`: Primary language, `en` or `es` (default: `en`). The other language version will be translated.
- `$PUB_DATE`: Publication date in YYYY-MM-DD format (default: today's date)
- `$TAGS`: Array of tag names (max 5, must exist in `src/content/tags/`)
- `$HERO_IMAGE`: Hero image path (from `public/`)
- `$DRAFT`: Boolean, marks deck as draft (default: `false`)
- `$EVENT_NAME`: Event where the talk was given (optional)
- `$EVENT_DATE`: Event date in YYYY-MM-DD (optional)
- `$EVENT_URL`: Event URL (optional)

#### Internal-only

- `$THEME`: `dark` | `light` (default: `dark`)
- `$TRANSITION`: `none` | `fade` | `slide` | `convex` | `concave` | `zoom` (default: `slide`)
- `$SYNTAX_HIGHLIGHT`: Boolean, enable code syntax highlighting (default: `true`)
- `$MATH`: Boolean, enable KaTeX math rendering (default: `false`)

#### External-embed-only

- `$EXTERNAL_URL`: Canonical URL to the deck *(required for external-embed)*
- `$EMBED_URL`: Iframe-friendly embed URL *(required for external-embed)*
- `$ASPECT_RATIO`: `16:9` | `4:3` | `1:1` (default: `16:9`)

#### External-link-only

- `$EXTERNAL_URL`: URL to the deck *(required for external-link)*
- `$PROVIDER`: Provider hint, e.g. `google-slides` (optional)

## Reference Documentation

**Source of truth** for all slide deck conventions:

- **[Slides Feature Guide](../../../docs/features/SLIDES.md)** — Schema, authoring, layouts catalog, theming, backgrounds, SEO/AEO, i18n, images
- **[Architecture Guide](../../../docs/ARCHITECTURE.md)** — Content Collections, layouts, project structure
- **[I18N Guide](../../../docs/I18N_GUIDE.md)** — Multilingual conventions

## Quick Reference

**File naming:** `YYYY-MM-DD_{slug}.md` (date prefix stripped from URLs)

**Directories:** `src/content/slides/en/` and `src/content/slides/es/`

**URL surface:** `/tech-talks/<slug>` (EN) and `/es/tech-talks/<slug>` (ES). The collection is named `slides` (internal); the URL is `/tech-talks/` (user-facing). Do NOT create `/slides/` routes.

**Images:** Stored in `public/images/slides/<slug>/`. Hero: `hero.{ext}`.

**Slugs:** MUST be English-only on both language versions.

**Tags:** All tags go in a single `tags` array. The tier (primary/secondary) is determined by the tags collection. Max 5 tags per deck.

**Layouts catalog (internal decks):** 15 reusable layout primitives in `src/content/slides/_layouts/`. Use them as copy-paste references when scaffolding slide structure.

### Frontmatter Templates

**Internal deck:**

```yaml
---
title: 'Deck Title'
description: 'A 130-160 char description.'
pubDate: '2026-01-31'
type: internal
theme: dark
transition: slide
syntaxHighlight: true
math: false
heroImage: '/images/slides/slug/hero.webp'
tags: ['tech', 'ai']
draft: false
eventName: 'Conference Name'
eventDate: '2026-01-31'
eventUrl: 'https://conference.example.com'
---
```

**External-embed deck:**

```yaml
---
title: 'Deck Title'
description: 'A 130-160 char description.'
pubDate: '2026-01-31'
type: external-embed
externalUrl: 'https://docs.google.com/presentation/d/...'
embedUrl: 'https://docs.google.com/presentation/d/.../embed'
aspectRatio: '16:9'
heroImage: '/images/slides/slug/hero.webp'
tags: ['tech']
draft: false
---
```

**External-link deck:**

```yaml
---
title: 'Deck Title'
description: 'A 130-160 char description.'
pubDate: '2026-01-31'
type: external-link
externalUrl: 'https://drive.google.com/...'
heroImage: '/images/slides/slug/hero.webp'
tags: ['tech']
draft: false
provider: 'google-slides'
---
```

## Steps

### Step 1: Analyze Input and Determine Type

1. Determine deck type from `$TYPE` (default: `internal`)
2. Validate required parameters for the chosen type:
   - Internal: `$TITLE`, `$DESCRIPTION`
   - External-embed: `$TITLE`, `$DESCRIPTION`, `$EXTERNAL_URL`, `$EMBED_URL`
   - External-link: `$TITLE`, `$DESCRIPTION`, `$EXTERNAL_URL`
3. Check existing decks in `src/content/slides/en/` to avoid slug conflicts
4. Check available tags in `src/content/tags/` — verify all provided tags exist
5. If a hero image is provided, verify it exists in `public/images/slides/`

```bash
# Check existing decks
ls src/content/slides/en/

# Check available tags
ls src/content/tags/

# Verify image assets if referenced
ls public/images/slides/ 2>/dev/null
```

### Step 2: Generate Slug and Verify Uniqueness

- Convert title to kebab-case for the slug (or use provided `$SLUG`)
- **Slugs MUST be English-only** — even for Spanish-language decks
- Ensure uniqueness among existing decks in `src/content/slides/en/`
- **File naming:** `YYYY-MM-DD_{slug}.md` (use `$PUB_DATE` as date prefix)

### Step 3: Create Primary Language File

Create `src/content/slides/{$LANG}/YYYY-MM-DD_{slug}.md` with the correct frontmatter for the chosen type.

**Image setup:** If a hero image is provided:
1. Verify the image folder exists: `public/images/slides/{slug}/`
2. Use path `/images/slides/{slug}/hero.{ext}` in frontmatter
3. **Multilingual hero:** If the hero image contains text that needs localization, ask the user for a language-specific variant. Save as `hero-es.{ext}` in the same folder and use the variant path in the ES frontmatter.

### Step 4: Scaffold Slide Structure (Internal Decks Only)

For internal decks, scaffold an initial slide structure using layout primitives from `src/content/slides/_layouts/`:

1. **Read layout snippets** from `src/content/slides/_layouts/` for reference
2. **Scaffold a minimal deck** using three foundational layouts:
   - `title-hero` — Opening cover slide with title, subtitle, author
   - `section-divider` — One section divider as a structural placeholder
   - `closing-cta` — Final slide with CTA and contact channels
3. **Separate slides** with `---` (horizontal separator) on its own line
4. Use the token-based theming system (no inline `style` attributes for colors)
5. Follow the anti-patterns table from the Slides Feature Guide

For external-embed and external-link decks, the body content is a brief description paragraph (no slide Markdown needed).

### Step 5: Create Translated Version (Other Language)

**MANDATORY:** Create the translated version in the other language directory.

- If primary is English → save in `src/content/slides/es/YYYY-MM-DD_{slug}.md`
- If primary is Spanish → save in `src/content/slides/en/YYYY-MM-DD_{slug}.md`
- Use the same date prefix and slug (English-only slug in both versions)

**Translation rules:**
- Translate IDEAS, not words — should read as if originally written in that language
- Translate: `title`, `description`, `eventName`, all body content (slide text)
- Preserve exactly: `pubDate`, `updatedDate`, `type`, `theme`, `transition`, `tags`, `draft`, URLs, code blocks
- `heroImage`: Use the same path as EN by default. If a `hero-es.{ext}` variant exists, use it in the ES frontmatter
- Adapt idioms and expressions to sound natural
- Use informal-professional register (tuteo: tú/tienes/puedes)
- **CRITICAL — No voseo:** NEVER use Argentine/Rioplatense voseo forms (vos, tenés, podés, sabés). Always use tuteo.
- When translating to Spanish, prefer Colombian Spanish phrasing
- Do NOT translate code blocks, CLI commands, technical terms, product names
- **CRITICAL — Spanish orthography:** ALL Spanish text MUST use correct diacritical marks (ñ, á, é, í, ó, ú). Never write `pequeno` (→ pequeño), `codigo` (→ código), `pagina` (→ página), etc.

### Step 6: Validate

```bash
pnpm run build
```

Verify:
- Both files exist with matching frontmatter structure
- All image paths reference existing files
- Tags reference existing tag definitions
- Slugs are English-only in both versions
- `pnpm run build` passes
- No placeholder content
- `/add-slide-deck` workflow was used for creation (no manual bypass)

## Output Format

### Success Output

```
## Slide Deck Created (Multilingual)

### Files Created
- English: `src/content/slides/en/YYYY-MM-DD_{slug}.md` -> URL: `/tech-talks/{slug}/`
- Spanish: `src/content/slides/es/YYYY-MM-DD_{slug}.md` -> URL: `/es/tech-talks/{slug}/`

### Details
- **Title (EN):** {title}
- **Title (ES):** {title_es}
- **Type:** {internal|external-embed|external-link}
- **Tags:** {tags}
- **Date:** {pubDate}
- **Hero:** {heroImage or "none"}

### Build: Passing

### Commit Message
content: add slide deck "{title}" (en + es)
```

## Guardrails

### Scope Limits

- **Maximum files:** 4 (2 deck files + up to 2 supporting assets)
- **Maximum LOC:** 800 (combined EN + ES, ~400 per language)
- **Allowed directories:** `src/content/slides/en/`, `src/content/slides/es/`, `public/images/slides/`
- **Forbidden directories:** `src/pages/`, `src/components/`, `src/layouts/`, `src/content/slides/_layouts/`

### Safety Checks

- [ ] Slug doesn't conflict with an existing deck
- [ ] Slug is English-only (no Spanish slugs, even for ES content)
- [ ] All referenced images exist (including ES hero variant if applicable)
- [ ] Tags are valid (exist in `src/content/tags/`, max 5)
- [ ] Frontmatter matches the Content Collections schema (`src/content.config.ts`)
- [ ] Type-specific required fields are present (embedUrl for external-embed, externalUrl for external-link)
- [ ] Description is 130-160 characters
- [ ] **No placeholder content** — never leave `[TODO: ...]`, `[TBD]`, or similar in published decks

### Multilingual Enforcement

- MUST create all language versions. Never create a deck in only one language. See `src/lib/i18n.ts` for active languages.
- If translation quality is uncertain, use `/translate-sync` skill after creating the primary version.

### Stop Conditions

**Stop and ask** if:

- Required parameters are missing for the chosen type
- Need to create a new tag
- Deck would require more than 400 lines per language
- Deck requires custom components not available
- Deck slug conflicts with an existing deck
- Translation quality is uncertain for specialized content
- Hero image is referenced but doesn't exist (and user hasn't acknowledged)

## Definition of Done

- [ ] Deck created in `src/content/slides/en/` (English version)
- [ ] Deck created in `src/content/slides/es/` (Spanish version)
- [ ] Both versions have matching frontmatter structure
- [ ] Translated title, description, and body are natural and accurate
- [ ] Spanish reads naturally (not machine-translated)
- [ ] Spanish uses tuteo (tú), NOT voseo (vos) — no `tenés`, `podés`, `sabés`, etc.
- [ ] Spanish text has correct diacritical marks (ñ, accents — no `pequeno`, `codigo`, `numero`)
- [ ] Slugs are English-only in both versions
- [ ] Type-specific required fields are present and valid
- [ ] No placeholder content (`[TODO:`, `[TBD]`, `[FIXME]` — zero in final deck)
- [ ] All referenced images exist
- [ ] `pnpm run build` passes

## Escalation Conditions

**Escalate to a higher tier** (or ask user) if:

- Deck requires new Content Collections schema fields
- Deck requires new layout primitives in `_layouts/`
- Multiple decks need to be created as a batch (plan with `architect` first)
- Deck requires custom interactive Svelte components beyond `RevealDeck`
- Deck needs a new page template or route structure

## Examples

### Example 1: Internal Reveal.js Deck

**Input:**
```
$TITLE: Building Resilient Microservices
$DESCRIPTION: Patterns and practices for building fault-tolerant distributed systems with circuit breakers, retries, and graceful degradation.
$TYPE: internal
$TAGS: ['tech', 'devops']
$PUB_DATE: 2026-04-26
$THEME: dark
$EVENT_NAME: DevConf 2026
```

**Creates:**
- `src/content/slides/en/2026-04-26_building-resilient-microservices.md` (Reveal.js deck with scaffolded slides)
- `src/content/slides/es/2026-04-26_building-resilient-microservices.md` (translated)

### Example 2: External Embed (Google Slides)

**Input:**
```
$TITLE: Introduction to Kubernetes
$DESCRIPTION: A beginner-friendly walkthrough of Kubernetes concepts, architecture, and first deployment steps.
$TYPE: external-embed
$EXTERNAL_URL: https://docs.google.com/presentation/d/1abc123/edit
$EMBED_URL: https://docs.google.com/presentation/d/1abc123/embed
$TAGS: ['tech', 'devops']
```

**Creates:**
- `src/content/slides/en/2026-04-26_introduction-to-kubernetes.md` (embed frontmatter + description)
- `src/content/slides/es/2026-04-26_introduction-to-kubernetes.md` (translated)

### Example 3: External Link (Private Deck)

**Input:**
```
$TITLE: AI-Driven Development Workflow
$DESCRIPTION: How AI coding assistants are reshaping the software development lifecycle, from ideation to deployment.
$TYPE: external-link
$EXTERNAL_URL: https://drive.google.com/file/d/xyz789
$TAGS: ['tech', 'ai']
$PROVIDER: google-slides
```

**Creates:**
- `src/content/slides/en/2026-04-26_ai-driven-development-workflow.md` (stub with CTA)
- `src/content/slides/es/2026-04-26_ai-driven-development-workflow.md` (translated)

### Example 4: Escalation — Missing Required Field

**Input:**
```
$TITLE: My Talk
$TYPE: external-embed
```

**Result:** Stopped — `$DESCRIPTION`, `$EXTERNAL_URL`, and `$EMBED_URL` are required for external-embed decks.

## Related

- **[Slides Feature Guide](../../../docs/features/SLIDES.md)** — Source of truth for all slide conventions, schema, layouts, theming
- **[Architecture Guide](../../../docs/ARCHITECTURE.md)** — Content Collections, project structure
- **[I18N Guide](../../../docs/I18N_GUIDE.md)** — Multilingual conventions
- [`doc-edit`](../doc-edit/SKILL.md) — Edit existing decks
- [`translate-sync`](../translate-sync/SKILL.md) — Synchronize translations
- [`optimize-image`](../optimize-image/SKILL.md) — Optimize hero images for decks
- [`i18n-guardian`](../../agents/i18n-guardian.md) — Translation quality verification

## Changelog

> **Policy:** Keep only the 3 most recent entries. When adding a new entry, remove the oldest.

| Version | Date       | Changes |
| ------- | ---------- | ------- |
| 1.0.0   | 2026-04-26 | Initial skill: three deck types (internal, external-embed, external-link), multilingual creation, layout scaffolding for internal decks, full parameter set, validation via `pnpm run build`. |
