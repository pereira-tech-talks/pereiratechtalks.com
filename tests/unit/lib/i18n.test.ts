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
    expect(config.urlPrefix).toBe('/en');
  });

  it('returns correct config for Spanish', () => {
    const config = getLanguageConfig('es');
    expect(config.code).toBe('es');
    expect(config.name).toBe('Spanish');
    expect(config.nativeName).toBe('Español');
    expect(config.dateLocale).toBe('es-CO');
    expect(config.ogLocale).toBe('es_CO');
    expect(config.urlPrefix).toBe('');
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
  it('returns "es" as the default language', () => {
    expect(getDefaultLanguage()).toBe('es');
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
  it('returns true for "es"', () => {
    expect(isDefaultLanguage('es')).toBe(true);
  });

  it('returns false for "en"', () => {
    expect(isDefaultLanguage('en')).toBe(false);
  });
});

// ─── getUrlPrefix ──────────────────────────────────────

describe('getUrlPrefix', () => {
  it('returns empty string for default language "es"', () => {
    expect(getUrlPrefix('es')).toBe('');
  });

  it('returns "/en" for English', () => {
    expect(getUrlPrefix('en')).toBe('/en');
  });
});

// ─── getDateLocale ─────────────────────────────────────

describe('getDateLocale', () => {
  it('returns "en-US" for English', () => {
    expect(getDateLocale('en')).toBe('en-US');
  });

  it('returns "es-CO" for Spanish', () => {
    expect(getDateLocale('es')).toBe('es-CO');
  });
});

// ─── getOGLocale ───────────────────────────────────────

describe('getOGLocale', () => {
  it('returns "en_US" for English', () => {
    expect(getOGLocale('en')).toBe('en_US');
  });

  it('returns "es_CO" for Spanish', () => {
    expect(getOGLocale('es')).toBe('es_CO');
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
  it('returns path unchanged for Spanish (default, no prefix)', () => {
    expect(getLocalizedUrl('/about', 'es')).toBe('/about');
  });

  it('prepends /en for English', () => {
    expect(getLocalizedUrl('/about', 'en')).toBe('/en/about');
  });

  it('handles root path for Spanish', () => {
    expect(getLocalizedUrl('/', 'es')).toBe('/');
  });

  it('handles root path for English', () => {
    expect(getLocalizedUrl('/', 'en')).toBe('/en/');
  });

  it('adds leading slash if missing', () => {
    expect(getLocalizedUrl('about', 'es')).toBe('/about');
    expect(getLocalizedUrl('about', 'en')).toBe('/en/about');
  });

  it('handles nested paths', () => {
    expect(getLocalizedUrl('/blog/my-post', 'en')).toBe('/en/blog/my-post');
  });
});

// ─── stripLangPrefix ───────────────────────────────────

describe('stripLangPrefix', () => {
  it('strips /en prefix from path', () => {
    expect(stripLangPrefix('/en/about')).toBe('/about');
  });

  it('returns root when stripping language-only path', () => {
    expect(stripLangPrefix('/en')).toBe('/');
  });

  it('returns root when stripping language path with trailing slash', () => {
    expect(stripLangPrefix('/en/')).toBe('/');
  });

  it('keeps Spanish paths unchanged (default has no prefix to strip)', () => {
    expect(stripLangPrefix('/about')).toBe('/about');
  });

  it('keeps root path unchanged', () => {
    expect(stripLangPrefix('/')).toBe('/');
  });

  it('strips prefix from nested paths', () => {
    expect(stripLangPrefix('/en/blog/my-post')).toBe('/blog/my-post');
  });
});

// ─── getLangFromUrl ────────────────────────────────────

describe('getLangFromUrl', () => {
  it('returns "en" from English path', () => {
    expect(getLangFromUrl('/en/about')).toBe('en');
  });

  it('returns "es" (default) from unprefixed path', () => {
    expect(getLangFromUrl('/about')).toBe('es');
  });

  it('returns "es" from root path', () => {
    expect(getLangFromUrl('/')).toBe('es');
  });

  it('returns "en" from English root', () => {
    expect(getLangFromUrl('/en')).toBe('en');
  });

  it('returns "en" from English root with trailing slash', () => {
    expect(getLangFromUrl('/en/')).toBe('en');
  });

  it('returns "es" for blog paths without language prefix', () => {
    expect(getLangFromUrl('/blog/my-post')).toBe('es');
  });

  it('returns "en" for English blog paths', () => {
    expect(getLangFromUrl('/en/blog/my-post')).toBe('en');
  });
});

// ─── getAlternateUrls ──────────────────────────────────

describe('getAlternateUrls', () => {
  it('returns URLs for all supported languages', () => {
    const urls = getAlternateUrls('/about');
    expect(urls).toHaveLength(getSupportedLanguages().length);
  });

  it('generates correct alternate URLs for a Spanish (root) page', () => {
    const urls = getAlternateUrls('/about');
    const enUrl = urls.find((u) => u.lang === 'en');
    const esUrl = urls.find((u) => u.lang === 'es');
    expect(esUrl?.url).toBe('/about');
    expect(enUrl?.url).toBe('/en/about');
  });

  it('generates correct alternate URLs from an English page', () => {
    const urls = getAlternateUrls('/en/about');
    const enUrl = urls.find((u) => u.lang === 'en');
    const esUrl = urls.find((u) => u.lang === 'es');
    expect(esUrl?.url).toBe('/about');
    expect(enUrl?.url).toBe('/en/about');
  });

  it('handles root path', () => {
    const urls = getAlternateUrls('/');
    const enUrl = urls.find((u) => u.lang === 'en');
    const esUrl = urls.find((u) => u.lang === 'es');
    expect(esUrl?.url).toBe('/');
    expect(enUrl?.url).toBe('/en/');
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
