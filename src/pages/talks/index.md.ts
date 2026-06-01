import type { APIRoute } from 'astro';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getTalks } from '@/lib/talk';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const talks = await getTalks();
  const lines = talks.map((t) => {
    const title = resolveI18n(t.data.title, lang);
    const speakers = t.data.speakers.join(', ');
    return `- [${title}](/talks/${t.id}.md) — ${speakers} (${t.data.language})`;
  });

  const markdown = serializeGenericToMarkdown({
    title: 'Talks — Pereira Tech Talks',
    description:
      'Browse the catalogue of talks given at Pereira Tech Talks meetups and Pereira Tech Day editions. Recordings, abstracts, and slide decks where available.',
    lang,
    canonical: `${SITE_URL}/talks`,
    metadata: [['Total talks', String(talks.length)]],
    sections: [{ heading: 'All talks', lines }],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
