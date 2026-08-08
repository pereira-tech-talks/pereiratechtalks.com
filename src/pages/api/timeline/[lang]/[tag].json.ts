import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getTimelineIndex, isPostVisibleInProduction } from '@/lib/blog';
import type { Language } from '@/lib/i18n';

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getCollection('blog');
  const combinations = new Set<string>();

  for (const post of allPosts) {
    if (!isPostVisibleInProduction(post)) continue;
    const lang = post.id.startsWith('en/') ? 'en' : 'es';
    for (const tag of post.data.tags ?? []) {
      combinations.add(`${lang}:${tag}`);
    }
  }

  return Array.from(combinations).map((combo) => {
    const colonIndex = combo.indexOf(':');
    const lang = combo.slice(0, colonIndex);
    const tag = combo.slice(colonIndex + 1);
    return { params: { lang, tag } };
  });
};

export const GET: APIRoute = async ({ params }) => {
  try {
    const { lang, tag } = params as { lang: Language; tag: string };
    const posts = await getTimelineIndex(tag, lang);

    return new Response(
      JSON.stringify({
        tag,
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
    console.error('Timeline index error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
