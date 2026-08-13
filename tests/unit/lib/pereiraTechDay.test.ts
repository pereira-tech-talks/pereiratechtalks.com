import { describe, expect, it } from 'vitest';
import type { PereiraTechDay } from '@/lib/pereiraTechDay';
import {
  buildEditionThemeCss,
  getEditionCountdownTargets,
  getEditionEndIso,
  getEditionFontPackages,
  getEditionHref,
  getEditionRegistrationUrl,
  getEditionStartDate,
  getEditionStartIso,
  getPtdLandingHref,
  getPublishedFaqs,
  getUpcomingLandingChrome,
  isPereiraTechDayPath,
  isPostponedEdition,
  isSectionSuppressed,
  isUpcomingEdition,
  normalizeLightningTalks,
  PTD_LANDING_SLUG,
  resolveEditionStatus,
} from '@/lib/pereiraTechDay';

const mockEdition = (
  overrides: Partial<PereiraTechDay['data']> = {}
): PereiraTechDay =>
  ({
    id: '2026',
    collection: 'pereiraTechDays',
    data: {
      year: 2026,
      title: { en: 'PTD 2026', es: 'PTD 2026' },
      tagline: { en: 'Tagline', es: 'Tagline' },
      description: { en: 'Desc', es: 'Desc' },
      date: new Date('2026-08-22'),
      startTime: '08:00',
      endTime: '14:00',
      venue: { name: 'UTP', city: 'Pereira', country: 'Colombia' },
      mode: 'in-person',
      hero: { src: '/hero.webp', layout: 'banner' },
      brandKit: {
        paletteLight: {
          primary: '#1f6f73',
          accent: '#e3a648',
          bg: '#f4f9f9',
          bgElevated: '#ffffff',
          text: '#0f2a2c',
          textMuted: '#6e8589',
        },
      },
      schedule: [],
      keynotes: [],
      lightningTalks: [],
      sponsors: [],
      organizers: [],
      collaborators: [],
      communities: [],
      gallery: [],
      aboutTopics: [],
      faqs: [],
      sponsorshipPlans: [],
      extraPartnerships: [],
      status: 'announced',
      draft: false,
      ...overrides,
    },
  }) as PereiraTechDay;

describe('pereiraTechDay helpers', () => {
  it('getEditionStartDate returns single-day date', () => {
    const edition = mockEdition();
    expect(
      getEditionStartDate(edition).toISOString().startsWith('2026-08-22')
    ).toBe(true);
  });

  it('getEditionStartIso combines date and startTime', () => {
    const edition = mockEdition();
    const iso = getEditionStartIso(edition);
    expect(iso).toBe('2026-08-22T08:00:00-05:00');
  });

  it('getEditionEndIso uses endTime on same day', () => {
    const edition = mockEdition();
    const iso = getEditionEndIso(edition);
    expect(iso).toBeDefined();
    expect(iso).toMatch(/2026-08-22/);
  });

  it('getEditionStartIso falls back to date-only ISO when startTime is unset', () => {
    const edition = mockEdition({ startTime: undefined });
    const iso = getEditionStartIso(edition);
    expect(iso).toBe(new Date('2026-08-22').toISOString());
  });

  it('getEditionEndIso resolves from a date-range end when endTime is unset', () => {
    const edition = mockEdition({
      date: { start: new Date('2026-08-22'), end: new Date('2026-08-23') },
      endTime: undefined,
    });
    const iso = getEditionEndIso(edition);
    expect(iso).toBe(new Date('2026-08-23').toISOString());
  });

  it('getEditionEndIso returns undefined for a single-day edition with no endTime', () => {
    const edition = mockEdition({ endTime: undefined });
    expect(getEditionEndIso(edition)).toBeUndefined();
  });

  it('isUpcomingEdition detects announced status', () => {
    expect(isUpcomingEdition(mockEdition({ status: 'announced' }))).toBe(true);
    expect(isUpcomingEdition(mockEdition({ status: 'completed' }))).toBe(false);
  });

  it('isUpcomingEdition detects rsvp-open status', () => {
    expect(isUpcomingEdition(mockEdition({ status: 'rsvp-open' }))).toBe(true);
  });

  it('isUpcomingEdition returns false for cancelled editions', () => {
    expect(isUpcomingEdition(mockEdition({ status: 'cancelled' }))).toBe(false);
  });

  it('getEditionHref uses singular landing for upcoming editions', () => {
    expect(
      getEditionHref(mockEdition({ status: 'rsvp-open', year: 2026 }), 'es')
    ).toBe('/pereira-tech-day/');
    expect(
      getEditionHref(mockEdition({ status: 'announced', year: 2026 }), 'en')
    ).toBe('/en/pereira-tech-day/');
  });

  it('getEditionHref keeps year archive for past editions', () => {
    expect(
      getEditionHref(mockEdition({ status: 'completed', year: 2024 }), 'es')
    ).toBe('/pereira-tech-days/2024/');
    expect(
      getEditionHref(mockEdition({ status: 'completed', year: 2024 }), 'en')
    ).toBe('/en/pereira-tech-days/2024/');
  });

  it('getPtdLandingHref returns the singular landing path', () => {
    expect(PTD_LANDING_SLUG).toBe('pereira-tech-day');
    expect(getPtdLandingHref('es')).toBe('/pereira-tech-day/');
    expect(getPtdLandingHref('en')).toBe('/en/pereira-tech-day/');
  });

  it('buildEditionThemeCss scopes variables under edition year', () => {
    const css = buildEditionThemeCss(mockEdition());
    expect(css).toContain('[data-edition-theme="2026"]');
    expect(css).toContain('--ptt-primary: #1f6f73');
    expect(css).not.toContain('body {');
  });

  it('buildEditionThemeCss emits an optional border variable for light and dark palettes', () => {
    const edition = mockEdition({
      brandKit: {
        paletteLight: {
          primary: '#1f6f73',
          accent: '#e3a648',
          bg: '#f4f9f9',
          bgElevated: '#ffffff',
          text: '#0f2a2c',
          textMuted: '#6e8589',
          border: '#d8e4e4',
        },
        paletteDark: {
          primary: '#3ab9c9',
          accent: '#e3a648',
          bg: '#0f2a2c',
          bgElevated: '#1a3a3d',
          text: '#f4f9f9',
          textMuted: '#a8bdbf',
          border: '#2a4548',
        },
      },
    });
    const css = buildEditionThemeCss(edition);
    expect(css).toContain('--ptt-border: #d8e4e4;');
    expect(css).toContain('--ptt-border: #2a4548;');
  });

  it('buildEditionThemeCss emits heading transform and tracking when declared', () => {
    const edition = mockEdition({
      brandKit: {
        paletteLight: {
          primary: '#1f6f73',
          accent: '#e3a648',
          bg: '#f4f9f9',
          bgElevated: '#ffffff',
          text: '#0f2a2c',
          textMuted: '#6e8589',
        },
        typography: {
          headingFamily: 'Bebas Neue',
          headingTransform: 'uppercase',
          headingTracking: '0.05em',
        },
      },
    });
    const css = buildEditionThemeCss(edition);
    expect(css).toContain('font-family: Bebas Neue;');
    expect(css).toContain('text-transform: uppercase;');
    expect(css).toContain('letter-spacing: 0.05em;');
  });

  it('buildEditionThemeCss stays valid when sectionBackgrounds is set on the edition', () => {
    const edition = mockEdition({
      sectionBackgrounds: {
        about: '/images/pereira-tech-days/2026/about-bg.webp',
        sponsors: '/images/pereira-tech-days/2026/sponsors-bg.webp',
      },
    } as Partial<PereiraTechDay['data']>);
    const css = buildEditionThemeCss(edition);
    expect(css).toContain('[data-edition-theme="2026"]');
    expect(css).toContain('--ptt-primary: #1f6f73');
    expect(css).not.toContain('sectionBackgrounds');
    expect(css).not.toContain('about-bg.webp');
  });

  it('buildEditionThemeCss includes dark palette when defined', () => {
    const edition = mockEdition({
      brandKit: {
        paletteLight: {
          primary: '#1f6f73',
          accent: '#e3a648',
          bg: '#f4f9f9',
          bgElevated: '#ffffff',
          text: '#0f2a2c',
          textMuted: '#6e8589',
        },
        paletteDark: {
          primary: '#3ab9c9',
          accent: '#e3a648',
          bg: '#0f2a2c',
          bgElevated: '#1a3a3d',
          text: '#f4f9f9',
          textMuted: '#a8bdbf',
        },
      },
    });
    const css = buildEditionThemeCss(edition);
    expect(css).toContain('.dark [data-edition-theme="2026"]');
  });

  it('buildEditionThemeCss defaults ui shape vars when brandKit.ui is unset', () => {
    const css = buildEditionThemeCss(mockEdition());
    expect(css).toContain('--ptd-button-radius: 0.75rem;');
    expect(css).toContain('--ptd-card-radius: 1rem;');
  });

  it('buildEditionThemeCss maps declared ui shapes to radius tokens', () => {
    const edition = mockEdition({
      brandKit: {
        paletteLight: {
          primary: '#1f6f73',
          accent: '#e3a648',
          bg: '#f4f9f9',
          bgElevated: '#ffffff',
          text: '#0f2a2c',
          textMuted: '#6e8589',
        },
        ui: { buttonShape: 'pill', cardShape: 'sharp' },
      },
    });
    const css = buildEditionThemeCss(edition);
    expect(css).toContain('--ptd-button-radius: 9999px;');
    expect(css).toContain('--ptd-card-radius: 0;');
  });

  it('buildEditionThemeCss maps square button shape to zero radius', () => {
    const edition = mockEdition({
      brandKit: {
        paletteLight: {
          primary: '#1f6f73',
          accent: '#e3a648',
          bg: '#f4f9f9',
          bgElevated: '#ffffff',
          text: '#0f2a2c',
          textMuted: '#6e8589',
        },
        ui: { buttonShape: 'square' },
      },
    });
    const css = buildEditionThemeCss(edition);
    expect(css).toContain('--ptd-button-radius: 0;');
  });

  it('getEditionFontPackages returns declared npm font packages, deduped', () => {
    const edition = mockEdition({
      brandKit: {
        paletteLight: {
          primary: '#1f6f73',
          accent: '#e3a648',
          bg: '#f4f9f9',
          bgElevated: '#ffffff',
          text: '#0f2a2c',
          textMuted: '#6e8589',
        },
        typography: {
          headingFamily: 'Bebas Neue',
          fontSources: [
            { family: 'Bebas Neue', npmPackage: '@fontsource/bebas-neue' },
            { family: 'Bebas Neue', npmPackage: '@fontsource/bebas-neue' },
          ],
        },
      },
    });
    expect(getEditionFontPackages(edition)).toEqual(['@fontsource/bebas-neue']);
  });

  it('getEditionFontPackages returns an empty array when no fontSources are declared', () => {
    expect(getEditionFontPackages(mockEdition())).toEqual([]);
  });

  it('normalizeLightningTalks accepts legacy slug-only entries', () => {
    const result = normalizeLightningTalks([
      'jonathan-alvarez',
      'sary-libreros',
    ]);
    expect(result).toEqual([
      { speaker: 'jonathan-alvarez' },
      { speaker: 'sary-libreros' },
    ]);
  });

  it('normalizeLightningTalks accepts title-first object entries', () => {
    const result = normalizeLightningTalks([
      {
        speaker: 'jonathan-alvarez',
        title: { en: 'Your first talk', es: 'Tu primera charla' },
      },
    ]);
    expect(result).toEqual([
      {
        speaker: 'jonathan-alvarez',
        title: { en: 'Your first talk', es: 'Tu primera charla' },
      },
    ]);
  });

  // getEditionCountdownTargets — hub countdown helper

  it('getEditionCountdownTargets returns targetDate matching getEditionStartIso', () => {
    const edition = mockEdition();
    const { targetDate } = getEditionCountdownTargets(edition);
    expect(targetDate).toBe(getEditionStartIso(edition));
  });

  it('getEditionCountdownTargets returns endDate matching getEditionEndIso', () => {
    const edition = mockEdition(); // has endTime: '14:00'
    const { endDate } = getEditionCountdownTargets(edition);
    expect(endDate).toBe(getEditionEndIso(edition));
    expect(endDate).toBeDefined();
  });

  it('getEditionCountdownTargets returns endDate undefined for single-day edition with no endTime', () => {
    const edition = mockEdition({ endTime: undefined });
    const { endDate } = getEditionCountdownTargets(edition);
    expect(endDate).toBeUndefined();
  });

  it('getEditionCountdownTargets returns both targetDate and endDate for date-range edition', () => {
    const edition = mockEdition({
      date: { start: new Date('2026-08-22'), end: new Date('2026-08-23') },
      startTime: '09:00',
      endTime: '18:00',
    });
    const { targetDate, endDate } = getEditionCountdownTargets(edition);
    expect(targetDate).toMatch(/2026-08-22/);
    expect(endDate).toMatch(/2026-08-23/);
  });

  it('normalizeLightningTalks accepts a mix of both shapes', () => {
    const result = normalizeLightningTalks([
      'jonathan-alvarez',
      {
        speaker: 'sary-libreros',
        title: '5 Pasos para Conquistar el Mundo Tech',
      },
    ]);
    expect(result).toEqual([
      { speaker: 'jonathan-alvarez' },
      {
        speaker: 'sary-libreros',
        title: '5 Pasos para Conquistar el Mundo Tech',
      },
    ]);
  });
});

describe('getUpcomingLandingChrome', () => {
  it('returns 2026 photocopy modes for upcoming editions', () => {
    expect(getUpcomingLandingChrome(true)).toEqual({
      sponsorsLayout: 'tree-circles',
      faqLayout: 'open-grid',
      portraitStyle: 'circle',
    });
  });

  it('returns 2024 photocopy modes for past editions', () => {
    expect(getUpcomingLandingChrome(false)).toEqual({
      sponsorsLayout: 'gray-cards',
      faqLayout: 'accordion',
      portraitStyle: 'circle',
    });
  });
});

describe('isPereiraTechDayPath', () => {
  it('matches PTD hub and edition routes in ES and EN', () => {
    for (const path of [
      '/pereira-tech-day',
      '/pereira-tech-day/',
      '/pereira-tech-days',
      '/pereira-tech-days/2026',
      '/pereira-tech-days/2026/certificates/abc',
      '/en/pereira-tech-day',
      '/en/pereira-tech-days/2026',
    ]) {
      expect(isPereiraTechDayPath(path)).toBe(true);
    }
  });

  it('does not match the rest of the site', () => {
    for (const path of [
      '/',
      '/en',
      '/en/',
      '/blog',
      '/en/sponsors',
      '/meetups',
    ]) {
      expect(isPereiraTechDayPath(path)).toBe(false);
    }
  });
});

/**
 * The postponed state is a reversible switch: every suppression below must be
 * driven by `status` alone, so that flipping it back restores the site without
 * any other edit. These tests pin that contract.
 */
describe('postponed editions', () => {
  const postponed = (overrides: Partial<PereiraTechDay['data']> = {}) =>
    mockEdition({
      status: 'postponed',
      linkMeetupCom: 'https://luma.com/abc123',
      postponement: {
        since: new Date('2026-08-13'),
        headline: { en: 'Postponed', es: 'Pospuesto' },
        body: { en: 'Body', es: 'Cuerpo' },
        hideSections: ['registration', 'countdown', 'pricing'],
      },
      ...overrides,
    } as Partial<PereiraTechDay['data']>);

  it('isPostponedEdition detects the state', () => {
    expect(isPostponedEdition(postponed())).toBe(true);
    expect(isPostponedEdition(mockEdition({ status: 'rsvp-open' }))).toBe(
      false
    );
  });

  it('keeps the upcoming template so the edition page is not archived', () => {
    expect(isUpcomingEdition(postponed())).toBe(true);
  });

  it('withholds the registration URL without deleting it', () => {
    const edition = postponed();
    expect(getEditionRegistrationUrl(edition)).toBeUndefined();
    // The data itself is untouched — that is what makes restoring cheap.
    expect(edition.data.linkMeetupCom).toBe('https://luma.com/abc123');
  });

  it('publishes the registration URL again once the status is restored', () => {
    const restored = mockEdition({
      status: 'rsvp-open',
      linkMeetupCom: 'https://luma.com/abc123',
    });
    expect(getEditionRegistrationUrl(restored)).toBe('https://luma.com/abc123');
  });

  it('suppresses only the sections listed in hideSections', () => {
    const edition = postponed();
    expect(isSectionSuppressed(edition, 'countdown')).toBe(true);
    expect(isSectionSuppressed(edition, 'pricing')).toBe(true);
    expect(isSectionSuppressed(edition, 'schedule')).toBe(false);
  });

  it('supports suppressing the agenda, line-up, and lightning sections', () => {
    const edition = postponed({
      postponement: {
        since: new Date('2026-08-13'),
        headline: { en: 'Postponed', es: 'Pospuesto' },
        body: { en: 'Body', es: 'Cuerpo' },
        hideSections: ['schedule', 'speakers', 'lightning'],
      },
    } as Partial<PereiraTechDay['data']>);
    expect(isSectionSuppressed(edition, 'schedule')).toBe(true);
    expect(isSectionSuppressed(edition, 'speakers')).toBe(true);
    expect(isSectionSuppressed(edition, 'lightning')).toBe(true);
    expect(isSectionSuppressed(edition, 'pricing')).toBe(false);
  });

  it('never suppresses sections when the edition is not postponed', () => {
    const live = mockEdition({
      status: 'rsvp-open',
      postponement: {
        since: new Date('2026-08-13'),
        headline: { en: 'x', es: 'x' },
        body: { en: 'x', es: 'x' },
        hideSections: ['countdown'],
      },
    } as Partial<PereiraTechDay['data']>);
    expect(isSectionSuppressed(live, 'countdown')).toBe(false);
  });

  it('does not flip to "completed" after the announced date passes', () => {
    // 2027 is well past the mocked 2026-08-22 start date.
    expect(resolveEditionStatus(postponed(), '2027-01-01')).toBe('postponed');
  });

  it('applies whilePostponed FAQ overrides and drops their links', () => {
    const faqs = [
      {
        question: { en: 'How do I register?', es: '¿Cómo me registro?' },
        answer: { en: 'On Luma.', es: 'En Luma.' },
        linkUrl: 'https://luma.com/abc123',
        linkLabel: { en: 'Register', es: 'Inscribirse' },
        whilePostponed: {
          hidden: false,
          answer: { en: 'Closed for now.', es: 'Cerradas por ahora.' },
        },
      },
      {
        question: { en: 'Gone?', es: '¿Eliminada?' },
        answer: { en: 'Yes', es: 'Sí' },
        whilePostponed: { hidden: true },
      },
      {
        question: { en: 'Code of Conduct', es: 'Código de Conducta' },
        answer: { en: 'We follow it.', es: 'Lo seguimos.' },
        linkUrl: '/conduct',
      },
    ];

    const published = getPublishedFaqs(
      postponed({ faqs } as Partial<PereiraTechDay['data']>)
    );

    expect(published).toHaveLength(2);
    expect(published[0]?.answer).toEqual({
      en: 'Closed for now.',
      es: 'Cerradas por ahora.',
    });
    expect(published[0]?.linkUrl).toBeUndefined();
    expect(published[0]?.linkLabel).toBeUndefined();
    // Unrelated links survive — only the overridden entry loses its link.
    expect(published[1]?.linkUrl).toBe('/conduct');
  });

  it('returns FAQs verbatim when the edition is not postponed', () => {
    const faqs = [
      {
        question: { en: 'How do I register?', es: '¿Cómo me registro?' },
        answer: { en: 'On Luma.', es: 'En Luma.' },
        linkUrl: 'https://luma.com/abc123',
        whilePostponed: {
          hidden: false,
          answer: { en: 'Closed.', es: 'Cerradas.' },
        },
      },
    ];
    const live = mockEdition({
      status: 'rsvp-open',
      faqs,
    } as Partial<PereiraTechDay['data']>);
    expect(getPublishedFaqs(live)).toEqual(faqs);
  });
});
