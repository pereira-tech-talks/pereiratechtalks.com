import type { APIRoute } from 'astro';

import { getContributors } from '@/lib/contributor';
import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = async () => {
  const lang = 'es';
  const contributors = await getContributors();
  const lines = contributors.map((c) => {
    const role = c.data.role.es;
    const roles = c.data.roles.join(', ');
    return `- **${c.data.name}** — ${role} (${roles})`;
  });

  const markdown = serializeGenericToMarkdown({
    title: 'Contribuyentes — Pereira Tech Talks',
    description:
      'Las personas de la comunidad que hacen posible Pereira Tech Talks: organizadores fundadores, organizadores, líderes de programas, mentores y equipo de conducta.',
    lang,
    canonical: `${SITE_URL}/contributors`,
    metadata: [['Total de contribuyentes', String(contributors.length)]],
    sections: [{ heading: 'Todos los contribuyentes', lines }],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
