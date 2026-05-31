import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { getPostSlug, isPostVisibleInProduction } from '@/lib/blog';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/constances';

export async function GET(context) {
  const allPosts = await getCollection('blog');
  const posts = allPosts.filter(
    (post) => post.id.startsWith('en/') && isPostVisibleInProduction(post)
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${getPostSlug(post.id)}/`,
      categories: post.data.tags || [],
    })),
  });
}
