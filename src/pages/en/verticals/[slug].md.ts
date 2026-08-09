import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getVerticalBodyEntry, getVerticals } from '@/lib/vertical';

export const getStaticPaths: GetStaticPaths = async () => {
  const verticals = await getVerticals();
  return Promise.all(
    verticals.map(async (entry) => ({
      params: { slug: entry.id },
      props: {
        entry,
        // English prose lives in the `{slug}.en.md` sibling; fall back to the
        // Spanish body only when the translation does not exist yet.
        body: (await getVerticalBodyEntry(entry, 'en')).entry.body ?? '',
      },
    }))
  );
};

export const GET: APIRoute = ({ props }) => {
  const lang = 'en';
  const { entry, body } = props as {
    entry: Awaited<ReturnType<typeof getVerticals>>[number];
    body: string;
  };
  const title = resolveI18n(entry.data.title, lang);
  const mission = resolveI18n(entry.data.mission, lang);
  const description = resolveI18n(entry.data.description, lang);
  const schedule = resolveI18n(entry.data.schedule ?? null, lang);

  const metadata: Array<[string, string]> = [
    ['Mission', mission],
    ['Status', entry.data.status],
  ];
  if (schedule) metadata.push(['Schedule', schedule]);

  const sections = [];
  if (description) {
    sections.push({ heading: 'About this program', lines: [description] });
  }
  if (entry.data.leaders.length > 0) {
    sections.push({
      heading: 'Leaders',
      lines: entry.data.leaders.map((l) => `- [${l}](/en/contributors)`),
    });
  }
  if (entry.data.channels.length > 0) {
    sections.push({
      heading: 'Channels',
      lines: entry.data.channels.map((c) => `- ${c}`),
    });
  }

  const markdown = serializeGenericToMarkdown({
    title,
    description: mission,
    lang,
    canonical: `${SITE_URL}/en/verticals/${entry.id}`,
    metadata,
    body,
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
