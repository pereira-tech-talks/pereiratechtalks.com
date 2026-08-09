import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import {
  getActiveSponsors,
  getPastSponsors,
  getSponsorActivityMap,
} from '@/lib/sponsor';
import { getTranslations } from '@/lib/translations';

export const GET: APIRoute = async () => {
  const lang = 'es';
  const current = await getActiveSponsors();
  const past = await getPastSponsors();
  const activity = await getSponsorActivityMap([...current, ...past]);

  const toLines = (
    list: Awaited<ReturnType<typeof getActiveSponsors>>
  ): string[] =>
    list.map((s) => {
      const description = resolveI18n(s.data.description, lang);
      const stats = activity.get(s.id);
      const counters = [
        stats?.meetupCount
          ? `${stats.meetupCount} meetups patrocinados`
          : undefined,
        stats?.editionCount ? `${stats.editionCount} ediciones PTD` : undefined,
      ]
        .filter(Boolean)
        .join(', ');
      const profile = `${SITE_URL}/sponsors/${s.id}`;
      return `- [${s.data.name}](${profile}) — ${description}${counters ? ` (${counters})` : ''} · [sitio web](${s.data.url})`;
    });

  const t = getTranslations('es').sponsorsPage;

  const markdown = serializeGenericToMarkdown({
    title: `${t.title} — Pereira Tech Talks`,
    description: t.description,
    lang,
    canonical: `${SITE_URL}/sponsors`,
    metadata: [
      [t.currentTitle, String(current.length)],
      [t.pastTitle, String(past.length)],
    ],
    body: t.intro(current.length),
    sections: [
      {
        heading: t.why.title,
        lines: [
          t.why.intro,
          '',
          `- **${t.why.items.meetups.title}** — ${t.why.items.meetups.body}`,
          `- **${t.why.items.ptd.title}** — ${t.why.items.ptd.body}`,
          `- **${t.why.items.talent.title}** — ${t.why.items.talent.body}`,
        ],
      },
      {
        heading: t.currentTitle,
        lines: [t.currentIntro, '', ...toLines(current)],
      },
      { heading: t.pastTitle, lines: [t.pastIntro, '', ...toLines(past)] },
      {
        heading: t.sponsorUsLabel,
        lines: [
          `- [${t.sponsorUsLabel}](${SITE_URL}/sponsor-us)`,
          `- [${t.contactLabel}](${SITE_URL}/contact)`,
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
