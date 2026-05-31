import { getCollection, type CollectionEntry } from 'astro:content';

export type Event = CollectionEntry<'events'>;

const filterDrafts = (entry: Event): boolean => {
  if (import.meta.env.PROD) return entry.data.draft !== true;
  return true;
};

const sortByDateAsc = (a: Event, b: Event): number =>
  a.data.date.getTime() - b.data.date.getTime();

const sortByDateDesc = (a: Event, b: Event): number =>
  b.data.date.getTime() - a.data.date.getTime();

export const getEvents = async (): Promise<Event[]> => {
  const all = await getCollection('events');
  return all.filter(filterDrafts).sort(sortByDateAsc);
};

export const getEventBySlug = async (slug: string): Promise<Event | undefined> => {
  const all = await getEvents();
  return all.find((e) => e.id === slug);
};

export const getUpcomingEvents = async (): Promise<Event[]> => {
  const now = Date.now();
  const all = await getEvents();
  return all.filter((e) => e.data.date.getTime() >= now);
};

export const getPastEvents = async (): Promise<Event[]> => {
  const now = Date.now();
  const all = await getEvents();
  return all.filter((e) => e.data.date.getTime() < now).sort(sortByDateDesc);
};

export const getEventsByType = async (type: Event['data']['type']): Promise<Event[]> => {
  const all = await getEvents();
  return all.filter((e) => e.data.type === type);
};
