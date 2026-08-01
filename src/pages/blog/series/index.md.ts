import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

import { getSeriesTimelineIndex } from '@/lib/blog';
import { serializeSeriesListingToMarkdown } from '@/lib/markdown-for-agents';

export const GET: APIRoute = async () => {
  const allSeries = await getCollection('series');

  const entries = (
    await Promise.all(
      allSeries.map(async (series) => {
        const posts = await getSeriesTimelineIndex(series.id, 'es');
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

  const markdown = serializeSeriesListingToMarkdown(entries, {
    lang: 'es',
    title: 'Pereira Tech Talks — Series del Blog',
    description:
      'Series multi-parte del blog de Pereira Tech Talks — recorridos biling\u00FCes sobre IA, agentes, m\u00F3vil, frontend, infraestructura y m\u00E1s.',
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
