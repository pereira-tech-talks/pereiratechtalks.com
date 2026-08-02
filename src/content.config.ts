import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Reusable Zod helpers for v3.0.0 collections.
 */

// String value or {en, es} bilingual object. New collections (meetups, events,
// PTDs, verticals, etc.) accept either form. The string form is treated as
// language-neutral and is rendered as-is for both languages.
const i18nString = z.union([
  z.string(),
  z.object({ en: z.string(), es: z.string() }),
]);

const i18nStringOptional = z
  .union([
    z.string(),
    z.object({ en: z.string().optional(), es: z.string().optional() }),
  ])
  .optional();

const heroLayout = z
  .enum(['banner', 'side-by-side', 'minimal', 'none'])
  .default('banner');

const venue = z.object({
  name: z.string(),
  addressLine: z.string().optional(),
  city: z.string(),
  country: z.string(),
  mapUrl: z.string().optional(),
});

const eventLocation = venue.extend({
  online: z.boolean().default(false),
  streamUrl: z.string().optional(),
});

const sponsorTier = z.enum([
  'diamond',
  'gold',
  'silver',
  'bronze',
  'community',
]);

const sponsorRef = z.object({
  slug: z.string(),
  tier: sponsorTier,
});

const eventStatus = z.enum([
  'announced',
  'rsvp-open',
  'completed',
  'cancelled',
]);

const hex = z
  .string()
  .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'Must be a 3- or 6-digit HEX value');

/**
 * Per-edition brand kit contract — embedded in pereiraTechDays.
 * Mirrors the typed contract documented in docs/BRAND_GUIDE.md §9
 * and analysis_results/BRAND_PALETTE.md §9.
 */
const editionBrandKit = z
  .object({
    paletteLight: z.object({
      primary: hex,
      accent: hex,
      bg: hex,
      bgElevated: hex,
      text: hex,
      textMuted: hex,
      border: hex.optional(),
    }),
    paletteDark: z
      .object({
        primary: hex,
        accent: hex,
        bg: hex,
        bgElevated: hex,
        text: hex,
        textMuted: hex,
        border: hex.optional(),
      })
      .optional(),
    typography: z
      .object({
        headingFamily: z.string().optional(),
        bodyFamily: z.string().optional(),
        headingTransform: z.enum(['uppercase', 'none']).optional(),
        headingTracking: z.string().optional(),
        fontSources: z
          .array(
            z
              .object({
                family: z.string(),
                npmPackage: z.string().optional(),
                cssUrl: z.string().optional(),
                cdnUrl: z.string().optional(),
                weights: z.array(z.number()).optional(),
                display: z
                  .enum(['swap', 'block', 'fallback', 'optional'])
                  .default('swap')
                  .optional(),
              })
              .refine(
                (s) => Boolean(s.npmPackage || s.cssUrl || s.cdnUrl),
                'fontSources entry must declare at least one of npmPackage, cssUrl, or cdnUrl'
              )
          )
          .optional(),
      })
      .optional(),
    hero: z
      .object({
        backgroundImage: z.string().optional(),
        gradient: z.string().optional(),
        accentDots: z.array(hex).optional(),
      })
      .optional(),
    ui: z
      .object({
        buttonShape: z.enum(['rounded', 'pill', 'square']).optional(),
        cardShape: z.enum(['rounded', 'sharp']).optional(),
      })
      .optional(),
  })
  .strict();

/**
 * EXISTING COLLECTIONS (unchanged from v2 baseline)
 */

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/i, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroLayout: z
      .enum(['banner', 'side-by-side', 'minimal', 'none'])
      .default('banner')
      .optional(),
    tags: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    relatedSlide: z.string().optional(),
    author: z.string().default('sergio-florez'),
    draft: z.boolean().default(false).optional(),
  }),
});

const tags = defineCollection({
  loader: glob({ base: './src/content/tags', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    tier: z.enum(['primary', 'secondary', 'subtopic']).default('primary'),
    parent: z.string().optional(),
    order: z.number().default(0),
  }),
});

const series = defineCollection({
  loader: glob({ base: './src/content/series', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
    heroImage: z.string().optional(),
    heroImageEs: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

const slideBaseSchema = z.object({
  title: z.string().max(100),
  description: z.string().min(130).max(160),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  draft: z.boolean().default(false),
  eventName: z.string().optional(),
  eventDate: z.coerce.date().optional(),
  eventUrl: z.url().optional(),
  relatedPost: z.string().optional(),
});

const nativeSlideSchema = slideBaseSchema.extend({
  type: z.literal('native'),
  theme: z.enum(['dark', 'light']).default('dark'),
  transition: z
    .enum(['none', 'fade', 'slide', 'convex', 'concave', 'zoom'])
    .default('slide'),
  syntaxHighlight: z.boolean().default(true),
  math: z.boolean().default(false),
});

const externalSlideSchema = slideBaseSchema.extend({
  type: z.literal('external'),
  externalUrl: z.url(),
  provider: z.string().optional(),
});

const slideSchema = z.discriminatedUnion('type', [
  nativeSlideSchema,
  externalSlideSchema,
]);

const slides = defineCollection({
  loader: glob({
    base: './src/content/slides',
    pattern: ['**/*.{md,mdx}', '!**/_*/**', '!**/_*.{md,mdx}'],
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/i, ''),
  }),
  schema: slideSchema,
});

const pages = defineCollection({
  loader: glob({
    base: './src/content/pages',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/\.md$/i, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.coerce.date().optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ base: './src/content/authors', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    avatar: z.string(),
    role: z.object({
      en: z.string(),
      es: z.string(),
    }),
    bio: z.object({
      en: z.string(),
      es: z.string(),
    }),
    social: z
      .object({
        x: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        instagram: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
  }),
});

/**
 * NEW v3.0.0 COLLECTIONS
 */

const meetups = defineCollection({
  loader: glob({
    base: './src/content/meetups',
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/i, ''),
  }),
  schema: z.object({
    title: i18nString,
    description: i18nString,
    pubDate: z.coerce.date(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    venue: venue,
    mode: z.enum(['in-person', 'virtual', 'hybrid']),
    hero: z
      .object({
        src: z.string(),
        alt: i18nStringOptional,
        layout: heroLayout,
      })
      .optional(),
    heroImage: z.string().optional(),
    verticals: z.array(z.string()).default([]),
    talks: z.array(z.string()).default([]),
    speakers: z.array(z.string()).default([]),
    sponsors: z.array(sponsorRef).default([]),
    linkMeetupCom: z.string().optional(),
    linkRecording: z.string().optional(),
    linkPhotos: z.string().optional(),
    status: eventStatus.default('announced'),
    draft: z.boolean().default(false),
  }),
});

const events = defineCollection({
  loader: glob({
    base: './src/content/events',
    pattern: '**/*.{md,mdx,yaml}',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx|yaml)$/i, ''),
  }),
  schema: z.object({
    title: i18nString,
    description: i18nString,
    type: z.enum([
      'meetup',
      'workshop',
      'hackathon',
      'conference',
      'webinar',
      'pereira-tech-day',
    ]),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: eventLocation,
    hero: z
      .object({
        src: z.string(),
        alt: i18nStringOptional,
        layout: heroLayout,
      })
      .optional(),
    sponsors: z.array(sponsorRef).default([]),
    verticals: z.array(z.string()).default([]),
    related: z
      .array(
        z.object({
          collection: z.enum(['meetups', 'pereiraTechDays', 'talks']),
          slug: z.string(),
        })
      )
      .default([]),
    status: eventStatus.default('announced'),
    draft: z.boolean().default(false),
  }),
});

const pereiraTechDays = defineCollection({
  loader: glob({
    base: './src/content/pereiraTechDays',
    pattern: '**/*.{md,mdx,yaml,json}',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx|yaml|json)$/i, ''),
  }),
  schema: z.object({
    year: z.number().int().min(2017).max(2100),
    title: i18nString,
    tagline: i18nString,
    description: i18nString,
    date: z.union([
      z.coerce.date(),
      z.object({
        start: z.coerce.date(),
        end: z.coerce.date(),
      }),
    ]),
    venue: venue,
    mode: z.enum(['in-person', 'virtual', 'hybrid']),
    hero: z.object({
      src: z.string(),
      alt: i18nStringOptional,
      layout: heroLayout.default('banner'),
    }),
    brandKit: editionBrandKit,
    schedule: z
      .array(
        z.object({
          time: z.string(),
          talkSlug: z.string().optional(),
          title: i18nStringOptional,
          type: z.enum([
            'talk',
            'keynote',
            'lightning',
            'panel',
            'break',
            'open-doors',
            'closing',
          ]),
        })
      )
      .default([]),
    keynotes: z.array(z.string()).default([]),
    lightningTalks: z.array(z.string()).default([]),
    sponsors: z.array(sponsorRef).default([]),
    organizers: z.array(z.string()).default([]),
    collaborators: z.array(z.string()).default([]),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    expectedAttendance: i18nStringOptional,
    aboutTopics: z.array(i18nString).default([]),
    aboutMedia: z
      .object({
        src: z.string(),
        alt: i18nStringOptional,
      })
      .optional(),
    faqs: z
      .array(
        z.object({
          question: i18nString,
          answer: i18nString,
          linkUrl: z.string().optional(),
          linkLabel: i18nStringOptional,
        })
      )
      .default([]),
    sponsorshipPlans: z
      .array(
        z.object({
          tier: z.enum(['silver', 'gold', 'platinum']),
          title: i18nString,
          subtitle: i18nStringOptional,
          price: z.string(),
          period: i18nStringOptional,
          featured: z.boolean().default(false),
          benefits: z.array(i18nString).default([]),
          ctaLabel: i18nString,
          ctaUrl: z.string(),
        })
      )
      .default([]),
    extraPartnerships: z
      .array(
        z.object({
          title: i18nString,
          subtitle: i18nStringOptional,
          items: z.array(
            z.union([
              z.object({ title: i18nString }),
              z.object({ description: i18nString }),
              z.object({ subtitle: i18nString }),
            ])
          ),
          ctaLabel: i18nString,
          ctaUrl: z.string(),
        })
      )
      .default([]),
    communities: z
      .array(
        z.object({
          name: z.string(),
          logo: z.string(),
          url: z.string().optional(),
        })
      )
      .default([]),
    gallery: z
      .array(
        z.object({
          src: z.string(),
          alt: i18nStringOptional,
          caption: i18nStringOptional,
        })
      )
      .default([]),
    linkMeetupCom: z.string().optional(),
    linkRecording: z.string().optional(),
    status: eventStatus.default('announced'),
    draft: z.boolean().default(false),
  }),
});

const verticals = defineCollection({
  loader: glob({ base: './src/content/verticals', pattern: '**/*.{yaml,md}' }),
  schema: z.object({
    title: i18nString,
    shortName: i18nString,
    mission: i18nString,
    description: i18nString,
    hero: z
      .object({
        src: z.string(),
        alt: i18nStringOptional,
        layout: heroLayout,
      })
      .optional(),
    leaders: z.array(z.string()).default([]),
    channels: z.array(z.string()).default([]),
    schedule: i18nStringOptional,
    status: z.enum(['active', 'paused', 'archived']).default('active'),
    order: z.number().default(0),
  }),
});

const speakers = defineCollection({
  loader: glob({ base: './src/content/speakers', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    pronouns: z.string().optional(),
    role: i18nString,
    bio: i18nString,
    photo: z.object({
      src: z.string(),
      alt: i18nStringOptional,
    }),
    social: z
      .object({
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        website: z.string().optional(),
        mastodon: z.string().optional(),
        bluesky: z.string().optional(),
      })
      .optional(),
    talks: z.array(z.string()).default([]),
    location: z
      .object({
        city: z.string(),
        country: z.string(),
      })
      .optional(),
    languages: z.array(z.string()).default(['es']),
  }),
});

const talks = defineCollection({
  loader: glob({
    base: './src/content/talks',
    pattern: '**/*.{md,mdx,yaml}',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx|yaml)$/i, ''),
  }),
  schema: z.object({
    title: i18nString,
    abstract: i18nString,
    speakers: z.array(z.string()).min(1),
    date: z.coerce.date().optional(),
    event: z
      .object({
        collection: z.enum(['meetups', 'events', 'pereiraTechDays']),
        slug: z.string(),
      })
      .optional(),
    language: z.enum(['en', 'es', 'pt', 'mixed']).default('es'),
    duration: z.number().int().positive().default(25),
    type: z
      .enum(['talk', 'keynote', 'lightning', 'panel', 'workshop'])
      .default('talk'),
    slidesDeck: z.string().optional(),
    recording: z
      .object({
        url: z.string(),
        provider: z
          .enum(['youtube', 'vimeo', 'twitch', 'other'])
          .default('youtube'),
      })
      .optional(),
    tags: z.array(z.string()).default([]),
    status: z
      .enum(['scheduled', 'live', 'recorded', 'cancelled'])
      .default('scheduled'),
  }),
});

const sponsors = defineCollection({
  loader: glob({ base: './src/content/sponsors', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    logo: z.object({
      light: z.string(),
      dark: z.string(),
      alt: z.string(),
    }),
    url: z.url(),
    description: i18nString,
    tier: sponsorTier,
    sponsoredEditions: z
      .array(
        z.object({
          year: z.number().int(),
          tier: sponsorTier,
        })
      )
      .default([]),
    status: z.enum(['active', 'past']).default('active'),
    order: z.number().default(0),
  }),
});

const channels = defineCollection({
  loader: glob({ base: './src/content/channels', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    platform: z.enum([
      'discord',
      'whatsapp',
      'telegram',
      'meetup-com',
      'youtube',
      'x',
      'linkedin',
      'instagram',
      'github',
      'linktree',
      'newsletter',
      'website',
      'other',
    ]),
    url: z.url(),
    description: i18nString,
    audience: i18nString,
    isPrimary: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const communities = defineCollection({
  loader: glob({ base: './src/content/communities', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    logo: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    url: z.url(),
    focus: z.object({ en: z.string(), es: z.string() }).optional(),
    description: i18nString,
    status: z.enum(['active', 'past']).default('active'),
    order: z.number().default(0),
  }),
});

const contributors = defineCollection({
  // Distinct from `authors` (which stays the canonical author collection for
  // blog posts). Contributors include all kinds of community members:
  // organizers, vertical leads, mentors, volunteers, sponsor liaisons.
  loader: glob({ base: './src/content/contributors', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    pronouns: z.string().optional(),
    avatar: z.string(),
    roles: z
      .array(
        z.enum([
          'founding-organizer',
          'organizer',
          'vertical-lead',
          'mentor',
          'speaker',
          'contributor',
          'sponsor-liaison',
          'press-lead',
          'conduct-team',
          'alumni',
        ])
      )
      .min(1),
    primaryVertical: z.string().optional(),
    role: z.object({
      en: z.string(),
      es: z.string(),
    }),
    bio: z.object({
      en: z.string(),
      es: z.string(),
    }),
    social: z
      .object({
        x: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        instagram: z.string().optional(),
        website: z.string().optional(),
        mastodon: z.string().optional(),
        bluesky: z.string().optional(),
      })
      .optional(),
    activeSince: z.coerce.date().optional(),
    inactiveSince: z.coerce.date().optional(),
    order: z.number().default(0),
  }),
});

/**
 * Public Google Calendars for allied Pereira tech communities.
 * IDs must be embeddable (public); no API keys.
 */
const communityCalendars = defineCollection({
  loader: glob({
    base: './src/content/communityCalendars',
    pattern: '**/*.{yaml,yml}',
  }),
  schema: z
    .object({
      name: z.object({ en: z.string(), es: z.string() }),
      description: z.object({ en: z.string(), es: z.string() }).optional(),
      googleCalendarId: z.string().trim(),
      color: hex,
      website: z.string().optional(),
      lumaUrl: z.string().optional(),
      active: z.boolean().default(true),
      order: z.number().int().default(0),
      primary: z.boolean().default(false),
    })
    .superRefine((data, ctx) => {
      const idPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[^\s@]+@group(\.v)?\.calendar\.google\.com$/i;
      if (data.active && !idPattern.test(data.googleCalendarId)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Active calendars need a valid public Google Calendar ID',
          path: ['googleCalendarId'],
        });
      }
      for (const [field, value] of [
        ['website', data.website],
        ['lumaUrl', data.lumaUrl],
      ] as const) {
        if (value && !value.startsWith('https://')) {
          ctx.addIssue({
            code: 'custom',
            message: `${field} must use https://`,
            path: [field],
          });
        }
      }
    }),
});

/**
 * Site-wide top notifications / alerts with date windows.
 * Plain strings only (no HTML) — rendered as text in the bar/modal.
 * CTA hrefs: internal paths or absolute http(s) only (blocks javascript:/data:).
 */
const notificationSafeHref = z
  .string()
  .regex(
    /^(\/(?!\/)|https?:\/\/)/,
    'ctaHref must be an internal path (starting with /) or an absolute http(s) URL'
  );

const notifications = defineCollection({
  loader: glob({
    base: './src/content/notifications',
    pattern: '**/*.{yaml,yml}',
  }),
  schema: z.object({
    severity: z
      .enum(['info', 'important', 'success', 'warning'])
      .default('info'),
    title: z.object({ en: z.string(), es: z.string() }),
    summary: z.object({ en: z.string(), es: z.string() }),
    body: z
      .object({ en: z.string().optional(), es: z.string().optional() })
      .optional(),
    ctaLabel: z.object({ en: z.string(), es: z.string() }).optional(),
    ctaHref: notificationSafeHref.optional(),
    modalEnabled: z.boolean().default(false),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    priority: z.number().int().default(0),
    active: z.boolean().default(true),
  }),
});

export const collections = {
  // Existing
  blog,
  tags,
  series,
  slides,
  pages,
  authors,
  // v3.0.0 — community website model
  meetups,
  events,
  pereiraTechDays,
  verticals,
  speakers,
  talks,
  sponsors,
  channels,
  communities,
  contributors,
  communityCalendars,
  notifications,
};
