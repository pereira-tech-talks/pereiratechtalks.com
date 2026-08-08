import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';

import { serializePageToAgentMarkdown } from '@/lib/markdown-for-agents';

function getPageSlug(pageId: string): string {
  // Strip language prefix: "en/about" → "about"
  const parts = pageId.split('/');
  return parts[parts.length - 1];
}

function getPageLanguage(pageId: string): string {
  return pageId.split('/')[0];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allPages = await getCollection('pages');
  return allPages
    .filter((page) => getPageLanguage(page.id) === 'en')
    .map((page) => ({
      params: { page: getPageSlug(page.id) },
      props: { page },
    }));
};

export const GET: APIRoute = ({ props }) => {
  const { page } = props;
  const slug = getPageSlug(page.id);
  const markdown = serializePageToAgentMarkdown(page, { slug, lang: 'en' });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
