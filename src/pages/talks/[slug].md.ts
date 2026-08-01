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
  const lang = 'es';
  const { entry } = props as {
    entry: Awaited<ReturnType<typeof getTalks>>[number];
  };
  const title = resolveI18n(entry.data.title, lang);
  const abstract = resolveI18n(entry.data.abstract, lang);
  const metadata: Array<[string, string]> = [
    ['Ponentes', entry.data.speakers.join(', ')],
    ['Tipo', entry.data.type],
    ['Idioma', entry.data.language],
    ['Duración', `${entry.data.duration} min`],
    ['Estado', entry.data.status],
  ];
  if (entry.data.date) {
    metadata.push(['Fecha', entry.data.date.toISOString().split('T')[0]]);
  }
  if (entry.data.event) {
    metadata.push([
      'Evento',
      `${entry.data.event.collection}/${entry.data.event.slug}`,
    ]);
  }
  if (entry.data.slidesDeck)
    metadata.push(['Slides', `/slides/${entry.data.slidesDeck}`]);
  if (entry.data.recording)
    metadata.push(['Grabación', entry.data.recording.url]);

  const sections = [];
  if (entry.data.tags.length > 0) {
    sections.push({
      heading: 'Etiquetas',
      lines: [entry.data.tags.map((t) => `\`${t}\``).join(' · ')],
    });
  }
  if (entry.data.speakers.length > 0) {
    sections.push({
      heading: 'Ponentes',
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
