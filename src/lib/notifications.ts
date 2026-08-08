import { type CollectionEntry, getCollection } from 'astro:content';
import type { Language } from '@/lib/i18n';
import { tr } from '@/lib/i18n';

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
  modalEnabled: boolean;
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
    ctaHref: data.ctaHref,
    modalEnabled: data.modalEnabled,
  };
};
