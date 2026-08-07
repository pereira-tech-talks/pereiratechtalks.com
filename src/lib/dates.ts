import { SITE_TIMEZONE, SITE_TIMEZONE_OFFSET } from '@/lib/constances';
import { getDateLocale, type Language } from '@/lib/i18n';

const CALENDAR_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

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

/** Format using a BCP-47 locale string (for Svelte `t.dateLocale`). */
export function formatCalendarDateLocale(
  date: Date | string,
  locale: string,
  options: CalendarDateFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: 'UTC',
  }).format(toCalendarDate(date));
}

/** `YYYY-MM-DD` from a calendar date stored as midnight UTC. */
export function getCalendarDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Calendar year from a content date (UTC calendar, not viewer-local). */
export function getCalendarYear(date: Date | string): number {
  const dateStr = toCalendarDateString(date);
  return Number.parseInt(dateStr.slice(0, 4), 10);
}

/** `YYYY-MM` bucket for timeline grouping. */
export function getCalendarYearMonth(date: Date | string): string {
  return toCalendarDateString(date).slice(0, 7);
}

/** Format a real timestamp in SITE_TIMEZONE (GMT−5 / America/Bogota). */
export function formatInstantInSiteTimezone(
  date: Date,
  locale: string,
  options: CalendarDateFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: SITE_TIMEZONE,
  }).format(date);
}

/** Normalise API/JSON strings to a midnight-UTC `Date`. */
export function toCalendarDate(date: Date | string): Date {
  if (date instanceof Date) return date;
  const iso = date.slice(0, 10);
  return new Date(`${iso}T00:00:00.000Z`);
}

/** Today's calendar date (`YYYY-MM-DD`) in SITE_TIMEZONE — for scheduling gates. */
export function getTodayInSiteTimezone(now: Date = new Date()): string {
  return now.toLocaleDateString('en-CA', { timeZone: SITE_TIMEZONE });
}

/** Whether a calendar date is strictly after today in SITE_TIMEZONE. */
export function isFutureCalendarDate(
  date: Date | string,
  todayInTz: string = getTodayInSiteTimezone()
): boolean {
  const dateStr = toCalendarDateString(date);
  if (!CALENDAR_DATE_RE.test(dateStr)) return false;
  return dateStr > todayInTz;
}

/** Whether a calendar date is today or later in SITE_TIMEZONE. */
export function isCalendarDateOnOrAfterToday(
  date: Date | string,
  todayInTz: string = getTodayInSiteTimezone()
): boolean {
  const dateStr = toCalendarDateString(date);
  return dateStr >= todayInTz;
}

/** Whether a calendar date is before today in SITE_TIMEZONE. */
export function isCalendarDateBeforeToday(
  date: Date | string,
  todayInTz: string = getTodayInSiteTimezone()
): boolean {
  const dateStr = toCalendarDateString(date);
  return dateStr < todayInTz;
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
    return `${dateStr}T${pad(hours)}:${pad(minutes)}:00${SITE_TIMEZONE_OFFSET}`;
  }

  throw new Error(
    `combineCalendarDateAndTime: unsupported timezone "${timezone}"`
  );
}

function toCalendarDateString(date: Date | string): string {
  return typeof date === 'string'
    ? date.slice(0, 10)
    : getCalendarDateString(date);
}
