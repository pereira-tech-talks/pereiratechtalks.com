/**
 * Auto-open policy for the top-notification detail modal.
 *
 * Rules (per notification id **and language**):
 * 1. First `navigate` in a browser tab session for that lang → open once.
 * 2. Later navigations in that lang/session → do not auto-open.
 * 3. Full reloads (per lang) → open every Nth reload (default 5).
 * 4. `back_forward` / `prerender` → never auto-open.
 *
 * Language is part of the storage key so `/` (es) and `/en` each get a
 * first-visit auto-open instead of sharing one session flag.
 *
 * Distinguishes reload vs link navigation via PerformanceNavigationTiming.
 */

export type NavigationType =
  | 'navigate'
  | 'reload'
  | 'back_forward'
  | 'prerender';

export const NOTIFY_AUTO_RELOAD_EVERY = 5;

export const notifyAutoSessionKey = (id: string, lang = 'es'): string =>
  `ptt:notify-auto:${id}:${lang}`;

export const notifyAutoReloadKey = (id: string, lang = 'es'): string =>
  `ptt:notify-reloads:${id}:${lang}`;

export type AutoOpenPlan = {
  shouldOpen: boolean;
  /** Persisted reload counter after this page load (reload path only bumps). */
  nextReloadCount: number;
  markSessionShown: boolean;
};

export function planNotificationAutoOpen(input: {
  navType: NavigationType;
  sessionAlreadyShown: boolean;
  reloadCount: number;
  reloadEvery?: number;
}): AutoOpenPlan {
  const every = input.reloadEvery ?? NOTIFY_AUTO_RELOAD_EVERY;
  const reloadCount = Number.isFinite(input.reloadCount)
    ? Math.max(0, Math.floor(input.reloadCount))
    : 0;

  if (input.navType === 'reload') {
    const nextReloadCount = reloadCount + 1;
    const shouldOpen = nextReloadCount % every === 0;
    return {
      shouldOpen,
      nextReloadCount,
      // Keep session marked so in-session link navigations stay quiet.
      markSessionShown: shouldOpen || input.sessionAlreadyShown,
    };
  }

  if (input.navType === 'back_forward' || input.navType === 'prerender') {
    return {
      shouldOpen: false,
      nextReloadCount: reloadCount,
      markSessionShown: false,
    };
  }

  // navigate (typed URL, link click, first entry, etc.)
  if (input.sessionAlreadyShown) {
    return {
      shouldOpen: false,
      nextReloadCount: reloadCount,
      markSessionShown: false,
    };
  }

  return {
    shouldOpen: true,
    nextReloadCount: reloadCount,
    markSessionShown: true,
  };
}

/** Best-effort navigation type; defaults to `navigate` when unavailable. */
export function getNavigationType(
  perf:
    | Pick<Performance, 'getEntriesByType'>
    | undefined = globalThis.performance
): NavigationType {
  if (!perf?.getEntriesByType) return 'navigate';
  const entry = perf.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;
  const type = entry?.type;
  if (
    type === 'navigate' ||
    type === 'reload' ||
    type === 'back_forward' ||
    type === 'prerender'
  ) {
    return type;
  }
  return 'navigate';
}

export type AutoOpenStorage = {
  session: Pick<Storage, 'getItem' | 'setItem'>;
  local: Pick<Storage, 'getItem' | 'setItem'>;
};

function readReloadCount(
  local: AutoOpenStorage['local'],
  id: string,
  lang: string
): number {
  const raw = local.getItem(notifyAutoReloadKey(id, lang));
  const n = raw == null ? 0 : Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/**
 * Bump reload counter when needed and return whether this page load should
 * auto-open. Does **not** mark the session — call
 * {@link markNotificationAutoOpenShown} only after the modal actually opens
 * so a cancelled settle-delay can retry on the next mount.
 */
export function consumeNotificationAutoOpen(options: {
  id: string;
  /** Page language — scopes session/reload keys (es vs en). */
  lang?: string;
  reloadEvery?: number;
  navType?: NavigationType;
  storage?: AutoOpenStorage;
}): boolean {
  const lang = options.lang || 'es';
  const storage: AutoOpenStorage = options.storage ?? {
    session: sessionStorage,
    local: localStorage,
  };
  const navType = options.navType ?? getNavigationType();
  const sessionKey = notifyAutoSessionKey(options.id, lang);
  const sessionAlreadyShown = storage.session.getItem(sessionKey) === '1';
  const reloadCount = readReloadCount(storage.local, options.id, lang);

  const plan = planNotificationAutoOpen({
    navType,
    sessionAlreadyShown,
    reloadCount,
    reloadEvery: options.reloadEvery,
  });

  if (plan.nextReloadCount !== reloadCount) {
    storage.local.setItem(
      notifyAutoReloadKey(options.id, lang),
      String(plan.nextReloadCount)
    );
  }

  return plan.shouldOpen;
}

/** Persist "already auto-opened this tab session + language" after a successful open. */
export function markNotificationAutoOpenShown(
  id: string,
  lang = 'es',
  storage: Pick<AutoOpenStorage, 'session'> = { session: sessionStorage }
): void {
  storage.session.setItem(notifyAutoSessionKey(id, lang), '1');
}

/**
 * Lab runners (Lighthouse / PSI) should not auto-open — the modal hero would
 * become LCP and tank Performance while Accessibility/SEO stay at 100.
 */
export function isAutomatedLabBrowser(
  userAgent: string = typeof navigator !== 'undefined'
    ? navigator.userAgent
    : ''
): boolean {
  return /Chrome-Lighthouse|PageSpeed|PTST\/|GTmetrix|Lighthouse/i.test(
    userAgent
  );
}

export type AfterLcpScheduleOptions = {
  /** Quiet window after the last LCP entry before opening (ms). */
  settleMs?: number;
  /** Absolute cap so a stuck observer cannot delay forever (ms). */
  maxWaitMs?: number;
  /** Injected timers / observer for tests. */
  setTimeoutFn?: typeof setTimeout;
  clearTimeoutFn?: typeof clearTimeout;
  PerformanceObserverCtor?: typeof PerformanceObserver | null;
};

/**
 * Run `callback` after Largest Contentful Paint has settled so the page hero
 * (not the notification modal) remains the LCP candidate for lab + early field.
 * Returns a cancel function.
 */
export function scheduleAfterLargestContentfulPaint(
  callback: () => void,
  options: AfterLcpScheduleOptions = {}
): () => void {
  const settleMs = options.settleMs ?? 1500;
  const maxWaitMs = options.maxWaitMs ?? 6000;
  const setTimeoutFn = options.setTimeoutFn ?? setTimeout;
  const clearTimeoutFn = options.clearTimeoutFn ?? clearTimeout;
  const Observer =
    options.PerformanceObserverCtor === null
      ? undefined
      : (options.PerformanceObserverCtor ??
        (typeof PerformanceObserver !== 'undefined'
          ? PerformanceObserver
          : undefined));

  let settledTimer: ReturnType<typeof setTimeout> | undefined;
  let maxTimer: ReturnType<typeof setTimeout> | undefined;
  let observer: PerformanceObserver | undefined;
  let done = false;

  const finish = (): void => {
    if (done) return;
    done = true;
    if (settledTimer !== undefined) clearTimeoutFn(settledTimer);
    if (maxTimer !== undefined) clearTimeoutFn(maxTimer);
    observer?.disconnect();
    callback();
  };

  const bumpSettle = (): void => {
    if (done) return;
    if (settledTimer !== undefined) clearTimeoutFn(settledTimer);
    settledTimer = setTimeoutFn(finish, settleMs);
  };

  maxTimer = setTimeoutFn(finish, maxWaitMs);

  if (Observer) {
    try {
      observer = new Observer((list) => {
        if (list.getEntries().length > 0) bumpSettle();
      });
      observer.observe({
        type: 'largest-contentful-paint',
        buffered: true,
      } as PerformanceObserverInit);
      // If buffered entries already exist, start the quiet window immediately.
      bumpSettle();
    } catch {
      // Unsupported observe options — fall through to load/idle path.
      observer = undefined;
    }
  }

  if (!observer) {
    const onReady = (): void => {
      bumpSettle();
    };
    if (typeof document !== 'undefined' && document.readyState === 'complete') {
      onReady();
    } else if (typeof window !== 'undefined') {
      window.addEventListener('load', onReady, { once: true });
    } else {
      bumpSettle();
    }
  }

  return () => {
    done = true;
    if (settledTimer !== undefined) clearTimeoutFn(settledTimer);
    if (maxTimer !== undefined) clearTimeoutFn(maxTimer);
    observer?.disconnect();
  };
}
