import type { CollectionEntry } from 'astro:content';
import { SITE_URL } from '@/lib/constances';
import { DEFAULT_LANGUAGE, getUrlPrefix, isValidLanguage } from '@/lib/i18n';
import { navHref, navLabel, SITE_NAVIGATION } from '@/lib/site-navigation';

/**
 * The Site Navigation block every agent-Markdown output ends with.
 *
 * Derived from `@/lib/site-navigation` — the same structure the footer renders —
 * so it cannot drift from the live site. It previously duplicated the structure
 * here and had gone stale: it linked `/talks` (a 301 to `/meetups/`) and was
 * missing `/communities`, `/calendar` and `/slides`.
 */
function generateSiteNavigation(lang: string): string {
  const heading = lang === 'es' ? 'Navegación del Sitio' : 'Site Navigation';
  const lines: string[] = ['', '---', '', `## ${heading}`, ''];

  for (const group of SITE_NAVIGATION) {
    lines.push(`**${group.title[lang] ?? group.title.en}:**`);
    for (const entry of group.entries) {
      lines.push(`- [${navLabel(entry, lang)}](${navHref(entry, lang)})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

interface PostSerializeOptions {
  slug: string;
  lang: string;
  /** Resolved author — the HTML renders a byline card, so the .md must too. */
  author?: { slug: string; name: string; role: string; bio: string };
  /** Resolved related posts, matching the "you might also like" block. */
  related?: Array<{
    slug: string;
    title: string;
    description: string;
    date: string;
  }>;
  /** Reading time in minutes, as shown in the HTML header. */
  readingMinutes?: number;
  /** Series context when the post belongs to one. */
  series?: {
    slug: string;
    title: string;
    order: number;
    total: number;
  };
}

interface BlogIndexEntry {
  title: string;
  slug: string;
  description: string;
  pubDate: Date;
  tags?: string[];
}

interface BlogIndexOptions {
  lang: string;
  title: string;
  description: string;
}

interface PageSerializeOptions {
  slug: string;
  lang: string;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * URL prefix for a language, derived from the i18n registry rather than
 * assuming which language sits at the root. Spanish is the default and is
 * served unprefixed; English lives under `/en`.
 */
function buildUrlPrefix(lang: string): string {
  return getUrlPrefix(isValidLanguage(lang) ? lang : DEFAULT_LANGUAGE);
}

/**
 * Serialize a blog post to agent-friendly Markdown.
 * Returns clean Markdown with metadata header + original body.
 */
export function serializePostToAgentMarkdown(
  post: CollectionEntry<'blog'>,
  options: PostSerializeOptions
): string {
  const { slug, lang, author, related, readingMinutes, series } = options;
  const { title, description, pubDate, updatedDate, tags, heroImage } =
    post.data;
  const prefix = buildUrlPrefix(lang);
  const canonicalUrl = `${SITE_URL}${prefix}/blog/${slug}`;
  const L = (key: AgentMdLabelKey) => mdLabel(lang, key);

  const lines: string[] = [];

  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`> ${description}`);
  lines.push('');
  lines.push(`Published: ${formatDate(pubDate)}`);
  if (updatedDate) {
    lines.push(`Updated: ${formatDate(updatedDate)}`);
  }
  lines.push(`Language: ${lang}`);
  lines.push(`Canonical: ${canonicalUrl}`);
  if (tags && tags.length > 0) {
    lines.push(`Tags: ${tags.join(', ')}`);
  }
  if (heroImage) {
    lines.push(`Hero Image: ${SITE_URL}${heroImage}`);
  }
  if (author) {
    lines.push(`${lang === 'es' ? 'Autor' : 'Author'}: ${author.name}`);
  }
  if (typeof readingMinutes === 'number') {
    lines.push(
      `${lang === 'es' ? 'Lectura' : 'Reading time'}: ${readingMinutes} min`
    );
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  if (post.body) {
    lines.push(post.body.trim());
    lines.push('');
  }

  if (heroImage) {
    lines.push(`## ${L('hero')}`);
    lines.push('');
    lines.push(imageLine(title, heroImage));
    lines.push('');
  }

  if (series) {
    lines.push(`## ${lang === 'es' ? 'Serie' : 'Series'}`);
    lines.push('');
    lines.push(
      entityLine(
        series.title,
        mdHref(lang, `blog/series/${series.slug}`),
        `${lang === 'es' ? 'Capítulo' : 'Chapter'} ${series.order} / ${series.total}`
      )
    );
    lines.push('');
  }

  if (author) {
    lines.push(`## ${lang === 'es' ? 'Autor' : 'Author'}`);
    lines.push('');
    lines.push(
      entityLine(author.name, mdHref(lang, 'contributors'), author.role)
    );
    if (author.bio) {
      lines.push('');
      lines.push(author.bio);
    }
    lines.push('');
  }

  if (related && related.length > 0) {
    lines.push(
      `## ${lang === 'es' ? 'Artículos relacionados' : 'Related articles'}`
    );
    lines.push('');
    for (const post of related) {
      lines.push(
        entityLine(
          post.title,
          mdHref(lang, `blog/${post.slug}`),
          post.description,
          post.date
        )
      );
    }
    lines.push('');
  }

  lines.push(generateSiteNavigation(lang));

  return `${lines.join('\n')}\n`;
}

/**
 * Serialize a blog index listing to agent-friendly Markdown.
 * Returns a list of posts with links to their .md versions.
 */
export function serializeBlogIndexToMarkdown(
  entries: BlogIndexEntry[],
  options: BlogIndexOptions
): string {
  const { lang, title, description } = options;
  const prefix = buildUrlPrefix(lang);
  const canonicalUrl = `${SITE_URL}${prefix}/blog`;

  const lines: string[] = [];

  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`> ${description}`);
  lines.push('');
  lines.push(`Language: ${lang}`);
  lines.push(`Canonical: ${canonicalUrl}`);
  lines.push(`Total posts: ${entries.length}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Posts');
  lines.push('');

  for (const entry of entries) {
    const postMdUrl = `${prefix}/blog/${entry.slug}.md`;
    const date = formatDate(entry.pubDate);
    lines.push(
      `- [${entry.title}](${postMdUrl}) — ${entry.description} (${date})`
    );
  }

  lines.push(generateSiteNavigation(lang));

  return `${lines.join('\n')}\n`;
}

interface SeriesIndexEntry {
  title: string;
  slug: string;
  description: string;
  seriesOrder: number;
}

interface SeriesIndexOptions {
  slug: string;
  seriesTitle: string;
  seriesDescription: string;
  lang: string;
}

/**
 * Serialize a series index listing to agent-friendly Markdown.
 * Returns an ordered list of chapters with links to their .md versions.
 */
export function serializeSeriesIndexToMarkdown(
  entries: SeriesIndexEntry[],
  options: SeriesIndexOptions
): string {
  const { slug, seriesTitle, seriesDescription, lang } = options;
  const prefix = buildUrlPrefix(lang);
  const canonicalUrl = `${SITE_URL}${prefix}/blog/series/${slug}`;

  const lines: string[] = [];

  lines.push(`# ${seriesTitle}`);
  lines.push('');
  if (seriesDescription) {
    lines.push(`> ${seriesDescription}`);
    lines.push('');
  }
  lines.push(`Language: ${lang}`);
  lines.push(`Canonical: ${canonicalUrl}`);
  lines.push(`Total chapters: ${entries.length}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Chapters');
  lines.push('');

  const sorted = [...entries].sort((a, b) => a.seriesOrder - b.seriesOrder);
  for (const entry of sorted) {
    const postMdUrl = `${prefix}/blog/${entry.slug}.md`;
    lines.push(
      `${entry.seriesOrder}. [${entry.title}](${postMdUrl}) — ${entry.description}`
    );
  }

  lines.push(generateSiteNavigation(lang));

  return `${lines.join('\n')}\n`;
}

interface SeriesListingEntry {
  slug: string;
  title: string;
  description: string;
  postCount: number;
  order: number;
}

interface SeriesListingOptions {
  lang: string;
  title: string;
  description: string;
}

/**
 * Serialize the series landing page (list of all series) to agent-friendly
 * Markdown. Returns an ordered list with links to each series' own .md index.
 */
export function serializeSeriesListingToMarkdown(
  entries: SeriesListingEntry[],
  options: SeriesListingOptions
): string {
  const { lang, title, description } = options;
  const prefix = buildUrlPrefix(lang);
  const canonicalUrl = `${SITE_URL}${prefix}/blog/series`;

  const lines: string[] = [];

  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`> ${description}`);
  lines.push('');
  lines.push(`Language: ${lang}`);
  lines.push(`Canonical: ${canonicalUrl}`);
  lines.push(
    `${lang === 'es' ? 'Total de series' : 'Total series'}: ${entries.length}`
  );
  lines.push('');
  lines.push('---');
  lines.push('');
  // The listing page's own prose. Without it the .md was a bare link list
  // against a page that explains what a series is — 0.29 coverage.
  lines.push(description);
  lines.push('');
  lines.push(`## ${lang === 'es' ? 'Series' : 'Series'}`);
  lines.push('');

  const sorted = [...entries].sort((a, b) => a.order - b.order);
  for (const entry of sorted) {
    const seriesMdUrl = `${prefix}/blog/series/${entry.slug}.md`;
    const chapterCount = `${entry.postCount} ${entry.postCount === 1 ? 'chapter' : 'chapters'}`;
    lines.push(
      `- [${entry.title}](${seriesMdUrl}) — ${entry.description} (${chapterCount})`
    );
  }

  lines.push(generateSiteNavigation(lang));

  return `${lines.join('\n')}\n`;
}

/**
 * Generic serializer used by every PTT v3 collection markdown endpoint
 * (meetups, speakers, talks, sponsors, contributors, verticals, PTDs).
 *
 * Produces a stable shape:
 *   # title
 *   > description
 *   Language: ...
 *   Canonical: ...
 *   <metadata key: value>
 *   ---
 *   <body>
 *   <sections>
 *   <site navigation>
 */
export interface GenericMarkdownSection {
  heading: string;
  lines: string[];
}

export interface GenericMarkdownOptions {
  title: string;
  description?: string;
  lang: string;
  canonical: string;
  metadata?: Array<[string, string]>;
  body?: string;
  sections?: GenericMarkdownSection[];
}

export function serializeGenericToMarkdown(
  options: GenericMarkdownOptions
): string {
  const { title, description, lang, canonical, metadata, body, sections } =
    options;
  const lines: string[] = [];

  lines.push(`# ${title}`);
  lines.push('');
  if (description) {
    lines.push(`> ${description}`);
    lines.push('');
  }
  lines.push(`Language: ${lang}`);
  lines.push(`Canonical: ${canonical}`);
  if (metadata) {
    for (const [key, value] of metadata) {
      if (value) lines.push(`${key}: ${value}`);
    }
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  if (body) {
    lines.push(body.trim());
    lines.push('');
  }

  if (sections) {
    for (const section of sections) {
      if (section.lines.length === 0) continue;
      lines.push(`## ${section.heading}`);
      lines.push('');
      for (const line of section.lines) {
        lines.push(line);
      }
      lines.push('');
    }
  }

  lines.push(generateSiteNavigation(lang));
  return `${lines.join('\n')}\n`;
}

/**
 * Entity-reference helpers.
 *
 * The completeness contract (docs/aeo/MARKDOWN_FOR_AGENTS.md) forbids bare
 * slugs: every reference to another entity must carry a human-readable label
 * and link to that entity's own `.md`. These helpers are the single place that
 * shape is built, so no endpoint can drift into printing a slug.
 */

/** `/en/speakers/sergio-florez.md` — the `.md` twin of an entity page. */
export function mdHref(lang: string, path: string): string {
  const prefix = buildUrlPrefix(lang);
  return `${prefix}/${path.replace(/^\/+/, '')}.md`;
}

/**
 * One list row: `- [Label](/en/speakers/x.md) — detail`.
 * `detail` segments that are empty are dropped, so a missing role never leaves
 * a dangling em dash.
 */
export function entityLine(
  label: string,
  href: string,
  ...detail: Array<string | null | undefined>
): string {
  const extras = detail.filter((d): d is string => Boolean(d?.trim()));
  const suffix = extras.length > 0 ? ` — ${extras.join(' · ')}` : '';
  return `- [${label}](${href})${suffix}`;
}

/** `![alt](src)`. Alt may be empty (decorative), but the image is never dropped. */
export function imageLine(alt: string, src: string): string {
  return `![${alt.trim()}](${src})`;
}

/** A labelled external/internal link row that is not an entity reference. */
export function linkLine(label: string, url: string): string {
  return `- [${label}](${url})`;
}

/**
 * Section headings and metadata keys, in the page's own language.
 *
 * The contract requires one language per page including metadata keys, so a
 * Spanish page reads `Fecha:` and an English one `Date:`. Keeping the map here
 * rather than in each endpoint is what stops the two from drifting.
 */
const AGENT_MD_LABELS = {
  en: {
    speakers: 'Speakers',
    talks: 'Talks',
    programs: 'Programs',
    sponsors: 'Sponsors',
    organizers: 'Organizers',
    schedule: 'Schedule',
    keynotes: 'Keynotes',
    lightningTalks: 'Lightning talks',
    gallery: 'Gallery',
    links: 'Links',
    relatedMeetups: 'Related meetups',
    relatedEvents: 'Related events',
    talkHistory: 'Talk history',
    socialLinks: 'Social links',
    photo: 'Photo',
    hero: 'Hero image',
    venue: 'Venue',
    faqs: 'FAQs',
    pricing: 'Registration',
    editions: 'Editions',
    channels: 'Channels',
    contact: 'Contact',
    date: 'Date',
    dates: 'Dates',
    mode: 'Mode',
    status: 'Status',
    role: 'Role',
    tier: 'Tier',
    year: 'Year',
    website: 'Website',
    recording: 'Recording',
    photos: 'Photos',
    slides: 'Slides',
    duration: 'Duration',
    type: 'Type',
    total: 'Total',
    upcoming: 'Upcoming',
    past: 'Past',
    abstract: 'Abstract',
    mission: 'Mission',
    leaders: 'Leaders',
    stats: 'Community stats',
    latestPosts: 'Latest posts',
    nextEvent: 'Next event',
  },
  es: {
    speakers: 'Ponentes',
    talks: 'Charlas',
    programs: 'Programas',
    sponsors: 'Patrocinadores',
    organizers: 'Organizadores',
    schedule: 'Agenda',
    keynotes: 'Keynotes',
    lightningTalks: 'Lightning talks',
    gallery: 'Galería',
    links: 'Enlaces',
    relatedMeetups: 'Meetups relacionados',
    relatedEvents: 'Eventos relacionados',
    talkHistory: 'Historial de charlas',
    socialLinks: 'Redes sociales',
    photo: 'Foto',
    hero: 'Imagen destacada',
    venue: 'Lugar',
    faqs: 'Preguntas frecuentes',
    pricing: 'Inscripción',
    editions: 'Ediciones',
    channels: 'Canales',
    contact: 'Contacto',
    date: 'Fecha',
    dates: 'Fechas',
    mode: 'Modalidad',
    status: 'Estado',
    role: 'Rol',
    tier: 'Nivel',
    year: 'Año',
    website: 'Sitio web',
    recording: 'Grabación',
    photos: 'Fotos',
    slides: 'Slides',
    duration: 'Duración',
    type: 'Tipo',
    total: 'Total',
    upcoming: 'Próximos',
    past: 'Pasados',
    abstract: 'Resumen',
    mission: 'Misión',
    leaders: 'Líderes',
    stats: 'Estadísticas de la comunidad',
    latestPosts: 'Últimas publicaciones',
    nextEvent: 'Próximo evento',
  },
} as const;

export type AgentMdLabelKey = keyof (typeof AGENT_MD_LABELS)['en'];

/** Section heading / metadata key in the page's own language. */
export function mdLabel(lang: string, key: AgentMdLabelKey): string {
  const table =
    AGENT_MD_LABELS[lang as 'en' | 'es'] ?? AGENT_MD_LABELS[DEFAULT_LANGUAGE];
  return table[key];
}

/**
 * Meetup detail — `/meetups/{slug}.md`.
 *
 * Pure: takes the resolved data from `resolveMeetupDetail` and returns the
 * string. Everything the HTML page renders appears here, with every entity
 * reference carrying a name and a link to its own `.md`.
 */
export function serializeMeetupDetailToMarkdown(
  data: import('@/lib/agent-resolvers').ResolvedMeetupDetail,
  lang: string,
  untranslatedNotice?: string
): string {
  const L = (key: AgentMdLabelKey) => mdLabel(lang, key);
  const prefix = buildUrlPrefix(lang);

  const metadata: Array<[string, string]> = [
    [L('date'), data.date],
    [L('mode'), data.mode],
    [
      L('venue'),
      [data.venue.name, data.venue.city, data.venue.country]
        .filter(Boolean)
        .join(', '),
    ],
    [L('status'), data.status],
  ];
  for (const link of data.links) metadata.push([link.label, link.url]);

  const sections: GenericMarkdownSection[] = [];

  if (data.hero) {
    sections.push({
      heading: L('hero'),
      lines: [imageLine(data.hero.alt, data.hero.src)],
    });
  }

  if (data.talks.length > 0) {
    const lines: string[] = [];
    for (const talk of data.talks) {
      lines.push(`### ${talk.title}`);
      lines.push('');
      if (talk.speakers.length > 0) {
        lines.push(
          `${L('speakers')}: ${talk.speakers
            .map((s) => `[${s.name}](${mdHref(lang, `speakers/${s.slug}`)})`)
            .join(', ')}`
        );
      }
      lines.push(`${L('duration')}: ${talk.durationMinutes} min`);
      lines.push(`${L('type')}: ${talk.type}`);
      if (talk.recordingUrl) {
        lines.push(`${L('recording')}: ${talk.recordingUrl}`);
      }
      if (talk.abstract) {
        lines.push('');
        lines.push(talk.abstract);
      }
      lines.push('');
    }
    sections.push({ heading: L('talks'), lines });
  }

  if (data.speakers.length > 0) {
    sections.push({
      heading: L('speakers'),
      lines: data.speakers.map((s) =>
        entityLine(s.name, mdHref(lang, `speakers/${s.slug}`), s.role)
      ),
    });
  }

  if (data.programs.length > 0) {
    sections.push({
      heading: L('programs'),
      lines: data.programs.map((p) =>
        entityLine(p.title, mdHref(lang, `verticals/${p.slug}`), p.mission)
      ),
    });
  }

  if (data.sponsors.length > 0) {
    sections.push({
      heading: L('sponsors'),
      lines: data.sponsors.map((s) =>
        entityLine(
          s.name,
          mdHref(lang, `sponsors/${s.slug}`),
          s.tier,
          s.website
        )
      ),
    });
  }

  if (data.venue.mapUrl) {
    sections.push({
      heading: L('venue'),
      lines: [
        `${data.venue.name}, ${data.venue.city}, ${data.venue.country}`,
        '',
        linkLine('Google Maps', data.venue.mapUrl),
      ],
    });
  }

  if (data.gallery.length > 0) {
    sections.push({
      heading: L('gallery'),
      lines: data.gallery.flatMap((g) =>
        g.caption
          ? [imageLine(g.alt, g.src), g.caption, '']
          : [imageLine(g.alt, g.src)]
      ),
    });
  }

  if (data.related.length > 0) {
    sections.push({
      heading: L('relatedMeetups'),
      lines: data.related.map((m) =>
        entityLine(m.title, mdHref(lang, `meetups/${m.slug}`), m.date)
      ),
    });
  }

  const body =
    data.untranslated && untranslatedNotice
      ? `> ${untranslatedNotice}\n\n${data.body}`
      : data.body;

  return serializeGenericToMarkdown({
    title: data.title,
    description: data.description,
    lang,
    canonical: `${SITE_URL}${prefix}/meetups/${data.slug}`,
    metadata,
    body,
    sections,
  });
}

/**
 * Speaker detail — `/speakers/{slug}.md`.
 *
 * The previous output was a metadata card with an empty body (0.203 coverage,
 * the worst detail type in the build). The bio and the full talk history —
 * with abstracts — are the substance of the page and are required here.
 */
export function serializeSpeakerDetailToMarkdown(
  data: import('@/lib/agent-resolvers').ResolvedSpeakerDetail,
  lang: string
): string {
  const L = (key: AgentMdLabelKey) => mdLabel(lang, key);
  const prefix = buildUrlPrefix(lang);

  const metadata: Array<[string, string]> = [[L('role'), data.role]];
  if (data.location) metadata.push([mdLabel(lang, 'venue'), data.location]);
  if (data.pronouns)
    metadata.push([lang === 'es' ? 'Pronombres' : 'Pronouns', data.pronouns]);
  if (data.languages.length > 0) {
    metadata.push([
      lang === 'es' ? 'Idiomas' : 'Languages',
      data.languages.join(', '),
    ]);
  }

  const sections: GenericMarkdownSection[] = [
    { heading: L('photo'), lines: [imageLine(data.photo.alt, data.photo.src)] },
  ];

  if (data.social.length > 0) {
    sections.push({
      heading: L('socialLinks'),
      lines: data.social.map((s) => linkLine(s.label, s.url)),
    });
  }

  if (data.talks.length > 0) {
    const lines: string[] = [];
    for (const talk of data.talks) {
      lines.push(`### ${talk.title}`);
      lines.push('');
      if (talk.date) lines.push(`${L('date')}: ${talk.date}`);
      lines.push(`${L('duration')}: ${talk.durationMinutes} min`);
      lines.push(`${L('type')}: ${talk.type}`);
      const others = talk.speakers.filter((s) => s.slug !== data.slug);
      if (others.length > 0) {
        lines.push(
          `${L('speakers')}: ${others
            .map((s) => `[${s.name}](${mdHref(lang, `speakers/${s.slug}`)})`)
            .join(', ')}`
        );
      }
      if (talk.recordingUrl) {
        lines.push(`${L('recording')}: ${talk.recordingUrl}`);
      }
      if (talk.abstract) {
        lines.push('');
        lines.push(talk.abstract);
      }
      lines.push('');
    }
    sections.push({ heading: L('talkHistory'), lines });
  }

  if (data.events.length > 0) {
    sections.push({
      heading: L('relatedEvents'),
      lines: data.events.map((e) =>
        entityLine(
          e.title,
          mdHref(
            lang,
            e.collection === 'meetups'
              ? `meetups/${e.slug}`
              : e.collection === 'pereiraTechDays'
                ? `pereira-tech-days/${e.slug}`
                : `events/${e.slug}`
          )
        )
      ),
    });
  }

  return serializeGenericToMarkdown({
    title: data.name,
    description: data.bio,
    lang,
    canonical: `${SITE_URL}${prefix}/speakers/${data.slug}`,
    metadata,
    // The bio appears twice on purpose: as the front-block description, which an
    // agent may skip as metadata, and as the body, which was empty before Task 7
    // of PLAN_sitewide_language_seo_aeo_audit and is the page's actual prose.
    body: data.bio,
    sections,
  });
}

/**
 * Pereira Tech Day edition — `/pereira-tech-days/{year}.md` and the
 * `/pereira-tech-day` alias.
 *
 * The previous output was metadata plus a slug-shaped schedule, which put
 * editions at 0.26-0.33 coverage and the alias at 0.056 — the worst pages in
 * the build.
 */
export function serializeEditionToMarkdown(
  data: import('@/lib/agent-resolvers').ResolvedEditionDetail,
  lang: string,
  canonicalPath: string
): string {
  const L = (key: AgentMdLabelKey) => mdLabel(lang, key);
  const prefix = buildUrlPrefix(lang);
  const es = lang === 'es';

  const metadata: Array<[string, string]> = [
    [L('year'), String(data.year)],
    [es ? 'Lema' : 'Tagline', data.tagline],
    [L('dates'), data.dateLabel],
    [L('mode'), data.mode],
    [
      L('venue'),
      [data.venue.name, data.venue.city, data.venue.country]
        .filter(Boolean)
        .join(', '),
    ],
    [L('status'), data.status],
  ];
  if (data.postponement) {
    metadata.push([es ? 'Aviso' : 'Notice', data.postponement.headline]);
  }
  if (data.expectedAttendance) {
    metadata.push([
      es ? 'Asistencia esperada' : 'Expected attendance',
      data.expectedAttendance,
    ]);
  }
  if (data.scheduleTentative) {
    metadata.push([
      L('schedule'),
      es
        ? 'Tentativa — horarios y ponentes pueden cambiar.'
        : 'Tentative — times and speakers may still change.',
    ]);
  }
  for (const link of data.links) metadata.push([link.label, link.url]);

  /*
   * A postponed edition still lists its announced date, venue, and agenda —
   * that is the record of what was planned. The notice is therefore the FIRST
   * section, so an agent reading top-down cannot present those details as a
   * live event.
   */
  const sections: GenericMarkdownSection[] = [];
  if (data.postponement) {
    sections.push({
      heading: es ? 'Aviso' : 'Notice',
      lines: [
        `**${data.postponement.headline}**`,
        '',
        data.postponement.body,
        ...(data.postponement.closing ? ['', data.postponement.closing] : []),
        '',
        data.postponement.sinceLabel,
      ],
    });
  }
  sections.push({
    heading: L('hero'),
    lines: [imageLine(data.hero.alt, data.hero.src)],
  });

  if (data.aboutTopics.length > 0) {
    sections.push({
      heading: es ? 'Temas' : 'Topics',
      lines: data.aboutTopics.map((topic) => `- ${topic}`),
    });
  }

  if (data.schedule.length > 0) {
    sections.push({
      heading: L('schedule'),
      lines: data.schedule.flatMap((slot) => {
        const speaker = slot.speaker
          ? ` — [${slot.speaker.name}](${mdHref(lang, `speakers/${slot.speaker.slug}`)})`
          : '';
        const row = `- **${slot.time}** — ${slot.title} (${slot.type})${speaker}`;
        return slot.description ? [row, `  ${slot.description}`] : [row];
      }),
    });
  }

  if (data.keynotes.length > 0) {
    sections.push({
      heading: L('keynotes'),
      lines: data.keynotes.map((s) =>
        entityLine(s.name, mdHref(lang, `speakers/${s.slug}`), s.role)
      ),
    });
  }

  if (data.lightningTalks.length > 0) {
    sections.push({
      heading: L('lightningTalks'),
      lines: data.lightningTalks.map((t) =>
        t.speaker
          ? entityLine(
              t.title,
              mdHref(lang, `speakers/${t.speaker.slug}`),
              t.speaker.name
            )
          : `- ${t.title}`
      ),
    });
  }

  if (data.speakers.length > 0) {
    sections.push({
      heading: L('speakers'),
      // Bios included: the edition page renders a speaker card per person.
      lines: data.speakers.flatMap((s) => {
        const row = entityLine(
          s.name,
          mdHref(lang, `speakers/${s.slug}`),
          s.role
        );
        return s.bio ? [row, `  ${s.bio}`] : [row];
      }),
    });
  }

  if (data.organizers.length > 0) {
    sections.push({
      heading: L('organizers'),
      lines: data.organizers.map((o) =>
        entityLine(o.name, mdHref(lang, 'contributors'), o.role)
      ),
    });
  }

  if (data.collaborators.length > 0) {
    sections.push({
      heading: es ? 'Colaboradores' : 'Collaborators',
      lines: data.collaborators.map((o) =>
        entityLine(o.name, mdHref(lang, 'contributors'), o.role)
      ),
    });
  }

  if (data.sponsors.length > 0) {
    sections.push({
      heading: L('sponsors'),
      lines: data.sponsors.map((s) =>
        entityLine(
          s.name,
          mdHref(lang, `sponsors/${s.slug}`),
          s.tier,
          s.website
        )
      ),
    });
  }

  if (data.communities.length > 0) {
    sections.push({
      heading: es ? 'Comunidades aliadas' : 'Partner communities',
      lines: data.communities.map((c) =>
        c.url ? linkLine(c.name, c.url) : `- ${c.name}`
      ),
    });
  }

  if (data.pricing.length > 0) {
    sections.push({
      heading: L('pricing'),
      lines: data.pricing.flatMap((plan) => [
        `### ${plan.title}`,
        '',
        plan.subtitle,
        `${plan.price}${plan.period ? ` · ${plan.period}` : ''}`,
        '',
        ...plan.benefits.map((b) => `- ${b}`),
        '',
        linkLine(plan.ctaLabel, plan.ctaUrl),
        '',
      ]),
    });
  }

  if (data.extraPartnerships.length > 0) {
    sections.push({
      heading: es ? 'Otras alianzas' : 'Other partnerships',
      lines: data.extraPartnerships.flatMap((group) => [
        `### ${group.title}`,
        '',
        group.subtitle,
        '',
        ...group.items.map((item) => `- ${item}`),
        '',
        linkLine(group.ctaLabel, group.ctaUrl),
        '',
      ]),
    });
  }

  if (data.faqs.length > 0) {
    sections.push({
      heading: L('faqs'),
      lines: data.faqs.flatMap((faq) => [
        `### ${faq.question}`,
        '',
        faq.answer,
        ...(faq.linkUrl ? ['', faq.linkUrl] : []),
        '',
      ]),
    });
  }

  if (data.gallery.length > 0) {
    sections.push({
      heading: L('gallery'),
      lines: data.gallery.flatMap((g) =>
        g.caption
          ? [imageLine(g.alt, g.src), g.caption, '']
          : [imageLine(g.alt, g.src)]
      ),
    });
  }

  sections.push({
    heading: L('venue'),
    lines: [
      `${data.venue.name}, ${data.venue.city}, ${data.venue.country}`,
      '',
      linkLine('Google Maps', data.venue.mapUrl),
    ],
  });

  return serializeGenericToMarkdown({
    title: `Pereira Tech Day ${data.year} — ${data.title}`,
    description: data.description,
    lang,
    canonical: `${SITE_URL}${prefix}${canonicalPath}`,
    metadata,
    body: data.body || data.description,
    sections,
  });
}

/**
 * Resolve a bilingual field (string | { en, es }) to a plain string in
 * the requested language. Mirrors the runtime `tr()` helper in
 * src/lib/i18n.ts so server-side .md.ts endpoints can serialize content
 * without importing the runtime helper.
 */
export function resolveI18n(
  value: string | { en?: string; es?: string } | undefined | null,
  lang: string
): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[lang as 'en' | 'es'] ?? value.en ?? value.es ?? '';
}

/**
 * Serialize a non-blog page to agent-friendly Markdown.
 * Returns clean Markdown with metadata header + page body.
 */
export function serializePageToAgentMarkdown(
  page: CollectionEntry<'pages'>,
  options: PageSerializeOptions
): string {
  const { slug, lang } = options;
  const { title, description } = page.data;
  const prefix = buildUrlPrefix(lang);
  const pagePath = slug === 'index' ? '' : `/${slug}`;
  const canonicalUrl = `${SITE_URL}${prefix}${pagePath}`;

  const lines: string[] = [];

  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`> ${description}`);
  lines.push('');
  lines.push(`Language: ${lang}`);
  lines.push(`Canonical: ${canonicalUrl}`);

  if ('lastUpdated' in page.data && page.data.lastUpdated instanceof Date) {
    lines.push(`Last Updated: ${formatDate(page.data.lastUpdated)}`);
  }

  lines.push('');
  lines.push('---');
  lines.push('');

  if (page.body) {
    lines.push(page.body.trim());
  }

  lines.push(generateSiteNavigation(lang));

  return `${lines.join('\n')}\n`;
}
