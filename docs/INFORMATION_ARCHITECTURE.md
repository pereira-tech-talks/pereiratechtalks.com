# Information Architecture — Pereira Tech Talks v3.0.0

This is the **single source of truth** for the URL surface, navigation,
canonical relationships between content collections, and routing decisions
for `pereiratechtalks.org` v3.0.0.

Downstream tasks (page implementations, i18n, SEO, sitemap, search,
middleware) consume this document verbatim. If you ship a page that does not
match this IA, you are creating drift.

> Last reviewed: 2026 — PTT v3.0.0 launch.

## 1. Languages & Routing

- **Spanish** is the **primary** language of the community. URL surface:
  `/es/*`.
- **English** is **first-class international**. URL surface: root
  (`/*`).
- Both languages have full route parity. If only one language is ready
  for a given route, the missing language renders a graceful "translation
  in progress" notice and links to the available one.
- Slugs are **always English** for blog posts, meetups, talks, slides,
  and PTD editions, regardless of the page language. Spanish-only slugs
  are forbidden by project rule.

## 2. Full URL Surface

> All EN routes have a Spanish counterpart at `/es/<same-path>` unless
> noted. Catalog routes (e.g. `/meetups`) and detail routes (e.g.
> `/meetups/<slug>`) share schemas across languages.

### Top-level static and content pages

| Route family | EN | ES | Source | Wrapper | Page component | AEO `.md` |
|---|---|---|---|---|---|---|
| Home | `/` | `/es/` | static | `index.astro` | `HomePage.astro` | `[page].md.ts` |
| About | `/about-us` | `/es/about-us` | static | `about-us.astro` | `AboutUsPage.astro` | `pages/{lang}/about-us.md` |
| Community | `/community` | `/es/community` | static | `community.astro` | `CommunityPage.astro` | yes |
| Verticals umbrella | `/verticals` | `/es/verticals` | `verticals` | `verticals/index.astro` | `VerticalsListPage.astro` | yes |
| Vertical detail | `/verticals/{slug}` | `/es/verticals/{slug}` | `verticals` | `verticals/[slug].astro` | `VerticalDetailPage.astro` | per-slug `.md` |
| Meetups timeline | `/meetups` | `/en/meetups` | `meetups` | `meetups/index.astro` | `MeetupsTimelinePage.astro` | yes |
| Meetup detail | `/meetups/{slug}` | `/en/meetups/{slug}` | `meetups` | `meetups/[slug].astro` | `MeetupDetailPage.astro` | per-slug `.md` |
| Events calendar | `/events` | `/es/events` | `events` + `meetups` | `events/index.astro` | `EventsCalendarPage.astro` | yes |
| Event detail | `/events/{slug}` | `/es/events/{slug}` | `events` | `events/[slug].astro` | `EventDetailPage.astro` | per-slug `.md` |
| PTT Days umbrella | `/pereira-tech-days` | `/en/pereira-tech-days` | `pereiraTechDays` | `pereira-tech-days/index.astro` | `PereiraTechDaysPage.astro` | yes |
| PTT Day edition | `/pereira-tech-days/{year}` | `/es/pereira-tech-days/{year}` | `pereiraTechDays` | `pereira-tech-days/[year].astro` | `PereiraTechDayEditionPage.astro` (wraps in `EditionScope`) | per-year `.md` |
| Speakers catalog | `/speakers` | `/es/speakers` | `speakers` | `speakers/index.astro` | `SpeakersCatalogPage.astro` | yes |
| Speaker profile | `/speakers/{slug}` | `/es/speakers/{slug}` | `speakers` | `speakers/[slug].astro` | `SpeakerProfilePage.astro` | per-slug `.md` |
| ~~Talks catalog~~ | `/talks` → 301 `/meetups` | `/en/talks` → 301 `/en/meetups` | `talks` | `talks/index.astro` (redirect stub) | removed (Task 22) | n/a |
| ~~Talk detail~~ | `/talks/{slug}` → 301 `/meetups` | `/en/talks/{slug}` → 301 `/en/meetups` | `talks` | `talks/[slug].astro` (redirect stub) | removed (Task 22) | n/a |
| Community Calendar (stub) | `/calendar` | `/es/calendar` | static | `calendar.astro` | `CalendarPage.astro` (full GCal hub lands in Tasks 63–70) | pending |
| Allied Communities (stub) | `/communities` | `/es/communities` | static | `communities.astro` | `CommunitiesPage.astro` (full page craft lands in Tasks 71–72) | pending |
| Contributors catalog | `/contributors` | `/en/contributors` | `contributors` | `contributors/index.astro` | `ContributorsPage.astro` (flat organizers + unified alumni) | yes |
| ~~Contributor profile~~ | not shipped | — | — | — | Future; cards are not linked to `/contributors/{slug}` yet | n/a |
| Sponsors catalog | `/sponsors` | `/en/sponsors` | `sponsors` | `sponsors/index.astro` | `SponsorsPage.astro` (current + past; no PTD tier headings) | yes |
| ~~Sponsor profile~~ | not shipped | — | — | — | Future; cards link externally | n/a |
| Channels | `/channels` | `/es/channels` | `channels` | `channels.astro` | `ChannelsPage.astro` | yes |
| Press / Media kit | `/press` | `/es/press` | static | `press.astro` | `PressPage.astro` | yes |
| Contact | `/contact` | `/es/contact` | form | `contact.astro` | `ContactPage.astro` | yes |
| Call for Speakers | `/call-for-speakers` | `/es/call-for-speakers` | form | `call-for-speakers.astro` | `CallForSpeakersPage.astro` | yes |
| Sponsor Us | `/sponsor-us` | `/es/sponsor-us` | form | `sponsor-us.astro` | `SponsorUsPage.astro` | yes |
| Code of Conduct | `/code-of-conduct` | `/es/code-of-conduct` | static | `code-of-conduct.astro` | `CodeOfConductPage.astro` (mirrors `docs/CODE_OF_CONDUCT.md`) | yes |
| Contributing | `/contributing` | `/es/contributing` | static | `contributing.astro` | `ContributingPage.astro` | yes |
| Governance | `/governance` | `/es/governance` | static | `governance.astro` | `GovernancePage.astro` | yes |
| Blog | `/blog` | `/es/blog` | `blog` | `blog/index.astro` | `BlogIndexPage.astro` | `blog/index.md.ts` |
| Blog post | `/blog/{slug}` | `/es/blog/{slug}` | `blog` | `blog/[slug].astro` | `BlogPostPage.astro` | `[slug].md.ts` |
| Series umbrella | `/blog/series` | `/es/blog/series` | `series` | `blog/series/index.astro` | `SeriesIndexPage.astro` | yes |
| Series detail | `/blog/series/{slug}` | `/es/blog/series/{slug}` | `series` | `blog/series/[slug].astro` | `SeriesDetailPage.astro` | per-slug `.md` |
| Tags umbrella | `/blog/tags` | `/es/blog/tags` | `tags` | `blog/tags/index.astro` | `TagsIndexPage.astro` | yes |
| Tag detail | `/blog/tags/{slug}` | `/es/blog/tags/{slug}` | `tags` | `blog/tags/[slug].astro` | `TagDetailPage.astro` | per-slug `.md` |
| Slides catalog | `/slides` | `/es/slides` | `slides` | `slides/index.astro` | `SlidesCatalogPage.astro` | yes |
| Slide detail | `/slides/{slug}` | `/es/slides/{slug}` | `slides` | `slides/[slug].astro` | `SlideDetailPage.astro` | per-slug `.md` |
| 404 | `/404` | `/es/404` | static | `404.astro` | `NotFoundPage.astro` | n/a |

### Internal hub (dev-only, EN-only)

| Route | Purpose |
|---|---|
| `/internal/` | Index of internal sub-sections |
| `/internal/brand/*` | PTT Brand Book (8 sub-pages — Task 1) |
| `/internal/ui/*` | Component showcase (Task 7) |
| `/internal/admin/meetups` | List + JSON inspector for `meetups` collection |
| `/internal/admin/events` | Same for `events` |
| `/internal/admin/pereira-tech-days` | Same for `pereiraTechDays` |
| `/internal/admin/verticals` | Same for `verticals` |
| `/internal/admin/speakers` | Same for `speakers` |
| `/internal/admin/talks` | Same for `talks` |
| `/internal/admin/sponsors` | Same for `sponsors` |
| `/internal/admin/channels` | Same for `channels` |
| `/internal/admin/contributors` | Same for `contributors` |
| `/internal/authors/*` | Authors directory |
| `/internal/guide/*` | Style guides |

All `/internal/*` is excluded from production builds (post-build deletion +
sitemap filter + noindex meta).

### API endpoints

| Route | Purpose |
|---|---|
| `/rss.xml` (EN) · `/es/rss.xml` (ES) | Blog RSS |
| `/sitemap-index.xml`, `/sitemap-0.xml` | Sitemap (auto-generated) |
| `/api/search/{lang}.json` | Language-sharded search index |
| `/llms.txt` | AI agent index |

## 3. Navigation Structure

### Header (primary nav)

Order matters. Translations live in `src/lib/translations/{en,es}.ts`
under `nav.*`.

1. **Comunidad / Community** (mega-dropdown)
   - About Us — `/about-us`
   - Verticals — `/verticals`
   - Contributors — `/contributors`
   - Channels — `/channels`
   - Code of Conduct — `/code-of-conduct`
   - Governance — `/governance`
2. **Encuentros / Gatherings** (dropdown)
   - Meetups — `/meetups`
   - Events — `/events`
   - Pereira Tech Days — `/pereira-tech-days`
3. **Speakers & Slides** (dropdown)
   - Speakers — `/speakers`
   - Slides — `/slides`
   - *(Talks catalog removed in Task 22 — talk history now lives on speaker/meetup detail pages; `/talks` 301-redirects to `/meetups`)*
4. **Blog** — `/blog`
5. **Sponsor Us** — `/sponsor-us` (CTA-styled)

Right-aligned cluster: **Language switcher** · **Theme toggle** ·
**Search**.

Mobile: same items, expanded into a single drawer (`MobileMenu.svelte`)
with disclosure pattern (no `role="menu"` per a11y rule).

### Footer

Three columns + bottom strip.

**Column A — Comunidad / Community**
- About Us
- Verticals
- Contributors
- Channels
- Code of Conduct
- Governance
- Contributing

**Column B — Encuentros / Gatherings**
- Meetups
- Events
- Pereira Tech Days
- Speakers
- Slides

**Column C — Connect**
- Discord, WhatsApp, Telegram, Meetup.com, YouTube, X, LinkedIn,
  Instagram, GitHub, Newsletter signup
- Press / Media Kit
- Contact
- Call for Speakers

**Bottom strip:** copyright · "Made with care in Pereira, Risaralda,
Colombia" · LICENSE link · brand mark · social cluster.

## 4. Canonical Relationships (Cardinality)

> Edges below map directly to fields in the Zod schemas in
> `src/content.config.ts`.

```
authors                        (blog post attribution; legacy)
   ├── many → blog posts (.author = slug)
   └── may overlap with contributors

contributors                   (broader community)
   ├── many roles (organizer, vertical-lead, mentor, speaker, …)
   ├── 0..1 primaryVertical
   └── many social profiles

speakers
   ├── many talks
   └── 0..* PTD editions (via talks → event)

talks
   ├── 1..* speakers
   ├── 0..1 event {meetup | event | pereiraTechDay}
   ├── 0..1 slidesDeck (slug from slides)
   └── 0..1 recording

slides
   ├── 0..1 relatedPost (slug from blog)
   └── 0..1 talk (inverse of talks.slidesDeck)

meetups
   ├── many talks
   ├── many speakers (denormalized)
   ├── many sponsors {slug, tier}
   ├── many verticals
   └── 1 venue + 1 mode

events
   ├── 1 type ∈ {meetup, workshop, hackathon, conference, webinar, pereira-tech-day}
   ├── many sponsors
   ├── many verticals
   └── many related {meetups | pereiraTechDays | talks}

pereiraTechDays                (annual editions)
   ├── exactly 1 brandKit (Task 1 contract)
   ├── many keynotes (speaker slugs)
   ├── many lightningTalks (talk slugs)
   ├── many sponsors
   ├── many organizers (contributor slugs)
   ├── many communities (sister communities)
   └── many gallery items

verticals
   ├── many leaders (contributor slugs)
   ├── many channels (channel slugs)
   └── many meetups (inverse via meetups.verticals)

sponsors
   ├── 1 tier
   ├── many sponsoredEditions {year, tier}
   └── 1 status

channels
   ├── 1 platform
   └── 0..* primaryFor verticals

blog
   ├── 1 author
   ├── 0..1 series + seriesOrder
   ├── 0..1 relatedSlide
   ├── many tags
   └── many keywords
```

## 5. Routing Decisions

1. **Slug source.** Filename without date prefix and without extension.
2. **Slug language.** Always English. Both EN and ES versions of a post,
   meetup, talk, etc. use the **same** English slug.
3. **Year-based routes** (`/pereira-tech-days/{year}`) use the year as the
   slug; the `pereiraTechDays` collection schema requires `year` ∈
   `2017..2100`.
4. **Discriminated unions for events.** When `events.type ===
   'pereira-tech-day'`, the `events` entry is a thin pointer (title,
   date, hero) and the canonical content lives in `pereiraTechDays`.
5. **Language fallback.** When a content entry has only EN or only ES,
   the missing language route renders a "translation pending" notice
   plus a link to the available language. We never silently render the
   other language.
6. **Catalog routes.** Listings (`/blog`, `/meetups`, `/events`, etc.)
   sort by `date desc` and are paginated when entries exceed 24.
7. **Search.** Each catalog can be filtered by tags, vertical, year,
   speaker, sponsor (where applicable). The combined search index
   (`/api/search/{lang}.json`) covers blog, meetups, events,
   pereiraTechDays, speakers, talks, slides, contributors, sponsors.

## 6. Middleware Allowlist Diff

`src/middleware.ts` enforces a hardcoded allowlist of top-level paths so
SEO sees a clean 404 for anything truly missing. The v3.0.0 diff adds:

```ts
// Add to KNOWN_ROOT_PATHS (and mirror in KNOWN_EN_PATHS):
'/about-us',
'/community',
'/verticals',
'/meetups',
'/events',
'/pereira-tech-days',
'/speakers',
'/talks',       // redirect stub only (Task 22) — 301s to /meetups
'/calendar',    // Task 26
'/communities', // Task 26 — allied communities stub
'/slides',
'/contributors',
'/sponsors',
'/channels',
'/press',
'/contact',
'/call-for-speakers',
'/sponsor-us',
'/code-of-conduct',
'/contributing',
'/governance',
'/blog',
'/blog/series',
'/blog/tags',
```

Multi-segment paths beneath these (e.g.
`/pereira-tech-days/2024/lightning-talks`, `/blog/series/{slug}`) bypass
the rule by virtue of containing a second segment, so they don't need
to be allowlisted explicitly.

Path-with-`.` (e.g. `/rss.xml`, `/sitemap-0.xml`, `/llms.txt`) also
bypass the rule.

## 7. Breadcrumb Taxonomy

Breadcrumbs are derived programmatically from the route. Examples:

- `/blog/series/the-library-of-tomorrow` → `Home › Blog › Series › The Library of Tomorrow`
- `/pereira-tech-days/2024` → `Home › Pereira Tech Days › 2024`
- `/speakers/jane-doe` → `Home › Speakers › Jane Doe`
- `/sponsors/example-corp` → `Home › Sponsors › Example Corp`

Breadcrumb labels are localized per language (`Inicio › …` in Spanish).
The component is `Breadcrumbs.svelte`/`.astro` (Task 7).

## 8. Sitemap & SEO

- **Sitemap** is auto-generated by `@astrojs/sitemap`. The plugin
  excludes `/internal/*` paths and `/llms.txt`.
- **hreflang** alternates: every page emits `<link rel="alternate">`
  for `en` and `es-co` (and `x-default` set to `es-co` because Spanish
  is primary).
- **Canonical** points to the same-language version of the route.
- **Organization JSON-LD** ships globally (Task 18) describing
  Pereira Tech Talks. **Event JSON-LD** ships per meetup, event, and
  PTD edition. **Person JSON-LD** ships per speaker and contributor.

## 9. AEO (Markdown for Agents)

Every public page MUST have a corresponding `.md` endpoint generated
from `src/content/pages/{en,es}/*.md` or from a per-slug `.md.ts`
generator. The `pnpm run md:check` script enforces parity. AI agents
fetch `<page-url>.md` to read content directly.

## 10. Pending Decisions

- **Newsletter platform** (Task 15) — Resend contact list / Buttondown / Mailchimp.
- **Forms backend** — Cloudflare Pages Functions + **Dailybot Forms** (system of record); optional Resend ack. See [FORMS.md](./features/FORMS.md).
- **PTD 2026 brand kit** (Task 17 step 6) — placeholder uses global PTT
  brand until the design lands.
- **Press kit downloads** — final asset list pending brand source files.

---

**Owner:** Architecture lead (Task 3).
**Consumed by:** Tasks 4–22 (all page implementations, schemas, i18n,
SEO, sitemap, search, middleware allowlist).
