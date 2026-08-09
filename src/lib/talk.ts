import { type CollectionEntry, getCollection } from 'astro:content';

export type Talk = CollectionEntry<'talks'>;

const sortByDateDesc = (a: Talk, b: Talk): number => {
  const at = a.data.date?.getTime() ?? 0;
  const bt = b.data.date?.getTime() ?? 0;
  return bt - at;
};

export const getTalks = async (): Promise<Talk[]> => {
  const all = await getCollection('talks');
  return [...all].sort(sortByDateDesc);
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
  return all.filter((t) => {
    if (t.data.event?.collection !== collection) return false;
    const eventSlug = t.data.event.slug;
    // Match either exact id, or slug stripped of date prefix.
    return (
      eventSlug === slug ||
      slug.endsWith(`/${eventSlug}`) ||
      slug.replace(/^\d{4}-\d{2}-\d{2}_/, '') === eventSlug
    );
  });
};
