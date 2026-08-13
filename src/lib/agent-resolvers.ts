/**
 * Loaders that resolve a page's entity references into the plain data its
 * agent-Markdown serializer needs.
 *
 * Split deliberately from `markdown-for-agents.ts`: the serializers there are
 * pure (data in, string out) and therefore unit-testable without the content
 * layer, while everything async lives here and reuses the existing collection
 * helpers rather than re-querying collections ad hoc.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 7. The contract these feed
 * is `docs/aeo/MARKDOWN_FOR_AGENTS.md`.
 */
import { type CollectionEntry, getCollection } from 'astro:content';

import {
  getPostSlug,
  getReadingTimeFromContent,
  getRelatedPosts,
} from '@/lib/blog';
import { getContributorsBySlugs } from '@/lib/contributor';
import { formatCalendarDate } from '@/lib/dates';
import type { Language } from '@/lib/i18n';
import { resolveI18n } from '@/lib/markdown-for-agents';
import {
  getMeetupBodyMarkdown,
  getMeetupSlug,
  getMeetups,
  type Meetup,
} from '@/lib/meetup';
import {
  getEditionRegistrationUrl,
  getEditions,
  getPublishedFaqs,
  isSectionSuppressed,
  type PereiraTechDay,
} from '@/lib/pereiraTechDay';
import { getSpeakers, getSpeakersBySlugs, type Speaker } from '@/lib/speaker';
import { getEditionSponsors } from '@/lib/sponsor';
import { getTalksByEvent, getTalksBySpeaker, type Talk } from '@/lib/talk';
import { getTranslations } from '@/lib/translations';
import { getVerticals } from '@/lib/vertical';

/** A talk as an agent-Markdown consumer needs it: nothing left as a slug. */
export interface ResolvedTalk {
  slug: string;
  title: string;
  abstract: string;
  speakers: Array<{ slug: string; name: string }>;
  durationMinutes: number;
  type: string;
  recordingUrl?: string;
  date?: string;
}

export interface ResolvedSpeakerRef {
  slug: string;
  name: string;
  role: string;
  /** Present where the page renders a speaker card with prose. */
  bio?: string;
}

export interface ResolvedSponsorRef {
  slug: string;
  name: string;
  tier: string;
  website?: string;
}

export interface ResolvedProgramRef {
  slug: string;
  title: string;
  mission: string;
}

export interface ResolvedMeetupDetail {
  slug: string;
  title: string;
  description: string;
  date: string;
  mode: string;
  status: string;
  venue: { name: string; city: string; country: string; mapUrl?: string };
  hero?: { src: string; alt: string };
  body: string;
  untranslated: boolean;
  talks: ResolvedTalk[];
  speakers: ResolvedSpeakerRef[];
  sponsors: ResolvedSponsorRef[];
  programs: ResolvedProgramRef[];
  gallery: Array<{ src: string; alt: string; caption: string }>;
  links: Array<{ label: string; url: string }>;
  related: Array<{ slug: string; title: string; date: string }>;
}

const isoDate = (d: Date): string => d.toISOString().split('T')[0];

const toResolvedTalk = (
  talk: Talk,
  lang: Language,
  nameBySlug: Map<string, string>
): ResolvedTalk => ({
  slug: talk.id,
  title: resolveI18n(talk.data.title, lang),
  abstract: resolveI18n(talk.data.abstract, lang),
  speakers: talk.data.speakers.map((s) => ({
    slug: s,
    name: nameBySlug.get(s) ?? s,
  })),
  durationMinutes: talk.data.duration,
  type: talk.data.type,
  recordingUrl: talk.data.recording?.url,
  date: talk.data.date ? isoDate(talk.data.date) : undefined,
});

const toResolvedSpeakerRef = (
  speaker: Speaker,
  lang: Language
): ResolvedSpeakerRef => ({
  slug: speaker.id,
  name: speaker.data.name,
  role: resolveI18n(speaker.data.role, lang),
  bio: resolveI18n(speaker.data.bio, lang),
});

/**
 * Everything `/meetups/{slug}.md` needs, matching what the HTML page renders.
 *
 * Speaker slugs are unioned from the meetup's own list and its talks' lists,
 * exactly as `MeetupDetailPage.astro` does, so the two cannot list different
 * people.
 */
export const resolveMeetupDetail = async (
  meetup: Meetup,
  lang: Language
): Promise<ResolvedMeetupDetail> => {
  const slug = getMeetupSlug(meetup);
  const talks = await getTalksByEvent('meetups', slug);

  const speakerSlugs = Array.from(
    new Set([
      ...(meetup.data.speakers ?? []),
      ...talks.flatMap((t) => t.data.speakers),
    ])
  );
  const speakers = await getSpeakersBySlugs(speakerSlugs);
  const nameBySlug = new Map(speakers.map((s) => [s.id, s.data.name]));

  const editionSponsors = await getEditionSponsors(meetup.data.sponsors ?? []);
  const allVerticals = await getVerticals();

  const { body, untranslated } = await getMeetupBodyMarkdown(meetup, lang);

  const heroSrc =
    (lang === 'en' && meetup.data.hero?.srcEn) ||
    meetup.data.hero?.src ||
    meetup.data.heroImage;

  const venue = meetup.data.venue;
  const mapQuery = encodeURIComponent(
    [venue.name, venue.city, venue.country].filter(Boolean).join(', ')
  );

  // Labels are localized here, not in the serializer: the contract requires
  // one language per page, metadata keys included.
  const links: Array<{ label: string; url: string }> = [];
  if (meetup.data.linkRecording)
    links.push({
      label: lang === 'es' ? 'Grabación' : 'Recording',
      url: meetup.data.linkRecording,
    });
  if (meetup.data.linkPhotos)
    links.push({
      label: lang === 'es' ? 'Fotos' : 'Photos',
      url: meetup.data.linkPhotos,
    });
  if (meetup.data.linkMeetupCom) {
    links.push({
      label: meetup.data.linkMeetupCom.includes('luma.com')
        ? 'Luma'
        : 'Meetup.com',
      url: meetup.data.linkMeetupCom,
    });
  }

  // Same-program meetups, nearest first, excluding this one.
  const all = await getMeetups();
  const related = all
    .filter(
      (m) =>
        m.id !== meetup.id &&
        m.data.verticals.some((v) => meetup.data.verticals.includes(v))
    )
    .slice(0, 5)
    .map((m) => ({
      slug: getMeetupSlug(m),
      title: resolveI18n(m.data.title, lang),
      date: isoDate(m.data.date),
    }));

  return {
    slug,
    title: resolveI18n(meetup.data.title, lang),
    description: resolveI18n(meetup.data.description, lang),
    date: isoDate(meetup.data.date),
    mode: meetup.data.mode,
    status: meetup.data.status,
    venue: {
      name: venue.name,
      city: venue.city,
      country: venue.country,
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    },
    hero: heroSrc
      ? {
          src: heroSrc,
          alt:
            resolveI18n(meetup.data.hero?.alt, lang) ||
            resolveI18n(meetup.data.title, lang),
        }
      : undefined,
    body,
    untranslated,
    talks: talks.map((t) => toResolvedTalk(t, lang, nameBySlug)),
    speakers: speakers.map((s) => toResolvedSpeakerRef(s, lang)),
    sponsors: editionSponsors.map((s) => ({
      slug: s.sponsor.id,
      name: resolveI18n(s.sponsor.data.name, lang),
      tier: s.tier,
      website: s.sponsor.data.url,
    })),
    programs: meetup.data.verticals.map((v) => {
      const entry = allVerticals.find((x) => x.id === v);
      return {
        slug: v,
        title: entry ? resolveI18n(entry.data.title, lang) : v,
        mission: entry ? resolveI18n(entry.data.mission, lang) : '',
      };
    }),
    gallery: (meetup.data.gallery ?? []).map((g) => ({
      src: g.src,
      alt: resolveI18n(g.alt, lang),
      caption: resolveI18n(g.caption, lang),
    })),
    links,
    related,
  };
};

export interface ResolvedSpeakerDetail {
  slug: string;
  name: string;
  role: string;
  bio: string;
  pronouns?: string;
  location?: string;
  languages: string[];
  photo: { src: string; alt: string };
  social: Array<{ label: string; url: string }>;
  talks: ResolvedTalk[];
  events: Array<{ collection: string; slug: string; title: string }>;
}

const SOCIAL_LABELS: Record<string, string> = {
  twitter: 'X / Twitter',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  website: 'Website',
  instagram: 'Instagram',
  mastodon: 'Mastodon',
  bluesky: 'Bluesky',
};

/**
 * Everything `/speakers/{slug}.md` needs.
 *
 * The old output had an empty body and no talk history at all — measured at
 * 0.203 coverage, the worst detail type in the build.
 */
export const resolveSpeakerDetail = async (
  speaker: Speaker,
  lang: Language
): Promise<ResolvedSpeakerDetail> => {
  const talks = await getTalksBySpeaker(speaker.id);
  const nameBySlug = new Map<string, string>();
  const coSpeakerSlugs = Array.from(
    new Set(talks.flatMap((t) => t.data.speakers))
  );
  for (const s of await getSpeakersBySlugs(coSpeakerSlugs)) {
    nameBySlug.set(s.id, s.data.name);
  }

  const meetups = await getMeetups();
  const events = Array.from(
    talks
      .flatMap((t) => (t.data.event ? [t.data.event] : []))
      .reduce((map, ev) => {
        const key = `${ev.collection}:${ev.slug}`;
        if (!map.has(key)) {
          const meetup =
            ev.collection === 'meetups'
              ? meetups.find((m) => getMeetupSlug(m) === ev.slug)
              : undefined;
          map.set(key, {
            collection: ev.collection,
            slug: ev.slug,
            title: meetup
              ? resolveI18n(meetup.data.title, lang)
              : ev.collection === 'pereiraTechDays'
                ? `Pereira Tech Day ${ev.slug}`
                : ev.slug.replace(/-/g, ' '),
          });
        }
        return map;
      }, new Map<string, { collection: string; slug: string; title: string }>())
      .values()
  );

  const social = speaker.data.social ?? {};

  return {
    slug: speaker.id,
    name: speaker.data.name,
    role: resolveI18n(speaker.data.role, lang),
    bio: resolveI18n(speaker.data.bio, lang),
    pronouns: speaker.data.pronouns,
    location: speaker.data.location
      ? `${speaker.data.location.city}, ${speaker.data.location.country}`
      : undefined,
    languages: speaker.data.languages,
    photo: {
      src: speaker.data.photo.src,
      alt:
        resolveI18n(speaker.data.photo.alt, lang) ||
        `Portrait of ${speaker.data.name}`,
    },
    social: Object.entries(social)
      .filter((pair): pair is [string, string] => Boolean(pair[1]))
      .map(([key, url]) => ({ label: SOCIAL_LABELS[key] ?? key, url })),
    talks: talks.map((t) => toResolvedTalk(t, lang, nameBySlug)),
    events,
  };
};

export interface ResolvedPostContext {
  author?: { slug: string; name: string; role: string; bio: string };
  related: Array<{
    slug: string;
    title: string;
    description: string;
    date: string;
  }>;
  readingMinutes: number;
  series?: { slug: string; title: string; order: number; total: number };
}

/**
 * The blocks a blog post's HTML renders around its body: the author byline
 * card, the series strip, and the related-articles list. Short posts are
 * mostly these blocks, which is why omitting them put recap posts at 0.28
 * coverage despite a verbatim body.
 */
export const resolvePostContext = async (
  post: CollectionEntry<'blog'>,
  lang: Language
): Promise<ResolvedPostContext> => {
  const authors = await getCollection('authors');
  const authorEntry = authors.find((a) => a.data.slug === post.data.author);

  const relatedPosts = await getRelatedPosts({
    currentPostId: post.id,
    tags: post.data.tags ?? [],
    lang,
    limit: 3,
  });

  let series: ResolvedPostContext['series'];
  if (post.data.series) {
    const allSeries = await getCollection('series');
    const seriesEntry = allSeries.find((s) => s.id === post.data.series);
    const chapters = (await getCollection('blog')).filter(
      (p) => p.id.startsWith(`${lang}/`) && p.data.series === post.data.series
    );
    if (seriesEntry) {
      series = {
        slug: post.data.series,
        title: resolveI18n(seriesEntry.data.title, lang),
        order: post.data.seriesOrder ?? 0,
        total: chapters.length,
      };
    }
  }

  return {
    author: authorEntry
      ? {
          slug: authorEntry.data.slug,
          name: authorEntry.data.name,
          role: resolveI18n(authorEntry.data.role, lang),
          bio: resolveI18n(authorEntry.data.bio, lang),
        }
      : undefined,
    related: relatedPosts.map((p) => ({
      slug: getPostSlug(p.id),
      title: p.data.title,
      description: p.data.description,
      date: isoDate(p.data.pubDate),
    })),
    readingMinutes: getReadingTimeFromContent(post.body ?? ''),
    series,
  };
};

export interface ResolvedEditionDetail {
  year: number;
  title: string;
  tagline: string;
  description: string;
  dateLabel: string;
  mode: string;
  status: string;
  scheduleTentative: boolean;
  venue: { name: string; city: string; country: string; mapUrl: string };
  hero: { src: string; alt: string };
  body: string;
  expectedAttendance?: string;
  aboutTopics: string[];
  schedule: Array<{
    time: string;
    title: string;
    description: string;
    type: string;
    speaker?: { slug: string; name: string };
  }>;
  keynotes: ResolvedSpeakerRef[];
  lightningTalks: Array<{
    title: string;
    speaker?: { slug: string; name: string };
  }>;
  speakers: ResolvedSpeakerRef[];
  organizers: Array<{ slug: string; name: string; role: string }>;
  collaborators: Array<{ slug: string; name: string; role: string }>;
  sponsors: ResolvedSponsorRef[];
  communities: Array<{ name: string; url?: string }>;
  pricing: Array<{
    title: string;
    subtitle: string;
    price: string;
    period: string;
    benefits: string[];
    ctaLabel: string;
    ctaUrl: string;
  }>;
  extraPartnerships: Array<{
    title: string;
    subtitle: string;
    items: string[];
    ctaLabel: string;
    ctaUrl: string;
  }>;
  faqs: Array<{ question: string; answer: string; linkUrl?: string }>;
  /** Present only while the edition is postponed. */
  postponement?: {
    headline: string;
    body: string;
    closing?: string;
    /** Pre-formatted byline, e.g. "Comunicado publicado el 13 de agosto de 2026." */
    sinceLabel: string;
  };
  gallery: Array<{ src: string; alt: string; caption: string }>;
  links: Array<{ label: string; url: string }>;
}

/**
 * Everything a Pereira Tech Day landing page renders.
 *
 * Editions measured 0.26-0.33 and the `/pereira-tech-day` alias 0.056 — the
 * worst pages in the build — because the `.md` carried only metadata plus a
 * slug-shaped schedule.
 */
export const resolveEditionDetail = async (
  edition: PereiraTechDay,
  lang: Language
): Promise<ResolvedEditionDetail> => {
  const d = edition.data;

  const scheduleSpeakerSlugs = d.schedule
    .map((s) => s.speaker)
    .filter((s): s is string => Boolean(s));
  const lightningSlugs = d.lightningTalks.map((t) =>
    typeof t === 'string' ? t : t.speaker
  );
  const allSpeakerSlugs = Array.from(
    new Set([...d.keynotes, ...scheduleSpeakerSlugs, ...lightningSlugs])
  );
  const speakerEntries = await getSpeakersBySlugs(allSpeakerSlugs);
  const speakerBySlug = new Map(speakerEntries.map((s) => [s.id, s]));
  const nameOf = (slug: string) => speakerBySlug.get(slug)?.data.name ?? slug;

  const organizers = await getContributorsBySlugs(d.organizers);
  const collaborators = await getContributorsBySlugs(d.collaborators);
  const editionSponsors = await getEditionSponsors(d.sponsors);

  const dateLabel =
    d.date instanceof Date
      ? isoDate(d.date)
      : `${isoDate(d.date.start)} – ${isoDate(d.date.end)}`;

  const mapQuery = encodeURIComponent(
    [d.venue.name, d.venue.city, d.venue.country].filter(Boolean).join(', ')
  );

  const links: Array<{ label: string; url: string }> = [];
  if (d.linkRecording)
    links.push({
      label: lang === 'es' ? 'Grabaciones' : 'Recordings',
      url: d.linkRecording,
    });
  // Gated the same way as the HTML: a postponed edition must not hand agents a
  // registration link the site itself no longer offers.
  const registrationUrl = getEditionRegistrationUrl(edition);
  if (registrationUrl)
    links.push({
      label: registrationUrl.includes('luma.com') ? 'Luma' : 'Meetup.com',
      url: registrationUrl,
    });

  return {
    year: d.year,
    title: resolveI18n(d.title, lang),
    tagline: resolveI18n(d.tagline, lang),
    description: resolveI18n(d.description, lang),
    dateLabel,
    mode: d.mode,
    status: d.status,
    postponement:
      d.status === 'postponed' && d.postponement
        ? {
            headline: resolveI18n(d.postponement.headline, lang),
            body: resolveI18n(d.postponement.body, lang),
            closing: resolveI18n(d.postponement.closing, lang) || undefined,
            sinceLabel: getTranslations(lang).ptdPage.postponedSince.replace(
              '{date}',
              formatCalendarDate(d.postponement.since, lang)
            ),
          }
        : undefined,
    scheduleTentative: d.scheduleTentative,
    venue: {
      name: d.venue.name,
      city: d.venue.city,
      country: d.venue.country,
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    },
    hero: {
      src: d.hero.src,
      alt: resolveI18n(d.hero.alt, lang) || resolveI18n(d.title, lang),
    },
    body: edition.body ?? '',
    expectedAttendance: resolveI18n(d.expectedAttendance, lang) || undefined,
    aboutTopics: d.aboutTopics.map((topic) => resolveI18n(topic, lang)),
    /*
     * Sections suppressed on the page are suppressed here too — the `.md` twin
     * is a mirror of what the site publishes, not of the raw entry. The data
     * stays in the YAML either way.
     */
    schedule: isSectionSuppressed(edition, 'schedule')
      ? []
      : d.schedule.map((slot) => ({
          time: slot.endTime ? `${slot.time}–${slot.endTime}` : slot.time,
          title: resolveI18n(slot.title, lang) || slot.talkSlug || slot.type,
          description: resolveI18n(slot.description, lang),
          type: slot.type,
          speaker: slot.speaker
            ? { slug: slot.speaker, name: nameOf(slot.speaker) }
            : undefined,
        })),
    keynotes: d.keynotes.map((slug) => ({
      slug,
      name: nameOf(slug),
      role: resolveI18n(speakerBySlug.get(slug)?.data.role, lang),
    })),
    lightningTalks: isSectionSuppressed(edition, 'lightning')
      ? []
      : d.lightningTalks.map((talk) =>
          typeof talk === 'string'
            ? {
                title: nameOf(talk),
                speaker: { slug: talk, name: nameOf(talk) },
              }
            : {
                title: resolveI18n(talk.title, lang),
                speaker: { slug: talk.speaker, name: nameOf(talk.speaker) },
              }
        ),
    speakers: isSectionSuppressed(edition, 'speakers')
      ? []
      : speakerEntries.map((s) => toResolvedSpeakerRef(s, lang)),
    organizers: organizers.map((c) => ({
      slug: c.id,
      name: c.data.name,
      role: resolveI18n(c.data.role, lang),
    })),
    collaborators: collaborators.map((c) => ({
      slug: c.id,
      name: c.data.name,
      role: resolveI18n(c.data.role, lang),
    })),
    sponsors: editionSponsors.map((s) => ({
      slug: s.sponsor.id,
      name: resolveI18n(s.sponsor.data.name, lang),
      tier: s.tier,
      website: s.sponsor.data.url,
    })),
    communities: d.communities.map((c) => ({ name: c.name, url: c.url })),
    pricing: d.sponsorshipPlans.map((plan) => ({
      title: resolveI18n(plan.title, lang),
      subtitle: resolveI18n(plan.subtitle, lang),
      price: plan.price,
      period: resolveI18n(plan.period, lang),
      benefits: plan.benefits.map((b) => resolveI18n(b, lang)),
      ctaLabel: resolveI18n(plan.ctaLabel, lang),
      ctaUrl: plan.ctaUrl,
    })),
    extraPartnerships: d.extraPartnerships.map((group) => ({
      title: resolveI18n(group.title, lang),
      subtitle: resolveI18n(group.subtitle, lang),
      items: group.items.map((item) =>
        resolveI18n(
          'title' in item
            ? item.title
            : 'description' in item
              ? item.description
              : item.subtitle,
          lang
        )
      ),
      ctaLabel: resolveI18n(group.ctaLabel, lang),
      ctaUrl: group.ctaUrl,
    })),
    faqs: getPublishedFaqs(edition).map((faq) => ({
      question: resolveI18n(faq.question, lang),
      answer: resolveI18n(faq.answer, lang),
      linkUrl: faq.linkUrl,
    })),
    gallery: d.gallery.map((g) => ({
      src: g.src,
      alt: resolveI18n(g.alt, lang),
      caption: resolveI18n(g.caption, lang),
    })),
    links,
  };
};

/** The edition the `/pereira-tech-day` alias currently points at. */
export const resolveCurrentEdition = async (): Promise<
  PereiraTechDay | undefined
> => {
  const editions = await getEditions();
  return editions[0];
};
