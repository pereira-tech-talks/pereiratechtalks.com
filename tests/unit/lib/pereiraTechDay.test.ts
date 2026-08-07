import { describe, expect, it } from 'vitest';
import type { PereiraTechDay } from '@/lib/pereiraTechDay';
import {
  buildEditionThemeCss,
  getEditionEndIso,
  getEditionFontPackages,
  getEditionStartDate,
  getEditionStartIso,
  isUpcomingEdition,
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
    expect(iso).toMatch(/2026-08-22/);
  });

  it('getEditionEndIso uses endTime on same day', () => {
    const edition = mockEdition();
    const iso = getEditionEndIso(edition);
    expect(iso).toBeDefined();
    expect(iso).toMatch(/2026-08-22/);
  });

  it('isUpcomingEdition detects announced status', () => {
    expect(isUpcomingEdition(mockEdition({ status: 'announced' }))).toBe(true);
    expect(isUpcomingEdition(mockEdition({ status: 'completed' }))).toBe(false);
  });

  it('buildEditionThemeCss scopes variables under edition year', () => {
    const css = buildEditionThemeCss(mockEdition());
    expect(css).toContain('[data-edition-theme="2026"]');
    expect(css).toContain('--ptt-primary: #1f6f73');
    expect(css).not.toContain('body {');
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
});
