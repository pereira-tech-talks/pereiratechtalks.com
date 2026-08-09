/**
 * The navigation surface must agree everywhere it appears.
 *
 * `src/lib/site-navigation.ts` is the source of truth. The footer and the
 * agent-Markdown Site Navigation block are derived from it in code. The Svelte
 * chrome (`Header.svelte`, `MobileMenu.svelte`) keeps its own hand-written
 * markup — each link carries its own analytics event and hydration wiring — so
 * its paths are an *enforced* copy: these tests fail the moment the two
 * diverge.
 *
 * The drift this prevents is not hypothetical. Before Task 8 the Markdown copy
 * linked `/talks`, a 301 to `/meetups/`, and omitted `/communities`,
 * `/calendar` and `/slides`.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 8.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  chromeNavPaths,
  internalNavPaths,
  navHref,
  navLabel,
  SITE_NAVIGATION,
} from '@/lib/site-navigation';

const COMPONENTS = join(process.cwd(), 'src', 'components');

/** Paths the Svelte chrome links, as `{prefix}/x` template hrefs. */
function chromePathsFrom(file: string): Set<string> {
  const source = readFileSync(join(COMPONENTS, file), 'utf-8');
  const found = new Set<string>();
  for (const m of source.matchAll(/href="\{prefix\}(\/[a-z0-9/-]*)"/g)) {
    found.add(m[1]);
  }
  // The logo links `prefix || '/'`, which is the home entry.
  if (/href=\{prefix \|\| '\/'\}/.test(source)) found.add('/');
  return found;
}

describe('site navigation source of truth', () => {
  it('exposes no duplicate paths', () => {
    const paths = SITE_NAVIGATION.flatMap((g) => g.entries.map((e) => e.path));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('never links a route that redirects', () => {
    // `/talks` 301s to `/meetups/` and `/pereira-tech-days` to
    // `/pereira-tech-day/`. Pointing an agent at a redirect is worse than
    // omitting the entry.
    const REDIRECTS = ['/talks', '/pereira-tech-days', '/events'];
    const offenders = internalNavPaths().filter((p) => REDIRECTS.includes(p));
    expect(offenders).toEqual([]);
  });

  it('uses absolute-path internal targets, never relative', () => {
    const bad = internalNavPaths().filter((p) => !p.startsWith('/'));
    expect(bad).toEqual([]);
  });

  it('uses https for every external target', () => {
    const external = SITE_NAVIGATION.flatMap((g) =>
      g.entries.filter((e) => e.external)
    );
    expect(external.length).toBeGreaterThan(0);
    for (const entry of external) {
      expect(entry.path.startsWith('https://')).toBe(true);
    }
  });

  it('carries both languages for every label and group title', () => {
    for (const group of SITE_NAVIGATION) {
      expect(group.title.en, 'group title en').toBeTruthy();
      expect(group.title.es, 'group title es').toBeTruthy();
      for (const entry of group.entries) {
        expect(entry.label.en, `${entry.path} label en`).toBeTruthy();
        expect(entry.label.es, `${entry.path} label es`).toBeTruthy();
      }
    }
  });
});

describe('navigation localization', () => {
  it('prefixes English internal targets and leaves Spanish unprefixed', () => {
    for (const group of SITE_NAVIGATION) {
      for (const entry of group.entries) {
        if (entry.external) continue;
        const en = navHref(entry, 'en');
        const es = navHref(entry, 'es');
        expect(en.startsWith('/en'), `${entry.path} en`).toBe(true);
        expect(es.startsWith('/en'), `${entry.path} es`).toBe(false);
      }
    }
  });

  it('keeps external targets unprefixed in both languages', () => {
    const external = SITE_NAVIGATION.flatMap((g) =>
      g.entries.filter((e) => e.external)
    );
    for (const entry of external) {
      expect(navHref(entry, 'en')).toBe(entry.path);
      expect(navHref(entry, 'es')).toBe(entry.path);
    }
  });

  it('maps the home entry to the language root', () => {
    const home = SITE_NAVIGATION[0].entries.find((e) => e.path === '/');
    if (!home) throw new Error('home entry missing');
    expect(navHref(home, 'es')).toBe('/');
    expect(navHref(home, 'en')).toBe('/en');
  });

  it('emits no Spanish label on an English page', () => {
    const spanishOnly = SITE_NAVIGATION.flatMap((g) =>
      g.entries
        .filter((e) => e.label.en !== e.label.es)
        .filter((e) => navLabel(e, 'en') === e.label.es)
        .map((e) => e.path)
    );
    expect(spanishOnly).toEqual([]);
  });
});

describe('enforced copy: Svelte chrome vs the shared module', () => {
  const header = chromePathsFrom('layout/Header.svelte');
  const mobile = chromePathsFrom('layout/MobileMenu.svelte');
  const chrome = new Set([...header, ...mobile]);
  const declared = new Set(chromeNavPaths());

  it('finds links in both chrome components', () => {
    expect(header.size).toBeGreaterThan(5);
    expect(mobile.size).toBeGreaterThan(5);
  });

  it('declares every path the chrome links', () => {
    const undeclared = [...chrome].filter((p) => !declared.has(p));
    expect(undeclared).toEqual([]);
  });

  it('links every path it declares as chrome', () => {
    const unlinked = [...declared].filter((p) => !chrome.has(p));
    expect(unlinked).toEqual([]);
  });
});

/**
 * Against the build output when one exists. `dist/` is not a test fixture, so
 * this is skipped in a clean checkout; CI runs it after `pnpm run build`, and
 * Task 9's gate enforces the same invariant on every build.
 */
const DIST = join(process.cwd(), 'dist');
const hasBuild = existsSync(join(DIST, 'index.html'));

describe.skipIf(!hasBuild)('navigation targets in the build output', () => {
  const pageFor = (href: string): string => {
    const clean = href.replace(/^\/+|\/+$/g, '');
    return clean === ''
      ? join(DIST, 'index.html')
      : join(DIST, clean, 'index.html');
  };
  const isRedirect = (file: string): boolean =>
    /<meta[^>]+http-equiv=["']refresh/i.test(readFileSync(file, 'utf-8'));

  const targets = (['es', 'en'] as const).flatMap((lang) =>
    SITE_NAVIGATION.flatMap((group) =>
      group.entries
        .filter((e) => !e.external)
        .map((e) => ({ lang, href: navHref(e, lang) }))
    )
  );

  it('resolves every target to a real page', () => {
    const missing = targets
      .filter(({ href }) => !existsSync(pageFor(href)))
      .map(({ lang, href }) => `${lang}:${href}`);
    expect(missing).toEqual([]);
  });

  it('points at no redirect', () => {
    const redirecting = targets
      .filter(({ href }) => existsSync(pageFor(href)))
      .filter(({ href }) => isRedirect(pageFor(href)))
      .map(({ lang, href }) => `${lang}:${href}`);
    expect(redirecting).toEqual([]);
  });
});
