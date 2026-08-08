import type { APIRoute, GetStaticPaths } from 'astro';

import { getDeckSlug, getSlideDecks } from '@/lib/slides';

export const getStaticPaths: GetStaticPaths = async () => {
  const decks = await getSlideDecks('es');
  return decks.map((deck) => ({
    params: { slug: getDeckSlug(deck.id) },
    props: { deck },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { deck } = props;
  const data = deck.data;
  let markdown = '';

  markdown += `# ${data.title}\n\n`;
  markdown += `> ${data.description}\n\n`;

  // Bloque de metadatos (legible por agentes)
  markdown += '## Metadatos\n\n';
  markdown += `- **Tipo:** ${data.type}\n`;
  markdown += `- **Idioma:** es\n`;
  markdown += `- **Publicado:** ${data.pubDate.toISOString().split('T')[0]}\n`;
  if (data.updatedDate) {
    markdown += `- **Actualizado:** ${data.updatedDate.toISOString().split('T')[0]}\n`;
  }
  if (data.eventName) {
    markdown += `- **Evento:** ${data.eventName}`;
    if (data.eventDate) {
      markdown += ` (${data.eventDate.toISOString().split('T')[0]})`;
    }
    if (data.eventUrl) markdown += ` — ${data.eventUrl}`;
    markdown += '\n';
  }
  if (data.relatedPost) {
    markdown += `- **Artículo relacionado:** /blog/${data.relatedPost}\n`;
  }
  markdown +=
    '- **Fuente:** Pereira Tech Talks (https://pereiratechtalks.org)\n';
  markdown += '\n';

  if (data.type === 'external') {
    markdown += '## Presentación Externa\n\n';
    markdown += `- **URL:** ${data.externalUrl}\n`;
    if (data.provider) markdown += `- **Proveedor:** ${data.provider}\n`;
    markdown += '\n';
  }

  if (deck.body?.trim()) {
    markdown += '## Contenido\n\n';
    markdown += deck.body;
  }

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
