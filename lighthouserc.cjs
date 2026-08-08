module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      // Keep CI lean: home + flagship conference listing only.
      // Full surface lives in lighthouserc.full.cjs (`pnpm run lighthouse:full`).
      //
      // `?lang=es` still pins Spanish explicitly (optional now that there is
      // no browser-language auto-redirect). Kept for stable LHCI baselines.
      url: ['/?lang=es', '/pereira-tech-day/'],
      // Median of 3 reduces LHCI noise around the 0.99↔1.00 boundary.
      numberOfRuns: 3,
      settings: {
        // --lang=es-ES + Lighthouse UA: leftover skip path in LanguageRedirect.
        chromeFlags:
          '--no-sandbox --headless --lang=es-ES --user-agent="Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse"',
        // Skip the robots-txt audit because it follows RFC 9309 strictly and
        // rejects the Content-Signal directive (IETF draft
        // draft-romm-aipref-contentsignals) as unknown. The directive is
        // required in robots.txt for isitagentready.com's Bot Access Control
        // check. Skipping this single audit keeps SEO category at 1.00 while
        // every other audit (meta tags, viewport, crawlability, structured
        // data, hreflang, etc.) stays strict.
        skipAudits: ['robots-txt'],
        // Belt-and-suspenders: never hit the Umami proxy during lab runs
        // (static dist has no Pages Functions; a 404 would fail Best Practices).
        blockedUrlPatterns: ['*/api/umami/*', '*umami.is*', '*umami/script.js*'],
      },
    },
    assert: {
      assertions: {
        // Performance: allow lab noise (CI medians often land ~0.96–0.98).
        'categories:performance': ['error', { minScore: 0.9 }],
        // Accessibility / Best Practices / SEO: always gate at 100.
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 1.0 }],
        'categories:seo': ['error', { minScore: 1.0 }],
        // object-fit:cover on the full-bleed home hero can trip aspect-ratio;
        // keep the category at 1.00 by ignoring that single lab heuristic.
        'image-aspect-ratio': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
