/**
 * Astro middleware to serve custom 404 page for unknown routes.
 * Rewrites requests for non-existent paths to /404 so the custom 404 page is displayed
 * instead of the browser's "invalid response" error in dev mode.
 *
 * ⚠️  CRITICAL — READ BEFORE ADDING NEW TOP-LEVEL ROUTES ⚠️
 *
 * This middleware uses a HARDCODED ALLOWLIST (`KNOWN_ROOT_PATHS` and
 * `KNOWN_EN_PATHS`). Single-segment paths NOT in the allowlist are rewritten
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
 *   2. If the page also has an English version at `src/pages/en/foo*`,
 *      add `'foo'` to KNOWN_EN_PATHS too
 *
 * Do NOT debug Astro routing, file-system caches, or `[...slug]` vs `[slug]`
 * before checking this allowlist first.
 *
 * v3.0.0 transition note:
 *   The legacy personal-page slugs that previously shipped with the seed clone
 *   (`cv`, `dailybot`, `entrepreneur`, `foodie`, `hobbies`, `portfolio`,
 *   `tech-talks`, `trading`) have been deleted from `src/pages/` and their
 *   page components removed from `src/components/pages/` as part of Task 16
 *   (legacy content removal). New PTT top-level routes (`/meetups`,
 *   `/pereira-tech-days`, `/talks`, etc.) will be added back to the allowlist
 *   by Tasks 9–13 when their pages land.
 */
import { defineMiddleware } from 'astro:middleware';

const KNOWN_ROOT_PATHS = new Set([
  '',
  'about',
  'blog',
  'contact',
  'slides',
  'meetups',
  'pereira-tech-day',
  'pereira-tech-days',
  'speakers',
  'talks',
  'calendar',
  'communities',
  'sponsors',
  'contributors',
  'verticals',
  'call-for-speakers',
  'sponsor-us',
  'channels',
  'certificates',
  'press',
  'community',
  'conduct',
  'contributing',
  'governance',
  'api',
  'en',
  'internal',
  '404',
  'favicon.ico',
  'favicon.svg',
  'sitemap-index.xml',
  'rss.xml',
]);

const KNOWN_EN_PATHS = new Set([
  'about',
  'blog',
  'contact',
  'slides',
  'meetups',
  'pereira-tech-day',
  'pereira-tech-days',
  'speakers',
  'talks',
  'calendar',
  'communities',
  'sponsors',
  'contributors',
  'verticals',
  'call-for-speakers',
  'sponsor-us',
  'channels',
  'certificates',
  'press',
  'community',
  'conduct',
  'contributing',
  'governance',
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

  // /en/xxx when xxx is not a known English route
  if (
    segments.length === 2 &&
    segments[0] === 'en' &&
    !KNOWN_EN_PATHS.has(segments[1])
  ) {
    return context.rewrite(new URL('/404', context.url));
  }

  return next();
});
