import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getSpeakers } from '@/lib/speaker';

export const getStaticPaths: GetStaticPaths = async () => {
  const speakers = await getSpeakers();
  return speakers.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const lang = 'es';
  const { entry } = props as {
    entry: Awaited<ReturnType<typeof getSpeakers>>[number];
  };
  const role = resolveI18n(entry.data.role, lang);
  const bio = resolveI18n(entry.data.bio, lang);
  const metadata: Array<[string, string]> = [
    ['Rol', role],
    ['Idiomas', entry.data.languages.join(', ')],
  ];
  if (entry.data.pronouns) metadata.push(['Pronombres', entry.data.pronouns]);
  if (entry.data.location) {
    metadata.push([
      'Ubicación',
      `${entry.data.location.city}, ${entry.data.location.country}`,
    ]);
  }
  const social = entry.data.social;
  if (social) {
    for (const [key, value] of Object.entries(social)) {
      if (value) metadata.push([key, value]);
    }
  }

  const sections = [];
  if (entry.data.talks.length > 0) {
    sections.push({
      heading: 'Charlas',
      lines: entry.data.talks.map((t) => `- ${t}`),
    });
  }

  const markdown = serializeGenericToMarkdown({
    title: entry.data.name,
    description: bio,
    lang,
    canonical: `${SITE_URL}/speakers/${entry.id}`,
    metadata,
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
