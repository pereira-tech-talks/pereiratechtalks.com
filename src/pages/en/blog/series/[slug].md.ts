import { getCollection } from 'astro:content';

import type { APIRoute, GetStaticPaths } from 'astro';

import { getPostSlug, isPostVisibleInProduction } from '@/lib/blog';
import { serializeSeriesIndexToMarkdown } from '@/lib/markdown-for-agents';

export const getStaticPaths: GetStaticPaths = async () => {
  const allSeries = await getCollection('series');
  return allSeries.map((s) => ({
    params: { slug: s.id },
    props: { series: s },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { series } = props;
  const allPosts = await getCollection('blog');

  const posts = allPosts
    .filter((post) => {
      if (!post.id.startsWith('en/')) return false;
      if (!isPostVisibleInProduction(post)) return false;
      if (post.data.series !== series.data.name) return false;
      return true;
    })
    .map((post) => ({
      title: post.data.title,
      slug: getPostSlug(post.id),
      description: post.data.description,
      seriesOrder: post.data.seriesOrder ?? 0,
    }));

  const markdown = serializeSeriesIndexToMarkdown(posts, {
    slug: series.id,
    seriesTitle: series.data.title,
    seriesDescription: series.data.description || '',
    lang: 'en',
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
