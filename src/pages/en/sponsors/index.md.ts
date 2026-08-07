import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getActiveSponsors, getPastSponsors } from '@/lib/sponsor';

export const GET: APIRoute = async () => {
  const lang = 'en';
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
    title: 'Sponsors — Pereira Tech Talks',
    description:
      'Current and past partners of Pereira Tech Talks. Per-edition tiers (gold, silver, etc.) live on each Pereira Tech Day page — not on this community directory.',
    lang,
    canonical: `${SITE_URL}/en/sponsors`,
    metadata: [
      ['Current partners', String(current.length)],
      ['Past partners', String(past.length)],
    ],
    sections: [
      { heading: 'Current partners', lines: toLines(current) },
      { heading: 'Past partners', lines: toLines(past) },
    ],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
