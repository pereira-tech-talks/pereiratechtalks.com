import type { APIRoute } from 'astro';

import { SITE_URL } from '@/lib/constances';
import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';
import { getTranslations } from '@/lib/translations';

/**
 * Sourced from the same translation strings the HTML page renders, so the two
 * cannot drift. The previous hand-written copy listed different talk formats
 * from the ones the page actually offers.
 */
export const GET: APIRoute = () => {
  const lang = 'en';
  const t = getTranslations(lang).cfsPage;

  const markdown = serializeGenericToMarkdown({
    title: `${t.title} — Pereira Tech Talks`,
    description: t.description,
    lang,
    canonical: `${SITE_URL}/en/call-for-speakers`,
    body: t.intro,
    sections: [
      {
        heading: t.whatWeLookForTitle,
        lines: t.whatWeLookFor.map((item) => `- ${item}`),
      },
      {
        heading: t.formatsTitle,
        lines: t.formats.map(
          (format) => `- **${format.name}** — ${format.description}`
        ),
      },
      {
        heading: t.processTitle,
        lines: t.process.map((step, index) => `${index + 1}. ${step}`),
      },
      {
        heading: 'Submit your talk',
        lines: [
          `- Application form: ${SITE_URL}/en/call-for-speakers/#cfs-form`,
          '- Email: pereiratechtalks@gmail.com',
        ],
      },
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
