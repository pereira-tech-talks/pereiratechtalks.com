import type { APIRoute } from 'astro';

import {
  resolveCurrentEdition,
  resolveEditionDetail,
} from '@/lib/agent-resolvers';
import { serializeEditionToMarkdown } from '@/lib/markdown-for-agents';

/**
 * `/pereira-tech-day.md` — the canonical alias for the current edition.
 *
 * The HTML at this URL renders the full current edition, so the `.md` must
 * too. It previously served a hand-written stub listing the archive, which
 * measured 0.056 coverage — the worst page in the build.
 *
 * Excluded from the `pages` collection endpoint (`[page].md.ts`) so the two
 * routes cannot both claim this path.
 */
export const GET: APIRoute = async () => {
  const edition = await resolveCurrentEdition();
  if (!edition) {
    return new Response('Not found', { status: 404 });
  }

  const data = await resolveEditionDetail(edition, 'es');
  const markdown = serializeEditionToMarkdown(data, 'es', '/pereira-tech-day');

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
