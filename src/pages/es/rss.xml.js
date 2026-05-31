import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { getPostSlug, isPostVisibleInProduction } from '@/lib/blog';
import { SITE_TITLE } from '@/lib/constances';
import { getTranslations } from '@/lib/translations';

export async function GET(context) {
  const t = getTranslations('es');
  const allPosts = await getCollection('blog');
  const posts = allPosts.filter(
    (post) => post.id.startsWith('es/') && isPostVisibleInProduction(post)
  );
  return rss({
    title: SITE_TITLE,
    description: t.siteDescription,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/es/blog/${getPostSlug(post.id)}/`,
      categories: post.data.tags || [],
    })),
  });
}
