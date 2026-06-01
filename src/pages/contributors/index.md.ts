import type { APIRoute } from 'astro';

import { getContributors } from '@/lib/contributor';
import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const contributors = await getContributors();
  const lines = contributors.map((c) => {
    const role = c.data.role.en;
    const roles = c.data.roles.join(', ');
    return `- **${c.data.name}** — ${role} (${roles})`;
  });

  const markdown = serializeGenericToMarkdown({
    title: 'Contributors — Pereira Tech Talks',
    description:
      'The community members who make Pereira Tech Talks possible: founding organizers, organizers, vertical leads, mentors, and conduct team.',
    lang,
    canonical: `${SITE_URL}/contributors`,
    metadata: [['Total contributors', String(contributors.length)]],
    sections: [{ heading: 'All contributors', lines }],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
