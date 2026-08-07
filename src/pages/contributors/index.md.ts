import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  filterCurrentTeamOrganizers,
  filterPastTeamMembers,
  getContributors,
} from '@/lib/contributor';
import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';

export const GET: APIRoute = async () => {
  const lang = 'es';
  const contributors = await getContributors();
  const current = filterCurrentTeamOrganizers(contributors);
  const past = filterPastTeamMembers(contributors);

  const toLines = (list: typeof contributors): string[] =>
    list.map((c) => {
      const role = c.data.role.es;
      return `- **${c.data.name}** — ${role}`;
    });

  const markdown = serializeGenericToMarkdown({
    title: 'Equipo — Pereira Tech Talks',
    description:
      'Equipo organizador activo de Pereira Tech Talks y alumni / organizadores anteriores. Directorio bilingüe en /contributors.',
    lang,
    canonical: `${SITE_URL}/contributors`,
    metadata: [
      ['Organizadores activos', String(current.length)],
      ['Alumni y anteriores', String(past.length)],
      ['Total en directorio', String(contributors.length)],
    ],
    sections: [
      { heading: 'Equipo organizador', lines: toLines(current) },
      {
        heading: 'Alumni y organizadores anteriores',
        lines: toLines(past),
      },
    ],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
