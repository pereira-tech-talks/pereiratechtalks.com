import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';

import {
  buildCallsForSpeakersBoard,
  buildOpenCallsForSpeakers,
  buildPastMeetupShowcase,
  buildUpcomingMeetupShowcase,
  formatMeetupTalkCount,
  getCallForSpeakersState,
  isCallForSpeakersOpen,
  resolveEventAttendanceMode,
  resolveMeetupDateAttribute,
  resolveMeetupDateConfidence,
  resolveMeetupDateLabel,
  resolveMeetupLineup,
  resolveMeetupPlaceFallback,
  resolveMeetupStatus,
  resolveMeetupVenueLine,
  resolveSlidesGuidance,
} from '@/lib/meetup';
import { resolveEditionStatus } from '@/lib/pereiraTechDay';

type Meetup = CollectionEntry<'meetups'>;
type PereiraTechDay = CollectionEntry<'pereiraTechDays'>;

const TODAY = '2026-08-07';

function makeMeetup(
  id: string,
  date: string,
  status: Meetup['data']['status'] = 'announced'
): Meetup {
  return {
    id,
    collection: 'meetups',
    data: {
      title: { en: id, es: id },
      description: { en: id, es: id },
      pubDate: new Date(`${date}T00:00:00.000Z`),
      date: new Date(`${date}T00:00:00.000Z`),
      venue: { name: 'UTP', city: 'Pereira', country: 'Colombia' },
      mode: 'in-person',
      verticals: [],
      talks: [],
      speakers: [],
      sponsors: [],
      status,
      draft: false,
    },
  } as Meetup;
}

function makeEdition(
  year: number,
  date: string,
  status: PereiraTechDay['data']['status'] = 'rsvp-open'
): PereiraTechDay {
  return {
    id: String(year),
    collection: 'pereiraTechDays',
    data: {
      year,
      title: { en: `PTD ${year}`, es: `PTD ${year}` },
      tagline: { en: 'tagline', es: 'tagline' },
      description: { en: 'desc', es: 'desc' },
      date: new Date(`${date}T00:00:00.000Z`),
      venue: { name: 'UTP', city: 'Pereira', country: 'Colombia' },
      mode: 'in-person',
      hero: {
        src: '/images/pereira-tech-days/2026/mascot/hero.webp',
        alt: { en: 'hero', es: 'hero' },
        layout: 'banner',
      },
      brandKit: {
        paletteLight: {
          primary: '#000',
          accent: '#000',
          bg: '#fff',
          bgElevated: '#fff',
          text: '#000',
          textMuted: '#666',
        },
      },
      status,
      draft: false,
    },
  } as PereiraTechDay;
}

describe('resolveMeetupStatus', () => {
  it('marks past meetups as completed even when frontmatter says announced', () => {
    const meetup = makeMeetup('2026-06-24_qa', '2026-06-24', 'announced');
    expect(resolveMeetupStatus(meetup, TODAY)).toBe('completed');
  });

  it('marks future meetups as announced', () => {
    const meetup = makeMeetup('2026-09-01_future', '2026-09-01', 'announced');
    expect(resolveMeetupStatus(meetup, TODAY)).toBe('announced');
  });

  it('preserves cancelled status', () => {
    const meetup = makeMeetup(
      '2026-09-01_cancelled',
      '2026-09-01',
      'cancelled'
    );
    expect(resolveMeetupStatus(meetup, TODAY)).toBe('cancelled');
  });
});

describe('resolveEditionStatus', () => {
  it('marks upcoming PTD as rsvp-open before the event date', () => {
    const edition = makeEdition(2026, '2026-08-22', 'rsvp-open');
    expect(resolveEditionStatus(edition, TODAY)).toBe('rsvp-open');
  });

  it('marks past PTD as completed after the event date', () => {
    const edition = makeEdition(2024, '2024-08-22', 'completed');
    expect(resolveEditionStatus(edition, TODAY)).toBe('completed');
  });
});

describe('buildUpcomingMeetupShowcase', () => {
  it('includes Pereira Tech Day when no regular meetup exists that month', () => {
    const items = buildUpcomingMeetupShowcase(
      [makeMeetup('2026-06-24_qa', '2026-06-24', 'announced')],
      [makeEdition(2026, '2026-08-22', 'rsvp-open')],
      TODAY
    );

    expect(items).toHaveLength(1);
    expect(items[0]?.type).toBe('pereira-tech-day');
  });

  it('prefers a regular meetup over PTD in the same month', () => {
    const items = buildUpcomingMeetupShowcase(
      [makeMeetup('2026-08-12_special', '2026-08-12', 'announced')],
      [makeEdition(2026, '2026-08-22', 'rsvp-open')],
      TODAY
    );

    expect(items).toHaveLength(1);
    expect(items[0]?.type).toBe('meetup');
  });

  it('returns an empty list when nothing is upcoming', () => {
    const items = buildUpcomingMeetupShowcase(
      [makeMeetup('2026-06-24_qa', '2026-06-24', 'announced')],
      [makeEdition(2024, '2024-08-22', 'completed')],
      TODAY
    );

    expect(items).toHaveLength(0);
  });

  it('omits a postponed Pereira Tech Day from the upcoming showcase', () => {
    const items = buildUpcomingMeetupShowcase(
      [makeMeetup('2026-09-24_qa', '2026-09-24', 'announced')],
      [makeEdition(2026, '2026-08-22', 'postponed')],
      TODAY
    );

    expect(items).toHaveLength(1);
    expect(items[0]?.type).toBe('meetup');
    expect(items.some((item) => item.type === 'pereira-tech-day')).toBe(false);
  });
});

describe('buildPastMeetupShowcase', () => {
  it('includes completed Pereira Tech Day editions in the archive', () => {
    const items = buildPastMeetupShowcase(
      [
        makeMeetup('2024-10-30_ia', '2024-10-30', 'completed'),
        makeMeetup('2024-09-26_ml', '2024-09-26', 'completed'),
      ],
      [makeEdition(2024, '2024-09-21', 'completed')],
      new Set(),
      TODAY
    );

    expect(items.some((item) => item.type === 'pereira-tech-day')).toBe(true);
    expect(
      items.find((item) => item.type === 'pereira-tech-day')?.data.data.year
    ).toBe(2024);
  });

  it('sorts past meetups and PTD editions by date descending', () => {
    const items = buildPastMeetupShowcase(
      [makeMeetup('2024-09-26_ml', '2024-09-26', 'completed')],
      [makeEdition(2024, '2024-09-21', 'completed')],
      new Set(),
      TODAY
    );

    expect(items).toHaveLength(2);
    expect(items[0]?.type).toBe('meetup');
    expect(items[1]?.type).toBe('pereira-tech-day');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Programming: date confidence, lineup, and the call for speakers
// (PLAN_meetup_programming_and_call_for_speakers, Task 2)
// ────────────────────────────────────────────────────────────────────────────

type Programmed = {
  date: string;
  dateConfidence?: Meetup['data']['dateConfidence'];
  call?: Meetup['data']['callForSpeakers'];
  talks?: string[];
  speakers?: string[];
  venue?: Meetup['data']['venue'];
  hero?: Meetup['data']['hero'];
};

function makeProgrammed(id: string, opts: Programmed): Meetup {
  const base = makeMeetup(id, opts.date);
  return {
    ...base,
    data: {
      ...base.data,
      dateConfidence: opts.dateConfidence ?? 'confirmed',
      callForSpeakers: opts.call,
      talks: opts.talks ?? [],
      speakers: opts.speakers ?? [],
      venue: 'venue' in opts ? opts.venue : base.data.venue,
      hero: opts.hero,
    },
  } as Meetup;
}

const openCall = (
  over: Partial<NonNullable<Meetup['data']['callForSpeakers']>> = {}
): Meetup['data']['callForSpeakers'] =>
  ({
    status: 'open',
    formats: ['lightning'],
    ...over,
  }) as Meetup['data']['callForSpeakers'];

describe('resolveMeetupLineup', () => {
  it('is open when there are neither talks nor speakers', () => {
    expect(
      resolveMeetupLineup(makeProgrammed('m', { date: '2026-11-18' }))
    ).toBe('open');
  });

  it('is partial when speakers are confirmed but no talk entries exist yet', () => {
    // Speakers get confirmed before their talks are authored: a talk needs a
    // title, an abstract and a duration.
    expect(
      resolveMeetupLineup(
        makeProgrammed('m', { date: '2026-11-18', speakers: ['ana'] })
      )
    ).toBe('partial');
  });

  it('is confirmed as soon as one talk is published', () => {
    expect(
      resolveMeetupLineup(
        makeProgrammed('m', { date: '2026-11-18', talks: ['t1'] })
      )
    ).toBe('confirmed');
  });
});

describe('getCallForSpeakersState — the auto-close truth table', () => {
  it('is none when the meetup carries no call', () => {
    expect(
      getCallForSpeakersState(
        makeProgrammed('m', { date: '2026-11-18' }),
        TODAY
      )
    ).toBe('none');
  });

  it('is open for a future meetup with status open', () => {
    expect(
      getCallForSpeakersState(
        makeProgrammed('m', { date: '2026-11-18', call: openCall() }),
        TODAY
      )
    ).toBe('open');
  });

  it('CLOSES a stale open call once the meetup date has passed', () => {
    // The integrity rule: frontmatter still says open, every surface says
    // closed. A proposal must never be invited to an event that happened.
    const past = makeProgrammed('m', { date: '2026-01-10', call: openCall() });
    expect(past.data.callForSpeakers?.status).toBe('open');
    expect(getCallForSpeakersState(past, TODAY)).toBe('closed');
  });

  it('closes once closesAt has passed', () => {
    expect(
      getCallForSpeakersState(
        makeProgrammed('m', {
          date: '2026-11-18',
          call: openCall({ closesAt: new Date('2026-08-01T00:00:00.000Z') }),
        }),
        TODAY
      )
    ).toBe('closed');
  });

  it('still accepts on the closesAt day itself', () => {
    expect(
      getCallForSpeakersState(
        makeProgrammed('m', {
          date: '2026-11-18',
          call: openCall({ closesAt: new Date(`${TODAY}T00:00:00.000Z`) }),
        }),
        TODAY
      )
    ).toBe('open');
  });

  it('is scheduled before opensAt, whatever status says', () => {
    expect(
      getCallForSpeakersState(
        makeProgrammed('m', {
          date: '2026-11-18',
          call: openCall({ opensAt: new Date('2026-09-01T00:00:00.000Z') }),
        }),
        TODAY
      )
    ).toBe('scheduled');
  });

  it('is scheduled when status says so and no dates contradict it', () => {
    expect(
      getCallForSpeakersState(
        makeProgrammed('m', {
          date: '2026-11-18',
          call: openCall({ status: 'scheduled' }),
        }),
        TODAY
      )
    ).toBe('scheduled');
  });

  it('is closed when status says so on a future meetup', () => {
    expect(
      getCallForSpeakersState(
        makeProgrammed('m', {
          date: '2026-11-18',
          call: openCall({ status: 'closed' }),
        }),
        TODAY
      )
    ).toBe('closed');
  });

  it('isCallForSpeakersOpen agrees with the state in every case', () => {
    const cases: Meetup[] = [
      makeProgrammed('a', { date: '2026-11-18' }),
      makeProgrammed('b', { date: '2026-11-18', call: openCall() }),
      makeProgrammed('c', { date: '2026-01-10', call: openCall() }),
      makeProgrammed('d', {
        date: '2026-11-18',
        call: openCall({ status: 'scheduled' }),
      }),
    ];
    for (const m of cases) {
      expect(isCallForSpeakersOpen(m, TODAY)).toBe(
        getCallForSpeakersState(m, TODAY) === 'open'
      );
    }
  });
});

describe('buildOpenCallsForSpeakers', () => {
  it('keeps only open calls, nearest first, and carries their formats', () => {
    const calls = buildOpenCallsForSpeakers(
      [
        makeProgrammed('december', {
          date: '2026-12-16',
          call: openCall({ formats: ['workshop'] }),
        }),
        makeProgrammed('november', {
          date: '2026-11-18',
          call: openCall({ formats: ['lightning', 'regular'], slots: 3 }),
        }),
        makeProgrammed('no-call', { date: '2026-10-21' }),
        makeProgrammed('stale-past', { date: '2026-01-10', call: openCall() }),
      ],
      TODAY
    );

    expect(calls.map((c) => c.slug)).toEqual(['november', 'december']);
    expect(calls[0].formats).toEqual(['lightning', 'regular']);
    expect(calls[0].slots).toBe(3);
    expect(calls[0].url).toContain('/meetups/november/');
    expect(calls[1].slots).toBeUndefined();
  });

  it('carries both languages of the title so one manifest serves both', () => {
    const [call] = buildOpenCallsForSpeakers(
      [makeProgrammed('november', { date: '2026-11-18', call: openCall() })],
      TODAY
    );
    expect(call.title.es).toBe('november');
    expect(call.title.en).toBe('november');
  });
});

describe('date confidence', () => {
  it('defaults to confirmed and prints the day', () => {
    const m = makeProgrammed('m', { date: '2026-11-18' });
    expect(resolveMeetupDateConfidence(m)).toBe('confirmed');
    expect(resolveMeetupDateAttribute(m)).toBe('2026-11-18');
    expect(resolveMeetupDateLabel(m, 'en')).toContain('18');
  });

  it('still prints the day when tentative — the caveat is a separate chip', () => {
    const m = makeProgrammed('m', {
      date: '2026-11-18',
      dateConfidence: 'tentative',
    });
    expect(resolveMeetupDateAttribute(m)).toBe('2026-11-18');
    expect(resolveMeetupDateLabel(m, 'en')).toContain('18');
  });

  it('never prints a day when only the month is known', () => {
    const m = makeProgrammed('m', {
      date: '2026-11-18',
      dateConfidence: 'month-only',
    });
    expect(resolveMeetupDateAttribute(m)).toBe('2026-11');
    expect(resolveMeetupDateLabel(m, 'en')).toBe('November 2026');
    expect(resolveMeetupDateLabel(m, 'en')).not.toContain('18');
    expect(resolveMeetupDateLabel(m, 'es')).not.toContain('18');
    expect(resolveMeetupDateLabel(m, 'es').toLowerCase()).toContain(
      'noviembre'
    );
  });
});

describe('a meetup with no venue', () => {
  const noVenue = makeProgrammed('m', { date: '2026-11-18', venue: undefined });

  it('renders the localized "to be confirmed" line, never an empty value', () => {
    expect(resolveMeetupVenueLine(noVenue, 'es')).toBe('Sede por confirmar');
    expect(resolveMeetupVenueLine(noVenue, 'en')).toBe('Venue to be confirmed');
  });

  it('still renders a real address when the venue exists', () => {
    const withVenue = makeProgrammed('m', { date: '2026-11-18' });
    expect(resolveMeetupVenueLine(withVenue, 'es')).toBe('UTP, Pereira');
  });

  it('flows through the showcase builders untouched', () => {
    const upcoming = buildUpcomingMeetupShowcase([noVenue], [], TODAY);
    expect(upcoming).toHaveLength(1);
    const past = buildPastMeetupShowcase([noVenue], [], new Set(), TODAY);
    expect(past).toHaveLength(0);
  });
});

/**
 * Two lists, deliberately different. The board is what a reader sees; the open
 * list feeds `/api/cfs-open.json`, which the intake function validates
 * submissions against. If a scheduled call ever leaked into the open list, the
 * server would accept a proposal for a call that has not opened.
 */
describe('buildCallsForSpeakersBoard vs buildOpenCallsForSpeakers', () => {
  const meetups = () => [
    makeProgrammed('september', { date: '2026-09-23', call: openCall() }),
    makeProgrammed('december', {
      date: '2026-12-16',
      call: openCall({
        status: 'scheduled',
        opensAt: new Date('2026-10-15T00:00:00.000Z'),
      }),
    }),
    makeProgrammed('no-call', { date: '2026-11-18' }),
    makeProgrammed('past', { date: '2020-03-10', call: openCall() }),
  ];

  it('the board carries open AND scheduled calls, nearest first', () => {
    const board = buildCallsForSpeakersBoard(meetups(), TODAY);
    expect(board.map((c) => c.slug)).toEqual(['september', 'december']);
    expect(board.map((c) => c.state)).toEqual(['open', 'scheduled']);
  });

  it('the open list carries ONLY open calls — the server validates against it', () => {
    const open = buildOpenCallsForSpeakers(meetups(), TODAY);
    expect(open.map((c) => c.slug)).toEqual(['september']);
    expect(open.every((c) => c.state === 'open')).toBe(true);
  });

  it('neither list carries a meetup with no call, or one whose date has passed', () => {
    for (const list of [
      buildCallsForSpeakersBoard(meetups(), TODAY),
      buildOpenCallsForSpeakers(meetups(), TODAY),
    ]) {
      expect(list.map((c) => c.slug)).not.toContain('no-call');
      expect(list.map((c) => c.slug)).not.toContain('past');
    }
  });

  it('carries opensAt only on a scheduled call', () => {
    const board = buildCallsForSpeakersBoard(meetups(), TODAY);
    const [sept, dec] = board;
    expect(sept.opensAt).toBeUndefined();
    expect(dec.opensAt).toEqual(new Date('2026-10-15T00:00:00.000Z'));
  });

  it('carries the meetup flyer when it has one, and omits it when it does not', () => {
    const withHero = makeProgrammed('with-flyer', {
      date: '2026-09-23',
      call: openCall(),
      hero: {
        src: '/images/meetups/x/hero.webp',
        srcEn: '/images/meetups/x/hero.en.webp',
        alt: { es: 'Afiche', en: 'Flyer' },
      },
    });
    const [row] = buildCallsForSpeakersBoard([withHero], TODAY);
    expect(row.hero).toEqual({
      src: '/images/meetups/x/hero.webp',
      srcEn: '/images/meetups/x/hero.en.webp',
      alt: { es: 'Afiche', en: 'Flyer' },
    });

    const [bare] = buildCallsForSpeakersBoard(
      [makeProgrammed('bare', { date: '2026-09-23', call: openCall() })],
      TODAY
    );
    expect(bare.hero).toBeUndefined();
  });
});

/**
 * The four programmed months run online. `MeetupDetailPage` used to hardcode
 * `OfflineEventAttendanceMode` in its `Event` JSON-LD, so every one of them
 * told search engines it was an in-person event in Pereira — a wrong answer to
 * the single most practical question a reader has about a meetup.
 *
 * Found by the SEO/AEO audit (PLAN_branch_audit_and_pr Task 2), not by a gate:
 * `seo:check` asserts an `Event` block exists, never that it is truthful.
 */
describe('schema.org attendance mode', () => {
  it('sends an online meetup to OnlineEventAttendanceMode', () => {
    expect(resolveEventAttendanceMode('virtual')).toBe(
      'https://schema.org/OnlineEventAttendanceMode'
    );
  });

  it('sends a hybrid meetup to MixedEventAttendanceMode', () => {
    expect(resolveEventAttendanceMode('hybrid')).toBe(
      'https://schema.org/MixedEventAttendanceMode'
    );
  });

  it('sends an in-person meetup to OfflineEventAttendanceMode', () => {
    expect(resolveEventAttendanceMode('in-person')).toBe(
      'https://schema.org/OfflineEventAttendanceMode'
    );
  });

  it('says nothing at all when the mode is undecided', () => {
    // `mode` is optional: a month can be programmed long before anyone decides
    // between a room and a stream. schema.org has no way to express "we do not
    // know", so the page omits the property rather than guessing — guessing is
    // exactly the bug this function was written to fix.
    expect(resolveEventAttendanceMode(undefined)).toBeNull();
  });
});

/**
 * Page and twin used to disagree on the same row. `MeetupCard` hid the talk
 * count at zero; `meetups.md.ts` printed "0 charlas" for every programmed
 * month — an answer engine reads that as a meetup with nothing on, which is
 * the opposite of what an open call is trying to say.
 *
 * Found by the AEO half of PLAN_branch_audit_and_pr Task 2. `md:check`
 * compares sections, not the fields inside a row, so it saw nothing.
 */
describe('meetup talk count', () => {
  it('says nothing at all when there are no talks', () => {
    expect(formatMeetupTalkCount(0, 'es')).toBeNull();
    expect(formatMeetupTalkCount(0, 'en')).toBeNull();
  });

  it('is singular at one', () => {
    expect(formatMeetupTalkCount(1, 'es')).toBe('1 charla');
    expect(formatMeetupTalkCount(1, 'en')).toBe('1 talk');
  });

  it('is plural above one', () => {
    expect(formatMeetupTalkCount(3, 'es')).toBe('3 charlas');
    expect(formatMeetupTalkCount(3, 'en')).toBe('3 talks');
  });

  it('treats a negative count as nothing rather than rendering it', () => {
    expect(formatMeetupTalkCount(-1, 'es')).toBeNull();
  });
});

/**
 * A month gets a date long before anyone decides whether it runs in a room or
 * on a stream. `mode` is therefore **optional**, the same way `venue` is, and
 * absent means "not decided yet" rather than "in person".
 *
 * Three absences that read alike and mean different things:
 *
 * - online — there will never be a venue;
 * - undecided — nobody has chosen between a room and a stream;
 * - in person / hybrid — a venue is coming, it just is not booked.
 *
 * Added when October–December 2026 lost their `mode`
 * (`feat/meetups-open-formats-and-mode-tbd`).
 */
describe('what to print where a venue would go', () => {
  const withMode = (mode: 'in-person' | 'virtual' | 'hybrid' | undefined) =>
    ({
      data: { ...(mode ? { mode } : {}) },
    }) as unknown as Parameters<typeof resolveMeetupPlaceFallback>[0];

  it('says Virtual for an online meetup, not "venue to be confirmed"', () => {
    expect(resolveMeetupPlaceFallback(withMode('virtual'), 'es')).toBe(
      'Virtual'
    );
    expect(resolveMeetupPlaceFallback(withMode('virtual'), 'en')).toBe(
      'Online'
    );
  });

  it('says the mode is unconfirmed when nobody has decided', () => {
    // Not "Sede por confirmar" — that promises a room, and there may not be
    // one. Not "Virtual" either. The honest third answer.
    expect(resolveMeetupPlaceFallback(withMode(undefined), 'es')).toBe(
      'Modalidad por confirmar'
    );
    expect(resolveMeetupPlaceFallback(withMode(undefined), 'en')).toBe(
      'Mode to be confirmed'
    );
  });

  it('still promises a venue for in-person and hybrid', () => {
    // A hybrid meetup does need a room, so it keeps the venue line.
    for (const mode of ['in-person', 'hybrid'] as const) {
      expect(resolveMeetupPlaceFallback(withMode(mode), 'es')).toBe(
        'Sede por confirmar'
      );
    }
  });

  it('gives the three absences three different sentences', () => {
    const seen = new Set(
      [undefined, 'virtual', 'in-person'].map((m) =>
        resolveMeetupPlaceFallback(
          withMode(m as 'virtual' | 'in-person' | undefined),
          'es'
        )
      )
    );
    expect(seen.size).toBe(3);
  });
});

/**
 * "You have very few minutes, no time for a live demo" is good advice for a
 * lightning-only night and plainly wrong for one that also takes 25-minute
 * talks — it told speakers to cut material the format has room for.
 *
 * October–December 2026 opened to full talks and kept showing the short-talk
 * advice, on the meetup panel, the global page and the agent twin, because all
 * three read one fixed paragraph. They now read this.
 */
describe('slides guidance follows the accepted formats', () => {
  it('gives the short-talk advice when only lightning is accepted', () => {
    const { paragraphs } = resolveSlidesGuidance(['lightning'], 'es');
    expect(paragraphs[0]).toContain('muy pocos minutos');
    expect(paragraphs[1]).toContain('No hay tiempo para demos en vivo');
  });

  it('switches advice as soon as a long format is accepted', () => {
    const { paragraphs } = resolveSlidesGuidance(
      ['lightning', 'regular'],
      'es'
    );
    expect(paragraphs[0]).not.toContain('muy pocos minutos');
    expect(paragraphs[0]).toContain('charla completa');
    // The live-demo rule stops being absolute: it applies to lightning only.
    expect(paragraphs[1]).toContain('En formato completo sí caben');
  });

  it('treats an empty list as the global page, which takes every format', () => {
    const global = resolveSlidesGuidance([], 'en');
    const mixed = resolveSlidesGuidance(['regular'], 'en');
    expect(global.paragraphs).toEqual(mixed.paragraphs);
  });

  it('carries the same title either way, and two paragraphs', () => {
    for (const formats of [['lightning'], ['lightning', 'regular'], []]) {
      const g = resolveSlidesGuidance(formats, 'en');
      expect(g.title).toBe('About your slides');
      expect(g.paragraphs).toHaveLength(2);
      for (const p of g.paragraphs) expect(p.trim().length).toBeGreaterThan(40);
    }
  });

  it('answers in the reader’s language', () => {
    expect(resolveSlidesGuidance(['workshop'], 'es').title).toBe(
      'Sobre las diapositivas'
    );
    expect(resolveSlidesGuidance(['workshop'], 'en').title).toBe(
      'About your slides'
    );
  });
});
