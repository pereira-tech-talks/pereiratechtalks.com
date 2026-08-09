import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  entityLine,
  linkLine,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getTranslations } from '@/lib/translations';

/**
 * `/contact.md` — the hand-written page body plus the form's real topic
 * options and the dedicated routes, read from the same translation strings the
 * HTML renders. Form control labels and validation strings stay out: they are
 * UI affordances with no document equivalent, which is why this page carries a
 * documented 0.75 coverage floor.
 */
export const GET: APIRoute = async () => {
  const lang = 'es';
  const t = getTranslations(lang).contactPage;
  const pages = await getCollection('pages');
  const page = pages.find((p) => p.id === 'es/contact');

  const markdown = serializeGenericToMarkdown({
    title: `${t.title} — Pereira Tech Talks`,
    description: t.description,
    lang,
    canonical: `${SITE_URL}/contact`,
    body: `${t.heroDescription}\n\n${page?.body?.trim() ?? ''}`,
    sections: [
      {
        heading: t.reasonLabel,
        lines: t.reasonOptions
          .filter((option) => option.value !== '')
          .map(
            (option) =>
              `- **${option.label}** — ${t.successNextSteps[option.value as keyof typeof t.successNextSteps] ?? ''}`
          ),
      },
      {
        heading: t.quickLinksTitle,
        lines: t.quickLinks.map((link) =>
          entityLine(link.label, link.href, link.description)
        ),
      },
      {
        heading: t.meetInPersonTitle,
        lines: [t.meetInPersonText],
      },
      {
        heading: t.locationTitle,
        lines: [t.locationText],
      },
      {
        heading: 'Rutas dedicadas',
        lines: [
          linkLine('Call for Speakers', `${SITE_URL}/call-for-speakers`),
          linkLine('Quiero patrocinar', `${SITE_URL}/sponsor-us`),
          linkLine(
            'Postulación a la Escuela de Speakers',
            `${SITE_URL}/verticals/speaker-school/#speaker-school-form`
          ),
          linkLine(
            'Propuesta de calendario comunitario',
            `${SITE_URL}/calendar/#calendar-intake`
          ),
          linkLine(
            'Reporte de Código de Conducta',
            `${SITE_URL}/conduct/#conduct-report-form`
          ),
        ],
      },
    ],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
