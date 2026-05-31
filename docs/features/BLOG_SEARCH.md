# Blog Search Feature

## Overview

The blog search is a **static-first, client-side search** system optimized for 1000+ posts without backend infrastructure.

Key characteristics:

- Exact substring matching (case-insensitive)
- Ranked results: title > primary tags > topics > description
- Debounced input (200ms)
- Lazy index loading (on focus/idle)
- Language-aware shards (`en`, `es`) to minimize payload
- Pagination and highlighting support

## Architecture

```
Build time:
  Content Collections
    -> Search index generation
    -> Static endpoints:
       /api/posts-en.json
       /api/posts-es.json
       /api/posts.json (compatibility aggregate)

Runtime:
  StaticBlogSearch mounts
    -> lazy fetch /api/posts-{lang}.json
    -> fallback /api/posts.json if shard unavailable
    -> in-memory filtering + scoring
    -> render paginated results
```

## Endpoints

Primary (language shards):

- `GET /api/posts-en.json`
- `GET /api/posts-es.json`

Compatibility fallback:

- `GET /api/posts.json`

All endpoints return lightweight metadata only (no full post body).

## Search Data Shape

```json
[
  {
    "id": "en/2026-01-01_example-post",
    "slug": "example-post",
    "lang": "en",
    "title": "Example Post",
    "description": "Post summary",
    "pubDate": "2026-01-01T00:00:00.000Z",
    "tags": ["tech"],
    "topics": ["web-development"],
    "heroImage": "/images/blog/posts/example-post/hero.png",
    "heroWebpExists": true
  }
]
```

## Performance Strategy

- Keep blog listing/tag HTML under budget (see `pnpm run search:budgets`)
- Keep shard payloads compressed and language-scoped
- Avoid embedding full search index into page HTML
- Cache results in memory (`max 50` queries)

## Validation

```bash
pnpm run astro:check
pnpm run build
pnpm run search:budgets
pnpm run test -- tests/unit/lib/search.test.ts tests/unit/components/StaticBlogSearch.test.ts
```

## Troubleshooting

### Search loads but no results

1. Verify query length >= 2
2. Verify posts include matching title/description/tags/topics
3. Confirm language shard endpoint returns data:
   - `/api/posts-en.json` or `/api/posts-es.json`

### Search index loading error

1. Check browser network for shard endpoint status
2. Confirm fallback endpoint `/api/posts.json` is accessible
3. Rebuild and retry

## Key Files

- `src/components/blog/StaticBlogSearch.svelte`
- `src/lib/search.ts`
- `src/lib/blog.ts`
- `src/pages/api/posts-en.json.ts`
- `src/pages/api/posts-es.json.ts`
- `src/pages/api/posts.json.ts` (compatibility)
- `scripts/check-search-performance-budgets.mjs`
