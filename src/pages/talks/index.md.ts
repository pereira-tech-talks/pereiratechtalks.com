import type { APIRoute } from 'astro';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getTalks } from '@/lib/talk';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = async () => {
  const lang = 'es';
  const talks = await getTalks();
  const lines = talks.map((t) => {
    const title = resolveI18n(t.data.title, lang);
    const speakers = t.data.speakers.join(', ');
    return `- [${title}](/talks/${t.id}.md) — ${speakers} (${t.data.language})`;
  });

  const markdown = serializeGenericToMarkdown({
    title: 'Charlas — Pereira Tech Talks',
    description:
      'Explora el catálogo de charlas dictadas en los meetups de Pereira Tech Talks y en las ediciones de Pereira Tech Day. Grabaciones, abstracts y slides cuando están disponibles.',
    lang,
    canonical: `${SITE_URL}/talks`,
    metadata: [['Total de charlas', String(talks.length)]],
    sections: [{ heading: 'Todas las charlas', lines }],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
