import type { APIRoute, GetStaticPaths } from 'astro';

import { resolveSpeakerDetail } from '@/lib/agent-resolvers';
import { serializeSpeakerDetailToMarkdown } from '@/lib/markdown-for-agents';
import { getSpeakers } from '@/lib/speaker';

export const getStaticPaths: GetStaticPaths = async () => {
  const speakers = await getSpeakers();
  return speakers.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const lang = 'en';
  const { entry } = props as {
    entry: Awaited<ReturnType<typeof getSpeakers>>[number];
  };

  const data = await resolveSpeakerDetail(entry, lang);
  const markdown = serializeSpeakerDetailToMarkdown(data, lang);

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
