import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

import { getSeriesTimelineIndex } from '@/lib/blog';
import { serializeSeriesListingToMarkdown } from '@/lib/markdown-for-agents';
import { getTranslations } from '@/lib/translations';

export const GET: APIRoute = async () => {
  const allSeries = await getCollection('series');

  const entries = (
    await Promise.all(
      allSeries.map(async (series) => {
        const posts = await getSeriesTimelineIndex(series.id, 'en');
        if (posts.length === 0) return null;
        return {
          slug: series.id,
          title: series.data.title,
          description: series.data.description || '',
          postCount: posts.length,
          order: series.data.order ?? 0,
        };
      })
    )
  ).filter((e): e is NonNullable<typeof e> => e !== null);

  const t = getTranslations('en').seriesListingPage;
  const markdown = serializeSeriesListingToMarkdown(entries, {
    lang: 'en',
    title: `Pereira Tech Talks — ${t.title}`,
    description: t.description,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
