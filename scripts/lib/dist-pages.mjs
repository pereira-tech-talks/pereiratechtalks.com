/**
 * Shared discovery of built pages in `dist/`.
 *
 * Extracted from `check-md-parity.mjs` so the parity check and the
 * language-integrity audit agree on what counts as a page, a redirect, and an
 * exclusion. Two walkers with drifting definitions would report two different
 * "total pages" numbers and quietly disagree about coverage.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const DIST_DIR = join(process.cwd(), 'dist');

/**
 * Paths that intentionally have no `.md` counterpart and are not audited.
 *
 *   - `/internal/*`    dev-only pages, already stripped from the prod build
 *   - `/404`           error page
 *   - `/api/*`         JSON/text API endpoints
 *   - `/rss.xml`       RSS feed
 *   - `/.well-known/*` agent-readiness endpoints
 *   - `/_astro/*`      asset bundle directory
 *   - `/images/*`      static image assets
 *   - pagination pages (`/page/N` under any prefix)
 *   - tag listing pages (`/tag/` under any prefix)
 *   - certificates     personal diplomas + verify (noindex, opaque IDs)
 */
export const EXCLUDED_PATTERNS = [
  /^internal(\/|$)/,
  /^404/,
  /^api\//,
  /^rss\.xml/,
  /^README$/,
  /^\.well-known(\/|$)/,
  /^_astro(\/|$)/,
  /^images(\/|$)/,
  /\/page\/\d+/,
  /\/tag\//,
  /\/certificates(\/|$)/,
  /^certificates(\/|$)/,
  /^en\/certificates(\/|$)/,
];

/**
 * Resolve a page path to its HTML file. The site root is discovered as the
 * synthetic path `index` and lives at `dist/index.html`, not `dist/index/`.
 */
export function htmlPathFor(pagePath, distDir = DIST_DIR) {
  return pagePath === 'index'
    ? join(distDir, 'index.html')
    : join(distDir, pagePath, 'index.html');
}

export function shouldExclude(pagePath) {
  return EXCLUDED_PATTERNS.some((pattern) => pattern.test(pagePath));
}

/**
 * Detect redirect pages in the build output. Astro emits a tiny HTML file with
 * `<meta http-equiv="refresh">` for each redirect; those point elsewhere and so
 * have no content of their own to audit.
 */
export function isRedirectPage(pagePath, distDir = DIST_DIR) {
  const htmlPath = htmlPathFor(pagePath, distDir);
  if (!existsSync(htmlPath)) return false;
  try {
    const content = readFileSync(htmlPath, 'utf-8');
    return content.length < 2000 && content.includes('http-equiv="refresh"');
  } catch {
    return false;
  }
}

/** Recursively collect every rendered page path (the dir holding an index.html). */
export function findHtmlPages(dir, base = '') {
  const pages = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      pages.push(...findHtmlPages(fullPath, relPath));
    } else if (entry.name === 'index.html') {
      pages.push(base || 'index');
    }
  }

  return pages;
}

export function findExpectedMdPath(pagePath) {
  return pagePath === 'index' ? 'index.md' : `${pagePath}.md`;
}

/** Resolve a page's `.md` twin, accepting either `{path}.md` or `{path}/index.md`. */
export function checkMdExists(pagePath, distDir = DIST_DIR) {
  const primaryMd = findExpectedMdPath(pagePath);
  if (existsSync(join(distDir, primaryMd))) {
    return { found: true, mdPath: primaryMd };
  }

  const indexMd = `${pagePath}/index.md`;
  if (existsSync(join(distDir, indexMd))) {
    return { found: true, mdPath: indexMd };
  }

  return { found: false, mdPath: primaryMd };
}

/** The language a page path promises: `/en/...` is English, everything else Spanish. */
export function expectedLanguageFor(pagePath) {
  return pagePath === 'en' || pagePath.startsWith('en/') ? 'en' : 'es';
}

/**
 * Partition the build output into the three buckets every caller needs.
 * `checkable` is the audit surface: real pages, excluding redirects.
 */
export function collectPages(distDir = DIST_DIR) {
  const all = findHtmlPages(distDir);
  const excluded = all.filter((p) => shouldExclude(p));
  const remaining = all.filter((p) => !shouldExclude(p));
  const redirects = remaining.filter((p) => isRedirectPage(p, distDir));
  const checkable = remaining.filter((p) => !isRedirectPage(p, distDir));

  return { all, excluded, redirects, checkable };
}
