import { describe, expect, it } from 'vitest';
import type { Speaker, SpeakerWithTalkStats } from '@/lib/speaker';
import { hasTakenTheStage, sortSpeakersByLatestTalk } from '@/lib/speaker';

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

/**
 * The directory shows people who have taken the stage, and its own copy says so
 * ("N ponentes han subido al escenario desde 2014").
 *
 * A postponed Pereira Tech Day used to feed its schedule into speaker recency,
 * which put three people at the top of the directory — ahead of everyone who
 * had actually spoken — on the strength of a future date for an event that was
 * called off. Two of them had never given a talk at all.
 *
 * `SpeakersPage.astro` applies this predicate; it lives here so the rule is
 * stated once and tested.
 */
describe('who belongs in the speakers directory', () => {
  const day = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

  it('includes anyone with a talk', () => {
    expect(hasTakenTheStage(entry('a', 'Ana', 9, day('2026-06-24')))).toBe(
      true
    );
  });

  it('includes someone whose only record is a date, not a counted talk', () => {
    // A meetup lists them as a speaker without a linked `talks` entry — common
    // in the archive, and they did speak.
    expect(hasTakenTheStage(entry('b', 'Beto', 0, day('2019-09-19')))).toBe(
      true
    );
  });

  it('excludes someone with no talk and no date', () => {
    // Exists only in a postponed edition's schedule: never took the stage.
    expect(hasTakenTheStage(entry('c', 'Carla', 0, null))).toBe(false);
  });

  it('lets someone in the moment they are linked to anything', () => {
    // Derived, not flagged — restoring the edition or linking a talk brings
    // them back with nothing to remember to undo.
    const pending = entry('d', 'Dani', 0, null);
    expect(hasTakenTheStage(pending)).toBe(false);
    expect(hasTakenTheStage({ ...pending, talkCount: 1 })).toBe(true);
    expect(
      hasTakenTheStage({ ...pending, latestTalkDate: day('2026-12-16') })
    ).toBe(true);
  });
});
