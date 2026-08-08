/**
 * Pereira Tech Day agenda — turns the raw `schedule` array from a
 * `pereiraTechDays` entry into flat, serializable view models that the Svelte
 * timeline island can render without touching `astro:content` at runtime.
 *
 * Session slots (`talk` / `keynote` / `panel`) are the interactive ones: each
 * either resolves to a revealed speaker or renders as a numbered
 * "to be revealed" placeholder while the line-up is still under wraps.
 */

import type { CollectionEntry } from 'astro:content';
import { type I18nValue, type Language, tr } from '@/lib/i18n';

export type PtdScheduleSlot =
  CollectionEntry<'pereiraTechDays'>['data']['schedule'][number];

export type PtdScheduleSlotType = PtdScheduleSlot['type'];

/** Slot types that carry a speaker (revealed or pending). */
const SESSION_TYPES = new Set<PtdScheduleSlotType>([
  'talk',
  'keynote',
  'panel',
]);

/** Whether a slot represents a speaker session rather than logistics. */
export const isSessionSlot = (type: PtdScheduleSlotType): boolean =>
  SESSION_TYPES.has(type);

/** Icon key consumed by the timeline; keeps SVG choice out of the data layer. */
export type PtdScheduleIcon =
  | 'mic'
  | 'star'
  | 'bolt'
  | 'users'
  | 'coffee'
  | 'megaphone'
  | 'door'
  | 'ticket'
  | 'gift'
  | 'flag';

const ICON_BY_TYPE: Record<PtdScheduleSlotType, PtdScheduleIcon> = {
  talk: 'mic',
  keynote: 'star',
  lightning: 'bolt',
  panel: 'users',
  break: 'coffee',
  'sponsor-break': 'megaphone',
  'open-doors': 'door',
  registration: 'ticket',
  staff: 'flag',
  opening: 'flag',
  raffle: 'gift',
  closing: 'gift',
};

const TYPE_LABELS: Record<PtdScheduleSlotType, { en: string; es: string }> = {
  talk: { en: 'Talk', es: 'Charla' },
  keynote: { en: 'Keynote', es: 'Keynote' },
  lightning: { en: 'Lightning talks', es: 'Charlas relámpago' },
  panel: { en: 'Panel', es: 'Panel' },
  break: { en: 'Break', es: 'Descanso' },
  'sponsor-break': { en: 'Sponsor break', es: 'Sponsor break' },
  'open-doors': { en: 'Doors open', es: 'Apertura de puertas' },
  registration: { en: 'Registration', es: 'Registro' },
  staff: { en: 'Staff', es: 'Staff' },
  opening: { en: 'Opening', es: 'Apertura' },
  raffle: { en: 'Raffle', es: 'Sorteos' },
  closing: { en: 'Closing', es: 'Cierre' },
};

/** Localized badge label for a slot type. */
export const getScheduleTypeLabel = (
  type: PtdScheduleSlotType,
  lang: Language
): string => TYPE_LABELS[type]?.[lang] ?? type;

/**
 * Format a 24h `HH:mm` string as a 12h label (`8:30 a.m.` / `8:30 AM`).
 * Values that are not `HH:mm` are returned untouched so legacy entries that
 * already stored `"9:15 AM"` keep rendering as authored.
 */
export const formatSlotTime = (time: string, lang: Language): string => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return time;
  const hours = Number(match[1]);
  const minutes = match[2];
  if (hours > 23 || Number(minutes) > 59) return time;
  const suffix =
    hours < 12
      ? lang === 'es'
        ? 'a.m.'
        : 'AM'
      : lang === 'es'
        ? 'p.m.'
        : 'PM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${suffix}`;
};

/** Duration in whole minutes between two `HH:mm` values, or null when unknown. */
export const getSlotDurationMinutes = (
  start: string,
  end?: string
): number | null => {
  const parse = (value?: string): number | null => {
    if (!value) return null;
    const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
    if (!match) return null;
    return Number(match[1]) * 60 + Number(match[2]);
  };
  const from = parse(start);
  const to = parse(end);
  if (from === null || to === null) return null;
  const diff = to - from;
  return diff > 0 ? diff : null;
};

/** Serializable speaker payload handed to the timeline + modal island. */
export interface PtdScheduleSpeakerView {
  slug: string;
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  bio: string;
  profileHref: string;
  social: Array<{ key: string; href: string; label: string }>;
}

/** Serializable agenda row. */
export interface PtdScheduleSlotView {
  key: string;
  type: PtdScheduleSlotType;
  icon: PtdScheduleIcon;
  typeLabel: string;
  timeLabel: string;
  endTimeLabel: string;
  durationLabel: string;
  /** Card heading — talk title, slot title, or the placeholder speaker name. */
  title: string;
  description: string;
  speaker: PtdScheduleSpeakerView | null;
  /** Session slot whose speaker has not been announced yet. */
  pending: boolean;
  /** True for `talk` / `keynote` / `panel` rows (the clickable ones). */
  session: boolean;
}

const SOCIAL_KEYS = [
  'linkedin',
  'twitter',
  'github',
  'website',
  'instagram',
  'mastodon',
  'bluesky',
] as const;

/** Flatten a speaker entry into the plain object the island can serialize. */
export const toSpeakerView = (
  speaker: CollectionEntry<'speakers'>,
  lang: Language,
  urlPrefix: string
): PtdScheduleSpeakerView => {
  const social = speaker.data.social ?? {};
  return {
    slug: speaker.id,
    name: speaker.data.name,
    role: tr(speaker.data.role, lang),
    photo: speaker.data.photo.src,
    photoAlt:
      tr(speaker.data.photo.alt, lang) || `Portrait of ${speaker.data.name}`,
    bio: tr(speaker.data.bio, lang),
    profileHref: `${urlPrefix}/speakers/${speaker.id}/`,
    social: SOCIAL_KEYS.flatMap((key) => {
      const href = social[key];
      if (!href) return [];
      return [{ key, href, label: `${speaker.data.name} — ${key}` }];
    }),
  };
};

interface BuildScheduleOptions {
  lang: Language;
  urlPrefix: string;
  speakers: CollectionEntry<'speakers'>[];
  /** Localized `Speaker {n}` template, e.g. `'Ponente {n}'`. */
  pendingNameTemplate: string;
  /** Localized fallback used when a revealed talk has no title yet. */
  pendingTitleLabel: string;
}

/**
 * Build the agenda view model. Session slots are numbered in chronological
 * order so a placeholder always reads `Ponente 3` even once earlier slots
 * have been revealed.
 */
export const buildScheduleView = (
  schedule: PtdScheduleSlot[],
  { lang, urlPrefix, speakers, pendingNameTemplate }: BuildScheduleOptions
): PtdScheduleSlotView[] => {
  const speakerBySlug = new Map(
    speakers.map((entry) => [entry.id, toSpeakerView(entry, lang, urlPrefix)])
  );
  let sessionIndex = 0;

  return schedule.map((slot, index) => {
    const session = isSessionSlot(slot.type);
    if (session) sessionIndex += 1;

    const speaker = slot.speaker
      ? (speakerBySlug.get(slot.speaker) ?? null)
      : null;
    const pending = session && !speaker;
    const slotTitle = tr(slot.title as I18nValue, lang);
    const duration = getSlotDurationMinutes(slot.time, slot.endTime);

    return {
      key: `${slot.time}-${index}`,
      type: slot.type,
      icon: ICON_BY_TYPE[slot.type] ?? 'mic',
      typeLabel: getScheduleTypeLabel(slot.type, lang),
      timeLabel: formatSlotTime(slot.time, lang),
      endTimeLabel: slot.endTime ? formatSlotTime(slot.endTime, lang) : '',
      durationLabel: duration ? `${duration} min` : '',
      title:
        slotTitle ||
        (pending
          ? pendingNameTemplate.replace('{n}', String(sessionIndex))
          : (speaker?.name ?? slot.talkSlug ?? '')),
      description: tr(slot.description as I18nValue, lang),
      speaker,
      pending,
      session,
    };
  });
};

/** Speaker slugs referenced by an agenda, in order and de-duplicated. */
export const getScheduleSpeakerSlugs = (
  schedule: PtdScheduleSlot[]
): string[] => [
  ...new Set(schedule.flatMap((slot) => (slot.speaker ? [slot.speaker] : []))),
];

/** Count of session slots still waiting for a reveal. */
export const countPendingSessions = (schedule: PtdScheduleSlot[]): number =>
  schedule.filter((slot) => isSessionSlot(slot.type) && !slot.speaker).length;
