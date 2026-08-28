import { type CollectionEntry, getCollection } from 'astro:content';

import { getUrlPrefix, type Language } from '@/lib/i18n';

export type Vertical = CollectionEntry<'verticals'>;

const sortByOrder = (a: Vertical, b: Vertical): number =>
  (a.data.order ?? 0) - (b.data.order ?? 0);

export const getVerticals = async (): Promise<Vertical[]> => {
  const all = await getCollection('verticals');
  return [...all].sort(sortByOrder);
};

export const getActiveVerticals = async (): Promise<Vertical[]> => {
  const all = await getVerticals();
  return all.filter((v) => v.data.status === 'active');
};

/**
 * Does this vertical own a generated page at `/verticals/{slug}`?
 *
 * False when the entry declares its own `href` — its home lives elsewhere, and
 * generating a second page for the same subject is what the field exists to
 * avoid. `getStaticPaths` filters on this, so the route simply does not exist.
 */
export const hasGeneratedVerticalPage = (vertical: Vertical): boolean =>
  !vertical.data.href;

/** The verticals that still get a generated detail page and `.md` twin. */
export const getVerticalsWithPages = async (): Promise<Vertical[]> => {
  const all = await getVerticals();
  return all.filter(hasGeneratedVerticalPage);
};

/**
 * Where to link a vertical, in the reader's language.
 *
 * `/verticals/{slug}` unless the entry points somewhere else — `monthly-meetups`
 * sends readers to `/meetups`, which is a fuller page than a generated one
 * could be. Single source for the card, the home rail, the verticals index and
 * the agent twins, so a link cannot survive in one place after the page it
 * pointed at stopped being generated.
 */
export const resolveVerticalHref = (
  vertical: Vertical,
  lang: Language
): string => {
  const prefix = getUrlPrefix(lang);
  return vertical.data.href
    ? `${prefix}${vertical.data.href}/`
    : `${prefix}/verticals/${vertical.id}/`;
};

/**
 * The Markdown twin a vertical should link to, in the reader's language.
 *
 * The page and its twin move together: a vertical whose home is `/meetups` has
 * its twin at `/meetups.md`, not at `/verticals/monthly-meetups.md`, which is
 * no longer generated. `md:check` compares the two surfaces, so a twin link
 * that outlives its page fails the build rather than rotting quietly.
 */
export const resolveVerticalTwinHref = (
  vertical: Vertical,
  lang: Language
): string => {
  const prefix = getUrlPrefix(lang);
  return vertical.data.href
    ? `${prefix}${vertical.data.href}.md`
    : `${prefix}/verticals/${vertical.id}.md`;
};

export const getVerticalBySlug = async (
  slug: string
): Promise<Vertical | undefined> => {
  const all = await getVerticals();
  return all.find((v) => v.id === slug);
};

/**
 * Which body a vertical page should render, for a given language.
 *
 * Mirrors `getMeetupBodyEntry`: the Spanish body lives on the entry itself and
 * the English body in a `{slug}.en.md` sibling. A missing translation falls
 * back to Spanish, and the caller must label that fallback — a silent fallback
 * is the defect this mechanism replaces.
 */
export interface VerticalBodySelection {
  /** The entry whose body to render — the translation, or the vertical itself. */
  entry: Vertical | CollectionEntry<'verticalBodiesEn'>;
  /** True when English was requested and no translation exists. */
  untranslated: boolean;
}

export const getVerticalBodyEntry = async (
  vertical: Vertical,
  lang: Language
): Promise<VerticalBodySelection> => {
  if (lang !== 'en') {
    return { entry: vertical, untranslated: false };
  }

  const translations = await getCollection('verticalBodiesEn');
  const translated = translations.find((entry) => entry.id === vertical.id);
  if (translated) {
    return { entry: translated, untranslated: false };
  }

  // A vertical defined as YAML (`monthly-meetups.yaml`) has no body in either
  // language. Reporting it as untranslated made the page render "showing the
  // Spanish original" above nothing at all — a notice for prose that does not
  // exist. Only a missing *translation* of real prose is untranslated.
  const hasSpanishBody = Boolean(vertical.body?.trim());
  return { entry: vertical, untranslated: hasSpanishBody };
};
