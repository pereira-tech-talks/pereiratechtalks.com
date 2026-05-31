module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['/', '/about/', '/blog/', '/blog/astro-and-svelte-the-future-of-web-development/', '/es/'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless',
        // Skip the robots-txt audit because it follows RFC 9309 strictly and
        // rejects the Content-Signal directive (IETF draft
        // draft-romm-aipref-contentsignals) as unknown. The directive is
        // required in robots.txt for isitagentready.com's Bot Access Control
        // check. Skipping this single audit keeps SEO category at 1.00 while
        // every other audit (meta tags, viewport, crawlability, structured
        // data, hreflang, etc.) stays strict.
        skipAudits: ['robots-txt'],
      },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: '^(?!.*/blog/).*$',
          assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
            'categories:accessibility': ['error', { minScore: 1.0 }],
            'categories:best-practices': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.95 }],
          },
        },
        {
          matchingUrlPattern: '.*/blog/$',
          assertions: {
            'categories:performance': ['error', { minScore: 0.7 }],
            'categories:accessibility': ['error', { minScore: 1.0 }],
            'categories:best-practices': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.95 }],
          },
        },
        {
          matchingUrlPattern: '.*/blog/[^/]+/',
          assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.95 }],
          },
        },
      ],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
