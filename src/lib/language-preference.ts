/**
 * Browser-language detection with a persisted preference.
 *
 * Behaviour:
 *   1. First visit  — no stored preference: pick the best match for the
 *      browser's languages, persist it, and redirect if it differs from the
 *      page being served.
 *   2. Later visits — a stored preference exists: honour it and ignore the
 *      browser entirely, so an explicit choice always wins.
 *
 * Scope is deliberately limited to the **home page**. Redirecting deep links
 * would hijack shared URLs — someone sending a Spanish article to a friend
 * with an English browser should not have their link silently swapped. Both
 * language versions therefore stay independently reachable and indexable,
 * which is also what keeps hreflang honest.
 *
 * The logic below is pure so it can be unit-tested without a DOM; the thin
 * browser wiring lives in `LanguageRedirect.astro`.
 */

import {
  DEFAULT_LANGUAGE,
  getSupportedLanguages,
  getUrlPrefix,
  isValidLanguage,
  type Language,
} from '@/lib/i18n';

/** localStorage key holding the visitor's explicit or first-visit language. */
export const LANGUAGE_STORAGE_KEY = 'ptt:lang';

/** Query parameter that forces a language and persists it (e.g. `?lang=en`). */
export const LANGUAGE_QUERY_PARAM = 'lang';

/**
 * Best supported language for a browser's ordered preference list.
 *
 * Matches on the primary subtag, so `es-CO`, `es-419` and `es` all resolve to
 * `es`. Returns the site default when nothing matches.
 */
export function matchBrowserLanguage(
  browserLanguages: readonly string[] | undefined
): Language {
  const supported = getSupportedLanguages();
  for (const raw of browserLanguages ?? []) {
    const primary = raw.toLowerCase().split('-')[0];
    const hit = supported.find((l) => l === primary);
    if (hit) return hit;
  }
  return DEFAULT_LANGUAGE;
}

/** True when `pathname` is a home page for any supported language. */
export function isHomePath(pathname: string): boolean {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;
  if (normalized === '' || normalized === '/') return true;
  return getSupportedLanguages().some((l) => {
    const prefix = getUrlPrefix(l);
    return prefix !== '' && normalized === prefix;
  });
}

/** Home URL for a language (`/` for the default, `/en/` otherwise). */
export function homeUrlFor(lang: Language): string {
  const prefix = getUrlPrefix(lang);
  return prefix === '' ? '/' : `${prefix}/`;
}

export interface ResolveOptions {
  /** Language of the page currently being served. */
  currentLang: Language;
  /** `window.location.pathname`. */
  pathname: string;
  /** Value read from localStorage, if any. */
  stored?: string | null;
  /** `navigator.languages` (or `[navigator.language]`). */
  browserLanguages?: readonly string[];
  /** Value of the `?lang=` query parameter, if present. */
  forced?: string | null;
}

export interface LanguageDecision {
  /** Language the visitor should end up on. */
  lang: Language;
  /** URL to navigate to, or `null` to stay put. */
  redirectTo: string | null;
  /** Whether `lang` should be written to localStorage. */
  persist: boolean;
}

/**
 * Decide which language the visitor should see and whether to navigate.
 *
 * Never returns a redirect to the page already being served, so it cannot
 * loop: after a redirect the target page's `currentLang` equals the stored
 * preference and the next evaluation is a no-op.
 */
export function resolveLanguageDecision(
  options: ResolveOptions
): LanguageDecision {
  const { currentLang, pathname, stored, browserLanguages, forced } = options;

  // An explicit `?lang=` always wins and is remembered.
  if (forced && isValidLanguage(forced)) {
    return {
      lang: forced,
      redirectTo: forced === currentLang ? null : homeUrlFor(forced),
      persist: true,
    };
  }

  // Deep links are never rewritten — only the home page negotiates language.
  if (!isHomePath(pathname)) {
    return { lang: currentLang, redirectTo: null, persist: false };
  }

  // Later visits: the stored choice wins outright.
  if (stored && isValidLanguage(stored)) {
    return {
      lang: stored,
      redirectTo: stored === currentLang ? null : homeUrlFor(stored),
      persist: false,
    };
  }

  // First visit: fall back to the browser, and remember the result.
  const detected = matchBrowserLanguage(browserLanguages);
  return {
    lang: detected,
    redirectTo: detected === currentLang ? null : homeUrlFor(detected),
    persist: true,
  };
}
