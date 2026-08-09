# SEO Guide

This guide documents the SEO architecture, patterns, and best practices for Pereira Tech Talks v3.0.0. It serves as the single reference for all SEO-related work.

## Overview

The site uses a layered SEO architecture:

| Layer | File | Purpose |
|-------|------|---------|
| Global head | `src/components/BaseHead.astro` | Meta tags, OG, Twitter, hreflang, JSON-LD (WebSite, Person, Organization) |
| JSON-LD injector | `src/components/JsonLd.astro` | Reusable `<script type="application/ld+json">` component |
| Page components | `src/components/pages/*Page.astro` | Page-specific schemas (BreadcrumbList, ContactPage, etc.) |
| Blog schemas | `src/components/pages/blog/BlogPostPage.astro` | BlogPosting + BreadcrumbList |
| Blog listing | `src/components/pages/blog/BlogListingPage.astro` | CollectionPage schema |
| Crawl control | `public/robots.txt` | Crawler directives + AI bot allows |
| AI guidance | `public/llms.txt`, `public/llms-full.txt` | LLM/AI engine discovery files |
| Sitemap | Auto-generated via `@astrojs/sitemap` | All pages in both languages |
| RSS feeds | `src/pages/rss.xml.js`, `src/pages/en/rss.xml.js` | Per-language RSS |
| Manifest | `public/site.webmanifest` | PWA metadata and icons |
| i18n config | `src/lib/i18n.ts` | Language config, hreflang helpers, URL utilities |
| Constants | `src/lib/constances.ts` | SITE_TITLE, SITE_DESCRIPTION |

## Meta Tags

### Required Tags (Auto-Generated via BaseHead)

Every page automatically gets these tags through `MainLayout` → `BaseHead`:

- `<title>` — from page component's `title` prop
- `<meta name="description">` — from page component's `description` prop
- `<link rel="canonical">` — computed from `Astro.url.pathname`
- `<meta name="viewport">` — fixed: `width=device-width,initial-scale=1`
- `<meta charset="utf-8">`
- `<meta name="author">` — fixed: Sergio Alexander Florez Galeano
- `<meta name="keywords">` — per-post keywords (from frontmatter `keywords` array) or global fallback

### Character Length Guidelines

- **Title**: 50-60 characters (displayed in search results)
- **Description**: 130-160 characters (displayed as snippet in SERPs)

### Meta Description Standards (MANDATORY)

**Target length:** 130-160 characters per description (both EN and ES).

**Why this range:**
- Under 130 chars: Wastes SERP real estate, lower click-through rate
- 130-160 chars: Optimal — fully displayed in Google/Bing results
- Over 160 chars: Truncated with "..." in search results, losing key information

**Where descriptions are defined:**

| Content Type | Location | Field |
|-------------|----------|-------|
| Pages | `src/lib/translations/{lang}.ts` | `{pageName}.description` |
| Site default | `src/lib/constances.ts` | `SITE_DESCRIPTION` |
| Blog posts | `src/content/blog/{lang}/*.md` | `description` frontmatter |

**Rules for writing meta descriptions:**
1. **Length:** 130-160 characters (count BEFORE committing)
2. **Content:** Summarize what the page offers and why it matters
3. **Keywords:** Include 1-2 relevant SEO keywords naturally
4. **Action-oriented:** Use compelling language that encourages clicks
5. **Unique:** Every page must have a unique description (no duplicates)
6. **Both languages:** EN and ES descriptions must both be in range independently
7. **Not literal translations:** ES descriptions should be semantically equivalent but natural in Colombian Spanish

### Keywords (Dynamic)

Blog posts can provide per-post keywords via the `keywords` frontmatter field. These are specific search phrases (distinct from categorical tags) that match how users search for the content.

- **Blog posts with `keywords`:** Rendered as `<meta name="keywords" content="phrase 1, phrase 2, ...">`
- **Pages without `keywords`:** Falls back to global site keywords (Pereira Tech Talks, Pereira tech community, bilingual tech events Colombia, La Biblioteca del Mañana, Pereira Tech Day, etc.)
- **JSON-LD:** BlogPosting `keywords` field uses the `keywords` array when present, tags as fallback

**Tags vs Keywords:**

| Aspect | Tags | Keywords |
|--------|------|----------|
| Purpose | Categorical navigation | SEO search discovery |
| Source | Controlled taxonomy (18 tags) | Free-form per post |
| Example | `tech`, `web-development` | `replace ESLint with Biome`, `Biome linter setup` |
| Internationalized | No (same slugs in EN/ES) | Yes (adapted per language) |
| Used in | Filtering, navigation, search index | `<meta name="keywords">`, JSON-LD |

### Customizing Per-Page

Page components pass `title` and `description` through `MainLayout`:

```astro
<MainLayout lang={lang} title={t.aboutPage.title} description={t.aboutPage.description}>
```

For custom OG images, pass `image` prop:

```astro
<MainLayout lang={lang} title="..." description="..." image="/images/custom-og.png">
```

## Structured Data (JSON-LD)

### Available Schemas

| Schema | Location | Scope |
|--------|----------|-------|
| WebSite | `BaseHead.astro` | Global (all pages) |
| Person | `BaseHead.astro` | Global (all pages) |
| Organization | `BaseHead.astro` | Global (DailyBot) |
| Person (enhanced) | `AboutPage.astro` | About page only |
| BlogPosting | `BlogPostPage.astro` | Individual blog posts |
| BreadcrumbList | Most page components | Per-page navigation hierarchy |
| CollectionPage | `BlogListingPage.astro` | Blog listing pages |
| ContactPage | `ContactPage.astro` | Contact page |

### Adding a New Schema

Use the `JsonLd` component in your page component:

```astro
---
import JsonLd from '@/components/JsonLd.astro';

const mySchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'My Event',
  // ... schema properties
};
---

<MainLayout ...>
  <Fragment slot="head">
    <JsonLd data={mySchema} />
  </Fragment>
  <!-- page content -->
</MainLayout>
```

### BreadcrumbList Pattern

Every non-blog page should have a BreadcrumbList. Standard pattern:

```astro
const siteUrl = Astro.site?.href?.replace(/\/$/, '') ?? '';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}${prefix}/` },
    { '@type': 'ListItem', position: 2, name: t.pageName.title, item: `${siteUrl}${prefix}/page-slug` },
  ],
};
```

### Validation

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema.org Validator**: https://validator.schema.org/
- View page source → search for `application/ld+json` to inspect schemas

## Multilingual SEO

### Languages

| Language | Code | URL Prefix | OG Locale | RSS Feed |
|----------|------|------------|-----------|----------|
| Spanish (primary) | `es` | (none — site root) | `es_ES` | `/rss.xml` |
| English | `en` | `/en` | `en_US` | `/en/rss.xml` |

### Hreflang

Automatically generated in `BaseHead.astro` using `getAlternateUrls()` from `src/lib/i18n.ts`. Every page gets:

- `<link rel="alternate" hreflang="es" href="...">` — Spanish version
- `<link rel="alternate" hreflang="en" href="...">` — English version
- `<link rel="alternate" hreflang="x-default" href="...">` — Points to **Spanish** (primary / `DEFAULT_LANGUAGE`)

### RSS Discovery

The RSS `<link>` tag in BaseHead is language-aware: Spanish pages discover `/rss.xml`, English pages discover `/en/rss.xml`.

### Canonical URLs

Built from `Astro.url.pathname` + `Astro.site`. Each language version has its own canonical URL (no cross-language canonicals).

### Content Parity

All content MUST exist in both languages:
- Pages: `src/pages/` (ES, root) + `src/pages/en/` (EN)
- Blog posts: `src/content/blog/en/` + `src/content/blog/es/`
- Translations: `src/lib/translations/en.ts` + `src/lib/translations/es.ts`

## Social Media (OG + Twitter)

### Open Graph Tags (Auto-Generated)

- `og:type` — `website`
- `og:url` — current page URL (absolute, from `Astro.site`)
- `og:title` — page title
- `og:description` — page description
- `og:image` — language default (`/images/og-default.jpg` for `es`, `/images/og-default-en.jpg` for `en`), customizable via `image` prop
- `og:image:width` — `1200`
- `og:image:height` — `630`
- `og:site_name` — from SITE_TITLE
- `og:locale` — language-specific (en_US / es_ES)
- `og:locale:alternate` — the other language

> **Host must match the URL you share.** Absolute OG URLs are built from
> `astro.config.mjs` → `site` (override with `PUBLIC_SITE_URL` / `SITE`).
> While sharing `https://pereiratechtalks.org/`, `site` must be that
> origin. Pointing `og:image` at apex `pereiratechtalks.org` today follows
> redirects into the legacy stack and 404s — Facebook then shows the favicon.

### Twitter Card Tags

- `twitter:card` — `summary_large_image`
- `twitter:site` — `@pertechtalks`
- `twitter:creator` — `@pertechtalks`

### OG Image Guidelines

- Recommended: 1200x630px JPEG (widest crawler support)
- Default fallback: `/images/og-default.jpg` (Spanish) and `/images/og-default-en.jpg` (English) via `getDefaultOgImage(lang)` — home + pages without a custom `image`
- For blog posts: can set `heroImage` in frontmatter
- For Pereira Tech Day editions: optional `ogImage` in the edition YAML — string or `{ en, es }` (falls back to `hero.src`)

## AI Engine Optimization (AEO)

For comprehensive AEO documentation, see `docs/aeo/`:
- **[AEO Audit](aeo/AUDIT.md)** — Full audit grading 4 AEO dimensions (Discoverability, Extractability, Trust, Citability)
- **[Target Queries](aeo/QUERIES.md)** — 30 target queries mapped to site URLs (TOFU/MOFU/BOFU)
- **[Monthly Checklist](aeo/CHECKLIST.md)** — Maintenance checklist for ongoing AEO health
- **[Markdown for Agents](aeo/MARKDOWN_FOR_AGENTS.md)** — Native Markdown endpoints for AI agent consumption

### Markdown for Agents (Endpoints & Content Negotiation)

Every page and blog post serves native Markdown for AI consumption:

| Type | URL pattern (EN) | URL pattern (ES) |
|------|------------------|-------------------|
| Pages | `/{page}.md` | `/es/{page}.md` |
| Blog posts | `/blog/{slug}.md` | `/es/blog/{slug}.md` |
| Blog index | `/blog/index.md` | `/es/blog/index.md` |

**Content Negotiation:** Agents can send `Accept: text/markdown` header to get Markdown without changing URLs. The Cloudflare Pages middleware (`functions/_middleware.ts`) resolves the `.md` path and serves it with `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept`.

**Maintenance:** When page components or translation strings change, update corresponding files in `src/content/pages/{en,es}/`. Blog posts auto-sync from `post.body`. See **[Markdown for Agents](aeo/MARKDOWN_FOR_AGENTS.md)** for details.

### Files

| File | Purpose | Update When |
|------|---------|-------------|
| `public/llms.txt` | Short-form site description for AI crawlers | Adding/removing pages or sections |
| `public/llms-full.txt` | Comprehensive site description | Major content or structure changes |
| `public/robots.txt` | AI crawler allow directives | New AI crawlers emerge |

### Maintenance

When adding a new page section:
1. Add the page to `llms.txt` Core Sections list
2. Add a description to `llms-full.txt` Pages section
3. No robots.txt change needed (global `Allow: /` covers new pages)

### Current AI Crawlers Allowed

GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, Google-Extended, Bytespider, CCBot, PerplexityBot, Applebot-Extended, Amazonbot, Meta-ExternalAgent, cohere-ai.

## Images & Performance

### Alt Text

- **Required**: Every `<img>` must have an `alt` attribute
- **Content images**: Descriptive alt text (e.g., `alt={post.data.title}`)
- **Decorative images**: `alt=""` only when truly decorative

### Dimensions

Always include `width` and `height` attributes to prevent CLS (Cumulative Layout Shift).

### Lazy Loading

- **Below-fold images**: `loading="lazy"`
- **Above-fold images** (hero, LCP): Do NOT add `loading="lazy"`

### Optimization Workflow

```bash
# Drop images in public/images/blog/_staging/ with naming: {slug}--{name}.{ext}
pnpm run images:optimize
```

## PageSpeed & Core Web Vitals

### Target Scores

90+ across Performance, Accessibility, Best Practices, and SEO.

### Hydration Directives

| Directive | Use When |
|-----------|----------|
| `client:load` | Immediate interactivity needed (Header, search, typewriter) |
| `client:visible` | Below-fold interactive components (timelines, ScrollToTimeline) |
| `client:idle` | Non-urgent interactivity (defer until browser is idle) |

**Rule**: Always use the laziest hydration that works. Prefer `client:visible` over `client:load`.

### Font Loading

- Fonts preloaded in BaseHead: `atkinson-regular.woff`, `atkinson-bold.woff`
- `font-display: swap` in CSS (prevents FOIT)

### CLS Prevention

- All images have explicit dimensions
- Font preloads prevent font-swap shifts
- Theme script runs inline before paint (no FOUC)

## Web App Manifest

**File**: `public/site.webmanifest`

Contains: name, short_name, description, start_url, display mode, theme colors, and icons.

**Icons**: Generated from `public/favicon.svg`:
- `public/icons/icon-192x192.png` — Android/PWA
- `public/icons/icon-512x512.png` — Android/PWA splash
- `public/icons/apple-touch-icon.png` — iOS (180x180)

**Links in BaseHead**:
- `<link rel="manifest" href="/site.webmanifest">`
- `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">`

## Sitemap & Robots.txt

### Sitemap

Auto-generated by `@astrojs/sitemap` during build. Config in `astro.config.mjs`. Produces `sitemap-index.xml` with all pages in both languages.

### Robots.txt

**Location**: `public/robots.txt`

Structure:
1. Default `Allow: /` with `Disallow: /api/`
2. Sitemap reference
3. Individual `Allow: /` for each AI crawler

**When to update**: Only when adding new AI crawler entries or changing crawl rules.

## Per-URL audit

Template review says nothing about whether all 482 URLs end up right. During
the 2026-08-09 audit a dev-server 404 fallback served the 404 page's title and
description under a real URL — exactly the class of defect a template read
cannot see. `scripts/audit-seo.mjs` reads the built HTML instead, one URL at a
time.

```bash
pnpm run seo:check                                 # summary + defects by class
pnpm run seo:check:strict                          # exits 1 on any defect (CI gate)
node scripts/audit-seo.mjs --report <dir>          # writes SEO_AUDIT.md
```

It asserts, per URL:

| Assertion | Detail |
|---|---|
| `<html lang>` | matches the language the URL promises |
| Title | present, unique **within its language**, and not the 404 title |
| Description | present, unique within its language, **130–160 characters** |
| Canonical | present and absolute; self-referential unless the page is a declared alias |
| `hreflang` | `es`, `en` and `x-default` present, and the alternate page exists in the build |
| OG + Twitter | title, description, image and URL all populated |
| JSON-LD | parses, and the type matches the page (`Event` for meetups and PTD editions, `Person` for speakers, `BlogPosting` for posts) |
| `robots` | `noindex` only on the certificate and verify surfaces |
| Verification | **no** `google-site-verification` tag anywhere (`CLAUDE.md` §11 — GSC is DNS-only) |

Uniqueness is scoped **per language** on purpose: a Spanish page and its English
twin sharing a proper-noun title ("Quarantine Tech Talks") are alternates, not
competitors, and `hreflang` already says so.

### Descriptions are composed, not hand-tuned

284 of 482 URLs once sat outside the 130–160 band. The cause was structural —
pages handed the layout a field authored for another job (a speaker page passed
the bio; a meetup archive stub passed a two-line note). `src/lib/meta-description.ts`
composes instead:

```typescript
import { buildMetaDescription, metaPhrases } from '@/lib/meta-description';

const metaDescription = buildMetaDescription({
  lead: bio,                       // the authored text, always first
  clauses: [role, phrases.community], // true statements about this page
  lang,
});
```

It extends a short lead with facts the page already states and trims a long one
at a sentence boundary. **It never pads** — a page with nothing more to say
truthfully stays short, and a test enforces that. `MainLayout` clamps to the
maximum as a last line of defence, so no page can exceed it whatever it passes in.

### Alias canonicals

`/pereira-tech-day` and `/pereira-tech-days/{currentYear}` serve the same
edition. The year URL passes `canonicalPath` through `MainLayout` → `BaseHead`
so it canonicalizes to the promoted URL; past editions stay self-canonical.

## Checklists

### New Page SEO Checklist

- [ ] Page component has `title` and `description` props passed to MainLayout
- [ ] Meta description is 130-160 characters (EN and ES independently)
- [ ] BreadcrumbList JSON-LD schema added via `<Fragment slot="head">`
- [ ] Page exists in both `src/pages/` (ES, root) and `src/pages/en/` (EN)
- [ ] Translation strings added to both `en.ts` and `es.ts`
- [ ] `llms.txt` Core Sections updated with new page
- [ ] `llms-full.txt` Pages section updated
- [ ] Verify hreflang in generated HTML
- [ ] Verify OG tags in generated HTML

### New Blog Post SEO Checklist

- [ ] Frontmatter complete: title, description, pubDate, tags, keywords, heroImage
- [ ] Description frontmatter is 130-160 characters (EN and ES independently)
- [ ] Keywords: 5-8 specific search phrases per language version
- [ ] ES keywords adapted to Spanish search behavior (not literal translations)
- [ ] Hero image optimized and in `public/images/blog/posts/{slug}/`
- [ ] Post exists in both `src/content/blog/en/` and `src/content/blog/es/`
- [ ] Tags are valid (defined in tags collection)
- [ ] BlogPosting + BreadcrumbList schemas auto-generated (verify in HTML)

### Pre-Deploy SEO Checklist

- [ ] `pnpm run seo:check` reports **0 flagged URLs**
- [ ] `pnpm run biome:check` passes
- [ ] `pnpm run astro:check` passes
- [ ] `pnpm run build` succeeds
- [ ] Sitemap generates correctly
- [ ] `llms.txt` and `llms-full.txt` are current
- [ ] No empty alt attributes on content images
