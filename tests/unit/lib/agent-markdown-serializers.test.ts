/**
 * The generic and listing serializers in `markdown-for-agents.ts`.
 *
 * Task 7's suite covers the three detail serializers it introduced; this closes
 * the gap around the ones every other page type flows through — the generic
 * shape, the blog index, the series index and listing, and the page serializer —
 * plus the universal rules the completeness gate asserts from the outside.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 11.
 */
import { describe, expect, it } from 'vitest';

import {
  entityLine,
  imageLine,
  linkLine,
  mdHref,
  mdLabel,
  resolveI18n,
  serializeBlogIndexToMarkdown,
  serializeGenericToMarkdown,
  serializeSeriesListingToMarkdown,
} from '@/lib/markdown-for-agents';

describe('serializeGenericToMarkdown', () => {
  const base = {
    title: 'QA: the pillar of software',
    description: 'Two talks on quality.',
    lang: 'en',
    canonical: 'https://pereiratechtalks.org/en/meetups/qa',
  };

  it('emits the front block in the contract order', () => {
    const md = serializeGenericToMarkdown({
      ...base,
      metadata: [['Date', '2026-06-24']],
    });
    const head = md.split('---')[0];
    expect(head.indexOf('# QA')).toBeLessThan(head.indexOf('> Two talks'));
    expect(head.indexOf('> Two talks')).toBeLessThan(head.indexOf('Language:'));
    expect(head.indexOf('Language:')).toBeLessThan(head.indexOf('Canonical:'));
    expect(head.indexOf('Canonical:')).toBeLessThan(head.indexOf('Date:'));
  });

  it('drops metadata entries with an empty value', () => {
    const md = serializeGenericToMarkdown({
      ...base,
      metadata: [
        ['Date', '2026-06-24'],
        ['Recording', ''],
      ],
    });
    expect(md).toContain('Date: 2026-06-24');
    expect(md).not.toContain('Recording:');
  });

  it('omits an empty section rather than emitting a bare heading', () => {
    const md = serializeGenericToMarkdown({
      ...base,
      sections: [
        { heading: 'Talks', lines: [] },
        { heading: 'Venue', lines: ['UTP'] },
      ],
    });
    expect(md).not.toContain('## Talks');
    expect(md).toContain('## Venue');
  });

  it('always closes with exactly one Site Navigation block', () => {
    const md = serializeGenericToMarkdown(base);
    const blocks = md.match(/^## Site Navigation$/gm) ?? [];
    expect(blocks).toHaveLength(1);
    expect(md.trimEnd().split('## Site Navigation')[1]).toBeTruthy();
  });

  it('uses the Spanish navigation heading on a Spanish page', () => {
    const md = serializeGenericToMarkdown({ ...base, lang: 'es' });
    expect(md).toContain('## Navegación del Sitio');
    expect(md).not.toContain('## Site Navigation');
  });

  it('works without a description or body', () => {
    const md = serializeGenericToMarkdown({
      title: 'T',
      lang: 'en',
      canonical: 'https://x.test/t',
    });
    expect(md).toContain('# T');
    expect(md).toContain('Language: en');
  });
});

describe('blog index and series listing', () => {
  const posts = [
    {
      title: 'First meetup',
      slug: 'first-meetup',
      description: 'How it began.',
      pubDate: new Date('2014-02-27T00:00:00.000Z'),
    },
  ];

  it('links each post to its own `.md`, not to the HTML', () => {
    const md = serializeBlogIndexToMarkdown(posts, {
      lang: 'en',
      title: 'Blog',
      description: 'Community writing.',
    });
    expect(md).toContain('[First meetup](/en/blog/first-meetup.md)');
  });

  it('leaves Spanish links unprefixed', () => {
    const md = serializeBlogIndexToMarkdown(posts, {
      lang: 'es',
      title: 'Blog',
      description: 'Escritos de la comunidad.',
    });
    expect(md).toContain('[First meetup](/blog/first-meetup.md)');
  });

  it('carries the listing prose, not just the links', () => {
    // A bare link list measured 0.29 coverage against a page that explains what
    // a series is.
    const md = serializeSeriesListingToMarkdown(
      [
        {
          slug: 'the-library-of-tomorrow',
          title: 'The Library of Tomorrow',
          description: 'A reading group.',
          postCount: 3,
          order: 1,
        },
      ],
      {
        lang: 'en',
        title: 'Blog Series',
        description: 'Curated multi-chapter collections.',
      }
    );
    expect(md).toContain('Curated multi-chapter collections.');
    expect(md).toContain('/en/blog/series/the-library-of-tomorrow.md');
  });

  it('localizes the series total label', () => {
    const args = [
      { slug: 's', title: 'S', description: 'd', postCount: 1, order: 1 },
    ];
    const en = serializeSeriesListingToMarkdown(args, {
      lang: 'en',
      title: 'T',
      description: 'D',
    });
    const es = serializeSeriesListingToMarkdown(args, {
      lang: 'es',
      title: 'T',
      description: 'D',
    });
    expect(en).toContain('Total series:');
    expect(es).toContain('Total de series:');
  });
});

describe('resolveI18n', () => {
  it('returns a plain string unchanged', () => {
    expect(resolveI18n('Pereira Tech Day', 'en')).toBe('Pereira Tech Day');
  });

  it('picks the requested language', () => {
    const value = { en: 'Speakers', es: 'Ponentes' };
    expect(resolveI18n(value, 'en')).toBe('Speakers');
    expect(resolveI18n(value, 'es')).toBe('Ponentes');
  });

  it('falls back rather than rendering undefined', () => {
    expect(resolveI18n({ es: 'Solo español' }, 'en')).toBe('Solo español');
    expect(resolveI18n(null, 'en')).toBe('');
    expect(resolveI18n(undefined, 'es')).toBe('');
  });
});

describe('entity helpers', () => {
  it('builds a `.md` href per language', () => {
    expect(mdHref('en', 'sponsors/dailybot')).toBe('/en/sponsors/dailybot.md');
    expect(mdHref('es', '/sponsors/dailybot')).toBe('/sponsors/dailybot.md');
  });

  it('joins multiple details with a middle dot', () => {
    expect(
      entityLine('DailyBot', '/sponsors/dailybot.md', 'gold', 'https://d.test')
    ).toBe('- [DailyBot](/sponsors/dailybot.md) — gold · https://d.test');
  });

  it('emits a plain labelled link for non-entity targets', () => {
    expect(linkLine('Google Maps', 'https://maps.test')).toBe(
      '- [Google Maps](https://maps.test)'
    );
  });

  it('keeps images with their alt text', () => {
    expect(imageLine('Audience at UTP', '/images/g1.webp')).toBe(
      '![Audience at UTP](/images/g1.webp)'
    );
  });

  it('falls back to the default language for an unknown label locale', () => {
    expect(mdLabel('pt', 'speakers')).toBe(mdLabel('es', 'speakers'));
  });
});
