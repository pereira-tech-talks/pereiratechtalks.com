import { getCollection } from 'astro:content';

import type { APIRoute, GetStaticPaths } from 'astro';

import { getSeriesTimelineIndex } from '@/lib/blog';

import type { Language } from '@/lib/i18n';

export interface SeriesListingEntry {
  slug: string;
  title: string;
  description: string;
  order: number;
  postCount: number;
  heroImage: string | null;
  firstPostHero: string | null;
  lastPostDate: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return [{ params: { lang: 'en' } }, { params: { lang: 'es' } }];
};

export const GET: APIRoute = async ({ params }) => {
  try {
    const { lang } = params as { lang: Language };
    const allSeries = await getCollection('series');
    const seriesEntries: SeriesListingEntry[] = [];

    for (const series of allSeries) {
      const posts = await getSeriesTimelineIndex(series.id, lang);
      if (posts.length === 0) continue;

      const firstPostHero = posts[0]?.heroImage || null;

      // Find the most recent post date across all posts in the series
      const lastPostDate = posts.reduce((latest, post) => {
        const d = post.pubDate;
        return d > latest ? d : latest;
      }, posts[0].pubDate);

      seriesEntries.push({
        slug: series.id,
        title: series.data.title,
        description: series.data.description || '',
        order: series.data.order,
        postCount: posts.length,
        heroImage:
          (lang === 'es' && series.data.heroImageEs) ||
          series.data.heroImage ||
          null,
        firstPostHero,
        lastPostDate,
      });
    }

    // Sort by most recent post date (newest first), fallback to order
    seriesEntries.sort((a, b) => {
      const dateCompare =
        new Date(b.lastPostDate).valueOf() - new Date(a.lastPostDate).valueOf();
      if (dateCompare !== 0) return dateCompare;
      return a.order - b.order;
    });

    return new Response(
      JSON.stringify({
        lang,
        total: seriesEntries.length,
        series: seriesEntries,
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
    console.error('Series listing index error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
