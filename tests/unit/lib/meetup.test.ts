import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';

import {
  buildPastMeetupShowcase,
  buildUpcomingMeetupShowcase,
  resolveMeetupStatus,
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
