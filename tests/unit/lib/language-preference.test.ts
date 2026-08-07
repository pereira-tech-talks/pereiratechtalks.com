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
  it('does not redirect a first-time English browser away from Spanish root', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/',
      stored: null,
      browserLanguages: ['en-US'],
    });
    expect(d).toEqual({ lang: 'es', redirectTo: null, persist: false });
  });

  it('does not redirect when a stored preference disagrees with the URL', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/',
      stored: 'en',
      browserLanguages: ['es-CO'],
    });
    expect(d).toEqual({ lang: 'es', redirectTo: null, persist: false });
  });

  it('never rewrites a deep link', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/blog/some-post/',
      stored: 'en',
      browserLanguages: ['en-US'],
    });
    expect(d).toEqual({ lang: 'es', redirectTo: null, persist: false });
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
    expect(d.redirectTo).toBe('/en/');
    expect(d.persist).toBe(true);
  });

  it('ignores an invalid ?lang= value', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/',
      stored: null,
      browserLanguages: ['en'],
      forced: 'zz',
    });
    expect(d).toEqual({ lang: 'es', redirectTo: null, persist: false });
  });

  it('stays put when ?lang= matches the page already being served', () => {
    const d = resolveLanguageDecision({
      currentLang: 'es',
      pathname: '/',
      forced: 'es',
    });
    expect(d).toEqual({ lang: 'es', redirectTo: null, persist: true });
  });
});
