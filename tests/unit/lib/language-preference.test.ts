import { describe, expect, it } from 'vitest';

import {
  homeUrlFor,
  isHomePath,
  matchBrowserLanguage,
  resolveLanguageDecision,
} from '@/lib/language-preference';

// ─── matchBrowserLanguage ──────────────────────────────

describe('matchBrowserLanguage', () => {
  it('matches an exact supported code', () => {
    expect(matchBrowserLanguage(['en'])).toBe('en');
    expect(matchBrowserLanguage(['es'])).toBe('es');
  });

  it('matches on the primary subtag, ignoring the region', () => {
    expect(matchBrowserLanguage(['es-CO'])).toBe('es');
    expect(matchBrowserLanguage(['es-419'])).toBe('es');
    expect(matchBrowserLanguage(['en-GB'])).toBe('en');
  });

  it('is case-insensitive', () => {
    expect(matchBrowserLanguage(['EN-US'])).toBe('en');
  });

  it('respects the browser preference order', () => {
    expect(matchBrowserLanguage(['en-US', 'es-CO'])).toBe('en');
    expect(matchBrowserLanguage(['es-CO', 'en-US'])).toBe('es');
  });

  it('skips unsupported languages and takes the first supported one', () => {
    expect(matchBrowserLanguage(['fr-FR', 'de', 'es-CO'])).toBe('es');
  });

  it('falls back to the default when nothing matches', () => {
    expect(matchBrowserLanguage(['fr', 'de', 'ja'])).toBe('es');
  });

  it('falls back to the default for empty or missing input', () => {
    expect(matchBrowserLanguage([])).toBe('es');
    expect(matchBrowserLanguage(undefined)).toBe('es');
  });
});

// ─── isHomePath / homeUrlFor ───────────────────────────

describe('isHomePath', () => {
  it('recognises the Spanish (root) home', () => {
    expect(isHomePath('/')).toBe(true);
  });

  it('recognises the English home with and without a trailing slash', () => {
    expect(isHomePath('/en')).toBe(true);
    expect(isHomePath('/en/')).toBe(true);
  });

  it('rejects deep paths in either language', () => {
    expect(isHomePath('/about')).toBe(false);
    expect(isHomePath('/en/about')).toBe(false);
    expect(isHomePath('/blog/some-post/')).toBe(false);
  });
});

describe('homeUrlFor', () => {
  it('returns the bare root for the default language', () => {
    expect(homeUrlFor('es')).toBe('/');
  });

  it('returns the prefixed home for a non-default language', () => {
    expect(homeUrlFor('en')).toBe('/en/');
  });
});

// ─── resolveLanguageDecision ───────────────────────────

describe('resolveLanguageDecision', () => {
  it('redirects a first-time English browser from the Spanish root', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/',
      stored: null,
      browserLanguages: ['en-US'],
    });
    expect(d).toEqual({ lang: 'en', redirectTo: '/en/', persist: true });
  });

  it('stays put — and still persists — when the browser already matches', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/',
      stored: null,
      browserLanguages: ['es-CO'],
    });
    expect(d).toEqual({ lang: 'es', redirectTo: null, persist: true });
  });

  it('lets a stored preference beat the browser on later visits', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/',
      stored: 'en',
      browserLanguages: ['es-CO'],
    });
    expect(d).toEqual({ lang: 'en', redirectTo: '/en/', persist: false });
  });

  it('does not re-persist or redirect when the stored preference is already served', () => {
    const d = resolveLanguageDecision({
      currentLang: 'en',
      pathname: '/en/',
      stored: 'en',
      browserLanguages: ['es-CO'],
    });
    expect(d).toEqual({ lang: 'en', redirectTo: null, persist: false });
  });

  it('ignores a corrupt stored value and falls back to the browser', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/',
      stored: 'klingon',
      browserLanguages: ['en'],
    });
    expect(d).toEqual({ lang: 'en', redirectTo: '/en/', persist: true });
  });

  it('never rewrites a deep link, even when the browser disagrees', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/blog/some-post/',
      stored: null,
      browserLanguages: ['en-US'],
    });
    expect(d).toEqual({ lang: 'es', redirectTo: null, persist: false });
  });

  it('never rewrites a deep link even with a conflicting stored preference', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/about',
      stored: 'en',
      browserLanguages: ['en'],
    });
    expect(d.redirectTo).toBeNull();
  });

  it('honours an explicit ?lang= override and remembers it', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/',
      stored: 'es',
      browserLanguages: ['es'],
      forced: 'en',
    });
    expect(d).toEqual({ lang: 'en', redirectTo: '/en/', persist: true });
  });

  it('lets ?lang= win even on a deep link', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/about',
      forced: 'en',
    });
    expect(d.lang).toBe('en');
    expect(d.persist).toBe(true);
  });

  it('ignores an invalid ?lang= value', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/',
      stored: null,
      browserLanguages: ['es'],
      forced: 'zz',
    });
    expect(d.lang).toBe('es');
    expect(d.redirectTo).toBeNull();
  });

  it('cannot loop: the redirect target never equals the page being served', () => {
    for (const current of ['es', 'en'] as const) {
      for (const stored of ['es', 'en'] as const) {
        const d = resolveLanguageDecision({
          currentLang: current,
          pathname: current === 'es' ? '/' : '/en/',
          stored,
        });
        if (d.redirectTo !== null) expect(d.lang).not.toBe(current);
      }
    }
  });
});
