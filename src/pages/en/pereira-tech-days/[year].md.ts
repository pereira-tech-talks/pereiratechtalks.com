import type { APIRoute, GetStaticPaths } from 'astro';

import { resolveEditionDetail } from '@/lib/agent-resolvers';
import { serializeEditionToMarkdown } from '@/lib/markdown-for-agents';
import { getEditions } from '@/lib/pereiraTechDay';

export const getStaticPaths: GetStaticPaths = async () => {
  const editions = await getEditions();
  return editions.map((entry) => ({
    params: { year: String(entry.data.year) },
    props: { entry },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const lang = 'en';
  const { entry } = props as {
    entry: Awaited<ReturnType<typeof getEditions>>[number];
  };

  const data = await resolveEditionDetail(entry, lang);
  const markdown = serializeEditionToMarkdown(
    data,
    lang,
    `/pereira-tech-days/${data.year}`
  );

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
