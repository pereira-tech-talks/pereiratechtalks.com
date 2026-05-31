# Blog Components (`src/components/blog/`)

This directory contains all components related to the blog functionality, including post display, search, pagination, and filtering by tags.

## Component Overview

```
blog/
├── BlogCard.svelte          # Individual post card with highlighting
├── BlogContainer.astro      # Blog page wrapper
├── BlogGrid.svelte          # Grid layout for posts
├── BlogHeader.svelte        # Header with title and tag filter
├── BlogPagination.svelte    # Page navigation
├── BlogSearchInput.svelte   # Search input field
├── SearchResults.svelte     # Search results display
└── StaticBlogSearch.svelte  # Complete search orchestrator
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    StaticBlogSearch                         │
│  (Main orchestrator - manages state, search, pagination)    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌───────────────────┐                   │
│  │ BlogHeader   │  │ BlogSearchInput   │                   │
│  │ (title/tags) │  │ (search query)    │                   │
│  └──────────────┘  └───────────────────┘                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  BlogGrid / SearchResults                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐           │   │
│  │  │BlogCard  │ │BlogCard  │ │BlogCard  │           │   │
│  │  └──────────┘ └──────────┘ └──────────┘           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 BlogPagination                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Internationalization (i18n)

All blog components support multi-language UI through the `lang` prop. The `lang` prop is passed from the page through the component hierarchy.

### Language Flow

```
Page (lang="en" or "es")
  → BlogContainer.astro (lang prop)
    → StaticBlogSearch.svelte (lang prop)
      → BlogHeader.svelte (lang prop)
      → BlogSearchInput.svelte (lang prop)
      → SearchResults.svelte (lang prop)
        → BlogCard.svelte (lang prop)
      → BlogPagination.svelte (lang prop)
```

### Components with lang Prop

| Component | Lang Prop | Usage |
|-----------|-----------|-------|
| BlogContainer | `lang="en"` | Passed from page |
| StaticBlogSearch | `lang` | Receives from container |
| BlogSearchInput | `lang` | UI translations |
| SearchResults | `lang` | Passed to BlogCard |
| BlogCard | `lang` | Date formatting, URLs |
| BlogPagination | `lang` | Button text, URLs |
| BlogHeader | `lang` | Header text |
| BlogGrid | `lang` | Passed to children |

### Example Usage

```astro
---
// English blog page
import BlogContainer from '@/components/blog/BlogContainer.astro';
import { getBlogPosts } from '@/lib/blog';

const posts = await getBlogPosts({ lang: 'en' });
---

<BlogContainer lang="en" blogPostsResult={posts} />
```

```astro
---
// Spanish blog page (src/pages/es/blog/index.astro)
import BlogContainer from '@/components/blog/BlogContainer.astro';
import { getBlogPosts } from '@/lib/blog';

const posts = await getBlogPosts({ lang: 'es' });
---

<BlogContainer lang="es" blogPostsResult={posts} />
```

## Component Details

### StaticBlogSearch.svelte

**The main orchestrator component** that manages the entire blog listing.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `postsResult` | `Array` | Required | Lightweight posts for current page |
| `currentTag` | `string` | `undefined` | Current tag filter |
| `totalPages` | `number` | Required | Total number of pages |
| `currentPage` | `number` | Required | Current page number |
| `tagsResult` | `CollectionEntry<'tags'>[]` | `[]` | All available tags |
| `totalPostsAvailable` | `number` | `0` | Total posts count |
| `lang` | `string` | `'en'` | Language code |

**Features:**
- Loads language shard index from `/api/posts-{lang}.json`
- Falls back to `/api/posts.json` for compatibility
- Debounced search (200ms)
- Result caching (max 50 queries)
- Manages search vs browse modes
- Error handling with retry button

### BlogCard.svelte

Displays an individual blog post card with image, title, description, date, and tags.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `post` | `CollectionEntry<'blog'>` | Required | Blog post entry |
| `lang` | `string` | `'en'` | Language for date/URLs |
| `searchResult` | `SearchResult` | `undefined` | Match data for highlighting |

**Features:**
- Handles both Content Collection and search index formats
- Search term highlighting with `{@html}`
- Language-specific date formatting
- Language-aware URLs (`/blog/` vs `/es/blog/`)
- Dark mode support

### BlogGrid.svelte

Renders posts in a responsive grid layout.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `posts` | `Array` | Required | Posts to display |
| `showPagination` | `boolean` | `false` | Show pagination |
| `currentPage` | `number` | `1` | Current page |
| `totalPages` | `number` | `1` | Total pages |
| `currentTag` | `string` | `undefined` | Current tag filter |
| `lang` | `string` | `'en'` | Language code |

### BlogHeader.svelte

Header section with title, post count, and tag filter chips.

| Prop | Type | Description |
|------|------|-------------|
| `currentTag` | `string \| undefined` | Current tag filter |
| `tagsResult` | `string[]` | Available tag names |
| `totalPosts` | `number` | Total posts count |
| `currentPagePosts` | `number` | Posts on current page |
| `currentPage` | `number` | Current page number |
| `totalPages` | `number` | Total pages |
| `lang` | `string` | Language code |

### BlogPagination.svelte

Pagination controls for navigating blog pages.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | `1` | Current page |
| `totalPages` | `number` | `1` | Total pages |
| `isSearchMode` | `boolean` | `false` | Search vs browse mode |
| `onPageChange` | `function` | `null` | Callback for search mode |
| `currentTag` | `string` | `null` | Tag for URL building |
| `lang` | `string` | `'en'` | Language code |

**URL Generation:**
- English: `/blog/` or `/blog/page/{n}/`
- Spanish: `/es/blog/` or `/es/blog/page/{n}/`
- Tag filter: `/blog/tag/{tag}/` or `/es/blog/tag/{tag}/`

**Accessibility:**
- `aria-label="Blog pagination"` on nav
- `aria-current="page"` on current page
- `aria-label` on prev/next buttons

### BlogSearchInput.svelte

Search input with result count display.

| Prop | Type | Description |
|------|------|-------------|
| `searchQuery` | `string` | Bound search query |
| `isSearching` | `boolean` | Search mode active |
| `resultsCount` | `number` | Number of results |
| `lang` | `string` | Language code |

**Events:**
- `search` - Dispatched on input with query value
- `focus` - Dispatched when input is focused

**Accessibility:**
- `type="search"` for semantic HTML
- `aria-label` for screen readers
- `aria-live="polite"` for result count
- Escape key clears search

### SearchResults.svelte

Displays search results using BlogCard components.

| Prop | Type | Description |
|------|------|-------------|
| `filteredPosts` | `Array` | Filtered posts |
| `searchQuery` | `string` | Current search query |
| `lang` | `string` | Language code |
| `searchResultsWithMatches` | `Array` | Results with match data |

### BlogContainer.astro

Astro wrapper for the blog page (server-side).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `blogPostsResult` | `BlogPostsResultType` | Required | Blog posts data |
| `currentTag` | `string` | `undefined` | Current tag filter |
| `lang` | `string` | `'en'` | Language code |

## Data Flow

### Browse Mode

```
Page Load → StaticBlogSearch receives postsResult
         → BlogHeader shows tag filters
         → BlogGrid displays posts
         → BlogPagination shows page numbers (links)
```

### Search Mode

```
User Types → BlogSearchInput dispatches 'search' event
          → StaticBlogSearch debounces (200ms)
          → Fetches /api/posts-{lang}.json (if not cached)
          → Falls back to /api/posts.json if needed
          → Performs ranked substring search
          → Results cached for pagination
          → SearchResults displays with highlighting
          → BlogPagination shows pages (buttons)
```

## Search Features

### Ranked Matching

Weighted ranking rules:
- Title match: score 0.0
- Primary tags match: score 0.1
- Topics match: score 0.15
- Description match: score 0.2

### Result Highlighting

Search matches are highlighted in BlogCard:

```svelte
<h2>{@html displayTitle}</h2>
<p>{@html displayDescription}</p>
```

The highlighting uses `<mark>` tags with Tailwind classes.

### Caching

- Results are cached by search query + tag
- Max 50 cached queries (bounded to prevent memory leaks)
- Cache is cleared when index reloads

## Search API

Primary endpoints:
- `/api/posts-en.json`
- `/api/posts-es.json`

Compatibility endpoint:
- `/api/posts.json`

The search index returns:

```json
[
  {
    "id": "en/post-slug",
    "slug": "post-slug",
    "lang": "en",
    "title": "Post Title",
    "description": "Post description",
    "pubDate": "2026-01-15T00:00:00.000Z",
    "tags": ["tag1", "tag2"],
    "heroImage": "/images/hero.jpg"
  }
]
```

See [API Reference](../../../docs/API_REFERENCE.md) for full details.

## Styling

All components use Tailwind CSS with dark mode support via the `dark:` prefix.

## Related Documentation

- [Features: Blog Search](../../../docs/features/BLOG_SEARCH.md) - Detailed search architecture
- [Features: Pagination](../../../docs/features/PAGINATION.md) - Pagination implementation
- [Library Utilities](../../lib/README.md) - translations.ts, search.ts
- [Content Collections](../../content/README.md) - Blog post schema
- [API Reference](../../../docs/API_REFERENCE.md) - Search shard endpoints
