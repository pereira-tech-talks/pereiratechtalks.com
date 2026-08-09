import type { APIRoute } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  entityLine,
  mdHref,
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getActiveSponsors } from '@/lib/sponsor';
import { getSponsorUsContent } from '@/lib/sponsor-us-content';

/**
 * `/sponsor-us.md` — reads the same content module the HTML page renders, so
 * the reach stats and the complete tier/perk menu are present. They previously
 * lived only inside the page component and never reached the `.md`.
 */
export const GET: APIRoute = async () => {
  const lang = 'es';
  const t = getSponsorUsContent(lang);
  const sponsors = await getActiveSponsors();

  const markdown = serializeGenericToMarkdown({
    title: `${t.title} — Pereira Tech Talks`,
    description: t.description,
    lang,
    canonical: `${SITE_URL}/sponsor-us`,
    body: t.intro,
    sections: [
      {
        heading: t.reachTitle,
        lines: t.reachStats.map((s) => `- **${s.value}** — ${s.label}`),
      },
      {
        heading: t.tiersTitle,
        lines: t.tiers.flatMap((tier) => [
          `### ${tier.name}`,
          '',
          tier.headline,
          '',
          ...tier.perks.map((perk) => `- ${perk}`),
          '',
        ]),
      },
      {
        heading: t.currentSponsorsTitle,
        lines: sponsors.map((s) =>
          entityLine(
            s.data.name,
            mdHref(lang, `sponsors/${s.id}`),
            resolveI18n(s.data.description, lang)
          )
        ),
      },
      {
        heading: t.ctaTitle,
        lines: [
          t.ctaDescription,
          '',
          `- [${t.ctaButton}](${SITE_URL}/sponsor-us/#sponsor-form)`,
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
