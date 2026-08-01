import EventEmitter from 'node:events';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

EventEmitter.defaultMaxListeners = 20;
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
// @ts-check
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import { rehypeImageDefaults } from './src/lib/rehype-image-defaults.mjs';

import excludeInternal from './src/integrations/exclude-internal';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
export default defineConfig({
  // Astro 7 ships the Rust Markdown/Astro compiler as the default — the former
  // `experimental.rustCompiler` flag was removed, so there is nothing to opt into.
  site: 'https://pereiratechtalks.org',
  build: {
    inlineStylesheets: 'always',
  },
  markdown: {
    // Astro 7: `markdown.remarkPlugins` / `rehypePlugins` / `remarkRehype` are
    // replaced by an explicit processor. `unified()` is the same remark/rehype
    // pipeline Astro used before, now configured directly.
    processor: unified({
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          },
        ],
        rehypeImageDefaults,
      ],
    }),
  },
  integrations: [
    mdx(),
    sitemap({
      lastmod: new Date(),
      filter: (page) =>
        !page.includes('/internal/') && !page.endsWith('/internal'),
    }),
    svelte(),
    excludeInternal(),
  ],
  server: {
    host: true,
    port: 8888,
  },
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
            (warning.exporter?.includes('svelte/') || warning.exporter?.includes('@astrojs/internal-helpers'))) {
            return;
          }
          defaultHandler(warning);
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/svelte/')) {
              return 'svelte';
            }
          },
        },
      },
    },
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      force: false,
      holdUntilCrawlEnd: false,
    },
    server: {
      hmr: {
        overlay: true,
      },
      port: 8888,
      watch: {
        ignored: ['**/.lighthouseci/**'],
      },
    },
  },
});
