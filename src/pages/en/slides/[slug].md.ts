import type { APIRoute, GetStaticPaths } from 'astro';

import { getDeckSlug, getSlideDecks } from '@/lib/slides';

export const getStaticPaths: GetStaticPaths = async () => {
  const decks = await getSlideDecks('en');
  return decks.map((deck) => ({
    params: { slug: getDeckSlug(deck.id) },
    props: { deck },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { deck } = props;
  const data = deck.data;
  let markdown = '';

  // Title and description
  markdown += `# ${data.title}\n\n`;
  markdown += `> ${data.description}\n\n`;

  // Metadata block (machine-readable for AI agents)
  markdown += '## Metadata\n\n';
  markdown += `- **Type:** ${data.type}\n`;
  markdown += `- **Language:** en\n`;
  markdown += `- **Published:** ${data.pubDate.toISOString().split('T')[0]}\n`;
  if (data.updatedDate) {
    markdown += `- **Updated:** ${data.updatedDate.toISOString().split('T')[0]}\n`;
  }
  if (data.eventName) {
    markdown += `- **Event:** ${data.eventName}`;
    if (data.eventDate) {
      markdown += ` (${data.eventDate.toISOString().split('T')[0]})`;
    }
    if (data.eventUrl) markdown += ` — ${data.eventUrl}`;
    markdown += '\n';
  }
  if (data.relatedPost) {
    markdown += `- **Related post:** /en/blog/${data.relatedPost}\n`;
  }
  markdown +=
    '- **Source:** Pereira Tech Talks (https://pereiratechtalks.org)\n';
  markdown += '\n';

  // Type-specific fields
  if (data.type === 'external') {
    markdown += '## External Presentation\n\n';
    markdown += `- **URL:** ${data.externalUrl}\n`;
    if (data.provider) markdown += `- **Provider:** ${data.provider}\n`;
    markdown += '\n';
  }

  // Body — full slide content for internal decks, supplementary copy for externals
  if (deck.body?.trim()) {
    markdown += '## Content\n\n';
    markdown += deck.body;
  }

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
