import EventEmitter from 'node:events';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

EventEmitter.defaultMaxListeners = 20;
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
// @ts-check
import { defineConfig } from 'astro/config';

import excludeInternal from './src/integrations/exclude-internal';
import {
  satteriExternalLinks,
  satteriImageDefaults,
} from './src/lib/satteri-plugins';

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
    // Astro 7 ships Sätteri (the Rust Markdown/MDX compiler) as the default
    // compiler. It does not run remark/rehype plugins, so our former rehype
    // plugins are ported to Sätteri HAST plugins. `@astrojs/mdx` inherits this
    // processor automatically, so `.md` and `.mdx` share the same pipeline.
    processor: satteri({
      hastPlugins: [satteriExternalLinks(), satteriImageDefaults()],
    }),
  },
  integrations: [
    mdx(),
    sitemap({
      lastmod: new Date(),
      // '/talks' and '/talks/{slug}' are 301 redirect stubs (Task 22 of
      // PLAN_world_class_site_upgrade) — meetups is the canonical surface,
      // so the redirected URLs must not appear in the sitemap.
      filter: (page) =>
        !page.includes('/internal/') &&
        !page.endsWith('/internal') &&
        !/\/talks(\/|$)/.test(page),
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
