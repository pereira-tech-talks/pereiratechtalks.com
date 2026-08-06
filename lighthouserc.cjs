module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      // Keep CI lean: home + flagship conference listing only.
      // Full surface lives in lighthouserc.full.cjs (`pnpm run lighthouse:full`).
      //
      // `?lang=es` pins the Spanish home without a client redirect. LHCI's
      // Chrome (new headless) neither sets navigator.webdriver nor puts
      // HeadlessChrome/Lighthouse in the UA, so LanguageRedirect would
      // otherwise send `/` → `/en/` and tank Performance.
      url: ['/?lang=es', '/pereira-tech-days/'],
      numberOfRuns: 1,
      settings: {
        // --lang=es-ES: browser languages match Spanish primary (belt + suspenders).
        // Lighthouse in UA: same skip path PageSpeed uses if negotiation runs.
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
