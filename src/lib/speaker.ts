import { type CollectionEntry, getCollection } from 'astro:content';

import { getMeetups } from '@/lib/meetup';
import { getTalks } from '@/lib/talk';

export type Speaker = CollectionEntry<'speakers'>;

export type SpeakerWithTalkStats = {
  speaker: Speaker;
  talkCount: number;
  latestTalkDate: Date | null;
};

const sortByName = (a: Speaker, b: Speaker): number =>
  a.data.name.localeCompare(b.data.name);

/**
 * Alphabetical speakers list. Prefer `getSpeakersSortedByLatestTalk` for the
 * public directory. Keep this for deterministic joins (getSpeakersBySlugs).
 */
export const getSpeakers = async (): Promise<Speaker[]> => {
  const all = await getCollection('speakers');
  return all.sort(sortByName);
};

export const getSpeakerBySlug = async (
  slug: string
): Promise<Speaker | undefined> => {
  const all = await getSpeakers();
  return all.find((s) => s.id === slug);
};

export const getSpeakersBySlugs = async (
  slugs: string[]
): Promise<Speaker[]> => {
  const all = await getSpeakers();
  return slugs
    .map((slug) => all.find((s) => s.id === slug))
    .filter((s): s is Speaker => Boolean(s));
};

/**
 * Pure sort for directory ordering:
 * 1. Speakers with activity first, by latestTalkDate descending
 * 2. Speakers without dates after, by name ascending
 * 3. Name ascending as tie-break when dates equal
 */
export const sortSpeakersByLatestTalk = (
  entries: SpeakerWithTalkStats[]
): SpeakerWithTalkStats[] => {
  return [...entries].sort((a, b) => {
    const aTime = a.latestTalkDate?.getTime() ?? null;
    const bTime = b.latestTalkDate?.getTime() ?? null;
    if (aTime !== null && bTime !== null && aTime !== bTime) {
      return bTime - aTime;
    }
    if (aTime !== null && bTime === null) return -1;
    if (aTime === null && bTime !== null) return 1;
    return a.speaker.data.name.localeCompare(b.speaker.data.name);
  });
};

type Stats = { talkCount: number; latestTalkDate: Date | null };

function bumpLatest(current: Stats, date: Date | null | undefined): void {
  if (
    date &&
    (!current.latestTalkDate ||
      date.getTime() > current.latestTalkDate.getTime())
  ) {
    current.latestTalkDate = date;
  }
}

/**
 * Enrich every speaker with talkCount + latestTalkDate, then sort.
 *
 * Activity date priority:
 * 1. Latest talk.data.date where the speaker is listed
 * 2. Else latest meetup.data.date where meetup.speakers includes the slug
 */
export const getSpeakersSortedByLatestTalk = async (): Promise<
  SpeakerWithTalkStats[]
> => {
  const [speakers, talks, meetups] = await Promise.all([
    getSpeakers(),
    getTalks(),
    getMeetups(),
  ]);

  const stats = new Map<string, Stats>();
  for (const speaker of speakers) {
    stats.set(speaker.id, { talkCount: 0, latestTalkDate: null });
  }

  for (const talk of talks) {
    const talkDate = talk.data.date ?? null;
    for (const slug of talk.data.speakers) {
      const current = stats.get(slug) ?? {
        talkCount: 0,
        latestTalkDate: null,
      };
      current.talkCount += 1;
      bumpLatest(current, talkDate);
      stats.set(slug, current);
    }
  }

  for (const meetup of meetups) {
    if (meetup.data.draft) continue;
    const meetupDate = meetup.data.date;
    for (const slug of meetup.data.speakers ?? []) {
      const current = stats.get(slug) ?? {
        talkCount: 0,
        latestTalkDate: null,
      };
      // Meetup date only fills gaps / updates when newer — never reduces talkCount
      bumpLatest(current, meetupDate);
      stats.set(slug, current);
    }
  }

  const enriched: SpeakerWithTalkStats[] = speakers.map((speaker) => {
    const s = stats.get(speaker.id) ?? {
      talkCount: 0,
      latestTalkDate: null,
    };
    return {
      speaker,
      talkCount: s.talkCount,
      latestTalkDate: s.latestTalkDate,
    };
  });

  return sortSpeakersByLatestTalk(enriched);
};
