import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, squooshImageService } from 'astro/config';

// import { astroImageTools } from 'astro-imagetools';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import svelte from '@astrojs/svelte';
import sentry from '@sentry/astro';
import astrowind from './src/integration';
import { getMostRecentEvent } from './src/utils/event';

import {
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
  lazyImagesRehypePlugin,
} from './src/utils/frontmatter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;

async function fetchEventData() {
  let newEventData = null;
  const dataPath = './src/data';

  if (!newEventData) {
    newEventData = await getMostRecentEvent();
  }
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }

  fs.writeFileSync(`${dataPath}/announcementData.json`, JSON.stringify(newEventData));
}

const whenExternalScripts = (items = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  site: 'https://v2.pereiratechtalks.com',
  output: 'static',
  base: '/',
  telemetry: false,
  server: {
    port: 4321,
    host: true,
  },
  integrations: [
    // astroImageTools,
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
      })
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
    sentry(
      process.env.SENTRY_DSN
        ? {
            dsn: process.env.SENTRY_DSN,
            sourceMapsUploadOptions: {
              project: process.env.SENTRY_PROJECT,
              authToken: process.env.SENTRY_AUTH_TOKEN,
            },
          }
        : {}
    ),
    // spotlightjs()
  ],

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
    plugins: [
      {
        name: 'fetch-recent-event',
        buildStart: async () => {
          await fetchEventData();
        },
      },
    ],
  },
});
