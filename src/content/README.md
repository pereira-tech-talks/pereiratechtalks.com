# Content Collections (`src/content/`)

This directory contains Content Collections for blog posts and tags. Astro's Content Collections provide type-safe frontmatter validation and easy querying of content.

**Detailed guides:**

- **[Blog Posts](../../docs/features/BLOG_POSTS.md)** - File naming, frontmatter schema, hero layouts, image organization
- **[Blog Content Lifecycle](../../docs/features/BLOG_CONTENT_LIFECYCLE.md)** - Draft, scheduled, demo posts, preview mode
- **[Image Optimization](../../docs/features/IMAGE_OPTIMIZATION.md)** - Image pipeline and staging workflow

## Directory Structure

```
content/
├── blog/
│   ├── en/                              # English posts
│   │   ├── _demo/                       # Demo posts (dev only)
│   │   │   ├── 2025-01-01_demo-hero-banner.md
│   │   │   ├── 2025-01-02_demo-hero-side-by-side.md
│   │   │   └── ...
│   │   ├── 2025-03-15_march-2026-meetup-recap.md
│   │   ├── 2026-04-09_library-of-tomorrow-introduction.md
│   │   └── ...
│   └── es/                              # Spanish posts (matching filenames)
│       ├── _demo/                       # Demo posts (matching en/_demo/)
│       │   └── ...
│       ├── 2025-03-15_march-2026-meetup-recap.md
│       └── ...
└── tags/                                # Tag definitions
    ├── tech.md
    ├── personal.md
    ├── talks.md
    ├── trading.md
    ├── portfolio.md
    └── demo.md                          # Dev-only tag for demo posts
```

## Blog Collection

### File Naming

**Format:** `YYYY-MM-DD_slug.{md,mdx}` (underscore separator)

The date prefix uses `pubDate` and is stripped from URLs (clean slugs: `/blog/my-post/`).

**Bilingual requirement:** Every post **must** exist in both `en/` and `es/` with the **same filename**.

### Schema

Defined in `src/content.config.ts`:

```typescript
schema: z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  heroLayout: z.enum(['banner', 'side-by-side', 'minimal', 'none'])
    .default('banner').optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false).optional(),
})
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title |
| `description` | Yes | Post excerpt (50-160 chars for SEO) |
| `pubDate` | Yes | Publication date. Future dates = **scheduled** post |
| `updatedDate` | No | Last update date |
| `heroImage` | No | Path: `/images/blog/posts/{slug}/hero.{ext}` |
| `heroLayout` | No | `banner` (default), `side-by-side`, `minimal`, `none` |
| `tags` | No | Array of tag IDs from `src/content/tags/` |
| `draft` | No | `true` = **draft** post (hidden from production). Default: `false` |

### Content Lifecycle

Posts have visibility states based on `draft` and `pubDate`:

| State | How to create | Production | Dev `?preview=all` |
|-------|--------------|:----------:|:------------------:|
| Published | `draft: false` + past `pubDate` | Visible | Visible |
| Draft | `draft: true` | Hidden | Visible (amber badge) |
| Scheduled | Future `pubDate` | Hidden | Visible (blue badge) |
| Demo | File in `_demo/` folder | Hidden | Visible (purple badge) |

**Preview mode:** Visit `/blog/?preview=all` in dev to see all posts including hidden ones.

See **[Blog Content Lifecycle](../../docs/features/BLOG_CONTENT_LIFECYCLE.md)** for the complete guide.

### Frontmatter Examples

**Published post:**

```markdown
---
title: 'My Post Title'
description: 'A brief description.'
pubDate: '2026-01-31'
heroImage: '/images/blog/posts/my-post/hero.jpg'
heroLayout: 'banner'
tags: ['tech']
---
```

**Draft post:**

```markdown
---
title: 'Work in Progress'
description: 'Still drafting this.'
pubDate: '2026-02-15'
tags: ['tech']
draft: true
---
```

**Scheduled post:**

```markdown
---
title: 'Coming Soon'
description: 'This publishes automatically on rebuild after the date.'
pubDate: '2026-06-15'
tags: ['tech']
---
```

### Demo Posts

Demo posts are stored in `_demo/` subdirectories and showcase blog features (hero layouts, MDX, formatting, syntax highlighting). They are **never** visible in production.

- Always include the `demo` tag: `tags: ['tech', 'demo']`
- Must exist in both `en/_demo/` and `es/_demo/`
- See [Blog Content Lifecycle](../../docs/features/BLOG_CONTENT_LIFECYCLE.md#demo-posts) for details

## Tags Collection

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Tag identifier (matches `tags` array in blog posts) |
| `description` | `string` | No | Tag description |

### Current Tags

| Tag | Description | Visibility |
|-----|-------------|------------|
| `tech` | Technical tutorials and guides | Always |
| `personal` | Personal posts and experiences | Always |
| `talks` | Conference talks and presentations | Always |
| `trading` | Trading and finance content | Always |
| `portfolio` | Portfolio/branding | Always |
| `demo` | Demo posts showcasing blog features | Dev only |

Tag display names are localized in `src/lib/translations.ts` via `t.tagNames[tag]`.

### Creating a New Tag

1. Create `src/content/tags/{tag-name}.md`:

```markdown
---
name: "tag-name"
description: "Description of this tag."
---
```

2. Add translations in `src/lib/translations.ts` (both EN and ES):

```typescript
tagNames: { ..., 'tag-name': 'Display Name' },
tagDescriptions: { ..., 'tag-name': 'Description shown on tag page.' },
```

## Querying Collections

```typescript
import { getCollection } from 'astro:content';

// All posts
const allPosts = await getCollection('blog');

// Posts by tag
const techPosts = await getCollection('blog', ({ data }) =>
  data.tags?.includes('tech')
);

// Using the blog utility (recommended — handles filtering, pagination, sorting)
import { getBlogPosts } from '@/lib/blog';
const result = await getBlogPosts({ lang: 'en', tag: 'tech', page: 1 });
```

## Related Documentation

- [Blog Posts Feature Guide](../../docs/features/BLOG_POSTS.md) - Full reference
- [Blog Content Lifecycle](../../docs/features/BLOG_CONTENT_LIFECYCLE.md) - Draft, scheduled, demo, preview mode
- [Blog Components](../components/blog/README.md)
- [Library Functions](../lib/README.md) - `getBlogPosts()` utility
