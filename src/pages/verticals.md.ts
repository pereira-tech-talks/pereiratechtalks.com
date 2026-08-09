import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getVerticals } from '@/lib/vertical';

export const GET: APIRoute = async () => {
  const lang = 'es';
  const verticals = await getVerticals();
  const lines = verticals.map((v) => {
    const title = resolveI18n(v.data.title, lang);
    const mission = resolveI18n(v.data.mission, lang);
    return `- [${title}](/verticals/${v.id}.md) — ${mission}`;
  });

  const markdown = serializeGenericToMarkdown({
    title: 'Programas — Pereira Tech Talks',
    description:
      'Pereira Tech Talks ejecuta cuatro programas comunitarios (verticales): Speaker School, La Biblioteca del Mañana, AI Channel y Monthly Meetups.',
    lang,
    canonical: `${SITE_URL}/verticals`,
    metadata: [['Total de programas', String(verticals.length)]],
    sections: [{ heading: 'Todos los programas', lines }],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
