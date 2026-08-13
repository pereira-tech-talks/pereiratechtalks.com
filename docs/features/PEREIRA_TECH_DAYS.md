# Pereira Tech Days

The **Pereira Tech Day** (PTD) collection powers the annual flagship conference's edition landing pages. Each edition (2024, 2026, …) ships as one content entry with its own `brandKit` (per-edition palette + typography), plus a data-driven set of copy, schedule, sponsors, and gallery fields. A single orchestrator component renders either an **upcoming** template (countdown, pricing, subscribe form) or a **past** template (keynote quote cards, lightning talks, memories marquee) from that same entry, branching on edition `status` — never on the year.

## Overview

- **Collection:** `pereiraTechDays` — one file per edition in `src/content/pereiraTechDays/{year}.{yaml,json,md,mdx}`.
- **Orchestrator:** `src/components/pages/PereiraTechDayDetailPage.astro` — resolves the edition, decides upcoming vs. past, and composes every section.
- **Theming:** `EditionScope` (`src/components/pereira-tech-days/EditionScope.astro`) scopes the edition's `brandKit` under `[data-edition-theme="{year}"]`. Edition pages use a **dedicated PTD chrome** (`chrome="ptd-edition"` on `MainLayout`): `PtdEditionHeader` shows `PTD {year}`, optional in-page anchors (e.g. Cronograma), a “Previous editions” dropdown, and a language switcher instead of the global Meetups/Blog nav. **No theme toggle** on edition pages — the surface is locked (`ptdChromeVariant`: 2024 dark / 2026 light), including the footer via a forced `html.dark` (or light) class. See [Brand Guide § Per-edition brand kits](../BRAND_GUIDE.md#per-edition-brand-kits-pereira-tech-days).
- **Legacy visual parity:** the **2026 upcoming** landing is an audited cream/coral/navy photocopy of legacy [`/pereira-tech-day/`](https://pereiratechtalks.org/pereira-tech-day/) (discrete countdown cards, tree-circle sponsors, always-open FAQ grid, illustration-forward Join). The **2024 past** landing remains the dark photocopy of `/pereira-tech-day/2024/`. Both keep v3 architecture (`EditionScope`, status-based branching via `getUpcomingLandingChrome()`, subscribe API, diploma FAQ links). Chrome (header/footer) stays global PTT.

## Routes

| Route (ES, root) | Route (EN, `/en`) | Purpose |
|---|---|---|
| `/pereira-tech-days` | `/en/pereira-tech-days` | Hub — featured upcoming edition + past edition rows |
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
    cardImage: i18nString.optional(), // 16:9 listing art (string or {en,es}); falls back to hero.src
    ogImage: i18nString.optional(), // 1200×630 share card (string or {en,es}); falls back to cardImage → hero.src
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
    schedule: z.array(scheduleSlot).default([]),        // see "Agenda (`schedule`)" below
    scheduleTentative: z.boolean().default(false),      // renders the "Tentativo" pill + note
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
    faqs: z.array(faqItem).default([]),       // faqItem supports `whilePostponed` overrides
    sponsorshipPlans: z.array(sponsorshipPlan).default([]),
    extraPartnerships: z.array(partnership).default([]),
    communities: z.array(z.object({ name: z.string(), logo: z.string(), url: z.string().optional() })).default([]),
    gallery: z.array(z.object({ src: z.string(), alt: i18nStringOptional, caption: i18nStringOptional })).default([]),
    status: eventStatus.default('announced'), // announced | rsvp-open | postponed | completed | cancelled
    postponement: postponementNotice.optional(), // see § Postponing an edition
    draft: z.boolean().default(false),
  }),
});
```

### Agenda (`schedule`)

Each slot is one row of the timeline rendered by `PtdScheduleSection.svelte`:

```typescript
z.object({
  time: z.string(),                 // 24h "HH:mm" — rendered as 12h AM/PM
  endTime: z.string().optional(),   // 24h "HH:mm" — drives the duration pill
  type: z.enum([
    'talk', 'keynote', 'panel',                       // session slots (clickable)
    'lightning', 'break', 'sponsor-break',
    'open-doors', 'registration', 'staff',
    'opening', 'raffle', 'closing',                   // logistics slots (static)
  ]),
  title: i18nStringOptional,        // talk title, or the logistics slot name
  description: i18nStringOptional,  // abstract shown inside the modal
  speaker: z.string().optional(),   // speaker slug — omit until the reveal
  talkSlug: z.string().optional(),  // optional link to a `talks` entry
})
```

**Reveal workflow.** `talk` / `keynote` / `panel` are *session* slots. A session
slot **without** `speaker` renders as a numbered placeholder — `Ponente 3` /
`Speaker 3` — in both the timeline and the line-up grid, so the whole day is
publishable before the line-up is locked. Numbering counts session slots only,
in chronological order, so revealing an earlier speaker never renumbers the
later placeholders. To reveal someone: add their `src/content/speakers/{slug}.yaml`
entry, then set `speaker`, `title`, and `description` on that slot. Nothing else
changes.

`scheduleTentative: true` adds the *Tentativo / Tentative* pill and the
"times may still change" note above the timeline.

**Derived UI.** `src/lib/ptdSchedule.ts` turns the raw slots into serializable
view models (`buildScheduleView`) that both Svelte islands consume — the
timeline and the speakers grid read the *same* array, so they cannot drift.
`getScheduleSpeakerSlugs()` collects the slugs the page needs to resolve; time
formatting (`formatSlotTime`) and durations (`getSlotDurationMinutes`) live
there too, covered by `tests/unit/lib/ptdSchedule.test.ts`.

### `sectionBackgrounds`

Decorative background images per landing section, added so the detail page never hardcodes a specific edition's asset paths. All keys are optional — omit a key (or the whole object) to render that section without a background. Only consumed on the **upcoming** template (`upcomingTemplate && sectionBgs.<key>`); past editions intentionally leave it unset. Example (2026):

```yaml
sectionBackgrounds:
  about: /images/pereira-tech-days/2026/sections/about-bg.png
  pricing: /images/pereira-tech-days/2026/sections/pricing-bg.png
  sponsors: /images/pereira-tech-days/2026/sections/sponsors-bg.webp
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

## Hub directory page (`/pereira-tech-days`) — removed

The plural hub/index at `/pereira-tech-days` (no year) was removed. The **canonical public landing** is the singular URL:

| URL | Role |
|---|---|
| `/pereira-tech-day` (and `/en/pereira-tech-day`) | Current/upcoming edition (2026) — same content as the year detail page |
| `/pereira-tech-days/{year}` | Year archive (2024, 2026 deep links, certificates) |
| `/pereira-tech-days` (no year) | **301 →** `/pereira-tech-day` |

Nav, footer, and primary CTAs use **“Pereira Tech Day”** → `/pereira-tech-day`. `getEditionHref()` / `getPtdLandingHref()` in `src/lib/pereiraTechDay.ts` route upcoming editions to the singular landing and past editions to `/pereira-tech-days/{year}/`.

### Composition order (historical)

The former hub used `PtdHubFeaturedStage` + `PtdHubPastRow`; those components were deleted with the hub page. Edition detail remains the only public template for flagship content.

### Hub chrome rule

**No `EditionScope` on non-edition chrome.** The singular landing and year detail pages use `EditionScope` + `PtdEditionHeader` as before. Global PTT header/footer stay outside the edition scope.

### Hub countdown variant

`PtdCountdown.svelte` still accepts `variant: 'edition' | 'hub'`. The `'hub'` variant remains available for cream landing surfaces (homepage strip); the deleted hub page no longer consumes it.

## Upcoming vs. past templates

`isUpcomingEdition(edition)` (`src/lib/pereiraTechDay.ts`) is the **single source of truth** for which template renders — never branch on the year:

```typescript
export const isUpcomingEdition = (edition: PereiraTechDay): boolean =>
  edition.data.status === 'announced' ||
  edition.data.status === 'rsvp-open' ||
  edition.data.status === 'postponed';
```

A **postponed** edition keeps the upcoming template on purpose — the page still
tells the story of the edition that was being built, minus every call to action.
See [Postponing an edition](#postponing-an-edition).

`PereiraTechDayDetailPage.astro` computes `const upcomingTemplate = isUpcomingEdition(edition);` once and threads it through every conditional section. Section order contract (documented inline in the component):

| Upcoming (e.g. 2026) | Past (e.g. 2024) |
|---|---|
| `PtdHero2026` | `PtdHero2024` |
| About (`PtdAboutSection`) | Ponentes — keynote quote cards (`PtdKeynoteQuoteCard`) * |
| Cronograma (`PtdScheduleSection`) * | — (soft-hidden; data stays in YAML) |
| Ponentes (`PtdSpeakersSection`) * | — |
| Lightning talks (`PtdLightningSection`, ghost cards when unannounced) | Lightning talks (`PtdLightningSection`) * |
| Memories (`PtdGalleryCarousel`, `mode="carousel"`) * | Memories (`PtdGalleryCarousel`, `mode="marquee"`) * |
| Pricing (`PtdPricingSection`) * | — |
| Sponsors (`PtdSponsorsShowcase`) * | Sponsors (`PtdSponsorsShowcase`) * |
| Organiza (`PtdCommunitiesOrganiza`) * | Organiza (`PtdCommunitiesOrganiza`) * |
| Organizadores / Colaboradores (`PtdTeamGrid` × 2) * | Organizadores / Colaboradores (`PtdTeamGrid` × 2) * |
| Talks directory (`TalkCard` grid) * | Talks directory (`TalkCard` grid) * |
| FAQ (`PtdFaqs`) * | FAQ (`PtdFaqs`) * |
| Join (`PtdJoinSection`, `showCta={false}`) | Markdown body (`<Content />` from the entry, when `description` is set) |

`*` — only renders when that edition actually has matching data (e.g. no lightning talks → section omitted entirely). Sponsors, Organiza, and team grids are **shared** between both templates (template-agnostic primitives); what differs is the hero, about-vs-ponentes, pricing-vs-nothing, and the gallery's carousel-vs-marquee mode.

Do not add a third template variant or branch new sections on `edition.data.year` — extend `isUpcomingEdition()`'s status semantics instead if a new lifecycle state is needed.

## Postponing an edition

An edition that is not happening on its announced date — but is not cancelled
either — uses `status: postponed`. It is designed as a **reversible switch**:
nothing is deleted, so restoring the edition is a status change, not a rebuild.

### Design rule

> Suppress at the **render layer**, never by deleting data.

The registration URL, the announced date, the countdown targets, the
sponsorship plans, and the full agenda all stay in the edition YAML. Helpers in
`src/lib/pereiraTechDay.ts` decide what may be published:

| Helper | Purpose |
|---|---|
| `isPostponedEdition(edition)` | Single source of truth for the state — never compare `status` inline |
| `isSectionSuppressed(edition, section)` | Whether a section listed in `postponement.hideSections` must be withheld right now |
| `getEditionRegistrationUrl(edition)` | The Luma link, or `undefined` while postponed — the **only** way components may read `linkMeetupCom` |
| `getPublishedFaqs(edition)` | FAQs with `whilePostponed` overrides applied |
| `getUpcomingEdition()` | Excludes postponed editions, so nothing promotes one as "next" |
| `resolveEditionStatus(edition)` | Returns `postponed` **before** the date comparison, so a postponed edition never silently flips to "past edition" once its original date passes |

### Schema

```yaml
status: postponed
postponement:
  since: 2026-08-13            # announcement date, shown in the notice byline
  headline: { es: …, en: … }   # one-line statement
  body:     { es: …, en: … }   # the announcement copy
  closing:  { es: …, en: … }   # optional, e.g. "Fuerza, Pereira. ❤️"
  image:                       # square notice art (strip + on-page announcement)
    src: { es: …/postponed.webp, en: …/postponed-en.webp }
    alt: { es: …, en: … }
  ogImage: { es: …/postponed-og.jpg, en: …/postponed-og-en.jpg }  # 1200×630; also EditionCard
  hideSections: [registration, countdown, pricing, schedule, speakers, lightning]
```

`image.src` and `ogImage` follow the `cardImage` convention — a plain string
when one piece serves both languages, or `{ en, es }` when the artwork itself is
localized (the postponement stamp is typeset per language).

`hideSections` accepts:

| Value | Suppresses |
|---|---|
| `registration` | The *Inscribirse* CTA and the Luma link, everywhere including the `.md` twin |
| `countdown` | The live countdown in the hero and the homepage strip |
| `pricing` | `PtdPricingSection` — sponsorship plans and the Vaki |
| `subscribe` | The "notify me when registration opens" form |
| `schedule` | `PtdScheduleSection`, the *ver cronograma* anchor, and the agenda in the `.md` twin |
| `speakers` | `PtdSpeakersSection` (line-up grid) and the speaker list in the `.md` twin |
| `lightning` | `PtdLightningSection`, including its "to be announced" ghost cards |

Suppression reaches the `.md` twin as well — it mirrors what the site
publishes, not the raw entry. `scripts/lib/md-completeness.mjs` therefore treats
the Schedule and Speakers sections as **conditional** (`whenHtmlHas`), so the
gate still fails when the page renders one and the twin omits it, but does not
demand a section neither surface shows.

The `postponement` block is **ignored in every other status**, so it can be left
in the file after the edition is restored as a record of what happened.

Individual FAQ entries opt into postponed-state copy without losing the
original:

```yaml
- question: { es: ¿Cómo puedo registrarme?, en: How can I register? }
  answer:   { es: Las inscripciones están abiertas…, en: Registration is open… }
  linkUrl: "https://luma.com/…"
  whilePostponed:
    answer: { es: Las inscripciones están cerradas…, en: Registration is closed… }
    # `hidden: true` drops the entry instead.
```

A `whilePostponed.answer` replaces the answer **and** drops `linkUrl` /
`linkLabel`, since the link belonged to the original answer. Both languages are
required — a postponement must not degrade bilingual parity.

### What the postponed state changes

| Surface | Behaviour |
|---|---|
| `PtdHero2026` | Eyebrow becomes the postponed badge; date/venue/attendance withheld; countdown replaced by a status pill; register CTA gone |
| `scheduleAnchors` | Empty, so the *ver cronograma* CTA disappears from both the edition header nav and the hero. The agenda section stays on the page — it is simply not advertised |
| `PtdPostponedNotice` | Rendered directly under the hero, above every other section |
| `PtdAnnouncementStrip` (homepage) | Switches from promo to notice: notice art, announcement copy, no countdown, CTA deep-links to `#postponed` |
| `EditionCard` | `Pospuesta` / `Postponed` badge in the danger tint; `postponement.ogImage` replaces the promo card |
| JSON-LD | `eventStatus: https://schema.org/EventPostponed` |
| `og:image` | `postponement.ogImage`, so social previews stop announcing the event |
| `.md` twin | Carries an `Aviso` / `Notice` line above the metadata and omits the registration link |
| Sitewide notification | `ptd-{year}.yaml` set `active: false`; `ptd-{year}-postponed.yaml` set `active: true` |

Everything else — agenda, line-up, sponsors wall, team, communities, FAQ — is
deliberately preserved as the record of what was being built.

### Postponing an edition (checklist)

1. Set `status: postponed` in `src/content/pereiraTechDays/{year}.yaml`.
2. Add the `postponement` block, including `hideSections`.
3. Add `whilePostponed` overrides to any FAQ that promises a date, a
   registration, or a hidden section.
4. Stage the notice art:
   `public/images/pereira-tech-days/{year}/postponed.webp` (square) and
   `postponed-og.jpg` (1200×630 — letterbox the square on the edition
   background rather than centre-cropping it, so the stamp survives).
5. Create `src/content/notifications/ptd-{year}-postponed.yaml` (`active: true`)
   and set `active: false` on the promotional `ptd-{year}.yaml`. Do **not**
   delete the promotional file.
6. Update the page twins `src/content/pages/{en,es}/pereira-tech-day.md`.
7. Verify: `pnpm run build`, then confirm the registration URL appears in
   **zero** files under `dist/` and no countdown island is emitted.

### Restoring an edition (checklist)

This is the reverse, and it is intentionally short:

1. Set `status` back to `rsvp-open` (or `announced`) in the edition YAML.
2. Set `active: false` on `ptd-{year}-postponed.yaml` and `active: true` on
   `ptd-{year}.yaml`.
3. Update the date fields if the edition was rescheduled (`date`, `startTime`,
   `endTime`, and the `homeSections.ptdStrip.*` strings in
   `src/lib/translations/{en,es}.ts`).
4. Revert the status note in `src/content/pages/{en,es}/pereira-tech-day.md`.

Steps 1–2 alone bring back the register CTA, the countdown, the sponsorship
plans, the promo art, the original FAQ answers, the `EventScheduled` JSON-LD,
and the promotional strip. `postponement`, `whilePostponed`, and the notice
images can stay in place — they go inert.

## `EditionScope` + PTT chrome rule

```astro
<EditionScope year={year}>
  <!-- All landing sections -->
</EditionScope>
```

`EditionScope.astro` wraps its slot in `<div data-edition-theme={year} class="ptd-edition-scope bg-ptt-bg text-ptt">`. `buildEditionThemeCss(edition)` generates a scoped CSS block (`[data-edition-theme="{year}"] { --ptt-primary: ...; }`, plus a `.dark [data-edition-theme="{year}"] { ... }` block when `paletteDark` is set) that `PereiraTechDayDetailPage.astro` inlines via `<style is:inline set:html={themeCss}>` **before** `<EditionScope>`, so the palette is present at first paint (no FOUC).

**Chrome rule:** `MainLayout` chrome renders **outside** `EditionScope` (siblings, not descendants). On edition detail routes, pass `chrome="ptd-edition"` so the global PTT header is replaced by `PtdEditionHeader` (site logo + `PTD {year}` + optional in-page anchors + previous-editions disclosure + language switcher). Pass in-page anchors via `MainLayout`'s `ptdAnchors` prop — the detail page uses it for `#schedule`, and only when the edition actually has an agenda. Footer stays global but follows the edition's locked theme (`ptdChromeVariant` forces `html.dark` for dark editions / removes it for light). Theme toggle is **omitted** on these routes. Never move chrome inside `EditionScope`, and never set `--ptt-*` tokens outside `global.css` or an `[data-edition-theme]` scope (no inline `style="--ptt-primary: ..."` on individual components).

## Component map

All components live in `src/components/pereira-tech-days/`.

### Hub-only components

Removed with the hub index. Public entry is now the singular landing + year archive routes.

### Edition-detail components

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
| `PtdLightningSection.astro` | Astro | Both | Title-first lightning talk cards with speaker footer; consumes `normalizeLightningTalks()` output. `pending` prop renders ghost cards + a "to be announced" note when the line-up is empty (upcoming only) |
| `PtdScheduleSection.svelte` | Svelte (`client:visible`) | Upcoming | Vertical agenda timeline: time rail, logistics rows, speaker cards, tentative pill; opens `PtdSpeakerModal` |
| `PtdSpeakersSection.svelte` | Svelte (`client:visible`) | Upcoming | Line-up grid built from the agenda's session slots; placeholder cards for unrevealed speakers; opens `PtdSpeakerModal` |
| `PtdSpeakerModal.svelte` | Svelte (nested) | Upcoming | Native `<dialog>` session detail — time, talk title, abstract, speaker bio, socials, profile link |
| `PtdScheduleIcon.svelte` / `PtdSocialIcon.svelte` | Svelte (nested) | Upcoming | Glyph lookups for slot types and social networks |
| `PtdGalleryCarousel.svelte` | Svelte (`client:visible`) | Both | `mode="carousel"` (upcoming, single-frame + thumbnails) or `mode="marquee"` (past, infinite duplicated CSS track, pauses on hover/focus, static grid fallback under `prefers-reduced-motion`) |
| `PtdFaqs.svelte` | Svelte (`client:visible`) | Both | `open-grid` (upcoming always-open) or `accordion` (past); optional section background |
| `PtdJoinSection.astro` | Astro | Upcoming | Illustration + cream fade, split coral title; detail page passes `showCta={false}` |
| `PtdPostponedNotice.astro` | Astro | Postponed | Announcement card (notice art + headline + body + closing) rendered directly under the hero; renders only when `status: postponed` **and** a `postponement` block is present. See [Postponing an edition](#postponing-an-edition) |
| `PtdCountdown.svelte` | Svelte (`client:visible`) | `PtdHero2026` (edition), homepage strip | `variant="edition"`: discrete white cards with Bebas numerals; `variant="hub"`: discrete cream cards using `--ptd-hub-*` |
| `PtdSubscribeForm.svelte` | Svelte (`client:visible`) | `PtdHero2026` | Unboxed italic copy + cyan→teal gradient CTA; honeypot + `EVENTS.PTD_SUBSCRIBE` |

Shared, non-PTD-specific components also used on the detail page: `TalkCard` (`src/components/cards/TalkCard.astro`) for the talks directory grid, `JsonLd` (`src/components/JsonLd.astro`) for the `Event` structured data.

## Related data helpers

`src/lib/pereiraTechDay.ts` — `getEditions()`, `getEditionByYear()`, `getUpcomingEdition()`, `getLatestEdition()`, `buildEditionThemeCss()`, `getEditionStartDate()` / `getEditionEndDate()` / `getEditionStartIso()` / `getEditionEndIso()`, `getEditionCountdownTargets()`, `isUpcomingEdition()`, `getEditionHref()` / `getPtdLandingHref()` / `PTD_LANDING_SLUG`, `getEditionFontPackages()`, `normalizeLightningTalks()`.

Cross-collection lookups used by the orchestrator: `getSpeakersBySlugs()` (`src/lib/speaker.ts`) for keynotes/lightning speakers, `getEditionSponsors()` (`src/lib/sponsor.ts`) for tiered sponsors, `getContributorsBySlugs()` (`src/lib/contributor.ts`) for organizers/collaborators, `getTalksByEvent('pereiraTechDays', edition.id)` (`src/lib/talk.ts`) for the talks directory.

`src/lib/ptdSchedule.ts` — agenda view models: `buildScheduleView()`, `getScheduleSpeakerSlugs()`, `countPendingSessions()`, `isSessionSlot()`, `getScheduleTypeLabel()`, `formatSlotTime()`, `getSlotDurationMinutes()`, `toSpeakerView()`.

### Feeding the speakers directory

A Pereira Tech Day is a special kind of meetup, so `getSpeakersSortedByLatestTalk()` (`src/lib/speaker.ts`) also reads editions — `schedule[].speaker`, `keynotes[]`, and `lightningTalks[]`. Revealing a speaker in the edition YAML is therefore enough to surface them at `/speakers` (and `/en/speakers`); no extra step is needed.

- **Recency:** the edition's start date bumps `latestTalkDate`, so a revealed speaker for an upcoming edition sorts to the top of the directory. `SpeakerCard` renders that future date as *Próxima charla* / *Next talk* instead of *Última charla*.
- **Counting:** an agenda session counts toward `talkCount` only when the slot has **no** `talkSlug` — a linked `talks` entry was already counted by the talks pass. Legacy `keynotes[]` / `lightningTalks[]` never increment the count (2024 has a `talks` entry per session); they only fill in the date.

## How to add a new edition

Use the `/add-ptd-edition` skill (mandatory — do not hand-roll a new edition entry). See [AGENTS.md](../../AGENTS.md#slash-commands-all-agents) for the invocation convention per agent. The skill covers: content entry creation, `brandKit` authoring (with WCAG ratio validation), hero/section asset staging, and verifying both language routes render.

## Validation checklist

- [ ] Edition entry validates against the `pereiraTechDays` Zod schema (`pnpm run astro:check`)
- [ ] `status` correctly reflects `isUpcomingEdition()` intent (`announced`/`rsvp-open`/`postponed` → upcoming template; `completed` → past template)
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
