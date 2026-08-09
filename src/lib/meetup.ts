import { type CollectionEntry, getCollection } from 'astro:content';

import {
  getCalendarYear,
  getCalendarYearMonth,
  getTodayInSiteTimezone,
  isCalendarDateBeforeToday,
  isCalendarDateOnOrAfterToday,
} from '@/lib/dates';
import type { Language } from '@/lib/i18n';
import {
  getEditionStartDate,
  getEditions,
  isUpcomingEdition,
  type PereiraTechDay,
} from '@/lib/pereiraTechDay';

export type Meetup = CollectionEntry<'meetups'>;

export type MeetupLifecycleStatus =
  | 'announced'
  | 'rsvp-open'
  | 'completed'
  | 'cancelled';

export type MeetupShowcaseItem =
  | { type: 'meetup'; data: Meetup }
  | { type: 'pereira-tech-day'; data: PereiraTechDay };

const filterDrafts = (entry: Meetup): boolean => {
  if (import.meta.env.PROD) return entry.data.draft !== true;
  return true;
};

const sortByDateDesc = (a: Meetup, b: Meetup): number =>
  b.data.date.getTime() - a.data.date.getTime();

/**
 * Get all meetups (bilingual i18n collection — same entry serves both
 * languages via `tr()` on title/description fields).
 */
export const getMeetups = async (_lang?: Language): Promise<Meetup[]> => {
  const all = await getCollection('meetups');
  return all.filter(filterDrafts).sort(sortByDateDesc);
};

export const getMeetupBySlug = async (
  slug: string
): Promise<Meetup | undefined> => {
  const entries = await getMeetups();
  return entries.find(
    (e) =>
      e.id === slug ||
      e.id.endsWith(`/${slug}`) ||
      // Ids carry a `YYYY-MM-DD_` prefix; callers hold the URL slug.
      e.id.replace(/^\d{4}-\d{2}-\d{2}_/, '') === slug
  );
};

/** Derive próximamente/pasado from the calendar date (SITE_TIMEZONE), not stale frontmatter. */
export const resolveMeetupStatus = (
  meetup: Meetup,
  todayInTz: string = getTodayInSiteTimezone()
): MeetupLifecycleStatus => {
  if (meetup.data.status === 'cancelled') return 'cancelled';
  if (!isCalendarDateOnOrAfterToday(meetup.data.date, todayInTz)) {
    return 'completed';
  }
  if (meetup.data.status === 'rsvp-open') return 'rsvp-open';
  return 'announced';
};

const getShowcaseItemDate = (item: MeetupShowcaseItem): Date =>
  item.type === 'meetup' ? item.data.data.date : getEditionStartDate(item.data);

/**
 * Upcoming meetups plus the flagship Pereira Tech Day when it stands in for
 * the monthly meetup of its calendar month (e.g. August 2026).
 */
export const buildUpcomingMeetupShowcase = (
  meetups: Meetup[],
  editions: PereiraTechDay[],
  todayInTz: string = getTodayInSiteTimezone()
): MeetupShowcaseItem[] => {
  const upcomingMeetups = meetups
    .filter((m) => isCalendarDateOnOrAfterToday(m.data.date, todayInTz))
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());

  const items: MeetupShowcaseItem[] = upcomingMeetups.map((meetup) => ({
    type: 'meetup',
    data: meetup,
  }));

  const flagship = editions.find(
    (edition) =>
      isUpcomingEdition(edition) &&
      isCalendarDateOnOrAfterToday(getEditionStartDate(edition), todayInTz)
  );

  if (flagship) {
    const flagshipMonth = getCalendarYearMonth(getEditionStartDate(flagship));
    const hasRegularMeetupSameMonth = upcomingMeetups.some(
      (meetup) => getCalendarYearMonth(meetup.data.date) === flagshipMonth
    );

    if (!hasRegularMeetupSameMonth) {
      items.push({ type: 'pereira-tech-day', data: flagship });
    }
  }

  return items.sort(
    (a, b) =>
      getShowcaseItemDate(a).getTime() - getShowcaseItemDate(b).getTime()
  );
};

export const getUpcomingMeetupShowcase = async (): Promise<
  MeetupShowcaseItem[]
> => {
  const [meetups, editions] = await Promise.all([getMeetups(), getEditions()]);
  return buildUpcomingMeetupShowcase(meetups, editions);
};

export const getUpcomingMeetups = async (): Promise<Meetup[]> => {
  const showcase = await getUpcomingMeetupShowcase();
  return showcase
    .filter(
      (item): item is { type: 'meetup'; data: Meetup } => item.type === 'meetup'
    )
    .map((item) => item.data);
};

/**
 * Past meetups plus completed Pereira Tech Day editions in the archive timeline.
 */
export const buildPastMeetupShowcase = (
  meetups: Meetup[],
  editions: PereiraTechDay[],
  upcomingMeetupIds: Set<string>,
  todayInTz: string = getTodayInSiteTimezone()
): MeetupShowcaseItem[] => {
  const pastMeetups: MeetupShowcaseItem[] = meetups
    .filter(
      (m) =>
        !upcomingMeetupIds.has(m.id) &&
        isCalendarDateBeforeToday(m.data.date, todayInTz)
    )
    .map((meetup) => ({ type: 'meetup', data: meetup }));

  const pastEditions: MeetupShowcaseItem[] = editions
    .filter((edition) =>
      isCalendarDateBeforeToday(getEditionStartDate(edition), todayInTz)
    )
    .map((edition) => ({ type: 'pereira-tech-day', data: edition }));

  return [...pastMeetups, ...pastEditions].sort(
    (a, b) =>
      getShowcaseItemDate(b).getTime() - getShowcaseItemDate(a).getTime()
  );
};

export const getPastMeetupShowcase = async (): Promise<
  MeetupShowcaseItem[]
> => {
  const [meetups, editions, upcoming] = await Promise.all([
    getMeetups(),
    getEditions(),
    getUpcomingMeetupShowcase(),
  ]);
  const upcomingMeetupIds = new Set(
    upcoming
      .filter((item) => item.type === 'meetup')
      .map((item) => item.data.id)
  );
  return buildPastMeetupShowcase(meetups, editions, upcomingMeetupIds);
};

/**
 * Full timeline: upcoming (including the flagship Pereira Tech Day) followed
 * by the archive, newest first. Powers the single "all meetups" list — an
 * edition is a meetup like any other, so it shares the grid, the year rail,
 * and the status badge.
 */
export const buildAllMeetupShowcase = (
  upcoming: MeetupShowcaseItem[],
  past: MeetupShowcaseItem[]
): MeetupShowcaseItem[] =>
  [...upcoming, ...past].sort(
    (a, b) =>
      getShowcaseItemDate(b).getTime() - getShowcaseItemDate(a).getTime()
  );

export const getAllMeetupShowcase = async (): Promise<MeetupShowcaseItem[]> => {
  const [upcoming, past] = await Promise.all([
    getUpcomingMeetupShowcase(),
    getPastMeetupShowcase(),
  ]);
  return buildAllMeetupShowcase(upcoming, past);
};

export const getPastMeetups = async (): Promise<Meetup[]> => {
  const showcase = await getPastMeetupShowcase();
  return showcase
    .filter(
      (item): item is { type: 'meetup'; data: Meetup } => item.type === 'meetup'
    )
    .map((item) => item.data);
};

export const getMeetupsByVertical = async (
  verticalSlug: string
): Promise<Meetup[]> => {
  const all = await getMeetups();
  return all.filter((e) => e.data.verticals.includes(verticalSlug));
};

export const getMeetupsByYear = async (year: number): Promise<Meetup[]> => {
  const all = await getMeetups();
  return all.filter((e) => getCalendarYear(e.data.date) === year);
};

/**
 * Get the slug portion of a meetup entry (strips the YYYY-MM-DD_ prefix).
 */
export const getMeetupSlug = (entry: Meetup): string =>
  entry.id.replace(/^\d{4}-\d{2}-\d{2}_/, '');

/**
 * Group meetups by year (descending) → array of { year, meetups }.
 */
export const groupMeetupsByYear = (
  meetups: Meetup[]
): { year: number; meetups: Meetup[] }[] => {
  const byYear = new Map<number, Meetup[]>();
  for (const m of meetups) {
    const y = getCalendarYear(m.data.date);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)?.push(m);
  }
  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, meetups]) => ({ year, meetups }));
};

/** Group showcase items by calendar year (descending). */
export const groupMeetupShowcaseByYear = (
  items: MeetupShowcaseItem[]
): { year: number; items: MeetupShowcaseItem[] }[] => {
  const byYear = new Map<number, MeetupShowcaseItem[]>();
  for (const item of items) {
    const y = getCalendarYear(getShowcaseItemDate(item));
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)?.push(item);
  }
  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }));
};

/**
 * Which body a meetup page should render, for a given language.
 *
 * A meetup keeps its Spanish body in the entry itself and its English body in a
 * `{slug}.en.md` sibling. When the English translation does not exist yet the
 * page falls back to the Spanish body — but the caller must label it, because a
 * silent fallback is the defect this whole mechanism replaces.
 *
 * See `analysis_results/BILINGUAL_BODY_DECISION.md` in
 * PLAN_sitewide_language_seo_aeo_audit.
 */
export interface MeetupBodySelection {
  /** The entry whose body to render — the translation, or the meetup itself. */
  entry: Meetup | CollectionEntry<'meetupBodiesEn'>;
  /** True when English was requested and no translation exists. */
  untranslated: boolean;
}

export const getMeetupBodyEntry = async (
  meetup: Meetup,
  lang: Language
): Promise<MeetupBodySelection> => {
  if (lang !== 'en') {
    return { entry: meetup, untranslated: false };
  }

  const translations = await getCollection('meetupBodiesEn');
  const translated = translations.find((entry) => entry.id === meetup.id);

  return translated
    ? { entry: translated, untranslated: false }
    : { entry: meetup, untranslated: true };
};

/** Raw English body for a meetup, or null when it has not been translated. */
export const getMeetupBodyMarkdown = async (
  meetup: Meetup,
  lang: Language
): Promise<{ body: string; untranslated: boolean }> => {
  const { entry, untranslated } = await getMeetupBodyEntry(meetup, lang);
  return { body: entry.body ?? '', untranslated };
};
