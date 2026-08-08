import { describe, expect, it } from 'vitest';
import type { Notification } from '@/lib/notifications';
import { filterActiveNotifications } from '@/lib/notifications';

const makeEntry = (
  id: string,
  overrides: Partial<Notification['data']> & {
    startsAt: Date;
    endsAt: Date;
  }
): Notification =>
  ({
    id,
    collection: 'notifications',
    data: {
      severity: 'info',
      title: { en: id, es: id },
      summary: { en: 'summary', es: 'resumen' },
      modalEnabled: false,
      priority: 0,
      active: true,
      ...overrides,
    },
  }) as Notification;

describe('filterActiveNotifications', () => {
  const now = new Date('2026-06-15T12:00:00.000Z');

  it('excludes notifications before startsAt', () => {
    const entries = [
      makeEntry('future', {
        startsAt: new Date('2026-07-01T00:00:00.000Z'),
        endsAt: new Date('2026-08-01T00:00:00.000Z'),
      }),
    ];
    expect(filterActiveNotifications(entries, now)).toHaveLength(0);
  });

  it('includes notifications during the window', () => {
    const entries = [
      makeEntry('live', {
        startsAt: new Date('2026-06-01T00:00:00.000Z'),
        endsAt: new Date('2026-06-30T23:59:59.000Z'),
      }),
    ];
    expect(filterActiveNotifications(entries, now)).toHaveLength(1);
  });

  it('excludes notifications after endsAt', () => {
    const entries = [
      makeEntry('past', {
        startsAt: new Date('2026-05-01T00:00:00.000Z'),
        endsAt: new Date('2026-05-31T23:59:59.000Z'),
      }),
    ];
    expect(filterActiveNotifications(entries, now)).toHaveLength(0);
  });

  it('excludes inactive notifications even inside the window', () => {
    const entries = [
      makeEntry('off', {
        active: false,
        startsAt: new Date('2026-06-01T00:00:00.000Z'),
        endsAt: new Date('2026-06-30T23:59:59.000Z'),
      }),
    ];
    expect(filterActiveNotifications(entries, now)).toHaveLength(0);
  });

  it('sorts by priority descending', () => {
    const entries = [
      makeEntry('low', {
        priority: 1,
        startsAt: new Date('2026-06-01T00:00:00.000Z'),
        endsAt: new Date('2026-06-30T23:59:59.000Z'),
      }),
      makeEntry('high', {
        priority: 10,
        startsAt: new Date('2026-06-01T00:00:00.000Z'),
        endsAt: new Date('2026-06-30T23:59:59.000Z'),
      }),
    ];
    const result = filterActiveNotifications(entries, now);
    expect(result.map((e) => e.id)).toEqual(['high', 'low']);
  });

  it('includes boundary instants (startsAt and endsAt inclusive)', () => {
    const start = new Date('2026-06-15T12:00:00.000Z');
    const end = new Date('2026-06-15T12:00:00.000Z');
    const entries = [
      makeEntry('edge', {
        startsAt: start,
        endsAt: end,
      }),
    ];
    expect(filterActiveNotifications(entries, start)).toHaveLength(1);
  });
});
