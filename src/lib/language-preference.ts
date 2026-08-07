/**
 * Language preference helpers.
 *
 * PTT follows the same model as xergioalex.com: the URL is the source of
 * truth for language. There is **no** automatic client-side redirect based
 * on `navigator.languages` or a stored preference — that caused PageSpeed's
 * "Clientside Redirect!" modal and hijacked first visits away from Spanish
 * (the community primary).
 *
 * The only navigation this module may request is an explicit `?lang=es|en`
 * override (used by LHCI / shared links that want to pin a language). The
 * header language switcher still writes `localStorage['ptt:lang']` for soft
 * preference tracking, but that value never forces a redirect.
 */

import {
  DEFAULT_LANGUAGE,
  getSupportedLanguages,
  getUrlPrefix,
  isValidLanguage,
  type Language,
} from '@/lib/i18n';

/** localStorage key holding the visitor's last explicit language switch. */
export const LANGUAGE_STORAGE_KEY = 'ptt:lang';

/** Query parameter that forces a language and persists it (e.g. `?lang=en`). */
export const LANGUAGE_QUERY_PARAM = 'lang';

/**
 * Best supported language for a browser's ordered preference list.
 *
 * Matches on the primary subtag, so `es-CO`, `es-419` and `es` all resolve to
 * `es`. Returns the site default when nothing matches.
 *
 * Kept for optional UI hints; it does **not** drive redirects.
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
  /** Value read from localStorage, if any (ignored for redirects). */
  stored?: string | null;
  /** `navigator.languages` (ignored for redirects). */
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
 * Decide whether to navigate for language.
 *
 * Only an explicit `?lang=` may redirect. Browser detection and stored
 * preference never rewrite the URL — same URL-first model as xergioalex.com.
 */
export function resolveLanguageDecision(
  options: ResolveOptions
): LanguageDecision {
  const { currentLang, forced } = options;

  // An explicit `?lang=` always wins and is remembered.
  if (forced && isValidLanguage(forced)) {
    return {
      lang: forced,
      redirectTo: forced === currentLang ? null : homeUrlFor(forced),
      persist: true,
    };
  }

  // URL wins — no auto-negotiation from browser or localStorage.
  return { lang: currentLang, redirectTo: null, persist: false };
}
