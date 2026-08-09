import type { APIRoute, GetStaticPaths } from 'astro';

import { resolveMeetupDetail } from '@/lib/agent-resolvers';
import { serializeMeetupDetailToMarkdown } from '@/lib/markdown-for-agents';
import { getMeetupSlug, getMeetups } from '@/lib/meetup';
import { getTranslations } from '@/lib/translations';

export const getStaticPaths: GetStaticPaths = async () => {
  const meetups = await getMeetups();
  return meetups.map((entry) => ({
    params: { slug: getMeetupSlug(entry) },
    props: { entry },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const lang = 'es';
  const { entry } = props as {
    entry: Awaited<ReturnType<typeof getMeetups>>[number];
  };

  const data = await resolveMeetupDetail(entry, lang);
  const markdown = serializeMeetupDetailToMarkdown(
    data,
    lang,
    getTranslations(lang).meetupDetail.untranslatedBody
  );

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
