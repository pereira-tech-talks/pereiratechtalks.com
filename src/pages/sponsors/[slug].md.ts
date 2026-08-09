import type { APIRoute, GetStaticPaths } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  entityLine,
  imageLine,
  mdHref,
  mdLabel,
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
  const L = (key: Parameters<typeof mdLabel>[1]) => mdLabel(lang, key);

  const metadata: Array<[string, string]> = [
    [
      L('status'),
      entry.data.status === 'active'
        ? 'Patrocinador actual'
        : 'Patrocinador anterior',
    ],
    [L('website'), entry.data.url],
    [L('tier'), SPONSOR_TIER_LABELS[entry.data.tier].es],
    ['Meetups patrocinados', String(activity.meetupCount)],
    ['Ediciones de Pereira Tech Day', String(activity.editionCount)],
    ['Charlas impulsadas', String(activity.talkCount)],
    ['Ponentes en escena', String(activity.speakerCount)],
  ];
  if (activity.firstYear && activity.lastYear) {
    metadata.push([
      'Años de apoyo',
      activity.firstYear === activity.lastYear
        ? String(activity.firstYear)
        : `${activity.firstYear}\u2013${activity.lastYear}`,
    ]);
  }

  const sections = [
    {
      heading: 'Logo',
      lines: [imageLine(entry.data.logo.alt, entry.data.logo.light)],
    },
  ];

  // Each row carries the meetup's own description and venue, which is what the
  // HTML shows — a title-only list read as a summary of the page, not a twin.
  if (activity.meetups.length > 0) {
    sections.push({
      heading: 'Meetups patrocinados',
      lines: activity.meetups.map(({ meetup, year }) =>
        entityLine(
          resolveI18n(meetup.data.title, lang),
          mdHref(lang, `meetups/${getMeetupSlug(meetup)}`),
          meetup.data.date.toISOString().split('T')[0],
          [meetup.data.venue.name, meetup.data.venue.city]
            .filter(Boolean)
            .join(', '),
          String(year),
          resolveI18n(meetup.data.description, lang)
        )
      ),
    });
  }

  if (activity.editions.length > 0) {
    sections.push({
      heading: 'Ediciones de Pereira Tech Day',
      lines: activity.editions.map(({ year, tier }) =>
        entityLine(
          `Pereira Tech Day ${year}`,
          mdHref(lang, `pereira-tech-days/${year}`),
          SPONSOR_TIER_LABELS[tier].es
        )
      ),
    });
  }

  const markdown = serializeGenericToMarkdown({
    title: `${entry.data.name} \u2014 patrocinador de Pereira Tech Talks`,
    description,
    lang,
    canonical: `${SITE_URL}/sponsors/${entry.id}`,
    metadata,
    // The description is the page's prose; keeping it only in the blockquote
    // left the body empty.
    body: description,
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
