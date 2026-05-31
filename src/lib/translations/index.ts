/**
 * Site-wide translations
 *
 * This barrel re-exports the public API for translations.
 * Language configuration (type, registry, utilities) lives in ../i18n.ts.
 *
 * To add a new language:
 * 1. Create a new locale file (e.g., pt.ts) that exports a SiteTranslations object
 * 2. Import it here and add it to the translations record
 * 3. Update the Language type in ../i18n.ts
 */

import type { Language } from '../i18n';
import { en } from './en';
import { es } from './es';
import type { SiteTranslations } from './types';

const translations: Record<Language, SiteTranslations> = {
  en,
  es,
};

/**
 * Get translations for a specific language
 * @param lang - Language code ('en' or 'es')
 * @returns Translation object for the specified language
 */
export function getTranslations(lang: Language): SiteTranslations {
  return translations[lang] || translations.en;
}

export type { Language } from '../i18n';
/**
 * Check if a language code is supported.
 * Delegates to the centralized i18n module.
 */
export { getDefaultLanguage, isValidLanguage } from '../i18n';
// Re-export types for consumer convenience
// Re-export sub-interfaces that consumers may need
export type {
  Activity,
  Education,
  Experience,
  HighlightItem,
  LanguageSkill,
  PagePassion,
  SiteTranslations,
  SkillCategory,
  Venture,
} from './types';

export default translations;
