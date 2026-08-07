import { type CollectionEntry, getCollection } from 'astro:content';

import {
  getCalendarYear,
  isCalendarDateBeforeToday,
  isCalendarDateOnOrAfterToday,
} from '@/lib/dates';
import type { Language } from '@/lib/i18n';

export type Meetup = CollectionEntry<'meetups'>;

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
  return entries.find((e) => e.id === slug || e.id.endsWith(`/${slug}`));
};

export const getUpcomingMeetups = async (): Promise<Meetup[]> => {
  const all = await getMeetups();
  return all
    .filter((e) => isCalendarDateOnOrAfterToday(e.data.date))
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
};

export const getPastMeetups = async (): Promise<Meetup[]> => {
  const all = await getMeetups();
  return all.filter((e) => isCalendarDateBeforeToday(e.data.date));
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
