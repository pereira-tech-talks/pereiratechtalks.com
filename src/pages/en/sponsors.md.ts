import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import {
  getActiveSponsors,
  getPastSponsors,
  getSponsorActivityMap,
} from '@/lib/sponsor';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const current = await getActiveSponsors();
  const past = await getPastSponsors();
  const activity = await getSponsorActivityMap([...current, ...past]);

  const toLines = (
    list: Awaited<ReturnType<typeof getActiveSponsors>>
  ): string[] =>
    list.map((s) => {
      const description = resolveI18n(s.data.description, lang);
      const stats = activity.get(s.id);
      const counters = [
        stats?.meetupCount
          ? `${stats.meetupCount} sponsored meetups`
          : undefined,
        stats?.editionCount ? `${stats.editionCount} PTD editions` : undefined,
      ]
        .filter(Boolean)
        .join(', ');
      const profile = `${SITE_URL}/en/sponsors/${s.id}`;
      return `- [${s.data.name}](${profile}) — ${description}${counters ? ` (${counters})` : ''} · [website](${s.data.url})`;
    });

  const markdown = serializeGenericToMarkdown({
    title: 'Sponsors — Pereira Tech Talks',
    description:
      'Current and past sponsors of Pereira Tech Talks. Per-edition tiers (gold, silver, etc.) live on each Pereira Tech Day page — not on this community directory.',
    lang,
    canonical: `${SITE_URL}/en/sponsors`,
    metadata: [
      ['Current sponsors', String(current.length)],
      ['Past sponsors', String(past.length)],
    ],
    sections: [
      { heading: 'Current sponsors', lines: toLines(current) },
      { heading: 'Past sponsors', lines: toLines(past) },
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
