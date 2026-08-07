import { describe, expect, it, vi } from 'vitest';

import {
  isCalendarDateBeforeToday,
  isCalendarDateOnOrAfterToday,
} from '@/lib/dates';

describe('event helpers', () => {
  it('isCalendarDateOnOrAfterToday marks today as upcoming in Bogota', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-07T20:00:00.000Z'));

    expect(isCalendarDateOnOrAfterToday('2026-08-07')).toBe(true);
    expect(isCalendarDateOnOrAfterToday('2026-08-08')).toBe(true);
    expect(isCalendarDateOnOrAfterToday('2026-08-06')).toBe(false);

    vi.useRealTimers();
  });

  it('isCalendarDateBeforeToday excludes today in Bogota', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-07T20:00:00.000Z'));

    expect(isCalendarDateBeforeToday('2026-08-06')).toBe(true);
    expect(isCalendarDateBeforeToday('2026-08-07')).toBe(false);

    vi.useRealTimers();
  });
});
