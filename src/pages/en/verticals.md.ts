import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getVerticals } from '@/lib/vertical';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const verticals = await getVerticals();
  const lines = verticals.map((v) => {
    const title = resolveI18n(v.data.title, lang);
    const mission = resolveI18n(v.data.mission, lang);
    return `- [${title}](/en/verticals/${v.id}.md) — ${mission}`;
  });

  const markdown = serializeGenericToMarkdown({
    title: 'Programs — Pereira Tech Talks',
    description:
      'Pereira Tech Talks runs four community programs (verticals): Speaker School, La Biblioteca del Mañana, AI Channel, and Monthly Meetups.',
    lang,
    canonical: `${SITE_URL}/en/verticals`,
    metadata: [['Total programs', String(verticals.length)]],
    sections: [{ heading: 'All programs', lines }],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
