import type { APIRoute, GetStaticPaths } from 'astro';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getTalks } from '@/lib/talk';

const SITE_URL = 'https://pereiratechtalks.org';

export const getStaticPaths: GetStaticPaths = async () => {
  const talks = await getTalks();
  return talks.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const lang = 'en';
  const { entry } = props as {
    entry: Awaited<ReturnType<typeof getTalks>>[number];
  };
  const title = resolveI18n(entry.data.title, lang);
  const abstract = resolveI18n(entry.data.abstract, lang);
  const metadata: Array<[string, string]> = [
    ['Speakers', entry.data.speakers.join(', ')],
    ['Type', entry.data.type],
    ['Language', entry.data.language],
    ['Duration', `${entry.data.duration} min`],
    ['Status', entry.data.status],
  ];
  if (entry.data.date) {
    metadata.push(['Date', entry.data.date.toISOString().split('T')[0]]);
  }
  if (entry.data.event) {
    metadata.push([
      'Event',
      `${entry.data.event.collection}/${entry.data.event.slug}`,
    ]);
  }
  if (entry.data.slidesDeck)
    metadata.push(['Slides', `/slides/${entry.data.slidesDeck}`]);
  if (entry.data.recording)
    metadata.push(['Recording', entry.data.recording.url]);

  const sections = [];
  if (entry.data.tags.length > 0) {
    sections.push({
      heading: 'Tags',
      lines: [entry.data.tags.map((t) => `\`${t}\``).join(' · ')],
    });
  }
  if (entry.data.speakers.length > 0) {
    sections.push({
      heading: 'Speakers',
      lines: entry.data.speakers.map((s) => `- [${s}](/speakers/${s}.md)`),
    });
  }

  const markdown = serializeGenericToMarkdown({
    title,
    description: abstract,
    lang,
    canonical: `${SITE_URL}/talks/${entry.id}`,
    metadata,
    sections,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
