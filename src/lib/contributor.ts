import { type CollectionEntry, getCollection } from 'astro:content';

export type Contributor = CollectionEntry<'contributors'>;
export type ContributorRole = Contributor['data']['roles'][number];

const sortByOrderThenName = (a: Contributor, b: Contributor): number => {
  const oa = a.data.order ?? 0;
  const ob = b.data.order ?? 0;
  if (oa !== ob) return oa - ob;
  return a.data.name.localeCompare(b.data.name);
};

export const sortContributors = (contributors: Contributor[]): Contributor[] =>
  [...contributors].sort(sortByOrderThenName);

export const filterActiveContributors = (
  contributors: Contributor[]
): Contributor[] => contributors.filter((c) => !c.data.inactiveSince);

export const filterPastContributors = (
  contributors: Contributor[]
): Contributor[] => contributors.filter((c) => Boolean(c.data.inactiveSince));

export const getContributors = async (): Promise<Contributor[]> => {
  const all = await getCollection('contributors');
  return sortContributors(all);
};

export const getActiveContributors = async (): Promise<Contributor[]> => {
  const all = await getContributors();
  return filterActiveContributors(all);
};

export const getPastContributors = async (): Promise<Contributor[]> => {
  const all = await getContributors();
  return filterPastContributors(all);
};

export const getContributorsByRole = async (
  role: ContributorRole
): Promise<Contributor[]> => {
  const all = await getActiveContributors();
  return all.filter((c) => c.data.roles.includes(role));
};

export const getContributorBySlug = async (
  slug: string
): Promise<Contributor | undefined> => {
  const all = await getContributors();
  return all.find((c) => c.id === slug);
};

/**
 * Resolve a list of contributor slugs, preserving the caller's order (e.g. the
 * `organizers` array on a Pereira Tech Day edition). Unknown slugs are dropped
 * rather than rendered as raw text.
 */
export const getContributorsBySlugs = async (
  slugs: string[]
): Promise<Contributor[]> => {
  const all = await getContributors();
  return slugs
    .map((slug) => all.find((c) => c.id === slug))
    .filter((c): c is Contributor => Boolean(c));
};

export const getOrganizers = async (): Promise<Contributor[]> => {
  const all = await getActiveContributors();
  return all.filter(
    (c) =>
      c.data.roles.includes('organizer') ||
      c.data.roles.includes('founding-organizer')
  );
};

/** Active organizers for the Equipo page (flat current-team grid). */
export const filterCurrentTeamOrganizers = (
  contributors: Contributor[]
): Contributor[] =>
  sortContributors(
    filterActiveContributors(contributors).filter(
      (c) =>
        c.data.roles.includes('organizer') ||
        c.data.roles.includes('founding-organizer')
    )
  );

/** Past / alumni members for the unified Equipo past section. */
export const filterPastTeamMembers = (
  contributors: Contributor[]
): Contributor[] => sortContributors(filterPastContributors(contributors));

export const getCurrentTeamOrganizers = async (): Promise<Contributor[]> => {
  const all = await getContributors();
  return filterCurrentTeamOrganizers(all);
};

export const getPastTeamMembers = async (): Promise<Contributor[]> => {
  const all = await getContributors();
  return filterPastTeamMembers(all);
};
