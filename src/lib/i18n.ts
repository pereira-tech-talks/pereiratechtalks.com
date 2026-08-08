/**
 * Centralized i18n configuration module.
 *
 * This is the single source of truth for language configuration.
 *
 * Routing: Spanish (the community's primary language) is served at the root
 * with no prefix; English lives under `/en`. Every URL prefix is derived from
 * the LANGUAGES registry below — never hardcode `'/es'` or `'/en'` in a
 * component, use `getUrlPrefix(lang)` so a future swap stays a one-line change.
 *
 * To add a new language:
 *   1. Add the code to the Language type union
 *   2. Add an entry to the LANGUAGES registry below (non-empty urlPrefix)
 *   3. Add translations in translations.ts
 *   4. Create page wrappers in src/pages/{lang}/
 */

/**
 * Supported language codes.
 * Extend this union to add new languages.
 */
export type Language = 'en' | 'es';

/**
 * Default (fallback) language — used when no language prefix is detected.
 *
 * Spanish is the community's primary language, so it is served at the site
 * root (`/`) with no prefix; English is first-class international and lives
 * under `/en`. The default language MUST be the one whose `urlPrefix` is `''`.
 */
export const DEFAULT_LANGUAGE: Language = 'es';

/** Metadata for a supported language */
export interface LanguageConfig {
  /** ISO language code */
  code: Language;
  /** English name */
  name: string;
  /** Native name (displayed in language selector) */
  nativeName: string;
  /** BCP 47 locale for date formatting (e.g. 'en-US') */
  dateLocale: string;
  /** OpenGraph locale (e.g. 'en_US') */
  ogLocale: string;
  /** Flag emoji for UI display */
  flag: string;
  /** URL path prefix (empty string for default language) */
  urlPrefix: string;
}

/**
 * Language registry — add new languages here.
 * The default language MUST have an empty urlPrefix.
 */
export const LANGUAGES: Record<Language, LanguageConfig> = {
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Espa\u00F1ol',
    dateLocale: 'es-CO',
    ogLocale: 'es_CO',
    flag: '\u{1F1EA}\u{1F1F8}',
    urlPrefix: '',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dateLocale: 'en-US',
    ogLocale: 'en_US',
    flag: '\u{1F1EC}\u{1F1E7}',
    urlPrefix: '/en',
  },
};

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

/** Get all supported language codes */
export function getSupportedLanguages(): Language[] {
  return Object.keys(LANGUAGES) as Language[];
}

/** Get metadata for a specific language */
export function getLanguageConfig(lang: Language): LanguageConfig {
  return LANGUAGES[lang];
}

/** Get the default language */
export function getDefaultLanguage(): Language {
  return DEFAULT_LANGUAGE;
}

/** Check if a string is a valid language code */
export function isValidLanguage(value: string): value is Language {
  return value in LANGUAGES;
}

/** Check if a language is the default language */
export function isDefaultLanguage(lang: Language): boolean {
  return lang === DEFAULT_LANGUAGE;
}

/** Get URL prefix for a language (empty string for default) */
export function getUrlPrefix(lang: Language): string {
  return LANGUAGES[lang].urlPrefix;
}

/** Get BCP 47 date locale string */
export function getDateLocale(lang: Language): string {
  return LANGUAGES[lang].dateLocale;
}

/** Get OpenGraph locale string */
export function getOGLocale(lang: Language): string {
  return LANGUAGES[lang].ogLocale;
}

/** Get flag emoji for a language */
export function getFlag(lang: Language): string {
  return LANGUAGES[lang].flag;
}

/** Build a localized URL path */
export function getLocalizedUrl(path: string, lang: Language): string {
  const prefix = getUrlPrefix(lang);
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${cleanPath}`;
}

/** Strip language prefix from a URL path to get the base path */
export function stripLangPrefix(path: string): string {
  for (const lang of getSupportedLanguages()) {
    const prefix = getUrlPrefix(lang);
    if (prefix && (path === prefix || path.startsWith(`${prefix}/`))) {
      return path.slice(prefix.length) || '/';
    }
  }
  return path;
}

/** Detect language from a URL path */
export function getLangFromUrl(pathname: string): Language {
  for (const lang of getSupportedLanguages()) {
    const prefix = getUrlPrefix(lang);
    if (
      prefix &&
      (pathname === prefix ||
        pathname === `${prefix}/` ||
        pathname.startsWith(`${prefix}/`))
    ) {
      return lang;
    }
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Get alternate language URLs for the current path (for hreflang tags and
 * language selector links).
 */
export function getAlternateUrls(
  currentPath: string
): { lang: Language; url: string }[] {
  const basePath = stripLangPrefix(currentPath);
  return getSupportedLanguages().map((lang) => ({
    lang,
    url: getLocalizedUrl(basePath, lang),
  }));
}

/**
 * Bilingual i18n value used by v3 collections (meetups, events, PTDs,
 * verticals, sponsors, etc.) — accepts either a plain string (language-
 * neutral, rendered as-is) or a `{ en, es }` object.
 */
export type I18nValue =
  | string
  | { en?: string; es?: string }
  | undefined
  | null;

/**
 * Resolve an `i18nString` field for a target language, returning a single
 * string. Falls back across languages so callers always get a renderable
 * string when at least one language has content.
 */
export function tr(value: I18nValue, lang: Language): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value.en ?? value.es ?? '';
}
