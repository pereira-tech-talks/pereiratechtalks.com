/**
 * Mock slide deck data for testing.
 * Shapes match CollectionEntry<'slides'> from Astro content collections.
 */

interface MockNativeSlideData {
  type: 'native';
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  heroImage?: string;
  draft?: boolean;
  eventName?: string;
  eventDate?: Date;
  eventUrl?: string;
  relatedPost?: string;
  theme?: 'dark' | 'light';
  transition?: 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom';
  syntaxHighlight?: boolean;
  math?: boolean;
}

interface MockExternalSlideData {
  type: 'external';
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  heroImage?: string;
  draft?: boolean;
  eventName?: string;
  eventDate?: Date;
  eventUrl?: string;
  relatedPost?: string;
  externalUrl: string;
  provider?: string;
}

type MockSlideData = MockNativeSlideData | MockExternalSlideData;

interface MockSlideDeck {
  id: string;
  data: MockSlideData;
  body?: string;
}

// ─── Native Decks ───────────────────────────────────────

export const nativeEnglishDeck: MockSlideDeck = {
  id: 'en/2026-04-25_demo-revealjs-features',
  data: {
    type: 'native',
    title: 'Reveal.js Features Demo',
    description:
      'A comprehensive showcase of Reveal.js presentation features including fragments, auto-animate, code highlights, media, and layouts.',
    pubDate: new Date('2026-04-25'),
    heroImage: '/images/slides/demo-revealjs-features/hero.webp',
    theme: 'dark',
    transition: 'slide',
    syntaxHighlight: true,
    math: true,
    eventName: 'Pereira Tech Talks Demo',
    eventDate: new Date('2026-04-25'),
  },
  body: '---\n# Slide 1\nHello World\n---\n# Slide 2\nGoodbye',
};

export const nativeSpanishDeck: MockSlideDeck = {
  id: 'es/2026-04-25_demo-revealjs-features',
  data: {
    type: 'native',
    title: 'Demo de características de Reveal.js',
    description:
      'Una demostración completa de las características de Reveal.js incluyendo fragmentos, auto-animación, resaltado de código y más.',
    pubDate: new Date('2026-04-25'),
    heroImage: '/images/slides/demo-revealjs-features/hero.webp',
    theme: 'dark',
    transition: 'slide',
    syntaxHighlight: true,
    math: true,
    eventName: 'Pereira Tech Talks Demo',
    eventDate: new Date('2026-04-25'),
  },
  body: '---\n# Diapositiva 1\nHola Mundo\n---\n# Diapositiva 2\nAdiós',
};

// ─── External Decks ─────────────────────────────────────

export const externalEnglishDeck: MockSlideDeck = {
  id: 'en/2026-03-15_cloud-architecture-patterns',
  data: {
    type: 'external',
    title: 'Cloud Architecture Patterns',
    description:
      'An overview of modern cloud architecture patterns for scalable distributed systems presented at Pereira Tech Talks 2025.',
    pubDate: new Date('2026-03-15'),
    externalUrl: 'https://docs.google.com/presentation/d/example',
    provider: 'Google Slides',
    eventName: 'Pereira Tech Talks 2025',
    eventDate: new Date('2025-11-15'),
    eventUrl: 'https://pereiratechtalks.org/',
  },
};

export const externalSpanishDeck: MockSlideDeck = {
  id: 'es/2026-03-15_cloud-architecture-patterns',
  data: {
    type: 'external',
    title: 'Patrones de arquitectura en la nube',
    description:
      'Una visión general de los patrones de arquitectura en la nube para sistemas distribuidos escalables, presentada en Pereira Tech Talks.',
    pubDate: new Date('2026-03-15'),
    externalUrl: 'https://docs.google.com/presentation/d/example',
    provider: 'Google Slides',
    eventName: 'Pereira Tech Talks 2025',
    eventDate: new Date('2025-11-15'),
    eventUrl: 'https://pereiratechtalks.org/',
  },
};

// ─── Draft Decks ────────────────────────────────────────

export const draftNativeDeck: MockSlideDeck = {
  id: 'en/2026-05-01_upcoming-talk',
  data: {
    type: 'native',
    title: 'Upcoming Talk Preview',
    description:
      'A preview of an upcoming presentation that is still being prepared and should not be visible in production builds.',
    pubDate: new Date('2026-05-01'),
    draft: true,
    theme: 'dark',
    transition: 'slide',
    syntaxHighlight: true,
    math: false,
  },
  body: '---\n# WIP\n---\n# Coming soon',
};

// ─── All decks (for mock getCollection) ─────────────────

export const allMockDecks: MockSlideDeck[] = [
  nativeEnglishDeck,
  nativeSpanishDeck,
  externalEnglishDeck,
  externalSpanishDeck,
  draftNativeDeck,
];
