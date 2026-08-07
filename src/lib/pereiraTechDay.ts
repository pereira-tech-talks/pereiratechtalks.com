import { type CollectionEntry, getCollection } from 'astro:content';

import { combineCalendarDateAndTime } from '@/lib/dates';
import { getUrlPrefix, type Language } from '@/lib/i18n';

export type PereiraTechDay = CollectionEntry<'pereiraTechDays'>;

const filterDrafts = (entry: PereiraTechDay): boolean => {
  if (import.meta.env.PROD) return entry.data.draft !== true;
  return true;
};

const sortByYearDesc = (a: PereiraTechDay, b: PereiraTechDay): number =>
  b.data.year - a.data.year;

export const getEditions = async (): Promise<PereiraTechDay[]> => {
  const all = await getCollection('pereiraTechDays');
  return all.filter(filterDrafts).sort(sortByYearDesc);
};

export const getEditionByYear = async (
  year: number
): Promise<PereiraTechDay | undefined> => {
  const all = await getEditions();
  return all.find((e) => e.data.year === year);
};

export const getLatestEdition = async (): Promise<
  PereiraTechDay | undefined
> => {
  const all = await getEditions();
  return all[0];
};

export const getUpcomingEdition = async (): Promise<
  PereiraTechDay | undefined
> => {
  const now = Date.now();
  const all = await getEditions();
  return all.find((e) => {
    const d = e.data.date;
    const t = d instanceof Date ? d.getTime() : d.start.getTime();
    return (
      t >= now && e.data.status !== 'cancelled' && e.data.status !== 'completed'
    );
  });
};

/** Maps `brandKit.ui.buttonShape` to the CSS radius consumed via `--ptd-button-radius`. */
const BUTTON_RADIUS_BY_SHAPE: Record<string, string> = {
  pill: '9999px',
  rounded: '0.75rem',
  square: '0',
};

/** Maps `brandKit.ui.cardShape` to the CSS radius consumed via `--ptd-card-radius`. */
const CARD_RADIUS_BY_SHAPE: Record<string, string> = {
  rounded: '1rem',
  sharp: '0',
};

export const buildEditionThemeCss = (edition: PereiraTechDay): string => {
  const { brandKit, year } = edition.data;
  const lines: string[] = [];
  const buttonShape = brandKit.ui?.buttonShape ?? 'rounded';
  const cardShape = brandKit.ui?.cardShape ?? 'rounded';
  const lightLines: string[] = [
    `--ptt-primary: ${brandKit.paletteLight.primary};`,
    `--ptt-accent: ${brandKit.paletteLight.accent};`,
    `--ptt-bg: ${brandKit.paletteLight.bg};`,
    `--ptt-bg-elevated: ${brandKit.paletteLight.bgElevated};`,
    `--ptt-text: ${brandKit.paletteLight.text};`,
    `--ptt-text-muted: ${brandKit.paletteLight.textMuted};`,
    `--ptd-button-radius: ${BUTTON_RADIUS_BY_SHAPE[buttonShape]};`,
    `--ptd-card-radius: ${CARD_RADIUS_BY_SHAPE[cardShape]};`,
  ];
  if (brandKit.paletteLight.border) {
    lightLines.push(`--ptt-border: ${brandKit.paletteLight.border};`);
  }
  lines.push(`[data-edition-theme="${year}"] {`);
  lines.push(...lightLines.map((l) => `  ${l}`));
  lines.push('}');

  if (brandKit.paletteDark) {
    const darkLines: string[] = [
      `--ptt-primary: ${brandKit.paletteDark.primary};`,
      `--ptt-accent: ${brandKit.paletteDark.accent};`,
      `--ptt-bg: ${brandKit.paletteDark.bg};`,
      `--ptt-bg-elevated: ${brandKit.paletteDark.bgElevated};`,
      `--ptt-text: ${brandKit.paletteDark.text};`,
      `--ptt-text-muted: ${brandKit.paletteDark.textMuted};`,
    ];
    if (brandKit.paletteDark.border) {
      darkLines.push(`--ptt-border: ${brandKit.paletteDark.border};`);
    }
    lines.push(`.dark [data-edition-theme="${year}"] {`);
    lines.push(...darkLines.map((l) => `  ${l}`));
    lines.push('}');
  }

  if (brandKit.typography?.headingFamily) {
    lines.push(`[data-edition-theme="${year}"] :is(h1, h2, h3, h4, h5, h6) {`);
    lines.push(`  font-family: ${brandKit.typography.headingFamily};`);
    if (brandKit.typography.headingTransform) {
      lines.push(`  text-transform: ${brandKit.typography.headingTransform};`);
    }
    if (brandKit.typography.headingTracking) {
      lines.push(`  letter-spacing: ${brandKit.typography.headingTracking};`);
    }
    lines.push('}');
  }

  return lines.join('\n');
};

/** Resolve edition start date as a Date (handles single-day and range shapes). */
export const getEditionStartDate = (edition: PereiraTechDay): Date => {
  const d = edition.data.date;
  return d instanceof Date ? d : d.start;
};

/** Resolve edition end date when the entry uses a date range. */
export const getEditionEndDate = (edition: PereiraTechDay): Date | null => {
  const d = edition.data.date;
  return d instanceof Date ? null : d.end;
};

/** ISO timestamp for countdown / JSON-LD start, combining date + optional startTime. */
export const getEditionStartIso = (edition: PereiraTechDay): string => {
  const start = getEditionStartDate(edition);
  const time = edition.data.startTime;
  if (time) {
    return combineCalendarDateAndTime(start, time);
  }
  return start.toISOString();
};

/** ISO timestamp for event end (date + endTime or same-day fallback). */
export const getEditionEndIso = (
  edition: PereiraTechDay
): string | undefined => {
  const endDate = getEditionEndDate(edition);
  const time = edition.data.endTime;
  const base = endDate ?? getEditionStartDate(edition);
  if (time) {
    return combineCalendarDateAndTime(base, time);
  }
  if (endDate) return endDate.toISOString();
  return undefined;
};

/**
 * Returns countdown ISO timestamps for the hub's `PtdCountdown variant="hub"`.
 * Wraps `getEditionStartIso` / `getEditionEndIso` so call-sites stay simple.
 */
export const getEditionCountdownTargets = (
  edition: PereiraTechDay
): { targetDate: string; endDate?: string } => ({
  targetDate: getEditionStartIso(edition),
  endDate: getEditionEndIso(edition),
});

/** Whether the edition is the upcoming flagship template (announced / RSVP). */
export const isUpcomingEdition = (edition: PereiraTechDay): boolean =>
  edition.data.status === 'announced' || edition.data.status === 'rsvp-open';

/** Singular public landing slug for the current/upcoming flagship edition. */
export const PTD_LANDING_SLUG = 'pereira-tech-day';

/** Href for the singular landing (`/pereira-tech-day` or `/en/pereira-tech-day`). */
export const getPtdLandingHref = (lang: Language): string =>
  `${getUrlPrefix(lang)}/${PTD_LANDING_SLUG}/`;

/**
 * Public href for an edition page.
 * Upcoming editions use the singular landing; past editions stay under
 * `/pereira-tech-days/{year}/`.
 */
export const getEditionHref = (
  edition: PereiraTechDay,
  lang: Language
): string => {
  const prefix = getUrlPrefix(lang);
  if (isUpcomingEdition(edition)) {
    return `${prefix}/${PTD_LANDING_SLUG}/`;
  }
  return `${prefix}/pereira-tech-days/${edition.data.year}/`;
};

/**
 * De-duplicated list of npm font packages declared by the edition's
 * `brandKit.typography.fontSources`. Used to decide whether `PtdEditionFonts`
 * needs to load a webfont for this edition at all.
 */
export const getEditionFontPackages = (edition: PereiraTechDay): string[] => {
  const sources = edition.data.brandKit.typography?.fontSources ?? [];
  const packages = sources
    .map((source) => source.npmPackage)
    .filter((pkg): pkg is string => Boolean(pkg));
  return [...new Set(packages)];
};

export type LightningTalkEntry =
  PereiraTechDay['data']['lightningTalks'][number];

/** Normalized lightning talk: a speaker slug plus an optional title-first payload. */
export interface NormalizedLightningTalk {
  speaker: string;
  title?: string | { en?: string; es?: string };
}

/**
 * Normalizes `lightningTalks` entries, which accept either a legacy speaker
 * slug string or a `{ speaker, title }` object (Task 3 — title-first UI).
 */
export const normalizeLightningTalks = (
  entries: LightningTalkEntry[]
): NormalizedLightningTalk[] =>
  entries.map((entry) =>
    typeof entry === 'string' ? { speaker: entry } : entry
  );

/** Upcoming (2026 photocopy) vs past (2024 photocopy) landing chrome modes. */
export type PtdSponsorsLayout = 'gray-cards' | 'tree-circles';
export type PtdFaqLayout = 'accordion' | 'open-grid';
export type PtdPortraitStyle = 'circle' | 'square';

export interface UpcomingLandingChrome {
  sponsorsLayout: PtdSponsorsLayout;
  faqLayout: PtdFaqLayout;
  portraitStyle: PtdPortraitStyle;
}

/**
 * Status-based chrome for edition landings — never branch on year in callers.
 * Upcoming → 2026-style tree circles / open FAQ / circular portraits.
 * Past → 2024-style gray cards / accordion / circular portraits.
 */
export const getUpcomingLandingChrome = (
  isUpcoming: boolean
): UpcomingLandingChrome =>
  isUpcoming
    ? {
        sponsorsLayout: 'tree-circles',
        faqLayout: 'open-grid',
        portraitStyle: 'circle',
      }
    : {
        sponsorsLayout: 'gray-cards',
        faqLayout: 'accordion',
        portraitStyle: 'circle',
      };
