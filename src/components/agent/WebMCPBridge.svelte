<script lang="ts">
import { onDestroy, onMount } from 'svelte';

interface Props {
  lang?: 'en' | 'es';
}

const { lang = 'en' }: Props = $props();

type WebMCPContext = {
  provideContext?: (ctx: { tools: unknown[] }) => void;
  registerTool?: Function;
};

let controller: AbortController | null = null;

onMount(() => {
  const mc = (navigator as unknown as { modelContext?: WebMCPContext })
    .modelContext;
  if (!mc) return;

  const tools = [
    {
      name: 'search_blog',
      description:
        'Search Pereira Tech Talks blog posts by keyword. Returns titles, descriptions, slugs, and URLs.',
      inputSchema: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'Keyword or phrase to search for.',
          },
          lang: { type: 'string', enum: ['en', 'es'] },
        },
        required: ['q'],
      },
      execute: async (args: { q: string; lang?: 'en' | 'es' }) => {
        const targetLang = args.lang ?? lang;
        const endpoint =
          targetLang === 'es' ? '/api/posts-es.json' : '/api/posts-en.json';
        const res = await fetch(endpoint);
        const posts: Array<{
          title?: string;
          description?: string;
          slug?: string;
          url?: string;
        }> = await res.json();
        const q = args.q.toLowerCase();
        return posts
          .filter(
            (p) =>
              (p.title?.toLowerCase().includes(q) ?? false) ||
              (p.description?.toLowerCase().includes(q) ?? false)
          )
          .slice(0, 20);
      },
    },
    {
      name: 'list_series',
      description: 'List all blog series published on Pereira Tech Talks.',
      inputSchema: {
        type: 'object',
        properties: {
          lang: { type: 'string', enum: ['en', 'es'] },
        },
        required: [],
      },
      execute: async (args: { lang?: 'en' | 'es' }) => {
        const targetLang = args.lang ?? lang;
        const res = await fetch(`/api/series/${targetLang}`);
        return await res.json();
      },
    },
    {
      name: 'open_post',
      description:
        'Open a blog post by slug and return its plain-text/markdown body (the for-agents endpoint).',
      inputSchema: {
        type: 'object',
        properties: {
          slug: {
            type: 'string',
            description: 'The post slug (no date prefix).',
          },
          lang: { type: 'string', enum: ['en', 'es'] },
        },
        required: ['slug'],
      },
      execute: async (args: { slug: string; lang?: 'en' | 'es' }) => {
        const targetLang = args.lang ?? lang;
        const urlBase = targetLang === 'es' ? '/es' : '';
        const url = `${urlBase}/blog/${encodeURIComponent(args.slug)}.md`;
        const res = await fetch(url);
        if (!res.ok) return { url, error: `HTTP ${res.status}` };
        return { url, body: await res.text() };
      },
    },
  ];

  if (typeof mc.provideContext === 'function') {
    try {
      mc.provideContext({ tools });
      return;
    } catch (err) {
      console.warn(
        '[WebMCPBridge] provideContext failed:',
        (err as Error).message
      );
    }
  }

  if (typeof mc.registerTool === 'function') {
    controller = new AbortController();
    const signal = controller.signal;
    for (const tool of tools) {
      try {
        mc.registerTool(tool, { signal });
      } catch (err) {
        console.warn(
          '[WebMCPBridge] registerTool failed:',
          (err as Error).message
        );
      }
    }
  }
});

onDestroy(() => {
  controller?.abort();
  controller = null;
});
</script>
