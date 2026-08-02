import { describe, expect, it } from 'vitest';
import type { CommunityCalendar } from '@/lib/calendar';
import {
  buildGoogleCalendarEmbedUrl,
  buildGoogleCalendarIcsUrl,
  filterActiveCommunityCalendars,
  isValidGoogleCalendarId,
  isValidPublicHttpsUrl,
  sortCommunityCalendars,
} from '@/lib/calendar';

const makeEntry = (
  id: string,
  overrides: Partial<CommunityCalendar['data']> = {}
): CommunityCalendar =>
  ({
    id,
    collection: 'communityCalendars',
    data: {
      name: { en: id, es: id },
      googleCalendarId: 'demo@group.calendar.google.com',
      color: '#112233',
      active: true,
      order: 0,
      primary: false,
      ...overrides,
    },
  }) as CommunityCalendar;

describe('isValidGoogleCalendarId', () => {
  it('accepts email-style calendar IDs', () => {
    expect(isValidGoogleCalendarId('pereiratechtalks@gmail.com')).toBe(true);
  });

  it('accepts group calendar IDs', () => {
    expect(isValidGoogleCalendarId('c_abc123@group.calendar.google.com')).toBe(
      true
    );
  });

  it('rejects URL-shaped values', () => {
    expect(isValidGoogleCalendarId('https://evil.example/calendar')).toBe(
      false
    );
  });

  it('rejects values with spaces or quotes', () => {
    expect(isValidGoogleCalendarId('bad id@gmail.com')).toBe(false);
    expect(isValidGoogleCalendarId('bad"id@gmail.com')).toBe(false);
  });
});

describe('isValidPublicHttpsUrl', () => {
  it('accepts https URLs', () => {
    expect(isValidPublicHttpsUrl('https://luma.com/pertechtalks')).toBe(true);
  });

  it('rejects http URLs', () => {
    expect(isValidPublicHttpsUrl('http://pereiratechtalks.org')).toBe(false);
  });

  it('rejects javascript URLs', () => {
    expect(isValidPublicHttpsUrl('javascript:alert(1)')).toBe(false);
  });
});

describe('buildGoogleCalendarEmbedUrl', () => {
  it('builds a multi-calendar embed with timezone and language', () => {
    const url = buildGoogleCalendarEmbedUrl(
      [
        { id: 'a@gmail.com', color: '#1E6F5C' },
        { id: 'b@group.calendar.google.com', color: '#F7DF1E' },
      ],
      { mode: 'AGENDA', lang: 'es' }
    );

    expect(url).toContain('calendar.google.com/calendar/embed');
    expect(url).toContain('src=a%40gmail.com');
    expect(url).toContain('src=b%40group.calendar.google.com');
    expect(url).toContain('mode=AGENDA');
    expect(url).toContain('ctz=America%2FBogota');
    expect(url).toContain('hl=es');
    expect(url).toContain('color=%231E6F5C');
  });

  it('returns base origin when no calendars selected', () => {
    expect(buildGoogleCalendarEmbedUrl([])).toBe(
      'https://calendar.google.com/calendar/embed'
    );
  });
});

describe('buildGoogleCalendarIcsUrl', () => {
  it('encodes calendar id in ICS path', () => {
    const url = buildGoogleCalendarIcsUrl('team@group.calendar.google.com');
    expect(url).toBe(
      'https://calendar.google.com/calendar/ical/team%40group.calendar.google.com/public/basic.ics'
    );
  });
});

describe('sortCommunityCalendars', () => {
  it('puts primary calendars first then sorts by order', () => {
    const sorted = sortCommunityCalendars([
      makeEntry('b', { order: 1, primary: false }),
      makeEntry('a', { order: 0, primary: true }),
      makeEntry('c', { order: 0, primary: false }),
    ]);
    expect(sorted.map((e) => e.id)).toEqual(['a', 'c', 'b']);
  });
});

describe('filterActiveCommunityCalendars', () => {
  it('returns only active entries', () => {
    const result = filterActiveCommunityCalendars([
      makeEntry('on', { active: true }),
      makeEntry('off', { active: false }),
    ]);
    expect(result.map((e) => e.id)).toEqual(['on']);
  });
});
