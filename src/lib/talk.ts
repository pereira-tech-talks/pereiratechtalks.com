import { type CollectionEntry, getCollection } from 'astro:content';

export type Talk = CollectionEntry<'talks'>;

const sortByDateDesc = (a: Talk, b: Talk): number => {
  const at = a.data.date?.getTime() ?? 0;
  const bt = b.data.date?.getTime() ?? 0;
  return bt - at;
};

export const getTalks = async (): Promise<Talk[]> => {
  const all = await getCollection('talks');
  return all.sort(sortByDateDesc);
};

export const getTalkBySlug = async (
  slug: string
): Promise<Talk | undefined> => {
  const all = await getTalks();
  return all.find((t) => t.id === slug);
};

export const getTalksBySpeaker = async (
  speakerSlug: string
): Promise<Talk[]> => {
  const all = await getTalks();
  return all.filter((t) => t.data.speakers.includes(speakerSlug));
};

export const getTalksByEvent = async (
  collection: 'meetups' | 'events' | 'pereiraTechDays',
  slug: string
): Promise<Talk[]> => {
  const all = await getTalks();
  return all.filter(
    (t) => t.data.event?.collection === collection && t.data.event.slug === slug
  );
};
