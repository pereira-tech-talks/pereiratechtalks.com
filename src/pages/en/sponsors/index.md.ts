import type { APIRoute } from 'astro';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getSponsors } from '@/lib/sponsor';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const sponsors = await getSponsors();
  const lines = sponsors.map((s) => {
    const description = resolveI18n(s.data.description, lang);
    return `- [${s.data.name}](${s.data.url}) (${s.data.tier}, ${s.data.status}) — ${description}`;
  });

  const markdown = serializeGenericToMarkdown({
    title: 'Sponsors — Pereira Tech Talks',
    description:
      'Companies and organizations that have supported Pereira Tech Talks meetups, Speaker School, La Biblioteca del Mañana, and Pereira Tech Day editions.',
    lang,
    canonical: `${SITE_URL}/en/sponsors`,
    metadata: [['Total sponsors', String(sponsors.length)]],
    sections: [{ heading: 'All sponsors', lines }],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
