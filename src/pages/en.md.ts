import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

import { getPostSlug, isPostVisibleInProduction } from '@/lib/blog';
import { getCommunityStats } from '@/lib/community-stats';
import { SITE_URL } from '@/lib/constances';
import {
  entityLine,
  mdHref,
  mdLabel,
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getMeetupSlug, getUpcomingMeetups } from '@/lib/meetup';
import { getUpcomingEdition } from '@/lib/pereiraTechDay';
import { getActiveSponsors } from '@/lib/sponsor';
import { getTranslations } from '@/lib/translations';
import { getActiveVerticals } from '@/lib/vertical';

/**
 * `/index.md` — the home page.
 *
 * The hand-written page body alone measured 0.43 coverage because the HTML is
 * mostly dynamic: the next-event card, the program strip, the sponsor wall and
 * the latest posts. Those are appended here from the same collections the page
 * renders, so they cannot go stale.
 *
 * Served by its own endpoint rather than the pages-collection route, which is
 * filtered to skip `index`. The path is flat (`/en` + `.md`), matching the
 * canonical rule Task 2 established for every other page.
 */
export const GET: APIRoute = async () => {
  const lang = 'en';
  const L = (key: Parameters<typeof mdLabel>[1]) => mdLabel(lang, key);

  const pages = await getCollection('pages');
  const page = pages.find((p) => p.id === 'en/index');

  const [stats, edition, upcoming, programs, sponsors, allPosts] =
    await Promise.all([
      getCommunityStats(),
      getUpcomingEdition(),
      getUpcomingMeetups(),
      getActiveVerticals(),
      getActiveSponsors(),
      getCollection('blog'),
    ]);

  const posts = allPosts
    .filter((p) => p.id.startsWith('en/') && isPostVisibleInProduction(p))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, 5);

  const sections = [];

  if (edition) {
    const date =
      edition.data.date instanceof Date
        ? edition.data.date.toISOString().split('T')[0]
        : edition.data.date.start.toISOString().split('T')[0];
    sections.push({
      heading: L('nextEvent'),
      lines: [
        entityLine(
          `Pereira Tech Day ${edition.data.year} — ${resolveI18n(edition.data.title, lang)}`,
          mdHref(lang, 'pereira-tech-day'),
          date,
          [edition.data.venue.name, edition.data.venue.city]
            .filter(Boolean)
            .join(', '),
          resolveI18n(edition.data.tagline, lang)
        ),
        `  ${resolveI18n(edition.data.description, lang)}`,
      ],
    });
  }

  if (upcoming.length > 0) {
    sections.push({
      heading: L('upcoming'),
      lines: upcoming.map((m) =>
        entityLine(
          resolveI18n(m.data.title, lang),
          mdHref(lang, `meetups/${getMeetupSlug(m)}`),
          m.data.date.toISOString().split('T')[0],
          [m.data.venue.name, m.data.venue.city].filter(Boolean).join(', '),
          resolveI18n(m.data.description, lang)
        )
      ),
    });
  }

  sections.push({
    heading: L('stats'),
    lines: [
      `- Meetups: ${stats.display.meetups}`,
      `- Talks: ${stats.display.talks}`,
      `- Speakers: ${stats.display.speakers}`,
      `- Since: ${stats.display.sinceYear}`,
    ],
  });

  sections.push({
    heading: L('programs'),
    lines: programs.map((v) =>
      entityLine(
        resolveI18n(v.data.title, lang),
        mdHref(lang, `verticals/${v.id}`),
        resolveI18n(v.data.mission, lang)
      )
    ),
  });

  if (posts.length > 0) {
    sections.push({
      heading: L('latestPosts'),
      lines: posts.map((p) =>
        entityLine(
          p.data.title,
          mdHref(lang, `blog/${getPostSlug(p.id)}`),
          p.data.pubDate.toISOString().split('T')[0],
          p.data.description
        )
      ),
    });
  }

  if (sponsors.length > 0) {
    sections.push({
      heading: L('sponsors'),
      lines: sponsors.map((s) =>
        entityLine(
          s.data.name,
          mdHref(lang, `sponsors/${s.id}`),
          resolveI18n(s.data.description, lang)
        )
      ),
    });
  }

  // The hero, "who we are" and closing blocks are the page's prose and live in
  // the translation files the HTML renders from. Stripping the inline markup
  // keeps the .md free of presentation chrome.
  const t = getTranslations(lang);
  const stripMarkup = (html: string): string =>
    html
      .replace(/<br\s*\/?>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  const prose = [
    t.hero.tagline,
    t.hero.description,
    stripMarkup(t.homeSections.about.title),
    stripMarkup(t.homeSections.about.description),
    t.homeSections.community.title,
    t.homeSections.community.description,
    t.contactSection.title,
    t.contactSection.description,
    page?.body?.trim() ?? '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const markdown = serializeGenericToMarkdown({
    title: page?.data.title ?? 'Pereira Tech Talks',
    description: page?.data.description ?? '',
    lang,
    canonical: `${SITE_URL}/en`,
    body: prose,
    sections,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
