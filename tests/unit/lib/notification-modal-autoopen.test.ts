import { describe, expect, it } from 'vitest';
import type { NavigationType } from '@/lib/notification-modal-autoopen';
import {
  consumeNotificationAutoOpen,
  getNavigationType,
  isAutomatedLabBrowser,
  markNotificationAutoOpenShown,
  NOTIFY_AUTO_RELOAD_EVERY,
  planNotificationAutoOpen,
  scheduleAfterLargestContentfulPaint,
} from '@/lib/notification-modal-autoopen';

describe('planNotificationAutoOpen', () => {
  it('opens on first navigate in a session', () => {
    expect(
      planNotificationAutoOpen({
        navType: 'navigate',
        sessionAlreadyShown: false,
        reloadCount: 0,
      })
    ).toEqual({
      shouldOpen: true,
      nextReloadCount: 0,
      markSessionShown: true,
    });
  });

  it('does not open on later navigates in the same session', () => {
    expect(
      planNotificationAutoOpen({
        navType: 'navigate',
        sessionAlreadyShown: true,
        reloadCount: 2,
      })
    ).toEqual({
      shouldOpen: false,
      nextReloadCount: 2,
      markSessionShown: false,
    });
  });

  it('opens every Nth reload and bumps the counter', () => {
    for (let count = 0; count < NOTIFY_AUTO_RELOAD_EVERY * 2; count += 1) {
      const plan = planNotificationAutoOpen({
        navType: 'reload',
        sessionAlreadyShown: true,
        reloadCount: count,
      });
      expect(plan.nextReloadCount).toBe(count + 1);
      expect(plan.shouldOpen).toBe(
        (count + 1) % NOTIFY_AUTO_RELOAD_EVERY === 0
      );
    }
  });

  it('honors a custom reloadEvery', () => {
    expect(
      planNotificationAutoOpen({
        navType: 'reload',
        sessionAlreadyShown: false,
        reloadCount: 2,
        reloadEvery: 3,
      })
    ).toEqual({
      shouldOpen: true,
      nextReloadCount: 3,
      markSessionShown: true,
    });
  });

  it('never auto-opens on back_forward or prerender', () => {
    for (const navType of ['back_forward', 'prerender'] as NavigationType[]) {
      expect(
        planNotificationAutoOpen({
          navType,
          sessionAlreadyShown: false,
          reloadCount: 4,
        }).shouldOpen
      ).toBe(false);
    }
  });
});

describe('getNavigationType', () => {
  it('returns navigate when Performance API is missing', () => {
    expect(getNavigationType(undefined)).toBe('navigate');
  });

  it('reads PerformanceNavigationTiming.type', () => {
    const perf = {
      getEntriesByType: () => [{ type: 'reload' }],
    } as unknown as Performance;
    expect(getNavigationType(perf)).toBe('reload');
  });
});

describe('consumeNotificationAutoOpen', () => {
  function memoryStorage(initial: Record<string, string> = {}) {
    const map = new Map(Object.entries(initial));
    return {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => {
        map.set(k, v);
      },
      map,
    };
  }

  it('opens on first navigate without marking the session yet', () => {
    const session = memoryStorage();
    const local = memoryStorage();
    const open = consumeNotificationAutoOpen({
      id: 'ptd-2026',
      lang: 'en',
      navType: 'navigate',
      storage: { session, local },
    });
    expect(open).toBe(true);
    expect(session.getItem('ptt:notify-auto:ptd-2026:en')).toBeNull();
  });

  it('stays quiet on the next navigate after the session is marked', () => {
    const session = memoryStorage();
    const local = memoryStorage();
    markNotificationAutoOpenShown('ptd-2026', 'en', { session });
    expect(
      consumeNotificationAutoOpen({
        id: 'ptd-2026',
        lang: 'en',
        navType: 'navigate',
        storage: { session, local },
      })
    ).toBe(false);
  });

  it('still auto-opens EN after ES was already shown in the same tab', () => {
    const session = memoryStorage({ 'ptt:notify-auto:ptd-2026:es': '1' });
    const local = memoryStorage();
    expect(
      consumeNotificationAutoOpen({
        id: 'ptd-2026',
        lang: 'en',
        navType: 'navigate',
        storage: { session, local },
      })
    ).toBe(true);
  });

  it('opens on the 5th reload and persists the counter', () => {
    const session = memoryStorage({ 'ptt:notify-auto:ptd-2026:en': '1' });
    const local = memoryStorage({ 'ptt:notify-reloads:ptd-2026:en': '4' });
    expect(
      consumeNotificationAutoOpen({
        id: 'ptd-2026',
        lang: 'en',
        navType: 'reload',
        storage: { session, local },
      })
    ).toBe(true);
    expect(local.getItem('ptt:notify-reloads:ptd-2026:en')).toBe('5');
  });
});

describe('isAutomatedLabBrowser', () => {
  it('detects Lighthouse and PageSpeed user agents', () => {
    expect(
      isAutomatedLabBrowser(
        'Mozilla/5.0 (...) Chrome/120.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse'
      )
    ).toBe(true);
    expect(
      isAutomatedLabBrowser(
        'Mozilla/5.0 (X11; Linux x86_64) PageSpeed Insights'
      )
    ).toBe(true);
  });

  it('allows normal browsers', () => {
    expect(
      isAutomatedLabBrowser(
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36'
      )
    ).toBe(false);
  });
});

describe('scheduleAfterLargestContentfulPaint', () => {
  it('invokes the callback after the settle window when LCP is unsupported', () => {
    const timers = new Map<number, () => void>();
    let nextId = 1;
    const setTimeoutFn = ((fn: () => void, _ms?: number) => {
      const id = nextId++;
      timers.set(id, fn);
      return id as unknown as ReturnType<typeof setTimeout>;
    }) as typeof setTimeout;
    const clearTimeoutFn = ((id: ReturnType<typeof setTimeout>) => {
      timers.delete(id as unknown as number);
    }) as typeof clearTimeout;

    let called = false;
    scheduleAfterLargestContentfulPaint(
      () => {
        called = true;
      },
      {
        settleMs: 10,
        maxWaitMs: 1000,
        setTimeoutFn,
        clearTimeoutFn,
        PerformanceObserverCtor: null,
      }
    );

    expect(called).toBe(false);
    // Flush all pending timers (max wait + settle / load fallback).
    for (const fn of [...timers.values()]) fn();
    expect(called).toBe(true);
  });

  it('cancel prevents the callback', () => {
    const timers = new Map<number, () => void>();
    let nextId = 1;
    const setTimeoutFn = ((fn: () => void) => {
      const id = nextId++;
      timers.set(id, fn);
      return id as unknown as ReturnType<typeof setTimeout>;
    }) as typeof setTimeout;
    const clearTimeoutFn = ((id: ReturnType<typeof setTimeout>) => {
      timers.delete(id as unknown as number);
    }) as typeof clearTimeout;

    let called = false;
    const cancel = scheduleAfterLargestContentfulPaint(
      () => {
        called = true;
      },
      {
        settleMs: 10,
        maxWaitMs: 1000,
        setTimeoutFn,
        clearTimeoutFn,
        PerformanceObserverCtor: null,
      }
    );
    cancel();
    for (const fn of [...timers.values()]) fn();
    expect(called).toBe(false);
  });
});
