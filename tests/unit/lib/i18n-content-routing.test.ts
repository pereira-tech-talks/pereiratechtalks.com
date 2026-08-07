import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Regression guard: Spanish is primary at `/`, English at `/en`.
 * Blog/slides/RSS detail routes must load the matching content folder —
 * they were previously swapped (ES HTML served EN posts and vice versa).
 */
describe('i18n content routing', () => {
  const root = resolve(process.cwd());

  function read(rel: string): string {
    return readFileSync(resolve(root, rel), 'utf8');
  }

  it('Spanish blog detail loads es/ posts', () => {
    const src = read('src/pages/blog/[...slug].astro');
    expect(src).toContain("startsWith('es/')");
    expect(src).not.toContain("startsWith('en/')");
    expect(src).toContain('lang="es"');
  });

  it('English blog detail loads en/ posts', () => {
    const src = read('src/pages/en/blog/[...slug].astro');
    expect(src).toContain("startsWith('en/')");
    expect(src).not.toContain("startsWith('es/')");
    expect(src).toContain('lang="en"');
  });

  it('Spanish slides detail loads es decks', () => {
    const src = read('src/pages/slides/[...slug].astro');
    expect(src).toContain("getSlideDecks('es')");
    expect(src).toContain('lang="es"');
  });

  it('English slides detail loads en decks', () => {
    const src = read('src/pages/en/slides/[...slug].astro');
    expect(src).toContain("getSlideDecks('en')");
    expect(src).toContain('lang="en"');
  });

  it('Spanish RSS feeds es/ posts with /blog/ links', () => {
    const src = read('src/pages/rss.xml.js');
    expect(src).toContain("startsWith('es/')");
    expect(src).toContain("getTranslations('es')");
    expect(src).toMatch(/link:\s*`\/blog\/\$\{getPostSlug\(post\.id\)\}\/`/);
    expect(src).not.toContain('/en/blog/');
  });

  it('English RSS feeds en/ posts with /en/blog/ links', () => {
    const src = read('src/pages/en/rss.xml.js');
    expect(src).toContain("startsWith('en/')");
    expect(src).toContain("getTranslations('en')");
    expect(src).toMatch(
      /link:\s*`\/en\/blog\/\$\{getPostSlug\(post\.id\)\}\/`/
    );
    expect(src).not.toContain('/es/blog/');
  });
});
