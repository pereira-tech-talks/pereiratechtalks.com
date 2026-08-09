import type { APIRoute, GetStaticPaths } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  linkLine,
  mdHref,
  mdLabel,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getDeckSlug, getSlideDecks } from '@/lib/slides';

/**
 * `/slides/{slug}.md` — a slide deck.
 *
 * Rebuilt on `serializeGenericToMarkdown` in Task 9 of
 * PLAN_sitewide_language_seo_aeo_audit: the hand-rolled version had no front
 * block (`Language:` and `Canonical:` were bullet points inside a Metadata
 * section, not parseable lines) and no Site Navigation block at all — the only
 * page type in the build that violated both universal rules.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const decks = await getSlideDecks('en');
  return decks.map((deck) => ({
    params: { slug: getDeckSlug(deck.id) },
    props: { deck },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const lang = 'en';
  const { deck } = props as {
    deck: Awaited<ReturnType<typeof getSlideDecks>>[number];
  };
  const data = deck.data;
  const slug = getDeckSlug(deck.id);
  const L = (key: Parameters<typeof mdLabel>[1]) => mdLabel(lang, key);

  const metadata: Array<[string, string]> = [
    [L('type'), data.type],
    ['Published', data.pubDate.toISOString().split('T')[0]],
  ];
  if (data.updatedDate) {
    metadata.push(['Updated', data.updatedDate.toISOString().split('T')[0]]);
  }
  if (data.eventName) {
    const when = data.eventDate
      ? ` (${data.eventDate.toISOString().split('T')[0]})`
      : '';
    metadata.push(['Event', `${data.eventName}${when}`]);
  }

  const sections = [];
  if (data.eventUrl) {
    sections.push({
      heading: 'Event',
      lines: [linkLine(data.eventName ?? data.eventUrl, data.eventUrl)],
    });
  }
  if (data.type === 'external') {
    sections.push({
      heading: 'External presentation',
      lines: [linkLine(data.provider ?? 'Open the deck', data.externalUrl)],
    });
  }
  if (data.relatedPost) {
    sections.push({
      heading: 'Related post',
      lines: [
        linkLine(data.relatedPost, mdHref(lang, `blog/${data.relatedPost}`)),
      ],
    });
  }

  const markdown = serializeGenericToMarkdown({
    title: data.title,
    description: data.description,
    lang,
    canonical: `${SITE_URL}/en/slides/${slug}`,
    metadata,
    // The full deck source for internal decks; the supplementary copy for
    // external ones. Either way it is the page's substance.
    body: deck.body ?? '',
    sections,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
