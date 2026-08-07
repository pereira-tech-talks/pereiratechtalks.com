import { SITE_TIMEZONE } from '@/lib/constances';
import { getDateLocale, type Language } from '@/lib/i18n';

/** Fixed offset for Colombia — no DST. */
const BOGOTA_UTC_OFFSET = '-05:00';

export type CalendarDateFormatOptions = Pick<
  Intl.DateTimeFormatOptions,
  'weekday' | 'year' | 'month' | 'day'
>;

const DEFAULT_CALENDAR_OPTIONS: CalendarDateFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

/**
 * Format a calendar date from content collections (stored as midnight UTC,
 * e.g. `"2026-08-22"` → `2026-08-22T00:00:00.000Z`). Uses `timeZone: 'UTC'`
 * so the displayed day matches the authored date regardless of build or
 * viewer timezone.
 */
export function formatCalendarDate(
  date: Date,
  lang: Language,
  options: CalendarDateFormatOptions = DEFAULT_CALENDAR_OPTIONS
): string {
  return new Intl.DateTimeFormat(getDateLocale(lang), {
    ...options,
    timeZone: 'UTC',
  }).format(date);
}

/** `formatToParts` variant for templates that need uppercase month, etc. */
export function formatCalendarDateParts(
  date: Date,
  lang: Language,
  options: CalendarDateFormatOptions = DEFAULT_CALENDAR_OPTIONS
): Intl.DateTimeFormatPart[] {
  return new Intl.DateTimeFormat(getDateLocale(lang), {
    ...options,
    timeZone: 'UTC',
  }).formatToParts(date);
}

/** `YYYY-MM-DD` from a calendar date stored as midnight UTC. */
export function getCalendarDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Combine a calendar date + `HH:mm` wall-clock time in SITE_TIMEZONE into an
 * ISO 8601 string suitable for countdowns and JSON-LD.
 */
export function combineCalendarDateAndTime(
  date: Date,
  time: string,
  timezone: string = SITE_TIMEZONE
): string {
  const dateStr = getCalendarDateString(date);
  const [hours, minutes = '0'] = time.split(':');
  const pad = (value: string) => value.padStart(2, '0');

  if (timezone === 'America/Bogota') {
    return `${dateStr}T${pad(hours)}:${pad(minutes)}:00${BOGOTA_UTC_OFFSET}`;
  }

  throw new Error(
    `combineCalendarDateAndTime: unsupported timezone "${timezone}"`
  );
}
