import type { APIRoute } from 'astro';
import { getCommunityStats } from '@/lib/community-stats';
import { SITE_URL } from '@/lib/constances';
import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getMeetupSlug, getMeetups, groupMeetupsByYear } from '@/lib/meetup';

export const GET: APIRoute = async () => {
  const lang = 'es';
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
      return `- [${title}](/meetups/${slug}.md) — ${date} · ${venue}`;
    }),
  }));

  const markdown = serializeGenericToMarkdown({
    title: 'Meetups — Pereira Tech Talks',
    description: `${stats.meetups} meetups, ${stats.talks} charlas y ${stats.speakers} ponentes desde ${stats.sinceYear}. Archivo mensual de Pereira Tech Talks en Pereira, Risaralda, Colombia.`,
    lang,
    canonical: `${SITE_URL}/meetups`,
    metadata: [
      ['Total meetups', stats.display.meetups],
      ['Total charlas', stats.display.talks],
      ['Total ponentes', stats.display.speakers],
      ['Desde', stats.display.sinceYear],
    ],
    sections,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
