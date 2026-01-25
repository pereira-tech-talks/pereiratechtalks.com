import fs from 'node:fs';
import { cpus } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import icon from 'astro-icon';
import { defineConfig, squooshImageService } from 'astro/config';
import astrowind from './src/integration';

import {
  lazyImagesRehypePlugin,
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
} from './src/utils/frontmatter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CPU_COUNT = cpus().length;

const hasExternalScripts = true;

const whenExternalScripts = (items = []) => {
  const eachItem = Array.isArray(items)
    ? items.map((item) => item())
    : [items()];
  return hasExternalScripts ? eachItem : [];
};

// Log the build configuration
console.log(`🎯 Astro Build Target: ${process.env.BUILD_TARGET || 'production'}`);
console.log(`💻 CPU Count: ${CPU_COUNT}`);

export default defineConfig({
  site: 'https://www.pereiratechtalks.com',
  output: 'static',
  build: {
    concurrency: CPU_COUNT,
    rollupOptions: {
      // Maximum parallel file operations
      maxParallelFileOps: CPU_COUNT * 2, // 2x CPU cores for I/O bound operations
      output: {
        // Fewer, larger chunks = less overhead
        manualChunks: undefined,
      },
    },
    assets: 'assets',
  },
  base: '/',
  telemetry: false,
  server: {
    port: 4321,
    host: true,
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      }),
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind(),
    svelte(),
  ],

  redirects: {
    '/pereira-tech-day/codigo-conducta': '/codigo-conducta',
  },

  image: {
    service: squooshImageService(),
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
    build: {
      // Allow larger chunks for speed
      chunkSizeWarningLimit: 10000,
      // Fastest minifier
      minify: 'esbuild',
      // Utilize all cores
      rollupOptions: {
        maxParallelFileOps: CPU_COUNT * 3,
      },
    },
  },

  compressHTML: false,
});
