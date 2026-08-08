# Architecture Guide

This document describes the technical architecture of Pereira Tech Talks v3.0.0, a bilingual community website built with Astro.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  Pereira Tech Talks v3.0.0                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Content    │  │  Components  │  │    Pages     │          │
│  │ Collections  │  │ .astro/.svelte│  │  (Routing)   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └────────────┬────┴────────────────┘                   │
│                      │                                          │
│              ┌───────▼───────┐                                  │
│              │  Astro Build  │                                  │
│              │    (SSG)      │                                  │
│              └───────┬───────┘                                  │
│                      │                                          │
│              ┌───────▼───────┐                                  │
│              │ Static HTML   │                                  │
│              │  + Islands    │                                  │
│              └───────────────┘                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Cloudflare Pages │
                    │   (Hosting)     │
                    └─────────────────┘
```

## Core Concepts

### Islands Architecture

Astro uses an "islands architecture" where:

1. **Static HTML** is generated at build time
2. **Interactive islands** (Svelte components) are hydrated on the client
3. **Zero JavaScript** by default - JS only loads for interactive parts

```astro
<!-- Static - no JS shipped -->
<Header />

<!-- Interactive island - JS hydrated -->
<SearchBar client:load />
```

### Build Process

```
Source Files → Astro Build → Static Output
    │                            │
    ├── .astro files            ├── HTML pages
    ├── .svelte files           ├── CSS bundles
    ├── .md/.mdx content        ├── JS chunks (islands only)
    └── assets                  └── Static assets
```

## Project Structure

### Source Directory (`src/`)

```
src/
├── components/              # Reusable UI components
│   ├── BaseHead.astro       # <head> content (SEO, meta)
│   ├── Footer.astro         # Site footer
│   ├── ThemeToggle.astro    # Dark mode switch
│   ├── FormattedDate.astro  # Date formatting
│   ├── HeaderLink.astro     # Navigation link
│   │
│   ├── blog/                # Blog-specific components
│   │   ├── BlogCard.svelte      # Post preview card
│   │   ├── BlogContainer.astro  # Blog page wrapper
│   │   ├── BlogGrid.svelte      # Posts grid layout
│   │   ├── BlogHeader.svelte    # Blog section header
│   │   ├── BlogPagination.svelte
│   │   ├── BlogSearchInput.svelte
│   │   ├── SearchResults.svelte
│   │   └── StaticBlogSearch.svelte
│   │
│   ├── home/                # Homepage sections
│   │   ├── HeroSection/
│   │   │   ├── HeroSection.astro
│   │   │   └── TypewriterWords.astro
│   │   ├── HomeSection/
│   │   │   ├── HomeSection.astro
│   │   │   ├── HomeSectionContent.astro
│   │   │   ├── HomeSectionImage.astro
│   │   │   └── enum.ts
│   │   ├── BlogPreviewSection.astro
│   │   ├── ContactSection.astro
│   │   ├── EducationSection.astro
│   │   ├── ExperienceSection.astro
│   │   ├── ProjectsSection.astro
│   │   └── SkillsSection.astro
│   │
│   └── layout/
│       ├── Header.svelte        # Main navigation
│       ├── MobileMenu.svelte    # Mobile nav menu
│       └── TopNotificationBar.svelte  # Date-windowed site alerts
│
├── content/                 # Content Collections
│   ├── authors/             # Author definitions (YAML, one per author)
│   ├── blog/                # Blog posts (auto-generates .md endpoints)
│   ├── notifications/       # Top-bar alerts (startsAt/endsAt, bilingual)
│   ├── pages/               # Page Markdown for AI agents
│   │   ├── en/              # English page content (.md endpoints)
│   │   └── es/              # Spanish page content (.md endpoints)
│   ├── series/              # Blog series definitions
│   └── tags/                # Tag definitions
│
├── content.config.ts        # Collection schemas (+ notifications, meetups, PTD, …)
├── env.d.ts                 # TypeScript environment
│
├── layouts/
│   └── MainLayout.astro     # Base page layout
│
├── lib/                     # Utilities
│   ├── blog.ts              # Blog fetching/pagination
│   ├── i18n.ts              # Centralized i18n config & utilities
│   ├── constances.ts        # Site constants
│   ├── enum.ts              # Shared enums
│   ├── satteri-plugins.ts   # Sätteri HAST plugins (Markdown transforms)
│   ├── types.ts             # TypeScript types
│   └── translations/        # Modular translation system
│       ├── index.ts         # Public API barrel: getTranslations(), re-exports
│       ├── types.ts         # SiteTranslations interface + all sub-interfaces
│       ├── en.ts            # English translations
│       └── es.ts            # Spanish translations
│
├── pages/                   # File-based routing
│   ├── index.astro          # Home (Spanish — primary, served at /)
│   ├── en/index.astro       # Home (English, served at /en)
│   ├── about.astro
│   ├── contact.astro
│   ├── blog/
│   │   ├── index.astro
│   │   ├── [...slug].astro
│   │   ├── page/[page].astro
│   │   └── tag/
│   │       ├── [tag].astro
│   │       └── [tag]/page/[page].astro
│   ├── api/
│   │   └── posts.json.ts
│   └── rss.xml.js
│
└── styles/
    └── global.css           # Global styles, Tailwind
```

## Component Architecture

### Component Types

| Type | Extension | Rendering | Use Case |
|------|-----------|-----------|----------|
| Astro | `.astro` | Build-time (static) | Layouts, static content |
| Svelte | `.svelte` | Client-side (hydrated) | Interactive UI |

### Astro Component Structure

```astro
---
// Component Script (server-side, build-time)
import { getCollection } from 'astro:content';
import BlogCard from '@/components/blog/BlogCard.svelte';

// Props interface
interface Props {
  title: string;
  limit?: number;
}

// Destructure with defaults
const { title, limit = 5 } = Astro.props;

// Data fetching (runs at build time)
const allPosts = await getCollection('blog');
const posts = allPosts
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, limit);
---

<!-- Component Template (HTML) -->
<section class="py-12">
  <h2 class="text-3xl font-bold mb-8">{title}</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {posts.map((post) => (
      <BlogCard client:visible post={post} />
    ))}
  </div>
</section>

<style>
  /* Scoped CSS (optional) */
  section {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
```

### Svelte Component Structure

```svelte
<script lang="ts">
  // Imports
  import { onMount } from 'svelte';
  import type { CollectionEntry } from 'astro:content';

  // Props (Svelte 5 runes)
  interface Props {
    post: CollectionEntry<'blog'>;
  }
  let { post }: Props = $props();

  // State
  let isHovered = $state(false);

  // Derived values
  let formattedDate = $derived(
    post.data.pubDate.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  );
</script>

<article
  class="card"
  class:hovered={isHovered}
  onmouseenter={() => isHovered = true}
  onmouseleave={() => isHovered = false}
>
  <h3>{post.data.title}</h3>
  <time>{formattedDate}</time>
  <p>{post.data.description}</p>
</article>

<style>
  .card {
    padding: 1rem;
    border-radius: 0.5rem;
    transition: transform 0.2s;
  }
  .hovered {
    transform: translateY(-4px);
  }
</style>
```

### Hydration Directives

Control when Svelte components load JavaScript:

| Directive | Behavior | Use Case |
|-----------|----------|----------|
| `client:load` | Hydrate immediately | Critical interactivity |
| `client:visible` | Hydrate when in viewport | Below-fold content |
| `client:idle` | Hydrate when browser idle | Low-priority |
| `client:media` | Hydrate on media query | Responsive features |
| (none) | No hydration | Static rendering |

```astro
<!-- Header needs immediate interactivity -->
<Header client:load lang={lang} />

<!-- Blog grid can wait until visible -->
<BlogGrid client:visible posts={posts} />

<!-- Newsletter can wait for idle -->
<Newsletter client:idle />
```

## Content Collections

### Schema Definition

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroLayout: z.enum(['banner', 'side-by-side', 'minimal', 'none'])
      .default('banner').optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().default('sergio-florez'),
  }),
});

const tags = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ base: './src/content/authors', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    avatar: z.string(),
    role: z.object({ en: z.string(), es: z.string() }),
    bio: z.object({ en: z.string(), es: z.string() }),
    social: z.object({
      x: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      instagram: z.string().optional(),
      website: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { blog, tags, series, slides, pages, authors };
```

> **See:** [Authors](./features/AUTHORS.md) for the full multi-author guide.

### Querying Content

```typescript
import { getCollection } from 'astro:content';

// Get all posts
const allPosts = await getCollection('blog');

// Filter by tag
const techPosts = await getCollection('blog', ({ data }) =>
  data.tags?.includes('tech')
);

// Sort by date
const sortedPosts = allPosts.sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
```

### Content File Structure

Files use date-prefix naming: `YYYY-MM-DD_slug.{md,mdx}`. The date prefix is stripped from URLs.

```
src/content/
├── authors/
│   └── sergio-florez.yaml               # One YAML file per author
├── blog/
│   ├── en/                              # English posts
│   │   ├── 2026-01-15_meetup-recap-january.md
│   │   ├── 2026-02-12_speaker-school-launch.md
│   │   └── ...
│   └── es/                              # Spanish posts (matching filenames, English slugs)
│       ├── 2026-01-15_meetup-recap-january.md
│       ├── 2026-02-12_speaker-school-launch.md
│       └── ...
└── tags/
    ├── ai.md
    ├── community.md
    ├── talks.md
    ├── trading.md
    └── portfolio.md
```

### Blog Post Format

```markdown
---
title: "My Blog Post"
description: "A description of the post"
pubDate: 2024-01-15
heroImage: "/images/blog/posts/my-blog-post/hero.jpg"
heroLayout: "banner"
tags: ["tech"]
---

Post content in Markdown or MDX...
```

For complete blog post documentation including hero layouts, image organization, and naming conventions, see **[Blog Posts Feature Guide](features/BLOG_POSTS.md)**.

### Markdown Pipeline — Sätteri (Astro 7)

Markdown and MDX are compiled by **Sätteri**, the Rust-powered compiler (pulldown-cmark + Oxc) that is Astro 7's default processor. It is configured once in `astro.config.mjs`:

```javascript
import { satteri } from '@astrojs/markdown-satteri';
import {
  satteriExternalLinks,
  satteriImageDefaults,
} from './src/lib/satteri-plugins';

export default defineConfig({
  markdown: {
    processor: satteri({
      hastPlugins: [satteriExternalLinks(), satteriImageDefaults()],
    }),
  },
});
```

**Critical constraint:** Sätteri does **not** run remark/rehype plugins. The legacy `markdown.remarkPlugins` / `rehypePlugins` / `remarkRehype` keys are deprecated and must not be used, and no `rehype-*` / `remark-*` dependency should be added. Content transforms are written as **HAST plugins** in [`src/lib/satteri-plugins.ts`](../src/lib/satteri-plugins.ts):

| Plugin | Applies to | Effect |
|--------|-----------|--------|
| `satteriExternalLinks()` | `<a>` | Adds `target="_blank"` + `rel="noopener noreferrer"` to `http(s)` links |
| `satteriImageDefaults()` | `<img>` | Adds `loading="lazy"` and `decoding="async"` when not already set |

A HAST plugin declares the tags it cares about via `element.filter`, and mutates nodes **through the visitor context** (`ctx.setProperty(...)`) rather than by writing to the tree directly — the context is what mirrors changes back into the Rust arena.

`@astrojs/mdx` inherits `markdown.processor` automatically, so `.md` and `.mdx` share one pipeline. To add a transform, write a new HAST plugin in `satteri-plugins.ts` and register it in the `hastPlugins` array.

> **A note on `@astrojs/markdown-remark`.** Astro 7 still ships `unified()` as a compatibility path for projects that depend on the old remark/rehype ecosystem. This repo deliberately does **not** use it — Sätteri is the supported default and the faster pipeline.

## Routing System

### File-Based Routing

```
src/pages/
├── index.astro          → /
├── about.astro          → /about
├── contact.astro        → /contact
├── es/
│   └── index.astro      → /es
└── blog/
    ├── index.astro      → /blog
    ├── [...slug].astro  → /blog/post-slug
    ├── page/
    │   └── [page].astro → /blog/page/2
    └── tag/
        ├── [tag].astro  → /blog/tag/tech
        └── [tag]/
            └── page/
                └── [page].astro → /blog/tag/tech/page/2
```

### Dynamic Routes

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection, render } from 'astro:content';
import MainLayout from '@/layouts/MainLayout.astro';

// Generate static paths at build time
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<MainLayout lang="en" title={post.data.title} description={post.data.description}>
  <article>
    <h1>{post.data.title}</h1>
    <Content />
  </article>
</MainLayout>
```

### Middleware Allowlist (CRITICAL)

`src/middleware.ts` enforces a **hardcoded allowlist** of single-segment top-level paths via `KNOWN_ROOT_PATHS` and `KNOWN_EN_PATHS`. Any single-segment URL not in the set is rewritten to `/404` — **even if the file exists at `src/pages/<name>/index.astro`**.

**Why it matters when adding a new page:**

When you add a new top-level page (e.g. `/slides`, `/foo`), you MUST also add `'<name>'` to:

- `KNOWN_ROOT_PATHS` — for the English version (`/<name>`)
- `KNOWN_EN_PATHS` — for the Spanish version (`/es/<name>`), if it exists

**Symptoms of forgetting:**

| URL | Result | Explanation |
|-----|--------|-------------|
| `/<name>` | 404 | Single segment, not in allowlist → middleware rewrites to /404 |
| `/<name>/` | 404 | Same as above |
| `/<name>/sub-path` | 200 | Multi-segment, allowlist rule does not apply |
| `/<name>/index.html` | 200 | Path contains `.`, middleware skips the check |

**The smoking gun:** dev server logs show `[404] (rewrite) /<name>` — the `(rewrite)` literal is the marker. It comes from `context.rewrite()` in the middleware, NOT from Astro's router. Do NOT debug Astro routing, file-system caches, or `[...slug]` vs `[slug]` before checking this allowlist first.

The bypass conditions (path contains `.` or starts with `/_astro/`, `/__vite`, `/@`) exist to let assets, HMR, and build artifacts through.

## API Routes

### Endpoint Pattern

```typescript
// src/pages/api/posts.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  try {
    const posts = await getCollection('blog');
    
    const data = posts.map((post) => ({
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate.toISOString(),
      tags: post.data.tags || [],
    }));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

## Layout System

### MainLayout

All pages wrap content in `MainLayout`:

```astro
---
// src/layouts/MainLayout.astro
import '@/styles/global.css';
import BaseHead from '@/components/BaseHead.astro';
import Footer from '@/components/Footer.astro';
import Header from '@/components/layout/Header.svelte';

interface Props {
  lang: string;
  title: string;
  description: string;
}

const { lang, title, description } = Astro.props;
---

<html lang={lang}>
  <head>
    <BaseHead title={title} description={description} />
    <slot name="head" />
    <script is:inline>(function(){var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');})();</script>
  </head>
  <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <Header client:load lang={lang} />
    <main class="min-h-screen">
      <slot />
    </main>
    <Footer lang={lang} />
  </body>
</html>
```

### Usage via Page Wrapper Pattern

Content pages **do not** import `MainLayout` directly. Instead, they use the Page wrapper pattern:

1. A **shared page component** in `src/components/pages/*Page.astro` handles `MainLayout` internally
2. **Thin page wrappers** in `src/pages/` are 3-line files that only set the language

**Shared component** (`src/components/pages/AboutPage.astro`):

```astro
---
import MainLayout from '@/layouts/MainLayout.astro';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/lib/i18n';

interface Props { lang: Language; }
const { lang } = Astro.props;
const t = getTranslations(lang);
---

<MainLayout lang={lang} title={t.aboutPage.title} description={t.aboutPage.description}>
  <section class="py-12">
    <h1>{t.aboutPage.title}</h1>
    <!-- Content using t.* for text -->
  </section>
</MainLayout>
```

**Page wrapper** (`src/pages/about.astro`):

```astro
---
import AboutPage from '@/components/pages/AboutPage.astro';
---
<AboutPage lang="en" />
```

This ensures one source of truth per page, with `MainLayout` managed inside the component.

## Styling Architecture

### Tailwind CSS v4

Configuration in `tailwind.config.mjs`:

```javascript
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

### Global Styles

```css
/* src/styles/global.css */
@import 'tailwindcss';

@theme {
  --color-main: #0f1124;
  --color-secondary: #e41541;
}

/* Global utilities */
.main-container {
  @apply mx-auto max-w-7xl px-4 md:px-6;
}
```

### Dark Mode

Class-based dark mode with theme persistence:

```javascript
// Inlined in MainLayout.astro (no external file) — light by default
var t = localStorage.getItem('theme');
if (t === 'dark') document.documentElement.classList.add('dark');
else document.documentElement.classList.remove('dark');
```

## Internationalization

The site is multilingual-ready (currently English/Spanish) using a centralized i18n configuration module and translation system. The architecture supports N languages with zero changes to components or utilities.

### i18n Configuration (`src/lib/i18n.ts`)

The centralized i18n module contains:
- `Language` type — union of all supported language codes
- `LANGUAGES` registry — config per language (name, locale, URL prefix, flag)
- Utility functions — `getUrlPrefix()`, `getDateLocale()`, `getOGLocale()`, `getLocalizedUrl()`, `getAlternateUrls()`, `stripLangPrefix()`, etc.

### Page Wrapper Pattern

All content pages use the **Page wrapper pattern** to eliminate duplication across languages. Each `*Page.astro` component handles `MainLayout`, translations, and SEO metadata internally. Page files in `src/pages/` are ultra-minimal 3-line wrappers that only set the language.

```
src/components/pages/           # Shared page components (handle MainLayout internally)
├── HomePage.astro              # Receives lang prop, wraps in MainLayout
├── AboutPage.astro
├── ContactPage.astro
├── CvPage.astro
├── PortfolioPage.astro
├── blog/
│   ├── BlogListingPage.astro
│   ├── BlogPostPage.astro
│   └── ...
└── ...

src/pages/                      # Thin routing wrappers (3 lines each)
├── index.astro                 # <HomePage lang="en" />
├── about.astro                 # <AboutPage lang="en" />
├── contact.astro               # <ContactPage lang="en" />
└── es/
    ├── index.astro             # <HomePage lang="es" />
    ├── about.astro             # <AboutPage lang="es" />
    └── contact.astro           # <ContactPage lang="es" />
```

**Key rules:**
- Page components handle `MainLayout` internally — wrappers never import `MainLayout`
- The `lang` prop is passed as a string literal (`"en"`, `"es"`), not a variable
- For a new page: create 1 `*Page.astro` component + N thin wrappers (one per language)
- Benefits: DRY, scalable to N languages, content changes in a single file

### Route Structure

```
src/pages/
├── index.astro          # English (default)
├── about.astro
├── contact.astro
├── blog/                # English blog routes
└── es/
    ├── index.astro      # Spanish
    ├── about.astro
    ├── contact.astro
    └── blog/            # Spanish blog routes
```

### Translation System

All UI strings are centralized in `src/lib/translations/`. The translation system is modular with separate files for each language:

**Directory Structure:**
```
src/lib/translations/
├── index.ts    # Public API barrel: getTranslations(), re-exports
├── types.ts    # SiteTranslations interface + all sub-interfaces
├── en.ts       # English translations
└── es.ts       # Spanish translations
```

**Usage in page components** (`src/components/pages/*Page.astro`):

```astro
---
import MainLayout from '@/layouts/MainLayout.astro';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/lib/i18n';

interface Props { lang: Language; }
const { lang } = Astro.props;
const t = getTranslations(lang);
---
<MainLayout lang={lang} title={t.blogTitle} description={t.blogDescription}>
  <!-- Content using t.* for all user-visible text -->
</MainLayout>
```

Page wrappers in `src/pages/` never use translations directly — they just pass `lang`.

**Adding a new language:**

1. Create `src/lib/translations/{lang}.ts` exporting a `SiteTranslations` object
2. Import it in `src/lib/translations/index.ts` and add to the `translations` record
3. Update the `Language` type in `src/lib/i18n.ts`

**Adding new translation keys:**

1. Add the new interface field to `src/lib/translations/types.ts` (if needed)
2. Add translations to both `src/lib/translations/en.ts` and `src/lib/translations/es.ts`
3. Use the new key via `getTranslations(lang)` in components

### Blog Content Collections

Blog posts are split by language folder:

```
src/content/blog/
├── en/    # English posts
└── es/    # Spanish posts (matching filenames)
```

### Tag Localization

Tags use slug-based identifiers with localized display names from `translations.ts`:
- URLs: `/blog/tag/tech/` (slug-based, language-neutral)
- Display: `t.tagNames[tag]` (localized per language)

## Build & Deployment

### Build Process

```bash
# Development
pnpm run dev              # Start dev server

# Production build
pnpm run build            # Build with type checking
pnpm run astro:preview    # Preview production build

# Cloudflare Pages
pnpm run build            # Build to dist/ folder (prebuild runs images:webp)
```

### Output Structure

```
dist/                    # Build output (Cloudflare Pages)
├── index.html
├── about/index.html
├── blog/
│   ├── index.html
│   └── [posts]/
├── _astro/              # Bundled assets
│   ├── *.css
│   └── *.js
└── images/
```

### Cloudflare Pages Configuration

- Output directory: `dist/`
- Build command: `pnpm run build`
- Custom domain configured in Cloudflare dashboard

## Performance Considerations

1. **Static Generation**: All pages pre-rendered at build time
2. **Partial Hydration**: Only interactive components load JS
3. **Image Optimization**: Use Astro's `<Image>` component
4. **CSS Purging**: Tailwind removes unused styles
5. **Code Splitting**: JavaScript split per-island

## Future Considerations

- **Testing**: Vitest for units, Playwright for E2E
- **CMS Integration**: Potential headless CMS for content
- **More Languages**: Additional i18n support
- **RSS Improvements**: Category-specific feeds
