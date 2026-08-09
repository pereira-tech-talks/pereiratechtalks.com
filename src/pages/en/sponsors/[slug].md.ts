import type { APIRoute, GetStaticPaths } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  entityLine,
  imageLine,
  linkLine,
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
  const lang = 'en';
  const { entry } = props as { entry: Sponsor };
  const description = resolveI18n(entry.data.description, lang);
  const activity = await getSponsorActivity(entry);
  const L = (key: Parameters<typeof mdLabel>[1]) => mdLabel(lang, key);

  const metadata: Array<[string, string]> = [
    [
      L('status'),
      entry.data.status === 'active' ? 'Current sponsor' : 'Past sponsor',
    ],
    [L('website'), entry.data.url],
    [L('tier'), SPONSOR_TIER_LABELS[entry.data.tier].en],
    ['Sponsored meetups', String(activity.meetupCount)],
    ['Pereira Tech Day editions', String(activity.editionCount)],
    ['Talks enabled', String(activity.talkCount)],
    ['Speakers on stage', String(activity.speakerCount)],
  ];
  if (activity.firstYear && activity.lastYear) {
    metadata.push([
      'Years of support',
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
      heading: 'Sponsored meetups',
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
      heading: 'Pereira Tech Day editions',
      lines: activity.editions.map(({ year, tier, edition }) =>
        entityLine(
          edition
            ? `Pereira Tech Day ${year} — ${resolveI18n(edition.data.title, lang)}`
            : `Pereira Tech Day ${year}`,
          mdHref(lang, `pereira-tech-days/${year}`),
          `${SPONSOR_TIER_LABELS[tier].en} sponsor`,
          edition ? resolveI18n(edition.data.tagline, lang) : undefined,
          edition ? resolveI18n(edition.data.description, lang) : undefined
        )
      ),
    });
  }

  sections.push({
    heading: 'Want to appear here?',
    lines: [
      'Sponsoring Pereira Tech Talks sustains the venue, the logistics and the stage for the tech community of Risaralda.',
      '',
      linkLine('Sponsor us', mdHref(lang, 'sponsor-us')),
      linkLine('All sponsors', mdHref(lang, 'sponsors')),
    ],
  });

  const markdown = serializeGenericToMarkdown({
    title: `${entry.data.name} \u2014 Pereira Tech Talks sponsor`,
    description,
    lang,
    canonical: `${SITE_URL}/en/sponsors/${entry.id}`,
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
