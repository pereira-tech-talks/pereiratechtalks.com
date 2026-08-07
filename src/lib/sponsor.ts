import { type CollectionEntry, getCollection } from 'astro:content';

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

export const sortSponsors = (sponsors: Sponsor[]): Sponsor[] =>
  [...sponsors].sort(sortByTierThenOrder);

export const filterSponsorsByStatus = (
  sponsors: Sponsor[],
  status: Sponsor['data']['status']
): Sponsor[] => sponsors.filter((s) => s.data.status === status);

export const getSponsors = async (): Promise<Sponsor[]> => {
  const all = await getCollection('sponsors');
  return sortSponsors(all);
};

export const getActiveSponsors = async (): Promise<Sponsor[]> => {
  const all = await getSponsors();
  return filterSponsorsByStatus(all, 'active');
};

export const getPastSponsors = async (): Promise<Sponsor[]> => {
  const all = await getSponsors();
  return filterSponsorsByStatus(all, 'past');
};

export const getSponsorsByTier = async (
  tier: Sponsor['data']['tier']
): Promise<Sponsor[]> => {
  const all = await getSponsors();
  return all.filter((s) => s.data.tier === tier);
};

export const getSponsorsByEdition = async (
  year: number
): Promise<Sponsor[]> => {
  const all = await getSponsors();
  return all
    .filter((s) => s.data.sponsoredEditions.some((e) => e.year === year))
    .sort(sortByTierThenOrder);
};

export interface EditionSponsor {
  sponsor: Sponsor;
  /** Tier for THIS edition, which may differ from the sponsor's default tier. */
  tier: Sponsor['data']['tier'];
}

/**
 * Resolve the `sponsors` refs declared on a Pereira Tech Day edition, keeping
 * the per-edition tier rather than the sponsor's own default. Sorted by tier
 * (diamond first), preserving declaration order within the same tier.
 */
export const getEditionSponsors = async (
  refs: { slug: string; tier: Sponsor['data']['tier'] }[]
): Promise<EditionSponsor[]> => {
  const all = await getSponsors();
  return refs
    .map((ref, index) => {
      const sponsor = all.find((s) => s.id === ref.slug);
      return sponsor ? { sponsor, tier: ref.tier, index } : undefined;
    })
    .filter(
      (e): e is EditionSponsor & { index: number } => Boolean(e)
    )
    .sort((a, b) => {
      const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
      if (tierDiff !== 0) return tierDiff;
      return a.index - b.index;
    })
    .map(({ sponsor, tier }) => ({ sponsor, tier }));
};
