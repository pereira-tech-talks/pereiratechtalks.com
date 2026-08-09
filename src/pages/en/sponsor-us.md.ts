import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/constances';

import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';

export const GET: APIRoute = () => {
  const markdown = serializeGenericToMarkdown({
    title: 'Sponsor us — Pereira Tech Talks',
    description:
      'Connect your brand with the most active technical community in the Eje Cafetero. Since 2014 we have run 90+ meetups and 7 Pereira Tech Day editions.',
    lang: 'en',
    canonical: `${SITE_URL}/en/sponsor-us`,
    sections: [
      {
        heading: 'Why sponsor',
        lines: [
          "Sponsoring Pereira Tech Talks is not advertising — it's building community.",
          'Every contribution funds accessible venues, food for attendees, Speaker School scholarships, travel for invited speakers, and events open to the whole region.',
        ],
      },
      {
        heading: 'Estimated reach',
        lines: [
          '- 90+ meetups since 2014',
          '- 200+ talks delivered',
          '- 6,500+ cumulative attendees',
          '- 12 active years',
        ],
      },
      {
        heading: 'Sponsorship tiers',
        lines: [
          '- **Diamond** — Strategic annual partner. Co-branding on PTD and full-year meetups, keynote slot, monthly social mentions, hiring pool access, main site banner.',
          '- **Gold** — Annual partner. Logo on PTD program, one sponsored technical talk per year, mentions at 6+ meetups, hiring pool access.',
          '- **Silver** — One-off sponsor. Logo on the sponsored event, pre/post social mentions, optional booth.',
          '- **Community** — Non-monetary contribution (venues, food, transportation, scholarships). Logo on the supported event and recognition on the sponsors page.',
        ],
      },
      {
        heading: 'How to start a conversation',
        lines: [
          `- Form: ${SITE_URL}/en/contact/?topic=collaboration`,
          '- Email: pereiratechtalks@gmail.com',
          '- Tell us what you want to support (a meetup, a program, Pereira Tech Day, scholarships) and we will send a tailored sponsor deck.',
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
