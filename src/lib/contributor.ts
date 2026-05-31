import { getCollection, type CollectionEntry } from 'astro:content';

export type Contributor = CollectionEntry<'contributors'>;
export type ContributorRole = Contributor['data']['roles'][number];

const sortByOrderThenName = (a: Contributor, b: Contributor): number => {
  const oa = a.data.order ?? 0;
  const ob = b.data.order ?? 0;
  if (oa !== ob) return oa - ob;
  return a.data.name.localeCompare(b.data.name);
};

export const getContributors = async (): Promise<Contributor[]> => {
  const all = await getCollection('contributors');
  return all.sort(sortByOrderThenName);
};

export const getActiveContributors = async (): Promise<Contributor[]> => {
  const all = await getContributors();
  return all.filter((c) => !c.data.inactiveSince);
};

export const getContributorsByRole = async (
  role: ContributorRole,
): Promise<Contributor[]> => {
  const all = await getActiveContributors();
  return all.filter((c) => c.data.roles.includes(role));
};

export const getContributorBySlug = async (
  slug: string,
): Promise<Contributor | undefined> => {
  const all = await getContributors();
  return all.find((c) => c.id === slug);
};

export const getOrganizers = async (): Promise<Contributor[]> => {
  const all = await getActiveContributors();
  return all.filter(
    (c) =>
      c.data.roles.includes('organizer') ||
      c.data.roles.includes('founding-organizer'),
  );
};
