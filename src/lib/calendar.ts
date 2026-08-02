import { type CollectionEntry, getCollection } from 'astro:content';
import { z } from 'astro/zod';

import type { Language } from '@/lib/i18n';

export type CommunityCalendar = CollectionEntry<'communityCalendars'>;

export type CommunityCalendarData = CommunityCalendar['data'];

export type CalendarViewMode = 'MONTH' | 'AGENDA';

export const GOOGLE_CALENDAR_EMBED_ORIGIN =
  'https://calendar.google.com/calendar/embed';

export const GOOGLE_CALENDAR_ICS_ORIGIN =
  'https://calendar.google.com/calendar/ical';

const CALENDAR_ID_MAX_LENGTH = 256;

/**
 * Public Google Calendar IDs: email-style or @group.calendar.google.com.
 * Rejects URL-shaped values to keep embed `src` params safe.
 */
export const isValidGoogleCalendarId = (id: string): boolean => {
  const trimmed = id.trim();
  if (!trimmed || trimmed.length > CALENDAR_ID_MAX_LENGTH) return false;
  if (/[\s<>"']/.test(trimmed)) return false;
  if (!trimmed.includes('@')) return false;
  if (/^https?:/i.test(trimmed)) return false;

  const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const groupCal = /^[^\s@]+@group(\.v)?\.calendar\.google\.com$/i;
  return emailLike.test(trimmed) || groupCal.test(trimmed);
};

/** HTTPS-only URLs for external calendar / RSVP links. */
export const isValidPublicHttpsUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const googleCalendarIdSchema = z
  .string()
  .trim()
  .refine(
    isValidGoogleCalendarId,
    'Must be a public Google Calendar ID (email or @group.calendar.google.com)'
  );

export const publicHttpsUrlSchema = z
  .string()
  .refine(isValidPublicHttpsUrl, 'Must use https://');

export const hexColorToEmbedParam = (hex: string): string =>
  hex.startsWith('#') ? hex : `#${hex}`;

export interface EmbedCalendarInput {
  id: string;
  color?: string;
}

/**
 * Build a Google Calendar embed URL for one or more public calendar IDs.
 */
export const buildGoogleCalendarEmbedUrl = (
  calendars: readonly EmbedCalendarInput[],
  options?: {
    mode?: CalendarViewMode;
    timezone?: string;
    lang?: Language;
  }
): string => {
  if (calendars.length === 0) {
    return GOOGLE_CALENDAR_EMBED_ORIGIN;
  }

  const params = new URLSearchParams();
  for (const cal of calendars) {
    params.append('src', cal.id.trim());
    if (cal.color) {
      params.append('color', hexColorToEmbedParam(cal.color));
    }
  }

  params.set('ctz', options?.timezone ?? 'America/Bogota');
  params.set('mode', options?.mode ?? 'MONTH');
  params.set('showTitle', '0');
  params.set('showNav', '1');
  params.set('showDate', '1');
  params.set('showPrint', '0');
  params.set('showTabs', '1');
  params.set('showCalendars', '0');
  params.set('wkst', '1');
  params.set('hl', options?.lang === 'es' ? 'es' : 'en');

  return `${GOOGLE_CALENDAR_EMBED_ORIGIN}?${params.toString()}`;
};

/** Public ICS subscribe URL for a single calendar ID. */
export const buildGoogleCalendarIcsUrl = (calendarId: string): string => {
  const encoded = encodeURIComponent(calendarId.trim());
  return `${GOOGLE_CALENDAR_ICS_ORIGIN}/${encoded}/public/basic.ics`;
};

export const sortCommunityCalendars = (
  entries: readonly CommunityCalendar[]
): CommunityCalendar[] =>
  [...entries].sort((a, b) => {
    if (a.data.primary !== b.data.primary) {
      return a.data.primary ? -1 : 1;
    }
    return a.data.order - b.data.order;
  });

export const filterActiveCommunityCalendars = (
  entries: readonly CommunityCalendar[]
): CommunityCalendar[] =>
  sortCommunityCalendars(entries.filter((entry) => entry.data.active));

export const getCommunityCalendars = async (): Promise<CommunityCalendar[]> => {
  const all = await getCollection('communityCalendars');
  return sortCommunityCalendars(all);
};

export const getActiveCommunityCalendars = async (): Promise<
  CommunityCalendar[]
> => {
  const all = await getCommunityCalendars();
  return filterActiveCommunityCalendars(all);
};

export const localizeCommunityCalendar = (
  entry: CommunityCalendar,
  lang: Language
): {
  slug: string;
  name: string;
  description?: string;
  googleCalendarId: string;
  color: string;
  website?: string;
  lumaUrl?: string;
  active: boolean;
  primary: boolean;
  order: number;
  icsUrl: string;
} => {
  const { data } = entry;
  return {
    slug: entry.id,
    name: data.name[lang],
    description: data.description?.[lang],
    googleCalendarId: data.googleCalendarId,
    color: data.color,
    website: data.website,
    lumaUrl: data.lumaUrl,
    active: data.active,
    primary: data.primary,
    order: data.order,
    icsUrl: buildGoogleCalendarIcsUrl(data.googleCalendarId),
  };
};
