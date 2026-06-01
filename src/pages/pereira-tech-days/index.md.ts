import type { APIRoute } from 'astro';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getEditions } from '@/lib/pereiraTechDay';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const editions = await getEditions();
  const lines = editions.map((e) => {
    const title = resolveI18n(e.data.title, lang);
    const tagline = resolveI18n(e.data.tagline, lang);
    return `- [${e.data.year} — ${title}](/pereira-tech-days/${e.data.year}.md) — ${tagline} · ${e.data.venue.name}, ${e.data.venue.city}`;
  });

  const markdown = serializeGenericToMarkdown({
    title: 'Pereira Tech Days — Pereira Tech Talks',
    description:
      'Catalogue of all Pereira Tech Day editions: the annual technology conference of Pereira, Risaralda, Colombia. Editions, programs, speakers, and recordings.',
    lang,
    canonical: `${SITE_URL}/pereira-tech-days`,
    metadata: [['Total editions', String(editions.length)]],
    sections: [{ heading: 'Editions', lines }],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
