/**
 * Speaker activity and directory ordering.
 *
 * `getSpeakersSortedByLatestTalk` decides who appears where in the speaker
 * directory, and the talk count it computes feeds the meta description Task 10
 * composes for every speaker page. It sat at 35% coverage while spanning four
 * collections — talks, meetups, Pereira Tech Day agendas, and the legacy
 * keynote/lightning fields — each of which contributes activity differently.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 11.
 */
import { describe, expect, it, vi } from 'vitest';

const day = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

const speakerEntry = (id: string, name: string) => ({
  id,
  data: {
    name,
    role: { en: 'Engineer', es: 'Ingeniera' },
    bio: { en: 'Bio.', es: 'Bio.' },
    photo: { src: `/${id}.webp`, alt: {} },
    languages: ['es'],
  },
});

const SPEAKERS = [
  speakerEntry('zoe-recent', 'Zoe Recent'),
  speakerEntry('ana-older', 'Ana Older'),
  speakerEntry('bob-inactive', 'Bob Inactive'),
  speakerEntry('alma-inactive', 'Alma Inactive'),
  speakerEntry('ptd-only', 'PTD Only'),
];

const TALKS = [
  {
    id: 't1',
    data: {
      title: { en: 'Recent talk', es: 'Charla reciente' },
      abstract: { en: 'a', es: 'a' },
      speakers: ['zoe-recent'],
      duration: 25,
      type: 'talk',
      date: day('2026-01-01'),
    },
  },
  {
    id: 't2',
    data: {
      title: { en: 'Older talk', es: 'Charla antigua' },
      abstract: { en: 'a', es: 'a' },
      speakers: ['ana-older'],
      duration: 25,
      type: 'talk',
      date: day('2020-01-01'),
    },
  },
];

const MEETUPS = [
  {
    id: '2021-05-05_meetup',
    data: {
      title: { en: 'Meetup', es: 'Meetup' },
      description: { en: 'd', es: 'd' },
      date: day('2021-05-05'),
      venue: { name: 'UTP', city: 'Pereira', country: 'Colombia' },
      speakers: ['ana-older'],
      verticals: [],
      talks: [],
      sponsors: [],
      gallery: [],
      draft: false,
    },
  },
];

const EDITIONS = [
  {
    id: '2024',
    data: {
      year: 2024,
      title: { en: 'PTD 2024', es: 'PTD 2024' },
      tagline: { en: 't', es: 't' },
      description: { en: 'd', es: 'd' },
      date: day('2024-09-21'),
      venue: { name: 'UTP', city: 'Pereira', country: 'Colombia' },
      mode: 'in-person',
      hero: { src: '/h.webp', alt: {} },
      schedule: [
        // Unlinked session: the edition itself is the activity, so it counts.
        { time: '09:00', type: 'keynote', speaker: 'ptd-only' },
        // Linked to a `talks` entry, so only the date should bump.
        { time: '10:00', type: 'talk', speaker: 'zoe-recent', talkSlug: 't1' },
        // Not a session slot — a break has no speaker credit.
        { time: '11:00', type: 'break', speaker: 'bob-inactive' },
      ],
      keynotes: [],
      lightningTalks: [],
      sponsors: [],
      organizers: [],
      collaborators: [],
      aboutTopics: [],
      faqs: [],
      sponsorshipPlans: [],
      extraPartnerships: [],
      communities: [],
      gallery: [],
      status: 'completed',
      draft: false,
      scheduleTentative: false,
    },
  },
];

vi.mock('astro:content', () => ({
  getCollection: async (name: string) => {
    if (name === 'speakers') return SPEAKERS;
    if (name === 'talks') return TALKS;
    if (name === 'meetups') return MEETUPS;
    if (name === 'pereiraTechDays') return EDITIONS;
    return [];
  },
}));

const speaker = await import('@/lib/speaker');

describe('sortSpeakersByLatestTalk', () => {
  const withDate = (name: string, date: Date | null) => ({
    speaker: { id: name, data: { name } },
    talkCount: 1,
    latestTalkDate: date,
  });

  it('puts the most recent activity first', () => {
    const sorted = speaker.sortSpeakersByLatestTalk([
      withDate('old', day('2020-01-01')),
      withDate('new', day('2026-01-01')),
    ] as never);
    expect(sorted.map((s) => s.speaker.id)).toEqual(['new', 'old']);
  });

  it('puts speakers with no activity after those with any', () => {
    const sorted = speaker.sortSpeakersByLatestTalk([
      withDate('none', null),
      withDate('some', day('2020-01-01')),
    ] as never);
    expect(sorted.map((s) => s.speaker.id)).toEqual(['some', 'none']);
  });

  it('falls back to name order when neither has a date', () => {
    const sorted = speaker.sortSpeakersByLatestTalk([
      withDate('Zoe', null),
      withDate('Ana', null),
    ] as never);
    expect(sorted.map((s) => s.speaker.id)).toEqual(['Ana', 'Zoe']);
  });

  it('does not reorder the array it was given', () => {
    const input = [
      withDate('old', day('2020-01-01')),
      withDate('new', day('2026-01-01')),
    ] as never[];
    speaker.sortSpeakersByLatestTalk(input);
    expect(
      (input as Array<{ speaker: { id: string } }>).map((s) => s.speaker.id)
    ).toEqual(['old', 'new']);
  });
});

describe('getSpeakersSortedByLatestTalk', () => {
  it('counts a talk once per speaker', async () => {
    const all = await speaker.getSpeakersSortedByLatestTalk();
    const zoe = all.find((s) => s.speaker.id === 'zoe-recent');
    // One talk entry, plus a PTD slot linked to that same talk — the slot must
    // not double-count it.
    expect(zoe?.talkCount).toBe(1);
  });

  it('credits an unlinked Pereira Tech Day session as activity', async () => {
    const all = await speaker.getSpeakersSortedByLatestTalk();
    const ptdOnly = all.find((s) => s.speaker.id === 'ptd-only');
    expect(ptdOnly?.talkCount).toBe(1);
    expect(ptdOnly?.latestTalkDate).toEqual(day('2024-09-21'));
  });

  it('gives no credit for a non-session slot', async () => {
    const all = await speaker.getSpeakersSortedByLatestTalk();
    const bob = all.find((s) => s.speaker.id === 'bob-inactive');
    expect(bob?.talkCount).toBe(0);
    expect(bob?.latestTalkDate).toBeNull();
  });

  it('lets a meetup appearance set recency without inventing a talk', async () => {
    const all = await speaker.getSpeakersSortedByLatestTalk();
    const ana = all.find((s) => s.speaker.id === 'ana-older');
    expect(ana?.talkCount).toBe(1); // from the talk, not the meetup
    expect(ana?.latestTalkDate).toEqual(day('2021-05-05')); // the newer date wins
  });

  it('orders the directory by that activity', async () => {
    const ids = (await speaker.getSpeakersSortedByLatestTalk()).map(
      (s) => s.speaker.id
    );
    expect(ids).toEqual([
      'zoe-recent', // 2026
      'ptd-only', // 2024
      'ana-older', // 2021
      'alma-inactive', // no activity — alphabetical
      'bob-inactive',
    ]);
  });

  it('includes every speaker, even with no activity at all', async () => {
    const all = await speaker.getSpeakersSortedByLatestTalk();
    expect(all).toHaveLength(SPEAKERS.length);
  });
});

describe('speaker lookups', () => {
  it('lists alphabetically by name', async () => {
    expect((await speaker.getSpeakers()).map((s) => s.id)).toEqual([
      'alma-inactive',
      'ana-older',
      'bob-inactive',
      'ptd-only',
      'zoe-recent',
    ]);
  });

  it('finds one by slug', async () => {
    expect((await speaker.getSpeakerBySlug('ana-older'))?.id).toBe('ana-older');
    expect(await speaker.getSpeakerBySlug('nope')).toBeUndefined();
  });

  it('resolves slugs in the caller order and drops unknown ones', async () => {
    const resolved = await speaker.getSpeakersBySlugs([
      'zoe-recent',
      'nope',
      'ana-older',
    ]);
    expect(resolved.map((s) => s.id)).toEqual(['zoe-recent', 'ana-older']);
  });
});
