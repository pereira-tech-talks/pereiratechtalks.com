import type { APIRoute, GetStaticPaths } from 'astro';

import type { Language } from '@/lib/i18n';
import { getSlidesTimelineIndex } from '@/lib/slides';

export const getStaticPaths: GetStaticPaths = () => {
  return [{ params: { lang: 'en' } }, { params: { lang: 'es' } }];
};

export const GET: APIRoute = async ({ params }) => {
  try {
    const { lang } = params as { lang: Language };
    const decks = await getSlidesTimelineIndex(lang);

    return new Response(
      JSON.stringify({
        lang,
        total: decks.length,
        decks,
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
    console.error('Slides timeline index error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
