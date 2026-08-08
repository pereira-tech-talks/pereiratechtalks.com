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
  const lang = 'en';
  const { entry } = props as { entry: Sponsor };
  const description = resolveI18n(entry.data.description, lang);
  const activity = await getSponsorActivity(entry);

  const metadata: Array<[string, string]> = [
    [
      'Status',
      entry.data.status === 'active' ? 'Current sponsor' : 'Past sponsor',
    ],
    ['Website', entry.data.url],
    ['Sponsored meetups', String(activity.meetupCount)],
    ['Pereira Tech Day editions', String(activity.editionCount)],
  ];
  if (activity.firstYear && activity.lastYear) {
    metadata.push([
      'Years of support',
      activity.firstYear === activity.lastYear
        ? String(activity.firstYear)
        : `${activity.firstYear}–${activity.lastYear}`,
    ]);
  }

  const sections = [];
  if (activity.meetups.length > 0) {
    sections.push({
      heading: 'Sponsored meetups',
      lines: activity.meetups.map(({ meetup }) => {
        const title = resolveI18n(meetup.data.title, lang);
        const date = getCalendarDateString(meetup.data.date);
        return `- ${date} — [${title}](${SITE_URL}/en/meetups/${getMeetupSlug(meetup)})`;
      }),
    });
  }
  if (activity.editions.length > 0) {
    sections.push({
      heading: 'Pereira Tech Day editions',
      lines: activity.editions.map(
        ({ year, tier }) =>
          `- [Pereira Tech Day ${year}](${SITE_URL}/en/pereira-tech-days/${year}) — ${SPONSOR_TIER_LABELS[tier].en.toLowerCase()} sponsor`
      ),
    });
  }

  const markdown = serializeGenericToMarkdown({
    title: `${entry.data.name} — Pereira Tech Talks sponsor`,
    description,
    lang,
    canonical: `${SITE_URL}/en/sponsors/${entry.id}`,
    metadata,
    sections,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
