# Source Directory (`src/`)

This is the main source directory for the Pereira Tech Talks Astro website (v3.0.0). All application code, components, pages, and content live here.

## Directory Structure

```
src/
├── components/          # Reusable UI components (Astro + Svelte)
│   ├── blog/           # Blog-related components
│   ├── home/           # Homepage section components
│   └── layout/         # Layout components (Header, MobileMenu)
├── content/            # Content Collections (blog posts, tags)
│   ├── blog/           # Blog posts (Markdown/MDX)
│   └── tags/           # Tag definitions
├── layouts/            # Page layouts
│   └── MainLayout.astro
├── lib/                # Utility functions, types, constants
├── pages/              # File-based routing (all routes)
│   ├── api/            # API endpoints
│   ├── blog/           # Blog routes
│   └── es/             # Spanish language routes
├── styles/             # Global styles and Tailwind
└── content.config.ts   # Content Collections schema
```

## Folder Overview

| Folder | Purpose | Tech |
|--------|---------|------|
| `components/` | Reusable UI components | Astro (.astro) + Svelte (.svelte) |
| `content/` | Blog posts and tags | Markdown, MDX, Content Collections |
| `layouts/` | Page wrapper layouts | Astro |
| `lib/` | Utilities, types, constants | TypeScript |
| `pages/` | Routes (file-based) | Astro |
| `styles/` | Global CSS | Tailwind CSS v4 |

## Key Files

| File | Description |
|------|-------------|
| `content.config.ts` | Defines Content Collections schemas for blog and tags |
| `env.d.ts` | TypeScript environment declarations |

## Quick Start Guide

### Adding a New Page

1. Create a new `.astro` file in `pages/`
2. Import and use `MainLayout` from `layouts/`
3. The route is determined by the file path

```astro
---
// src/pages/new-page.astro
import MainLayout from '../layouts/MainLayout.astro';
---

<MainLayout title="New Page" lang="en">
  <main>
    <!-- Content -->
  </main>
</MainLayout>
```

### Adding a New Component

1. Choose the appropriate folder (`blog/`, `home/`, `layout/`, or root)
2. Use `.astro` for static components, `.svelte` for interactive ones
3. Follow naming conventions (PascalCase)

### Adding a Blog Post

1. Create a new `.md` or `.mdx` file in `content/blog/`
2. Include required frontmatter (title, description, pubDate)
3. See `content/README.md` for schema details

## Related Documentation

- [Components Documentation](./components/README.md)
- [Content Collections](./content/README.md)
- [Pages & Routing](./pages/README.md)
- [Layouts](./layouts/README.md)
- [Utilities & Types](./lib/README.md)
- [Styling Guide](./styles/README.md)
- [Architecture Guide](../docs/ARCHITECTURE.md)
- [Standards](../docs/STANDARDS.md)

## Component vs Svelte Decision

| Use Astro (`.astro`) | Use Svelte (`.svelte`) |
|---------------------|------------------------|
| Static content | Interactive UI |
| Server-rendered | Client-side state |
| No JavaScript needed | Event handlers |
| SEO-critical content | Animations |

See [Components README](./components/README.md) for detailed guidelines.
