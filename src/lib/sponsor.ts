import { type CollectionEntry, getCollection } from 'astro:content';

import { getCalendarYear, getTodayInSiteTimezone } from '@/lib/dates';
import {
  getMeetups,
  type Meetup,
  type MeetupLifecycleStatus,
  resolveMeetupStatus,
} from '@/lib/meetup';
import { getEditions, type PereiraTechDay } from '@/lib/pereiraTechDay';

export type Sponsor = CollectionEntry<'sponsors'>;

export type SponsorTier = Sponsor['data']['tier'];

const tierOrder: Record<Sponsor['data']['tier'], number> = {
  diamond: 0,
  gold: 1,
  silver: 2,
  bronze: 3,
  community: 4,
};

/** Singular, human-facing tier names. Plural section headings live in i18n. */
export const SPONSOR_TIER_LABELS: Record<
  SponsorTier,
  { en: string; es: string }
> = {
  diamond: { en: 'Diamond', es: 'Diamante' },
  gold: { en: 'Gold', es: 'Oro' },
  silver: { en: 'Silver', es: 'Plata' },
  bronze: { en: 'Bronze', es: 'Bronce' },
  community: { en: 'Community', es: 'Comunidad' },
};

const sortByTierThenOrder = (a: Sponsor, b: Sponsor): number => {
  const ta = tierOrder[a.data.tier];
  const tb = tierOrder[b.data.tier];
  if (ta !== tb) return ta - tb;
  return (a.data.order ?? 0) - (b.data.order ?? 0);
};

export const sortSponsors = (sponsors: Sponsor[]): Sponsor[] =>
  [...sponsors].sort(sortByTierThenOrder);

/** Community catalog sort — order then name (no tier grouping). */
export const sortSponsorsByOrder = (sponsors: Sponsor[]): Sponsor[] =>
  [...sponsors].sort((a, b) => {
    const oa = a.data.order ?? 0;
    const ob = b.data.order ?? 0;
    if (oa !== ob) return oa - ob;
    return a.data.name.localeCompare(b.data.name);
  });

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
  return sortSponsorsByOrder(filterSponsorsByStatus(all, 'active'));
};

export const getPastSponsors = async (): Promise<Sponsor[]> => {
  const all = await getSponsors();
  return sortSponsorsByOrder(filterSponsorsByStatus(all, 'past'));
};

export const getSponsorBySlug = async (
  slug: string
): Promise<Sponsor | undefined> => {
  const all = await getSponsors();
  return all.find((s) => s.id === slug);
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

/* ------------------------------------------------------------------ *
 * Sponsor activity — "which meetups did this partner back?"
 *
 * Source of truth is the *event* side (a meetup declares its sponsors), so a
 * sponsor's history is always derived, never hand-maintained on the sponsor
 * YAML. `sponsoredEditions` is only used as a fallback for Pereira Tech Day
 * years that have no entry in the `pereiraTechDays` collection yet.
 * ------------------------------------------------------------------ */

export interface SponsoredMeetup {
  meetup: Meetup;
  /** Tier declared by that meetup for this sponsor (may differ from default). */
  tier: SponsorTier;
  status: MeetupLifecycleStatus;
  upcoming: boolean;
  year: number;
}

export interface SponsoredEdition {
  year: number;
  tier: SponsorTier;
  /** Present when the year exists in the `pereiraTechDays` collection. */
  edition?: PereiraTechDay;
}

export interface SponsorActivity {
  /** All sponsored meetups, newest first. */
  meetups: SponsoredMeetup[];
  upcomingMeetups: SponsoredMeetup[];
  pastMeetups: SponsoredMeetup[];
  editions: SponsoredEdition[];
  meetupCount: number;
  editionCount: number;
  /** Distinct talks programmed across the sponsored meetups. */
  talkCount: number;
  /** Distinct speakers who took the stage at the sponsored meetups. */
  speakerCount: number;
  firstYear: number | null;
  lastYear: number | null;
  /** True when the partner has nothing linked yet (logo-only entry). */
  isEmpty: boolean;
}

export const EMPTY_SPONSOR_ACTIVITY: SponsorActivity = {
  meetups: [],
  upcomingMeetups: [],
  pastMeetups: [],
  editions: [],
  meetupCount: 0,
  editionCount: 0,
  talkCount: 0,
  speakerCount: 0,
  firstYear: null,
  lastYear: null,
  isEmpty: true,
};

/**
 * Pure builder — resolves everything a sponsor detail page needs from the
 * already-loaded meetup and edition collections.
 */
export const buildSponsorActivity = (
  sponsorSlug: string,
  meetups: Meetup[],
  editions: PereiraTechDay[],
  sponsoredEditions: Sponsor['data']['sponsoredEditions'] = [],
  todayInTz: string = getTodayInSiteTimezone()
): SponsorActivity => {
  const sponsored: SponsoredMeetup[] = [];
  const talks = new Set<string>();
  const speakers = new Set<string>();

  for (const meetup of meetups) {
    const ref = meetup.data.sponsors?.find((s) => s.slug === sponsorSlug);
    if (!ref) continue;
    const status = resolveMeetupStatus(meetup, todayInTz);
    sponsored.push({
      meetup,
      tier: ref.tier,
      status,
      upcoming: status === 'announced' || status === 'rsvp-open',
      year: getCalendarYear(meetup.data.date),
    });
    for (const talk of meetup.data.talks ?? []) talks.add(talk);
    for (const speaker of meetup.data.speakers ?? []) speakers.add(speaker);
  }

  sponsored.sort(
    (a, b) => b.meetup.data.date.getTime() - a.meetup.data.date.getTime()
  );

  // Editions: collection first (authoritative tier), then any orphan year
  // still declared on the sponsor YAML.
  const editionsByYear = new Map<number, SponsoredEdition>();
  for (const edition of editions) {
    const ref = edition.data.sponsors?.find((s) => s.slug === sponsorSlug);
    if (!ref) continue;
    editionsByYear.set(edition.data.year, {
      year: edition.data.year,
      tier: ref.tier,
      edition,
    });
  }
  for (const ref of sponsoredEditions) {
    if (editionsByYear.has(ref.year)) continue;
    editionsByYear.set(ref.year, { year: ref.year, tier: ref.tier });
  }
  const editionList = [...editionsByYear.values()].sort(
    (a, b) => b.year - a.year
  );

  const years = [
    ...sponsored.map((s) => s.year),
    ...editionList.map((e) => e.year),
  ];

  const upcomingMeetups = sponsored.filter((s) => s.upcoming);
  const pastMeetups = sponsored.filter((s) => !s.upcoming);

  return {
    meetups: sponsored,
    upcomingMeetups,
    pastMeetups,
    editions: editionList,
    meetupCount: sponsored.length,
    editionCount: editionList.length,
    talkCount: talks.size,
    speakerCount: speakers.size,
    firstYear: years.length > 0 ? Math.min(...years) : null,
    lastYear: years.length > 0 ? Math.max(...years) : null,
    isEmpty: sponsored.length === 0 && editionList.length === 0,
  };
};

/** Sponsored meetups for one sponsor slug, newest first. */
export const getMeetupsBySponsor = async (
  sponsorSlug: string
): Promise<SponsoredMeetup[]> => {
  const [meetups, editions] = await Promise.all([getMeetups(), getEditions()]);
  return buildSponsorActivity(sponsorSlug, meetups, editions).meetups;
};

export const getSponsorActivity = async (
  sponsor: Sponsor
): Promise<SponsorActivity> => {
  const [meetups, editions] = await Promise.all([getMeetups(), getEditions()]);
  return buildSponsorActivity(
    sponsor.id,
    meetups,
    editions,
    sponsor.data.sponsoredEditions
  );
};

/**
 * Activity for many sponsors in a single pass over the collections — used by
 * the `/sponsors` grid so each card can show its own counters.
 */
export const getSponsorActivityMap = async (
  sponsors: Sponsor[]
): Promise<Map<string, SponsorActivity>> => {
  const [meetups, editions] = await Promise.all([getMeetups(), getEditions()]);
  const today = getTodayInSiteTimezone();
  return new Map(
    sponsors.map((sponsor) => [
      sponsor.id,
      buildSponsorActivity(
        sponsor.id,
        meetups,
        editions,
        sponsor.data.sponsoredEditions,
        today
      ),
    ])
  );
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
    .filter((e): e is EditionSponsor & { index: number } => Boolean(e))
    .sort((a, b) => {
      const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
      if (tierDiff !== 0) return tierDiff;
      return a.index - b.index;
    })
    .map(({ sponsor, tier }) => ({ sponsor, tier }));
};
