# Blog Content Lifecycle

Guide to blog post visibility states for Pereira Tech Talks v3.0.0: published, scheduled, draft, and demo.

> **Scope:** This guide covers the `blog` collection. The same lifecycle states (published / scheduled / draft / demo) and the helpers in `src/lib/blog.ts` apply uniformly to other PTT collections that use a publish date — `meetups`, `events`, `pereiraTechDays`, `talks`. When a sibling helper exists (e.g., `src/lib/meetup.ts`), it imports the same `isScheduledPost`, `isDraftPost`, `isDemoPost`, `shouldHideDrafts`, and `isPostVisibleInProduction` primitives. The rules below are written for blog posts; substitute the collection name as needed.

## Overview

Blog posts in this project have four visibility states:

1. **Published** — visible everywhere (production and dev)
2. **Scheduled** — future `pubDate`, visible only in dev with an amber badge
3. **Draft** — `draft: true` in frontmatter, visible in dev + preview branches with a purple badge
4. **Demo** — in `_demo/` folders, accessible only by direct URL in dev

All visibility decisions flow through one helper — `isPostVisibleInProduction()` in `src/lib/blog.ts` — so listings, tag pages, series pages, search, RSS, sitemap, and agent-markdown endpoints stay in sync.

## Post Visibility States

### Published Posts (Default)

All posts in `src/content/blog/{lang}/` (outside `_demo/` folders) with a `pubDate` in the past or today are published and visible in production.

**Behavior:**
- Appear in blog listings, tag pages, RSS, and search
- Accessible via direct URL in both dev and production
- No special frontmatter required

### Scheduled Posts

Posts with a `pubDate` set to a **future date** are scheduled. They use the existing `pubDate` field — no schema changes needed.

**Detection:** A post is scheduled if its date (in `SITE_TIMEZONE` = America/Bogota) is after today's date in that timezone. Checked by `isScheduledPost()` in `src/lib/blog.ts`:

```typescript
// Uses SITE_TIMEZONE (America/Bogota) for consistent scheduling
const todayInTz = new Date().toLocaleDateString('en-CA', { timeZone: SITE_TIMEZONE });
const pubDateInTz = post.data.pubDate.toLocaleDateString('en-CA', { timeZone: SITE_TIMEZONE });
return pubDateInTz > todayInTz;
```

**Behavior:**
- **Production:** Completely excluded — no routes, no listings, no search, no RSS
- **Dev (listings/search/tags):** Visible in all listings with an amber "Scheduled" badge
- **Dev (detail page):** Accessible with an amber banner showing the scheduled publication date

**Visual indicators (dev only):**
- Blog cards: Amber pill badge next to the date
- Detail page: Amber banner below breadcrumb with publication date

**How to schedule:** Set `pubDate` to a future date. After the date passes, rebuild and deploy.

### Draft Posts

Draft posts are work-in-progress articles you want committed to the repo and reviewed on a preview branch without shipping to the public site. Mark a post with `draft: true` in its frontmatter.

**Detection:** `isDraftPost()` in `src/lib/blog.ts` returns `true` when `post.data.draft === true`. The visibility rule lives in `shouldHideDrafts()`:

```typescript
export function shouldHideDrafts(): boolean {
  if (import.meta.env.DEV) return false;                    // dev server: show
  if (process.env.SHOW_DRAFTS === 'true') return false;     // explicit override
  const cfBranch = process.env.CF_PAGES_BRANCH;
  if (cfBranch) return PRODUCTION_BRANCHES.includes(cfBranch);
  return true;                                              // local `pnpm run build`: hide
}
```

| Environment | Drafts visible? |
|-------------|-----------------|
| `pnpm run dev` | Yes |
| Cloudflare Pages preview branch (any non-production branch) | Yes |
| Cloudflare Pages production (`main` / `master`) | No |
| Local `pnpm run build` (no `CF_PAGES_BRANCH`) | No |
| Any build with `SHOW_DRAFTS=true` | Yes |

Override the production-branch allowlist with `PRODUCTION_BRANCHES=live,main`.

**Behavior:**
- **Production:** Completely excluded — no routes, no listings, no search, no RSS, no sitemap, no agent markdown.
- **Preview / Dev (listings/search/tags):** Visible in all listings with a purple "Draft" badge.
- **Preview / Dev (detail page):** Accessible with a purple banner above the article body.

**Visual indicators:**
- Blog cards: Purple pill badge next to the date (`t.draftBadge`).
- Detail page: Purple banner below the breadcrumb (`t.draftBannerTitle` + `t.draftBannerMessage`).

**Authoring workflow:**
1. Create the post in both `src/content/blog/en/` and `src/content/blog/es/` with `draft: true`. Translate title, description, body as usual.
2. Commit, push, and open the Cloudflare Pages preview URL to review the rendered post with the Draft banner.
3. When ready to ship, remove `draft: true` (or set it to `false`) in all language files and merge to `main`.

**Series membership:** Toggling `draft: true` leaves `series`/`seriesOrder` on disk. A draft chapter rejoins the series cleanly once the flag is removed.

### Demo Posts

Demo posts are stored in `_demo/` subdirectories and serve as **structural references** for formatting, layouts, and capabilities. They are **never** visible in production.

**Detection:** A post is identified as demo if its file path contains `/_demo/`. This is checked by the `isDemoPost()` function in `src/lib/blog.ts`:

```typescript
function isDemoPost(post: CollectionEntry<'blog'>): boolean {
  return post.id.includes('/_demo/');
}
```

**Behavior:**
- **Production:** Not built at all (filtered from all routes and APIs)
- **Dev (listings/search/tags):** Hidden from all listings, tag pages, search results, and RSS
- **Dev (direct URL):** Accessible by direct URL (e.g., `http://localhost:8888/blog/demo-hero-banner/`)
- **Badge:** No badge system exists — demo posts are simply accessible but unlisted in dev

**Why direct URL access in dev?** This allows developers and AI agents to view demo posts in rendered form to understand layout and formatting options while keeping them out of normal browsing flows.

---

## Demo Posts

Demo posts showcase blog features and serve as **structural references** for formatting, layouts, and capabilities.

### Purpose for AI Agents

**When writing new blog posts, agents SHOULD read the demo posts in `src/content/blog/en/_demo/` as templates.** These files demonstrate the correct structure, frontmatter patterns, formatting conventions, and layout options for different article types. Before creating a new post, review the relevant demo post(s) to match the appropriate structure (e.g., read `demo-hero-banner.md` if using a landscape hero, `demo-code-showcase.md` if the article has code blocks).

### Location

Demo posts are stored in dedicated `_demo/` subdirectories:

```
src/content/blog/
├── en/
│   ├── _demo/                    # English demo posts
│   │   ├── 2025-01-01_demo-hero-banner.md
│   │   ├── 2025-01-02_demo-hero-side-by-side.md
│   │   ├── 2025-01-03_demo-hero-minimal.md
│   │   ├── 2025-01-04_demo-hero-none.md
│   │   ├── 2025-01-05_demo-mdx-showcase.mdx
│   │   ├── 2025-01-06_demo-rich-formatting.md
│   │   └── 2025-01-07_demo-code-showcase.md
│   └── (regular posts)
└── es/
    ├── _demo/                    # Spanish demo posts (matching)
    │   └── (same filenames as en/_demo/)
    └── (regular posts)
```

### The `demo` Tag

All demo posts use the `demo` tag alongside their content-relevant tags:

```markdown
tags: ['tech', 'demo']
```

The `demo` tag is defined in `src/content/tags/demo.md` and has translations in `src/lib/translations/`.

**Tag visibility rules:**
- The `demo` tag never appears in production (no demo posts exist to use it)
- The `demo` tag is hidden from tag filters in dev mode (demo posts are filtered from listings)
- Clicking the demo tag URL directly (e.g., `/blog/tag/demo/`) shows zero posts in dev mode (consistent with listing behavior)

**Why keep the tag?** The `demo` tag serves as metadata for demo posts and is preserved for consistency, even though the tag filter never exposes it.

### What Demo Posts Showcase

The current demo posts cover:

| Post | Purpose |
|------|---------|
| `demo-hero-banner` | `heroLayout: 'banner'` — full-width landscape image |
| `demo-hero-side-by-side` | `heroLayout: 'side-by-side'` — two-column with square image |
| `demo-hero-minimal` | `heroLayout: 'minimal'` — small thumbnail |
| `demo-hero-none` | `heroLayout: 'none'` — text-only, no image |
| `demo-mdx-showcase` | MDX features: inline components, variables, dynamic tables |
| `demo-rich-formatting` | All Markdown formatting: headings, lists, tables, blockquotes |
| `demo-code-showcase` | Syntax highlighting across 10+ languages |

### Creating New Demo Posts

1. Place the file in `src/content/blog/{lang}/_demo/`
2. Include `'demo'` in the `tags` array
3. Create both EN and ES versions (bilingual requirement applies)
4. The `_demo/` folder detection automatically marks the post as demo

### Accessing Demo Posts in Dev

Visit the direct URL:
- English: `http://localhost:8888/blog/{slug}/`
- Spanish: `http://localhost:8888/es/blog/{slug}/`

Example: `http://localhost:8888/blog/demo-hero-banner/`

The post will render normally but will not appear in any listings, search results, or tag pages.

---

## Production Safety

The following safeguards ensure demo and scheduled content never leaks to production:

1. **`getBlogPosts()`:** Filters out demo posts (`isDemoPost()`) and scheduled posts (`isScheduledPost()`) in production
2. **`getStaticPaths()`:** Detail routes exclude both demo and scheduled posts in production
3. **Search API endpoints:** Filter out demo posts; scheduled posts filtered via `getSearchIndex()`
4. **RSS feeds:** Exclude both demo and scheduled posts
5. **`getRelatedPosts()` and `getSeriesNavigation()`:** Exclude demo and scheduled posts in production
6. **Demo folder:** `_demo/` posts are always filtered regardless of build mode
7. **Demo tag:** Not generated in production builds (no demo posts reference it in visible content)
8. **Direct URL builds:** In production, neither demo nor scheduled post routes are generated

### Markdown Endpoint Visibility

Blog post Markdown endpoints (`.md` files) follow the same visibility rules as HTML pages. The `isDemoPost()` and `isScheduledPost()` filters apply equally to `.md` endpoint generation — demo and scheduled posts are excluded from `.md` output in production.

### Verification

After building for production (`pnpm run build`), verify:

```bash
# No demo tag page in production
ls dist/blog/tag/
# Should NOT contain 'demo'

# No demo posts in API
cat dist/api/posts-en.json | node -e "
  const posts = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
  const demo = posts.filter(p => p.id.includes('/_demo/'));
  console.log('Demo posts in prod:', demo.length);  // Should be 0
"

# No demo post detail pages
ls dist/blog/ | grep demo
# Should return no results
```

---

## Key Source Files

| File | Purpose |
|------|---------|
| `src/lib/blog.ts` | `isDemoPost()`, `isScheduledPost()`, `getBlogPosts()` — detection and filtering |
| `src/content.config.ts` | Blog collection schema (no special demo field needed) |
| `src/pages/blog/[...slug].astro` | Dynamic post route with `import.meta.env.DEV` check for demo access |
| `src/pages/api/posts-en.json.ts` | EN search shard with demo post filtering |
| `src/pages/api/posts-es.json.ts` | ES search shard with demo post filtering |
| `src/pages/api/posts.json.ts` | Compatibility aggregate endpoint |
| `src/content/tags/demo.md` | Demo tag definition |
| `src/lib/translations/` | Translation strings for the demo tag |

---

## Related Documentation

- [Blog Posts](./BLOG_POSTS.md) - File naming, frontmatter schema, hero layouts, image organization
- [Image Optimization](./IMAGE_OPTIMIZATION.md) - Image pipeline and staging workflow
- [Architecture Guide](../ARCHITECTURE.md) - Overall site architecture
