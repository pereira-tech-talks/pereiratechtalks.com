# Pagination Feature

## Overview

The blog implements pagination with two modes:
- **Server-side (Browse Mode):** URL-based navigation with pre-rendered pages
- **Client-side (Search Mode):** JavaScript pagination for search results

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Pagination Modes                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Browse Mode (Server-side):                                  │
│  ├── /blog/ → page 1                                        │
│  ├── /blog/page/2/ → page 2                                 │
│  ├── /blog/tag/tech/ → tag page 1                           │
│  └── /blog/tag/tech/page/2/ → tag page 2                    │
│                                                              │
│  Search Mode (Client-side):                                  │
│  └── Same URL, pagination handled by JavaScript             │
│      └── Button clicks update results in-place              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Configuration

### Page Size

Defined in `src/lib/constances.ts`:

```typescript
export const BLOG_PAGE_SIZE: number = 30;
```

## Components

| Component | File | Role |
|-----------|------|------|
| BlogPagination | `src/components/blog/BlogPagination.svelte` | Pagination UI |
| StaticBlogSearch | `src/components/blog/StaticBlogSearch.svelte` | Orchestrates pagination |
| getBlogPosts | `src/lib/blog.ts` | Server-side pagination logic |

## Server-Side Pagination

### Route Files

```
pages/blog/
├── index.astro                    # /blog (page 1)
├── page/[page].astro              # /blog/page/{n}
├── tag/[tag].astro                # /blog/tag/{tag} (page 1)
└── tag/[tag]/page/[page].astro    # /blog/tag/{tag}/page/{n}
```

### getStaticPaths for Pagination

```astro
---
// pages/blog/page/[page].astro
import { getCollection } from 'astro:content';
import { BLOG_PAGE_SIZE } from '@/lib/constances';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const totalPages = Math.ceil(posts.length / BLOG_PAGE_SIZE);
  
  // Generate paths for pages 2+
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    params: { page: String(i + 2) },
    props: {
      page: i + 2,
      totalPages,
    },
  }));
}

const { page, totalPages } = Astro.props;
---
```

### getBlogPosts Function

```typescript
// src/lib/blog.ts
export async function getBlogPosts(params: BlogParamsType): Promise<BlogPostsResultType> {
  const allPosts = await getCollection('blog');
  let posts = allPosts;

  // Filter by tag if specified
  if (params.tag) {
    posts = posts.filter((post) => post.data.tags?.includes(params.tag));
  }

  // Sort by date (newest first)
  posts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  // Calculate total pages
  const totalPages = Math.ceil(posts.length / (params.pageSize ?? BLOG_PAGE_SIZE));

  // Apply pagination
  const startIndex = ((params.page ?? 1) - 1) * (params.pageSize ?? BLOG_PAGE_SIZE);
  const endIndex = startIndex + (params.pageSize ?? BLOG_PAGE_SIZE);
  posts = posts.slice(startIndex, endIndex);

  return {
    postsResult: posts,
    totalPages,
    currentPage: params.page ?? 1,
    // ...
  };
}
```

## Client-Side Pagination

### Search Mode Pagination

In `StaticBlogSearch.svelte`:

```javascript
function performSearch(query, page = 1) {
  // Filter posts
  const filteredPosts = searchIndex.filter(/* ... */);
  
  // Calculate pagination
  const limit = BLOG_PAGE_SIZE;
  const totalPages = Math.ceil(filteredPosts.length / limit);
  const startIndex = (page - 1) * limit;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);
  
  searchResults = paginatedPosts;
  searchPagination = {
    currentPage: page,
    totalPages,
    totalPosts: filteredPosts.length,
  };
}
```

## BlogPagination Component

```svelte
<script>
export let currentPage = 1;
export let totalPages = 1;
export let isSearchMode = false;
export let onPageChange = null;
export let currentTag = null;

function getPageUrl(page) {
  if (currentTag) {
    return page === 1 
      ? `/blog/tag/${currentTag}/`
      : `/blog/tag/${currentTag}/page/${page}/`;
  }
  return page === 1 ? '/blog/' : `/blog/page/${page}/`;
}
</script>

{#if totalPages > 1}
  <nav>
    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
      {#if isSearchMode}
        <button on:click={() => onPageChange(page)}>
          {page}
        </button>
      {:else}
        <a href={getPageUrl(page)}>
          {page}
        </a>
      {/if}
    {/each}
  </nav>
{/if}
```

## URL Patterns

### General Blog

| URL | Page |
|-----|------|
| `/blog/` | 1 |
| `/blog/page/2/` | 2 |
| `/blog/page/3/` | 3 |

### Tag Filtered

| URL | Tag | Page |
|-----|-----|------|
| `/blog/tag/tech/` | tech | 1 |
| `/blog/tag/tech/page/2/` | tech | 2 |

## Pagination Props

```typescript
interface PaginationProps {
  currentPage: number;      // Current page (1-indexed)
  totalPages: number;       // Total number of pages
  isSearchMode?: boolean;   // true = buttons, false = links
  onPageChange?: (page: number) => void;  // Callback for search mode
  currentTag?: string;      // Tag for URL building
}
```

## Usage Examples

### In Browse Mode

```astro
<BlogPagination 
  currentPage={currentPage} 
  totalPages={totalPages}
  currentTag={currentTag}
/>
```

### In Search Mode

```svelte
<BlogPagination 
  currentPage={searchPagination.currentPage} 
  totalPages={searchPagination.totalPages}
  isSearchMode={true}
  onPageChange={(page) => performSearch(searchQuery, page)}
/>
```

## Customization

### Changing Page Size

In `src/lib/constances.ts`:

```typescript
export const BLOG_PAGE_SIZE: number = 10;  // Show 10 posts per page
```

### Adding Previous/Next Links

Already implemented in `BlogPagination.svelte`:

```svelte
{#if currentPage > 1}
  <a href={getPageUrl(currentPage - 1)}>Previous</a>
{/if}

{#if currentPage < totalPages}
  <a href={getPageUrl(currentPage + 1)}>Next</a>
{/if}
```

## Related Documentation

- [Blog Components](../../src/components/blog/README.md)
- [Blog Search](./BLOG_SEARCH.md)
- [Pages & Routing](../../src/pages/README.md)
- [Library Functions](../../src/lib/README.md)
