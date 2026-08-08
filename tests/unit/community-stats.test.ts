import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/meetup', () => ({
  getMeetups: vi.fn(async () => [
    {
      data: {
        draft: false,
        date: new Date('2014-02-27'),
        talks: ['talk-a', 'talk-b'],
        speakers: ['speaker-a'],
      },
    },
    {
      data: {
        draft: false,
        date: new Date('2026-04-11'),
        talks: [],
        speakers: ['speaker-b', 'speaker-c', 'speaker-d'],
      },
    },
    {
      data: {
        draft: true,
        date: new Date('2026-01-01'),
        talks: ['ignored'],
        speakers: ['ignored'],
      },
    },
  ]),
}));
vi.mock('@/lib/talk', () => ({
  getTalks: vi.fn(async () => [
    { data: { event: { collection: 'meetups', slug: 'old' } } },
    { data: { event: { collection: 'pereiraTechDays', slug: '2025' } } },
    { data: { event: { collection: 'events', slug: 'workshop' } } },
  ]),
}));
vi.mock('@/lib/speaker', () => ({
  getSpeakers: vi.fn(async () => [{}, {}]),
}));
vi.mock('@/lib/pereiraTechDay', () => ({
  getEditions: vi.fn(async () => [{}]),
}));
vi.mock('@/lib/sponsor', () => ({
  getActiveSponsors: vi.fn(async () => [{}, {}]),
}));

import { getCommunityStats } from '@/lib/community-stats';

describe('getCommunityStats', () => {
  it('counts non-draft meetups and hybrid talk slots', async () => {
    const stats = await getCommunityStats();
    expect(stats.meetups).toBe(2);
    // Meetup slots: 2 (explicit talks) + 3 (speaker fallback) = 5
    // Non-meetup talks: PTD + events = 2
    expect(stats.talks).toBe(7);
    expect(stats.speakers).toBe(2);
    expect(stats.editions).toBe(1);
    expect(stats.sponsorsActive).toBe(2);
    expect(stats.sinceYear).toBe(2014);
    expect(stats.display.meetups).toBe('2');
    expect(stats.display.talks).toBe('7');
    expect(stats.display.speakers).toBe('2');
    expect(stats.display.attendees).toMatch(/6\.5K\+|6500|—/);
  });
});
