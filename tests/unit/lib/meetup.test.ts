import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';

import {
  buildCallsForSpeakersBoard,
  buildOpenCallsForSpeakers,
  buildPastMeetupShowcase,
  buildUpcomingMeetupShowcase,
  getCallForSpeakersState,
  isCallForSpeakersOpen,
  resolveMeetupDateAttribute,
  resolveMeetupDateConfidence,
  resolveMeetupDateLabel,
  resolveMeetupLineup,
  resolveMeetupStatus,
  resolveMeetupVenueLine,
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
