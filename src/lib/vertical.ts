import { getCollection, type CollectionEntry } from 'astro:content';

export type Vertical = CollectionEntry<'verticals'>;

const sortByOrder = (a: Vertical, b: Vertical): number =>
  (a.data.order ?? 0) - (b.data.order ?? 0);

export const getVerticals = async (): Promise<Vertical[]> => {
  const all = await getCollection('verticals');
  return all.sort(sortByOrder);
};

export const getActiveVerticals = async (): Promise<Vertical[]> => {
  const all = await getVerticals();
  return all.filter((v) => v.data.status === 'active');
};

export const getVerticalBySlug = async (slug: string): Promise<Vertical | undefined> => {
  const all = await getVerticals();
  return all.find((v) => v.id === slug);
};
