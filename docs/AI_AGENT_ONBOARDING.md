# AI Agent Onboarding

Quick start guide for AI coding assistants (Cursor AI, Claude Code, ChatGPT, Gemini, etc.) working on Pereira Tech Talks v3.0.0.

## Tech Stack Overview

| Technology | Version | Purpose |
|------------|---------|---------|
| **Astro** | 5.16.15 | Static site generator (islands architecture) |
| **Svelte** | 5.48.0 | Interactive components |
| **TypeScript** | 5.9.3 | Type-safe development |
| **Tailwind CSS** | 4.1.18 | Utility-first CSS framework |
| **Biome** | 2.3.11 | Linter and formatter |
| **MDX** | 4.3.13 | Enhanced Markdown for blog |

## Project Type

- **Pereira Tech Talks v3.0.0** — bilingual website and content platform for the technology community of Pereira, Colombia
- **Static Site Generation (SSG)** — builds to static HTML
- **Multilingual** — English (default) and Spanish, with all slugs in English
- **Per-edition branding** — each Pereira Tech Day edition ships its own scoped brand kit
- **Deployed to** Cloudflare Pages

## Repository Structure

```
pereiratechtalks.org/
├── src/
│   ├── components/      # UI components (.astro, .svelte)
│   ├── content/         # Content Collections (blog, slides, meetups, events, pereira-tech-days, verticals, speakers, talks, contributors, sponsors, channels, tags, series, authors)
│   ├── layouts/         # Page layouts (MainLayout, InternalLayout, ShowcaseLayout, SlideLayout)
│   ├── lib/             # Utilities and types (one helper module per collection)
│   ├── pages/           # File-based routing (EN root, ES /es/, /internal/ dev-only)
│   └── styles/          # Tailwind 4 theme tokens (--color-ptt-*)
├── public/              # Static assets (.well-known/, openapi.json, robots.txt)
├── docs/                # Documentation
├── .agent_commands/     # Deep work plan templates
└── .agents/             # Skills, commands, agent definitions
```

## Critical Rules (MUST FOLLOW)

### 1. Language

**ALL code MUST be in English** - variables, comments, commits, docs.

### 2. Code Quality

**Use Biome** (NOT ESLint/Prettier):

```bash
pnpm run biome:check    # Check issues
pnpm run biome:fix      # Auto-fix
```

### 3. TypeScript

**Run type checking**:

```bash
pnpm run astro:check
```

### 4. Import Order

```typescript
// 1. Node.js native
import { dirname } from 'node:path';

// 2. Third-party
import { getCollection } from 'astro:content';

// 3. Internal (@ alias)
import Header from '@/components/layout/Header.svelte';

// 4. Types
import type { CollectionEntry } from 'astro:content';
```

### 5. Components

- **Astro** (`.astro`) - Static content
- **Svelte** (`.svelte`) - Interactive components

```astro
<!-- Hydrate Svelte for interactivity -->
<Header client:load lang={lang} />
```

### 6. Dark Mode

Always support dark mode:

```html
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
```

### 7. Blog Post Creation Workflow

New blog posts MUST be created with the `/add-blog-post` skill (not manual file scaffolding).

- Create both language files in the same task: `src/content/blog/en/` and `src/content/blog/es/`
- Use date-prefix naming: `YYYY-MM-DD_slug.md`
- Keep frontmatter synchronized across languages (`pubDate`, `heroImage`, `heroLayout`, `tags`, `series`, `seriesOrder`)
- Validate with `pnpm run build`

### 8. Blog Search Performance Guardrails

- Keep search static-only and language-sharded (`/api/posts-en.json`, `/api/posts-es.json`)
- Do **not** inline full search index data into blog listing/tag page HTML
- Keep search index metadata-only (no full markdown body)
- For search-related changes, run:

```bash
pnpm run build
pnpm run search:budgets
```

### 9. Analytics Verification Policy

- Google Search Console verification is DNS-based (Domain property TXT), not meta-tag based.
- Do not add `PUBLIC_GOOGLE_SITE_VERIFICATION` or `google-site-verification` meta tags.
- Keep Bing verification as optional env-based meta tag (`PUBLIC_BING_SITE_VERIFICATION`).

## Essential Commands

```bash
# Development
pnpm run dev              # Start dev server (localhost:8888)
pnpm run build            # Production build
pnpm run astro:preview    # Preview build

# Code Quality
pnpm run biome:check      # Lint check
pnpm run biome:fix        # Auto-fix
pnpm run astro:check      # Type check

# Deployment
pnpm run build            # Production build (Cloudflare Pages)
```

## Key Patterns

### Content Collections

Blog posts in `src/content/blog/`:

```yaml
---
title: "Post Title"
description: "Description"
pubDate: 2024-01-15
tags: ["tech"]
---
```

### Page Wrapper Pattern

All content pages use the **Page wrapper pattern**. Pages in `src/pages/` are 3-line wrappers. Logic lives in `src/components/pages/*Page.astro`:

**Page component** (`src/components/pages/AboutPage.astro`):
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
  <section>{t.aboutPage.title}</section>
</MainLayout>
```

**Page wrapper** (`src/pages/about.astro` — 3 lines):
```astro
---
import AboutPage from '@/components/pages/AboutPage.astro';
---
<AboutPage lang="en" />
```

### API Routes

In `src/pages/api/`:

```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

## Common Tasks

### Add a Blog Post

1. Use `/add-blog-post` (mandatory workflow)
2. Ensure EN + ES files are both created/updated in `src/content/blog/{lang}/`
3. Verify frontmatter includes required fields and optional series fields when applicable
4. Run `pnpm run build` to validate Content Collections

### Add a Component

1. Create in `src/components/`
2. Use `.astro` for static, `.svelte` for interactive
3. Import with `@/components/...`

### Add a Page

1. Create shared component in `src/components/pages/*Page.astro` (handles `MainLayout` internally)
2. Create thin wrappers in `src/pages/` and `src/pages/es/` (3 lines each, pass `lang` as string literal)
3. Add translation keys to `src/lib/translations/` if needed

## What NOT to Do

❌ Write code in Spanish
❌ Use ESLint or Prettier
❌ Skip `pnpm run biome:check`
❌ Forget dark mode support
❌ Skip `client:load` on interactive Svelte
❌ Expect `pnpm run test` to work (not configured)

## Documents to Read

1. **[AGENTS.md](../AGENTS.md)** - Main guidance (read first!)
2. **[STANDARDS.md](STANDARDS.md)** - Coding conventions
3. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical details
4. **[DEVELOPMENT_COMMANDS.md](DEVELOPMENT_COMMANDS.md)** - Full command reference

## Quick Validation

Before any commit:

```bash
pnpm run biome:check && pnpm run astro:check && pnpm run build
```

All three must pass.

## Getting Help

- **Astro Docs**: https://docs.astro.build/
- **Svelte Docs**: https://svelte.dev/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Biome Docs**: https://biomejs.dev/
