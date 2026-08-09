import type { APIRoute } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  filterCurrentTeamOrganizers,
  filterPastTeamMembers,
  getContributors,
} from '@/lib/contributor';
import {
  entityLine,
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const contributors = await getContributors();
  const current = filterCurrentTeamOrganizers(contributors);
  const past = filterPastTeamMembers(contributors);

  // The HTML renders each person's bio, not just their role. A name-and-role
  // list read as a summary of the directory rather than its twin.
  const toLines = (list: typeof contributors): string[] =>
    list.flatMap((c) => {
      const bio = resolveI18n(c.data.bio, lang);
      const row = entityLine(
        c.data.name,
        `/en/contributors`,
        resolveI18n(c.data.role, lang)
      );
      return bio ? [row, `  ${bio}`] : [row];
    });

  const markdown = serializeGenericToMarkdown({
    title: 'Team — Pereira Tech Talks',
    description:
      'Active organizing team of Pereira Tech Talks plus alumni and past organizers. Bilingual directory at /en/contributors.',
    lang,
    canonical: `${SITE_URL}/en/contributors`,
    metadata: [
      ['Active organizers', String(current.length)],
      ['Alumni and past', String(past.length)],
      ['Total in directory', String(contributors.length)],
    ],
    body: 'The people who coordinate meetups, Pereira Tech Day, the community programs and day-to-day operations. Building community in Pereira since 2014.',
    sections: [
      { heading: 'Organizing team', lines: toLines(current) },
      { heading: 'Alumni and past organizers', lines: toLines(past) },
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
