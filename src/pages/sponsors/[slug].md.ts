import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE_URL } from '@/lib/constances';
import { getCalendarDateString } from '@/lib/dates';

import {
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getMeetupSlug } from '@/lib/meetup';
import {
  getSponsorActivity,
  getSponsors,
  SPONSOR_TIER_LABELS,
  type Sponsor,
} from '@/lib/sponsor';

export const getStaticPaths: GetStaticPaths = async () => {
  const sponsors = await getSponsors();
  return sponsors.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const lang = 'es';
  const { entry } = props as { entry: Sponsor };
  const description = resolveI18n(entry.data.description, lang);
  const activity = await getSponsorActivity(entry);

  const metadata: Array<[string, string]> = [
    [
      'Estado',
      entry.data.status === 'active'
        ? 'Patrocinador actual'
        : 'Patrocinador anterior',
    ],
    ['Sitio web', entry.data.url],
    ['Meetups patrocinados', String(activity.meetupCount)],
    ['Ediciones de Pereira Tech Day', String(activity.editionCount)],
  ];
  if (activity.firstYear && activity.lastYear) {
    metadata.push([
      'Años de apoyo',
      activity.firstYear === activity.lastYear
        ? String(activity.firstYear)
        : `${activity.firstYear}–${activity.lastYear}`,
    ]);
  }

  const sections = [];
  if (activity.meetups.length > 0) {
    sections.push({
      heading: 'Meetups patrocinados',
      lines: activity.meetups.map(({ meetup }) => {
        const title = resolveI18n(meetup.data.title, lang);
        const date = getCalendarDateString(meetup.data.date);
        return `- ${date} — [${title}](${SITE_URL}/meetups/${getMeetupSlug(meetup)})`;
      }),
    });
  }
  if (activity.editions.length > 0) {
    sections.push({
      heading: 'Ediciones de Pereira Tech Day',
      lines: activity.editions.map(
        ({ year, tier }) =>
          `- [Pereira Tech Day ${year}](${SITE_URL}/pereira-tech-days/${year}) — patrocinador ${SPONSOR_TIER_LABELS[tier].es.toLowerCase()}`
      ),
    });
  }

  const markdown = serializeGenericToMarkdown({
    title: `${entry.data.name} — Patrocinador de Pereira Tech Talks`,
    description,
    lang,
    canonical: `${SITE_URL}/sponsors/${entry.id}`,
    metadata,
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
