import { type CollectionEntry, getCollection } from 'astro:content';

import { SITE_URL } from '@/lib/constances';
import {
  formatCalendarDate,
  formatCalendarMonth,
  getCalendarDateString,
  getCalendarYear,
  getCalendarYearMonth,
  getTodayInSiteTimezone,
  isCalendarDateBeforeToday,
  isCalendarDateOnOrAfterToday,
} from '@/lib/dates';
import { type Language, tr } from '@/lib/i18n';
import {
  getEditionStartDate,
  getEditions,
  isPostponedEdition,
  isUpcomingEdition,
  type PereiraTechDay,
} from '@/lib/pereiraTechDay';
import { getTranslations } from '@/lib/translations';

export type Meetup = CollectionEntry<'meetups'>;

export type MeetupLifecycleStatus =
  | 'announced'
  | 'rsvp-open'
  | 'completed'
  | 'cancelled';

export type MeetupShowcaseItem =
  | { type: 'meetup'; data: Meetup }
  | { type: 'pereira-tech-day'; data: PereiraTechDay };

const filterDrafts = (entry: Meetup): boolean => {
  if (import.meta.env.PROD) return entry.data.draft !== true;
  return true;
};

const sortByDateDesc = (a: Meetup, b: Meetup): number =>
  b.data.date.getTime() - a.data.date.getTime();

/**
 * Get all meetups (bilingual i18n collection — same entry serves both
 * languages via `tr()` on title/description fields).
 */
export const getMeetups = async (_lang?: Language): Promise<Meetup[]> => {
  const all = await getCollection('meetups');
  return all.filter(filterDrafts).sort(sortByDateDesc);
};

export const getMeetupBySlug = async (
  slug: string
): Promise<Meetup | undefined> => {
  const entries = await getMeetups();
  // Ids are the bare slug (the `YYYY-MM-DD_` filename prefix is stripped in
  // `generateId`), so an exact match is the normal path. The nested form is
  // kept for meetups filed in a subdirectory.
  return entries.find((e) => e.id === slug || e.id.endsWith(`/${slug}`));
};

/** Derive próximamente/pasado from the calendar date (SITE_TIMEZONE), not stale frontmatter. */
export const resolveMeetupStatus = (
  meetup: Meetup,
  todayInTz: string = getTodayInSiteTimezone()
): MeetupLifecycleStatus => {
  if (meetup.data.status === 'cancelled') return 'cancelled';
  if (!isCalendarDateOnOrAfterToday(meetup.data.date, todayInTz)) {
    return 'completed';
  }
  if (meetup.data.status === 'rsvp-open') return 'rsvp-open';
  return 'announced';
};

const getShowcaseItemDate = (item: MeetupShowcaseItem): Date =>
  item.type === 'meetup' ? item.data.data.date : getEditionStartDate(item.data);

/**
 * Upcoming meetups plus the flagship Pereira Tech Day when it stands in for
 * the monthly meetup of its calendar month (e.g. August 2026). A postponed
 * edition is excluded: it is not an upcoming gathering.
 */
export const buildUpcomingMeetupShowcase = (
  meetups: Meetup[],
  editions: PereiraTechDay[],
  todayInTz: string = getTodayInSiteTimezone()
): MeetupShowcaseItem[] => {
  const upcomingMeetups = meetups
    .filter((m) => isCalendarDateOnOrAfterToday(m.data.date, todayInTz))
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());

  const items: MeetupShowcaseItem[] = upcomingMeetups.map((meetup) => ({
    type: 'meetup',
    data: meetup,
  }));

  const flagship = editions.find(
    (edition) =>
      isUpcomingEdition(edition) &&
      !isPostponedEdition(edition) &&
      isCalendarDateOnOrAfterToday(getEditionStartDate(edition), todayInTz)
  );

  if (flagship) {
    const flagshipMonth = getCalendarYearMonth(getEditionStartDate(flagship));
    const hasRegularMeetupSameMonth = upcomingMeetups.some(
      (meetup) => getCalendarYearMonth(meetup.data.date) === flagshipMonth
    );

    if (!hasRegularMeetupSameMonth) {
      items.push({ type: 'pereira-tech-day', data: flagship });
    }
  }

  return items.sort(
    (a, b) =>
      getShowcaseItemDate(a).getTime() - getShowcaseItemDate(b).getTime()
  );
};

export const getUpcomingMeetupShowcase = async (): Promise<
  MeetupShowcaseItem[]
> => {
  const [meetups, editions] = await Promise.all([getMeetups(), getEditions()]);
  return buildUpcomingMeetupShowcase(meetups, editions);
};

export const getUpcomingMeetups = async (): Promise<Meetup[]> => {
  const showcase = await getUpcomingMeetupShowcase();
  return showcase
    .filter(
      (item): item is { type: 'meetup'; data: Meetup } => item.type === 'meetup'
    )
    .map((item) => item.data);
};

/**
 * Past meetups plus completed Pereira Tech Day editions in the archive timeline.
 */
export const buildPastMeetupShowcase = (
  meetups: Meetup[],
  editions: PereiraTechDay[],
  upcomingMeetupIds: Set<string>,
  todayInTz: string = getTodayInSiteTimezone()
): MeetupShowcaseItem[] => {
  const pastMeetups: MeetupShowcaseItem[] = meetups
    .filter(
      (m) =>
        !upcomingMeetupIds.has(m.id) &&
        isCalendarDateBeforeToday(m.data.date, todayInTz)
    )
    .map((meetup) => ({ type: 'meetup', data: meetup }));

  const pastEditions: MeetupShowcaseItem[] = editions
    .filter((edition) =>
      isCalendarDateBeforeToday(getEditionStartDate(edition), todayInTz)
    )
    .map((edition) => ({ type: 'pereira-tech-day', data: edition }));

  return [...pastMeetups, ...pastEditions].sort(
    (a, b) =>
      getShowcaseItemDate(b).getTime() - getShowcaseItemDate(a).getTime()
  );
};

export const getPastMeetupShowcase = async (): Promise<
  MeetupShowcaseItem[]
> => {
  const [meetups, editions, upcoming] = await Promise.all([
    getMeetups(),
    getEditions(),
    getUpcomingMeetupShowcase(),
  ]);
  const upcomingMeetupIds = new Set(
    upcoming
      .filter((item) => item.type === 'meetup')
      .map((item) => item.data.id)
  );
  return buildPastMeetupShowcase(meetups, editions, upcomingMeetupIds);
};

/**
 * Full timeline: upcoming (including the flagship Pereira Tech Day) followed
 * by the archive, newest first. Powers the single "all meetups" list — an
 * edition is a meetup like any other, so it shares the grid, the year rail,
 * and the status badge.
 */
export const buildAllMeetupShowcase = (
  upcoming: MeetupShowcaseItem[],
  past: MeetupShowcaseItem[]
): MeetupShowcaseItem[] =>
  [...upcoming, ...past].sort(
    (a, b) =>
      getShowcaseItemDate(b).getTime() - getShowcaseItemDate(a).getTime()
  );

export const getAllMeetupShowcase = async (): Promise<MeetupShowcaseItem[]> => {
  const [upcoming, past] = await Promise.all([
    getUpcomingMeetupShowcase(),
    getPastMeetupShowcase(),
  ]);
  return buildAllMeetupShowcase(upcoming, past);
};

export const getPastMeetups = async (): Promise<Meetup[]> => {
  const showcase = await getPastMeetupShowcase();
  return showcase
    .filter(
      (item): item is { type: 'meetup'; data: Meetup } => item.type === 'meetup'
    )
    .map((item) => item.data);
};

export const getMeetupsByVertical = async (
  verticalSlug: string
): Promise<Meetup[]> => {
  const all = await getMeetups();
  return all.filter((e) => e.data.verticals.includes(verticalSlug));
};

export const getMeetupsByYear = async (year: number): Promise<Meetup[]> => {
  const all = await getMeetups();
  return all.filter((e) => getCalendarYear(e.data.date) === year);
};

/**
 * The URL slug of a meetup entry. Ids already are the slug — the
 * `YYYY-MM-DD_` filename prefix is stripped in `generateId` — but callers go
 * through this accessor so the id/slug relationship stays in one place.
 */
export const getMeetupSlug = (entry: Meetup): string => entry.id;

/**
 * Group meetups by year (descending) → array of { year, meetups }.
 */
export const groupMeetupsByYear = (
  meetups: Meetup[]
): { year: number; meetups: Meetup[] }[] => {
  const byYear = new Map<number, Meetup[]>();
  for (const m of meetups) {
    const y = getCalendarYear(m.data.date);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)?.push(m);
  }
  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, meetups]) => ({ year, meetups }));
};

/** Group showcase items by calendar year (descending). */
export const groupMeetupShowcaseByYear = (
  items: MeetupShowcaseItem[]
): { year: number; items: MeetupShowcaseItem[] }[] => {
  const byYear = new Map<number, MeetupShowcaseItem[]>();
  for (const item of items) {
    const y = getCalendarYear(getShowcaseItemDate(item));
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)?.push(item);
  }
  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }));
};

/**
 * Which body a meetup page should render, for a given language.
 *
 * A meetup keeps its Spanish body in the entry itself and its English body in a
 * `{slug}.en.md` sibling. When the English translation does not exist yet the
 * page falls back to the Spanish body — but the caller must label it, because a
 * silent fallback is the defect this whole mechanism replaces.
 *
 * See `analysis_results/BILINGUAL_BODY_DECISION.md` in
 * PLAN_sitewide_language_seo_aeo_audit.
 */
export interface MeetupBodySelection {
  /** The entry whose body to render — the translation, or the meetup itself. */
  entry: Meetup | CollectionEntry<'meetupBodiesEn'>;
  /** True when English was requested and no translation exists. */
  untranslated: boolean;
}

export const getMeetupBodyEntry = async (
  meetup: Meetup,
  lang: Language
): Promise<MeetupBodySelection> => {
  if (lang !== 'en') {
    return { entry: meetup, untranslated: false };
  }

  const translations = await getCollection('meetupBodiesEn');
  const translated = translations.find((entry) => entry.id === meetup.id);

  return translated
    ? { entry: translated, untranslated: false }
    : { entry: meetup, untranslated: true };
};

/** Raw English body for a meetup, or null when it has not been translated. */
export const getMeetupBodyMarkdown = async (
  meetup: Meetup,
  lang: Language
): Promise<{ body: string; untranslated: boolean }> => {
  const { entry, untranslated } = await getMeetupBodyEntry(meetup, lang);
  return { body: entry.body ?? '', untranslated };
};

// ────────────────────────────────────────────────────────────────────────────
// Programming: date confidence, lineup, and the call for speakers
//
// Everything here is DERIVED from the entry. The only authored inputs are
// `dateConfidence` and `callForSpeakers` — nothing else in a meetup can express
// whether a date is a commitment or whether we are publicly asking for talks.
// ────────────────────────────────────────────────────────────────────────────

export type MeetupLineup = 'open' | 'partial' | 'confirmed';
export type CallForSpeakersState = 'open' | 'scheduled' | 'closed' | 'none';
export type MeetupDateConfidence = 'confirmed' | 'tentative' | 'month-only';
export type CfsFormat = 'regular' | 'lightning' | 'panel' | 'workshop';

/** One meetup that is accepting proposals right now. */
export interface OpenCall {
  slug: string;
  /** Canonical absolute URL of the meetup page (Spanish, unprefixed). */
  url: string;
  title: { en: string; es: string };
  date: Date;
  dateConfidence: MeetupDateConfidence;
  formats: readonly CfsFormat[];
  closesAt?: Date;
  slots?: number;
  note?: { en?: string; es?: string };
}

/**
 * How far along a meetup's programme is.
 *
 * Derived, never authored: `talks: []` with `speakers: []` already says the
 * lineup is open, and asking an author to say it twice is how the two drift.
 * `partial` is the real intermediate state — speakers get confirmed before
 * their talk entries exist, because a talk needs a title, an abstract and a
 * duration. One authored talk means the programme is published, so it counts
 * as `confirmed`.
 */
export const resolveMeetupLineup = (meetup: Meetup): MeetupLineup => {
  const talks = meetup.data.talks ?? [];
  const speakers = meetup.data.speakers ?? [];
  if (talks.length > 0) return 'confirmed';
  if (speakers.length > 0) return 'partial';
  return 'open';
};

export const resolveMeetupDateConfidence = (
  meetup: Meetup
): MeetupDateConfidence => meetup.data.dateConfidence ?? 'confirmed';

/**
 * The state of a meetup's call for speakers.
 *
 * The date checks run BEFORE the authored `status`, so a call auto-closes once
 * the meetup has happened or `closesAt` has passed. A stale `status: open` must
 * never invite a proposal to an event that already took place — that is an
 * integrity rule, not a convenience, and it mirrors `resolveMeetupStatus`,
 * which also lets the calendar overrule the frontmatter.
 *
 * `closesAt` is inclusive of its own day: a call closing on the 20th accepts
 * proposals through the 20th.
 */
export const getCallForSpeakersState = (
  meetup: Meetup,
  todayInTz: string = getTodayInSiteTimezone()
): CallForSpeakersState => {
  const call = meetup.data.callForSpeakers;
  if (!call) return 'none';
  if (isCalendarDateBeforeToday(meetup.data.date, todayInTz)) return 'closed';
  if (call.closesAt && isCalendarDateBeforeToday(call.closesAt, todayInTz)) {
    return 'closed';
  }
  if (call.status === 'closed') return 'closed';
  if (call.opensAt && getCalendarDateString(call.opensAt) > todayInTz) {
    return 'scheduled';
  }
  if (call.status === 'scheduled') return 'scheduled';
  return 'open';
};

export const isCallForSpeakersOpen = (
  meetup: Meetup,
  todayInTz: string = getTodayInSiteTimezone()
): boolean => getCallForSpeakersState(meetup, todayInTz) === 'open';

/**
 * Whole days left before a call closes, or null when it has no deadline or is
 * not open. Computed from calendar dates at build time — the value changes once
 * a day, so a client-side clock would buy nothing but hydration cost.
 */
export const getCallDaysRemaining = (
  meetup: Meetup,
  todayInTz: string = getTodayInSiteTimezone()
): number | null => {
  const call = meetup.data.callForSpeakers;
  if (!call?.closesAt) return null;
  if (getCallForSpeakersState(meetup, todayInTz) !== 'open') return null;
  const closes = Date.parse(
    `${getCalendarDateString(call.closesAt)}T00:00:00Z`
  );
  const today = Date.parse(`${todayInTz}T00:00:00Z`);
  return Math.max(0, Math.round((closes - today) / 86_400_000));
};

/** Pure builder — takes the meetups so it stays testable without the collection. */
export const buildOpenCallsForSpeakers = (
  meetups: Meetup[],
  todayInTz: string = getTodayInSiteTimezone()
): OpenCall[] =>
  meetups
    .filter((meetup) => isCallForSpeakersOpen(meetup, todayInTz))
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime())
    .map((meetup) => {
      const call = meetup.data.callForSpeakers;
      const slug = getMeetupSlug(meetup);
      return {
        slug,
        url: `${SITE_URL}/meetups/${slug}/`,
        title: {
          en: tr(meetup.data.title, 'en'),
          es: tr(meetup.data.title, 'es'),
        },
        date: meetup.data.date,
        dateConfidence: resolveMeetupDateConfidence(meetup),
        formats: (call?.formats ?? []) as readonly CfsFormat[],
        ...(call?.closesAt ? { closesAt: call.closesAt } : {}),
        ...(typeof call?.slots === 'number' ? { slots: call.slots } : {}),
        ...(call?.note
          ? {
              note: {
                en: tr(call.note, 'en') || undefined,
                es: tr(call.note, 'es') || undefined,
              },
            }
          : {}),
      };
    });

export const getOpenCallsForSpeakers = async (
  todayInTz: string = getTodayInSiteTimezone()
): Promise<OpenCall[]> =>
  buildOpenCallsForSpeakers(await getMeetups(), todayInTz);

/**
 * The date a meetup page should print, at the precision the community actually
 * has. A `tentative` date still prints its day — the caveat belongs to a chip
 * beside it, not baked into the string, so the same label works in a `<time>`
 * element, a card, an agent twin and an `aria-label`.
 */
export const resolveMeetupDateLabel = (
  meetup: Meetup,
  lang: Language
): string =>
  resolveMeetupDateConfidence(meetup) === 'month-only'
    ? formatCalendarMonth(meetup.data.date, lang)
    : formatCalendarDate(meetup.data.date, lang);

/**
 * The date label for an `OpenCall`, at the confidence that call carries.
 *
 * `resolveMeetupDateLabel` needs the entry; this one works from the manifest
 * shape alone, so a consumer holding only the open-calls payload does not have
 * to look the meetup back up.
 */
export const formatOpenCallDate = (
  call: Pick<OpenCall, 'date' | 'dateConfidence'>,
  lang: Language
): string =>
  call.dateConfidence === 'month-only'
    ? formatCalendarMonth(call.date, lang)
    : formatCalendarDate(call.date, lang);

/**
 * The value for a `<time datetime>` attribute — `YYYY-MM` when only the month
 * is known, so the markup never claims a day the content does not have.
 */
export const resolveMeetupDateAttribute = (meetup: Meetup): string =>
  resolveMeetupDateConfidence(meetup) === 'month-only'
    ? getCalendarYearMonth(meetup.data.date)
    : getCalendarDateString(meetup.data.date);

/**
 * The short "venue, city" line used in listings and agent twins.
 *
 * A meetup can be programmed months before a room is booked, so this returns
 * the localized "venue to be confirmed" text rather than an empty string —
 * an empty value would render as a stray comma in a card and would fail
 * `md:check`, which requires a Venue section on every meetup twin.
 */
export const resolveMeetupVenueLine = (
  meetup: Meetup,
  lang: Language
): string => {
  const venue = meetup.data.venue;
  if (!venue) return getTranslations(lang).meetupDetail.planning.venueTbc;
  return [venue.name, venue.city].filter(Boolean).join(', ');
};
