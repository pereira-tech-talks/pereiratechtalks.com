import { type CollectionEntry, getCollection } from 'astro:content';
import type { Language } from '@/lib/i18n';
import { getUrlPrefix, tr } from '@/lib/i18n';

export type Notification = CollectionEntry<'notifications'>;

export type NotificationData = Notification['data'];

/**
 * Pure filter: active flag + inclusive date window + priority sort (desc).
 * `endsAt` is exclusive of moments strictly after the end instant.
 */
export const filterActiveNotifications = (
  entries: readonly Notification[],
  now: Date = new Date()
): Notification[] => {
  const t = now.getTime();
  return entries
    .filter((entry) => {
      if (!entry.data.active) return false;
      const start = entry.data.startsAt.getTime();
      const end = entry.data.endsAt.getTime();
      return t >= start && t <= end;
    })
    .sort((a, b) => b.data.priority - a.data.priority);
};

export const getActiveNotifications = async (
  now: Date = new Date()
): Promise<Notification[]> => {
  const all = await getCollection('notifications');
  return filterActiveNotifications(all, now);
};

export type LocalizedNotification = {
  id: string;
  severity: NotificationData['severity'];
  title: string;
  summary: string;
  body?: string;
  image?: { src: string; alt: string };
  ctaLabel?: string;
  ctaHref?: string;
  /** Extra actions, already localized (label + language-correct href). */
  ctas: Array<{ label: string; href: string }>;
  modalEnabled: boolean;
};

/**
 * Prefix an internal path for the requested language.
 *
 * Notification hrefs are authored once, unprefixed (`/call-for-speakers`), so
 * without this an English visitor clicking the CTA landed on the Spanish page.
 * External URLs and paths that already carry the prefix are left alone.
 */
export const localizeNotificationHref = (
  href: string,
  lang: Language
): string => {
  if (/^https?:\/\//i.test(href)) return href;
  const prefix = getUrlPrefix(lang);
  if (!prefix) return href;
  return href === prefix || href.startsWith(`${prefix}/`)
    ? href
    : `${prefix}${href}`;
};

export const localizeNotification = (
  entry: Notification,
  lang: Language
): LocalizedNotification => {
  const { data } = entry;
  return {
    id: entry.id,
    severity: data.severity,
    title: data.title[lang],
    summary: data.summary[lang],
    body: data.body?.[lang],
    image: data.image
      ? { src: tr(data.image.src, lang), alt: data.image.alt[lang] }
      : undefined,
    ctaLabel: data.ctaLabel?.[lang],
    ctaHref: data.ctaHref
      ? localizeNotificationHref(data.ctaHref, lang)
      : undefined,
    ctas: (data.ctas ?? []).map((cta) => ({
      label: cta.label[lang],
      href: localizeNotificationHref(cta.href, lang),
    })),
    modalEnabled: data.modalEnabled,
  };
};
