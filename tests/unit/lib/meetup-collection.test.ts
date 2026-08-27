/**
 * The collection-reading half of `src/lib/meetup.ts`.
 *
 * `meetup.test.ts` covers the pure builders by handing them arrays. These are
 * the `async` wrappers that read the collection — `getMeetups`,
 * `getOpenCallsForSpeakers`, `getUpcomingMeetupShowcase` and friends — which
 * carry real logic of their own: draft filtering, sort order, the id/slug
 * relationship, and the union with Pereira Tech Day editions.
 *
 * Part of PLAN_meetup_programming_and_call_for_speakers Task 11.
 */
import { describe, expect, it, vi } from 'vitest';

const day = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

const base = {
  pubDate: day('2026-01-01'),
  mode: 'in-person' as const,
  verticals: ['monthly-meetups'],
  talks: [] as string[],
  speakers: [] as string[],
  sponsors: [],
  gallery: [],
  status: 'announced' as const,
  draft: false,
  dateConfidence: 'confirmed' as const,
};

const MEETUPS = [
  {
    id: 'septiembre-2026',
    body: 'es',
    data: {
      ...base,
      title: { en: 'September', es: 'Septiembre' },
      description: { en: 'd', es: 'd' },
      date: day('2099-09-23'),
      callForSpeakers: {
        status: 'open',
        formats: ['lightning'],
        closesAt: day('2099-09-09'),
        slots: 3,
        note: { en: 'Only lightning.', es: 'Solo relámpago.' },
      },
    },
  },
  {
    id: 'octubre-2026',
    body: 'es',
    data: {
      ...base,
      title: { en: 'October', es: 'Octubre' },
      description: { en: 'd', es: 'd' },
      date: day('2099-10-21'),
      dateConfidence: 'tentative' as const,
      callForSpeakers: { status: 'open', formats: ['regular', 'panel'] },
    },
  },
  {
    id: 'sin-convocatoria',
    body: 'es',
    data: {
      ...base,
      title: { en: 'No call', es: 'Sin convocatoria' },
      description: { en: 'd', es: 'd' },
      date: day('2099-11-18'),
    },
  },
  {
    id: 'pasado-con-open-rancio',
    body: 'es',
    data: {
      ...base,
      title: { en: 'Past', es: 'Pasado' },
      description: { en: 'd', es: 'd' },
      date: day('2020-03-10'),
      // A stale `open` on a meetup that already happened.
      callForSpeakers: { status: 'open', formats: ['lightning'] },
    },
  },
  {
    id: 'borrador',
    body: 'es',
    data: {
      ...base,
      title: { en: 'Draft', es: 'Borrador' },
      description: { en: 'd', es: 'd' },
      date: day('2099-12-16'),
      draft: true,
      callForSpeakers: { status: 'open', formats: ['workshop'] },
    },
  },
];

vi.mock('astro:content', () => ({
  getCollection: async (name: string) => (name === 'meetups' ? MEETUPS : []),
}));

const {
  formatOpenCallDate,
  getMeetupBySlug,
  getMeetups,
  getMeetupsByVertical,
  getMeetupsByYear,
  getOpenCallsForSpeakers,
  getPastMeetups,
  getUpcomingMeetups,
  groupMeetupsByYear,
} = await import('@/lib/meetup');

const TODAY = '2026-08-27';

describe('getMeetups', () => {
  it('returns every entry newest first', async () => {
    const all = await getMeetups();
    const dates = all.map((m) => m.data.date.getTime());
    expect([...dates].sort((a, b) => b - a)).toEqual(dates);
  });

  it('keeps drafts outside production, so authors can preview them', async () => {
    // import.meta.env.PROD is false under vitest.
    const all = await getMeetups();
    expect(all.map((m) => m.id)).toContain('borrador');
  });
});

describe('getMeetupBySlug', () => {
  it('finds an entry by its bare slug', async () => {
    expect((await getMeetupBySlug('octubre-2026'))?.id).toBe('octubre-2026');
  });

  it('returns undefined rather than throwing for an unknown slug', async () => {
    expect(await getMeetupBySlug('no-existe')).toBeUndefined();
  });
});

describe('getOpenCallsForSpeakers', () => {
  it('lists open calls nearest first', async () => {
    const calls = await getOpenCallsForSpeakers(TODAY);
    // `borrador` is a draft. `filterDrafts` in getMeetups() drops drafts only
    // when import.meta.env.PROD, which is false under vitest — so it is present
    // here, and absent from the published /api/cfs-open.json. That is the
    // intended preview behavior, asserted below rather than assumed.
    expect(calls.map((c) => c.slug)).toEqual([
      'septiembre-2026',
      'octubre-2026',
      'borrador',
    ]);
  });

  it('orders strictly by meetup date, so the soonest deadline reads first', async () => {
    const dates = (await getOpenCallsForSpeakers(TODAY)).map((c) =>
      c.date.getTime()
    );
    expect([...dates].sort((a, b) => a - b)).toEqual(dates);
  });

  it('excludes a meetup with no call, and one whose date has passed', async () => {
    const slugs = (await getOpenCallsForSpeakers(TODAY)).map((c) => c.slug);
    expect(slugs).not.toContain('sin-convocatoria');
    // The auto-close rule: its frontmatter still says `open`.
    expect(slugs).not.toContain('pasado-con-open-rancio');
  });

  it('carries both titles, the formats, the deadline, the slots and the note', async () => {
    const [first] = await getOpenCallsForSpeakers(TODAY);
    expect(first.title).toEqual({ en: 'September', es: 'Septiembre' });
    expect(first.formats).toEqual(['lightning']);
    expect(first.closesAt).toEqual(day('2099-09-09'));
    expect(first.slots).toBe(3);
    expect(first.note).toEqual({
      en: 'Only lightning.',
      es: 'Solo relámpago.',
    });
    expect(first.url).toBe(
      'https://pereiratechtalks.org/meetups/septiembre-2026/'
    );
  });

  it('omits optional fields rather than emitting undefined values', async () => {
    const october = (await getOpenCallsForSpeakers(TODAY))[1];
    expect(october.closesAt).toBeUndefined();
    expect(october.slots).toBeUndefined();
    expect(october.note).toBeUndefined();
  });
});

describe('formatOpenCallDate', () => {
  it('prints the day for a confirmed or tentative call', () => {
    const call = {
      date: day('2026-11-18'),
      dateConfidence: 'confirmed' as const,
    };
    expect(formatOpenCallDate(call, 'en')).toContain('18');
    expect(
      formatOpenCallDate({ ...call, dateConfidence: 'tentative' }, 'en')
    ).toContain('18');
  });

  it('prints the month alone when only the month is fixed', () => {
    const call = {
      date: day('2026-11-18'),
      dateConfidence: 'month-only' as const,
    };
    expect(formatOpenCallDate(call, 'en')).toBe('November 2026');
    expect(formatOpenCallDate(call, 'en')).not.toContain('18');
    expect(formatOpenCallDate(call, 'es').toLowerCase()).toContain('noviembre');
  });
});

describe('upcoming / past splits', () => {
  it('puts future meetups in upcoming and past ones in the archive', async () => {
    const upcoming = (await getUpcomingMeetups()).map((m) => m.id);
    const past = (await getPastMeetups()).map((m) => m.id);
    expect(upcoming).toContain('septiembre-2026');
    expect(past).toContain('pasado-con-open-rancio');
    // No entry may appear in both.
    expect(upcoming.filter((id) => past.includes(id))).toEqual([]);
  });
});

describe('grouping helpers', () => {
  it('filters by vertical', async () => {
    expect(await getMeetupsByVertical('monthly-meetups')).not.toHaveLength(0);
    expect(await getMeetupsByVertical('speaker-school')).toHaveLength(0);
  });

  it('filters by calendar year', async () => {
    const y2020 = await getMeetupsByYear(2020);
    expect(y2020.map((m) => m.id)).toEqual(['pasado-con-open-rancio']);
  });

  it('groups by year, newest year first', async () => {
    const groups = groupMeetupsByYear(await getMeetups());
    const years = groups.map((g) => g.year);
    expect([...years].sort((a, b) => b - a)).toEqual(years);
    expect(years).toContain(2020);
  });
});
