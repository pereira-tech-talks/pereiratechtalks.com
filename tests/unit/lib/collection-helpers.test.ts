/**
 * The small collection helpers the audit tooling depends on.
 *
 * `channel.ts`, `event.ts` and `vertical.ts` had **zero** coverage: every
 * function is `getCollection`-backed, and `tests/mocks/astro-content.ts`
 * declares those out of scope. They are not out of scope in practice — the
 * collection is mockable, as `blog-tags.test.ts` already shows — and Task 7's
 * serializers read all three, so a silent change in their filtering or ordering
 * would reshape the `.md` twins.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 11.
 */
import { describe, expect, it, vi } from 'vitest';

const CHANNELS = [
  {
    id: 'linkedin',
    data: {
      name: 'LinkedIn',
      platform: 'linkedin',
      isPrimary: false,
      order: 3,
    },
  },
  {
    id: 'luma',
    data: { name: 'Luma', platform: 'luma', isPrimary: true, order: 1 },
  },
  {
    id: 'github',
    data: { name: 'GitHub', platform: 'github', isPrimary: false, order: 2 },
  },
];

const day = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

const EVENTS = [
  {
    id: 'past-workshop',
    data: { date: day('2020-01-01'), type: 'workshop', draft: false },
  },
  {
    id: 'future-hackathon',
    data: { date: day('2099-01-01'), type: 'hackathon', draft: false },
  },
  {
    id: 'mid-workshop',
    data: { date: day('2050-01-01'), type: 'workshop', draft: false },
  },
];

const VERTICALS = [
  { id: 'ai-channel', data: { status: 'active', order: 3 } },
  { id: 'speaker-school', data: { status: 'active', order: 1 } },
  { id: 'retired-program', data: { status: 'archived', order: 2 } },
];

vi.mock('astro:content', () => ({
  getCollection: async (name: string) => {
    if (name === 'channels') return CHANNELS;
    if (name === 'events') return EVENTS;
    if (name === 'verticals') return VERTICALS;
    return [];
  },
}));

const { getChannels, getPrimaryChannels, getChannelsByPlatform } = await import(
  '@/lib/channel'
);
const {
  getEvents,
  getEventBySlug,
  getUpcomingEvents,
  getPastEvents,
  getEventsByType,
} = await import('@/lib/event');
const { getVerticals, getActiveVerticals, getVerticalBySlug } = await import(
  '@/lib/vertical'
);

describe('channels', () => {
  it('sorts by declared order, not by id', async () => {
    expect((await getChannels()).map((c) => c.id)).toEqual([
      'luma',
      'github',
      'linkedin',
    ]);
  });

  it('isolates the primary channel', async () => {
    const primary = await getPrimaryChannels();
    expect(primary.map((c) => c.id)).toEqual(['luma']);
  });

  it('filters by platform', async () => {
    expect((await getChannelsByPlatform('github')).map((c) => c.id)).toEqual([
      'github',
    ]);
    expect(await getChannelsByPlatform('discord')).toEqual([]);
  });
});

describe('events', () => {
  it('lists chronologically, soonest first', async () => {
    expect((await getEvents()).map((e) => e.id)).toEqual([
      'past-workshop',
      'mid-workshop',
      'future-hackathon',
    ]);
  });

  it('finds one by slug and returns undefined for an unknown one', async () => {
    expect((await getEventBySlug('mid-workshop'))?.id).toBe('mid-workshop');
    expect(await getEventBySlug('nope')).toBeUndefined();
  });

  it('splits upcoming from past around today', async () => {
    const upcoming = (await getUpcomingEvents()).map((e) => e.id);
    const past = (await getPastEvents()).map((e) => e.id);
    expect(upcoming).toContain('future-hackathon');
    expect(past).toContain('past-workshop');
    expect(upcoming).not.toContain('past-workshop');
  });

  it('returns past events newest first — the reverse of the index order', async () => {
    const past = await getPastEvents();
    for (let i = 1; i < past.length; i += 1) {
      expect(past[i - 1].data.date.getTime()).toBeGreaterThanOrEqual(
        past[i].data.date.getTime()
      );
    }
  });

  it('filters by type', async () => {
    expect((await getEventsByType('workshop')).map((e) => e.id)).toEqual([
      'past-workshop',
      'mid-workshop',
    ]);
  });
});

describe('verticals', () => {
  it('sorts by declared order', async () => {
    expect((await getVerticals()).map((v) => v.id)).toEqual([
      'speaker-school',
      'retired-program',
      'ai-channel',
    ]);
  });

  it('excludes archived programs from the active list', async () => {
    const active = (await getActiveVerticals()).map((v) => v.id);
    expect(active).toEqual(['speaker-school', 'ai-channel']);
    expect(active).not.toContain('retired-program');
  });

  it('finds one by slug', async () => {
    expect((await getVerticalBySlug('ai-channel'))?.id).toBe('ai-channel');
    expect(await getVerticalBySlug('nope')).toBeUndefined();
  });
});
