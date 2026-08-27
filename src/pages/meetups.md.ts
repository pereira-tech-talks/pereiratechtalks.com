import type { APIRoute } from 'astro';
import { getCommunityStats } from '@/lib/community-stats';
import { SITE_URL } from '@/lib/constances';
import { isCalendarDateOnOrAfterToday } from '@/lib/dates';
import {
  buildOpenCallsSection,
  entityLine,
  mdHref,
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import {
  formatMeetupTalkCount,
  formatOpenCallDate,
  getMeetupSlug,
  getMeetups,
  getOpenCallsForSpeakers,
  groupMeetupsByYear,
  resolveMeetupVenueLine,
} from '@/lib/meetup';
import { getTranslations } from '@/lib/translations';

export const GET: APIRoute = async () => {
  const lang = 'es';
  const [meetups, stats] = await Promise.all([
    getMeetups(),
    getCommunityStats(),
  ]);
  const grouped = groupMeetupsByYear(meetups);

  // Each row carries the meetup's own description, as the HTML cards do; a
  // title-and-date list read as an index of the archive, not its twin.
  const rowFor = (m: (typeof meetups)[number]): string => {
    const slug = getMeetupSlug(m);
    const title = resolveI18n(m.data.title, lang);
    const date = m.data.date.toISOString().split('T')[0];
    const venue = resolveMeetupVenueLine(m, lang);
    const description = resolveI18n(m.data.description, lang);
    return entityLine(
      title,
      mdHref(lang, `meetups/${slug}`),
      date,
      venue,
      formatMeetupTalkCount(m.data.talks.length, lang),
      description
    );
  };

  // Use the site-timezone helper, not a raw Date comparison: the HTML page
  // derives "upcoming" through `isCalendarDateOnOrAfterToday`, and a twin that
  // disagrees with its page is exactly what md:check exists to catch.
  const upcomingMeetups = meetups
    .filter((m) => isCalendarDateOnOrAfterToday(m.data.date))
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());

  const formatOptions = getTranslations(lang).cfsForm.formatOptions;
  const formatLabelOf = (value: string): string =>
    formatOptions.find((o) => o.value === value)?.label ?? value;

  const openCalls = await getOpenCallsForSpeakers();
  const openCallsSection = buildOpenCallsSection(
    openCalls.map((call) => ({
      slug: call.slug,
      title: call.title[lang],
      dateLabel: formatOpenCallDate(call, lang),
      // The human labels the page shows, not the raw slugs: a twin says what
      // its page says, and "Lightning (3–5 min)" carries the duration too.
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

  const sections = [];
  if (openCallsSection) sections.push(openCallsSection);
  if (upcomingMeetups.length > 0) {
    sections.push({
      heading: 'Próximos',
      lines: upcomingMeetups.map(rowFor),
    });
  }
  for (const group of grouped) {
    sections.push({
      heading: String(group.year),
      lines: group.meetups.map(rowFor),
    });
  }

  const markdown = serializeGenericToMarkdown({
    title: 'Meetups — Pereira Tech Talks',
    description: `${stats.meetups} meetups, ${stats.talks} charlas y ${stats.speakers} ponentes desde ${stats.sinceYear}. Archivo mensual de Pereira Tech Talks en Pereira, Risaralda, Colombia.`,
    lang,
    canonical: `${SITE_URL}/meetups`,
    metadata: [
      ['Total meetups', stats.display.meetups],
      ['Total charlas', stats.display.talks],
      ['Total ponentes', stats.display.speakers],
      ['Desde', stats.display.sinceYear],
    ],
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
