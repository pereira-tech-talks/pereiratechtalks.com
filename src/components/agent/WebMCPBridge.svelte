<script lang="ts">
/**
 * WebMCP bridge — registers site tools for in-browser AI agents.
 * Uses client:load (not client:visible) so lab scanners detect tools on
 * initial page load without scrolling. Prefer registerTool() per the
 * WebMCP / isitagentready skill; fall back to provideContext when needed.
 */
import { onDestroy, onMount } from 'svelte';
import { getUrlPrefix } from '@/lib/i18n';

interface Props {
  lang?: 'en' | 'es';
}

const { lang = 'es' }: Props = $props();

type WebMCPTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
};

type WebMCPContext = {
  provideContext?: (ctx: { tools: WebMCPTool[] }) => void;
  registerTool?: (tool: WebMCPTool, options?: { signal?: AbortSignal }) => void;
};

let controller: AbortController | null = null;

function buildTools(activeLang: 'en' | 'es'): WebMCPTool[] {
  return [
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
      execute: async (args: Record<string, unknown>) => {
        const targetLang = (args.lang as 'en' | 'es' | undefined) ?? activeLang;
        const endpoint =
          targetLang === 'es' ? '/api/posts-es.json' : '/api/posts-en.json';
        const res = await fetch(endpoint);
        const posts: Array<{
          title?: string;
          description?: string;
          slug?: string;
          url?: string;
        }> = await res.json();
        const q = String(args.q ?? '').toLowerCase();
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
      execute: async (args: Record<string, unknown>) => {
        const targetLang = (args.lang as 'en' | 'es' | undefined) ?? activeLang;
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
      execute: async (args: Record<string, unknown>) => {
        const targetLang = (args.lang as 'en' | 'es' | undefined) ?? activeLang;
        const slug = String(args.slug ?? '');
        const urlBase = getUrlPrefix(targetLang);
        const url = `${urlBase}/blog/${encodeURIComponent(slug)}.md`;
        const res = await fetch(url);
        if (!res.ok) return { url, error: `HTTP ${res.status}` };
        return { url, body: await res.text() };
      },
    },
    {
      name: 'list_meetups',
      description:
        'Fetch the Pereira Tech Talks meetups listing as Markdown (for-agents endpoint).',
      inputSchema: {
        type: 'object',
        properties: {
          lang: { type: 'string', enum: ['en', 'es'] },
        },
        required: [],
      },
      execute: async (args: Record<string, unknown>) => {
        const targetLang = (args.lang as 'en' | 'es' | undefined) ?? activeLang;
        const urlBase = getUrlPrefix(targetLang);
        const url = `${urlBase}/meetups/index.md`;
        const res = await fetch(url);
        if (!res.ok) return { url, error: `HTTP ${res.status}` };
        return { url, body: await res.text() };
      },
    },
  ];
}

onMount(() => {
  const mc = (navigator as unknown as { modelContext?: WebMCPContext })
    .modelContext;
  if (!mc) return;

  const tools = buildTools(lang);
  controller = new AbortController();
  const signal = controller.signal;
  let registered = 0;

  // Prefer registerTool — isitagentready.com / WebMCP skill detect this API.
  if (typeof mc.registerTool === 'function') {
    for (const tool of tools) {
      try {
        mc.registerTool(tool, { signal });
        registered += 1;
      } catch (err) {
        console.warn(
          '[WebMCPBridge] registerTool failed:',
          (err as Error).message
        );
      }
    }
  }

  // Also publish via provideContext when available (broader client support).
  if (typeof mc.provideContext === 'function') {
    try {
      mc.provideContext({ tools });
    } catch (err) {
      console.warn(
        '[WebMCPBridge] provideContext failed:',
        (err as Error).message
      );
    }
  }

  if (registered === 0 && typeof mc.registerTool !== 'function') {
    console.warn('[WebMCPBridge] navigator.modelContext has no registerTool');
  }
});

onDestroy(() => {
  controller?.abort();
  controller = null;
});
</script>
