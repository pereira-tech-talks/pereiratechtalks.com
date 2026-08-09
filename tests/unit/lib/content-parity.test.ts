/**
 * Bilingual content-parity comparison.
 *
 * The scanner's value is that it separates three things that look alike in a
 * diff and call for different responses: a lost source, a shape difference, and
 * an archive stub. Getting that split wrong in either direction makes it
 * useless — a scanner that cries about `### Fuentes` vs `### Sources` trains
 * people to ignore it.
 *
 * Part of PLAN_bilingual_content_parity Task 1.
 */
import { describe, expect, it } from 'vitest';

import {
  BLOCKING_CLASSES,
  bilingualFields,
  blockingFindings,
  bodyOf,
  compareField,
  comparePair,
  FIELD_MIN_WORDS,
  FIELD_RATIO,
  isEquivalentLabel,
  REPORTING_CLASSES,
  shapeOf,
  summarize,
  THIN_WORD_FLOOR,
  urlsOf,
} from '../../../scripts/lib/content-parity.mjs';

const frontmattered = (body: string) =>
  `---\ntitle:\n  en: "T"\n  es: "T"\n---\n${body}`;

const longBody = (extra = '') =>
  `## Title\n\n${'palabra '.repeat(120)}\n\n${extra}`;

describe('bodyOf', () => {
  it('drops the frontmatter fence', () => {
    expect(bodyOf('---\ntitle: x\n---\n## Body\n')).toContain('## Body');
    expect(bodyOf('---\ntitle: x\n---\n## Body\n')).not.toContain('title: x');
  });

  it('returns a sibling file unchanged — those carry no frontmatter', () => {
    expect(bodyOf('## English body\n')).toBe('## English body\n');
  });

  it('keeps a horizontal rule that appears inside the body', () => {
    const body = bodyOf('---\ntitle: x\n---\n## A\n\n---\n\n### Sources\n');
    expect(body).toContain('### Sources');
    expect(shapeOf(body).rules).toBe(1);
  });

  it('REGRESSION: keeps the blank line after a horizontal rule', () => {
    // The fence pattern used `\s*`, which matches newlines — so it ate the
    // blank line after `---` and fused the rule to the heading below it. A
    // Spanish body with a rule then counted one paragraph fewer than an
    // identically-shaped English one, and the scanner reported 86 files as
    // structurally drifted when nothing was wrong with them.
    const es = bodyOf(
      '---\ntitle: x\n---\n## A\n\n---\n\n### Fuentes\n\n- a\n'
    );
    const en = '## A\n\n---\n\n### Sources\n\n- a\n';
    expect(es).toContain('---\n\n### Fuentes');
    expect(shapeOf(es).paragraphs).toBe(shapeOf(en).paragraphs);
  });
});

describe('urlsOf', () => {
  it('strips stray markdown punctuation from an archive URL', () => {
    // Archive bodies wrote `…/git_github.html**` — the asterisks are broken
    // markdown, not part of the link, and leaving them in makes the same URL
    // look different across languages.
    const es = urlsOf(
      'Slides: http://pin3da.github.io/slides/git_github.html**'
    );
    const en = urlsOf('Slides: http://pin3da.github.io/slides/git_github.html');
    expect(es).toEqual(en);
  });

  it('ignores URLs inside code fences', () => {
    expect(urlsOf('```\nhttps://example.test/x\n```').size).toBe(0);
  });

  it('finds both bare and markdown-linked URLs', () => {
    const urls = urlsOf('[a](https://a.test) and https://b.test here');
    expect([...urls].sort()).toEqual(['https://a.test', 'https://b.test']);
  });
});

describe('isEquivalentLabel', () => {
  it.each([
    ['Fuentes', 'Sources'],
    ['Charlas', 'Talks'],
    ['Ponentes', 'Speakers'],
    ['Galería', 'Gallery'],
  ])('treats %s / %s as the same section', (es, en) => {
    expect(isEquivalentLabel(es, en)).toBe(true);
  });

  it('does not equate genuinely different sections', () => {
    expect(isEquivalentLabel('Fuentes', 'Talks')).toBe(false);
  });
});

describe('comparePair — content loss', () => {
  it('FIXTURE: reports a URL present only in Spanish', () => {
    const r = comparePair({
      id: 'x',
      es: frontmattered(longBody('Slides: https://slides.test/deck')),
      en: longBody(),
    });
    const loss = r.findings.filter((f) => f.class === 'content-loss');
    expect(loss).toHaveLength(1);
    expect(loss[0].detail).toContain('only in ES');
    expect(loss[0].detail).toContain('https://slides.test/deck');
  });

  it('FIXTURE: reports a URL present only in English', () => {
    const r = comparePair({
      id: 'x',
      es: frontmattered(longBody()),
      en: longBody('Source: https://www.meetup.com/e/1'),
    });
    const loss = r.findings.filter((f) => f.class === 'content-loss');
    expect(loss[0].detail).toContain('only in EN');
  });

  it('FIXTURE: reports a missing English sibling as loss', () => {
    const r = comparePair({ id: 'x', es: frontmattered(longBody()), en: null });
    expect(r.findings[0]).toMatchObject({ class: 'content-loss' });
    expect(r.findings[0].detail).toMatch(/no English body/);
  });

  it('reports nothing when both carry the same URL', () => {
    const url = 'https://www.meetup.com/e/1';
    const r = comparePair({
      id: 'x',
      es: frontmattered(longBody(`Fuente: ${url}`)),
      en: longBody(`Source: ${url}`),
    });
    expect(r.findings.filter((f) => f.class === 'content-loss')).toEqual([]);
  });
});

describe('comparePair — must NOT fire', () => {
  it('does not report the deliberate per-language section labels as drift', () => {
    // A previous plan made these differ on purpose. Reporting them would train
    // readers to ignore the scanner.
    const r = comparePair({
      id: 'x',
      es: frontmattered(
        `## Título\n\n${'palabra '.repeat(120)}\n\n### Fuentes\n\n- Página original del evento: https://a.test\n`
      ),
      en: `## Title\n\n${'word '.repeat(120)}\n\n### Sources\n\n- Original event page: https://a.test\n`,
    });
    expect(r.findings).toEqual([]);
  });

  it('does not treat a long pair as thin', () => {
    const r = comparePair({
      id: 'x',
      es: frontmattered(longBody()),
      en: longBody(),
    });
    expect(r.findings.filter((f) => f.class === 'thin-both')).toEqual([]);
  });
});

describe('comparePair — structural and thin', () => {
  it('reports a horizontal rule present in one language only', () => {
    const r = comparePair({
      id: 'x',
      es: frontmattered(
        `## T\n\n${'palabra '.repeat(120)}\n\n---\n\n### Fuentes\n`
      ),
      en: `## T\n\n${'word '.repeat(120)}\n\n### Sources\n`,
    });
    const st = r.findings.filter((f) => f.class === 'structural');
    expect(st.some((f) => f.detail.startsWith('rules:'))).toBe(true);
  });

  it('reports a pair thin on BOTH sides, not one', () => {
    const thin = comparePair({
      id: 'x',
      es: frontmattered('## T\n\nCorto.\n'),
      en: '## T\n\nShort.\n',
    });
    expect(thin.findings.some((f) => f.class === 'thin-both')).toBe(true);

    const oneSided = comparePair({
      id: 'y',
      es: frontmattered(longBody()),
      en: '## T\n\nShort.\n',
    });
    // Short on one side only is a parity problem, reported as structural /
    // content-loss — not as an archive gap.
    expect(oneSided.findings.some((f) => f.class === 'thin-both')).toBe(false);
  });

  it('uses the documented word floor', () => {
    expect(THIN_WORD_FLOOR).toBe(80);
  });
});

describe('summarize', () => {
  it('counts a pair with only a thin-both finding as at parity', () => {
    // Thin is an archive gap, not a parity defect — the two languages agree.
    const results = [
      comparePair({
        id: 'x',
        es: frontmattered('## T\n\nCorto.\n'),
        en: '## T\n\nShort.\n',
      }),
    ];
    expect(summarize(results).identical).toBe(1);
  });

  it('does not count a pair with content loss as at parity', () => {
    const results = [
      comparePair({
        id: 'x',
        es: frontmattered(longBody('https://a.test')),
        en: longBody(),
      }),
    ];
    expect(summarize(results).identical).toBe(0);
  });
});

describe('bilingualFields', () => {
  it('finds an { en, es } pair at any depth, with its path', () => {
    const found = [
      ...bilingualFields({
        title: { en: 'T', es: 'T' },
        faqs: [{ answer: { en: 'a', es: 'b' } }],
      }),
    ];
    expect(found.map((f) => f.path).sort()).toEqual(['faqs.0.answer', 'title']);
  });

  it('does not mistake a non-string pair for a bilingual field', () => {
    // `{ en: [...], es: [...] }` shows up for list-valued config; comparing word
    // counts on it is meaningless.
    expect([...bilingualFields({ nav: { en: ['a'], es: ['b'] } })]).toEqual([]);
  });
});

describe('compareField', () => {
  const f = (en: string | undefined, es: string | undefined) =>
    compareField({ id: 'x', path: 'p', en, es });

  it('reports a field empty in one language', () => {
    expect(f('', 'algo')).toMatchObject({ class: 'field-missing' });
    expect(f('something', undefined)).toMatchObject({ class: 'field-missing' });
  });

  it('reports English that points at the Spanish text instead of translating', () => {
    // This exact shape shipped in 18 talk abstracts.
    expect(
      f(
        'Talk: Noche de Rust. See the Spanish abstract for the full description.',
        'Una guía introductoria a Rust.'
      )
    ).toMatchObject({ class: 'field-pointer' });
  });

  it('reports a summary standing in for a translation', () => {
    const es = 'palabra '.repeat(40);
    const en = 'word '.repeat(12);
    expect(f(en, es)).toMatchObject({ class: 'field-skew' });
  });

  it('MUST NOT fire on ordinary Spanish expansion', () => {
    // Spanish runs ~15-25% longer for the same content. Reporting that would
    // flag every correctly translated field in the repository. The first draft
    // of this fixture was itself 1.67x and the scanner was right to report it —
    // which is the reason `field-skew` is a review signal and never blocks:
    // above 1.5x, a faithful translation and a summary look the same.
    expect(
      f(
        'Thanks to the organizing team and our sponsors, we plan morning and afternoon refreshments for everyone attending.',
        'Gracias al equipo organizador y a los patrocinadores, tendremos refrigerios en la mañana y en la tarde para todos los asistentes.'
      )
    ).toBeNull();
  });

  it('MUST NOT fire on short strings, where ratios are noise', () => {
    // A 4-word title against a 7-word one is 1.75x and perfectly translated.
    expect(f('Your first talk', 'Tu primera charla')).toBeNull();
    expect(FIELD_MIN_WORDS).toBe(12);
  });

  it('says nothing when both sides are absent', () => {
    expect(f(undefined, undefined)).toBeNull();
  });

  it('uses the documented ratio', () => {
    expect(FIELD_RATIO).toBe(1.5);
  });
});

describe('gate policy', () => {
  it('blocks only on the classes that need no interpretation', () => {
    expect([...BLOCKING_CLASSES]).toEqual([
      'content-loss',
      'structural',
      'field-missing',
      'field-pointer',
    ]);
  });

  it('FIXTURE: a lost URL fails the build', () => {
    expect(blockingFindings({ 'content-loss': 1 })).toEqual([
      ['content-loss', 1],
    ]);
  });

  it('FIXTURE: an archive stub does NOT fail the build', () => {
    // 18 pairs are short in both languages with no repo source to fix them
    // from. Failing on that would make the gate unpassable and it would be
    // switched off within a week.
    expect(blockingFindings({ 'thin-both': 18, 'field-skew': 13 })).toEqual([]);
  });

  it('reports the reporting classes rather than blocking on them', () => {
    expect([...REPORTING_CLASSES]).toEqual(['thin-both', 'field-skew']);
    for (const cls of REPORTING_CLASSES) {
      expect(BLOCKING_CLASSES).not.toContain(cls);
    }
  });

  it('names every blocking class present, not just the first', () => {
    expect(blockingFindings({ 'content-loss': 2, 'field-pointer': 5 })).toEqual(
      [
        ['content-loss', 2],
        ['field-pointer', 5],
      ]
    );
  });
});
