import { describe, expect, it } from 'vitest';
import type { Notification } from '@/lib/notifications';
import {
  filterActiveNotifications,
  localizeNotification,
} from '@/lib/notifications';

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

describe('localizeNotification', () => {
  it('preserves absolute https CTA hrefs for aid destinations', () => {
    const entry = makeEntry('earthquake-aid-2026', {
      startsAt: new Date('2026-08-10T00:00:00.000Z'),
      endsAt: new Date('2026-12-31T23:59:59.000Z'),
      title: { en: 'Postponed', es: 'Pospuesto' },
      summary: { en: 'Help neighbors', es: 'Ayuda a vecinos' },
      body: { en: 'Body EN', es: 'Cuerpo ES' },
      ctaLabel: { en: 'Open aid', es: 'Abrir ayudas' },
      ctaHref: 'https://corag-ayuda-directa.vercel.app',
      modalEnabled: true,
      image: {
        src: '/images/pereira-tech-days/2026/postponed-indefinitely.webp',
        alt: { en: 'Postponed art', es: 'Arte pospuesto' },
      },
    });
    const es = localizeNotification(entry, 'es');
    expect(es.ctaHref).toBe('https://corag-ayuda-directa.vercel.app');
    expect(es.title).toBe('Pospuesto');
    expect(es.image?.src).toContain('postponed-indefinitely.webp');
    const en = localizeNotification(entry, 'en');
    expect(en.ctaLabel).toBe('Open aid');
  });
});
