import { type CollectionEntry, getCollection } from 'astro:content';

import type { Language } from '@/lib/i18n';

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
