import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE_URL } from '@/lib/constances';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getEditions } from '@/lib/pereiraTechDay';

/** Slot types that carry a speaker; mirrors `isSessionSlot` in `@/lib/ptdSchedule`. */
const SESSION_TYPES = new Set(['talk', 'keynote', 'panel']);

export const getStaticPaths: GetStaticPaths = async () => {
  const editions = await getEditions();
  return editions.map((entry) => ({
    params: { year: String(entry.data.year) },
    props: { entry },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const lang = 'en';
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
    ['Year', String(entry.data.year)],
    ['Tagline', tagline],
    ['Date', dateLabel],
    ['Mode', entry.data.mode],
    [
      'Venue',
      `${entry.data.venue.name}, ${entry.data.venue.city}, ${entry.data.venue.country}`,
    ],
    ['Status', entry.data.status],
  ];
  if (entry.data.linkRecording)
    metadata.push(['Recordings', entry.data.linkRecording]);
  if (entry.data.linkMeetupCom) {
    const label = entry.data.linkMeetupCom.includes('luma.com')
      ? 'Luma'
      : 'Meetup.com';
    metadata.push([label, entry.data.linkMeetupCom]);
  }

  const sections = [];
  if (entry.data.schedule.length > 0) {
    if (entry.data.scheduleTentative) {
      metadata.push([
        'Schedule',
        'Tentative — times and speakers may still change.',
      ]);
    }
    sections.push({
      heading: 'Schedule',
      lines: entry.data.schedule.map((slot) => {
        const range = slot.endTime ? `${slot.time}–${slot.endTime}` : slot.time;
        const slotTitle = slot.title
          ? resolveI18n(slot.title, lang)
          : (slot.talkSlug ?? slot.type);
        const speaker = slot.speaker
          ? ` — [${slot.speaker}](/en/speakers/${slot.speaker}.md)`
          : SESSION_TYPES.has(slot.type)
            ? ` — _To be revealed_`
            : '';
        return `- ${range} — ${slotTitle} (${slot.type})${speaker}`;
      }),
    });
  }
  if (entry.data.keynotes.length > 0) {
    sections.push({
      heading: 'Keynote speakers',
      lines: entry.data.keynotes.map((s) => `- [${s}](/en/speakers/${s}.md)`),
    });
  }
  if (entry.data.organizers.length > 0) {
    sections.push({
      heading: 'Organizers',
      lines: entry.data.organizers.map((o) => `- [${o}](/en/contributors)`),
    });
  }
  if (entry.data.sponsors.length > 0) {
    sections.push({
      heading: 'Sponsors',
      lines: entry.data.sponsors.map((s) => `- ${s.slug} (${s.tier})`),
    });
  }

  const markdown = serializeGenericToMarkdown({
    title: `Pereira Tech Day ${entry.data.year} — ${title}`,
    description,
    lang,
    canonical: `${SITE_URL}/en/pereira-tech-days/${entry.data.year}`,
    metadata,
    body: entry.body,
    sections,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
