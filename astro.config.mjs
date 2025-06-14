import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import sentry from '@sentry/astro';
import compress from 'astro-compress';
import icon from 'astro-icon';
import { defineConfig, squooshImageService } from 'astro/config';
import astrowind from './src/integration';
import { fetchEventsMeetup, getMostRecentEvent } from './src/utils/event';

import {
  lazyImagesRehypePlugin,
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
} from './src/utils/frontmatter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = true;

async function fetchEventData() {
  let newEventData = null;
  const dataPath = './src/data';

  if (!newEventData) {
    newEventData = await getMostRecentEvent();
  }
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }

  fs.writeFileSync(
    `${dataPath}/announcementData.json`,
    JSON.stringify(newEventData),
  );
}

const whenExternalScripts = (items = []) => {
  const eachItem = Array.isArray(items)
    ? items.map((item) => item())
    : [items()];
  return hasExternalScripts ? eachItem : [];
};

export default defineConfig({
  site: 'https://www.pereiratechtalks.com',
  output: 'static',
  build: {
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
    sentry(
      process.env.SENTRY_DSN
        ? {
            dsn: process.env.SENTRY_DSN,
            sourceMapsUploadOptions: {
              project: process.env.SENTRY_PROJECT,
              authToken: process.env.SENTRY_AUTH_TOKEN,
            },
          }
        : {},
    ),
    // spotlightjs()
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
    plugins: [
      {
        name: 'fetch-all-events',
        buildStart: async () => {
          await fetchEventsMeetup('upcoming', 5);
          await fetchEventsMeetup('past', 5);
        },
      },
      {
        name: 'fetch-recent-event',
        buildStart: async () => {
          await fetchEventData();
        },
      },
    ],
  },
});
