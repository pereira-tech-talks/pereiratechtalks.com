---
name: add-blog-post
description: Create blog posts — from a topic (writes content) or with provided content (scaffolding). Use proactively when creating new blog posts or articles.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
argument-hint: "[topic, brief, or content]"
# === Documentation (ignored by tools, useful for humans) ===
tier: 2
intent: create
max-files: 6
max-loc: 1200
---

# Skill: Add Blog Post

## Objective

Create multilingual blog posts (currently English + Spanish) for Pereira Tech Talks v3.0.0 using Astro Content Collections. Supports two modes:

- **Topic mode:** Given a topic or brief, writes the full article with personal-professional voice and narrative structure.
- **Content mode:** Given pre-written content, scaffolds the post files with proper frontmatter and multilingual versions.

The skill auto-detects the mode based on the inputs provided.

## Mandatory Invocation Policy (CRITICAL)

This skill is the mandatory workflow for creating new blog posts in this repository.

- All AI agents and assistants MUST use `/add-blog-post` when creating new posts in `src/content/blog/`.
- Do NOT create new blog posts manually unless the user explicitly requests bypassing the skill.
- Always produce both language files (currently EN + ES) in the same task.
- If creation starts outside this skill, stop and switch to `/add-blog-post` before writing files.

## Non-Goals

- Does NOT modify the Content Collections schema
- Does NOT create new tags (uses existing tags from `src/content/tags/`)
- Does NOT modify existing posts (use `content-writer` agent for rewrites, `doc-edit` for minor edits)
- Does NOT create pages (use `add-page` skill)
- Does NOT download or optimize images (use `/optimize-image` skill or `pnpm run images:optimize`)
- Does NOT create interactive Svelte components

## Tier Classification

**Tier: 2** - Standard

**Reasoning:** Writing quality multilingual articles requires moderate reasoning for tone calibration, narrative structure, and natural translation. Content mode (scaffolding) is simpler but shares the same multilingual creation flow.

## Inputs

### Mode Detection

| If provided | Mode | What happens |
|-------------|------|--------------|
| `$TOPIC` (no `$CONTENT`) | Topic mode | Researches, plans, and writes the article from scratch |
| `$CONTENT` (with `$TITLE`) | Content mode | Scaffolds files using the provided content |
| Both `$TOPIC` and `$CONTENT` | Content mode | Uses provided content, topic as context |

### Parameters

- `$TOPIC`: Article topic, brief, or description *(required for topic mode)*
- `$TITLE`: Post title *(required for content mode, auto-generated in topic mode)*
- `$DESCRIPTION`: Post excerpt/description *(required for content mode, auto-generated in topic mode)*
- `$CONTENT`: Pre-written post content in markdown *(triggers content mode)*
- `$TAGS`: Array of tag names — both primary and secondary in one array (must exist in `src/content/tags/`)
- `$HERO_IMAGE`: Hero image path (from `public/`). If the image contains text, provide a language-specific variant for ES (see [Multilingual Hero Images](../../../docs/features/BLOG_POSTS.md#multilingual-hero-images))
- `$SLUG`: Custom slug (default: kebab-case of title)
- `$LANG`: Primary language, `en` or `es` (default: `en`). The other language version will be translated.
- `$PUB_DATE`: Publication date in YYYY-MM-DD format (default: today's date). **Scheduled posts:** If set to a future date, the post will be hidden from production builds but visible in dev with an amber "Scheduled" badge. See [Blog Posts — Scheduled Posts](../../../docs/features/BLOG_POSTS.md#scheduled-posts).
- `$TYPE`: Article type — `blog`, `portfolio`, `tutorial` (default: `blog`, topic mode only)

## Reference Documentation

**Source of truth** for all blog post conventions:

- **[Blog Posts Feature Guide](../../../docs/features/BLOG_POSTS.md)** - File naming, directory structure, frontmatter schema, hero layouts, image organization, URL structure
- **[Blog Content Lifecycle](../../../docs/features/BLOG_CONTENT_LIFECYCLE.md)** - Published, scheduled, and demo post visibility
- **[Image Optimization Guide](../../../docs/features/IMAGE_OPTIMIZATION.md)** - Staging workflow, optimization presets, commands

## Quick Reference

**File naming:** `YYYY-MM-DD_{slug}.md` (date prefix stripped from URLs)

**Directories:** `src/content/blog/en/` and `src/content/blog/es/`

**Frontmatter fields:** `title` (required), `description` (required), `pubDate` (required), `updatedDate`, `heroImage`, `heroLayout`, `tags`, `keywords`, `series`, `seriesOrder`

**heroLayout:** `banner` for landscape, `side-by-side` for square, `minimal` for secondary, `none` for text-only

**Image path:** `/images/blog/posts/{slug}/hero.{ext}` (ES variant: `hero-es.{ext}` when image has localized text)

**Tags (unified array):** All tags go in a single `tags` array. The tier (primary / secondary / subtopic) is resolved at build time from the tags collection — NOT by position in the array.

**Primary tags** (1-2 per post): `tech`, `personal`, `talks`, `trading`, `portfolio`, `dailybot` (do NOT use `demo` — that tag is only for demo posts in `_demo/` folders).

**Secondary tags** (0-3 per post): `web-development`, `javascript`, `ai`, `blockchain`, `devops`, `python`, `university`, `database`, `iot`, `design`, `mobile`.

**Subtopic tags** (0-3 per post — tier 3, fine-grained technology handles): `kotlin` (parent: `mobile`), `astro`/`svelte`/`graphql` (parent: `web-development`), `cloudflare`/`docker` (parent: `devops`), `django` (parent: `python`), `openclaw` (parent: `ai`).

**Caps:** max 5 tags per post total; max 3 subtopics per post; at least 1 primary required.

**When to use a subtopic tag:** the post is FOCUSED on that specific technology/framework/product (not just mentions it in passing). If you're unsure whether a candidate qualifies, run [`/audit-taxonomy`](../audit-taxonomy/SKILL.md) to see the data.

**Examples:**
- `tags: ["tech", "portfolio", "python", "database"]` — primary + secondary only.
- `tags: ["tech", "web-development", "astro", "svelte"]` — primary + secondary + 2 subtopics (Astro+Svelte tech post).
- `tags: ["tech", "mobile", "kotlin"]` — primary + secondary + subtopic (mobile post focused on Kotlin).

**Full taxonomy reference:** see [Tag Taxonomy in BLOG_POSTS.md](../../../docs/features/BLOG_POSTS.md#tag-taxonomy-unified-collection) for the complete tier table, governance, and visual rendering rules.

**Series** (optional): If the post belongs to a series, add `series: "{series-slug}"` and `seriesOrder: {n}`. Available series are defined in `src/content/series/`. The `SeriesNavigation` panel and `SeriesIndicator` floating button render automatically — no component imports or page changes needed.

**Series workflow (when adding to an existing series):**
1. Check available series: `ls src/content/series/`
2. Read the series file to confirm the slug: `cat src/content/series/{slug}.md`
3. Find existing posts in the series: `grep -r 'series: "{slug}"' src/content/blog/en/` to determine the next `seriesOrder` value
4. Add both `series` and `seriesOrder` to frontmatter in BOTH en/ and es/ versions
5. The `SeriesNavigation` (TOC + prev/next links) and `SeriesIndicator` (floating chapter progress button) appear automatically at build time

**Creating a NEW series:** Create `src/content/series/{slug}.md` with `name`, `title`, `description`, `order` fields. Then add the series fields to each post's frontmatter.

**Author** (optional): If the post belongs to an author other than the default, add `author: "{author-slug}"` to the frontmatter. Available authors are YAML files in `src/content/authors/`. When omitted, the post defaults to `sergio-florez`. Both EN and ES versions of a post **must** use the same `author` slug — authorship doesn't translate. The `AuthorCard` renders automatically at the end of the post and pulls localized `role` and `bio` from the author's YAML.

**Author workflow (when adding a new author):**
1. Create `src/content/authors/{slug}.yaml` with `name`, `slug`, `avatar`, `role.{en,es}`, `bio.{en,es}`, and optional `social` (x, linkedin, github, instagram, website)
2. Add the avatar at `public/images/authors/{slug}.webp` (WebP, ~160x160 px)
3. Reference the slug in `author:` on both EN and ES versions of the post
4. Verify at `/internal/authors` in dev mode

**Full reference:** [features/AUTHORS.md](../../../docs/features/AUTHORS.md)

**Content lifecycle:**
- Posts are **published** (visible in production and dev)
- Files in `_demo/` folder: **demo** posts (accessible only by direct URL in local dev mode, never in production or listings)

## Steps

### Step 1: Analyze Input and Research

1. Determine mode (topic vs content) based on inputs provided
2. Check existing articles in `src/content/blog/en/` for voice reference and to avoid overlap
3. **Read demo posts in `src/content/blog/en/_demo/` as structural references** — these are example articles showcasing different hero layouts (banner, side-by-side, minimal, none), MDX features, rich markdown formatting, and code syntax highlighting. Use them as templates when deciding article structure and formatting.
4. Check available tags in `src/content/tags/` — note which are `tier: primary` and which are `tier: secondary`
5. **Assign tags:** Choose 1-2 primary tags (section) + 1-3 secondary tags (topic). Put all in a single `tags` array. If no secondary tag fits the content, use only primary tags.
6. Verify any referenced images exist in `public/images/blog/posts/` or `public/images/blog/shared/`
7. **Topic mode only:** Identify the core story or angle. If the brief is too vague, stop and ask for clarification.

```bash
# Check existing articles
ls src/content/blog/en/

# Check available tags
ls src/content/tags/

# Verify image assets if referenced
ls public/images/blog/posts/ public/images/blog/shared/ 2>/dev/null
```

### Step 2: Generate Slug and Plan Structure

- Convert title to kebab-case for the slug (or use provided `$SLUG`)
- Ensure uniqueness among existing posts
- **File naming:** `YYYY-MM-DD_{slug}.md` (use pubDate as date prefix)
- Determine frontmatter values including `heroLayout` based on image aspect ratio

**Topic mode only — plan article structure:**

1. **Opening hook** — Personal, relatable opening (2-3 paragraphs). **Series posts: DO NOT open with a mechanical recap of all previous chapters** (e.g., "In chapter one I did X. In chapter two I did Y. In chapter three I did Z."). This pattern becomes robotic and impersonal as the series grows. Instead: open with the new chapter's own hook, and weave in references to prior chapters only when directly relevant — a single link, a short phrase, or an inline mention. The series navigation already shows readers the full chapter list; the opening should feel like a conversation, not an index.
2. **Context/Why** — Why this matters, why the author did it
3. **Core content** — Main story, breakdown, or explanation (3-6 sections)
4. **Visual elements** — Place images, tables, code blocks where they add value
5. **Closing** — Brief, forward-looking ("Let's keep building." / "A seguir construyendo."). **Series posts: Do NOT create a "Bridge to Chapter N" or teaser section** at the end that previews the next chapter. Each chapter should stand on its own — end with a satisfying conclusion, not a cliffhanger or preview. The series navigation already shows readers what comes next.
6. **Resources** — Links to repos, tools, docs, external references (when applicable). **Do NOT list related articles or previous chapters** — if the post belongs to a series, those already appear in the series navigation below; listing them in Resources is redundant.

**Series independence principle:** Each post in a series should read well on its own. Avoid explicit "In chapter N..." references. Instead: weave in context naturally with inline links, or simply state the fact without referencing which chapter covered it. A reader who lands on chapter 5 from a search engine should not feel lost.

### Step 3: Create Primary Language Version

Create `src/content/blog/{$LANG}/YYYY-MM-DD_{slug}.md`

**Image setup:** If a hero image is provided:
1. Verify the image folder exists: `public/images/blog/posts/{slug}/`
2. Use path `/images/blog/posts/{slug}/hero.{ext}` in frontmatter
3. **Multilingual hero:** If the hero image contains text that needs localization, ask the user for a language-specific variant. Save as `hero-es.{ext}` in the same folder, generate WebP, and use the variant path in the ES frontmatter

**Topic mode — voice rules:**
- Use the voice defined in `docs/WRITING_VOICE_GUIDE.md`. PTT is a community: default to "we" / "the community", and only use first person ("I", "my") in clearly attributed essays where the `author` slug identifies the writer.
- Conversational and human — like talking to a peer in the meetup
- No marketing language, no empty superlatives
- Specific details over vague claims
- Honest reflections — what worked, what didn't, what was learned

**Formatting rules:**
- Use `---` horizontal rules between major sections
- Use `##` for section headings, `###` for subsections
- Wrap transparent PNG/SVG images in dark background containers:
  ```html
  <div style="background:#0F1124;border-radius:12px;padding:2rem;text-align:center">

  ![Alt text](/images/path/to/image.png)

  </div>
  ```
- Include alt text for all images
- **MANDATORY: Wrap every inline image in `<figure>` + `<figcaption>`:**
  ```html
  <figure>
    <img src="/images/blog/posts/{slug}/image.webp" alt="Alt text" loading="lazy" />
    <figcaption>Short caption adding context the image alone doesn't provide.</figcaption>
  </figure>
  ```
  Captions must be short (one line), additive (never repeat alt text), and exist in both EN and ES.

**Markdown template:**

```markdown
---
title: 'Post Title Here'
description: 'A brief description of what this post is about.'
pubDate: '2026-01-31'
heroImage: '/images/blog/posts/post-title-here/hero.jpg'
heroLayout: 'banner'
tags: ['tech', 'web-development', 'javascript']
keywords: ['specific search phrase 1', 'long-tail keyword phrase 2', 'technology name tutorial', 'how to do X with Y', 'comparison A vs B']
# author: 'sergio-florez'      # Optional — slug from src/content/authors/. Defaults to 'sergio-florez'
# series: 'series-slug'         # Optional — must match a slug in src/content/series/
# seriesOrder: 1                # Required when series is set — positive integer, unique within the series
# draft: true                   # Optional — hides post from production
---

## Introduction

Content starts here...
```

> **Note:** Primary (`tech`) and secondary (`web-development`, `javascript`) tags go in one `tags` array. Tier is determined by the tags collection, not by position.

See [Blog Content Lifecycle](../../../docs/features/BLOG_CONTENT_LIFECYCLE.md) for post visibility rules.

### Step 4: Generate SEO Keywords (Both Languages)

**MANDATORY:** Every blog post must have 5-8 SEO keywords per language version.

**Keywords ≠ Tags.** Tags are categorical labels from a controlled taxonomy (`tech`, `web-development`). Keywords are specific search phrases users type into search engines (`replace ESLint with Biome`, `Biome linter setup`).

**Keyword generation rules:**

1. **5-8 keywords per post** — mix of short-tail (1-2 words) and long-tail (3-6 words)
2. **Think like a searcher** — what would someone type into Google to find this content?
3. **Include the main technology/topic** in at least 2-3 keywords
4. **No generic keywords** — every keyword must be specific to the post content
5. **Keywords complement tags** — don't repeat tag names as keywords

**English keywords:** Natural English search phrases.

**Spanish keywords:** Adapted to Spanish search behavior (NOT literal translations):
- Spanish users search with questions: "qué es...", "cómo usar...", "para qué sirve..."
- Technical terms often stay in English: Docker, Webpack, API, GraphQL
- MUST have proper diacritical marks (ñ, á, é, í, ó, ú) — never `analisis`, `codigo`, `introduccion`

**Placement in frontmatter:** `keywords` array goes AFTER `tags` and BEFORE `series` (if present):

```yaml
tags: ['tech', 'web-development']
keywords: ['keyword phrase 1', 'keyword phrase 2', 'keyword phrase 3', 'keyword phrase 4', 'keyword phrase 5']
series: "optional-series"
```

### Step 5: Create Translated Version (Other Language)

**MANDATORY:** Create the translated version in the other language directory.

- If primary is English → save in `src/content/blog/es/YYYY-MM-DD_{slug}.md`
- If primary is Spanish → save in `src/content/blog/en/YYYY-MM-DD_{slug}.md`
- Use the same date prefix and slug

**Translation rules:**
- Translate IDEAS, not words — should read as if originally written in that language
- Translate: `title`, `description`, `keywords`, all body content, alt text
- Preserve exactly: `pubDate`, `updatedDate`, `heroLayout`, `tags`, `author`, `series`, `seriesOrder`, code blocks, URLs
- `heroImage`: Use the same path as EN by default. If a `hero-es.{ext}` variant exists, use it in the ES frontmatter
- Adapt idioms and expressions to sound natural
- **Keywords:** Generate language-specific keywords (adapted, not translated) — see Step 4
- Use informal-professional register (tuteo: tú/tienes/puedes)
- **CRITICAL — No voseo:** NEVER use Argentine/Rioplatense voseo forms (vos, tenés, podés, sabés, querés, hacés, buscás, necesitás, decís, etc.). Always use tuteo: tienes, puedes, sabes, quieres, haces, buscas, necesitas, dices. The tone is personal but professional — tuteo, not voseo.
- When translating to Spanish, prefer Colombian Spanish phrasing
- Do NOT translate code blocks, CLI commands, technical terms, product names
- **Direct quotes in English:** When the Spanish version includes a direct quote originally spoken/written in English, keep the original English text in italics and add a Spanish translation in parentheses immediately after. Example: *"Express my will to my agents."* ("Expresar mi voluntad a mis agentes.")
- **CRITICAL — Spanish orthography:** ALL Spanish text MUST use correct diacritical marks (ñ, á, é, í, ó, ú). Never write `pequeno` (→ pequeño), `tamano` (→ tamaño), `analisis` (→ análisis), `numero` (→ número), `codigo` (→ código), `pagina` (→ página), etc. Verify before saving.

### Step 6: Validate

```bash
pnpm run build
```

Verify:
- Both files exist with matching frontmatter structure
- All image paths reference existing files
- Tags reference existing tag definitions
- Both language versions have `keywords` array with 5-8 entries
- Spanish keywords have correct diacritical marks
- `/add-blog-post` workflow was used for creation (no manual bypass)

## Output Format

### Success Output

```
## Blog Post Created (Multilingual)

### Files Created
- English: `src/content/blog/en/YYYY-MM-DD_{slug}.md` -> URL: `/blog/{slug}/`
- Spanish: `src/content/blog/es/YYYY-MM-DD_{slug}.md` -> URL: `/es/blog/{slug}/`

### Details
- **Title (EN):** {title}
- **Title (ES):** {title_es}
- **Mode:** {topic|content}
- **Tags:** {tags}
- **Date:** {pubDate}
- **Hero:** {heroImage or "none"} ({heroLayout})

### Build: Passing

### Commit Message
content: add blog post "{title}" (en + es)
```

## Guardrails

### Scope Limits

- **Maximum files:** 6 (2 article files + up to 4 supporting assets)
- **Maximum LOC:** 1200 (combined EN + ES, ~600 per language)
- **Allowed directories:** `src/content/blog/en/`, `src/content/blog/es/`, `public/images/`
- **Forbidden directories:** `src/pages/`, `src/components/`, `src/layouts/`

### Resources Section (Recursos)

- **Do NOT** list related articles or previous chapters in Resources when the post belongs to a series — the `SeriesNavigation` panel already shows the full TOC below the content.
- **Include:** External links (documentation, repos, tools, people).
- **Exclude:** Links to other posts in the same series.

### Safety Checks

- [ ] Slug doesn't conflict with an existing article
- [ ] All referenced images exist (including ES hero variant if applicable)
- [ ] Tags are valid (exist in `src/content/tags/`)
- [ ] Frontmatter matches the Content Collections schema
- [ ] **No placeholder content** — never leave `[AUTHOR: ...]`, `[TODO: ...]`, `[TBD]`, or similar in published posts. Replace with real content or remove the section.

### Multilingual Enforcement

- MUST create all language versions. Never create a post in only one language. See `src/lib/i18n.ts` for active languages.
- If translation quality is uncertain, use `/translate-sync` skill after creating the primary version.

### Stop Conditions

**Stop and ask** if:

- Topic is too vague to write an authentic personal article (topic mode)
- Need to create a new tag
- Article would require more than 600 lines combined
- Post requires custom components not available
- Article conflicts with or heavily overlaps existing content
- Translation quality is uncertain for specialized content

## Definition of Done

- [ ] Post created in `src/content/blog/en/` (English version)
- [ ] Post created in `src/content/blog/es/` (Spanish version)
- [ ] Both versions have matching frontmatter structure
- [ ] Translated title and description are natural and accurate
- [ ] Voice is personal-professional, not marketing copy (topic mode)
- [ ] Spanish reads naturally (not machine-translated)
- [ ] Spanish uses tuteo (tú), NOT voseo (vos) — no `tenés`, `podés`, `sabés`, `querés`, etc.
- [ ] Spanish text has correct diacritical marks (ñ, accents — no `pequeno`, `tamano`, `numero`, `codigo`)
- [ ] Both EN and ES versions have `keywords` array (5-8 natural search phrases per post)
- [ ] ES keywords adapted to Spanish search behavior (not literal translations)
- [ ] No placeholder content (`[AUTHOR:`, `[TODO:`, `[TBD]`, `[FIXME]` — zero in final post)
- [ ] All referenced images exist
- [ ] `pnpm run build` passes

## Escalation Conditions

**Escalate to a higher tier** (or ask user) if:

- Article requires new Content Collections schema fields
- Topic requires creating new page templates or components
- Multiple articles need to be created as a NEW series (plan with `architect` first). Adding a single post to an existing series is fine — just set `series` and `seriesOrder` in frontmatter.
- Article requires custom interactive elements (Svelte islands)

## Examples

### Example 1: Topic Mode — Meetup Recap

**Input:**
```
$TOPIC: Recap of the March 2026 PTT meetup at UTP. Theme: AI agents in production. Three talks (Speaker 1 — agent observability, Speaker 2 — RAG patterns, Speaker 3 — agent guardrails).
$TAG: ai-agents
$PUB_DATE: 2026-03-22
$HERO_IMAGE: /images/blog/posts/march-2026-meetup-recap/hero.jpg
```

**Creates:**
- `src/content/blog/en/2026-03-22_march-2026-meetup-recap.md` (written from scratch)
- `src/content/blog/es/2026-03-22_march-2026-meetup-recap.md` (translated)
- Narrative recap with sections per speaker, takeaways, photo references, and links to the three talk pages

### Example 2: Content Mode — Post with Provided Content

**Input:**
```
$TITLE: Getting Started with Astro
$DESCRIPTION: Learn how to build fast websites with Astro
$CONTENT: [pre-written markdown content]
$TAGS: ['tech']
```

**Creates:**
- `src/content/blog/en/2026-02-11_getting-started-with-astro.md` (scaffolded)
- `src/content/blog/es/2026-02-11_getting-started-with-astro.md` (translated)

### Example 3: Topic Mode — Technical Blog Post

**Input:**
```
$TOPIC: How I built a self-hosted CI/CD pipeline using Docker and GitHub Actions
$TAG: tech
```

**Creates:**
- EN + ES articles with personal narrative about motivation, decisions, and lessons learned

### Example 4: Escalation — Vague Topic

**Input:**
```
$TOPIC: AI
```

**Result:** Stopped — topic too broad. Needs a specific personal experience, project, or angle.

## Related

- **[Writing Voice Guide](../../../docs/WRITING_VOICE_GUIDE.md)** — MANDATORY READ before topic mode. Voice characteristics, AI-slop blocklist, vocabulary to avoid, pre-publish checklist.
- **[Writing Craft Guide](../../../docs/WRITING_CRAFT_GUIDE.md)** — MANDATORY READ before topic mode. Narrative structure, fact verification (every claim must be sourced), quote handling, figure markup, refinement patterns, case studies.
- **[Blog Posts Feature Guide](../../../docs/features/BLOG_POSTS.md)** - Source of truth for blog conventions
- **[Image Optimization Guide](../../../docs/features/IMAGE_OPTIMIZATION.md)** - Image pipeline and staging workflow
- [`content-writer`](../../agents/content-writer.md) - Agent persona for complex content projects
- [`doc-edit`](../doc-edit/SKILL.md) - Edit existing posts
- [`add-page`](../add-page/SKILL.md) - Create pages
- [`translate-sync`](../translate-sync/SKILL.md) - Synchronize translations
- [`i18n-guardian`](../../agents/i18n-guardian.md) - Translation quality verification

## Changelog

> **Policy:** Keep only the 3 most recent entries. When adding a new entry, remove the oldest.

| Version | Date       | Changes |
| ------- | ---------- | ------- |
| 3.0.0   | 2026-03-08 | SEO keywords: added Step 4 for keyword generation (5-8 per post, both EN/ES). Keywords are search phrases distinct from tags. Updated frontmatter template, Definition of Done, and validation. |
| 2.9.0   | 2026-03-03 | Scheduled posts: documented that future `$PUB_DATE` creates a scheduled post (hidden in prod, amber badge in dev). Updated lifecycle references. |
| 2.8.0   | 2026-03-03 | No placeholder content: never leave [AUTHOR:], [TODO:], [TBD], [FIXME] in published posts. Added to Safety Checks and Definition of Done. |
