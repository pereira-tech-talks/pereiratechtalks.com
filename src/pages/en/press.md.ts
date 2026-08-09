import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/constances';

import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';

export const GET: APIRoute = () => {
  const markdown = serializeGenericToMarkdown({
    title: 'Press — Pereira Tech Talks',
    description:
      'Resources for journalists, podcasters, and media partners covering Pereira Tech Talks: key facts, brand downloads, boilerplate, and a direct press contact.',
    lang: 'en',
    canonical: `${SITE_URL}/en/press`,
    sections: [
      {
        heading: 'Key facts',
        lines: [
          '- Founded: Pereira, Risaralda, Colombia · 2014',
          '- Nature: Non-profit, volunteer-organized community',
          '- Languages: website in Spanish and English',
          '- Programs: Monthly meetups · Pereira Tech Day · Speaker School · La Biblioteca del Mañana · AI Channel',
          '- Numbers: 90+ meetups · 200+ talks · 6,500+ attendees · 7 Pereira Tech Day editions',
          '- Model: Free events sustained by sponsorships',
        ],
      },
      {
        heading: 'Boilerplate',
        lines: [
          'Pereira Tech Talks is a community of builders, speakers, and learners headquartered in Pereira, Risaralda, Colombia. Since 2014 we have hosted 90+ meetups and seven Pereira Tech Day editions, connecting local talent to the global tech ecosystem through monthly meetups, the Speaker School, La Biblioteca del Mañana, and the AI Channel.',
        ],
      },
      {
        heading: 'Brand downloads',
        lines: [
          `- [Primary logotype (SVG)](${SITE_URL}/images/brand/pereira-tech-talks-logo.svg) — vector for light/dark backgrounds`,
          `- [Square avatar (PNG 512×512)](${SITE_URL}/icons/icon-512x512.png) — profile pictures and covers`,
          `- [Apple touch icon (PNG 180×180)](${SITE_URL}/icons/apple-touch-icon.png) — mobile integrations`,
        ],
      },
      {
        heading: 'Press contact',
        lines: [
          `- Form: ${SITE_URL}/en/contact/?topic=press`,
          '- Email: pereiratechtalks@gmail.com',
          '- For interviews, on-site coverage, photography, or any editorial request.',
        ],
      },
      {
        heading: 'Useful pages',
        lines: [
          `- [About the community](${SITE_URL}/en/about/)`,
          `- [Programs](${SITE_URL}/en/verticals/)`,
          `- [Pereira Tech Day](${SITE_URL}/en/pereira-tech-day/)`,
          `- [Sponsors](${SITE_URL}/en/sponsors/)`,
          `- [Contributors](${SITE_URL}/en/contributors/)`,
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
