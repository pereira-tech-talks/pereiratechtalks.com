/**
 * Client-safe Pereira Tech Day URL helpers.
 *
 * Keep this module free of `astro:content` — Header / MobileMenu (Svelte
 * islands) import these helpers, and pulling the content collections API into
 * a client bundle fails the production build with ServerOnlyModule.
 */
import { getUrlPrefix, type Language } from '@/lib/i18n';

/** Singular public landing slug for the current/upcoming flagship edition. */
export const PTD_LANDING_SLUG = 'pereira-tech-day';

/** Solidarity announcement for the 2026 postponement. */
export const PTD_2026_POSTPONEMENT_BLOG_SLUG =
  'ptd-2026-postponed-earthquake-solidarity';

/** Localized href for the 2026 postponement blog post. */
export const getPostponementAnnouncementHref = (lang: Language): string =>
  `${getUrlPrefix(lang)}/blog/${PTD_2026_POSTPONEMENT_BLOG_SLUG}/`;

/** Href for the singular landing (`/pereira-tech-day` or `/en/pereira-tech-day`). */
export const getPtdLandingHref = (lang: Language): string =>
  `${getUrlPrefix(lang)}/${PTD_LANDING_SLUG}/`;

/**
 * True for Pereira Tech Day hub + edition routes (ES root or `/en` prefix).
 * Used to suppress the sitewide PTD announcement bar/modal on those pages —
 * visitors are already in the PTD surface.
 */
export const isPereiraTechDayPath = (pathname: string): boolean => {
  const raw = pathname.split('?')[0]?.split('#')[0] ?? '/';
  const normalized = raw.replace(/\/+$/, '') || '/';
  const withoutLang =
    normalized === '/en'
      ? '/'
      : normalized.startsWith('/en/')
        ? normalized.slice(3) || '/'
        : normalized;
  return (
    withoutLang === '/pereira-tech-day' ||
    withoutLang.startsWith('/pereira-tech-day/') ||
    withoutLang === '/pereira-tech-days' ||
    withoutLang.startsWith('/pereira-tech-days/')
  );
};
