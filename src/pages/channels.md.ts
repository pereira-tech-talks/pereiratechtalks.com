import type { APIRoute } from 'astro';

import { getChannels } from '@/lib/channel';
import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const channels = await getChannels();
  const primary = channels.filter((c) => c.data.isPrimary);
  const secondary = channels.filter((c) => !c.data.isPrimary);

  const renderChannel = (c: (typeof channels)[number]) =>
    `- [${c.data.name}](${c.data.url}) (${c.data.platform}) — ${resolveI18n(c.data.description, lang)}`;

  const sections = [
    {
      heading: 'Primary channel',
      lines: primary.map(renderChannel),
    },
    {
      heading: 'Other channels',
      lines: secondary.map(renderChannel),
    },
  ];

  const markdown = serializeGenericToMarkdown({
    title: 'Channels — Pereira Tech Talks',
    description:
      'All official Pereira Tech Talks channels: Meetup.com (primary), social networks, GitHub, and Linktree, with guidance on where to start.',
    lang,
    canonical: `${SITE_URL}/channels`,
    metadata: [['Total channels', String(channels.length)]],
    sections,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
