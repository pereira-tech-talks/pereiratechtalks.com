import { describe, expect, it } from 'vitest';
import type { Speaker, SpeakerWithTalkStats } from '@/lib/speaker';
import { sortSpeakersByLatestTalk } from '@/lib/speaker';

const makeSpeaker = (id: string, name: string): Speaker =>
  ({
    id,
    collection: 'speakers',
    data: {
      name,
      role: { en: 'Engineer', es: 'Ingeniero' },
      bio: { en: 'Bio', es: 'Bio' },
      photo: { src: '/x.webp', alt: { en: name, es: name } },
      talks: [],
    },
  }) as Speaker;

const entry = (
  id: string,
  name: string,
  talkCount: number,
  latestTalkDate: Date | null
): SpeakerWithTalkStats => ({
  speaker: makeSpeaker(id, name),
  talkCount,
  latestTalkDate,
});

describe('sortSpeakersByLatestTalk', () => {
  it('orders by latest talk date descending', () => {
    const sorted = sortSpeakersByLatestTalk([
      entry('a', 'Ana', 1, new Date('2024-01-01')),
      entry('b', 'Bea', 2, new Date('2026-06-01')),
      entry('c', 'Carla', 1, new Date('2025-03-01')),
    ]);
    expect(sorted.map((e) => e.speaker.id)).toEqual(['b', 'c', 'a']);
  });

  it('places speakers without talks after those with talks', () => {
    const sorted = sortSpeakersByLatestTalk([
      entry('z', 'Zoe', 0, null),
      entry('a', 'Ana', 1, new Date('2024-01-01')),
      entry('m', 'Mia', 0, null),
    ]);
    expect(sorted.map((e) => e.speaker.id)).toEqual(['a', 'm', 'z']);
  });

  it('uses name as stable tie-break for equal dates', () => {
    const date = new Date('2025-05-01');
    const sorted = sortSpeakersByLatestTalk([
      entry('b', 'Bea', 1, date),
      entry('a', 'Ana', 1, date),
    ]);
    expect(sorted.map((e) => e.speaker.id)).toEqual(['a', 'b']);
  });
});
