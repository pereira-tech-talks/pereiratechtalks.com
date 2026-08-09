import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

import { getPostSlug, isPostVisibleInProduction } from '@/lib/blog';
import { serializeBlogIndexToMarkdown } from '@/lib/markdown-for-agents';

export const GET: APIRoute = async () => {
  const allPosts = await getCollection('blog');
  const posts = allPosts
    .filter(
      (post) => post.id.startsWith('en/') && isPostVisibleInProduction(post)
    )
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const entries = posts.map((post) => ({
    title: post.data.title,
    slug: getPostSlug(post.id),
    description: post.data.description,
    pubDate: post.data.pubDate,
    tags: post.data.tags,
  }));

  const markdown = serializeBlogIndexToMarkdown(entries, {
    lang: 'en',
    title: 'Pereira Tech Talks Blog — Articles & Stories',
    description:
      'Articles from the Pereira Tech Talks community: technology, AI, building things, and the people behind them.',
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
