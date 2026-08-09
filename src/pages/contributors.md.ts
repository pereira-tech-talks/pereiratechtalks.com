import type { APIRoute } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  filterCurrentTeamOrganizers,
  filterPastTeamMembers,
  getContributors,
} from '@/lib/contributor';
import {
  entityLine,
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';

export const GET: APIRoute = async () => {
  const lang = 'es';
  const contributors = await getContributors();
  const current = filterCurrentTeamOrganizers(contributors);
  const past = filterPastTeamMembers(contributors);

  // The HTML renders each person's bio, not just their role. A name-and-role
  // list read as a summary of the directory rather than its twin.
  const toLines = (list: typeof contributors): string[] =>
    list.flatMap((c) => {
      const bio = resolveI18n(c.data.bio, lang);
      const row = entityLine(
        c.data.name,
        `/contributors`,
        resolveI18n(c.data.role, lang)
      );
      return bio ? [row, `  ${bio}`] : [row];
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
    body: 'Quienes coordinan meetups, Pereira Tech Day, los programas de la comunidad y la operación diaria. Construyendo comunidad en Pereira desde 2014.',
    sections: [
      { heading: 'Equipo organizador', lines: toLines(current) },
      { heading: 'Alumni y organizadores anteriores', lines: toLines(past) },
    ],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
