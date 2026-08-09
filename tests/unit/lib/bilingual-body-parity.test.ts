/**
 * Regression: every collection that carries prose must carry it in BOTH
 * languages, and neither body may leak the other language's boilerplate.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 5. The mechanism under
 * test is the `{slug}.en.md` sibling introduced in Task 3 for meetups and
 * extended to verticals in Task 5.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const CONTENT = join(process.cwd(), 'src/content');

function listMarkdown(dir: string): string[] {
  try {
    return readdirSync(join(CONTENT, dir)).filter(
      (f) => f.endsWith('.md') && !f.startsWith('.')
    );
  } catch {
    return [];
  }
}

const spanishBodies = (dir: string): string[] =>
  listMarkdown(dir).filter((f) => !f.endsWith('.en.md'));

const englishSiblingOf = (file: string): string =>
  file.replace(/\.md$/, '.en.md');

function body(dir: string, file: string): string {
  const raw = readFileSync(join(CONTENT, dir, file), 'utf-8');
  const parts = raw.split(/^---$/m);
  // `{slug}.en.md` siblings are body-only and have no frontmatter.
  return parts.length >= 3 ? parts.slice(2).join('---') : raw;
}

/** Boilerplate that must never appear on the other language's page. */
const ENGLISH_ONLY = [
  'Content migrated from the production archive',
  'Photos, slide links, and recordings are still being recovered',
  '### Sources',
  '**Talks:**',
];
const SPANISH_ONLY = [
  'Contenido migrado desde el archivo de producción',
  'Seguimos recuperando fotos, enlaces a slides y grabaciones',
  '### Fuentes',
  '**Charlas:**',
  '**Ponente:**',
];

describe.each([
  ['meetups', 'meetups'],
  ['verticals', 'verticals'],
])('%s bilingual bodies', (_label, dir) => {
  const files = spanishBodies(dir);

  it('has at least one entry to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('every entry has an English body sibling', () => {
    const missing = files.filter(
      (f) => !listMarkdown(dir).includes(englishSiblingOf(f))
    );
    expect(missing).toEqual([]);
  });

  it('Spanish bodies carry no English boilerplate', () => {
    const offenders = files.flatMap((f) => {
      const text = body(dir, f);
      return ENGLISH_ONLY.filter((s) => text.includes(s)).map(
        (s) => `${f}: ${s}`
      );
    });
    expect(offenders).toEqual([]);
  });

  it('English bodies carry no Spanish boilerplate', () => {
    const offenders = files.flatMap((f) => {
      const en = englishSiblingOf(f);
      if (!listMarkdown(dir).includes(en)) return [];
      const text = body(dir, en);
      return SPANISH_ONLY.filter((s) => text.includes(s)).map(
        (s) => `${en}: ${s}`
      );
    });
    expect(offenders).toEqual([]);
  });
});

describe('bilingual frontmatter titles', () => {
  const i18nTitle = (raw: string): { en: string; es: string } | null => {
    const m = raw.match(/^title:\n {2}en: "(.+)"\n {2}es: "(.+)"$/m);
    return m ? { en: m[1], es: m[2] } : null;
  };

  // Spanish function words that should never survive into an English title.
  // `y` and `en` are excluded: they appear inside untranslatable proper nouns
  // (`Pereira Tech Talks y Más`, `Camellando H+W`) and would only add noise.
  const SPANISH_MARKERS =
    /\b(de|la|el|los|las|con|para|una|del|que|como|nuestra|sobre|desde|más)\b/i;

  it.each([
    ['meetups', 'meetups'],
    ['talks', 'talks'],
  ])('%s: no English title still reads as Spanish', (_label, dir) => {
    const offenders = spanishBodies(dir)
      .map((f) => ({
        f,
        t: i18nTitle(readFileSync(join(CONTENT, dir, f), 'utf-8')),
      }))
      .filter(({ t }) => t && t.en !== t.es && SPANISH_MARKERS.test(t.en))
      .map(({ f, t }) => `${f}: ${t?.en}`);
    expect(offenders).toEqual([]);
  });
});
