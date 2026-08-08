# Markdown for Agents

Native Markdown delivery layer for AI agents. Every page and blog post on the site has a `.md` endpoint serving clean, agent-friendly Markdown from the original source content.

## Architecture

```
Source .md → [Astro build] → HTML page (humans)
Source .md → [Astro build] → .md endpoint (agents)
```

Both outputs come from the same source. No HTML→Markdown conversion in the path.

## Why Native Markdown Over HTML→MD Conversion

Cloudflare offers [Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/) — edge HTML→Markdown conversion when clients request `Accept: text/markdown`. However, since this site's content already exists as Markdown, serving the original source is superior:

- **Source fidelity** — original formatting, code blocks, and links preserved exactly as authored
- **Token efficiency** — no HTML tag residue from conversion; cleaner for AI consumption
- **No edge dependency** — works on any hosting platform, not just Cloudflare
- **Deterministic** — output is predictable and consistent across builds
- **Cacheable** — static files served directly, no runtime processing

## Endpoints

### Blog Posts

| Pattern | Example |
|---------|---------|
| `/blog/{slug}.md` (ES) | `/blog/meetup-recap-march.md` |
| `/en/blog/{slug}.md` (EN) | `/en/blog/meetup-recap-march.md` |

Source: `post.body` from Astro content collection (raw Markdown without frontmatter). Collection folders remain `src/content/blog/{en,es}/` — only public URLs differ (Spanish at site root, English under `/en/`).

### Blog Index

| Pattern | Description |
|---------|-------------|
| `/blog/index.md` (ES) | Lists all ES posts with `.md` links |
| `/en/blog/index.md` (EN) | Lists all EN posts with `.md` links |

### Pages

| Pattern | Example |
|---------|---------|
| `/{page}.md` (ES) | `/about.md`, `/contact.md` |
| `/en/{page}.md` (EN) | `/en/about.md`, `/en/contact.md` |

Source: `src/content/pages/{en,es}/` content collection. Public Spanish pages are unprefixed; English pages live under `/en/`.

## Response Format

```markdown
# Post Title

> Description text

Published: 2026-03-09
Updated: 2026-03-10
Language: en
Canonical: https://pereiratechtalks.org/blog/post-slug
Tags: tag1, tag2

---

[original markdown body]
```

- H1 title — universally expected by agents
- Blockquote description — visually distinct
- Simple key-value metadata — easy to parse
- Canonical URL — always points to the HTML version
- Separator before body — clear content boundary
- Site navigation footer — global nav links appended to every output (see below)

## Technical Implementation

### Key Files

| File | Purpose |
|------|---------|
| `functions/_middleware.ts` | Content negotiation (Accept: text/markdown) |
| `src/lib/markdown-for-agents.ts` | Serialization helpers |
| `src/pages/blog/[slug].md.ts` | ES blog post endpoint (site root) |
| `src/pages/en/blog/[slug].md.ts` | EN blog post endpoint (`/en/`) |
| `src/pages/blog/index.md.ts` | ES blog index |
| `src/pages/en/blog/index.md.ts` | EN blog index |
| `src/pages/[page].md.ts` | ES page endpoint (site root) |
| `src/pages/en/[page].md.ts` | EN page endpoint (`/en/`) |
| `src/content/pages/{en,es}/` | Page Markdown source files |
| `src/content.config.ts` | Pages collection schema |
| `tests/unit/lib/markdown-for-agents.test.ts` | Unit tests |

### Serialization Functions

- `serializePostToAgentMarkdown(post, { slug, lang })` — blog posts
- `serializeBlogIndexToMarkdown(entries, { lang, title, description })` — blog index
- `serializeSeriesIndexToMarkdown(entries, { slug, seriesTitle, seriesDescription, lang })` — series index
- `serializePageToAgentMarkdown(page, { slug, lang })` — non-blog pages

### Site Navigation Partial

Every serialized markdown output includes a **Site Navigation** section appended at the end. This mirrors the HTML navbar and footer, ensuring AI agents can discover all site pages from any entry point.

The navigation is generated programmatically by `generateSiteNavigation(lang)` in `markdown-for-agents.ts` — a single source of truth that is language-aware (applies the correct URL prefix for EN/ES). The navigation structure is defined as data (`SITE_NAV_SECTIONS`) in the same file, organized into sections: Main, Work, About, and Connect (social links).

**Why programmatic instead of a `.md` partial file?**
- Language-aware: Spanish links stay unprefixed at site root; English links get the `/en/` prefix
- Single definition: one data structure generates both EN and ES navigation
- No manual sync: adding the nav to new serialization functions requires only one line (`generateSiteNavigation(lang)`)
- Always consistent: impossible for individual page markdown files to have stale navigation

**When to update:** If a new page is added to the site navbar, add it to `SITE_NAV_SECTIONS` in `src/lib/markdown-for-agents.ts`.

### Content Collections

- **Blog posts**: Existing `blog` collection. `post.body` provides raw Markdown.
- **Pages**: New `pages` collection in `src/content/pages/`. Each page has EN and ES versions.

## Scalability

- **New blog post** → Automatically gets a `.md` endpoint (no code changes)
- **New page** → Add a `.md` file to `src/content/pages/{en,es}/` and a `.md` endpoint is generated
- **Content updates** → Reflected on next build automatically

## Performance Impact

**Zero.** The `.md` endpoints are separate static files generated at build time. They do not add any JavaScript, runtime processing, or SSR overhead. HTML pages and their PageSpeed/Lighthouse scores are completely unaffected.

## Content Negotiation via `Accept: text/markdown`

The Cloudflare Pages middleware (`functions/_middleware.ts`) supports automatic content negotiation. When a request includes `Accept: text/markdown`, the middleware serves the `.md` version of the page instead of HTML — no URL change needed.

**How it works:**
1. Middleware checks the `Accept` header for `text/markdown`
2. Resolves the `.md` asset path (e.g., `/about` → `/about.md`)
3. Fetches the static `.md` file via `context.env.ASSETS.fetch()`
4. Returns it with `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept`

**Path resolution:**
| Request Path | Resolved `.md` Path |
|---|---|
| `/` | `/index.md` |
| `/about` | `/about.md` |
| `/about/` | `/about.md` |
| `/blog/my-post` | `/blog/my-post.md` |
| `/en/about` | `/en/about.md` |

**Excluded paths:** `/api/*`, `/internal/*`, `/_*`, and any path with a file extension (`.js`, `.css`, `.png`, etc.).

**Fallback:** If no `.md` file exists for the requested path, the middleware falls back to serving HTML normally.

**Testing with curl:**
```bash
# Get Markdown
curl -H "Accept: text/markdown" https://pereiratechtalks.org/about

# Get HTML (default)
curl https://pereiratechtalks.org/about

# Direct .md URL also works
curl https://pereiratechtalks.org/about.md
```

**Response headers for content-negotiated Markdown:**
- `Content-Type: text/markdown; charset=utf-8`
- `Cache-Control: public, max-age=3600`
- `Vary: Accept` — tells caches that response varies by Accept header
- `X-Content-Negotiation: markdown` — signals the response was content-negotiated

## Analytics

Markdown endpoint usage is tracked server-side via Umami `markdown_request` events. Two sources are distinguished:

| Source | Trigger | Example |
|--------|---------|---------|
| `content_negotiation` | Agent sends `Accept: text/markdown` header | `curl -H "Accept: text/markdown" /about` |
| `direct_url` | Agent/user navigates to a `.md` URL | `curl /about.md` |

Each event captures: bot name (or `"unknown"`), requested path, source, and User-Agent. See **[Analytics Guide](../ANALYTICS.md)** (Tier 5) for payload details and Umami dashboard queries.

**Performance impact:** Zero for HTML visitors — tracking only fires on markdown requests.

## Maintenance

- **No ongoing maintenance for blog posts** — endpoints auto-generated from `post.body` (always in sync)
- **Page Markdown MUST stay in sync with HTML content** — when translation strings (`en.ts`/`es.ts`) or page components (`*Page.astro`) change, update the corresponding files in `src/content/pages/{en,es}/`
- **Both languages required** — every change to an EN `.md` must be reflected in the ES `.md` (and vice versa)
- **Include internal links** — page Markdown should contain links to other site pages so agents can discover the full site structure
- **Full content, not summaries** — page Markdown should match the semantic content of the HTML page (strip presentation chrome, keep all text, links, and structure)
- **Discovery files** — `llms.txt` and `llms-full.txt` reference the endpoints
- **Tests** — `pnpm run test` covers serialization correctness

### Sync Rule for AI Agents

**When ANY of these change, update the corresponding `src/content/pages/{en,es}/*.md`:**

| What Changed | Files to Update |
|---|---|
| Translation strings in `en.ts` | `src/content/pages/en/{page}.md` |
| Translation strings in `es.ts` | `src/content/pages/es/{page}.md` |
| Page component (`*Page.astro`) adds/removes sections | Both EN and ES `.md` files |
| New page created (via `/add-page` skill) | Both EN and ES `.md` files (Step 4 of skill) |
| Page removed | Remove both EN and ES `.md` files |
