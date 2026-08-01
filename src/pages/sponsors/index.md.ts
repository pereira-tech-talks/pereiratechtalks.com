import type { APIRoute } from 'astro';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getSponsors } from '@/lib/sponsor';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = async () => {
  const lang = 'es';
  const sponsors = await getSponsors();
  const lines = sponsors.map((s) => {
    const description = resolveI18n(s.data.description, lang);
    return `- [${s.data.name}](${s.data.url}) (${s.data.tier}, ${s.data.status}) — ${description}`;
  });

  const markdown = serializeGenericToMarkdown({
    title: 'Patrocinadores — Pereira Tech Talks',
    description:
      'Empresas y organizaciones que han apoyado los meetups, la Escuela de Ponentes, La Biblioteca del Mañana y las ediciones de Pereira Tech Day.',
    lang,
    canonical: `${SITE_URL}/sponsors`,
    metadata: [['Total de patrocinadores', String(sponsors.length)]],
    sections: [{ heading: 'Todos los patrocinadores', lines }],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
