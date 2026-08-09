import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  entityLine,
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getTranslations } from '@/lib/translations';

/**
 * `/communities.md` — sourced from the `communities` collection and the same
 * translation strings the HTML renders. The hand-written page markdown listed
 * names and one-line focuses while the page shows each community's full
 * description, which put it at 0.39 coverage.
 */
export const GET: APIRoute = async () => {
  const lang = 'en';
  const t = getTranslations(lang).communitiesPage;
  const all = await getCollection('communities');
  const sorted = [...all].sort(
    (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)
  );
  const active = sorted.filter((c) => c.data.status === 'active');
  const past = sorted.filter((c) => c.data.status !== 'active');

  const row = (c: (typeof sorted)[number]) =>
    entityLine(
      c.data.name,
      c.data.url,
      c.data.focus ? resolveI18n(c.data.focus, lang) : undefined,
      resolveI18n(c.data.description, lang)
    );

  const sections = [
    { heading: t.narrativeTitle, lines: [t.narrativeText] },
    { heading: t.alliesTitle, lines: active.map(row) },
  ];
  if (past.length > 0) {
    sections.push({ heading: 'Past allies', lines: past.map(row) });
  }
  sections.push({
    heading: t.allianceTitle,
    lines: t.allianceSteps.map((step) => `- ${step}`),
  });
  sections.push({
    heading: t.ctaTitle,
    lines: [
      t.ctaDescription,
      '',
      `- [${t.ctaPrimary}](${SITE_URL}/en/contact)`,
      `- [${t.ctaSecondary}](${SITE_URL}/en/channels)`,
    ],
  });

  const markdown = serializeGenericToMarkdown({
    title: t.title,
    description: t.description,
    lang,
    canonical: `${SITE_URL}/en/communities`,
    metadata: [['Allied communities', String(active.length)]],
    body: t.heroLead,
    sections,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
