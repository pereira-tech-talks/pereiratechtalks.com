import { describe, expect, it, vi } from 'vitest';

vi.mock('astro:content', () => ({
  getCollection: vi.fn(async () => [
    {
      id: 'ptd-2024--1-web-apps-ai-future',
      data: {
        speakers: ['vanessa-aristizabal'],
        event: { collection: 'pereiraTechDays', slug: '2024' },
        date: new Date('2024-09-21'),
      },
    },
    {
      id: 'conversatorio-hackathon--1-que-es-una-hackathon',
      data: {
        speakers: ['sergio-estrella'],
        event: { collection: 'meetups', slug: 'conversatorio-hackathon' },
        date: new Date('2025-10-29'),
      },
    },
  ]),
}));

import { getTalksByEvent, getTalksBySpeaker } from '@/lib/talk';

describe('talk event linkage', () => {
  it('resolves PTD and meetup talks by event', async () => {
    const ptd = await getTalksByEvent('pereiraTechDays', '2024');
    expect(ptd.map((t) => t.id)).toContain('ptd-2024--1-web-apps-ai-future');
    const meetup = await getTalksByEvent('meetups', 'conversatorio-hackathon');
    expect(meetup).toHaveLength(1);
  });

  it('resolves talks by speaker slug', async () => {
    const talks = await getTalksBySpeaker('sergio-estrella');
    expect(talks).toHaveLength(1);
  });
});
