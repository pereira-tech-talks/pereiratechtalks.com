# Sponsors — Feature Guide

Community partners directory at `/sponsors` (EN: `/en/sponsors`).

## Page IA

1. **Hero** — partnership framing + dual CTAs (`/sponsor-us`, `/contact`)
2. **Why sponsor** — three concrete value props
3. **Current partners** — flat grid of `status: active` (no PTD tier headings)
4. **Past partners** — flat grid of `status: past`

**Per-edition tiers** (diamond/gold/silver/bronze/community) belong on **Pereira Tech Day** edition pages via `sponsoredEditions` / `getEditionSponsors` — not on this catalog.

## Content

YAML in `src/content/sponsors/{slug}.yaml`:

| Field | Notes |
|-------|--------|
| `status` | `active` \| `past` — drives community page sections |
| `tier` | Kept for PTD; **not** shown as section headings on `/sponsors` |
| `sponsoredEditions` | `{ year, tier }[]` for edition showcases |
| `order` | Sort within current/past |

## Components

- `SponsorsPage.astro` — community catalog
- `SponsorCard.astro` — `showTier={false}` on community page
- `src/lib/sponsor.ts` — `getActiveSponsors` / `getPastSponsors` sort by order; `sortSponsors` still tier-aware for PTD

## Adding a partner

1. Add YAML + logos under `public/images/sponsors/`
2. Set `status: active` or `past`
3. Keep slug stable if referenced from PTD editions

## Related

- `/sponsor-us` inquiry form
- `docs/SPONSORSHIP.md` — commercial tiers & process
