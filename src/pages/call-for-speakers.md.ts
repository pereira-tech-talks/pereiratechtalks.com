import type { APIRoute } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  buildOpenCallsSection,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { formatOpenCallDate, getOpenCallsForSpeakers } from '@/lib/meetup';
import { getTranslations } from '@/lib/translations';

/**
 * Sourced from the same translation strings the HTML page renders, so the two
 * cannot drift. The previous hand-written copy listed different talk formats
 * from the ones the page actually offers.
 */
export const GET: APIRoute = async () => {
  const lang = 'es';
  const t = getTranslations(lang).cfsPage;

  /*
    The month-specific calls, with the formats each one accepts. This is what
    lets an assistant answer "which Pereira Tech Talks meetup takes a
    workshop, and until when?" from a single fetch.
  */
  const formatOptions = getTranslations(lang).cfsForm.formatOptions;
  const formatLabelOf = (value: string): string =>
    formatOptions.find((o) => o.value === value)?.label ?? value;

  const openCalls = await getOpenCallsForSpeakers();
  const openCallRows = buildOpenCallsSection(
    openCalls.map((call) => ({
      slug: call.slug,
      title: call.title[lang],
      dateLabel: formatOpenCallDate(call, lang),
      // The human labels the page shows, not the raw slugs: a twin says what
      // its page says, and "Lightning (5–10 min)" carries the duration too.
      formats: call.formats.map(formatLabelOf),
      ...(call.closesAt
        ? { closesAt: call.closesAt.toISOString().split('T')[0] }
        : {}),
      ...(typeof call.slots === 'number' ? { slots: call.slots } : {}),
      ...(call.note?.[lang] ? { note: call.note[lang] } : {}),
      ...(call.dateConfidence === 'tentative'
        ? {
            tentativeLabel:
              getTranslations(lang).meetupDetail.planning.chipTentative,
          }
        : {}),
    })),
    lang
  );

  // The HTML page renders this section's heading and intro unconditionally and
  // only swaps its body, so the twin does the same — otherwise the twin loses
  // the copy the page shows on the (currently normal) empty day.
  const openCallsSection = {
    heading: t.openCalls.title,
    lines: [
      t.openCalls.intro,
      '',
      ...(openCallRows
        ? openCallRows.lines
        : [t.openCalls.emptyTitle, '', t.openCalls.emptyBody]),
    ],
  };

  const markdown = serializeGenericToMarkdown({
    title: `${t.title} — Pereira Tech Talks`,
    description: t.description,
    lang,
    canonical: `${SITE_URL}/call-for-speakers`,
    body: t.intro,
    sections: [
      openCallsSection,
      {
        heading: t.whatWeLookForTitle,
        lines: t.whatWeLookFor.map((item) => `- ${item}`),
      },
      {
        heading: t.formatsTitle,
        lines: t.formats.map(
          (format) => `- **${format.name}** — ${format.description}`
        ),
      },
      {
        heading: t.processTitle,
        lines: t.process.map((step, index) => `${index + 1}. ${step}`),
      },
      {
        heading: 'Postula tu charla',
        lines: [
          `- Formulario de postulación: ${SITE_URL}/call-for-speakers/#cfs-form`,
          '- Correo: pereiratechtalks@gmail.com',
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
