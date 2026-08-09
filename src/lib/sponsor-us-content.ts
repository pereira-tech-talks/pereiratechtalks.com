/**
 * Sponsor Us page content.
 *
 * Extracted from `SponsorUsPage.astro` so the page and its `.md` twin read one
 * source. The `.md` previously omitted the tier and perk data entirely, because
 * it lived inside the component — the exact failure mode the completeness
 * contract exists to prevent.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 7.
 */
import type { Language } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

export const getSponsorUsContent = (lang: Language) => {
  const page = getTranslations(lang).sponsorUsPage;
  return {
    title: page.title,
    description: page.description,
    intro: page.intro,
    reachTitle: lang === 'es' ? 'Alcance estimado' : 'Estimated reach',
    reachStats: [
      {
        value: '90+',
        label: lang === 'es' ? 'meetups desde 2014' : 'meetups since 2014',
      },
      {
        value: '200+',
        label: lang === 'es' ? 'charlas dictadas' : 'talks delivered',
      },
      {
        value: '6.5K+',
        label:
          lang === 'es' ? 'asistencias acumuladas' : 'cumulative attendees',
      },
      {
        value: '12',
        label: lang === 'es' ? 'años activos' : 'active years',
      },
    ],
    tiersTitle: lang === 'es' ? 'Niveles de patrocinio' : 'Sponsorship tiers',
    tiers: [
      {
        tier: 'diamond' as const,
        name: lang === 'es' ? 'Diamante' : 'Diamond',
        headline:
          lang === 'es'
            ? 'Patrocinador estratégico anual'
            : 'Strategic annual partner',
        perks:
          lang === 'es'
            ? [
                'Co-branding en Pereira Tech Day y meetups del año',
                'Spot de keynote o panel en PTD',
                'Mención en redes y newsletter cada mes',
                'Acceso a hiring pool de la comunidad',
                'Logo en banner principal del sitio',
              ]
            : [
                'Co-branding on Pereira Tech Day and full-year meetups',
                'Keynote or panel slot at PTD',
                'Monthly mention on social and newsletter',
                'Access to community hiring pool',
                'Logo in the site main banner',
              ],
      },
      {
        tier: 'gold' as const,
        name: lang === 'es' ? 'Oro' : 'Gold',
        headline: lang === 'es' ? 'Patrocinador anual' : 'Annual partner',
        perks:
          lang === 'es'
            ? [
                'Logo en programa de Pereira Tech Day',
                'Charla técnica patrocinada (1 al año)',
                'Mención en al menos 6 meetups del año',
                'Acceso a hiring pool',
              ]
            : [
                'Logo on Pereira Tech Day program',
                'One sponsored technical talk per year',
                'Mention at 6+ meetups during the year',
                'Access to hiring pool',
              ],
      },
      {
        tier: 'silver' as const,
        name: lang === 'es' ? 'Plata' : 'Silver',
        headline: lang === 'es' ? 'Patrocinador puntual' : 'One-off sponsor',
        perks:
          lang === 'es'
            ? [
                'Logo en evento patrocinado',
                'Mención en redes pre y post evento',
                'Espacio para stand opcional',
              ]
            : [
                'Logo on sponsored event',
                'Pre and post event mention on social',
                'Optional booth space',
              ],
      },
      {
        tier: 'community' as const,
        name: lang === 'es' ? 'Comunidad' : 'Community',
        headline:
          lang === 'es'
            ? 'Patrocinador comunitario sin contraprestación monetaria'
            : 'Community ally with non-monetary contribution',
        perks:
          lang === 'es'
            ? [
                'Para venues, comida, transporte, becas',
                'Logo en el evento o programa donde apoyan',
                'Reconocimiento en página de patrocinadores',
              ]
            : [
                'For venues, food, transportation, scholarships',
                'Logo on the supported event or program',
                'Recognition on the sponsors page',
              ],
      },
    ],
    ctaTitle: lang === 'es' ? '¿Hablamos?' : "Let's talk",
    ctaDescription:
      lang === 'es'
        ? 'Cuéntanos qué te interesa apoyar (un meetup, un programa, Pereira Tech Day, becas) y te mandamos un sponsor deck a la medida.'
        : 'Tell us what you want to support (a meetup, a program, Pereira Tech Day, scholarships) and we will send a tailored sponsor deck.',
    ctaButton:
      lang === 'es'
        ? 'Enviar consulta de patrocinio'
        : 'Send sponsorship inquiry',
    currentSponsorsTitle:
      lang === 'es'
        ? 'Empresas que ya nos apoyan'
        : 'Companies already supporting us',
  };
};

export type SponsorUsContent = ReturnType<typeof getSponsorUsContent>;
