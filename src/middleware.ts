/**
 * Astro middleware to serve custom 404 page for unknown routes.
 * Rewrites requests for non-existent paths to /404 so the custom 404 page is displayed
 * instead of the browser's "invalid response" error in dev mode.
 *
 * ⚠️  CRITICAL — READ BEFORE ADDING NEW TOP-LEVEL ROUTES ⚠️
 *
 * This middleware uses a HARDCODED ALLOWLIST (`KNOWN_ROOT_PATHS` and
 * `KNOWN_ES_PATHS`). Single-segment paths NOT in the allowlist are rewritten
 * to /404 — even if the corresponding `src/pages/<name>/index.astro` exists.
 *
 * Symptoms when forgotten:
 *   - `/<your-route>` returns 404 in dev AND prod
 *   - `/<your-route>/<sub>` works fine (multi-segment paths bypass the rule)
 *   - `/<your-route>/index.html` works (paths containing "." bypass the rule)
 *   - Dev server logs show: `[404] (rewrite) /<your-route>` — the
 *     "(rewrite)" is the smoking gun: it's THIS middleware, not Astro routing
 *
 * When adding a new top-level page (e.g. `src/pages/foo.astro` or
 * `src/pages/foo/index.astro`):
 *   1. Add `'foo'` to KNOWN_ROOT_PATHS below
 *   2. If the page also has a Spanish version at `src/pages/es/foo*`,
 *      add `'foo'` to KNOWN_ES_PATHS too
 *
 * Do NOT debug Astro routing, file-system caches, or `[...slug]` vs `[slug]`
 * before checking this allowlist first.
 *
 * v3.0.0 transition note:
 *   The legacy xergioalex personal-page slugs (`cv`, `dailybot`, `entrepreneur`,
 *   `foodie`, `hobbies`, `portfolio`, `tech-talks`, `trading`) are intentionally
 *   removed from the allowlist below. The page wrappers themselves still exist
 *   on disk and are emitted by `astro build` (middleware doesn't gatekeep build
 *   output), but dev/preview requests for them rewrite to /404 — exactly what
 *   we want while waiting for Task 16 to delete the wrappers and Tasks 7–8 to
 *   land the v3 PTT homepage and verticals. New PTT top-level routes
 *   (`/meetups`, `/pereira-tech-days`, `/talks`, etc.) will be added back to
 *   the allowlist by Tasks 7–8 when their pages are introduced.
 */
import { defineMiddleware } from 'astro:middleware';

const KNOWN_ROOT_PATHS = new Set([
  '',
  'about',
  'blog',
  'contact',
  'slides',
  'api',
  'es',
  'internal',
  '404',
  'favicon.ico',
  'favicon.svg',
  'sitemap-index.xml',
  'rss.xml',
]);

const KNOWN_ES_PATHS = new Set([
  'about',
  'blog',
  'contact',
  'slides',
  'rss.xml',
]);

export const onRequest = defineMiddleware((context, next) => {
  const pathname = context.url.pathname;

  // Skip Vite/Astro internal paths (HMR, assets, etc.)
  if (
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/__vite') ||
    pathname.startsWith('/@') ||
    pathname.includes('.')
  ) {
    return next();
  }

  const segments = pathname
    .replace(/^\/|\/$/g, '')
    .split('/')
    .filter(Boolean);

  // Single-segment paths at root (e.g. /sdfsd) that don't match known routes
  if (segments.length === 1 && !KNOWN_ROOT_PATHS.has(segments[0])) {
    return context.rewrite(new URL('/404', context.url));
  }

  // /es/xxx when xxx is not a known Spanish route
  if (
    segments.length === 2 &&
    segments[0] === 'es' &&
    !KNOWN_ES_PATHS.has(segments[1])
  ) {
    return context.rewrite(new URL('/404', context.url));
  }

  return next();
});
