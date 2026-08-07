import type { APIRoute } from 'astro';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getActiveSponsors, getPastSponsors } from '@/lib/sponsor';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = async () => {
  const lang = 'es';
  const current = await getActiveSponsors();
  const past = await getPastSponsors();

  const toLines = (
    list: Awaited<ReturnType<typeof getActiveSponsors>>
  ): string[] =>
    list.map((s) => {
      const description = resolveI18n(s.data.description, lang);
      return `- [${s.data.name}](${s.data.url}) — ${description}`;
    });

  const markdown = serializeGenericToMarkdown({
    title: 'Patrocinadores — Pereira Tech Talks',
    description:
      'Aliados actuales y anteriores de Pereira Tech Talks. Las categorías por edición (oro, plata, etc.) viven en cada Pereira Tech Day, no en este directorio comunitario.',
    lang,
    canonical: `${SITE_URL}/sponsors`,
    metadata: [
      ['Aliados actuales', String(current.length)],
      ['Aliados anteriores', String(past.length)],
    ],
    sections: [
      { heading: 'Aliados actuales', lines: toLines(current) },
      { heading: 'Aliados anteriores', lines: toLines(past) },
    ],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
