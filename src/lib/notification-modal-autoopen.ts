/**
 * Auto-open policy for the top-notification detail modal.
 *
 * Rules (per notification id):
 * 1. First `navigate` in a browser tab session → open once.
 * 2. Later navigations in that session → do not auto-open.
 * 3. Full reloads → open every Nth reload (default 3).
 * 4. `back_forward` / `prerender` → never auto-open.
 *
 * Distinguishes reload vs link navigation via PerformanceNavigationTiming.
 */

export type NavigationType =
  | 'navigate'
  | 'reload'
  | 'back_forward'
  | 'prerender';

export const NOTIFY_AUTO_RELOAD_EVERY = 3;

export const notifyAutoSessionKey = (id: string): string =>
  `ptt:notify-auto:${id}`;

export const notifyAutoReloadKey = (id: string): string =>
  `ptt:notify-reloads:${id}`;

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

function readReloadCount(local: AutoOpenStorage['local'], id: string): number {
  const raw = local.getItem(notifyAutoReloadKey(id));
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
  reloadEvery?: number;
  navType?: NavigationType;
  storage?: AutoOpenStorage;
}): boolean {
  const storage: AutoOpenStorage = options.storage ?? {
    session: sessionStorage,
    local: localStorage,
  };
  const navType = options.navType ?? getNavigationType();
  const sessionKey = notifyAutoSessionKey(options.id);
  const sessionAlreadyShown = storage.session.getItem(sessionKey) === '1';
  const reloadCount = readReloadCount(storage.local, options.id);

  const plan = planNotificationAutoOpen({
    navType,
    sessionAlreadyShown,
    reloadCount,
    reloadEvery: options.reloadEvery,
  });

  if (plan.nextReloadCount !== reloadCount) {
    storage.local.setItem(
      notifyAutoReloadKey(options.id),
      String(plan.nextReloadCount)
    );
  }

  return plan.shouldOpen;
}

/** Persist "already auto-opened this tab session" after a successful open. */
export function markNotificationAutoOpenShown(
  id: string,
  storage: Pick<AutoOpenStorage, 'session'> = { session: sessionStorage }
): void {
  storage.session.setItem(notifyAutoSessionKey(id), '1');
}
