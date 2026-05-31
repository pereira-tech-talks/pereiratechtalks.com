import { getCollection, type CollectionEntry } from 'astro:content';

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
  year: number,
): Promise<PereiraTechDay | undefined> => {
  const all = await getEditions();
  return all.find((e) => e.data.year === year);
};

export const getLatestEdition = async (): Promise<PereiraTechDay | undefined> => {
  const all = await getEditions();
  return all[0];
};

export const getUpcomingEdition = async (): Promise<PereiraTechDay | undefined> => {
  const now = Date.now();
  const all = await getEditions();
  return all.find((e) => {
    const d = e.data.date;
    const t = d instanceof Date ? d.getTime() : d.start.getTime();
    return t >= now && e.data.status !== 'cancelled' && e.data.status !== 'completed';
  });
};

/**
 * Build a CSS rule for the edition's per-edition theme scope, suitable for
 * injection into <style> in the edition page layout. The selector is
 * [data-edition-theme="{year}"] and never leaks outside that scope.
 */
export const buildEditionThemeCss = (edition: PereiraTechDay): string => {
  const { brandKit, year } = edition.data;
  const lines: string[] = [];
  const lightLines: string[] = [
    `--ptt-primary: ${brandKit.paletteLight.primary};`,
    `--ptt-accent: ${brandKit.paletteLight.accent};`,
    `--ptt-bg: ${brandKit.paletteLight.bg};`,
    `--ptt-bg-elevated: ${brandKit.paletteLight.bgElevated};`,
    `--ptt-text: ${brandKit.paletteLight.text};`,
    `--ptt-text-muted: ${brandKit.paletteLight.textMuted};`,
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
