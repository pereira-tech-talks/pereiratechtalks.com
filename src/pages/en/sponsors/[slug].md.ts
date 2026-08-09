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
import { getTranslations } from '@/lib/translations';

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
  // Section headings and copy come from the same strings the HTML renders.
  const sd = getTranslations(lang).sponsorDetail;

  const metadata: Array<[string, string]> = [
    [
      L('status'),
      entry.data.status === 'active' ? 'Current sponsor' : 'Past sponsor',
    ],
    [L('website'), entry.data.url],
    [L('tier'), SPONSOR_TIER_LABELS[entry.data.tier].en],
    [sd.stats.meetups, String(activity.meetupCount)],
    [sd.stats.editions, String(activity.editionCount)],
    [sd.stats.talks, String(activity.talkCount)],
    [sd.stats.speakers, String(activity.speakerCount)],
  ];
  if (activity.firstYear && activity.lastYear) {
    metadata.push([
      sd.sinceLabel(activity.firstYear),
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
      heading: sd.meetupsTitle,
      lines: [
        sd.meetupsSubtitle(entry.data.name),
        '',
        ...activity.meetups.map(({ meetup, year }) =>
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
      ],
    });
  }

  if (activity.editions.length > 0) {
    sections.push({
      heading: sd.editionsTitle,
      lines: [
        sd.editionsSubtitle,
        '',
        ...activity.editions.map(({ year, tier, edition }) =>
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
      ],
    });
  }

  if (activity.isEmpty) {
    sections.push({
      heading: 'Activity',
      lines: [
        'This sponsor has no linked meetups registered yet. We are completing the community archive little by little.',
      ],
    });
  }

  sections.push({
    heading: sd.ctaTitle,
    lines: [
      sd.ctaBody,
      '',
      linkLine(sd.sponsorUsLabel, mdHref(lang, 'sponsor-us')),
      linkLine(sd.allSponsorsLabel, mdHref(lang, 'sponsors')),
      linkLine(sd.websiteLabel, entry.data.url),
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
