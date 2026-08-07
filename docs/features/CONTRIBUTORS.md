# Contributors (Equipo) — Feature Guide

The `/contributors` page is the public **Team** directory for Pereira Tech Talks (nav label: Equipo / Team).

## Routes

| Lang | URL |
|------|-----|
| ES (primary) | `/contributors` |
| EN | `/en/contributors` |

Page component: `src/components/pages/ContributorsPage.astro`  
Card: `src/components/cards/ContributorCard.astro`  
Helpers: `src/lib/contributor.ts`

## Content

YAML entries in `src/content/contributors/{slug}.yaml` (schema in `src/content.config.ts`).

| Field | Notes |
|-------|--------|
| `roles` | Enum includes `organizer`, `alumni`, `contributor`, `mentor`, `founding-organizer`, etc. |
| `inactiveSince` | If set → person appears in the **past** section |
| `role` / `bio` | Localized `{ en, es }` display strings |
| `order` | Sort key within a section |

**UI IA (v3 Equipo redesign):**

1. **Equipo organizador** — active people with `organizer` (or legacy `founding-organizer`) — **one flat grid** (no founder/mentor/contributor subsections).
2. **Alumni y organizadores anteriores** — everyone with `inactiveSince` — **one flat grid**.

The Zod enum may still allow `mentor` / `founding-organizer`, but the page does **not** segment those roles into separate sections.

## Adding someone

1. Add `src/content/contributors/{english-slug}.yaml` + avatar under `public/images/contributors/`.
2. For current organizers: `roles: [organizer]`, omit `inactiveSince`.
3. For past / alumni: set `inactiveSince` and usually include `alumni`.
4. Keep **slugs stable** — PTD editions reference them via `getContributorsBySlugs`.

## Related

- PTD team grids reuse `getContributorsBySlugs`
- Authors collection is separate (`docs/features/AUTHORS.md`)
- Agent markdown: `/contributors/index.md` (and `/en/...`)
