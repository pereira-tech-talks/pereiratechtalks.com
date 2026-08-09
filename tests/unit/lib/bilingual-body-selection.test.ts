/**
 * Which body a page renders, for a given language.
 *
 * This is the mechanism Task 3 introduced for meetups and Task 5 extended to
 * verticals: the Spanish body lives on the entry, the English body in a
 * `{slug}.en.md` sibling, and a missing translation falls back to Spanish
 * behind a label. Tasks 4, 5, 7 and 9 all build on it, and until now nothing
 * asserted the selection itself — `tests/mocks/astro-content.ts` documents that
 * `getCollection`-backed functions are out of scope, so the collection is mocked
 * here instead.
 *
 * The fallback is the part that matters. A silent fallback is the exact defect
 * the whole plan exists to remove, so `untranslated` must be true whenever
 * Spanish is served on an English URL.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 11.
 */
import { describe, expect, it, vi } from 'vitest';

const MEETUP_TRANSLATIONS = [
  { id: '2026-06-24_qa-pilar-del-software', body: 'English meetup body.' },
];

const VERTICAL_TRANSLATIONS = [
  { id: 'speaker-school', body: 'English program body.' },
];

vi.mock('astro:content', () => ({
  getCollection: async (name: string) => {
    if (name === 'meetupBodiesEn') return MEETUP_TRANSLATIONS;
    if (name === 'verticalBodiesEn') return VERTICAL_TRANSLATIONS;
    return [];
  },
}));

const { getMeetupBodyEntry, getMeetupBodyMarkdown } = await import(
  '@/lib/meetup'
);
const { getVerticalBodyEntry } = await import('@/lib/vertical');

const translatedMeetup = {
  id: '2026-06-24_qa-pilar-del-software',
  body: 'Cuerpo en español.',
} as never;

const untranslatedMeetup = {
  id: '2014-02-27_primera-reunion-pereirajs-2014',
  body: 'Cuerpo en español sin traducir.',
} as never;

describe('meetup body selection', () => {
  it('serves the entry itself in Spanish', async () => {
    const { entry, untranslated } = await getMeetupBodyEntry(
      translatedMeetup,
      'es'
    );
    expect(entry).toBe(translatedMeetup);
    expect(untranslated).toBe(false);
  });

  it('serves the `.en.md` sibling in English', async () => {
    const { entry, untranslated } = await getMeetupBodyEntry(
      translatedMeetup,
      'en'
    );
    expect(entry.body).toBe('English meetup body.');
    expect(untranslated).toBe(false);
  });

  it('falls back to Spanish when no translation exists — and says so', async () => {
    const { entry, untranslated } = await getMeetupBodyEntry(
      untranslatedMeetup,
      'en'
    );
    expect(entry).toBe(untranslatedMeetup);
    // The flag is the whole point: the caller must be able to label it.
    expect(untranslated).toBe(true);
  });

  it('never reports a Spanish page as untranslated', async () => {
    const { untranslated } = await getMeetupBodyEntry(untranslatedMeetup, 'es');
    expect(untranslated).toBe(false);
  });

  it('returns raw markdown alongside the flag', async () => {
    const translated = await getMeetupBodyMarkdown(translatedMeetup, 'en');
    expect(translated).toEqual({
      body: 'English meetup body.',
      untranslated: false,
    });

    const fallback = await getMeetupBodyMarkdown(untranslatedMeetup, 'en');
    expect(fallback.untranslated).toBe(true);
    expect(fallback.body).toBe('Cuerpo en español sin traducir.');
  });

  it('matches a translation by id, not by position', async () => {
    // The sibling loader strips `.en`, so ids line up exactly. A near-miss id
    // must not silently pick up someone else's body.
    const nearMiss = {
      id: '2026-06-24_qa-pilar-del-software-2',
      body: 'Otro cuerpo.',
    } as never;
    const { untranslated } = await getMeetupBodyEntry(nearMiss, 'en');
    expect(untranslated).toBe(true);
  });
});

describe('vertical body selection', () => {
  const translated = {
    id: 'speaker-school',
    body: 'Cuerpo del programa.',
  } as never;
  const untranslated = {
    id: 'monthly-meetups',
    body: 'Cuerpo sin traducir.',
  } as never;

  it('reuses the meetup mechanism unchanged', async () => {
    const es = await getVerticalBodyEntry(translated, 'es');
    expect(es.entry).toBe(translated);
    expect(es.untranslated).toBe(false);

    const en = await getVerticalBodyEntry(translated, 'en');
    expect(en.entry.body).toBe('English program body.');
    expect(en.untranslated).toBe(false);
  });

  it('labels its fallback the same way', async () => {
    const { entry, untranslated: flagged } = await getVerticalBodyEntry(
      untranslated,
      'en'
    );
    expect(entry).toBe(untranslated);
    expect(flagged).toBe(true);
  });

  it('REGRESSION: a bodyless entry is not "untranslated"', async () => {
    // `monthly-meetups` is defined as YAML and has no body in either language.
    // Reporting it as untranslated rendered "showing the Spanish original"
    // above nothing at all — a notice for prose that does not exist.
    for (const body of [undefined, '', '   \n  ']) {
      const bodyless = { id: 'monthly-meetups', body } as never;
      const { untranslated: flagged } = await getVerticalBodyEntry(
        bodyless,
        'en'
      );
      expect(flagged, `body=${JSON.stringify(body)}`).toBe(false);
    }
  });
});
