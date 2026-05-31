module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        // Base pages (same as lighthouserc.cjs)
        '/',
        '/about/',
        '/blog/',
        '/es/',
        // Blog listing ES (i18n parity)
        '/es/blog/',
        // Series pages
        '/blog/series/',
        // Blog tag listing
        '/blog/tag/community/',
        // Form page
        '/contact/',
        // Pereira Tech Days catalog
        '/pereira-tech-days/',
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
        chromeFlags: '--no-sandbox --headless',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
