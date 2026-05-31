import type { APIRoute } from 'astro';

import { getDeckSlug, getSlideDecks } from '@/lib/slides';

export const GET: APIRoute = async () => {
  const decks = await getSlideDecks('es');

  let markdown = '# Diapositivas — Presentaciones\n\n';
  markdown +=
    '> Una colección de presentaciones de Sergio Alexander — charlas de conferencias, slides de meetups y deep dives técnicos.\n\n';

  for (const deck of decks) {
    const slug = getDeckSlug(deck.id);
    markdown += `## [${deck.data.title}](/es/slides/${slug})\n\n`;
    markdown += `> ${deck.data.description}\n\n`;
    markdown += `- **Tipo:** ${deck.data.type}\n`;
    markdown += `- **Fecha:** ${deck.data.pubDate.toISOString().split('T')[0]}\n`;
    if (deck.data.eventName)
      markdown += `- **Evento:** ${deck.data.eventName}\n`;
    markdown += '\n---\n\n';
  }

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
