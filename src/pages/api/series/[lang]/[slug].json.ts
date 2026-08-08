import { getCollection } from 'astro:content';

import type { APIRoute, GetStaticPaths } from 'astro';

import { getSeriesTimelineIndex, isPostVisibleInProduction } from '@/lib/blog';
import type { Language } from '@/lib/i18n';

export const getStaticPaths: GetStaticPaths = async () => {
  const allSeries = await getCollection('series');
  const allPosts = await getCollection('blog');
  const combinations = new Set<string>();

  for (const series of allSeries) {
    for (const post of allPosts) {
      if (!isPostVisibleInProduction(post)) continue;
      if (post.data.series !== series.data.name) continue;
      const lang = post.id.startsWith('en/') ? 'en' : 'es';
      combinations.add(`${lang}:${series.data.name}`);
    }
  }

  return Array.from(combinations).map((combo) => {
    const colonIndex = combo.indexOf(':');
    const lang = combo.slice(0, colonIndex);
    const slug = combo.slice(colonIndex + 1);
    return { params: { lang, slug } };
  });
};

export const GET: APIRoute = async ({ params }) => {
  try {
    const { lang, slug } = params as { lang: Language; slug: string };
    const posts = await getSeriesTimelineIndex(slug, lang);

    const allSeries = await getCollection('series');
    const series = allSeries.find((s) => s.data.name === slug);

    return new Response(
      JSON.stringify({
        series: {
          slug,
          title: series?.data.title ?? slug,
          description: series?.data.description ?? '',
        },
        lang,
        total: posts.length,
        posts,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('Series index error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
