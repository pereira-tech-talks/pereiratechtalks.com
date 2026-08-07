# Pereira Tech Days

The **Pereira Tech Day** (PTD) collection powers the annual flagship conference's edition landing pages. Each edition (2024, 2026, …) ships as one content entry with its own `brandKit` (per-edition palette + typography), plus a data-driven set of copy, schedule, sponsors, and gallery fields. A single orchestrator component renders either an **upcoming** template (countdown, pricing, subscribe form) or a **past** template (keynote quote cards, lightning talks, memories marquee) from that same entry, branching on edition `status` — never on the year.

## Overview

- **Collection:** `pereiraTechDays` — one file per edition in `src/content/pereiraTechDays/{year}.{yaml,json,md,mdx}`.
- **Orchestrator:** `src/components/pages/PereiraTechDayDetailPage.astro` — resolves the edition, decides upcoming vs. past, and composes every section.
- **Theming:** `EditionScope` (`src/components/pereira-tech-days/EditionScope.astro`) scopes the edition's `brandKit` under `[data-edition-theme="{year}"]`. Edition pages use a **dedicated PTD chrome** (`chrome="ptd-edition"` on `MainLayout`): `PtdEditionHeader` shows the current year + “Previous editions” dropdown instead of the global Meetups/Blog nav. **No theme toggle** on edition pages — the surface is locked (`ptdChromeVariant`: 2024 dark / 2026 light), including the footer via a forced `html.dark` (or light) class. See [Brand Guide § Per-edition brand kits](../BRAND_GUIDE.md#per-edition-brand-kits-pereira-tech-days).
- **Legacy visual parity:** the **2026 upcoming** landing is an audited cream/coral/navy photocopy of legacy [`/pereira-tech-day/`](https://www.pereiratechtalks.org/pereira-tech-day/) (discrete countdown cards, tree-circle sponsors, always-open FAQ grid, illustration-forward Join). The **2024 past** landing remains the dark photocopy of `/pereira-tech-day/2024/`. Both keep v3 architecture (`EditionScope`, status-based branching via `getUpcomingLandingChrome()`, subscribe API, diploma FAQ links). Chrome (header/footer) stays global PTT.

## Routes

| Route (ES, root) | Route (EN, `/en`) | Purpose |
|---|---|---|
| `/pereira-tech-days` | `/en/pereira-tech-days` | Edition directory (all years, newest first) |
| `/pereira-tech-days/{year}` | `/en/pereira-tech-days/{year}` | Edition detail — upcoming or past template |
| `/pereira-tech-days/{year}/certificates/{id}` | `/en/pereira-tech-days/{year}/certificates/{id}` | Individual attendance certificate (see [Certificates](CERTIFICATES.md)) |
| `/pereira-tech-days/{year}.md` (via `[year].md.ts`) | `/en/pereira-tech-days/{year}.md` | Markdown-for-Agents endpoint mirroring the detail page |
| `/pereira-tech-days.md` (via `index.md.ts`) | `/en/pereira-tech-days.md` | Markdown-for-Agents endpoint mirroring the directory |

Wrappers are 3-line Page Wrapper Pattern files: `src/pages/pereira-tech-days/[year].astro` renders `PereiraTechDayDetailPage` with `lang="es"`, `src/pages/en/pereira-tech-days/[year].astro` with `lang="en"`. Both call `getStaticPaths()` against `getEditions()` (`src/lib/pereiraTechDay.ts`), so every non-draft edition gets a page in both languages automatically — no per-edition route wiring needed.

## Content schema

Defined in `src/content.config.ts` as the `pereiraTechDays` collection. Selected fields relevant to the landing templates:

```typescript
const pereiraTechDays = defineCollection({
  schema: z.object({
    year: z.number().int().min(2017).max(2100),
    title: i18nString,          // string | { en, es }
    tagline: i18nString,
    description: i18nString,
    date: z.union([z.coerce.date(), z.object({ start: z.coerce.date(), end: z.coerce.date() })]),
    venue: venue,                // { name, addressLine?, city, country, mapUrl? }
    mode: z.enum(['in-person', 'virtual', 'hybrid']),
    hero: z.object({ src: z.string(), alt: i18nStringOptional, layout: heroLayout }),
    brandKit: editionBrandKit,   // see below
    sectionBackgrounds: z.object({
      about: z.string().optional(),
      pricing: z.string().optional(),
      sponsors: z.string().optional(),
      team: z.string().optional(),
      community: z.string().optional(),
      faqs: z.string().optional(),
      join: z.string().optional(),
    }).optional(),
    schedule: z.array(scheduleSlot).default([]),
    keynotes: z.array(z.string()).default([]),          // speaker slugs
    lightningTalks: z.array(z.union([
      z.string(),                                        // legacy: speaker slug only
      z.object({ speaker: z.string(), title: i18nString }), // title-first (2024 photocopy)
    ])).default([]),
    sponsors: z.array(sponsorRef).default([]),           // { slug, tier }
    organizers: z.array(z.string()).default([]),         // contributor slugs
    collaborators: z.array(z.string()).default([]),      // contributor slugs
    expectedAttendance: i18nStringOptional,
    aboutTopics: z.array(i18nString).default([]),
    aboutMedia: z.object({ src: z.string(), alt: i18nStringOptional }).optional(),
    faqs: z.array(faqItem).default([]),
    sponsorshipPlans: z.array(sponsorshipPlan).default([]),
    extraPartnerships: z.array(partnership).default([]),
    communities: z.array(z.object({ name: z.string(), logo: z.string(), url: z.string().optional() })).default([]),
    gallery: z.array(z.object({ src: z.string(), alt: i18nStringOptional, caption: i18nStringOptional })).default([]),
    status: eventStatus.default('announced'), // announced | rsvp-open | completed | cancelled
    draft: z.boolean().default(false),
  }),
});
```

### `sectionBackgrounds`

Decorative background images per landing section, added so the detail page never hardcodes a specific edition's asset paths. All keys are optional — omit a key (or the whole object) to render that section without a background. Only consumed on the **upcoming** template (`upcomingTemplate && sectionBgs.<key>`); past editions intentionally leave it unset. Example (2026):

```yaml
sectionBackgrounds:
  about: /images/pereira-tech-days/2026/sections/about-bg.png
  pricing: /images/pereira-tech-days/2026/sections/pricing-bg.png
  sponsors: /images/pereira-tech-days/2026/sections/sponsors-bg.png
  team: /images/pereira-tech-days/2026/sections/team-bg.png
  community: /images/pereira-tech-days/2026/sections/community-bg.png
  faqs: /images/pereira-tech-days/2026/sections/faqs-bg.png
  join: /images/pereira-tech-days/2026/sections/join-illustration.webp
```

### `lightningTalks` object shape

Accepts either a bare speaker slug (legacy shape) or a title-first object, normalized at render time by `normalizeLightningTalks()` (`src/lib/pereiraTechDay.ts`):

```typescript
type LightningTalkEntry = string | { speaker: string; title: string | { en?: string; es?: string } };

interface NormalizedLightningTalk {
  speaker: string;
  title?: string | { en?: string; es?: string };
}
```

Example (2024, title-first — legacy parity requires the talk title to lead the card, not the speaker name):

```yaml
lightningTalks:
  - speaker: jonathan-alvarez
    title:
      en: Your first talk
      es: Tu primera charla
  - speaker: juan-pablo-franco
    title:
      en: "..."
      es: "..."
```

`PtdLightningSection.astro` consumes `NormalizedLightningTalk[]` directly; callers (`PereiraTechDayDetailPage.astro`) always run raw `edition.data.lightningTalks` through `normalizeLightningTalks()` first.

### `brandKit` — fonts and `ui`

`editionBrandKit` (`src/content.config.ts`) is a `.strict()` Zod object. Relevant sub-shapes for the templates:

```typescript
typography: z.object({
  headingFamily: z.string().optional(),
  bodyFamily: z.string().optional(),
  headingTransform: z.enum(['uppercase', 'none']).optional(),
  headingTracking: z.string().optional(),
  fontSources: z.array(z.object({
    family: z.string(),
    npmPackage: z.string().optional(),   // e.g. '@fontsource/bebas-neue'
    cssUrl: z.string().optional(),
    cdnUrl: z.string().optional(),
    weights: z.array(z.number()).optional(),
    display: z.enum(['swap', 'block', 'fallback', 'optional']).default('swap').optional(),
  }).refine((s) => Boolean(s.npmPackage || s.cssUrl || s.cdnUrl))).optional(),
}).optional(),

ui: z.object({
  buttonShape: z.enum(['rounded', 'pill', 'square']).optional(),
  cardShape: z.enum(['rounded', 'sharp']).optional(),
}).optional(),
```

- `typography.headingFamily` / `headingTransform` / `headingTracking` are written by `buildEditionThemeCss()` into a `[data-edition-theme="{year}"] :is(h1, h2, h3, h4, h5, h6) { ... }` rule. The 2024 kit sets `'Bebas Neue', "Arial Black", sans-serif` + `uppercase` + `0.18em` tracking to match the legacy wordmark.
- `typography.fontSources[].npmPackage` drives `getEditionFontPackages(edition)`, which returns the de-duplicated list of npm font packages an edition declares. The detail page only renders `<PtdEditionFonts packages={fontPackages} />` when that list is non-empty, so editions without a custom heading font never pay the webfont cost. `PtdEditionFonts.astro` statically imports `@fontsource/bebas-neue` (currently the only supported package) behind a `SUPPORTED_PACKAGES` allow-list.
- `ui.buttonShape` / `ui.cardShape` map to `--ptd-button-radius` / `--ptd-card-radius` via `BUTTON_RADIUS_BY_SHAPE` / `CARD_RADIUS_BY_SHAPE` in `buildEditionThemeCss()` (`src/lib/pereiraTechDay.ts`), defaulting to the "rounded" mapping when `ui` is undeclared. Components consume these as `rounded-[var(--ptd-button-radius,9999px)]` / `rounded-[var(--ptd-card-radius,1rem)]` with a literal fallback, so every edition renders sane radii even without an explicit `ui` block (2024 has none).

## Upcoming vs. past templates

`isUpcomingEdition(edition)` (`src/lib/pereiraTechDay.ts`) is the **single source of truth** for which template renders — never branch on the year:

```typescript
export const isUpcomingEdition = (edition: PereiraTechDay): boolean =>
  edition.data.status === 'announced' || edition.data.status === 'rsvp-open';
```

`PereiraTechDayDetailPage.astro` computes `const upcomingTemplate = isUpcomingEdition(edition);` once and threads it through every conditional section. Section order contract (documented inline in the component):

| Upcoming (e.g. 2026) | Past (e.g. 2024) |
|---|---|
| `PtdHero2026` | `PtdHero2024` |
| About (`PtdAboutSection`) | Ponentes — keynote quote cards (`PtdKeynoteQuoteCard`) * |
| Lightning talks (`PtdLightningSection`) * | Lightning talks (`PtdLightningSection`) * |
| Memories (`PtdGalleryCarousel`, `mode="carousel"`) * | Memories (`PtdGalleryCarousel`, `mode="marquee"`) * |
| Pricing (`PtdPricingSection`) * | — |
| Schedule (full agenda) * | — (soft-hidden; data stays in YAML) |
| Sponsors (`PtdSponsorsShowcase`) * | Sponsors (`PtdSponsorsShowcase`) * |
| Organiza (`PtdCommunitiesOrganiza`) * | Organiza (`PtdCommunitiesOrganiza`) * |
| Organizadores / Colaboradores (`PtdTeamGrid` × 2) * | Organizadores / Colaboradores (`PtdTeamGrid` × 2) * |
| Talks directory (`TalkCard` grid) * | Talks directory (`TalkCard` grid) * |
| FAQ (`PtdFaqs`) * | FAQ (`PtdFaqs`) * |
| Join (`PtdJoinSection`, `showCta={false}`) | Markdown body (`<Content />` from the entry, when `description` is set) |

`*` — only renders when that edition actually has matching data (e.g. no lightning talks → section omitted entirely). Sponsors, Organiza, and team grids are **shared** between both templates (template-agnostic primitives); what differs is the hero, about-vs-ponentes, pricing-vs-nothing, and the gallery's carousel-vs-marquee mode.

Do not add a third template variant or branch new sections on `edition.data.year` — extend `isUpcomingEdition()`'s status semantics instead if a new lifecycle state is needed.

## `EditionScope` + PTT chrome rule

```astro
<EditionScope year={year}>
  <!-- All landing sections -->
</EditionScope>
```

`EditionScope.astro` wraps its slot in `<div data-edition-theme={year} class="ptd-edition-scope bg-ptt-bg text-ptt">`. `buildEditionThemeCss(edition)` generates a scoped CSS block (`[data-edition-theme="{year}"] { --ptt-primary: ...; }`, plus a `.dark [data-edition-theme="{year}"] { ... }` block when `paletteDark` is set) that `PereiraTechDayDetailPage.astro` inlines via `<style is:inline set:html={themeCss}>` **before** `<EditionScope>`, so the palette is present at first paint (no FOUC).

**Chrome rule:** `MainLayout` chrome renders **outside** `EditionScope` (siblings, not descendants). On edition detail routes, pass `chrome="ptd-edition"` so the global PTT header is replaced by `PtdEditionHeader` (site logo + `Pereira Tech Day {year}` + previous-editions disclosure). Footer stays global but follows the edition's locked theme (`ptdChromeVariant` forces `html.dark` for dark editions / removes it for light). Theme toggle is **omitted** on these routes. Never move chrome inside `EditionScope`, and never set `--ptt-*` tokens outside `global.css` or an `[data-edition-theme]` scope (no inline `style="--ptt-primary: ..."` on individual components).

## Component map

All components live in `src/components/pereira-tech-days/`.

| Component | Type | Used by | Role |
|---|---|---|---|
| `EditionScope.astro` | Astro | Orchestrator | Scopes `brandKit` CSS vars under `[data-edition-theme]`; chrome stays outside |
| `PtdEditionFonts.astro` | Astro | Orchestrator | Conditionally loads the edition's declared webfont package(s) |
| `PtdHero2026.astro` | Astro | Upcoming | Cream photocopy hero: coffee logo, Tech navy / Day coral / Year cyan, stacked meta, CSS-bg illustration fade, discrete countdown cards, unboxed gradient subscribe |
| `PtdHero2024.astro` | Astro | Past | Centered `Pereira•Tech•Day` dotted wordmark (Bebas Neue via `brandKit.typography`), venue link, optional recording CTA |
| `PtdAboutSection.astro` | Astro | Upcoming | Cream elevated about card + quieter icon topic row (AI / code / security) |
| `PtdPricingSection.astro` | Astro | Upcoming | Accent underline, top-edge icon badges, outline CTAs, peach featured tier + `extraPartnerships` |
| `PtdSponsorsShowcase.astro` | Astro | Both | `layout`: `tree-circles` (upcoming) or `gray-cards` (past) via `getUpcomingLandingChrome()` |
| `PtdCommunitiesOrganiza.astro` | Astro | Both | Organiza logo tiles; upcoming adds subtitle + footer dots |
| `PtdTeamGrid.astro` | Astro | Both | Square+LinkedIn (upcoming) or circular (past); titled Organizadores sibling section |
| `PtdKeynoteQuoteCard.astro` | Astro | Past | Bio blockquote → rule → circular photo/name/role footer (replaces `SpeakerCard` for past keynotes) |
| `PtdLightningSection.astro` | Astro | Both | Title-first lightning talk cards with speaker footer; consumes `normalizeLightningTalks()` output |
| `PtdGalleryCarousel.svelte` | Svelte (`client:visible`) | Both | `mode="carousel"` (upcoming, single-frame + thumbnails) or `mode="marquee"` (past, infinite duplicated CSS track, pauses on hover/focus, static grid fallback under `prefers-reduced-motion`) |
| `PtdFaqs.svelte` | Svelte (`client:visible`) | Both | `open-grid` (upcoming always-open) or `accordion` (past); optional section background |
| `PtdJoinSection.astro` | Astro | Upcoming | Illustration + cream fade, split coral title; detail page passes `showCta={false}` |
| `PtdCountdown.svelte` | Svelte (`client:visible`) | `PtdHero2026` | Four discrete white countdown cards (Bebas numerals) |
| `PtdSubscribeForm.svelte` | Svelte (`client:visible`) | `PtdHero2026` | Unboxed italic copy + cyan→teal gradient CTA; honeypot + `EVENTS.PTD_SUBSCRIBE` |
| `PtdCountdown.svelte` | Svelte (`client:visible`) | `PtdHero2026` | Days/hours/minutes/seconds countdown to `targetDate` |
| `PtdSubscribeForm.svelte` | Svelte (`client:visible`) | `PtdHero2026` | Email capture posting to `/api/ptd-subscribe`, honeypot field, analytics event `EVENTS.PTD_SUBSCRIBE` |

Shared, non-PTD-specific components also used on the detail page: `TalkCard` (`src/components/cards/TalkCard.astro`) for the talks directory grid, `JsonLd` (`src/components/JsonLd.astro`) for the `Event` structured data.

## Related data helpers

`src/lib/pereiraTechDay.ts` — `getEditions()`, `getEditionByYear()`, `getUpcomingEdition()`, `getLatestEdition()`, `buildEditionThemeCss()`, `getEditionStartDate()` / `getEditionEndDate()` / `getEditionStartIso()` / `getEditionEndIso()`, `isUpcomingEdition()`, `getEditionFontPackages()`, `normalizeLightningTalks()`.

Cross-collection lookups used by the orchestrator: `getSpeakersBySlugs()` (`src/lib/speaker.ts`) for keynotes/lightning speakers, `getEditionSponsors()` (`src/lib/sponsor.ts`) for tiered sponsors, `getContributorsBySlugs()` (`src/lib/contributor.ts`) for organizers/collaborators, `getTalksByEvent('pereiraTechDays', edition.id)` (`src/lib/talk.ts`) for the talks directory.

## How to add a new edition

Use the `/add-ptd-edition` skill (mandatory — do not hand-roll a new edition entry). See [AGENTS.md](../../AGENTS.md#slash-commands-all-agents) for the invocation convention per agent. The skill covers: content entry creation, `brandKit` authoring (with WCAG ratio validation), hero/section asset staging, and verifying both language routes render.

## Validation checklist

- [ ] Edition entry validates against the `pereiraTechDays` Zod schema (`pnpm run astro:check`)
- [ ] `status` correctly reflects `isUpcomingEdition()` intent (`announced`/`rsvp-open` → upcoming template; `completed` → past template)
- [ ] `brandKit.paletteLight` (and `paletteDark` if used) clear WCAG AA on body text — see [Accessibility Guide](../ACCESSIBILITY.md)
- [ ] Chrome (header/footer/lang switcher/theme toggle) stays outside `EditionScope` — verify by inspecting rendered HTML, not just visually
- [ ] `lightningTalks` speaker slugs resolve against `src/content/speakers/`
- [ ] `sectionBackgrounds` paths exist under `public/images/pereira-tech-days/{year}/`
- [ ] Both `/pereira-tech-days/{year}` and `/en/pereira-tech-days/{year}` render (Spanish primary, English parity)
- [ ] `pnpm run build` succeeds and `pnpm run md:check` passes (Markdown-for-Agents endpoint present)

## Related documentation

- [Brand Guide § Per-edition brand kits](../BRAND_GUIDE.md#per-edition-brand-kits-pereira-tech-days) — scoping mechanism, reference kit values, checklist
- [Design System](../DESIGN.md) — `--ptt-*` tokens, per-edition theming summary
- [Certificates](CERTIFICATES.md) — individual diploma pages issued per edition
- [Architecture Guide](../ARCHITECTURE.md) — Content Collections overview, project structure
- [Accessibility Guide](../ACCESSIBILITY.md) — WCAG AA contrast rules, per-edition palette verification
