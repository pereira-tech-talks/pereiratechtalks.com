import type { APIRoute } from 'astro';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getMeetupSlug, getMeetups, groupMeetupsByYear } from '@/lib/meetup';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const meetups = await getMeetups();
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
    description:
      'Complete archive of Pereira Tech Talks monthly meetups since 2014: web, AI, devops, mobile, security, and software craft, in Pereira, Risaralda, Colombia.',
    lang,
    canonical: `${SITE_URL}/en/meetups`,
    metadata: [['Total meetups', String(meetups.length)]],
    sections,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
