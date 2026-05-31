import { getCollection, type CollectionEntry } from 'astro:content';

export type Sponsor = CollectionEntry<'sponsors'>;

const tierOrder: Record<Sponsor['data']['tier'], number> = {
  diamond: 0,
  gold: 1,
  silver: 2,
  bronze: 3,
  community: 4,
};

const sortByTierThenOrder = (a: Sponsor, b: Sponsor): number => {
  const ta = tierOrder[a.data.tier];
  const tb = tierOrder[b.data.tier];
  if (ta !== tb) return ta - tb;
  return (a.data.order ?? 0) - (b.data.order ?? 0);
};

export const getSponsors = async (): Promise<Sponsor[]> => {
  const all = await getCollection('sponsors');
  return all.sort(sortByTierThenOrder);
};

export const getActiveSponsors = async (): Promise<Sponsor[]> => {
  const all = await getSponsors();
  return all.filter((s) => s.data.status === 'active');
};

export const getSponsorsByTier = async (
  tier: Sponsor['data']['tier'],
): Promise<Sponsor[]> => {
  const all = await getSponsors();
  return all.filter((s) => s.data.tier === tier);
};

export const getSponsorsByEdition = async (year: number): Promise<Sponsor[]> => {
  const all = await getSponsors();
  return all
    .filter((s) => s.data.sponsoredEditions.some((e) => e.year === year))
    .sort(sortByTierThenOrder);
};
