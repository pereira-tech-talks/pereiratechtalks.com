import { type CollectionEntry, getCollection } from 'astro:content';
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
 * 1. Speakers with talks first, by latestTalkDate descending
 * 2. Speakers without talks after, by name ascending
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

/**
 * Enrich every speaker with talkCount + latestTalkDate from the talks
 * collection (membership via `talk.data.speakers`), then sort chronologically.
 */
export const getSpeakersSortedByLatestTalk = async (): Promise<
  SpeakerWithTalkStats[]
> => {
  const [speakers, talks] = await Promise.all([getSpeakers(), getTalks()]);

  const stats = new Map<
    string,
    { talkCount: number; latestTalkDate: Date | null }
  >();
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
      if (
        talkDate &&
        (!current.latestTalkDate ||
          talkDate.getTime() > current.latestTalkDate.getTime())
      ) {
        current.latestTalkDate = talkDate;
      }
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
