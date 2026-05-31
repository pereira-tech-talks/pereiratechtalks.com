import { type CollectionEntry, getCollection, getEntry } from 'astro:content';

import { shouldHideDrafts } from './blog';
import { SITE_TIMEZONE } from './constances';

import type { Language } from './i18n';

/** Minimal deck schema for timeline card rendering — leaner than the full CollectionEntry. */
export interface SlideTimelineCardEntry {
  slug: string;
  lang: string;
  title: string;
  description: string;
  pubDate: string;
  heroImage?: string;
  type: 'native' | 'external';
  eventName?: string;
  eventDate?: string;
  externalUrl?: string;
  /** Provider for external decks (e.g. "Speaker Deck", "Google Slides"). */
  provider?: string;
  /** Draft flag — only carried into payloads on dev/preview (prod builds filter drafts upstream). */
  isDraft?: boolean;
}

/**
 * Get the slug from a slide deck ID (removes language prefix and date prefix).
 * e.g., "en/2026-04-25_demo-revealjs-features" -> "demo-revealjs-features"
 */
export function getDeckSlug(id: string): string {
  const parts = id.split('/');
  const filename = parts[parts.length - 1];
  return filename.replace(/^\d{4}-\d{2}-\d{2}_/, '');
}

/**
 * Whether a deck has `draft: true`. Drafts are visible in the dev server and
 * on Cloudflare Pages preview branches, hidden on production main builds.
 */
export function isDraftDeck(deck: CollectionEntry<'slides'>): boolean {
  return deck.data.draft === true;
}

/**
 * Whether a deck's pubDate is in the future (calendar date in SITE_TIMEZONE).
 * Scheduled decks are excluded from production builds but visible in dev mode,
 * mirroring the blog scheduling behaviour.
 */
export function isScheduledDeck(deck: CollectionEntry<'slides'>): boolean {
  const todayInTz = new Date().toLocaleDateString('en-CA', {
    timeZone: SITE_TIMEZONE,
  });
  const pubDateStr = deck.data.pubDate.toISOString().slice(0, 10);
  return pubDateStr > todayInTz;
}

/**
 * Unified visibility predicate for slide decks. Mirrors
 * `isPostVisibleInProduction` in src/lib/blog.ts so listings, detail routes,
 * and the timeline API stay in sync.
 */
export function isDeckVisibleInProduction(
  deck: CollectionEntry<'slides'>
): boolean {
  if (!import.meta.env.DEV && isScheduledDeck(deck)) return false;
  if (isDraftDeck(deck) && shouldHideDrafts()) return false;
  return true;
}

/**
 * Get all slide decks for a specific language.
 * Filters out drafts/scheduled per environment, sorts by pubDate descending.
 */
export async function getSlideDecks(
  lang: Language
): Promise<CollectionEntry<'slides'>[]> {
  const allDecks = await getCollection('slides');

  const filtered = allDecks.filter((deck) => {
    if (!deck.id.startsWith(`${lang}/`)) return false;
    return isDeckVisibleInProduction(deck);
  });

  return filtered.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/**
 * Get a single slide deck by its full collection ID.
 */
export async function getDeckById(
  id: string
): Promise<CollectionEntry<'slides'> | undefined> {
  return getEntry('slides', id);
}

/**
 * Reverse lookup: find a slide deck associated with a blog post.
 *
 * Resolution order:
 *   1. The blog post's own `relatedSlide` frontmatter field (explicit).
 *   2. Scan all decks in this language for one whose `relatedPost` matches
 *      the blog post slug (implicit — the slide knows about the post).
 *
 * Either side can establish the link; if both are set, the post's field wins.
 */
export async function getDeckForPost(
  postSlug: string,
  lang: Language,
  relatedSlide?: string
): Promise<CollectionEntry<'slides'> | undefined> {
  const decks = await getSlideDecks(lang);
  if (relatedSlide) {
    const explicit = decks.find(
      (deck) => getDeckSlug(deck.id) === relatedSlide
    );
    if (explicit) return explicit;
  }
  return decks.find((deck) => deck.data.relatedPost === postSlug);
}

/** Type guard: native deck (authored Markdown, rendered with Reveal.js). */
export function isNativeDeck(
  deck: CollectionEntry<'slides'>
): deck is CollectionEntry<'slides'> & { data: { type: 'native' } } {
  return deck.data.type === 'native';
}

/** Type guard: external deck (stub info page with CTA to external URL). */
export function isExternalDeck(
  deck: CollectionEntry<'slides'>
): deck is CollectionEntry<'slides'> & { data: { type: 'external' } } {
  return deck.data.type === 'external';
}

/**
 * Build a full timeline index for slide decks in a specific language.
 * Returns ALL visible decks as SlideTimelineCardEntry[] (no pagination) — callers paginate client-side.
 * Mirrors getTimelineIndex() in src/lib/blog.ts so the slides timeline component has parity.
 */
export async function getSlidesTimelineIndex(
  lang: Language
): Promise<SlideTimelineCardEntry[]> {
  const decks = await getSlideDecks(lang);

  return decks.map((deck) => {
    const data = deck.data;
    const base: SlideTimelineCardEntry = {
      slug: getDeckSlug(deck.id),
      lang,
      title: data.title,
      description: data.description,
      pubDate: data.pubDate.toISOString(),
      heroImage: data.heroImage,
      type: data.type,
      eventName: data.eventName,
      eventDate: data.eventDate?.toISOString(),
      isDraft: isDraftDeck(deck),
    };

    if (data.type === 'external') {
      base.externalUrl = data.externalUrl;
      base.provider = data.provider;
    }

    return base;
  });
}

/** Map deck type to translation badge key. */
export function getDeckTypeBadgeKey(
  deck: CollectionEntry<'slides'>
): 'native' | 'external' {
  return deck.data.type;
}
