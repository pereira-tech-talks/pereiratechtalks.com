import type { APIRoute } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  entityLine,
  mdHref,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getDeckSlug, getSlideDecks } from '@/lib/slides';
import { getTranslations } from '@/lib/translations';

/**
 * `/slides.md` — sourced from the same translation strings the HTML renders,
 * so the page's own prose is present rather than a bare deck list.
 */
export const GET: APIRoute = async () => {
  const lang = 'en';
  const t = getTranslations(lang).slidesPage;
  const decks = await getSlideDecks(lang);

  const markdown = serializeGenericToMarkdown({
    title: `${t.title} — ${t.subtitle}`,
    description: t.description,
    lang,
    canonical: `${SITE_URL}/en/slides`,
    metadata: [['Total decks', String(decks.length)]],
    body: t.heroDescription,
    sections: [
      {
        heading: t.timelineTitle,
        lines: decks.map((deck) =>
          entityLine(
            deck.data.title,
            mdHref(lang, `slides/${getDeckSlug(deck.id)}`),
            deck.data.pubDate.toISOString().split('T')[0],
            deck.data.type,
            deck.data.eventName,
            deck.data.description
          )
        ),
      },
    ],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
