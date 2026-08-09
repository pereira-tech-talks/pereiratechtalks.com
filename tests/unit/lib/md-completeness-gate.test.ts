/**
 * The assertion logic behind `pnpm run md:check:strict`.
 *
 * `scripts/check-md-parity.mjs` used to report "480/480 pages (100%)" while the
 * sampled `.md` was missing talk titles, speaker names, sponsors, hero and
 * venue. It counted files, not content — which is why the defect survived. This
 * covers the layers that replaced it, each with a fixture that must fail.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 9.
 */
import { describe, expect, it } from 'vitest';

import {
  bareSlugRows,
  CONTRACT_TARGET,
  contentWords,
  coverageOf,
  evaluatePage,
  floorFor,
  headingsOf,
  MIN_CONTENT_WORDS,
  mainOf,
  missingFrontBlock,
  missingSections,
  navigationProblem,
  pageTypeOf,
} from '../../../scripts/lib/md-completeness.mjs';

const wrapMain = (body: string) =>
  `<html><body><nav>Home Blog Contact</nav><main>${body}</main><footer>Footer chrome</footer></body></html>`;

const GOOD_MEETUP_MD = `# QA: the pillar of software

> Two talks on quality.

Language: en
Canonical: https://pereiratechtalks.org/en/meetups/qa-pilar-del-software
Date: 2026-06-24

---

Software quality has moved well beyond catching bugs.

## Talks

### QA First: lessons from open source

Speakers: [Juan Pérez](/en/speakers/juan-perez.md)

## Venue

UTP, Pereira, Colombia

---

## Site Navigation

- [Home](/en)
`;

describe('page type resolution', () => {
  it.each([
    ['', 'home'],
    ['index', 'home'],
    ['en', 'home'],
    ['meetups', 'meetup-index'],
    ['meetups/qa-pilar-del-software', 'meetup-detail'],
    ['en/meetups/qa-pilar-del-software', 'meetup-detail'],
    ['speakers/sergio-florez', 'speaker-detail'],
    ['sponsors', 'sponsor-index'],
    ['sponsors/dailybot', 'sponsor-detail'],
    ['pereira-tech-day', 'ptd-landing'],
    ['pereira-tech-days/2026', 'ptd-edition'],
    ['blog', 'blog-index'],
    ['blog/some-post', 'blog-post'],
    ['blog/series', 'blog-series-index'],
    ['blog/series/some-series', 'blog-series'],
    ['en/verticals', 'vertical-index'],
    ['about', 'about'],
  ])('resolves %s to %s', (path, expected) => {
    expect(pageTypeOf(path)).toBe(expected);
  });

  it('treats the Spanish root and /en as the same type', () => {
    expect(pageTypeOf('index')).toBe(pageTypeOf('en'));
  });
});

describe('content-word coverage', () => {
  it('ignores nav and footer chrome by scoping to <main>', () => {
    const html = wrapMain('<p>Quality engineering practice</p>');
    expect(mainOf(html)).not.toContain('Footer chrome');
    const { ratio } = coverageOf(html, 'Quality engineering practice');
    expect(ratio).toBe(1);
  });

  it('reports which words the twin is missing', () => {
    const html = wrapMain('<p>alpha bravo charlie delta</p>');
    const { missing, ratio } = coverageOf(html, 'alpha bravo');
    expect(missing.sort()).toEqual(['charlie', 'delta']);
    expect(ratio).toBeCloseTo(0.5, 5);
  });

  it('cannot be inflated by link targets', () => {
    const html = wrapMain('<p>procedural generation discovery</p>');
    const padded = '[x](/procedural/generation/discovery)';
    expect(coverageOf(html, padded).ratio).toBeLessThan(1);
  });

  it('compares words as a set, so reordering is allowed', () => {
    const html = wrapMain('<p>alpha bravo charlie</p>');
    expect(coverageOf(html, 'charlie bravo alpha').ratio).toBe(1);
  });

  it('folds diacritics so accents do not read as a miss', () => {
    expect(contentWords('Tecnología')).toEqual(contentWords('tecnologia'));
  });
});

describe('required sections', () => {
  it('passes a complete meetup twin', () => {
    expect(missingSections(GOOD_MEETUP_MD, 'meetup-detail')).toEqual([]);
  });

  it('FIXTURE: fails when the Talks section is dropped', () => {
    const broken = GOOD_MEETUP_MD.replace('## Talks', '## Something else');
    expect(missingSections(broken, 'meetup-detail')).toEqual(['Talks']);
  });

  it('accepts the Spanish heading for the same section', () => {
    const spanish = GOOD_MEETUP_MD.replace('## Talks', '## Charlas').replace(
      '## Venue',
      '## Lugar'
    );
    expect(missingSections(spanish, 'meetup-detail')).toEqual([]);
  });

  it('treats a conditional section as satisfied when the page has none', () => {
    // A meetup with no programmed talks legitimately has no Talks section.
    const noTalks = GOOD_MEETUP_MD.replace('## Talks', '## Elsewhere');
    const htmlWithoutTalks = wrapMain('<h2>Venue</h2>');
    expect(missingSections(noTalks, 'meetup-detail', htmlWithoutTalks)).toEqual(
      []
    );
  });

  it('FIXTURE: still fails when the page shows talks and the twin does not', () => {
    const noTalks = GOOD_MEETUP_MD.replace('## Talks', '## Elsewhere');
    const htmlWithTalks = wrapMain(
      '<section id="talks"><h2>Talks</h2></section>'
    );
    expect(missingSections(noTalks, 'meetup-detail', htmlWithTalks)).toEqual([
      'Talks',
    ]);
  });

  it('reads both h2 and h3 headings', () => {
    expect(headingsOf('## Alpha\n\n### Bravo\n')).toEqual(['Alpha', 'Bravo']);
  });
});

describe('universal rules', () => {
  it('accepts a well-formed front block', () => {
    expect(missingFrontBlock(GOOD_MEETUP_MD)).toEqual([]);
  });

  it.each([
    ['H1 title', GOOD_MEETUP_MD.replace('# QA: the pillar of software', 'QA')],
    ['Language:', GOOD_MEETUP_MD.replace('Language: en', '')],
    ['Canonical:', GOOD_MEETUP_MD.replace(/^Canonical:.*$/m, '')],
  ])('FIXTURE: reports a missing %s', (field, broken) => {
    expect(missingFrontBlock(broken)).toContain(field);
  });

  it('accepts exactly one Site Navigation block', () => {
    expect(navigationProblem(GOOD_MEETUP_MD)).toBeNull();
  });

  it('FIXTURE: reports a missing Site Navigation block', () => {
    const broken = GOOD_MEETUP_MD.replace('## Site Navigation', '## Links');
    expect(navigationProblem(broken)).toMatch(/missing/);
  });

  it('FIXTURE: reports a duplicated Site Navigation block', () => {
    const broken = `${GOOD_MEETUP_MD}\n## Site Navigation\n`;
    expect(navigationProblem(broken)).toMatch(/2 times/);
  });

  it('accepts the Spanish navigation heading', () => {
    const spanish = GOOD_MEETUP_MD.replace(
      '## Site Navigation',
      '## Navegación del Sitio'
    );
    expect(navigationProblem(spanish)).toBeNull();
  });

  it('FIXTURE: catches a bare slug row where a name belongs', () => {
    const broken = `${GOOD_MEETUP_MD}\n- qa-pilar-del-software--1-open-source\n`;
    expect(bareSlugRows(broken)).toEqual([
      '- qa-pilar-del-software--1-open-source',
    ]);
  });

  it('does not mistake a linked entity row for a bare slug', () => {
    const fine = '- [Juan Pérez](/en/speakers/juan-perez.md) — Engineer';
    expect(bareSlugRows(fine)).toEqual([]);
  });
});

describe('thresholds', () => {
  it('holds unlisted types to the contract target', () => {
    expect(floorFor('meetup-detail')).toBe(CONTRACT_TARGET);
    expect(floorFor('blog-post')).toBe(CONTRACT_TARGET);
  });

  it('gives the documented types a measured floor below the target', () => {
    for (const type of ['speaker-detail', 'calendar', 'home', 'sponsor-us']) {
      expect(floorFor(type)).toBeLessThan(CONTRACT_TARGET);
      // A floor is a regression detector, not an amnesty.
      expect(floorFor(type)).toBeGreaterThanOrEqual(0.7);
    }
  });
});

describe('evaluatePage', () => {
  const html = wrapMain(
    `<h1>QA: the pillar of software</h1>
     <p>Software quality has moved well beyond catching bugs.</p>
     <section id="talks"><h2>Talks</h2>
       <h3>QA First: lessons from open source</h3>
       <p>Speakers Juan Pérez</p></section>
     <h2>Venue</h2><p>UTP, Pereira, Colombia</p>`
  );

  it('passes a complete twin', () => {
    const verdict = evaluatePage({
      pagePath: 'en/meetups/qa-pilar-del-software',
      html,
      markdown: GOOD_MEETUP_MD,
      expectedLanguage: 'en',
    });
    expect(verdict.errors).toEqual([]);
    expect(verdict.type).toBe('meetup-detail');
  });

  it('FIXTURE: fails a twin that declares the wrong language', () => {
    const broken = GOOD_MEETUP_MD.replace('Language: en', 'Language: es');
    const verdict = evaluatePage({
      pagePath: 'en/meetups/qa-pilar-del-software',
      html,
      markdown: broken,
      expectedLanguage: 'en',
    });
    expect(verdict.errors.join(' ')).toMatch(/language other than "en"/);
  });

  it('FIXTURE: fails a summary and names what is absent', () => {
    const summary = `# QA: the pillar of software

Language: en
Canonical: https://pereiratechtalks.org/en/meetups/qa-pilar-del-software

---

## Venue

UTP

## Site Navigation

- [Home](/en)
`;
    const verdict = evaluatePage({
      pagePath: 'en/meetups/qa-pilar-del-software',
      html,
      markdown: summary,
      expectedLanguage: 'en',
    });
    expect(verdict.errors.join(' ')).toMatch(/missing required section/);
  });

  it('skips the ratio below the page-size floor but keeps section checks', () => {
    const tiny = wrapMain('<p>alpha bravo charlie</p>');
    const verdict = evaluatePage({
      pagePath: 'en/about',
      html: tiny,
      markdown:
        '# A\n\nLanguage: en\nCanonical: https://x.test/a\n\n## Site Navigation\n',
      expectedLanguage: 'en',
    });
    expect(verdict.measured).toBe(false);
    expect(verdict.htmlWordCount).toBeLessThan(MIN_CONTENT_WORDS);
    expect(verdict.errors).toEqual([]);
  });
});
