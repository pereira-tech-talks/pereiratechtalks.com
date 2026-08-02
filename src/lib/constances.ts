/** Timezone for scheduled post detection — build and badge use this consistently */
export const SITE_TIMEZONE = 'America/Bogota';

export const SITE_TITLE: string =
  'Pereira Tech Talks — Comunidad técnica de Pereira';
export const SITE_DESCRIPTION: string =
  'Pereira Tech Talks v3.0.0 — comunidad técnica bilingüe de Pereira (Risaralda, Colombia). Meetups mensuales, Pereira Tech Day, Speaker School, La Biblioteca del Mañana, AI Channel, blog y slides.';
export const BLOG_PAGE_SIZE: number = 30;

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

// Newsletter configuration — Google Forms direct POST
export const NEWSLETTER = {
  googleForms: {
    formUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSedegaN0_5eZWLIuizdKPCV1pAUm8vTatHo_ny07IXd8_xIfw/formResponse',
    entries: {
      email: 'entry.903587259',
    },
  },
} as const;

/**
 * Contact form configuration.
 *
 * Two backends are supported:
 *
 * 1. **Cloudflare Pages Function + Resend (preferred for production).**
 *    Set `PUBLIC_CONTACT_API_ENDPOINT` (e.g. `/api/contact`) and configure
 *    the server-side `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and
 *    `CONTACT_FROM_EMAIL` secrets on the Cloudflare Pages project.
 *    The Svelte form POSTs a JSON payload that `functions/api/contact.ts`
 *    validates, spam-checks, and forwards via Resend.
 *
 * 2. **Google Forms fallback (legacy / static-only deployments).** When
 *    `PUBLIC_CONTACT_API_ENDPOINT` is empty, the Svelte form posts the
 *    submission directly to the Google Forms endpoint below using the
 *    same entry IDs configured in Google Forms.
 *
 * Both flows can coexist — the env-driven endpoint always wins.
 */
export const CONTACT_FORM = {
  apiEndpoint: (import.meta.env.PUBLIC_CONTACT_API_ENDPOINT || '').trim(),
  googleForms: {
    formUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScuGSujpXLKF5eS4Z_6ZGAYf6j1iPrOIHwtJ-3i1_7MGk466Q/formResponse',
    entries: {
      name: 'entry.1008715654',
      email: 'entry.903587259',
      reason: 'entry.677814908',
      subject: 'entry.1738397177',
      message: 'entry.110815800',
    },
  },
} as const;
