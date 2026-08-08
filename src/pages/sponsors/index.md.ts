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
  const lang = 'es';
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
          ? `${stats.meetupCount} meetups patrocinados`
          : undefined,
        stats?.editionCount ? `${stats.editionCount} ediciones PTD` : undefined,
      ]
        .filter(Boolean)
        .join(', ');
      const profile = `${SITE_URL}/sponsors/${s.id}`;
      return `- [${s.data.name}](${profile}) — ${description}${counters ? ` (${counters})` : ''} · [sitio web](${s.data.url})`;
    });

  const markdown = serializeGenericToMarkdown({
    title: 'Patrocinadores — Pereira Tech Talks',
    description:
      'Patrocinadores actuales y anteriores de Pereira Tech Talks. Las categorías por edición (oro, plata, etc.) viven en cada Pereira Tech Day, no en este directorio comunitario.',
    lang,
    canonical: `${SITE_URL}/sponsors`,
    metadata: [
      ['Patrocinadores actuales', String(current.length)],
      ['Patrocinadores anteriores', String(past.length)],
    ],
    sections: [
      { heading: 'Patrocinadores actuales', lines: toLines(current) },
      { heading: 'Patrocinadores anteriores', lines: toLines(past) },
    ],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
