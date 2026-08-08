import { describe, expect, it } from 'vitest';

import type { Meetup } from '@/lib/meetup';
import type { PereiraTechDay } from '@/lib/pereiraTechDay';
import type { Sponsor } from '@/lib/sponsor';
import {
  buildSponsorActivity,
  filterSponsorsByStatus,
  sortSponsors,
  sortSponsorsByOrder,
} from '@/lib/sponsor';

const makeSponsor = (
  id: string,
  overrides: Partial<Sponsor['data']> = {}
): Sponsor =>
  ({
    id,
    collection: 'sponsors',
    data: {
      name: id,
      logo: { light: '/logo.png', dark: '/logo.png', alt: id },
      url: 'https://example.com',
      description: { en: 'desc', es: 'desc' },
      tier: 'gold',
      sponsoredEditions: [],
      status: 'active',
      order: 0,
      ...overrides,
    },
  }) as Sponsor;

describe('sponsor helpers', () => {
  it('sorts sponsors by tier then order (PTD path)', () => {
    const sponsors = sortSponsors([
      makeSponsor('silver', { tier: 'silver', order: 1 }),
      makeSponsor('gold', { tier: 'gold', order: 5 }),
      makeSponsor('gold-first', { tier: 'gold', order: 0 }),
    ]);

    expect(sponsors.map((s) => s.id)).toEqual(['gold-first', 'gold', 'silver']);
  });

  it('sorts community catalog by order then name', () => {
    const sponsors = sortSponsorsByOrder([
      makeSponsor('zeta', { order: 2, name: 'Zeta', tier: 'diamond' }),
      makeSponsor('alpha', { order: 1, name: 'Alpha', tier: 'bronze' }),
      makeSponsor('beta', { order: 1, name: 'Beta', tier: 'diamond' }),
    ]);

    expect(sponsors.map((s) => s.id)).toEqual(['alpha', 'beta', 'zeta']);
  });

  it('filters sponsors by status without overlap', () => {
    const sponsors = [
      makeSponsor('active-one', { status: 'active' }),
      makeSponsor('past-one', { status: 'past' }),
    ];

    const active = filterSponsorsByStatus(sponsors, 'active');
    const past = filterSponsorsByStatus(sponsors, 'past');

    expect(active.map((s) => s.id)).toEqual(['active-one']);
    expect(past.map((s) => s.id)).toEqual(['past-one']);
  });
});

const TODAY = '2026-08-08';

const makeMeetup = (
  id: string,
  date: string,
  sponsors: { slug: string; tier: Sponsor['data']['tier'] }[],
  extra: { talks?: string[]; speakers?: string[]; status?: string } = {}
): Meetup =>
  ({
    id,
    collection: 'meetups',
    data: {
      title: { en: id, es: id },
      description: { en: id, es: id },
      date: new Date(`${date}T00:00:00Z`),
      sponsors,
      talks: extra.talks ?? [],
      speakers: extra.speakers ?? [],
      status: extra.status ?? 'announced',
      draft: false,
    },
  }) as unknown as Meetup;

const makeEdition = (
  year: number,
  sponsors: { slug: string; tier: Sponsor['data']['tier'] }[]
): PereiraTechDay =>
  ({
    id: String(year),
    collection: 'pereiraTechDays',
    data: { year, sponsors },
  }) as unknown as PereiraTechDay;

describe('buildSponsorActivity', () => {
  const meetups = [
    makeMeetup(
      '2024-03-20_alpha',
      '2024-03-20',
      [{ slug: 'dailybot', tier: 'community' }],
      { talks: ['talk-a'], speakers: ['ana'] }
    ),
    makeMeetup(
      '2025-04-24_beta',
      '2025-04-24',
      [
        { slug: 'dailybot', tier: 'community' },
        { slug: 'ase-utp', tier: 'community' },
      ],
      { talks: ['talk-b'], speakers: ['ana', 'luis'] }
    ),
    makeMeetup(
      '2026-11-19_gamma',
      '2026-11-19',
      [{ slug: 'dailybot', tier: 'gold' }],
      { talks: ['talk-c'], speakers: ['sofia'] }
    ),
    makeMeetup('2025-07-10_delta', '2025-07-10', [], {}),
  ];
  const editions = [
    makeEdition(2024, [{ slug: 'dailybot', tier: 'silver' }]),
    makeEdition(2026, [{ slug: 'ase-utp', tier: 'gold' }]),
  ];

  it('collects sponsored meetups newest first and splits upcoming from past', () => {
    const activity = buildSponsorActivity(
      'dailybot',
      meetups,
      editions,
      [],
      TODAY
    );

    expect(activity.meetups.map((m) => m.meetup.id)).toEqual([
      '2026-11-19_gamma',
      '2025-04-24_beta',
      '2024-03-20_alpha',
    ]);
    expect(activity.upcomingMeetups.map((m) => m.meetup.id)).toEqual([
      '2026-11-19_gamma',
    ]);
    expect(activity.pastMeetups.map((m) => m.meetup.id)).toEqual([
      '2025-04-24_beta',
      '2024-03-20_alpha',
    ]);
  });

  it('keeps the per-meetup tier instead of the sponsor default', () => {
    const activity = buildSponsorActivity(
      'dailybot',
      meetups,
      editions,
      [],
      TODAY
    );

    expect(activity.meetups[0].tier).toBe('gold');
    expect(activity.meetups[1].tier).toBe('community');
  });

  it('counts distinct talks and speakers across sponsored meetups', () => {
    const activity = buildSponsorActivity(
      'dailybot',
      meetups,
      editions,
      [],
      TODAY
    );

    expect(activity.meetupCount).toBe(3);
    expect(activity.talkCount).toBe(3);
    // ana appears twice — deduplicated.
    expect(activity.speakerCount).toBe(3);
  });

  it('derives the year range from meetups and editions combined', () => {
    const activity = buildSponsorActivity(
      'ase-utp',
      meetups,
      editions,
      [],
      TODAY
    );

    expect(activity.firstYear).toBe(2025);
    expect(activity.lastYear).toBe(2026);
  });

  it('prefers the edition collection tier and backfills orphan years from the sponsor entry', () => {
    const activity = buildSponsorActivity(
      'dailybot',
      meetups,
      editions,
      [
        { year: 2024, tier: 'bronze' },
        { year: 2019, tier: 'gold' },
      ],
      TODAY
    );

    expect(activity.editions.map((e) => [e.year, e.tier])).toEqual([
      [2024, 'silver'],
      [2019, 'gold'],
    ]);
    expect(activity.editions[0].edition).toBeDefined();
    expect(activity.editions[1].edition).toBeUndefined();
  });

  it('reports an empty activity for logo-only partners', () => {
    const activity = buildSponsorActivity(
      'unknown-partner',
      meetups,
      editions,
      [],
      TODAY
    );

    expect(activity.isEmpty).toBe(true);
    expect(activity.meetupCount).toBe(0);
    expect(activity.firstYear).toBeNull();
  });
});
