import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getSpeakers } from '@/lib/speaker';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const speakers = await getSpeakers();
  const lines = speakers.map((s) => {
    const role = resolveI18n(s.data.role, lang);
    return `- [${s.data.name}](/en/speakers/${s.id}.md) — ${role}`;
  });

  const markdown = serializeGenericToMarkdown({
    title: 'Speakers — Pereira Tech Talks',
    description:
      'Directory of speakers who have shared knowledge at Pereira Tech Talks meetups and Pereira Tech Day editions — local, national, and international voices.',
    lang,
    canonical: `${SITE_URL}/en/speakers`,
    metadata: [['Total speakers', String(speakers.length)]],
    sections: [{ heading: 'All speakers', lines }],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
