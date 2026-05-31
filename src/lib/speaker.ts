import { type CollectionEntry, getCollection } from 'astro:content';

export type Speaker = CollectionEntry<'speakers'>;

const sortByName = (a: Speaker, b: Speaker): number =>
  a.data.name.localeCompare(b.data.name);

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
