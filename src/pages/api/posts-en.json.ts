import type { APIRoute } from 'astro';
import { getSearchIndexByLanguage } from '@/lib/blog';

export const GET: APIRoute = async () => {
  try {
    const searchIndex = await getSearchIndexByLanguage('en');

    return new Response(JSON.stringify(searchIndex), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Search index EN error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
