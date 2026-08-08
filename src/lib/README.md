# Library (`src/lib/`)

This directory contains utility functions, constants, types, and enums used throughout the application.

## Directory Structure

```
lib/
├── blog.ts        # Blog-related utility functions
├── i18n.ts        # Centralized i18n config & utilities
├── constances.ts  # Site-wide constants
├── enum.ts        # Shared enumerations
├── search.ts      # Search utilities (ranked substring matching)
├── translations/  # Modular i18n translation system
│   ├── index.ts   # Public API barrel: getTranslations(), re-exports
│   ├── types.ts   # SiteTranslations interface + all sub-interfaces
│   ├── en.ts      # English translations
│   └── es.ts      # Spanish translations
└── types.ts       # TypeScript type definitions
```

## File Overview

### translations/

Modular centralized translation system for the entire site.

#### Directory Structure

```
src/lib/translations/
├── index.ts    # Public API barrel: getTranslations(), re-exports
├── types.ts    # SiteTranslations interface + all sub-interfaces
├── en.ts       # English translations
└── es.ts       # Spanish translations
```

#### Public API (index.ts)

The `index.ts` file exports the public API:

| Export | Description |
|--------|-------------|
| `getTranslations(lang)` | Get translation object for language |
| `isValidLanguage(lang)` | Check if language code is valid (re-exported from `../i18n.ts`) |
| `getDefaultLanguage()` | Returns `'en'` (re-exported from `../i18n.ts`) |
| `Language` type | Re-exported from `../i18n.ts` |
| `SiteTranslations` type | Re-exported from `./types.ts` |
| Sub-interfaces | Re-exported from `./types.ts` for convenience |

#### Types (types.ts)

Contains the `SiteTranslations` interface and all sub-interfaces:

```typescript
export interface SiteTranslations {
  siteTitle: string;
  siteDescription: string;
  nav: { home: string; blog: string; about: string; contact: string; /* ... */ };
  footer: { copyright: string; allRightsReserved: string; };
  hero: { description: string; typewriterWords: string[]; };
  homeSections: { about: { /* ... */ }; dailybot: { /* ... */ }; /* ... */ };
  contact: { title: string; nameLabel: string; /* ... */ };
  searchPlaceholder: string;
  resultsFound: (count: number) => string;
  noResults: (query: string) => string;
  // ... more translation keys
}
```

#### Locale Files (en.ts, es.ts)

Each locale file exports a complete `SiteTranslations` object:

```typescript
// src/lib/translations/en.ts
import type { SiteTranslations } from './types';

export const en: SiteTranslations = {
  siteTitle: 'Pereira Tech Talks',
  siteDescription: 'Tech community of Pereira, Colombia',
  nav: { /* ... */ },
  // ... all keys
};
```

#### Usage

```typescript
import { getTranslations, type Language } from '@/lib/translations';

const lang: Language = 'es';
const t = getTranslations(lang);

console.log(t.searchPlaceholder); // "Buscar artículos..."
console.log(t.noResults('test')); // "No se encontraron resultados para 'test'"
console.log(t.resultsFound(5));   // "5 resultados encontrados"
```

#### Adding a New Language

1. Create `src/lib/translations/{lang}.ts` (e.g., `pt.ts`)
2. Export a complete `SiteTranslations` object (use `en.ts` as reference)
3. Import it in `src/lib/translations/index.ts`:
   ```typescript
   import { pt } from './pt';
   const translations: Record<Language, SiteTranslations> = { en, es, pt };
   ```
4. Update the `Language` type in `src/lib/i18n.ts`

#### Adding New Translation Keys

1. Add the field to the `SiteTranslations` interface in `types.ts`
2. Add the translation to both `en.ts` and `es.ts` (and any other active locales)
3. Use the new key via `getTranslations(lang)` in components

---

### search.ts

Search functionality using ranked exact substring matching and lightweight indexing.

#### Types

```typescript
export interface SearchablePost {
  id: string;
  slug: string;
  lang: string;
  title: string;
  description: string;
  tags: string[];
  pubDate: string;
  heroImage?: string;
}

export interface SearchResult {
  item: SearchablePost;
  score: number;
  matches?: ReadonlyArray<{
    key: string;
    value?: string;
    indices: ReadonlyArray<readonly [number, number]>;
  }>;
}
```

#### Functions

| Function | Description |
|----------|-------------|
| `createSearchIndex(posts)` | Create in-memory index from posts |
| `searchPosts(index, query, limit)` | Perform ranked substring search |
| `highlightMatches(text, indices)` | Highlight matched text |
| `getHighlightedField(result, field, original)` | Get field with highlights |

#### Usage

```typescript
import { 
  createSearchIndex, 
  searchPosts, 
  getHighlightedField,
  type SearchablePost 
} from '@/lib/search';

// Create index from posts (language shard)
const posts: SearchablePost[] = await fetch('/api/posts-en.json').then(r => r.json());
const index = createSearchIndex(posts);

// Perform search
const results = searchPosts(index, 'javascript');

// Get highlighted text for display
results.forEach(result => {
  const title = getHighlightedField(result, 'title', result.item.title);
  console.log(title); // "Learn <mark>JavaScript</mark> basics"
});
```

#### Ranking Rules

```typescript
// Score: lower is better
// title: 0.0, tags: 0.1, topics: 0.15, description: 0.2
```

---

### blog.ts

Blog data fetching and pagination utilities.

#### Functions

| Function | Description |
|----------|-------------|
| `getBlogPosts(params)` | Fetch posts with pagination |
| `getPostSlug(postId)` | Strip language prefix from ID |
| `getPostLanguage(postId)` | Extract language from ID |

#### `getBlogPosts(params: BlogParamsType): Promise<BlogPostsResultType>`

Fetches and filters blog posts with pagination support.

**Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `lang` | `string` | `'en'` | Language filter |
| `tag` | `string` | - | Filter posts by tag |
| `page` | `number` | `1` | Page number |
| `pageSize` | `number` | `BLOG_PAGE_SIZE` | Posts per page |

**Returns:** `BlogPostsResultType`

| Field | Type | Description |
|-------|------|-------------|
| `tagsResult` | `CollectionEntry<'tags'>[]` | Available tags |
| `postsResult` | `CollectionEntry<'blog'>[]` | Posts for current page |
| `totalPages` | `number` | Total number of pages |
| `currentPage` | `number` | Current page number |
| `pageSize` | `number` | Posts per page |
| `totalPostsAvailable` | `number` | Total posts count |

**Usage:**

```typescript
import { getBlogPosts } from '@/lib/blog';

// Get English posts
const result = await getBlogPosts({ lang: 'en', page: 1 });

// Get Spanish posts filtered by tag
const techPosts = await getBlogPosts({ lang: 'es', tag: 'tech', page: 1 });
```

#### Helper Functions

```typescript
// Get slug without language prefix
getPostSlug('en/first-post'); // Returns: 'first-post'

// Get language from post ID
getPostLanguage('es/my-article'); // Returns: 'es'
```

---

### constances.ts

Site-wide constants.

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `SITE_TITLE` | `string` | `'Astro Blog'` | Site title (meta tags) |
| `SITE_DESCRIPTION` | `string` | `'Welcome to my website!'` | Default description |
| `BLOG_PAGE_SIZE` | `number` | `30` | Default posts per page |

**Usage:**

```typescript
import { SITE_TITLE, SITE_DESCRIPTION, BLOG_PAGE_SIZE } from '@/lib/constances';
```

---

### types.ts

TypeScript type definitions for the application.

#### `BlogParamsType`

Parameters for `getBlogPosts()` function.

```typescript
export type BlogParamsType = {
  lang?: string;     // Language code (e.g., 'en', 'es')
  tag?: string;      // Tag to filter by
  page?: number;     // Page number (1-indexed)
  pageSize?: number; // Posts per page
};
```

#### `BlogPostsResultType`

Return type of `getBlogPosts()` function.

```typescript
export type BlogPostsResultType = {
  tagsResult: CollectionEntry<'tags'>[];
  postsResult: CollectionEntry<'blog'>[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalPostsAvailable: number;
};
```

---

### enum.ts

Shared enumeration types.

```typescript
export enum LanguageEType {
  LEFT = 'left',
  RIGHT = 'right',
}
```

**Note:** This is a legacy enum. For language codes, use the `Language` type from `translations.ts`.

---

## Import Alias

All lib files can be imported using the `@/lib/` alias:

```typescript
// Using alias (recommended)
import { getBlogPosts } from '@/lib/blog';
import { getTranslations } from '@/lib/translations';
import { createSearchIndex, searchPosts } from '@/lib/search';
import { SITE_TITLE } from '@/lib/constances';
import type { BlogParamsType } from '@/lib/types';

// Using relative path
import { getBlogPosts } from '../lib/blog';
```

The alias is configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Adding New Utilities

### Adding a New Function

1. Create or edit the appropriate file in `src/lib/`
2. Export the function
3. Add TypeScript types in `types.ts` if needed

```typescript
// src/lib/dates.ts — calendar dates from content collections (midnight UTC)
import { formatCalendarDate, getCalendarDateString } from '@/lib/dates';

export function displayMeetupDate(date: Date, lang: 'en' | 'es'): string {
  return formatCalendarDate(date, lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function meetupDatetimeAttr(date: Date): string {
  return getCalendarDateString(date);
}

// Real timestamps (certificates, verification) — GMT-5
formatInstantInSiteTimezone(issuedAt, 'es-CO');

// Wall-clock PTD start → ISO with -05:00
combineCalendarDateAndTime(editionDate, '08:00');
```

### Adding a New Translation

1. Add the key to `SiteTranslations` interface in `types.ts`
2. Add translations to both `en.ts` and `es.ts`

```typescript
// In src/lib/translations/types.ts
export interface SiteTranslations {
  // ... existing keys
  newKey: string;
}

// In src/lib/translations/en.ts
export const en: SiteTranslations = {
  // ... existing
  newKey: 'English text',
};

// In src/lib/translations/es.ts
export const es: SiteTranslations = {
  // ... existing
  newKey: 'Spanish text',
};
```

### Adding a New Language

1. Add to `Language` type in `src/lib/i18n.ts`: `type Language = 'en' | 'es' | 'fr';`
2. Create new locale file `src/lib/translations/fr.ts` exporting a complete `SiteTranslations` object
3. Import it in `src/lib/translations/index.ts` and add to the `translations` record
4. Create routes at `/[lang]/blog/`
5. Add content folder `src/content/blog/[lang]/`

---

## Related Documentation

- [Content Collections](../content/README.md)
- [Blog Components](../components/blog/README.md)
- [Features: Blog Search](../../docs/features/BLOG_SEARCH.md)
- [API Reference](../../docs/API_REFERENCE.md)
- [Architecture](../../docs/ARCHITECTURE.md)
