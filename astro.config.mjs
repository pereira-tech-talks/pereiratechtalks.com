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

/**
 * Absolute origin baked into canonical / og:url / og:image / sitemap.
 *
 * Must match the hostname people actually share. The apex
 * `pereiratechtalks.org` currently 301s asset URLs toward the legacy
 * `.com` / `www` stack (and the OG image ends in 404), so Facebook falls
 * back to the favicon. While the public surface is the v3 preview host,
 * default to that; override with PUBLIC_SITE_URL (or SITE) at cutover.
 */
const site =
  process.env.PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  process.env.SITE?.replace(/\/$/, '') ||
  'https://v3.pereiratechtalks.org';

// https://astro.build/config
export default defineConfig({
  // Astro 7 ships the Rust Markdown/Astro compiler as the default — the former
  // `experimental.rustCompiler` flag was removed, so there is nothing to opt into.
  site,
  build: {
    // 'always' inlined ~156KB of Tailwind into every HTML document, which
    // delayed LCP paint (render-delay ~1.8s) under LHCI Slow-4G. 'auto' keeps
    // tiny scoped sheets inline and emits the shared bundle as a cacheable
    // /_astro/*.css file discovered in parallel with the LCP preload.
    inlineStylesheets: 'auto',
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
        !page.includes('/certificates/') &&
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
