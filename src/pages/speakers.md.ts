import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getSpeakers } from '@/lib/speaker';

export const GET: APIRoute = async () => {
  const lang = 'es';
  const speakers = await getSpeakers();
  const lines = speakers.map((s) => {
    const role = resolveI18n(s.data.role, lang);
    return `- [${s.data.name}](/speakers/${s.id}.md) — ${role}`;
  });

  const markdown = serializeGenericToMarkdown({
    title: 'Ponentes — Pereira Tech Talks',
    description:
      'Directorio de ponentes que han compartido conocimiento en los meetups de Pereira Tech Talks y en las ediciones de Pereira Tech Day: voces locales, nacionales e internacionales.',
    lang,
    canonical: `${SITE_URL}/speakers`,
    metadata: [['Total de ponentes', String(speakers.length)]],
    sections: [{ heading: 'Todos los ponentes', lines }],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
