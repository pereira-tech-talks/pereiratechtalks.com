import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Delivery invariants for the agent-markdown twins.
 *
 * Both were broken before Task 2 of PLAN_sitewide_language_seo_aeo_audit:
 * index pages emitted `{path}/index.md`, so `/meetups.md` 404'd while
 * `/meetups/qa-pilar-del-software.md` worked; and every endpoint served
 * `text/markdown` with no disposition, which browsers download or blank.
 *
 * These are source-level assertions so they run without a build.
 */

const PAGES_DIR = join(process.cwd(), 'src', 'pages');

function findMdEndpoints(dir: string, base = ''): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      found.push(...findMdEndpoints(full, rel));
    } else if (entry.endsWith('.md.ts')) {
      found.push(rel);
    }
  }
  return found;
}

const endpoints = findMdEndpoints(PAGES_DIR);

describe('agent-markdown endpoint delivery', () => {
  it('finds the markdown endpoints', () => {
    expect(endpoints.length).toBeGreaterThan(30);
  });

  it('exposes every twin at the page URL plus .md, never at /index.md', () => {
    // `src/pages/meetups/index.md.ts` would serve `/meetups/index.md`, breaking
    // the one rule an agent can guess: take the URL and append `.md`.
    const indexEndpoints = endpoints.filter((p) => p.endsWith('/index.md.ts'));
    expect(indexEndpoints).toEqual([]);
  });

  it('serves markdown inline so browsers render instead of downloading', () => {
    const missing = endpoints.filter((rel) => {
      const source = readFileSync(join(PAGES_DIR, rel), 'utf-8');
      return !source.includes("'Content-Disposition': 'inline'");
    });
    expect(missing).toEqual([]);
  });

  it('keeps the markdown content type that agent scanners expect', () => {
    // `public/_headers` documents that the isitagentready scanner requires
    // `text/markdown`; the disposition fix must not have traded it for
    // `text/plain`.
    const wrong = endpoints.filter((rel) => {
      const source = readFileSync(join(PAGES_DIR, rel), 'utf-8');
      return !source.includes("'text/markdown; charset=utf-8'");
    });
    expect(wrong).toEqual([]);
  });

  it('mirrors every Spanish endpoint with an English one', () => {
    // The home pages are the one asymmetric pair, and deliberately so: Spanish
    // is served unprefixed, so its twin is `/index.md`, while `/en` is itself a
    // page path whose flat twin is `/en.md` — not `/en/index.md`.
    const HOME_ES = 'index.md.ts';
    const HOME_EN = 'en.md.ts';

    const es = endpoints
      .filter((p) => !p.startsWith('en/') && p !== HOME_EN && p !== HOME_ES)
      .map((p) => p.replace(/\.md\.ts$/, ''));
    const en = new Set(
      endpoints
        .filter((p) => p.startsWith('en/'))
        .map((p) => p.slice(3).replace(/\.md\.ts$/, ''))
    );

    expect(es.filter((route) => !en.has(route))).toEqual([]);
    expect(endpoints).toContain(HOME_ES);
    expect(endpoints).toContain(HOME_EN);
  });
});

describe('public/_headers', () => {
  const headers = readFileSync(
    join(process.cwd(), 'public', '_headers'),
    'utf-8'
  );

  it('serves built .md files inline in production', () => {
    // Static hosting sets the content type from the file extension, so the
    // endpoint `Response` headers only apply in dev/SSR — production needs the
    // rule here too.
    expect(headers).toMatch(
      /\/\*\.md\n(\s+.*\n)*\s+Content-Disposition: inline/
    );
  });
});
