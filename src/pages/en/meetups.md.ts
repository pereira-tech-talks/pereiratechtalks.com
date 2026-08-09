import type { APIRoute } from 'astro';
import { getCommunityStats } from '@/lib/community-stats';
import { SITE_URL } from '@/lib/constances';
import {
  entityLine,
  mdHref,
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getMeetupSlug, getMeetups, groupMeetupsByYear } from '@/lib/meetup';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const [meetups, stats] = await Promise.all([
    getMeetups(),
    getCommunityStats(),
  ]);
  const grouped = groupMeetupsByYear(meetups);

  // Each row carries the meetup's own description, as the HTML cards do; a
  // title-and-date list read as an index of the archive, not its twin.
  const rowFor = (m: (typeof meetups)[number]): string => {
    const slug = getMeetupSlug(m);
    const title = resolveI18n(m.data.title, lang);
    const date = m.data.date.toISOString().split('T')[0];
    const venue = [m.data.venue.name, m.data.venue.city]
      .filter(Boolean)
      .join(', ');
    const description = resolveI18n(m.data.description, lang);
    return entityLine(
      title,
      mdHref(lang, `meetups/${slug}`),
      date,
      venue,
      `${m.data.talks.length} talks`,
      description
    );
  };

  const now = new Date();
  const upcomingMeetups = meetups.filter((m) => m.data.date >= now);

  const sections = [];
  if (upcomingMeetups.length > 0) {
    sections.push({
      heading: 'Upcoming',
      lines: upcomingMeetups.map(rowFor),
    });
  }
  for (const group of grouped) {
    sections.push({
      heading: String(group.year),
      lines: group.meetups.map(rowFor),
    });
  }

  const markdown = serializeGenericToMarkdown({
    title: 'Meetups — Pereira Tech Talks',
    description: `${stats.meetups} meetups, ${stats.talks} talks, and ${stats.speakers} speakers since ${stats.sinceYear}. Monthly archive of Pereira Tech Talks in Pereira, Risaralda, Colombia.`,
    lang,
    canonical: `${SITE_URL}/en/meetups`,
    metadata: [
      ['Total meetups', stats.display.meetups],
      ['Total talks', stats.display.talks],
      ['Total speakers', stats.display.speakers],
      ['Since', stats.display.sinceYear],
    ],
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
