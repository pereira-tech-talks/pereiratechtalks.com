# Sponsors — Feature Guide

Community partners directory at `/sponsors` (EN: `/en/sponsors`) plus one
**partner profile** per sponsor at `/sponsors/{slug}` (EN: `/en/sponsors/{slug}`).

## Page IA — directory (`/sponsors`)

1. **Hero** — partnership framing + dual CTAs (`/sponsor-us`, `/contact`)
2. **Why sponsor** — three concrete value props
3. **Current sponsors** — cards for `status: active` (logo + name + description + `View sponsored meetups →` / `Website ↗`)
4. **Past sponsors** — compact logo tiles for `status: past` (smaller logos, denser grid, profile link only) so current sponsors keep hierarchy

The directory carries **no counters** — no aggregate strip, no per-card numbers.
It stays a scannable wall of logos whose job is to get you to a profile; the
sponsorship numbers live there, where they have context. Both sections use the
same single label (`View sponsored meetups` / `Ver meetups patrocinados`) — it
names the reason to click, which a neutral "view profile" does not.

## Vocabulary

Say **sponsor / patrocinador**, never *partner / aliado*, anywhere in this
domain — UI labels, sponsor YAML descriptions, `/sponsor-us` tiers, and the
agent Markdown endpoints. *Aliado* stays reserved for **allied communities**
(`/communities` — PereiraJS, Python Pereira, …), which are a different
relationship and are not sponsors.

**Per-edition tiers** (diamond/gold/silver/bronze/community) belong on **Pereira Tech Day** edition pages via `getEditionSponsors` — not on this catalog.

## Page IA — partner profile (`/sponsors/{slug}`)

1. **Header** — logo panel, status badge (current/past), "backing the community since {year}", description, `Visit website ↗` + `All sponsors`
2. **Stat tiles** — sponsored meetups · PTD editions · talks enabled · speakers on stage (each tile rendered only when > 0)
3. **Upcoming sponsored meetups** — `MeetupCard` grid, rendered only when the partner backs a future meetup
4. **Sponsored meetups** — archive grouped by year (descending), newest year first
5. **Pereira Tech Day editions** — `EditionCard` per sponsored year with the per-edition tier badge
6. **Empty state** — logo-only partners with nothing linked yet
7. **Sponsorship CTA** — `/sponsor-us` + `/contact`

`Organization` JSON-LD is emitted per profile, with up to 20 sponsored meetups as `subjectOf` events.

## Link topology

- Sponsor card → partner profile (primary, internal); sponsor website is a separate, explicitly marked external link
- Meetup detail → sponsor tiles link to the partner profile (reciprocal loop `meetup ↔ sponsor`)
- PTD `PtdSponsorsShowcase` keeps its **outbound** logo links — those are a paid edition deliverable and are deliberately untouched

## Content

YAML in `src/content/sponsors/{slug}.yaml`:

| Field | Notes |
|-------|--------|
| `status` | `active` \| `past` — drives community page sections |
| `tier` | Kept for PTD; **not** shown as section headings on `/sponsors` |
| `sponsoredEditions` | `{ year, tier }[]` — **fallback only**, for PTD years without an entry in the `pereiraTechDays` collection |
| `order` | Sort within current/past |

**Sponsorship history is derived, never hand-written.** The source of truth is the
event side of the graph — `meetups[].sponsors[]` and `pereiraTechDays[].sponsors[]`.
To make a sponsor show up on a meetup, add the `{ slug, tier }` ref to that
meetup's frontmatter; the profile page, counters, and agent Markdown all follow
automatically.

## Components

- `SponsorsPage.astro` — community catalog + impact strip
- `SponsorDetailPage.astro` — partner profile (`/sponsors/{slug}`)
- `SponsorCard.astro` — `showTier={false}` on community page; `muted` for past compact tiles; optional `activity` prop drives the counters
- `src/lib/sponsor.ts`:
  - `getActiveSponsors` / `getPastSponsors` sort by order; `sortSponsors` still tier-aware for PTD
  - `getSponsorBySlug`, `getMeetupsBySponsor`
  - `buildSponsorActivity(slug, meetups, editions, sponsoredEditions, today)` — pure, unit-tested resolver
  - `getSponsorActivity(sponsor)` — single profile; `getSponsorActivityMap(sponsors)` — one pass for the whole grid
  - `SPONSOR_TIER_LABELS` — shared singular tier names (plural section headings stay in i18n)

## Routes

| Route | File |
|-------|------|
| `/sponsors/{slug}` | `src/pages/sponsors/[slug].astro` |
| `/en/sponsors/{slug}` | `src/pages/en/sponsors/[slug].astro` |
| `/sponsors/{slug}.md` | `src/pages/sponsors/[slug].md.ts` |
| `/en/sponsors/{slug}.md` | `src/pages/en/sponsors/[slug].md.ts` |

`sponsors` is already in the middleware allowlist; nested paths bypass the
single-segment rule, so no `src/middleware.ts` change is needed.

## Adding a partner

1. Add YAML + logos under `public/images/sponsors/`
2. Set `status: active` or `past`
3. Keep slug stable if referenced from PTD editions
4. Prefer a dedicated dark-mode logo (`logo.dark`) — white ink on transparent for monochrome wordmarks

### Dark-mode logos (white ink)

For charcoal/black wordmarks on transparent backgrounds (GitHub, Gorilla Logic):

```bash
node scripts/generate-sponsor-dark-logos.mjs
node scripts/generate-sponsor-dark-logos.mjs --only github
node scripts/generate-sponsor-dark-logos.mjs --src public/images/sponsors/foo.png --out public/images/sponsors/foo-dark.png
```

For brand marks that must keep accent colors, use the dedicated generators instead:

```bash
node scripts/generate-ase-utp-dark-logo.mjs
node scripts/generate-made-for-germany-dark-logo.mjs
node scripts/generate-aumentada-logos.mjs
node scripts/generate-codely-logos.mjs
node scripts/generate-factored-logos.mjs
node scripts/generate-rocka-logos.mjs
node scripts/generate-unity-logos.mjs
```


## Related

- `/sponsor-us` inquiry form
- `docs/SPONSORSHIP.md` — commercial tiers & process
