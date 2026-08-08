---
name: add-ptd-edition
description: Create a new Pereira Tech Day (PTD) annual edition entry with full schedule, keynotes, organizers, sponsors, and per-edition brand kit. Use proactively when announcing or archiving a Pereira Tech Day.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
argument-hint: "[year, tagline, date, venue, theme, brand colors]"
# === Documentation (ignored by tools, useful for humans) ===
tier: 3
intent: create
max-files: 5
max-loc: 1200
---

# Skill: Add Pereira Tech Day Edition

## Objective

Create a new entry in the `pereiraTechDays` content collection for Pereira Tech Talks v3.0.0. A PTD edition represents the annual flagship conference (one per year), with full schedule, keynotes, lightning talks, organizers, sponsors, communities, gallery, and per-edition brand kit.

## Mandatory Invocation Policy (CRITICAL)

This skill is the mandatory workflow for creating new entries in `src/content/pereiraTechDays/`.

- All AI agents and assistants MUST use `/add-ptd-edition` when creating new files in `src/content/pereiraTechDays/`.
- Do NOT create PTD entries manually unless the user explicitly requests bypassing the skill.
- One file per edition (per year). The filename is `<year>.yaml` (e.g., `2026.yaml`).
- The file is bilingual via `i18nString` fields.

## Non-Goals

- Does NOT create or modify schemas (`src/content.config.ts`).
- Does NOT create speakers, talks, sponsors, or organizers — those collections must already contain the referenced slugs.
- Does NOT generate brand asset files (logos, color swatches) — only references the kit metadata.
- Does NOT replace `/add-meetup` (monthly meetups) or `/add-event` (workshops/hackathons).
- Does NOT optimize images (use `/optimize-image`).

## Tier Classification

**Tier: 3** — Complex. PTD entries are the most data-rich entries on the site: schedule arrays, multiple bilingual fields, brand kit overrides, and many cross-collection references. Plan the schedule carefully before scaffolding.

## Inputs

### Required

- `$YEAR`: Edition year as integer between 2017 and 2100. Used as the filename and URL slug.
- `$TITLE`: Edition title (bilingual).
- `$TAGLINE`: Short editorial tagline (bilingual).
- `$DESCRIPTION`: 130-160 char description (bilingual).
- `$DATE`: Single date `YYYY-MM-DD` or object `{ start, end }` for multi-day editions.
- `$VENUE`: `{ name, city, country }` (default city/country to `Pereira`/`Colombia`).
- `$MODE`: `in-person` | `virtual` | `hybrid` (default: `in-person`).
- `$HERO_IMAGE`: Path under `public/images/pereiraTechDays/<year>/hero.{ext}`.
- `$BRAND_KIT`: Object describing per-edition palette and typography (see Brand Kit Template below).

### Optional

- `$SCHEDULE`: Array of session objects (time, talkSlug?, title?, type).
- `$KEYNOTES`: Array of talk slugs (must exist in `src/content/talks/`).
- `$LIGHTNING_TALKS`: Array of talk slugs.
- `$SPONSORS`: Sponsor refs.
- `$ORGANIZERS`: Array of contributor slugs (must exist in `src/content/contributors/`).
- `$COMMUNITIES`: Allied communities `[{ name, logo, url? }]`.
- `$GALLERY`: Array of `{ src, alt, caption }` for completed editions.
- `$LINK_MEETUP_COM`: Original announcement URL.
- `$LINK_RECORDING`: Recording compilation URL.
- `$STATUS`: `announced` | `scheduled` | `completed` | `cancelled` (default inferred).

## Reference Documentation

- **[Content Collections schema](../../../src/content.config.ts)** — `pereiraTechDays` collection (lines 352-423) and `editionBrandKit` definition above.
- **[Brand Guide](../../../docs/BRAND_GUIDE.md)** — Global PTT palette and per-edition override rules.
- **[Architecture Guide](../../../docs/ARCHITECTURE.md)**.

## Quick Reference

**File naming:** `<year>.yaml` in `src/content/pereiraTechDays/` (e.g., `2026.yaml`).

**URL surface:** `/pereira-tech-days/<year>` (EN) and `/es/pereira-tech-days/<year>` (ES).

**Slugs (talk/speaker/contributor refs):** English-only, always.

**Images:** `public/images/pereiraTechDays/<year>/`. Hero: `hero.{ext}`. Gallery: any naming convention you like.

**Brand kit:** Each PTD has its own palette that overrides the global PTT colors **only within that edition's page**. Never modify `src/styles/global.css` from this skill.

### Brand Kit Template

```yaml
brandKit:
  name:
    en: "PTD 2026 — Bilingual Futures"
    es: "PTD 2026 — Futuros Bilingües"
  palette:
    primary: "#0E5E60"      # Deep teal accent
    secondary: "#F5C25B"    # Warm yellow CTA
    surface: "#0B1A1F"      # Dark surface
    onSurface: "#F5F1EA"    # Light text on dark surfaces
  typography:
    display: "Inter Tight"
    body: "Inter"
```

### Frontmatter Template

```yaml
year: 2026
title:
  en: "Pereira Tech Day 2026"
  es: "Pereira Tech Day 2026"
tagline:
  en: "Bilingual futures, built locally"
  es: "Futuros bilingües, construidos en local"
description:
  en: "The 7th edition of Pereira Tech Day — one day, two languages, keynote talks, lightning talks, and the technical community of the coffee region."
  es: "La 7.ª edición de Pereira Tech Day — un día, dos idiomas, charlas magistrales, lightning talks y la comunidad técnica del Eje Cafetero."
date:
  start: 2026-10-17
  end: 2026-10-18
venue:
  name: "Centro de Convenciones Expofuturo"
  city: "Pereira"
  country: "Colombia"
mode: hybrid
hero:
  src: "/images/pereiraTechDays/2026/hero.webp"
  alt:
    en: "Pereira Tech Day 2026 banner"
    es: "Banner de Pereira Tech Day 2026"
  layout: banner
brandKit:
  name:
    en: "PTD 2026"
    es: "PTD 2026"
  palette:
    primary: "#0E5E60"
    secondary: "#F5C25B"
    surface: "#0B1A1F"
    onSurface: "#F5F1EA"
  typography:
    display: "Inter Tight"
    body: "Inter"
schedule:
  - time: "09:00"
    type: open-doors
    title:
      en: "Doors open & coffee"
      es: "Apertura de puertas y café"
  - time: "09:30"
    type: keynote
    talkSlug: "ptd-2026--keynote-bilingual-futures"
  - time: "10:30"
    type: lightning
    talkSlug: "ptd-2026--lightning-edge-rust"
  - time: "12:00"
    type: break
    title:
      en: "Lunch"
      es: "Almuerzo"
  - time: "17:30"
    type: closing
    title:
      en: "Closing words & after-party"
      es: "Cierre y after-party"
keynotes:
  - ptd-2026--keynote-bilingual-futures
lightningTalks:
  - ptd-2026--lightning-edge-rust
organizers:
  - sergio-florez
  - mayra-valentina-velasquez
communities:
  - name: "PyLadies Bogotá"
    logo: "/images/communities/pyladies-bogota.svg"
    url: "https://pyladies.com/locations/Colombia/"
sponsors: []
gallery: []
status: announced
draft: false
```

## Steps

### Step 1: Verify the Year Slot Is Free

```bash
ls src/content/pereiraTechDays/
```

The year file must not already exist. If editing an existing edition, use `doc-edit` instead.

### Step 2: Validate All References

```bash
ls src/content/talks/ | head -20
ls src/content/contributors/
ls src/content/sponsors/
```

Every talk slug in `keynotes`, `lightningTalks`, and `schedule[*].talkSlug` MUST exist under `src/content/talks/`. Every contributor slug in `organizers` MUST exist under `src/content/contributors/`. Every sponsor ref MUST exist under `src/content/sponsors/`.

### Step 3: Design the Brand Kit

1. Choose 4 hex colors (`primary`, `secondary`, `surface`, `onSurface`) that **maintain WCAG AA contrast** against each other (4.5:1 for body text on surface).
2. Pick `display` and `body` typography names — prefer fonts already loaded by the site to avoid extra payload.
3. Provide the edition name in both `en` and `es` (often the same string, but allow translation).

### Step 4: Compose the Schedule

1. Use 24-hour `HH:MM` strings for `time`.
2. For sessions tied to a talk, set `talkSlug` and omit `title` (the page renders the talk's bilingual title).
3. For breaks, doors, and closing, set `title.en` / `title.es` and pick a non-talk `type`.
4. Keep the schedule in chronological order — the renderer relies on array order.

### Step 5: Generate the File

Create `src/content/pereiraTechDays/<year>.yaml` using the template above. Ensure every bilingual field has both `en` and `es` keys.

### Step 6: Image Setup

1. Hero: `public/images/pereiraTechDays/<year>/hero.webp`.
2. Gallery items: drop sources in `public/images/_staging/pereira-tech-days-<year>/` and run `pnpm run images:optimize`.

### Step 7: Validate

```bash
pnpm run biome:check
pnpm run astro:check
pnpm run build
pnpm run md:check:strict
```

Open `dist/pereira-tech-days/<year>/index.html` in a browser preview to spot-check the brand kit rendering.

## Output Format

```
## Pereira Tech Day Edition Created

### File
- `src/content/pereiraTechDays/<year>.yaml`

### URLs
- English: `/pereira-tech-days/<year>/` (+ `.md`)
- Spanish: `/es/pereira-tech-days/<year>/` (+ `.md`)

### Details
- **Year:** {year}
- **Title (EN):** {title.en}
- **Tagline (EN/ES):** {tagline.en} / {tagline.es}
- **Date:** {date}
- **Venue:** {venue.name} ({venue.city}, {venue.country})
- **Mode:** {mode}
- **Brand Kit:** {brandKit.palette.primary} / {brandKit.palette.secondary}
- **Schedule items:** {schedule.length}
- **Keynotes:** {keynotes.length}
- **Lightning talks:** {lightningTalks.length}
- **Organizers:** {organizers.length}
- **Status:** {status}

### Build: Passing

### Commit Message
content: add Pereira Tech Day {year} edition
```

## Guardrails

### Scope Limits

- **Maximum files:** 5 (1 edition YAML + up to 4 supporting assets like hero + gallery placeholders).
- **Maximum LOC:** 1200 (very large frontmatter is allowed — the schedule and references can be long).
- **Allowed directories:** `src/content/pereiraTechDays/`, `public/images/pereiraTechDays/`, `public/images/communities/`.
- **Forbidden directories:** `src/content/talks/`, `src/content/contributors/`, `src/content/sponsors/`, `src/styles/`, `src/pages/`, `src/components/`.

### Safety Checks

- [ ] `<year>.yaml` does not already exist.
- [ ] Year is between 2017 and the current calendar year + 2.
- [ ] All `keynotes`, `lightningTalks`, `schedule[*].talkSlug` references resolve to existing talk slugs.
- [ ] All `organizers` resolve to existing contributor slugs.
- [ ] All `sponsors` resolve to existing sponsor slugs.
- [ ] `title`, `tagline`, `description`, `hero.alt`, `brandKit.name` are bilingual.
- [ ] `brandKit.palette` has all 4 required keys.
- [ ] Brand kit colors pass a quick WCAG AA contrast sanity check.
- [ ] Spanish text has correct diacritical marks.
- [ ] `pnpm run build` passes.

### Stop Conditions

**Stop and ask** if:

- A referenced talk/contributor/sponsor does not exist (do not auto-create).
- The year slot is already occupied (suggest `doc-edit` instead).
- The user cannot provide a complete brand kit (4 colors + 2 typography names).
- The hero image is missing.
- The proposed brand kit fails contrast — surface this and ask for adjusted colors before writing the file.

## Definition of Done

- [ ] File created at `src/content/pereiraTechDays/<year>.yaml`
- [ ] All bilingual fields populated
- [ ] All cross-collection references validated
- [ ] Schedule is chronological and complete (open-doors → closing)
- [ ] Brand kit defined and contrast-checked
- [ ] `pnpm run biome:check`, `astro:check`, `build`, `md:check:strict` all pass
- [ ] Spanish orthography verified (no `pequeno`, `codigo`, etc.)

## Escalation Conditions

**Escalate** if:

- The edition introduces a new schedule item type (e.g., `unconference`) — schema update required.
- The brand kit must extend the schema (e.g., adding gradient stops).
- The PTD page needs a custom component beyond what `PereiraTechDayDetailPage.astro` already renders.
- Multiple editions need to be created or updated as a batch — plan with `architect` first.

## Related

- [`add-meetup`](../add-meetup/SKILL.md) — Monthly community meetups.
- [`add-event`](../add-event/SKILL.md) — Workshops, hackathons, conferences (non-PTD).
- [`optimize-image`](../optimize-image/SKILL.md) — Hero and gallery image optimisation.
- [`audit-post`](../audit-post/SKILL.md) — Pre-publication QA flow (adapt for PTD pages).

## Changelog

| Version | Date       | Changes |
| ------- | ---------- | ------- |
| 1.0.0   | 2026-06-01 | Initial skill: full PTD edition creation including schedule, keynotes, brand kit, organizers, sponsors, and bilingual fields. |
