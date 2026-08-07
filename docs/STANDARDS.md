# Repository Standards

This document defines the **canonical coding rules** for all contributors and AI agents working on Pereira Tech Talks v3.0.0.

## Language Standards

### English Only (MANDATORY)

**ALL code, comments, documentation, and commit messages MUST be in English.**

✅ **Do:**
- Variable names: `pageTitle`, `blogPosts`, `isMenuOpen`
- Comments: `// Fetch blog posts sorted by date`
- Commit messages: `feat: add dark mode toggle`

❌ **Don't:**
- Variable names: `tituloPagina`, `publicaciones`
- Comments: `// Obtener publicaciones del blog`
- Commit messages: `feat: agregar modo oscuro`

### Orthography & Diacritical Marks (MANDATORY)

**Correct spelling is essential in ALL languages.** Every piece of user-facing text — blog posts, translation strings, UI labels, descriptions — MUST use proper orthography, including diacritical marks (accents, tildes, ñ).

**Spanish orthography rules:**

- **Always use ñ:** pequeño, tamaño, año, niño, señal, español, diseño, enseñar, mañana, caña, sueño, compañía, pestaña
- **Always use accented vowels:** análisis, más, número, código, máquina, ejecución, versión, información, aplicación, descripción, sección, también, después, página, título, último, próximo, índice, búsqueda, artículo, categoría, navegación, configuración, aquí, así, rápido, fácil, típico, científico, académico, práctica, automáticamente, producción, integración
- **Question/exclamation words need accents:** cómo, qué, cuál, dónde, cuándo, cuánto, por qué
- **Verb forms:** está (is), será (will be), empecé (I started), comenzó (started), surgió (emerged)
- **Tuteo, NOT voseo (MANDATORY):** Always use tú conjugations (tienes, puedes, sabes, quieres, haces, necesitas, dices). NEVER use vos conjugations (tenés, podés, sabés, querés, hacés, necesitás, decís). The register is informal-professional with Colombian Spanish phrasing.

**English orthography rules:**

- Use correct spelling for technical terms and common words
- Verify proper capitalization of brand names and acronyms

**Pre-commit check for Spanish content:**

Before committing any Spanish text (blog posts, translations, UI strings), verify:
- [ ] All ñ characters are present (search for `pequeno`, `tamano`, `ano`, `diseno`, `espanol`)
- [ ] All accented vowels are present (search for `analisis`, `numero`, `codigo`, `ejecucion`, `version`)
- [ ] Question words have accents when interrogative (`cómo`, `qué`, `dónde`)
- [ ] No voseo forms (search for `tenés`, `podés`, `sabés`, `querés`, `hacés`, `necesitás`, `decís`)

## TypeScript Standards

### Type Annotations

TypeScript is configured with relaxed rules for flexibility. However, prefer explicit types:

```typescript
// Good: Explicit return type
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-us');
}

// Good: Interface for component props
interface Props {
  title: string;
  description?: string;
  tags?: string[];
}

// Good: Use Astro's built-in types
import type { CollectionEntry } from 'astro:content';
type BlogPost = CollectionEntry<'blog'>;
```

### Type Inference

Let TypeScript infer types when obvious:

```typescript
// Good: Inferred as string
const title = 'My Blog Post';

// Good: Inferred as number[]
const numbers = [1, 2, 3];

// Explicit when not obvious
const config: SiteConfig = loadConfig();
```

### Any Type

Biome allows `any` for flexibility, but avoid it when possible:

```typescript
// Avoid when possible
function process(data: any) { ... }

// Better: Use generics or specific types
function process<T>(data: T) { ... }
function process(data: unknown) { ... }
```

## Import Order Convention (MANDATORY)

Follow this order in all TypeScript, Astro, and Svelte files:

```typescript
// 1. Node.js native modules
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

// 2. Third-party packages (including Astro)
import { defineConfig } from 'astro/config';
import { z } from 'astro:content';
import { getCollection } from 'astro:content';

// 3. Internal project modules (using @ alias)
import Header from '@/components/layout/Header.svelte';
import { SITE_TITLE, SITE_DESCRIPTION } from '@/lib/constances';
import { getBlogPosts } from '@/lib/blog';

// 4. Type imports (separate group)
import type { APIRoute } from 'astro';
import type { CollectionEntry } from 'astro:content';
import type { Props } from './types';

// 5. Relative imports (same directory)
import './styles.css';
```

## Code Quality (Biome)

### Linting and Formatting

This project uses **Biome** exclusively for linting and formatting.

```bash
# Check for issues
pnpm run biome:check

# Auto-fix issues
pnpm run biome:fix

# Fix with unsafe transformations
pnpm run biome:fix:unsafe
```

**❌ DO NOT use ESLint or Prettier** - They are not configured in this project.

### Biome Configuration

Key settings in `biome.json`:

- **Indent**: 2 spaces
- **Quotes**: Single quotes
- **Trailing commas**: ES5 style
- **Scope**: `src/**` only

### Pre-commit Requirements

Always run before committing:

```bash
pnpm run biome:check
pnpm run astro:check
```

## Component Standards

### Astro Components (.astro)

Use for static, build-time rendered content:

```astro
---
// 1. Imports at top
import BaseHead from '@/components/BaseHead.astro';
import type { Props } from './types';

// 2. Props interface
interface Props {
  title: string;
  description?: string;
}

// 3. Destructure props with defaults
const { title, description = 'Default description' } = Astro.props;

// 4. Data fetching and logic
const posts = await getCollection('blog');
---

<!-- 5. Template -->
<section class="container">
  <h1>{title}</h1>
  <p>{description}</p>
</section>

<!-- 6. Scoped styles (optional) -->
<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
```

### Svelte Components (.svelte)

Use for interactive, client-side components:

```svelte
<script lang="ts">
  // 1. Imports
  import { onMount } from 'svelte';
  import type { BlogPost } from '@/lib/types';

  // 2. Props with TypeScript
  interface Props {
    posts: BlogPost[];
    initialPage?: number;
  }

  let { posts, initialPage = 1 }: Props = $props();

  // 3. State
  let currentPage = $state(initialPage);
  let searchQuery = $state('');

  // 4. Derived values
  let filteredPosts = $derived(
    posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // 5. Lifecycle
  onMount(() => {
    // Client-side initialization
  });
</script>

<!-- 6. Template -->
<div class="blog-grid">
  {#each filteredPosts as post}
    <article>{post.title}</article>
  {/each}
</div>

<!-- 7. Styles -->
<style>
  .blog-grid {
    display: grid;
    gap: 1rem;
  }
</style>
```

### Component Hydration

Always specify hydration directive for Svelte components:

```astro
<!-- Hydrate immediately on page load -->
<Header client:load lang={lang} />

<!-- Hydrate when visible in viewport -->
<BlogGrid client:visible posts={posts} />

<!-- Hydrate only on idle -->
<Newsletter client:idle />

<!-- No hydration (static) -->
<StaticComponent />
```

## Styling Standards

> **Full brand reference:** See **[Brand Guide](BRAND_GUIDE.md)** for the complete color palette, typography, logo usage, and dark mode pairing rules.

### Tailwind CSS

Use Tailwind utility classes for styling:

```astro
<!-- Good: Utility classes -->
<div class="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Title</h2>
</div>
```

### Brand Colors

Use the registered brand tokens for brand-consistent styling:

```html
<!-- Dark branded background (Void Black) -->
<div class="bg-main text-white">

<!-- Accent elements (Crimson Strike) -->
<button class="bg-secondary hover:bg-secondary/90 text-white">
<a class="text-secondary hover:opacity-85">
```

See [Brand Guide — CSS Design Tokens](BRAND_GUIDE.md#css-design-tokens) for all available tokens and the full 5-color palette.

Color token rules:

- Use `bg-secondary`, `text-secondary`, and `border-secondary` for accent usage.
- Do not hardcode red variants (`text-red-*`, `bg-red-*`) for brand accents.
- The accent token is theme-aware (`#E41541` in light mode, `#CD3553` in dark mode) and should be trusted globally.

### Dark Mode

Always support dark mode with `dark:` variant:

```astro
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <button class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
    Click me
  </button>
</div>
```

### Custom CSS

Use scoped styles in components when Tailwind isn't sufficient:

```astro
<style>
  /* Scoped to this component */
  .custom-animation {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
```

## Accessibility Standards (MANDATORY)

All UI code must meet **WCAG 2.1 AA** compliance. Key rules:

### Color Contrast

- **Normal text:** 4.5:1 minimum contrast ratio
- **Large text (>=18px or >=14px bold):** 3:1 minimum
- **Standard pairing:** `text-gray-600 dark:text-gray-300` for secondary/body text
- **Never use:** `text-gray-400`, `dark:text-gray-400`, `dark:text-gray-500` for body text

### Images

- Every `<img>` must have `width` and `height` attributes (prevents CLS)
- Informative images: descriptive `alt` text
- Decorative images: `alt=""` (optionally `aria-hidden="true"`)
- Icons inside labeled links: `alt=""` (parent `<a>` has `aria-label`)

### Semantic HTML

- One `<h1>` per page, sequential heading levels (no skipping)
- Use `<button>` for actions, `<a>` for navigation
- Use landmark elements: `<header>`, `<nav>`, `<main>`, `<footer>`
- External links: always include `rel="noopener"` with `target="_blank"`

### ARIA

- Navigation dropdowns: use disclosure pattern (`aria-expanded`, `aria-haspopup`), **not** `role="menu"`
- Progress bars: use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Decorative emojis/icons: `aria-hidden="true"`

**Full reference:** See [Accessibility Guide](ACCESSIBILITY.md) for complete standards, contrast tables, and component patterns.

## File Naming Conventions

### Components

- **Astro components**: `PascalCase.astro` (e.g., `BlogCard.astro`)
- **Svelte components**: `PascalCase.svelte` (e.g., `Header.svelte`)
- **Component folders**: `PascalCase/` (e.g., `HeroSection/`)

### Pages

- **Page files**: `kebab-case.astro` or `[param].astro`
- **Dynamic routes**: `[slug].astro`, `[...slug].astro`
- **API routes**: `kebab-case.json.ts`

### Utilities

- **Library files**: `camelCase.ts` (e.g., `blog.ts`, `types.ts`)
- **Constants**: `constances.ts` (note: intentional spelling)

### Content

- **Blog posts**: `YYYY-MM-DD_slug.md` or `YYYY-MM-DD_slug.mdx` (date prefix required)
- **Tags**: `kebab-case.md`

## Content Collection Standards

### Blog Post Frontmatter

Required and optional fields:

```yaml
---
title: "My Blog Post Title"                              # Required
description: "A brief description"                        # Required
pubDate: 2024-01-15                                       # Required (YYYY-MM-DD)
updatedDate: 2024-01-20                                   # Optional
heroImage: "/images/blog/posts/my-blog-post/hero.jpg"    # Optional
heroLayout: "banner"                                      # Optional (banner|side-by-side|minimal|none)
tags: ["tech"]                                            # Optional
series: "series-slug"                                     # Optional
seriesOrder: 1                                            # Optional (required when series is set)
---
```

**File naming:** `YYYY-MM-DD_slug.{md,mdx}` (date prefix stripped from URLs). **Slugs MUST always be in English** — both `en/` and `es/` versions share the same English slug. Series slugs must also be in English.

### Blog Post Creation Workflow (MANDATORY)

- Use `/add-blog-post` for creating new posts in `src/content/blog/`.
- Never create a new blog post in only one language.
- For EN/ES, create or update both versions in the same task.
- Preserve synchronized frontmatter across locales: `pubDate`, `updatedDate`, `heroImage`, `heroLayout`, `tags`, `series`, `seriesOrder`.

For complete blog post conventions, see **[Blog Posts Feature Guide](features/BLOG_POSTS.md)**.

### Tag Definition

```yaml
---
name: "Technology"
description: "Posts about technology and programming"
---
```

## Git Standards

### Commit Messages

Use conventional commit format:

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples:**
```
feat: add blog search functionality
fix: resolve dark mode toggle on mobile
docs: update architecture guide
style: format components with Biome
refactor: extract blog utilities to lib/
perf: optimize image loading
```

### Branch Naming

```
feature/add-blog-search
fix/dark-mode-toggle
docs/update-readme
refactor/blog-components
```

## Error Handling

### API Routes

```typescript
export const GET: APIRoute = async () => {
  try {
    const data = await fetchData();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

### Components

```typescript
// Handle potential null/undefined
const post = posts.find(p => p.id === id);
if (!post) {
  return Astro.redirect('/404');
}
```

## Testing Standards (Future)

Testing is not yet configured. When implemented:

- **Framework**: Vitest for unit tests, Playwright for E2E
- **File naming**: `*.test.ts` or `*.spec.ts`
- **Location**: `tests/` directory or co-located with source

## Meta Description Length (MANDATORY)

All page and blog post meta descriptions MUST be 130-160 characters (both EN and ES independently). See [SEO Guide](SEO.md#meta-description-standards-mandatory) for full rules, locations, and writing guidelines.

## Documentation Standards

### When to Document

- ✅ After adding new components
- ✅ After changing schemas
- ✅ After updating configuration
- ✅ After adding npm scripts
- ✅ After establishing new patterns

### Documentation Language

All documentation must be in **English**.

## Dates and Timezones

Pereira Tech Talks uses **America/Bogota** (`SITE_TIMEZONE`, UTC−5, no DST) as the site clock. Helpers live in `src/lib/dates.ts`.

| Kind of date | Storage | Display / logic |
|--------------|---------|-----------------|
| Content calendar dates (`pubDate`, meetup `date`, `lastUpdated`) | `YYYY-MM-DD` → midnight UTC | `formatCalendarDate*` with `timeZone: 'UTC'` so the authored day never shifts |
| Scheduling gates (scheduled posts, upcoming meetups/events) | Same calendar strings | Compare against **today in Bogota** via `getTodayInSiteTimezone()` |
| Wall-clock event times (PTD `startTime`, countdowns) | Date + `HH:mm` | `combineCalendarDateAndTime()` → ISO with `SITE_TIMEZONE_OFFSET` (`-05:00`) |
| Real timestamps (`issuedAt`, verification) | Full ISO instant | `formatInstantInSiteTimezone()` with `SITE_TIMEZONE` |

**Do not** call `toLocaleDateString()` or `getFullYear()` on content dates without these helpers.

## Summary Checklist

Before committing, verify:

- [ ] Code is in English (variables, comments, docs)
- [ ] Import order follows convention
- [ ] `pnpm run biome:check` passes
- [ ] `pnpm run astro:check` passes
- [ ] Dark mode is supported in new UI
- [ ] Meta descriptions are 130-160 characters (pages in translations, blog posts in frontmatter)
- [ ] Documentation is updated if needed
- [ ] Commit message follows conventional format
