import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/meetup', () => ({
  getMeetups: vi.fn(async () => [
    { data: { draft: false, date: new Date('2014-02-27') } },
    { data: { draft: false, date: new Date('2026-04-11') } },
    { data: { draft: true, date: new Date('2026-01-01') } },
  ]),
}));
vi.mock('@/lib/talk', () => ({
  getTalks: vi.fn(async () => [{}, {}, {}]),
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
  it('counts non-draft meetups and other collections', async () => {
    const stats = await getCommunityStats();
    expect(stats.meetups).toBe(2);
    expect(stats.talks).toBe(3);
    expect(stats.speakers).toBe(2);
    expect(stats.editions).toBe(1);
    expect(stats.sponsorsActive).toBe(2);
    expect(stats.sinceYear).toBe(2014);
    expect(stats.display.meetups).toBe('2');
    expect(stats.display.attendees).toMatch(/6\.5K\+|6500|—/);
  });
});
