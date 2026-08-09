import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';

import { serializePageToAgentMarkdown } from '@/lib/markdown-for-agents';

function getPageSlug(pageId: string): string {
  // Strip language prefix: "es/about" → "about"
  const parts = pageId.split('/');
  return parts[parts.length - 1];
}

function getPageLanguage(pageId: string): string {
  return pageId.split('/')[0];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allPages = await getCollection('pages');
  return (
    allPages
      .filter((page) => getPageLanguage(page.id) === 'es')
      // `/pereira-tech-day.md` is served by its own endpoint, which mirrors
      // the current edition rather than a hand-written stub.
      .filter((page) => getPageSlug(page.id) !== 'pereira-tech-day')
      // `/index.md` is served by its own endpoint, which appends the home
      // page's dynamic blocks (next event, programs, sponsors, latest posts).
      .filter((page) => getPageSlug(page.id) !== 'index')
      // `/communities.md` is served by its own endpoint, sourced from the
      // `communities` collection so it cannot drift from the HTML.
      .filter((page) => getPageSlug(page.id) !== 'communities')
      // `/calendar.md` is served by its own endpoint, sourced from the
      // `communityCalendars` collection.
      .filter((page) => getPageSlug(page.id) !== 'calendar')
      // `/contact.md` is served by its own endpoint so the form's topic
      // options come from the same strings the HTML renders.
      .filter((page) => getPageSlug(page.id) !== 'contact')
      .map((page) => ({
        params: { page: getPageSlug(page.id) },
        props: { page },
      }))
  );
};

export const GET: APIRoute = ({ props }) => {
  const { page } = props;
  const slug = getPageSlug(page.id);
  const markdown = serializePageToAgentMarkdown(page, { slug, lang: 'es' });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
