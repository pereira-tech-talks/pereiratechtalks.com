/**
 * The joins behind the `.md` twins.
 *
 * `agent-resolvers.ts` is what turns slugs into names: it is the reason a meetup
 * twin carries "QA First: lessons from open source" with its abstract instead of
 * `qa-pilar-del-software--1-open-source`. It had zero coverage because every
 * function reads collections; the collections are mocked here.
 *
 * The assertions are about the joins, not the formatting — Task 7's suite covers
 * the serializers that consume this output.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 11.
 */
import { describe, expect, it, vi } from 'vitest';

const day = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

const MEETUPS = [
  {
    id: '2026-06-24_qa-pilar-del-software',
    body: 'Cuerpo en español.',
    data: {
      title: { en: 'QA: the pillar of software', es: 'QA: Pilar del software' },
      description: {
        en: 'Two talks on quality.',
        es: 'Dos charlas sobre calidad.',
      },
      date: day('2026-06-24'),
      mode: 'in-person',
      status: 'announced',
      venue: { name: 'UTP', city: 'Pereira', country: 'Colombia' },
      hero: {
        src: '/hero.webp',
        srcEn: '/hero.en.webp',
        alt: { en: 'Flyer', es: 'Afiche' },
      },
      verticals: ['monthly-meetups'],
      talks: [],
      speakers: ['juan-perez'],
      sponsors: [{ slug: 'dailybot', tier: 'gold' }],
      gallery: [
        {
          src: '/g1.webp',
          alt: { en: 'Room', es: 'Sala' },
          caption: { en: 'Full', es: 'Lleno' },
        },
      ],
      linkRecording: 'https://youtube.test/abc',
      linkMeetupCom: 'https://luma.com/x',
    },
  },
  {
    id: '2025-07-23_noche-de-rust-2025',
    body: 'Otro cuerpo.',
    data: {
      title: { en: 'Rust Night 2025', es: 'Noche de Rust 2025' },
      description: { en: 'Rust night.', es: 'Noche de Rust.' },
      date: day('2025-07-23'),
      mode: 'in-person',
      status: 'completed',
      venue: { name: 'UTP', city: 'Pereira', country: 'Colombia' },
      verticals: ['monthly-meetups'],
      talks: [],
      speakers: [],
      sponsors: [],
      gallery: [],
    },
  },
];

const TALKS = [
  {
    id: 'qa--1-open-source',
    data: {
      title: {
        en: 'QA First: lessons from open source',
        es: 'QA First: lecciones del open source',
      },
      abstract: {
        en: 'Forty years of quality practice.',
        es: 'Cuarenta años de práctica de calidad.',
      },
      speakers: ['juan-perez', 'ana-lopez'],
      duration: 25,
      type: 'talk',
      date: day('2026-06-24'),
      recording: { url: 'https://youtube.test/talk' },
      event: { collection: 'meetups', slug: 'qa-pilar-del-software' },
    },
  },
];

const SPEAKERS = [
  {
    id: 'juan-perez',
    data: {
      name: 'Juan Alejandro Pérez',
      role: { en: 'Distribution Engineer', es: 'Ingeniero de Distribución' },
      bio: { en: 'Works on quality.', es: 'Trabaja en calidad.' },
      photo: { src: '/juan.webp', alt: { en: 'Portrait', es: 'Retrato' } },
      social: { github: 'https://github.test/juan', twitter: '' },
      languages: ['es'],
      location: { city: 'Pereira', country: 'Colombia' },
    },
  },
  {
    id: 'ana-lopez',
    data: {
      name: 'Ana Lopez',
      role: { en: 'Electronic Engineer', es: 'Ingeniera Electrónica' },
      bio: { en: 'Bio.', es: 'Bio.' },
      photo: { src: '/ana.webp', alt: {} },
      languages: ['es'],
    },
  },
];

const SPONSORS = [
  {
    id: 'dailybot',
    data: {
      name: 'DailyBot',
      description: { en: 'AI assistants.', es: 'Asistentes de IA.' },
      url: 'https://dailybot.test',
      tier: 'gold',
      sponsoredEditions: [],
      status: 'active',
      order: 1,
    },
  },
];

const VERTICALS = [
  {
    id: 'monthly-meetups',
    data: {
      title: { en: 'Monthly meetups', es: 'Meetups mensuales' },
      mission: { en: 'Consistent meetups.', es: 'Meetups consistentes.' },
      status: 'active',
      order: 1,
    },
  },
];

vi.mock('astro:content', () => ({
  getCollection: async (name: string) => {
    if (name === 'meetups') return MEETUPS;
    if (name === 'talks') return TALKS;
    if (name === 'speakers') return SPEAKERS;
    if (name === 'sponsors') return SPONSORS;
    if (name === 'verticals') return VERTICALS;
    return [];
  },
}));

const { resolveMeetupDetail, resolveSpeakerDetail } = await import(
  '@/lib/agent-resolvers'
);

const meetup = MEETUPS[0] as never;
const byId = (id: string) => SPEAKERS.find((s) => s.id === id) as never;
const speaker = byId('juan-perez');

describe('resolveMeetupDetail', () => {
  it('resolves talks to titles, abstracts and named speakers', async () => {
    const data = await resolveMeetupDetail(meetup, 'en');
    expect(data.talks).toHaveLength(1);
    expect(data.talks[0].title).toBe('QA First: lessons from open source');
    expect(data.talks[0].abstract).toBe('Forty years of quality practice.');
    expect(data.talks[0].speakers.map((s) => s.name)).toEqual([
      'Juan Alejandro Pérez',
      'Ana Lopez',
    ]);
    expect(data.talks[0].recordingUrl).toBe('https://youtube.test/talk');
  });

  it('unions speakers from the meetup and from its talks', async () => {
    // The HTML page does the same union; listing different people in the two
    // would be the defect.
    const data = await resolveMeetupDetail(meetup, 'en');
    expect(data.speakers.map((s) => s.slug).sort()).toEqual([
      'ana-lopez',
      'juan-perez',
    ]);
  });

  it('resolves sponsors and programs to names, never slugs', async () => {
    const data = await resolveMeetupDetail(meetup, 'en');
    expect(data.sponsors[0]).toMatchObject({
      slug: 'dailybot',
      name: 'DailyBot',
      tier: 'gold',
      website: 'https://dailybot.test',
    });
    expect(data.programs[0]).toMatchObject({
      slug: 'monthly-meetups',
      title: 'Monthly meetups',
    });
  });

  it('prefers the English flyer on English pages', async () => {
    expect((await resolveMeetupDetail(meetup, 'en')).hero?.src).toBe(
      '/hero.en.webp'
    );
    expect((await resolveMeetupDetail(meetup, 'es')).hero?.src).toBe(
      '/hero.webp'
    );
  });

  it('localizes every field it resolves', async () => {
    const es = await resolveMeetupDetail(meetup, 'es');
    expect(es.title).toBe('QA: Pilar del software');
    expect(es.talks[0].title).toBe('QA First: lecciones del open source');
    expect(es.programs[0].title).toBe('Meetups mensuales');
    expect(es.gallery[0].caption).toBe('Lleno');
  });

  it('localizes link labels, not just content', async () => {
    const en = await resolveMeetupDetail(meetup, 'en');
    const es = await resolveMeetupDetail(meetup, 'es');
    expect(en.links.map((l) => l.label)).toContain('Recording');
    expect(es.links.map((l) => l.label)).toContain('Grabación');
  });

  it('labels a Luma link as Luma rather than Meetup.com', async () => {
    const data = await resolveMeetupDetail(meetup, 'en');
    expect(data.links.map((l) => l.label)).toContain('Luma');
  });

  it('builds a venue map link from the venue itself', async () => {
    const data = await resolveMeetupDetail(meetup, 'en');
    expect(data.venue.mapUrl).toContain('UTP');
    expect(data.venue.mapUrl).toContain('Pereira');
  });

  it('relates meetups by shared program and excludes itself', async () => {
    const data = await resolveMeetupDetail(meetup, 'en');
    expect(data.related.map((m) => m.slug)).toEqual(['noche-de-rust-2025']);
  });
});

describe('resolveSpeakerDetail', () => {
  it('carries the bio, role and photo in the requested language', async () => {
    const en = await resolveSpeakerDetail(speaker, 'en');
    expect(en.name).toBe('Juan Alejandro Pérez');
    expect(en.role).toBe('Distribution Engineer');
    expect(en.bio).toBe('Works on quality.');
    expect(en.photo.alt).toBe('Portrait');

    const es = await resolveSpeakerDetail(speaker, 'es');
    expect(es.role).toBe('Ingeniero de Distribución');
  });

  it('includes the full talk history with abstracts', async () => {
    const data = await resolveSpeakerDetail(speaker, 'en');
    expect(data.talks).toHaveLength(1);
    expect(data.talks[0].abstract).toBe('Forty years of quality practice.');
  });

  it('resolves related events to titles, never a humanized slug', async () => {
    const data = await resolveSpeakerDetail(speaker, 'en');
    expect(data.events).toEqual([
      {
        collection: 'meetups',
        slug: 'qa-pilar-del-software',
        title: 'QA: the pillar of software',
      },
    ]);
  });

  it('drops empty social entries instead of emitting a blank link', async () => {
    const data = await resolveSpeakerDetail(speaker, 'en');
    expect(data.social.map((s) => s.label)).toEqual(['GitHub']);
  });

  it('falls back to a generated alt when the photo has none', async () => {
    const data = await resolveSpeakerDetail(byId('ana-lopez'), 'en');
    expect(data.photo.alt).toBe('Portrait of Ana Lopez');
  });
});
