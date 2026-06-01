import type { APIRoute } from 'astro';

import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = () => {
  const markdown = serializeGenericToMarkdown({
    title: 'Call for Speakers — Pereira Tech Talks',
    description:
      'Submit your talk proposal for an upcoming Pereira Tech Talks meetup, Pereira Tech Day, or a Speaker School cohort. Talks may be given in Spanish, English, or mixed.',
    lang: 'en',
    canonical: `${SITE_URL}/call-for-speakers`,
    sections: [
      {
        heading: 'What we look for',
        lines: [
          '- Practical, technical talks grounded in real experience',
          '- Architecture, engineering craft, AI/agents, devops, mobile, web platforms, security, software lifecycle',
          '- Community programs: La Biblioteca del Mañana, Speaker School cohorts, AI Channel sessions',
          '- First-time speakers welcome — we mentor through the Speaker School program',
        ],
      },
      {
        heading: 'Formats',
        lines: [
          '- Lightning talk (5–10 min)',
          '- Standard talk (20–30 min)',
          '- Workshop or hands-on session (60–120 min)',
          '- Panel (multiple speakers, 45–60 min)',
        ],
      },
      {
        heading: 'How to apply',
        lines: [
          `- Submit via the contact form: ${SITE_URL}/contact/?reason=speaker`,
          '- Or email hello@pereiratechtalks.org with subject "Call for Speakers"',
          '- Include: proposed title, abstract (150–300 words), bio, language, target format',
        ],
      },
    ],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
