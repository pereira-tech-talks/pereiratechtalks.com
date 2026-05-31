import { type CollectionEntry, getCollection } from 'astro:content';
import type { Language } from '@/lib/i18n';

export type Meetup = CollectionEntry<'meetups'>;

const filterDrafts = (entry: Meetup): boolean => {
  if (import.meta.env.PROD) return entry.data.draft !== true;
  return true;
};

const sortByDateDesc = (a: Meetup, b: Meetup): number =>
  b.data.date.getTime() - a.data.date.getTime();

const matchesLang = (entry: Meetup, lang: Language): boolean => {
  // Convention: meetups live under src/content/meetups/{en,es}/<slug>.md
  // The id starts with "en/" or "es/". The lang must match the prefix.
  const id = entry.id;
  return id.startsWith(`${lang}/`);
};

export const getMeetups = async (lang: Language): Promise<Meetup[]> => {
  const all = await getCollection('meetups');
  return all
    .filter(filterDrafts)
    .filter((e) => matchesLang(e, lang))
    .sort(sortByDateDesc);
};

export const getMeetupBySlug = async (
  slug: string,
  lang: Language
): Promise<Meetup | undefined> => {
  const entries = await getMeetups(lang);
  return entries.find(
    (e) => e.id === `${lang}/${slug}` || e.id.endsWith(`/${slug}`)
  );
};

export const getUpcomingMeetups = async (lang: Language): Promise<Meetup[]> => {
  const now = Date.now();
  const all = await getMeetups(lang);
  return all.filter((e) => e.data.date.getTime() >= now);
};

export const getPastMeetups = async (lang: Language): Promise<Meetup[]> => {
  const now = Date.now();
  const all = await getMeetups(lang);
  return all.filter((e) => e.data.date.getTime() < now);
};

export const getMeetupsByVertical = async (
  verticalSlug: string,
  lang: Language
): Promise<Meetup[]> => {
  const all = await getMeetups(lang);
  return all.filter((e) => e.data.verticals.includes(verticalSlug));
};

export const getMeetupsByYear = async (
  year: number,
  lang: Language
): Promise<Meetup[]> => {
  const all = await getMeetups(lang);
  return all.filter((e) => e.data.date.getFullYear() === year);
};
