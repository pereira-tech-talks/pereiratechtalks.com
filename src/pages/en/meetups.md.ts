import type { APIRoute } from 'astro';
import { getCommunityStats } from '@/lib/community-stats';
import { SITE_URL } from '@/lib/constances';
import {
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

  const sections = grouped.map((group) => ({
    heading: String(group.year),
    lines: group.meetups.map((m) => {
      const slug = getMeetupSlug(m);
      const title = resolveI18n(m.data.title, lang);
      const date = m.data.date.toISOString().split('T')[0];
      const venue = `${m.data.venue.name}, ${m.data.venue.city}`;
      return `- [${title}](/en/meetups/${slug}.md) — ${date} · ${venue}`;
    }),
  }));

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
