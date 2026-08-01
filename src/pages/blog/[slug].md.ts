import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';

import { getPostSlug, isPostVisibleInProduction } from '@/lib/blog';
import { serializePostToAgentMarkdown } from '@/lib/markdown-for-agents';

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getCollection('blog');
  const posts = allPosts.filter(
    (post) => post.id.startsWith('es/') && isPostVisibleInProduction(post)
  );
  return posts.map((post) => ({
    params: { slug: getPostSlug(post.id) },
    props: { post },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { post } = props;
  const slug = getPostSlug(post.id);
  const markdown = serializePostToAgentMarkdown(post, { slug, lang: 'es' });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
