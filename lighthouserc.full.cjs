module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        // Base pages (same as lighthouserc.cjs) — pin home lang (see lighthouserc.cjs).
        '/?lang=es',
        '/about/',
        '/blog/',
        '/en/',
        // Blog listing EN (i18n parity)
        '/en/blog/',
        // Series pages
        '/blog/series/',
        // Blog tag listing
        '/blog/tag/community/',
        // Form page
        '/contact/',
        // Pereira Tech Days catalog
        '/pereira-tech-day/',
        // Meetups catalog
        '/meetups/',
        // Slides catalog
        '/slides/',
        // Speakers catalog
        '/speakers/',
        // Sponsors catalog
        '/sponsors/',
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags:
          '--no-sandbox --headless --lang=es-ES --user-agent="Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse"',
        blockedUrlPatterns: ['*/api/umami/*', '*umami.is*', '*umami/script.js*'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 1.0 }],
        'categories:seo': ['error', { minScore: 1.0 }],
        'image-aspect-ratio': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
