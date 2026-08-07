import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getMeetupSlug, getMeetups } from '@/lib/meetup';

export const getStaticPaths: GetStaticPaths = async () => {
  const meetups = await getMeetups();
  return meetups.map((entry) => ({
    params: { slug: getMeetupSlug(entry) },
    props: { entry },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const lang = 'en';
  const { entry } = props as {
    entry: Awaited<ReturnType<typeof getMeetups>>[number];
  };
  const slug = getMeetupSlug(entry);
  const title = resolveI18n(entry.data.title, lang);
  const description = resolveI18n(entry.data.description, lang);

  const date = entry.data.date.toISOString().split('T')[0];
  const metadata: Array<[string, string]> = [
    ['Date', date],
    ['Mode', entry.data.mode],
    [
      'Venue',
      `${entry.data.venue.name}, ${entry.data.venue.city}, ${entry.data.venue.country}`,
    ],
    ['Status', entry.data.status],
  ];
  if (entry.data.linkRecording)
    metadata.push(['Recording', entry.data.linkRecording]);
  if (entry.data.linkPhotos) metadata.push(['Photos', entry.data.linkPhotos]);
  if (entry.data.linkMeetupCom)
    metadata.push(['Meetup.com', entry.data.linkMeetupCom]);

  const sections = [];
  if (entry.data.speakers.length > 0) {
    sections.push({
      heading: 'Speakers',
      lines: entry.data.speakers.map((s) => `- [${s}](/en/speakers/${s}.md)`),
    });
  }
  if (entry.data.talks.length > 0) {
    sections.push({
      heading: 'Talks',
      lines: entry.data.talks.map((t) => `- ${t}`),
    });
  }
  if (entry.data.verticals.length > 0) {
    sections.push({
      heading: 'Programs',
      lines: entry.data.verticals.map((v) => `- [${v}](/en/verticals/${v}.md)`),
    });
  }
  if (entry.data.sponsors.length > 0) {
    sections.push({
      heading: 'Sponsors',
      lines: entry.data.sponsors.map((s) => `- ${s.slug} (${s.tier})`),
    });
  }

  const markdown = serializeGenericToMarkdown({
    title,
    description,
    lang,
    canonical: `${SITE_URL}/en/meetups/${slug}`,
    metadata,
    body: entry.body,
    sections,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
