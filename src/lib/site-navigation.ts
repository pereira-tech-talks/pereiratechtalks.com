/**
 * The site's navigation surface, in one place.
 *
 * Before this module the structure existed three times — `Header.svelte` /
 * `MobileMenu.svelte`, `Footer.astro`, and a hand-maintained `SITE_NAV_SECTIONS`
 * inside `markdown-for-agents.ts`. The Markdown copy had drifted: it linked
 * `/talks`, which is a 301 to `/meetups/`, and it was missing `/communities`,
 * `/calendar` and `/slides`, all of which are real routes.
 *
 * The footer and the agent-Markdown Site Navigation block are both derived from
 * here. The Svelte chrome keeps its own markup (see the Task 8 log) but its
 * paths are asserted against this module by
 * `tests/unit/lib/site-navigation.test.ts`, so an enforced copy cannot drift
 * silently.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 8.
 */
import { DEFAULT_LANGUAGE, getUrlPrefix, isValidLanguage } from '@/lib/i18n';

export interface NavEntry {
  label: Record<string, string>;
  /** Site-root-relative path, or an absolute URL when `external`. */
  path: string;
  external?: boolean;
  /**
   * True when the live header or mobile menu exposes this entry. The chrome
   * test asserts this set matches the components exactly.
   */
  inChrome?: boolean;
}

export interface NavGroup {
  title: Record<string, string>;
  entries: NavEntry[];
}

export const SITE_NAVIGATION: NavGroup[] = [
  {
    title: { en: 'Main', es: 'Principal' },
    entries: [
      { label: { en: 'Home', es: 'Inicio' }, path: '/', inChrome: true },
      {
        label: { en: 'About', es: 'Sobre nosotros' },
        path: '/about',
        inChrome: true,
      },
      {
        label: { en: 'Contact', es: 'Contacto' },
        path: '/contact',
        inChrome: true,
      },
      {
        label: { en: 'Call for Speakers', es: 'Convocatoria de ponentes' },
        path: '/call-for-speakers',
      },
    ],
  },
  {
    title: { en: 'Community', es: 'Comunidad' },
    entries: [
      {
        label: { en: 'Pereira Tech Day', es: 'Pereira Tech Day' },
        path: '/pereira-tech-day',
        inChrome: true,
      },
      {
        label: { en: 'Meetups', es: 'Meetups' },
        path: '/meetups',
        inChrome: true,
      },
      {
        label: { en: 'Community calendar', es: 'Calendario comunitario' },
        path: '/calendar',
      },
      {
        label: { en: 'Programs', es: 'Programas' },
        path: '/verticals',
        inChrome: true,
      },
      {
        label: { en: 'Speakers', es: 'Ponentes' },
        path: '/speakers',
        inChrome: true,
      },
      {
        label: { en: 'Allied communities', es: 'Comunidades aliadas' },
        path: '/communities',
        inChrome: true,
      },
      {
        label: { en: 'Contributors', es: 'Contribuyentes' },
        path: '/contributors',
        inChrome: true,
      },
      {
        label: { en: 'Sponsors', es: 'Patrocinadores' },
        path: '/sponsors',
        inChrome: true,
      },
      { label: { en: 'Sponsor us', es: 'Patrocínanos' }, path: '/sponsor-us' },
      {
        label: { en: 'Channels', es: 'Canales' },
        path: '/channels',
        inChrome: true,
      },
      { label: { en: 'Press', es: 'Prensa' }, path: '/press', inChrome: true },
      { label: { en: 'Community', es: 'Comunidad' }, path: '/community' },
      {
        label: { en: 'Contributing', es: 'Cómo contribuir' },
        path: '/contributing',
      },
      { label: { en: 'Governance', es: 'Gobernanza' }, path: '/governance' },
      {
        label: { en: 'Code of Conduct', es: 'Código de Conducta' },
        path: '/conduct',
      },
    ],
  },
  {
    title: { en: 'Content', es: 'Contenido' },
    entries: [
      { label: { en: 'Blog', es: 'Blog' }, path: '/blog', inChrome: true },
      {
        label: { en: 'Blog series', es: 'Series del blog' },
        path: '/blog/series',
      },
      { label: { en: 'Slides', es: 'Slides' }, path: '/slides' },
    ],
  },
  {
    title: { en: 'Connect', es: 'Conectar' },
    entries: [
      {
        label: { en: 'GitHub', es: 'GitHub' },
        path: 'https://github.com/pereira-tech-talks',
        external: true,
      },
      {
        label: { en: 'LinkedIn', es: 'LinkedIn' },
        path: 'https://www.linkedin.com/company/pereira-tech-talks/',
        external: true,
      },
      {
        label: { en: 'X/Twitter', es: 'X/Twitter' },
        path: 'https://x.com/pertechtalks',
        external: true,
      },
      {
        label: { en: 'Instagram', es: 'Instagram' },
        path: 'https://www.instagram.com/pertechtalks',
        external: true,
      },
      {
        label: { en: 'WhatsApp', es: 'WhatsApp' },
        path: 'https://chat.whatsapp.com/GI5ZismAsqA4a4EPHnJ6RG',
        external: true,
      },
    ],
  },
];

/** Every internal path the navigation exposes, without a language prefix. */
export const internalNavPaths = (): string[] =>
  SITE_NAVIGATION.flatMap((group) =>
    group.entries.filter((e) => !e.external).map((e) => e.path)
  );

/** The subset the live header and mobile menu expose. */
export const chromeNavPaths = (): string[] =>
  SITE_NAVIGATION.flatMap((group) =>
    group.entries.filter((e) => e.inChrome).map((e) => e.path)
  );

const prefixFor = (lang: string): string =>
  getUrlPrefix(isValidLanguage(lang) ? lang : DEFAULT_LANGUAGE);

/** A nav entry's href in a given language. Root stays `/` when unprefixed. */
export const navHref = (entry: NavEntry, lang: string): string => {
  if (entry.external) return entry.path;
  const prefix = prefixFor(lang);
  if (entry.path === '/') return prefix || '/';
  return `${prefix}${entry.path}`;
};

/** A nav entry's label in a given language, falling back to English. */
export const navLabel = (entry: NavEntry, lang: string): string =>
  entry.label[lang] ?? entry.label.en;

/** Resolved `{ label, href }` pairs for a group, by group title (English). */
export const navGroup = (
  titleEn: string,
  lang: string
): Array<{ label: string; href: string }> => {
  const group = SITE_NAVIGATION.find((g) => g.title.en === titleEn);
  if (!group) return [];
  return group.entries.map((entry) => ({
    label: navLabel(entry, lang),
    href: navHref(entry, lang),
  }));
};
