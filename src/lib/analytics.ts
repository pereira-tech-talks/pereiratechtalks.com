/**
 * Analytics utility for tracking custom events.
 * Uses Umami's event tracking API.
 * Gracefully degrades if analytics is not loaded.
 */

interface UmamiWindow extends Window {
  umami?: {
    track: (
      eventName: string,
      eventData?: Record<string, string | number>
    ) => void;
  };
}

/** Keys that must never appear in event payloads (PII guard). */
export const PII_DENYLIST_KEYS = [
  'email',
  'name',
  'message',
  'phone',
  'address',
  'password',
  'firstname',
  'lastname',
  'fullname',
] as const;

/**
 * Centralized event name catalog.
 * All event names are defined here to ensure consistency across the codebase.
 */
export const EVENTS = {
  NAV_CLICK: 'nav_click',
  LANGUAGE_SWITCH: 'language_switch',
  MOBILE_MENU_TOGGLE: 'mobile_menu_toggle',
  THEME_TOGGLE: 'theme_toggle',
  BLOG_SEARCH: 'blog_search',
  TAG_FILTER: 'tag_filter',
  BLOG_CARD_CLICK: 'blog_card_click',
  PAGINATION_CLICK: 'pagination_click',
  SHARE_CLICK: 'share_click',
  COPY_LINK: 'copy_link',
  SERIES_NAV: 'series_nav',
  SERIES_INDICATOR_CLICK: 'series_indicator_click',
  SLIDE_INDICATOR_CLICK: 'slide_indicator_click',
  POST_INDICATOR_CLICK: 'post_indicator_click',
  LIGHTBOX_OPEN: 'lightbox_open',
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  CONTACT_FORM_ERROR: 'contact_form_error',
  NEWSLETTER_SUBSCRIBE: 'newsletter_subscribe',
  PTD_SUBSCRIBE: 'ptd_subscribe',
  PTD_CTA_CLICK: 'ptd_cta_click',
  SOCIAL_CLICK: 'social_click',
  OUTBOUND_CLICK: 'outbound_click',
  SCROLL_DEPTH: 'scroll_depth',
  SCROLL_TO_TIMELINE: 'scroll_to_timeline',
  TIMELINE_CLICK: 'timeline_click',
  AI_BOT_VISIT: 'ai_bot_visit',
  UNKNOWN_BOT_VISIT: 'unknown_bot_visit',
  MARKDOWN_REQUEST: 'markdown_request',
  NOTIFICATION_CTA: 'notification_cta',
  NOTIFICATION_MODAL_OPEN: 'notification_modal_open',
  CALENDAR_FILTER: 'calendar_filter',
  CALENDAR_VIEW: 'calendar_view',
  CALENDAR_SUBSCRIBE: 'calendar_subscribe',
  CALENDAR_LUMA: 'calendar_luma',
  COMMUNITY_CLICK: 'community_click',
  SPEAKER_CARD_CLICK: 'speaker_card_click',
  MEETUP_CARD_CLICK: 'meetup_card_click',
  TALK_CARD_CLICK: 'talk_card_click',
  SPEAKER_APPLICATION_SUBMIT: 'speaker_application_submit',
  SPEAKER_SCHOOL_APPLY_SUBMIT: 'speaker_school_apply_submit',
  CALENDAR_INTAKE_SUBMIT: 'calendar_intake_submit',
  CONDUCT_REPORT_SUBMIT: 'conduct_report_submit',
  SPONSOR_INQUIRY_SUBMIT: 'sponsor_inquiry_submit',
  CERTIFICATE_PRINT: 'certificate_print',
  CERTIFICATE_SHARE: 'certificate_share',
  CERTIFICATE_COPY: 'certificate_copy',
  CERTIFICATE_JSON: 'certificate_json',
} as const;

export type AnalyticsEventName = (typeof EVENTS)[keyof typeof EVENTS];

export interface AnalyticsContext {
  lang: string;
  section: string;
  edition_year?: number;
}

/** Long-form routes where scroll_depth is meaningful (not listing pages). */
const SCROLL_DEPTH_PATH_PATTERNS: ReadonlyArray<RegExp> = [
  /^\/blog\/[^/]+\/?$/,
  /^\/en\/blog\/[^/]+\/?$/,
  /^\/meetups\/[^/]+\/?$/,
  /^\/en\/meetups\/[^/]+\/?$/,
  /^\/about\/?$/,
  /^\/en\/about\/?$/,
  /^\/about-us\/?$/,
  /^\/en\/about-us\/?$/,
  /^\/pereira-tech-day\/?$/,
  /^\/en\/pereira-tech-day\/?$/,
  /^\/pereira-tech-days\/\d{4}\/?$/,
  /^\/en\/pereira-tech-days\/\d{4}\/?$/,
];

/**
 * Strip language prefix for section detection.
 */
export function normalizePathname(pathname: string): string {
  if (pathname.startsWith('/en/')) return pathname.slice(3) || '/';
  if (pathname === '/en') return '/';
  return pathname;
}

/**
 * Derive stable page section from URL (first path segment after optional /en).
 */
export function getPageSection(pathname: string): string {
  const clean = normalizePathname(pathname);
  if (clean === '/' || clean === '') return 'home';
  const segment = clean.split('/').filter(Boolean)[0];
  // Singular landing and year archive share the same analytics section.
  if (segment === 'pereira-tech-day') return 'pereira-tech-days';
  return segment ?? 'home';
}

/**
 * Extract PTD edition year when on an edition route.
 * Singular landing `/pereira-tech-day` maps to the current flagship year (2026).
 */
export function getEditionYear(pathname: string): number | undefined {
  const match = pathname.match(/\/pereira-tech-days\/(\d{4})/);
  if (match) {
    const year = Number.parseInt(match[1], 10);
    return Number.isFinite(year) ? year : undefined;
  }
  if (/\/pereira-tech-day\/?$/.test(pathname)) {
    return 2026;
  }
  return undefined;
}

/**
 * Build analytics dimensions for event payloads.
 */
export function getAnalyticsContext(
  lang: string,
  pathname: string
): AnalyticsContext {
  const context: AnalyticsContext = {
    lang,
    section: getPageSection(pathname),
  };
  const editionYear = getEditionYear(pathname);
  if (editionYear !== undefined) {
    context.edition_year = editionYear;
  }
  return context;
}

/**
 * Whether scroll_depth should fire on this pathname.
 */
export function shouldTrackScrollDepth(pathname: string): boolean {
  const normalized =
    pathname.endsWith('/') && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;
  return SCROLL_DEPTH_PATH_PATTERNS.some((pattern) => pattern.test(normalized));
}

/**
 * Remove PII-like keys from event payloads before sending.
 */
export function sanitizeEventData(
  data?: Record<string, string | number>
): Record<string, string | number> | undefined {
  if (!data) return undefined;

  const sanitized: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(data)) {
    const lower = key.toLowerCase();
    const isDenied = PII_DENYLIST_KEYS.some((denied) => lower.includes(denied));
    if (!isDenied) {
      sanitized[key] = value;
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

/**
 * Track a custom event via Umami.
 * @param eventName - Name of the event (e.g., 'nav_click', 'blog_search')
 * @param eventData - Optional data payload (PII keys stripped automatically)
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number>
): void {
  const win = typeof window !== 'undefined' ? (window as UmamiWindow) : null;
  if (!win?.umami) return;

  const payload = sanitizeEventData(eventData);
  win.umami.track(eventName, payload);
}

/**
 * Track with page context dimensions merged into payload.
 */
export function trackEventWithContext(
  eventName: string,
  eventData: Record<string, string | number> | undefined,
  context: AnalyticsContext
): void {
  const merged: Record<string, string | number> = {
    lang: context.lang,
    section: context.section,
    ...eventData,
  };
  if (context.edition_year !== undefined) {
    merged.edition_year = context.edition_year;
  }
  trackEvent(eventName, merged);
}

/**
 * Track scroll depth milestones (25%, 50%, 75%, 100%).
 * Each threshold fires only once per page load.
 * Uses a passive scroll listener for zero performance impact.
 * Guarded against double-binding (e.g. layout + page both calling).
 */
let scrollDepthBound = false;

export function trackScrollDepth(): void {
  if (typeof window === 'undefined' || scrollDepthBound) return;
  scrollDepthBound = true;

  const thresholds = [25, 50, 75, 100];
  const fired = new Set<number>();

  function onScroll(): void {
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const percent = Math.round((window.scrollY / docHeight) * 100);

    for (const threshold of thresholds) {
      if (percent >= threshold && !fired.has(threshold)) {
        fired.add(threshold);
        trackEvent(EVENTS.SCROLL_DEPTH, { depth: threshold });
      }
    }

    if (fired.size === thresholds.length) {
      window.removeEventListener('scroll', onScroll);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/** Reset scroll binding guard (tests only). */
export function resetScrollDepthBinding(): void {
  scrollDepthBound = false;
}

/**
 * Track a blog search query with debouncing (1-second delay).
 * Only fires for queries of 2+ characters.
 */
let searchTimer: ReturnType<typeof setTimeout> | null = null;

export function trackSearch(query: string, resultCount: number): void {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    if (query.trim().length >= 2) {
      trackEvent(EVENTS.BLOG_SEARCH, {
        query: query.trim().slice(0, 100),
        results: resultCount,
      });
    }
  }, 1000);
}

/**
 * Set up global outbound link tracking via delegated click listener.
 * Fires 'outbound_click' for clicks on links pointing to external domains.
 * Skips links that already have data-umami-event attributes to avoid double-tracking.
 */
let outboundTrackingSetUp = false;

export function setupOutboundTracking(): void {
  if (typeof window === 'undefined' || outboundTrackingSetUp) return;
  outboundTrackingSetUp = true;

  document.addEventListener('click', (e: MouseEvent) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
      'a[href]'
    );
    if (!link) return;

    if (link.hasAttribute('data-umami-event')) return;

    const href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('/') ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('javascript:')
    )
      return;

    try {
      const url = new URL(href, window.location.origin);
      if (url.hostname !== window.location.hostname) {
        trackEvent(EVENTS.OUTBOUND_CLICK, {
          url: url.hostname + url.pathname,
        });
      }
    } catch {
      // Invalid URL, skip
    }
  });
}

/** Reset outbound binding guard (tests only). */
export function resetOutboundTracking(): void {
  outboundTrackingSetUp = false;
}
