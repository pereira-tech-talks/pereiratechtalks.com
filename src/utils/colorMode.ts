export const PEREIRA_TECH_DAY_PATH = '/pereira-tech-day';

/** Página principal del evento (solo /pereira-tech-day, sin subrutas). */
export function isPereiraTechDayPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/';
  return path === PEREIRA_TECH_DAY_PATH;
}

export type ColorTheme = 'light' | 'dark';

export function getUserThemePreference(defaultTheme: string): ColorTheme {
  if (
    defaultTheme?.endsWith(':only') ||
    (typeof localStorage !== 'undefined' &&
      !localStorage.theme &&
      defaultTheme !== 'system')
  ) {
    return defaultTheme.replace(':only', '') as ColorTheme;
  }

  if (typeof window === 'undefined') {
    return 'light';
  }

  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    return 'dark';
  }

  return 'light';
}

export function resolveThemeForPath(
  pathname: string,
  defaultTheme: string,
): ColorTheme {
  if (isPereiraTechDayPath(pathname)) {
    return 'light';
  }
  return getUserThemePreference(defaultTheme);
}
