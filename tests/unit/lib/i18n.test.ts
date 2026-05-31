import { describe, expect, it } from 'vitest';

import {
  getAlternateUrls,
  getDateLocale,
  getDefaultLanguage,
  getFlag,
  getLangFromUrl,
  getLanguageConfig,
  getLocalizedUrl,
  getOGLocale,
  getSupportedLanguages,
  getUrlPrefix,
  isDefaultLanguage,
  isValidLanguage,
  stripLangPrefix,
} from '@/lib/i18n';

// ─── getSupportedLanguages ─────────────────────────────

describe('getSupportedLanguages', () => {
  it('returns an array containing "en" and "es"', () => {
    const languages = getSupportedLanguages();
    expect(languages).toContain('en');
    expect(languages).toContain('es');
  });

  it('returns exactly 2 supported languages', () => {
    expect(getSupportedLanguages()).toHaveLength(2);
  });
});

// ─── getLanguageConfig ─────────────────────────────────

describe('getLanguageConfig', () => {
  it('returns correct config for English', () => {
    const config = getLanguageConfig('en');
    expect(config.code).toBe('en');
    expect(config.name).toBe('English');
    expect(config.nativeName).toBe('English');
    expect(config.dateLocale).toBe('en-US');
    expect(config.ogLocale).toBe('en_US');
    expect(config.urlPrefix).toBe('');
  });

  it('returns correct config for Spanish', () => {
    const config = getLanguageConfig('es');
    expect(config.code).toBe('es');
    expect(config.name).toBe('Spanish');
    expect(config.nativeName).toBe('Español');
    expect(config.dateLocale).toBe('es-ES');
    expect(config.ogLocale).toBe('es_ES');
    expect(config.urlPrefix).toBe('/es');
  });

  it('includes all required fields in each config', () => {
    for (const lang of getSupportedLanguages()) {
      const config = getLanguageConfig(lang);
      expect(config).toHaveProperty('code');
      expect(config).toHaveProperty('name');
      expect(config).toHaveProperty('nativeName');
      expect(config).toHaveProperty('dateLocale');
      expect(config).toHaveProperty('ogLocale');
      expect(config).toHaveProperty('flag');
      expect(config).toHaveProperty('urlPrefix');
    }
  });
});

// ─── getDefaultLanguage ────────────────────────────────

describe('getDefaultLanguage', () => {
  it('returns "en" as the default language', () => {
    expect(getDefaultLanguage()).toBe('en');
  });
});

// ─── isValidLanguage ───────────────────────────────────

describe('isValidLanguage', () => {
  it('returns true for "en"', () => {
    expect(isValidLanguage('en')).toBe(true);
  });

  it('returns true for "es"', () => {
    expect(isValidLanguage('es')).toBe(true);
  });

  it('returns false for "fr" (unsupported)', () => {
    expect(isValidLanguage('fr')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidLanguage('')).toBe(false);
  });

  it('returns false for "EN" (case-sensitive)', () => {
    expect(isValidLanguage('EN')).toBe(false);
  });

  it('returns false for random string', () => {
    expect(isValidLanguage('xyz')).toBe(false);
  });
});

// ─── isDefaultLanguage ─────────────────────────────────

describe('isDefaultLanguage', () => {
  it('returns true for "en"', () => {
    expect(isDefaultLanguage('en')).toBe(true);
  });

  it('returns false for "es"', () => {
    expect(isDefaultLanguage('es')).toBe(false);
  });
});

// ─── getUrlPrefix ──────────────────────────────────────

describe('getUrlPrefix', () => {
  it('returns empty string for default language "en"', () => {
    expect(getUrlPrefix('en')).toBe('');
  });

  it('returns "/es" for Spanish', () => {
    expect(getUrlPrefix('es')).toBe('/es');
  });
});

// ─── getDateLocale ─────────────────────────────────────

describe('getDateLocale', () => {
  it('returns "en-US" for English', () => {
    expect(getDateLocale('en')).toBe('en-US');
  });

  it('returns "es-ES" for Spanish', () => {
    expect(getDateLocale('es')).toBe('es-ES');
  });
});

// ─── getOGLocale ───────────────────────────────────────

describe('getOGLocale', () => {
  it('returns "en_US" for English', () => {
    expect(getOGLocale('en')).toBe('en_US');
  });

  it('returns "es_ES" for Spanish', () => {
    expect(getOGLocale('es')).toBe('es_ES');
  });
});

// ─── getFlag ───────────────────────────────────────────

describe('getFlag', () => {
  it('returns a non-empty string for each language', () => {
    for (const lang of getSupportedLanguages()) {
      expect(getFlag(lang)).toBeTruthy();
      expect(typeof getFlag(lang)).toBe('string');
    }
  });

  it('returns different flags for different languages', () => {
    expect(getFlag('en')).not.toBe(getFlag('es'));
  });
});

// ─── getLocalizedUrl ───────────────────────────────────

describe('getLocalizedUrl', () => {
  it('returns path unchanged for English (no prefix)', () => {
    expect(getLocalizedUrl('/about', 'en')).toBe('/about');
  });

  it('prepends /es for Spanish', () => {
    expect(getLocalizedUrl('/about', 'es')).toBe('/es/about');
  });

  it('handles root path for English', () => {
    expect(getLocalizedUrl('/', 'en')).toBe('/');
  });

  it('handles root path for Spanish', () => {
    expect(getLocalizedUrl('/', 'es')).toBe('/es/');
  });

  it('adds leading slash if missing', () => {
    expect(getLocalizedUrl('about', 'en')).toBe('/about');
    expect(getLocalizedUrl('about', 'es')).toBe('/es/about');
  });

  it('handles nested paths', () => {
    expect(getLocalizedUrl('/blog/my-post', 'es')).toBe('/es/blog/my-post');
  });
});

// ─── stripLangPrefix ───────────────────────────────────

describe('stripLangPrefix', () => {
  it('strips /es prefix from path', () => {
    expect(stripLangPrefix('/es/about')).toBe('/about');
  });

  it('returns root when stripping language-only path', () => {
    expect(stripLangPrefix('/es')).toBe('/');
  });

  it('returns root when stripping language path with trailing slash', () => {
    expect(stripLangPrefix('/es/')).toBe('/');
  });

  it('keeps English paths unchanged (no prefix to strip)', () => {
    expect(stripLangPrefix('/about')).toBe('/about');
  });

  it('keeps root path unchanged', () => {
    expect(stripLangPrefix('/')).toBe('/');
  });

  it('strips prefix from nested paths', () => {
    expect(stripLangPrefix('/es/blog/my-post')).toBe('/blog/my-post');
  });
});

// ─── getLangFromUrl ────────────────────────────────────

describe('getLangFromUrl', () => {
  it('returns "es" from Spanish path', () => {
    expect(getLangFromUrl('/es/about')).toBe('es');
  });

  it('returns "en" (default) from English path', () => {
    expect(getLangFromUrl('/about')).toBe('en');
  });

  it('returns "en" from root path', () => {
    expect(getLangFromUrl('/')).toBe('en');
  });

  it('returns "es" from Spanish root', () => {
    expect(getLangFromUrl('/es')).toBe('es');
  });

  it('returns "es" from Spanish root with trailing slash', () => {
    expect(getLangFromUrl('/es/')).toBe('es');
  });

  it('returns "en" for blog paths without language prefix', () => {
    expect(getLangFromUrl('/blog/my-post')).toBe('en');
  });

  it('returns "es" for Spanish blog paths', () => {
    expect(getLangFromUrl('/es/blog/my-post')).toBe('es');
  });
});

// ─── getAlternateUrls ──────────────────────────────────

describe('getAlternateUrls', () => {
  it('returns URLs for all supported languages', () => {
    const urls = getAlternateUrls('/about');
    expect(urls).toHaveLength(getSupportedLanguages().length);
  });

  it('generates correct alternate URLs for an English page', () => {
    const urls = getAlternateUrls('/about');
    const enUrl = urls.find((u) => u.lang === 'en');
    const esUrl = urls.find((u) => u.lang === 'es');
    expect(enUrl?.url).toBe('/about');
    expect(esUrl?.url).toBe('/es/about');
  });

  it('generates correct alternate URLs from a Spanish page', () => {
    const urls = getAlternateUrls('/es/about');
    const enUrl = urls.find((u) => u.lang === 'en');
    const esUrl = urls.find((u) => u.lang === 'es');
    expect(enUrl?.url).toBe('/about');
    expect(esUrl?.url).toBe('/es/about');
  });

  it('handles root path', () => {
    const urls = getAlternateUrls('/');
    const enUrl = urls.find((u) => u.lang === 'en');
    const esUrl = urls.find((u) => u.lang === 'es');
    expect(enUrl?.url).toBe('/');
    expect(esUrl?.url).toBe('/es/');
  });

  it('each entry has lang and url properties', () => {
    const urls = getAlternateUrls('/blog');
    for (const entry of urls) {
      expect(entry).toHaveProperty('lang');
      expect(entry).toHaveProperty('url');
      expect(typeof entry.lang).toBe('string');
      expect(typeof entry.url).toBe('string');
    }
  });
});
