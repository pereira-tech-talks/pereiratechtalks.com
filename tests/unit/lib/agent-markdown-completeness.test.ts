/**
 * Required-section coverage for the pure agent-Markdown serializers.
 *
 * These assert the primary check of the completeness contract
 * (`docs/aeo/MARKDOWN_FOR_AGENTS.md`): each page type's required sections are
 * present, entity references carry a name and link to that entity's own `.md`,
 * and no bare slug survives.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 7. The serializers take
 * resolved data and return a string, which is what makes this testable without
 * the content layer.
 */
import { describe, expect, it } from 'vitest';

import type {
  ResolvedEditionDetail,
  ResolvedMeetupDetail,
  ResolvedSpeakerDetail,
} from '@/lib/agent-resolvers';
import {
  entityLine,
  imageLine,
  mdHref,
  mdLabel,
  serializeEditionToMarkdown,
  serializeMeetupDetailToMarkdown,
  serializeSpeakerDetailToMarkdown,
} from '@/lib/markdown-for-agents';

const meetup: ResolvedMeetupDetail = {
  slug: 'qa-pilar-del-software',
  title: 'QA: the pillar of software',
  description: 'Two talks on quality.',
  date: '2026-06-24',
  mode: 'in-person',
  status: 'announced',
  venue: {
    name: 'UTP',
    city: 'Pereira',
    country: 'Colombia',
    mapUrl: 'https://maps.example/utp',
  },
  hero: { src: '/images/meetups/qa/hero.webp', alt: 'QA night flyer' },
  body: 'Software quality has moved well beyond catching bugs.',
  untranslated: false,
  talks: [
    {
      slug: 'qa--1-open-source',
      title: 'QA First: lessons from open source',
      abstract: 'Forty years of quality practice in open source projects.',
      speakers: [{ slug: 'juan-perez', name: 'Juan Alejandro Pérez' }],
      durationMinutes: 25,
      type: 'talk',
      recordingUrl: 'https://youtube.example/abc',
      date: '2026-06-24',
    },
  ],
  speakers: [
    {
      slug: 'juan-perez',
      name: 'Juan Alejandro Pérez',
      role: 'Distribution Engineer',
    },
  ],
  sponsors: [
    {
      slug: 'dailybot',
      name: 'DailyBot',
      tier: 'gold',
      website: 'https://dailybot.com',
    },
  ],
  programs: [
    {
      slug: 'monthly-meetups',
      title: 'Monthly meetups',
      mission: 'Consistent monthly meetups in Pereira.',
    },
  ],
  gallery: [{ src: '/images/g1.webp', alt: 'Audience', caption: 'Full room' }],
  links: [{ label: 'Recording', url: 'https://youtube.example/abc' }],
  related: [
    {
      slug: 'noche-de-rust-2025',
      title: 'Rust Night 2025',
      date: '2025-07-23',
    },
  ],
};

const speaker: ResolvedSpeakerDetail = {
  slug: 'sergio-florez',
  name: 'Sergio Alexander Flórez',
  role: 'Co-founder & CTO at DailyBot',
  bio: 'Founding organizer of Pereira Tech Talks.',
  pronouns: 'he/him',
  location: 'Pereira, Colombia',
  languages: ['es', 'en'],
  photo: { src: '/images/speakers/sergio.webp', alt: 'Portrait of Sergio' },
  social: [{ label: 'GitHub', url: 'https://github.com/xergioalex' }],
  talks: [
    {
      slug: 'kmp',
      title: 'Discovering Kotlin Multiplatform',
      abstract: 'Sharing code across Android and iOS.',
      speakers: [{ slug: 'sergio-florez', name: 'Sergio Alexander Flórez' }],
      durationMinutes: 30,
      type: 'talk',
      date: '2026-04-17',
    },
  ],
  events: [
    {
      collection: 'meetups',
      slug: 'abril-mobile-2026',
      title: 'April Mobile',
    },
  ],
};

const edition: ResolvedEditionDetail = {
  year: 2026,
  title: 'Pereira Tech Day 2026',
  tagline: 'Where talent, technology and brands meet.',
  description: 'The annual flagship conference.',
  dateLabel: '2026-08-22',
  mode: 'in-person',
  status: 'announced',
  scheduleTentative: true,
  venue: {
    name: 'UTP Auditorio',
    city: 'Pereira',
    country: 'Colombia',
    mapUrl: 'https://maps.example/utp',
  },
  hero: { src: '/images/ptd/hero.webp', alt: 'PTD 2026 key visual' },
  body: 'A full day of keynotes and lightning talks.',
  expectedAttendance: '300+',
  aboutTopics: ['AI engineering', 'Edge computing'],
  schedule: [
    {
      time: '09:00–09:45',
      title: 'Opening keynote',
      description: 'How agents reshape the web.',
      type: 'keynote',
      speaker: { slug: 'sergio-florez', name: 'Sergio Alexander Flórez' },
    },
  ],
  keynotes: [
    { slug: 'sergio-florez', name: 'Sergio Alexander Flórez', role: 'CTO' },
  ],
  lightningTalks: [
    {
      title: 'How many trees does a deploy cost?',
      speaker: { slug: 'ana-lopez', name: 'Ana Lopez' },
    },
  ],
  speakers: [
    {
      slug: 'sergio-florez',
      name: 'Sergio Alexander Flórez',
      role: 'CTO',
      bio: 'Founding organizer.',
    },
  ],
  organizers: [
    { slug: 'jose-felipe-duarte', name: 'Jose Felipe Duarte', role: 'Co-lead' },
  ],
  collaborators: [],
  sponsors: [
    {
      slug: 'dailybot',
      name: 'DailyBot',
      tier: 'gold',
      website: 'https://dailybot.com',
    },
  ],
  communities: [{ name: 'PereiraJS', url: 'https://perjs.org' }],
  pricing: [
    {
      title: 'Gold',
      subtitle: 'Annual partner',
      price: 'COP 5.000.000',
      period: 'per edition',
      benefits: ['Logo on stage', 'Booth space'],
      ctaLabel: 'Become a sponsor',
      ctaUrl: '/sponsor-us',
    },
  ],
  extraPartnerships: [
    {
      title: 'In-kind partnerships',
      subtitle: 'Venue, catering, swag',
      items: ['Coffee breaks', 'Merchandising kits'],
      ctaLabel: 'Propose a partnership',
      ctaUrl: '/contact',
    },
  ],
  faqs: [{ question: 'Is it free?', answer: 'Registration opens in June.' }],
  gallery: [],
  links: [{ label: 'Recordings', url: 'https://youtube.example/ptd' }],
};

/** A list row that is only a slug — the defect the contract forbids. */
const BARE_SLUG_ROW = /^- [a-z0-9]+(-[a-z0-9]+)+\s*$/m;

describe('entity reference helpers', () => {
  it('builds a language-correct `.md` href', () => {
    expect(mdHref('en', 'speakers/sergio-florez')).toBe(
      '/en/speakers/sergio-florez.md'
    );
    expect(mdHref('es', 'speakers/sergio-florez')).toBe(
      '/speakers/sergio-florez.md'
    );
  });

  it('drops empty detail segments instead of leaving a dangling dash', () => {
    expect(entityLine('Ana', '/speakers/ana.md')).toBe(
      '- [Ana](/speakers/ana.md)'
    );
    expect(
      entityLine('Ana', '/speakers/ana.md', '', undefined, 'Engineer')
    ).toBe('- [Ana](/speakers/ana.md) — Engineer');
  });

  it('keeps an image even when its alt text is empty', () => {
    expect(imageLine('', '/a.webp')).toBe('![](/a.webp)');
  });

  it('localizes section headings', () => {
    expect(mdLabel('en', 'speakers')).toBe('Speakers');
    expect(mdLabel('es', 'speakers')).toBe('Ponentes');
  });
});

describe('meetup detail serializer', () => {
  const md = serializeMeetupDetailToMarkdown(meetup, 'en');

  it.each([
    ['Hero image'],
    ['Talks'],
    ['Speakers'],
    ['Programs'],
    ['Sponsors'],
    ['Venue'],
    ['Gallery'],
    ['Related meetups'],
  ])('includes the required section %s', (heading) => {
    expect(md).toContain(`## ${heading}`);
  });

  it('carries each talk abstract, not just its title', () => {
    expect(md).toContain('QA First: lessons from open source');
    expect(md).toContain(
      'Forty years of quality practice in open source projects.'
    );
  });

  it('resolves every entity to a name plus its own `.md`', () => {
    expect(md).toContain('[Juan Alejandro Pérez](/en/speakers/juan-perez.md)');
    expect(md).toContain('[DailyBot](/en/sponsors/dailybot.md)');
    expect(md).toContain('[Monthly meetups](/en/verticals/monthly-meetups.md)');
    expect(md).not.toMatch(BARE_SLUG_ROW);
  });

  it('keeps the body and the hero image', () => {
    expect(md).toContain(
      'Software quality has moved well beyond catching bugs.'
    );
    expect(md).toContain('![QA night flyer](/images/meetups/qa/hero.webp)');
  });

  it('uses Spanish headings and metadata keys on a Spanish page', () => {
    const es = serializeMeetupDetailToMarkdown(meetup, 'es');
    expect(es).toContain('## Ponentes');
    expect(es).toContain('## Charlas');
    expect(es).toContain('Fecha: 2026-06-24');
    expect(es).not.toContain('## Speakers');
  });

  it('labels a fallback body instead of leaking it silently', () => {
    const md = serializeMeetupDetailToMarkdown(
      { ...meetup, untranslated: true },
      'en',
      'Not translated yet.'
    );
    expect(md).toContain('> Not translated yet.');
  });
});

describe('speaker detail serializer', () => {
  const md = serializeSpeakerDetailToMarkdown(speaker, 'en');

  it.each([['Photo'], ['Social links'], ['Talk history'], ['Related events']])(
    'includes the required section %s',
    (heading) => {
      expect(md).toContain(`## ${heading}`);
    }
  );

  it('renders the bio as the body, not only as the description', () => {
    const body = md.split('---')[1] ?? '';
    expect(body).toContain('Founding organizer of Pereira Tech Talks.');
  });

  it('carries the talk history with abstracts', () => {
    expect(md).toContain('### Discovering Kotlin Multiplatform');
    expect(md).toContain('Sharing code across Android and iOS.');
  });

  it('links related events by title, never by humanized slug', () => {
    expect(md).toContain('[April Mobile](/en/meetups/abril-mobile-2026.md)');
    expect(md).not.toContain('abril mobile 2026');
  });
});

describe('Pereira Tech Day edition serializer', () => {
  const md = serializeEditionToMarkdown(
    edition,
    'en',
    '/pereira-tech-days/2026'
  );

  it.each([
    ['Hero image'],
    ['Topics'],
    ['Schedule'],
    ['Keynotes'],
    ['Lightning talks'],
    ['Speakers'],
    ['Organizers'],
    ['Sponsors'],
    ['Partner communities'],
    ['Registration'],
    ['Other partnerships'],
    ['FAQs'],
    ['Venue'],
  ])('includes the required section %s', (heading) => {
    expect(md).toContain(`## ${heading}`);
  });

  it('resolves schedule speakers to names with links', () => {
    expect(md).toContain(
      '[Sergio Alexander Flórez](/en/speakers/sergio-florez.md)'
    );
    expect(md).toContain('How agents reshape the web.');
  });

  it('carries the complete benefit list of each sponsorship tier', () => {
    expect(md).toContain('- Logo on stage');
    expect(md).toContain('- Booth space');
  });

  it('carries FAQ answers, not just questions', () => {
    expect(md).toContain('### Is it free?');
    expect(md).toContain('Registration opens in June.');
  });

  it('marks a tentative schedule', () => {
    expect(md).toContain('Tentative');
  });

  it('emits no bare slug rows', () => {
    expect(md).not.toMatch(BARE_SLUG_ROW);
  });
});
