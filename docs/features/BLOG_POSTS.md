# Blog Posts

Comprehensive guide to the blog post system: file naming, directory structure, frontmatter schema, hero layouts, and image organization.

## Overview

Blog posts use Astro Content Collections with a bilingual structure (English/Spanish). Each post exists in both languages with matching slugs, and uses date-prefixed filenames for chronological ordering.

## AI Workflow (Mandatory)

For AI agents and assistants, new blog post creation in `src/content/blog/` must use `/add-blog-post`.

- Do not manually scaffold new post files unless the user explicitly asks to bypass the skill.
- The workflow must create/update both language versions in the same task.
- Use `/translate-sync` when parity corrections are needed for existing posts.

## File Naming Convention

**Format:** `YYYY-MM-DD_slug.{md,mdx}`

- The date prefix uses the post's `pubDate` value
- The separator is an underscore (`_`)
- The slug is kebab-case derived from the title
- **Slugs MUST always be in English**, even for Spanish posts — both `en/` and `es/` versions share the same English slug
- The date prefix is **stripped from URLs** (clean slugs: `/blog/my-post/`)

**Examples:**

| Title | pubDate | Filename |
|-------|---------|----------|
| Getting Started with Astro | 2026-01-15 | `2026-01-15_getting-started-with-astro.md` |
| My Travel Adventures | 2024-03-20 | `2024-03-20_my-travel-adventures.md` |
| Mi Experiencia con Astro | 2026-02-01 | `2026-02-01_my-experience-with-astro.md` |

**Slug extraction:** The `getPostSlug()` utility in `src/lib/blog.ts` strips both the language prefix and date prefix from post IDs:

```typescript
// "en/2026-01-15_getting-started-with-astro" -> "getting-started-with-astro"
// "es/2024-03-20_my-travel-adventures" -> "my-travel-adventures"
getPostSlug(post.id);
```

## Directory Structure

```
src/content/
├── blog/
│   ├── en/                              # English posts
│   │   ├── _demo/                       # Demo posts (dev only, never in production)
│   │   │   ├── 2025-01-01_demo-hero-banner.md
│   │   │   └── ...
│   │   ├── 2026-03-22_march-2026-meetup-recap.md
│   │   ├── 2022-07-08_first-post.md
│   │   └── ...
│   └── es/                              # Spanish posts (matching filenames, English slugs)
│       ├── _demo/                       # Demo posts (matching en/_demo/)
│       │   └── ...
│       ├── 2026-03-22_march-2026-meetup-recap.md
│       └── ...
└── tags/                              # Unified taxonomy (17 tags)
    ├── tech.md                        # tier: primary
    ├── personal.md                    # tier: primary
    ├── talks.md                       # tier: primary
    ├── trading.md                     # tier: primary
    ├── portfolio.md                   # tier: primary
    ├── dailybot.md                    # tier: primary
    ├── demo.md                        # tier: primary (dev only)
    ├── web-development.md             # tier: secondary, order: 1, parent: tech
    ├── javascript.md                  # tier: secondary, order: 2, parent: tech
    ├── ai.md                          # tier: secondary, order: 3, parent: tech
    ├── blockchain.md                  # tier: secondary, order: 4, parent: tech
    ├── devops.md                      # tier: secondary, order: 5, parent: tech
    ├── python.md                      # tier: secondary, order: 6, parent: tech
    ├── university.md                  # tier: secondary, order: 7, parent: tech
    ├── database.md                    # tier: secondary, order: 8, parent: tech
    ├── iot.md                         # tier: secondary, order: 9, parent: tech
    ├── design.md                      # tier: secondary, order: 10, parent: tech
    ├── mobile.md                      # tier: secondary, order: 11, parent: tech
    ├── kotlin.md                      # tier: subtopic,  order: 1,  parent: mobile
    ├── astro.md                       # tier: subtopic,  order: 51, parent: web-development
    ├── svelte.md                      # tier: subtopic,  order: 52, parent: web-development
    ├── cloudflare.md                  # tier: subtopic,  order: 53, parent: devops
    ├── docker.md                      # tier: subtopic,  order: 54, parent: devops
    ├── graphql.md                     # tier: subtopic,  order: 55, parent: web-development
    ├── django.md                      # tier: subtopic,  order: 56, parent: python
    └── openclaw.md                    # tier: subtopic,  order: 57, parent: ai
```

**Bilingual requirement:** Every post **must** exist in both `en/` and `es/` with the **same filename**. Never create a post in only one language.

**No placeholder content:** Published posts must NEVER contain placeholder text such as `[AUTHOR: ...]`, `[TODO: ...]`, `[TBD]`, or any bracketed "fill in later" instruction. Zero tolerance — replace with real content or remove the section. See [Writing Voice Guide](../WRITING_VOICE_GUIDE.md#5-no-placeholder-content-mandatory).

## Frontmatter Schema

Defined in `src/content.config.ts`:

```typescript
schema: z.object({
  title: z.string(),                    // Required - post title
  description: z.string(),             // Required - excerpt/description (130-160 chars required)
  pubDate: z.coerce.date(),            // Required - publication date
  updatedDate: z.coerce.date().optional(),  // Optional - last update date
  heroImage: z.string().optional(),    // Optional - path: /images/blog/posts/{slug}/hero.{ext}
  heroLayout: z.enum(['banner', 'side-by-side', 'minimal', 'none'])
    .default('banner').optional(),     // Optional - hero image display layout
  tags: z.array(z.string()).optional(), // Optional - must be existing tags
  keywords: z.array(z.string()).optional(), // Optional - SEO search phrases (5-8 per post)
  series: z.string().optional(),        // Optional - references src/content/series/{slug}.md
  seriesOrder: z.number().optional(),   // Optional - chapter order when series is set
  author: z.string().default('sergio-florez'), // Optional - slug from src/content/authors/
  draft: z.boolean().default(false).optional(), // Optional - hides post from production
})
```

### Field Details

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title. Translated between languages. |
| `description` | Yes | 1-2 sentence excerpt. **130-160 chars required** for optimal SERP display. Used in meta tags and Open Graph. Both EN and ES must independently meet this range. |
| `pubDate` | Yes | Publication date. Accepts date-only (`'2026-01-31'`) or datetime (`'2026-01-31T14:00:00'`). Date-only defaults to midnight. |
| `updatedDate` | No | Last significant update. Displayed with "Last updated on" label. |
| `heroImage` | No | Path from `public/`. Convention: `/images/blog/posts/{slug}/hero.{ext}`. ES posts can reference a different image (e.g., `hero-es.{ext}`) when the hero contains localized text. See [Multilingual Hero Images](#multilingual-hero-images). |
| `heroLayout` | No | How the hero image is displayed. Default: `'banner'`. See [Hero Layouts](#hero-layouts). |
| `tags` | No | Array of tag identifiers. Must match files in `src/content/tags/`. |
| `keywords` | No | Array of 5-8 SEO search phrases. Specific to post content, internationalized per language. Used in `<meta name="keywords">` and JSON-LD. |
| `series` | No | Series slug from `src/content/series/`. Required together with `seriesOrder`. |
| `seriesOrder` | No | Chapter number within the series. Required together with `series`. |
| `author` | No | Author slug from `src/content/authors/`. Defaults to `'sergio-florez'`. Both EN and ES versions of a post must use the same slug. See [Authors](./AUTHORS.md). |
| `draft` | No | When `true`, the post is excluded from the production build but visible in dev and Cloudflare preview branches. |

### Frontmatter Examples

**Example:**

```markdown
---
title: 'March 2026 Meetup — AI Agents in Production'
description: 'Recap of the March PTT meetup at UTP. Three talks on agent observability, RAG, and guardrails.'
pubDate: '2026-03-22'
heroImage: '/images/blog/posts/march-2026-meetup-recap/hero.webp'
heroLayout: 'banner'
tags: ['ai-agents', 'community', 'meetup']
keywords: ['Pereira meetup AI agents', 'agent observability talk', 'RAG patterns Colombia', 'agent guardrails']
---
```

> **Note:** The `tags` array contains both primary (`portfolio`, `personal`) and secondary (`design`) tags. The tier is determined by the tag collection, not by position in the array.

> **Keywords vs Tags:** Tags are categorical labels from a controlled taxonomy (used for navigation/filtering). Keywords are specific search phrases users type into search engines (used for SEO discovery). Keywords are internationalized — Spanish keywords should be adapted to Spanish search behavior, not literal translations. See [SEO Guide — Keywords](../SEO.md#keywords-dynamic) for details.

### Translation Rules

When creating the translated version:

- **Translate:** `title`, `description`, and all body content
- **Preserve exactly:** `pubDate`, `updatedDate`, `heroLayout`, `tags`, `author`, code blocks, formatting
- **heroImage:** Use the same path as EN by default. If the hero contains English text, use a localized variant (see [Multilingual Hero Images](#multilingual-hero-images))
- Use natural, idiomatic translations (not literal word-for-word)
- **Spanish register:** Use tuteo (tú/tienes/puedes), NOT voseo (vos/tenés/podés). Prefer Colombian Spanish phrasing.
- Do NOT translate code blocks, CLI commands, or technical identifiers
- **Direct quotes in English:** When a Spanish post includes a direct quote originally spoken/written in English, keep the original English text in italics and add a Spanish translation in parentheses immediately after. Example: *"Express my will to my agents."* ("Expresar mi voluntad a mis agentes.") — This preserves the original voice while ensuring readability for Spanish-speaking audiences.
- Maintain the same markdown structure (headings, lists, emphasis)

## Hero Layouts

The `heroLayout` field controls how the hero image is displayed in the `BlogPostHeader` component (`src/components/blog/BlogPostHeader.astro`).

### `banner` (default)

Full-width image above the title. Best for **landscape/wide images** (16:9, 2:1 aspect ratio).

```
┌─────────────────────────────────────────┐
│                                         │
│            [  Full-width image  ]       │
│                                         │
├─────────────────────────────────────────┤
│          Mar 22, 2026 - 5 min           │
│   March 2026 Meetup — AI Agents         │
│              #ai-agents                 │
├─────────────────────────────────────────┤
│  Post content...                        │
└─────────────────────────────────────────┘
```

**Image dimensions:** Optimized to 1400x700px (cover fit).

### `side-by-side`

Two-column layout: title and metadata on the left, image on the right. Stacks vertically on mobile. Best for **square images** (1:1 aspect ratio).

```
┌─────────────────────────────────────────┐
│                           │             │
│  Mar 22, 2026 - 5 min    │             │
│  March 2026 Meetup —     │   [Image]   │
│  AI Agents in Production │             │
│  #ai-agents              │             │
│                           │             │
├─────────────────────────────────────────┤
│  Post content...                        │
└─────────────────────────────────────────┘
```

**Image dimensions:** Max width 800px, aspect ratio preserved (no cropping). Max height `24rem` in display.

### `minimal`

Small thumbnail with text-focused layout. Image floats left at 160x160px (128x128px on mobile). Best for posts where **the image is secondary**.

```
┌─────────────────────────────────────────┐
│  ┌──────┐  Mar 22, 2026 - 5 min        │
│  │      │  March 2026 Meetup —         │
│  │ img  │  AI Agents in Production      │
│  │      │  #ai-agents                   │
│  └──────┘                               │
├─────────────────────────────────────────┤
│  Post content...                        │
└─────────────────────────────────────────┘
```

### `none`

No hero image area. Just title and metadata, centered. Best for **text-only posts** with no relevant image.

```
┌─────────────────────────────────────────┐
│          Mar 22, 2026 - 5 min           │
│   March 2026 Meetup — AI Agents         │
│              #ai-agents                 │
├─────────────────────────────────────────┤
│  Post content...                        │
└─────────────────────────────────────────┘
```

### Choosing a Layout

| Image type | Recommended layout |
|------------|-------------------|
| Landscape/wide (16:9, 2:1) | `banner` |
| Square (1:1) | `side-by-side` |
| Small icon/logo | `minimal` |
| No image | `none` |

## Image Organization

Blog images are stored in per-post folders under `public/images/blog/`:

```
public/images/blog/
├── posts/                    # Per-post image folders
│   ├── march-2026-meetup-recap/
│   │   ├── hero.webp         # Hero/cover image (WebP only)
│   │   ├── full_logo_white.webp
│   │   └── social_1.webp     # Inline images
│   ├── first-post/
│   │   └── hero.webp
│   └── {slug}/               # Folder name = post slug (no date prefix)
│       ├── hero.webp         # Hero image (required if using heroImage)
│       └── {name}.webp       # Additional inline images
├── shared/                   # Images shared across posts (placeholders, common assets)
└── _staging/                 # Incoming images for optimization (temporary)
```

### Naming Conventions

| Image type | Filename | Path in frontmatter |
|------------|----------|-------------------|
| Hero image | `hero.webp` | `/images/blog/posts/{slug}/hero.webp` |
| Inline image | `{descriptive-name}.webp` | `/images/blog/posts/{slug}/{name}.webp` |

- Folder name matches the post **slug** (without date prefix)
- Filenames use **lowercase kebab-case**
- **All blog images MUST be in WebP format** — convert any PNG/JPG to WebP before adding to the repo
- If an image **cannot be converted to WebP** (e.g., BMP with unsupported channels, corrupted files, or formats sharp can't process), keep it in the best available format (JPG preferred over PNG for photos)
- When the user provides an image (PNG, JPG, etc.), always convert it to WebP first — see [Image Optimization: Agent Conversion Workflow](./IMAGE_OPTIMIZATION.md#agent-conversion-workflow) for the exact script

### Multilingual Hero Images

When a hero image contains text (titles, labels, annotations) that should be localized, create a language-specific variant:

| File | Purpose |
|------|---------|
| `hero.webp` | Default/English hero image |
| `hero-es.webp` | Spanish variant (only when image has localized text) |

**How it works:** EN and ES are separate `.md` files, each with their own `heroImage` frontmatter. By default both point to the same path. When a Spanish variant exists, the ES file points to it instead.

**EN frontmatter:** `heroImage: "/images/blog/posts/my-post/hero.webp"`
**ES frontmatter:** `heroImage: "/images/blog/posts/my-post/hero-es.webp"`

**Rules:**
- If no localized variant exists, both languages share the same image (default behavior, no action needed)
- Only create variants when the image contains visible text that needs translation
- All variants must be in WebP format
- For additional languages, follow the same pattern: `hero-{lang}.webp`

### Referencing Images in Content

**In frontmatter (hero image):**

```markdown
---
heroImage: '/images/blog/posts/my-post-slug/hero.webp'
---
```

**In markdown body (inline images):**

```markdown
![Description](/images/blog/posts/my-post-slug/screenshot.webp)
```

### Inline Image Captions (MANDATORY)

Every inline image in a blog post body **MUST** be wrapped in `<figure>` with a `<figcaption>`. This applies to all image types (markdown images, HTML img tags, dark-bg-container images).

**Standard pattern:**

```html
<figure>
  <img src="/images/blog/posts/{slug}/image-name.webp" alt="Descriptive alt text" width="800" height="400" loading="lazy" />
  <figcaption>Short caption adding context the image alone doesn't provide.</figcaption>
</figure>
```

**For dark background containers:**

```html
<figure class="dark-bg-container">
  <img src="/images/blog/posts/{slug}/diagram.webp" alt="Alt text" width="1200" height="700" loading="lazy" />
  <figcaption>Caption text here.</figcaption>
</figure>
```

**Caption guidelines:**

- One line, under 100 characters when possible
- Add context the image alone doesn't provide — never repeat the alt text
- Both EN and ES versions must exist with matching meaning
- CSS is handled globally via `.prose figcaption` in `global.css` (`text-sm`, centered, accessible colors)

## Image Optimization

Blog images are optimized using a **sharp-based pipeline**. See [IMAGE_OPTIMIZATION.md](./IMAGE_OPTIMIZATION.md) for the complete guide on:

- Staging workflow (`_staging/` directory)
- `pnpm run images:optimize` command
- Optimization presets and quality settings
- WebP variant generation
- One-off optimization of existing images

## Tag Taxonomy (Unified Collection)

Tags use a **unified three-tier taxonomy collection**. Blog posts store a single `tags` array in frontmatter — the tier of each tag is resolved at build time from the tags collection.

### Architecture

```
Blog Post: tags: ["tech", "web-development", "astro", "mobile", "kotlin"]
                    │            │              │         │         │
                    ▼            ▼              ▼         ▼         ▼
Tags Collection:  primary    secondary       subtopic  secondary  subtopic
                    │            │              │         │         │
                    ▼            ▼              ▼         ▼         ▼
UI Display:    [blue #tag]  [gray outlined]  [dashed › tag]  …
```

**Key files:**
- `src/content/tags/*.md` — Tag definitions with `tier`, `parent`, `order`
- `src/lib/blog.ts` — `groupPostTags()` returns `{ primaryTags, secondaryTags, subtopicTags }`; `validateTagHierarchy()` enforces parent rules at build time
- `src/lib/translations/{en,es}.ts` — `tagNames` and `tagDescriptions` for all tiers

### Tag Collection Schema

Each tag is a `.md` file in `src/content/tags/`:

```yaml
---
name: "kotlin"                                   # slug — matches array entries in posts
description: "Kotlin ecosystem — KMP, Compose"   # short description
tier: subtopic                                   # primary | secondary | subtopic
parent: "mobile"                                 # subtopic → secondary preferred
order: 1                                         # sort order within tier
---
```

### All Tags (26 total — 7 primary + 11 secondary + 8 subtopic)

#### Primary Tags (7) — Section/Category

| Tag ID | Order | Description | Notes |
|--------|-------|-------------|-------|
| `tech` | 1 | Technical content | Main technology tag, parent of all secondary tags |
| `personal` | 2 | Personal posts | Life, reflections |
| `portfolio` | 3 | Portfolio/branding | Projects showcase |
| `talks` | 4 | Conference talks | Speaking events |
| `trading` | 5 | Trading content | Financial/trading |
| `dailybot` | 6 | DailyBot product | Product-specific |
| `demo` | 99 | Demo posts | Dev only (`_demo/` folders) |

#### Secondary Tags (11) — Content/Technology Topics

All secondary tags have `parent: "tech"`.

| Tag ID | Order | Parent | Description |
|--------|-------|--------|-------------|
| `web-development` | 1 | `tech` | Frontend/backend web technologies |
| `javascript` | 2 | `tech` | JavaScript ecosystem (Vue, Webpack, Node) |
| `ai` | 3 | `tech` | AI, machine learning, deep learning, LLMs |
| `blockchain` | 4 | `tech` | Blockchain, Ethereum, smart contracts |
| `devops` | 5 | `tech` | Docker, CI/CD, infrastructure |
| `python` | 6 | `tech` | Python ecosystem (Django, data science) |
| `university` | 7 | `tech` | University projects and coursework |
| `database` | 8 | `tech` | Database systems (SQL, NoSQL, MongoDB) |
| `iot` | 9 | `tech` | Internet of Things, hardware, sensors |
| `design` | 10 | `tech` | UI/UX design, WebVR, creative tech |
| `mobile` | 11 | `tech` | Mobile development — Android, iOS, cross-platform |

#### Subtopic Tags (8) — Fine-Grained Technology Handles

Subtopic tags name a single concrete technology, framework, language, or product. They sit under a `secondary` parent (preferred) or, when no fitting secondary exists, a `primary` parent (allowed but flagged by validation).

| Tag ID | Order | Parent | Description |
|--------|-------|--------|-------------|
| `kotlin` | 1 | `mobile` | Kotlin / KMP / Compose Multiplatform / Android JVM tooling |
| `astro` | 51 | `web-development` | Astro framework — islands, Content Collections, MDX, SSG |
| `svelte` | 52 | `web-development` | Svelte / SvelteKit — reactive components, runes, hydration |
| `cloudflare` | 53 | `devops` | Cloudflare Pages, Workers, R2, agentic-web platform |
| `docker` | 54 | `devops` | Docker containers, Dockerfile authoring, multi-service orchestration |
| `graphql` | 55 | `web-development` | GraphQL APIs — schemas, resolvers, federation, client patterns |
| `django` | 56 | `python` | Django framework — ORM, multi-db, admin, deployment |
| `openclaw` | 57 | `ai` | OpenClaw — local-first personal AI agent and design philosophy |

### Assigning Tags to Posts

1. Choose **1-2 primary tags** for section classification.
2. Choose **0-3 secondary tags** for content topics.
3. Choose **0-3 subtopic tags** for specific technologies/frameworks/products.
4. Put ALL in a single `tags` array (any order — the tier is resolved at build time):

```yaml
tags: ["tech", "web-development", "astro", "svelte", "cloudflare"]
```

### Adding a New Tag

1. **Verify criteria** (see Tag Governance below): tag applies to 3+ existing posts AND is expected to recur. Run [`/audit-taxonomy`](../../.agents/skills/audit-taxonomy/SKILL.md) to surface candidates with hard data.
2. Create `src/content/tags/{tag-name}.md` with `name`, `description`, `tier`, `order`, and `parent`.
3. Add translations to `src/lib/translations/en.ts` and `es.ts` (`tagNames` + `tagDescriptions`). Spanish uses Tuteo and proper accents.
4. Use it in blog posts — no schema or code changes needed.
5. Build-time `validateTagHierarchy()` will warn about invalid parent references.

### Tag Governance

**Creation criteria by tier:**

| Tier | When to create | Parenting rule | Who decides | Cap |
|------|---------------|---------------|-------------|-----|
| Primary | New site section (almost never) | No parent | User only | ~8 |
| Secondary | 3+ posts use it AND expected to recur | Parent must be primary | Agent proposes via `/audit-taxonomy`, user approves | ~20 |
| Subtopic | 3+ posts focus on the tech (passing mentions don't count) | Parent should be secondary; primary fallback flagged | Agent proposes via `/audit-taxonomy`, user approves | ~15 |

**Rules:**

- **Naming**: lowercase, kebab-case (`web-development`), English-only — even on Spanish posts.
- **Tag caps**: max 5 tags per post total; max 3 subtopics per post; at least 1 primary required.
- **Subtopic naming**: a single concrete technology/framework/language/product (e.g., `astro`, `svelte`, `golang`). Avoid broad categories (those are secondary) and feature-level slivers (out of scope).
- **Agents must NEVER auto-create tags** without user approval.
- **Audit cadence**: run [`/audit-taxonomy`](../../.agents/skills/audit-taxonomy/SKILL.md) quarterly OR after any content drop of 5+ posts. The skill reports tag drift, orphans, and new candidates against thresholds.
- **All routes unified**: `/blog/tag/{tag}/` (all tiers share the same route).
- **Build-time validation** warns about: parents that don't resolve, primary tags with parents, secondary tags whose parent is not primary, subtopic tags without parents, and subtopic tags whose parent is itself a subtopic.

### Visual Rendering by Tier

Each tier has a distinct visual style across every surface where blog tags appear (blog cards, post detail header, blog listing pill rows, related-posts strip, tag detail pages, search hits):

| Tier | Light mode | Dark mode | Prefix | Shape |
|---|---|---|---|---|
| Primary | `bg-blue-100 text-blue-800` filled pill, `text-sm` | `bg-blue-900 dark:text-blue-200` | `#` | rounded |
| Secondary | `border-gray-200 text-gray-600` outlined pill, `text-sm` | `dark:border-gray-600 dark:text-gray-300` | none | rounded |
| Subtopic | `border-dashed border-gray-300 text-gray-700` smaller pill, `text-xs` | `dark:border-gray-600 dark:text-gray-300` | `›` chevron at `opacity-60` | rounded |

All combinations meet WCAG AA (most are AAA). The forbidden classes `text-gray-400`, `text-gray-500`, `dark:text-gray-400`, `dark:text-gray-500` are NOT used in any tag rendering block.

### Search Support

Topics are fully searchable. The API (`posts.json`) pre-groups tags by tier. Search scoring: title (0.0) > primary tags (0.1) > topics (0.15) > description (0.2).

**Note:** The `demo` tag is only used by demo posts in `_demo/` folders. Demo posts are never visible in production or in blog listings. They are only accessible by direct URL in local dev mode.

## Authors

Each post is attributed to an author defined in the `authors` content collection (`src/content/authors/{slug}.yaml`). The author is referenced by `slug` in the post frontmatter:

```yaml
author: 'sergio-florez'   # Optional — defaults to 'sergio-florez'
```

At build time, `BlogPostFooter.astro` resolves the slug, fetches the author's localized `role` and `bio`, and renders an `AuthorCard` below the post body. The resolved author also populates the `BlogPosting` JSON-LD `author` field for SEO.

**Key rules:**

- Both `en/` and `es/` versions of a post **must** use the same `author` slug — authorship doesn't translate.
- The default author when `author` is omitted is `sergio-florez`.
- To add a new author: create `src/content/authors/{slug}.yaml`, add the avatar at `public/images/authors/{slug}.webp`, and reference the slug in the post frontmatter.

**Full reference:** [AUTHORS.md](./AUTHORS.md) — YAML schema, components, JSON-LD impact, validation checklist.

## Blog Post Series

Posts can belong to a **series** — a curated sequence of related posts (e.g., a multi-chapter tutorial, a project build log). Series use the same Content Collection pattern as tags: centralized metadata with build-time resolution.

### Architecture

```
Blog Post: series: "the-library-of-tomorrow", seriesOrder: 2
                    │                              │
                    ▼                              ▼
Series Collection: the-library-of-tomorrow.md    Sort position
                    │
                    ▼
SeriesNavigation:  TOC + prev/next links
```

### Series Collection Schema

Each series is a `.md` file in `src/content/series/`:

```yaml
---
name: "the-library-of-tomorrow"
title: "The Library of Tomorrow"
description: "PTT's flagship learning vertical — the community's reading and study group around emerging technology."
order: 1
---
```

### Blog Frontmatter Fields

Add these optional fields to posts that belong to a series:

```yaml
series: "the-library-of-tomorrow"   # References series name
seriesOrder: 2                   # Chapter number (1, 2, 3...)
```

### Creating a New Series

1. Create `src/content/series/{series-slug}.md` with `name`, `title`, `description`, `order`
   - **Series slugs MUST be in English** (e.g., `the-library-of-tomorrow.md`, not `la-biblioteca-del-manana.md`)
   - The `name` field inside the file must match the filename slug
2. **Add `seriesNames[slug]` and `seriesDescriptions[slug]` to BOTH `src/lib/translations/en.ts` and `es.ts`** — without this, the ES series page falls back to the English title/description
3. Add `series` and `seriesOrder` to each post's frontmatter (both EN and ES)
4. The `SeriesNavigation` component renders automatically on posts with series metadata

### SeriesNavigation Component

Located at `src/components/blog/SeriesNavigation.astro`. Renders between post content and Related Articles:

- Series title and description
- Table of contents listing all chapters (current chapter highlighted)
- Previous/Next chapter navigation links
- Bilingual (uses translation keys)
- Has `id="series-navigation"` for the floating indicator to target

### SeriesIndicator Component (Floating)

Located at `src/components/blog/SeriesIndicator.svelte`. A floating button in the bottom-right corner that makes series membership discoverable on long posts:

- **Visibility:** Appears when the `SeriesNavigation` panel is below the viewport (uses `IntersectionObserver`). Disappears when the reader scrolls the navigation into view.
- **Progress ring:** Circular SVG showing chapter position (e.g., filled 2/4 of the ring for chapter 2 of 4).
- **Label:** Two lines — "Chapter X of Y" and "All chapters" with a down arrow.
- **Action:** Clicking smooth-scrolls to the series navigation panel.
- **Styling:** Glassmorphism (`bg-white/95 backdrop-blur-sm ring-1 ring-blue-200`), slide-in animation from right. Dark mode supported.
- **Hydration:** Uses `client:load` since it needs to track scroll position immediately.

This pattern mirrors the `ScrollToTimeline.svelte` component used on portfolio and tech-talks pages (red floating pill), but with series-specific content and blue theming.

### Key Files

| File | Purpose |
|------|---------|
| `src/content/series/*.md` | Series definitions |
| `src/content.config.ts` | Series collection schema |
| `src/lib/blog.ts` | `getSeriesNavigation()` utility |
| `src/lib/types.ts` | `SeriesInfo`, `SeriesPost` types |
| `src/components/blog/SeriesNavigation.astro` | Navigation panel (TOC + prev/next) |
| `src/components/blog/SeriesIndicator.svelte` | Floating chapter indicator |
| `src/lib/translations/{en,es}.ts` | Series translation keys (`seriesNames[slug]`, `seriesDescriptions[slug]`, `seriesPartOf`, `seriesChapterOf`, etc.) |

### Resources Section — Avoid Redundancy with Series Navigation

Posts may include a **Resources** (EN) / **Recursos** (ES) section at the end with links to repos, tools, documentation, or external references.

**Rule:** Do **not** list related articles or previous chapters in the Resources section when the post belongs to a series. The `SeriesNavigation` component already renders the full table of contents and prev/next links below the content. Listing the same chapters in Resources is redundant.

- **Include in Resources:** External links (docs, repos, tools, people), source code URLs
- **Exclude from Resources:** Links to other posts in the same series — they appear in `#series-navigation`

## URL Structure

Blog post URLs are clean (no date prefix):

| Type | URL pattern |
|------|-------------|
| English post | `/blog/{slug}/` |
| Spanish post | `/es/blog/{slug}/` |
| English tag page | `/blog/tag/{tag}/` |
| Spanish tag page | `/es/blog/tag/{tag}/` |
| English blog listing | `/blog/` |
| Spanish blog listing | `/es/blog/` |
| Paginated listing | `/blog/page/{n}/` |

### Markdown Endpoints (Agent-Friendly)

All blog posts automatically serve clean Markdown for AI agents:

| Type | URL pattern |
|------|-------------|
| EN blog post | `/blog/{slug}.md` |
| ES blog post | `/es/blog/{slug}.md` |
| EN blog index | `/blog/index.md` |
| ES blog index | `/es/blog/index.md` |

Blog `.md` endpoints are auto-generated from `post.body` (raw Markdown without frontmatter). No code changes needed when adding posts. Agents can also request Markdown via `Accept: text/markdown` header. See **[Markdown for Agents](../../docs/aeo/MARKDOWN_FOR_AGENTS.md)**.

## Key Source Files

| File | Purpose |
|------|---------|
| `src/content.config.ts` | Collection schema definition (Zod) — blog, tags, and series collections |
| `src/content/tags/*.md` | Tag definitions with tier, parent, order |
| `src/content/series/*.md` | Series definitions with name, title, description |
| `src/lib/blog.ts` | `getPostSlug()`, `getBlogPosts()`, `getRelatedPosts()`, `groupPostTags()`, `getTagTierMap()`, `getSeriesNavigation()` |
| `src/lib/translations/{en,es}.ts` | `tagNames` + `tagDescriptions` for all tiers |
| `src/components/blog/BlogPostHeader.astro` | Hero layout rendering (4 variants) with tier-aware tag display |
| `src/components/blog/BlogCard.svelte` | Post card in listings with tier-aware tag badges |
| `src/components/blog/BlogGrid.svelte` | Grid layout for post cards |
| `src/pages/blog/[...slug].astro` | Dynamic post page routing |
| `src/pages/blog/tag/[tag].astro` | Unified tag page (handles both primary and secondary tags) |
| `src/pages/blog/index.astro` | Blog listing page |
| `src/pages/api/posts.json.ts` | Search API — pre-groups tags by tier for client |
| `scripts/optimize-images.mjs` | Staging image optimizer |
| `scripts/optimize-existing-images.mjs` | One-off bulk optimizer |

## Scheduled Posts

Posts with a `pubDate` set to a **future date** are treated as scheduled posts. They are automatically hidden from production builds but visible during local development.

### How It Works

- **No schema changes needed** — uses the existing `pubDate` field
- A post is "scheduled" when its date (in `SITE_TIMEZONE`) is after today's date in that timezone
- Uses `America/Bogota` (`SITE_TIMEZONE` in `src/lib/constances.ts`) so scheduling is consistent regardless of where the build runs (Cloudflare, local, etc.)
- The `isScheduledPost()` utility in `src/lib/blog.ts` performs this check

### Behavior by Environment

| Environment | Visibility | Badge |
|-------------|-----------|-------|
| `pnpm run dev` | Visible in all listings, search, series nav | Amber "Scheduled" badge on cards and detail page |
| `pnpm run build` (production) | Completely excluded — no routes, no listings, no RSS, no search | N/A |

### How to Schedule a Post

1. Set `pubDate` to a future date in the post frontmatter:
   ```yaml
   pubDate: '2026-06-15'
   ```
2. The post is immediately visible in `pnpm run dev` with a "Scheduled" badge
3. When you deploy (`pnpm run build`), the post is excluded from the build output
4. After the `pubDate` passes, rebuild and deploy — the post becomes a normal published post

### Visual Indicators (Dev Only)

- **Blog cards:** Amber pill badge ("Scheduled" / "Programado") next to the publication date
- **Detail page:** Amber banner below breadcrumb: "Scheduled post — This post will be published on {date}. It is only visible in development mode."

### Filtered Locations

Scheduled posts are excluded from all these in production builds:

- Blog listings (`getBlogPosts()`)
- Search index (`getSearchIndex()`)
- Detail page routes (`getStaticPaths()`)
- RSS feeds (`rss.xml`)
- Related posts (`getRelatedPosts()`)
- Series navigation (`getSeriesNavigation()`)

### Key Files

| File | Role |
|------|------|
| `src/lib/blog.ts` | `isScheduledPost()` function and all query filters |
| `src/components/blog/BlogContainer.astro` | Passes `isScheduled` flag to card components |
| `src/components/blog/BlogCard.svelte` | Renders amber badge |
| `src/components/pages/blog/BlogPostPage.astro` | Renders amber banner |
| `src/lib/translations/{en,es}.ts` | `scheduledBadge`, `scheduledBannerTitle`, `scheduledBannerMessage` |

## Content Lifecycle

Posts can be published, scheduled, or demo. See **[Blog Content Lifecycle](./BLOG_CONTENT_LIFECYCLE.md)** for the complete guide on:

- Published posts — visible in production and dev
- Scheduled posts — future `pubDate`, visible only in dev with badge
- Demo posts (`_demo/` folder) — feature showcases, accessible only by direct URL in local dev mode

## Related Documentation

- [Blog Content Lifecycle](./BLOG_CONTENT_LIFECYCLE.md) - Published and demo post visibility
- [Image Optimization](./IMAGE_OPTIMIZATION.md) - Image pipeline and optimization workflow
- [Blog Search](./BLOG_SEARCH.md) - Client-side search functionality
- [Pagination](./PAGINATION.md) - Blog post pagination
- [Internationalization](./I18N.md) - Multi-language support
- [Public Assets](./PUBLIC_ASSETS.md) - Static assets structure
- [Architecture Guide](../ARCHITECTURE.md) - Overall site architecture
