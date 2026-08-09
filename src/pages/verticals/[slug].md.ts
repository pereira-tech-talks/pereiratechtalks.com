import type { APIRoute, GetStaticPaths } from 'astro';
import { getChannels } from '@/lib/channel';
import { SITE_URL } from '@/lib/constances';
import {
  entityLine,
  imageLine,
  mdHref,
  mdLabel,
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';
import { getMeetupSlug, getMeetupsByVertical } from '@/lib/meetup';
import { getSpeakers } from '@/lib/speaker';
import { getVerticalBodyEntry, getVerticals } from '@/lib/vertical';

export const getStaticPaths: GetStaticPaths = async () => {
  const verticals = await getVerticals();
  return Promise.all(
    verticals.map(async (entry) => ({
      params: { slug: entry.id },
      props: {
        entry,
        // Prose lives in the `{slug}.en.md` sibling for English; fall back to
        // the Spanish body only when the translation does not exist yet.
        body: (await getVerticalBodyEntry(entry, 'es')).entry.body ?? '',
        meetups: await getMeetupsByVertical(entry.id),
        speakers: await getSpeakers(),
        channels: await getChannels(),
      },
    }))
  );
};

export const GET: APIRoute = ({ props }) => {
  const lang = 'es';
  const { entry, body, meetups, speakers, channels } = props as {
    entry: Awaited<ReturnType<typeof getVerticals>>[number];
    body: string;
    meetups: Awaited<ReturnType<typeof getMeetupsByVertical>>;
    speakers: Awaited<ReturnType<typeof getSpeakers>>;
    channels: Awaited<ReturnType<typeof getChannels>>;
  };
  const L = (key: Parameters<typeof mdLabel>[1]) => mdLabel(lang, key);

  const title = resolveI18n(entry.data.title, lang);
  const mission = resolveI18n(entry.data.mission, lang);
  const description = resolveI18n(entry.data.description, lang);
  const schedule = resolveI18n(entry.data.schedule ?? null, lang);

  const metadata: Array<[string, string]> = [
    [L('mission'), mission],
    [L('status'), entry.data.status],
  ];
  if (schedule) metadata.push([L('schedule'), schedule]);

  const sections = [];
  if (entry.data.hero?.src) {
    sections.push({
      heading: L('hero'),
      lines: [
        imageLine(
          resolveI18n(entry.data.hero.alt, lang) || title,
          entry.data.hero.src
        ),
      ],
    });
  }
  if (description) {
    sections.push({ heading: 'Sobre este programa', lines: [description] });
  }
  if (entry.data.leaders.length > 0) {
    sections.push({
      heading: L('leaders'),
      lines: entry.data.leaders.map((slug) => {
        const speaker = speakers.find((s) => s.id === slug);
        return entityLine(
          speaker?.data.name ?? slug,
          mdHref(lang, `speakers/${slug}`),
          resolveI18n(speaker?.data.role, lang)
        );
      }),
    });
  }
  if (entry.data.channels.length > 0) {
    sections.push({
      heading: L('channels'),
      lines: entry.data.channels.map((slug) => {
        const channel = channels.find((c) => c.id === slug);
        return channel
          ? entityLine(
              channel.data.name,
              channel.data.url,
              resolveI18n(channel.data.description, lang)
            )
          : entityLine(slug, mdHref(lang, 'channels'));
      }),
    });
  }
  // The HTML lists the program's meetups with their descriptions and venues.
  if (meetups.length > 0) {
    sections.push({
      heading: L('relatedMeetups'),
      lines: meetups.map((m) =>
        entityLine(
          resolveI18n(m.data.title, lang),
          mdHref(lang, `meetups/${getMeetupSlug(m)}`),
          m.data.date.toISOString().split('T')[0],
          [m.data.venue.name, m.data.venue.city].filter(Boolean).join(', '),
          resolveI18n(m.data.description, lang)
        )
      ),
    });
  }

  const markdown = serializeGenericToMarkdown({
    title,
    description: mission,
    lang,
    canonical: `${SITE_URL}/verticals/${entry.id}`,
    metadata,
    body,
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
