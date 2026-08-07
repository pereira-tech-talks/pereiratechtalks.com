import { describe, expect, it } from 'vitest';

import { SITE_TIMEZONE_OFFSET } from '@/lib/constances';
import {
  combineCalendarDateAndTime,
  formatCalendarDate,
  formatCalendarDateLocale,
  formatInstantInSiteTimezone,
  getCalendarDateString,
  getCalendarYear,
  getCalendarYearMonth,
  getTodayInSiteTimezone,
  isCalendarDateBeforeToday,
  isCalendarDateOnOrAfterToday,
  isFutureCalendarDate,
  toCalendarDate,
} from '@/lib/dates';

const MIDNIGHT_UTC = new Date('2026-03-04T00:00:00.000Z');

describe('calendar date helpers', () => {
  it('getCalendarDateString preserves the authored YYYY-MM-DD', () => {
    expect(getCalendarDateString(MIDNIGHT_UTC)).toBe('2026-03-04');
  });

  it('formatCalendarDate uses UTC so Bogota viewers see the authored day', () => {
    const formatted = formatCalendarDate(MIDNIGHT_UTC, 'es', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    expect(formatted).toContain('4');
    expect(formatted).not.toContain('3');
  });

  it('formatCalendarDateLocale matches formatCalendarDate for the same locale', () => {
    const fromLang = formatCalendarDate(MIDNIGHT_UTC, 'en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const fromLocale = formatCalendarDateLocale(MIDNIGHT_UTC, 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    expect(fromLocale).toBe(fromLang);
  });

  it('getCalendarYear and getCalendarYearMonth read the UTC calendar bucket', () => {
    expect(getCalendarYear(MIDNIGHT_UTC)).toBe(2026);
    expect(getCalendarYear('2026-03-04T00:00:00.000Z')).toBe(2026);
    expect(getCalendarYearMonth(MIDNIGHT_UTC)).toBe('2026-03');
  });

  it('toCalendarDate normalises ISO strings to midnight UTC', () => {
    expect(toCalendarDate('2026-08-22').toISOString()).toBe(
      '2026-08-22T00:00:00.000Z'
    );
  });

  it('combineCalendarDateAndTime emits Bogota wall-clock offset', () => {
    const iso = combineCalendarDateAndTime(
      new Date('2026-08-22T00:00:00.000Z'),
      '08:00'
    );
    expect(iso).toBe('2026-08-22T08:00:00-05:00');
    expect(SITE_TIMEZONE_OFFSET).toBe('-05:00');
  });

  it('formatInstantInSiteTimezone formats real timestamps in GMT-5', () => {
    const instant = new Date('2026-03-04T18:30:00.000Z');
    const formatted = formatInstantInSiteTimezone(instant, 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    expect(formatted).toContain('4');
    expect(formatted).not.toContain('5');
  });
});

describe('site timezone scheduling gates', () => {
  it('isFutureCalendarDate compares against today in America/Bogota', () => {
    const today = getTodayInSiteTimezone(new Date('2026-03-04T15:00:00.000Z'));
    expect(today).toBe('2026-03-04');
    expect(isFutureCalendarDate('2026-03-05', today)).toBe(true);
    expect(isFutureCalendarDate('2026-03-04', today)).toBe(false);
    expect(isFutureCalendarDate('2026-03-03', today)).toBe(false);
  });

  it('isCalendarDateOnOrAfterToday treats today as upcoming', () => {
    const today = '2026-08-07';
    expect(isCalendarDateOnOrAfterToday('2026-08-07', today)).toBe(true);
    expect(isCalendarDateOnOrAfterToday('2026-08-08', today)).toBe(true);
    expect(isCalendarDateOnOrAfterToday('2026-08-06', today)).toBe(false);
  });

  it('isCalendarDateBeforeToday excludes today', () => {
    const today = '2026-08-07';
    expect(isCalendarDateBeforeToday('2026-08-06', today)).toBe(true);
    expect(isCalendarDateBeforeToday('2026-08-07', today)).toBe(false);
  });
});
