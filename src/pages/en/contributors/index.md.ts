import type { APIRoute } from 'astro';

import {
  filterCurrentTeamOrganizers,
  filterPastTeamMembers,
  getContributors,
} from '@/lib/contributor';
import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const contributors = await getContributors();
  const current = filterCurrentTeamOrganizers(contributors);
  const past = filterPastTeamMembers(contributors);

  const toLines = (list: typeof contributors): string[] =>
    list.map((c) => {
      const role = c.data.role.en;
      return `- **${c.data.name}** — ${role}`;
    });

  const markdown = serializeGenericToMarkdown({
    title: 'Team — Pereira Tech Talks',
    description:
      'Active organizing team of Pereira Tech Talks plus alumni and past organizers. Bilingual directory at /en/contributors.',
    lang,
    canonical: `${SITE_URL}/en/contributors`,
    metadata: [
      ['Active organizers', String(current.length)],
      ['Alumni and past', String(past.length)],
      ['Total in directory', String(contributors.length)],
    ],
    sections: [
      { heading: 'Organizing team', lines: toLines(current) },
      {
        heading: 'Alumni and past organizers',
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
