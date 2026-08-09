import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  entityLine,
  linkLine,
  mdHref,
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getTranslations } from '@/lib/translations';

/**
 * `/calendar.md` — sourced from the `communityCalendars` collection plus the
 * page's own translation strings. The hand-written page markdown described the
 * feature set in prose but never listed the calendars themselves, which put it
 * at 0.37 coverage against a page whose substance is that list.
 */
const GOOGLE_CALENDAR_URL = 'https://calendar.google.com/';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const t = getTranslations(lang).calendarPage;
  const all = await getCollection('communityCalendars');
  const sorted = [...all].sort(
    (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)
  );
  const active = sorted.filter((c) => c.data.active);
  const soon = sorted.filter((c) => !c.data.active);

  const row = (c: (typeof sorted)[number]) =>
    entityLine(
      resolveI18n(c.data.name, lang),
      c.data.website ?? c.data.lumaUrl ?? `${SITE_URL}/en/calendar`,
      resolveI18n(c.data.description, lang)
    );

  const sections = [{ heading: 'Community calendars', lines: active.map(row) }];
  if (soon.length > 0) {
    sections.push({
      heading: 'More communities coming soon',
      lines: soon.map(row),
    });
  }
  sections.push({
    heading: t.legendLabel,
    lines: [t.embedFallback, '', linkLine(t.openExternal, GOOGLE_CALENDAR_URL)],
  });

  sections.push({
    heading: t.comingSoon,
    lines: [t.inactiveNote],
  });

  sections.push({
    heading: t.contributeTitle,
    lines: [t.contributeDescription],
  });

  sections.push({
    heading: 'Quick links',
    lines: [
      linkLine('Meetup archive', mdHref(lang, 'meetups')),
      linkLine('PTT events on Luma', 'https://luma.com/pertechtalks'),
      linkLine(
        'Publish your community calendar',
        `${SITE_URL}/en/calendar/#calendar-intake`
      ),
    ],
  });

  const markdown = serializeGenericToMarkdown({
    title: t.title,
    description: t.description,
    lang,
    canonical: `${SITE_URL}/en/calendar`,
    metadata: [['Active calendars', String(active.length)]],
    body: t.heroDescription,
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
