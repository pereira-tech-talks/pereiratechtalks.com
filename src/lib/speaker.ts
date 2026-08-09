import { type CollectionEntry, getCollection } from 'astro:content';

import { getMeetups } from '@/lib/meetup';
import { getEditionStartDate, getEditions } from '@/lib/pereiraTechDay';
import { isSessionSlot } from '@/lib/ptdSchedule';
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
  // Sort a copy: `sort` mutates in place, and the array `getCollection`
  // returns is not ours to reorder.
  const all = await getCollection('speakers');
  return [...all].sort(sortByName);
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
 * 3. Else latest Pereira Tech Day date where the edition lists the slug
 *    (agenda session, keynote, or lightning talk) — a PTD is a special kind
 *    of meetup, so revealing a speaker there surfaces them in the directory.
 */
export const getSpeakersSortedByLatestTalk = async (): Promise<
  SpeakerWithTalkStats[]
> => {
  const [speakers, talks, meetups, editions] = await Promise.all([
    getSpeakers(),
    getTalks(),
    getMeetups(),
    getEditions(),
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

  for (const edition of editions) {
    const editionDate = getEditionStartDate(edition);

    const touch = (slug: string, countsAsTalk: boolean): void => {
      const current = stats.get(slug) ?? { talkCount: 0, latestTalkDate: null };
      if (countsAsTalk) current.talkCount += 1;
      bumpLatest(current, editionDate);
      stats.set(slug, current);
    };

    for (const slot of edition.data.schedule) {
      if (!slot.speaker || !isSessionSlot(slot.type)) continue;
      // A slot linked to a `talks` entry was already counted by the talks
      // loop — only let the edition date bump recency for it.
      touch(slot.speaker, !slot.talkSlug);
    }

    // Legacy fields: 2024's keynotes and lightning talks each have their own
    // `talks` entry, so these only fill in the date.
    for (const slug of edition.data.keynotes) {
      touch(slug, false);
    }
    for (const entry of edition.data.lightningTalks) {
      touch(typeof entry === 'string' ? entry : entry.speaker, false);
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
