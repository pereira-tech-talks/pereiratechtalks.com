import { describe, expect, it } from 'vitest';
import { getSupportedLanguages } from '@/lib/i18n';
import {
  getDefaultLanguage,
  getTranslations,
  isValidLanguage,
} from '@/lib/translations';

// ─── Helper: Extract all deep keys from a nested object ─

function getDeepKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return getDeepKeys(value as Record<string, unknown>, fullKey);
    }
    return [fullKey];
  });
}

function getDeepValues(obj: Record<string, unknown>): unknown[] {
  return Object.values(obj).flatMap((value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return getDeepValues(value as Record<string, unknown>);
    }
    return [value];
  });
}

// ─── getTranslations ───────────────────────────────────

describe('getTranslations', () => {
  it('returns a non-null object for "en"', () => {
    const t = getTranslations('en');
    expect(t).toBeDefined();
    expect(typeof t).toBe('object');
  });

  it('returns a non-null object for "es"', () => {
    const t = getTranslations('es');
    expect(t).toBeDefined();
    expect(typeof t).toBe('object');
  });

  it('returned objects have expected top-level keys', () => {
    const t = getTranslations('en');
    expect(t).toHaveProperty('nav');
    expect(t).toHaveProperty('footer');
    expect(t).toHaveProperty('hero');
    expect(t).toHaveProperty('siteTitle');
    expect(t).toHaveProperty('siteDescription');
    expect(t).toHaveProperty('contact');
    expect(t).toHaveProperty('aboutPage');
  });

  it('returns different string values for different languages', () => {
    const en = getTranslations('en');
    const es = getTranslations('es');
    expect(en.nav.home).not.toBe(es.nav.home);
    expect(en.siteDescription).not.toBe(es.siteDescription);
  });

  it('returns translations for all supported languages', () => {
    for (const lang of getSupportedLanguages()) {
      const t = getTranslations(lang);
      expect(t).toBeDefined();
      expect(t.siteTitle).toBeTruthy();
    }
  });
});

// ─── Structural completeness ───────────────────────────

describe('structural completeness', () => {
  const enKeys = getDeepKeys(
    getTranslations('en') as unknown as Record<string, unknown>
  );
  const esKeys = getDeepKeys(
    getTranslations('es') as unknown as Record<string, unknown>
  );

  it('English and Spanish have the same number of leaf keys', () => {
    expect(enKeys.length).toBe(esKeys.length);
  });

  it('no keys in English are missing from Spanish', () => {
    const esKeySet = new Set(esKeys);
    const missingInEs = enKeys.filter((k) => !esKeySet.has(k));
    expect(missingInEs).toEqual([]);
  });

  it('no keys in Spanish are missing from English', () => {
    const enKeySet = new Set(enKeys);
    const missingInEn = esKeys.filter((k) => !enKeySet.has(k));
    expect(missingInEn).toEqual([]);
  });

  it('both languages have a meaningful number of translation keys', () => {
    // Ensure we're not testing empty objects
    expect(enKeys.length).toBeGreaterThan(50);
    expect(esKeys.length).toBeGreaterThan(50);
  });
});

// ─── Value quality ─────────────────────────────────────

describe('value quality', () => {
  it('no empty string values in English translations', () => {
    const values = getDeepValues(
      getTranslations('en') as unknown as Record<string, unknown>
    );
    const emptyStrings = values.filter((v) => v === '');
    expect(emptyStrings).toEqual([]);
  });

  it('no empty string values in Spanish translations', () => {
    const values = getDeepValues(
      getTranslations('es') as unknown as Record<string, unknown>
    );
    const emptyStrings = values.filter((v) => v === '');
    expect(emptyStrings).toEqual([]);
  });

  it('all string leaf values are non-null and non-undefined', () => {
    for (const lang of getSupportedLanguages()) {
      const values = getDeepValues(
        getTranslations(lang) as unknown as Record<string, unknown>
      );
      const stringValues = values.filter((v) => typeof v === 'string');
      for (const val of stringValues) {
        expect(val).not.toBeNull();
        expect(val).not.toBeUndefined();
      }
    }
  });
});

// ─── Re-exports ────────────────────────────────────────

describe('re-exports from translations/index.ts', () => {
  it('isValidLanguage is re-exported and works', () => {
    expect(isValidLanguage('en')).toBe(true);
    expect(isValidLanguage('fr')).toBe(false);
  });

  it('getDefaultLanguage is re-exported and returns "en"', () => {
    expect(getDefaultLanguage()).toBe('en');
  });
});
