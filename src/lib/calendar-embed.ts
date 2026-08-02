import type { Language } from '@/lib/i18n';

export type CalendarViewMode = 'MONTH' | 'AGENDA';

export const GOOGLE_CALENDAR_EMBED_ORIGIN =
  'https://calendar.google.com/calendar/embed';

export const hexColorToEmbedParam = (hex: string): string =>
  hex.startsWith('#') ? hex : `#${hex}`;

export interface EmbedCalendarInput {
  id: string;
  color?: string;
}

/**
 * Build a Google Calendar embed URL for one or more public calendar IDs.
 * Client-safe — no astro:content dependency.
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
