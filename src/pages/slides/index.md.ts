import type { APIRoute } from 'astro';

import { getDeckSlug, getSlideDecks } from '@/lib/slides';

export const GET: APIRoute = async () => {
  const decks = await getSlideDecks('en');

  let markdown = '# Slides — Presentation Decks\n\n';
  markdown +=
    '> A collection of presentation decks by Sergio Alexander — conference talks, meetup slides, and technical deep dives.\n\n';

  for (const deck of decks) {
    const slug = getDeckSlug(deck.id);
    markdown += `## [${deck.data.title}](/slides/${slug})\n\n`;
    markdown += `> ${deck.data.description}\n\n`;
    markdown += `- **Type:** ${deck.data.type}\n`;
    markdown += `- **Date:** ${deck.data.pubDate.toISOString().split('T')[0]}\n`;
    if (deck.data.eventName)
      markdown += `- **Event:** ${deck.data.eventName}\n`;
    markdown += '\n---\n\n';
  }

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
