import type { APIRoute } from 'astro';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getEditions } from '@/lib/pereiraTechDay';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = async () => {
  const lang = 'es';
  const editions = await getEditions();
  const lines = editions.map((e) => {
    const title = resolveI18n(e.data.title, lang);
    const tagline = resolveI18n(e.data.tagline, lang);
    return `- [${e.data.year} — ${title}](/es/pereira-tech-days/${e.data.year}.md) — ${tagline} · ${e.data.venue.name}, ${e.data.venue.city}`;
  });

  const markdown = serializeGenericToMarkdown({
    title: 'Pereira Tech Days — Pereira Tech Talks',
    description:
      'Catálogo de todas las ediciones de Pereira Tech Day: la conferencia anual de tecnología de Pereira, Risaralda, Colombia. Ediciones, programas, ponentes y grabaciones.',
    lang,
    canonical: `${SITE_URL}/es/pereira-tech-days`,
    metadata: [['Total de ediciones', String(editions.length)]],
    sections: [{ heading: 'Ediciones', lines }],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
