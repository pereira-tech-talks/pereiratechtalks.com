import { type CollectionEntry, getCollection } from 'astro:content';

export type Community = CollectionEntry<'communities'>;

const sortByOrderThenName = (a: Community, b: Community): number => {
  const oa = a.data.order ?? 0;
  const ob = b.data.order ?? 0;
  if (oa !== ob) return oa - ob;
  return a.data.name.localeCompare(b.data.name);
};

export const sortCommunities = (communities: Community[]): Community[] =>
  [...communities].sort(sortByOrderThenName);

export const filterActiveCommunities = (
  communities: Community[]
): Community[] => communities.filter((c) => c.data.status === 'active');

export const getCommunities = async (): Promise<Community[]> => {
  const all = await getCollection('communities');
  return sortCommunities(all);
};

export const getActiveCommunities = async (): Promise<Community[]> => {
  const all = await getCommunities();
  return filterActiveCommunities(all);
};
