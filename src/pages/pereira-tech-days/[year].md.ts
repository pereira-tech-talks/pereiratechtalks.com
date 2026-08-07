import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getEditions } from '@/lib/pereiraTechDay';

export const getStaticPaths: GetStaticPaths = async () => {
  const editions = await getEditions();
  return editions.map((entry) => ({
    params: { year: String(entry.data.year) },
    props: { entry },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const lang = 'es';
  const { entry } = props as {
    entry: Awaited<ReturnType<typeof getEditions>>[number];
  };
  const title = resolveI18n(entry.data.title, lang);
  const description = resolveI18n(entry.data.description, lang);
  const tagline = resolveI18n(entry.data.tagline, lang);

  const dateLabel =
    entry.data.date instanceof Date
      ? entry.data.date.toISOString().split('T')[0]
      : `${entry.data.date.start.toISOString().split('T')[0]} – ${entry.data.date.end.toISOString().split('T')[0]}`;

  const metadata: Array<[string, string]> = [
    ['Año', String(entry.data.year)],
    ['Lema', tagline],
    ['Fecha', dateLabel],
    ['Modalidad', entry.data.mode],
    [
      'Lugar',
      `${entry.data.venue.name}, ${entry.data.venue.city}, ${entry.data.venue.country}`,
    ],
    ['Estado', entry.data.status],
  ];
  if (entry.data.linkRecording)
    metadata.push(['Grabaciones', entry.data.linkRecording]);
  if (entry.data.linkMeetupCom)
    metadata.push(['Meetup.com', entry.data.linkMeetupCom]);

  const sections = [];
  if (entry.data.schedule.length > 0) {
    sections.push({
      heading: 'Programación',
      lines: entry.data.schedule.map((slot) => {
        const slotTitle = slot.title
          ? resolveI18n(slot.title, lang)
          : (slot.talkSlug ?? slot.type);
        return `- ${slot.time} — ${slotTitle} (${slot.type})`;
      }),
    });
  }
  if (entry.data.keynotes.length > 0) {
    sections.push({
      heading: 'Keynote speakers',
      lines: entry.data.keynotes.map((s) => `- [${s}](/speakers/${s}.md)`),
    });
  }
  if (entry.data.organizers.length > 0) {
    sections.push({
      heading: 'Organizadores',
      lines: entry.data.organizers.map((o) => `- [${o}](/contributors)`),
    });
  }
  if (entry.data.sponsors.length > 0) {
    sections.push({
      heading: 'Patrocinadores',
      lines: entry.data.sponsors.map((s) => `- ${s.slug} (${s.tier})`),
    });
  }

  const markdown = serializeGenericToMarkdown({
    title: `Pereira Tech Day ${entry.data.year} — ${title}`,
    description,
    lang,
    canonical: `${SITE_URL}/pereira-tech-days/${entry.data.year}`,
    metadata,
    body: entry.body,
    sections,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
