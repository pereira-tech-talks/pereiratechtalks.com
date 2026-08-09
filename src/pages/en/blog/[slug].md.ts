import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';

import { resolvePostContext } from '@/lib/agent-resolvers';
import { getPostSlug, isPostVisibleInProduction } from '@/lib/blog';
import { serializePostToAgentMarkdown } from '@/lib/markdown-for-agents';

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getCollection('blog');
  const posts = allPosts.filter(
    (post) => post.id.startsWith('en/') && isPostVisibleInProduction(post)
  );
  return posts.map((post) => ({
    params: { slug: getPostSlug(post.id) },
    props: { post },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;
  const slug = getPostSlug(post.id);
  const context = await resolvePostContext(post, 'en');
  const markdown = serializePostToAgentMarkdown(post, {
    slug,
    lang: 'en',
    ...context,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
