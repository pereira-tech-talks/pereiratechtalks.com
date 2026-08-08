/** Timezone for scheduled post detection — build and badge use this consistently */
export const SITE_TIMEZONE = 'America/Bogota';
/** Fixed offset for Colombia wall-clock times (UTC−5, no DST). */
export const SITE_TIMEZONE_OFFSET = '-05:00';

/**
 * Public site origin (no trailing slash).
 * Must match `astro.config.mjs` → `site` / `PUBLIC_SITE_URL`.
 */
export const SITE_URL: string = (
  import.meta.env.SITE || 'https://pereiratechtalks.org'
).replace(/\/$/, '');

export const SITE_TITLE: string =
  'Pereira Tech Talks — Comunidad técnica de Pereira';
export const SITE_DESCRIPTION: string =
  'Pereira Tech Talks v3.0.0 — comunidad técnica de Pereira (Risaralda, Colombia). Meetups mensuales, Pereira Tech Day, Speaker School, La Biblioteca del Mañana, AI Channel, blog y slides.';
export const BLOG_PAGE_SIZE: number = 30;

/** Default Open Graph / Twitter share image (1200×630), by language. */
export const DEFAULT_OG_IMAGE_ES = '/images/og-default.jpg';
export const DEFAULT_OG_IMAGE_EN = '/images/og-default-en.jpg';

export function getDefaultOgImage(lang: string | undefined): string {
  return lang === 'en' ? DEFAULT_OG_IMAGE_EN : DEFAULT_OG_IMAGE_ES;
}

const umamiWebsiteId = (import.meta.env.PUBLIC_UMAMI_WEBSITE_ID || '').trim();
const umamiScriptOverride = (
  import.meta.env.PUBLIC_UMAMI_SCRIPT_URL || ''
).trim();
const umamiUseProxy = import.meta.env.PUBLIC_UMAMI_USE_PROXY !== 'false';

// Analytics configuration — scripts load only when IDs are provided
export const ANALYTICS = {
  umami: {
    websiteId: umamiWebsiteId,
    /** Load tracker in production when website ID is set; opt-in locally via PUBLIC_UMAMI_ENABLE=true */
    enabled:
      Boolean(umamiWebsiteId) &&
      (import.meta.env.PROD || import.meta.env.PUBLIC_UMAMI_ENABLE === 'true'),
    scriptUrl:
      umamiScriptOverride ||
      (umamiUseProxy
        ? '/api/umami/script.js'
        : 'https://cloud.umami.is/script.js'),
    /** Same-origin collect endpoint when first-party proxy is enabled */
    hostUrl: umamiUseProxy ? '/api/umami' : '',
  },
  verification: {
    bing: import.meta.env.PUBLIC_BING_SITE_VERIFICATION || '',
  },
} as const;

/**
 * Newsletter signup — currently disabled in UI (BlogPostPage).
 * No Google Forms backend. Re-enable only with a Dailybot (or other) API path.
 */
export const NEWSLETTER = {
  apiEndpoint: '',
} as const;

/**
 * Community intake forms → Cloudflare Pages Function → Dailybot Forms.
 *
 * Default endpoint is `/api/contact` so production never silently falls back
 * to a third-party form host. Override with `PUBLIC_CONTACT_API_ENDPOINT` when
 * needed. Server secrets: `DAILYBOT_API_KEY` (required); optional Resend ack
 * via `RESEND_API_KEY` + `CONTACT_FROM_EMAIL`.
 */
export const CONTACT_FORM = {
  apiEndpoint: (
    import.meta.env.PUBLIC_CONTACT_API_ENDPOINT || '/api/contact'
  ).trim(),
} as const;
