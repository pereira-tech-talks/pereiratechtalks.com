---
name: add-meetup
description: Create a new Pereira Tech Talks monthly meetup entry (single bilingual file) with optional linked talks, speakers, and sponsors. Use proactively when adding new or historical meetups.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
argument-hint: "[title, date, venue, mode, vertical, optional talks/speakers]"
# === Documentation (ignored by tools, useful for humans) ===
tier: 2
intent: create
max-files: 4
max-loc: 600
---

# Skill: Add Meetup

## Objective

Create a new entry in the `meetups` content collection for Pereira Tech Talks v3.0.0. A meetup represents a single monthly community gathering (in-person, virtual, or hybrid). Each meetup is one bilingual Markdown file that drives the `/meetups/<slug>` and `/es/meetups/<slug>` pages plus the AEO Markdown twins.

## Mandatory Invocation Policy (CRITICAL)

This skill is the mandatory workflow for creating new meetup entries in this repository.

- All AI agents and assistants MUST use `/add-meetup` when creating new files in `src/content/meetups/`.
- Do NOT create new meetup files manually unless the user explicitly requests bypassing the skill.
- The file is bilingual via `i18nString` fields — there is only one file per meetup, not one per language.
- If creation starts outside this skill, stop and switch to `/add-meetup` before writing files.

## Non-Goals

- Does NOT create or modify schemas (`src/content.config.ts`)
- Does NOT create new tags or verticals (they must already exist in `src/content/tags/` and `src/content/verticals/`)
- Does NOT create speakers, talks, or sponsors — those use their own collections and must exist beforehand if referenced
- Does NOT optimize images (use `/optimize-image` or `pnpm run images:optimize`)
- Does NOT create Pereira Tech Day entries (use `/add-ptd-edition`)

## Tier Classification

**Tier: 2** — Standard. Bilingual frontmatter, schema-aware field selection, optional references to other collections.

## Inputs

### Required

- `$TITLE`: Meetup title (will be stored bilingually). The skill will translate it.
- `$DATE`: ISO date `YYYY-MM-DD` of the event.
- `$VENUE`: Venue object — `{ name, city, country }`. Default city/country to `Pereira`/`Colombia` if not provided.
- `$MODE`: `in-person` | `virtual` | `hybrid` (default: `in-person`)
- `$VERTICAL`: One or more slugs from `src/content/verticals/` (default: `["monthly-meetups"]`)

### Optional

- `$SLUG`: Custom slug (default: kebab-case of title, **English-only**).
- `$DESCRIPTION`: 130-160 char description. If omitted, the skill drafts one from the title and date.
- `$HERO_IMAGE`: Path under `public/images/meetups/<slug>/hero.{ext}`.
- `$STATUS`: `announced` | `scheduled` | `completed` | `cancelled` (default inferred from date).
- `$TALKS`: Array of talk slugs (must exist in `src/content/talks/`).
- `$SPEAKERS`: Array of speaker slugs (must exist in `src/content/speakers/`).
- `$SPONSORS`: Array of sponsor refs.
- `$LINK_MEETUP_COM`: Original Meetup.com URL (for historical migrations).
- `$LINK_RECORDING`: YouTube/Twitch URL (for completed meetups with recordings).

## Reference Documentation

- **[Content Collections schema](../../../src/content.config.ts)** — Source of truth for the `meetups` schema (lines 276-308).
- **[Architecture Guide](../../../docs/ARCHITECTURE.md)** — Project structure and content lifecycle.
- **[Verticals catalog](../../../src/content/verticals/)** — Existing vertical slugs.

## Quick Reference

**File naming:** `YYYY-MM-DD_{slug}.md` in `src/content/meetups/` (single file, bilingual fields).

**URL surface:** `/meetups/<slug>` (EN) and `/es/meetups/<slug>` (ES).

**Slugs:** English-only, even for Spanish-primary content.

**Images:** Stored in `public/images/meetups/<slug>/`. Hero: `hero.{ext}`.

**Status semantics:**

- `announced`: Date set, registration not yet open or in-progress.
- `scheduled`: Confirmed, registration open.
- `completed`: Past event with recap / photos / recording.
- `cancelled`: Cancelled.

### Frontmatter Template

```yaml
---
title:
  en: "Pereira Mobile Night 2026"
  es: "Noche Mobile Pereira 2026"
description:
  en: "Cross-platform mobile engineering with Flutter, React Native, and iOS/Android native stacks. Open to all levels — bring your laptop."
  es: "Ingeniería móvil multiplataforma con Flutter, React Native y stacks nativos iOS/Android. Abierto a todos los niveles — trae tu laptop."
pubDate: 2026-04-17
date: 2026-04-17
venue:
  name: "Hub Innovación UTP"
  city: "Pereira"
  country: "Colombia"
mode: in-person
hero:
  src: "/images/meetups/pereira-mobile-night-2026/hero.webp"
  alt:
    en: "Pereira Mobile Night 2026"
    es: "Noche Mobile Pereira 2026"
  layout: banner
heroImage: "/images/meetups/pereira-mobile-night-2026/hero.webp"
verticals:
  - monthly-meetups
talks:
  - pereira-mobile-night-2026--1-flutter-state-management
speakers:
  - juan-jose-cardona
sponsors: []
status: scheduled
draft: false
---
```

Body content is freeform Markdown (program description, schedule, callouts). Keep it bilingual by interleaving short EN and ES sections, or by writing a primary-language body with a `Summary in English` / `Resumen en español` companion section — see the existing meetup files for established patterns.

## Steps

### Step 1: Parse Input and Validate References

1. Detect / generate the English slug from `$TITLE` (or use `$SLUG`).
2. Validate the slug is unique under `src/content/meetups/` (filename includes the date prefix).
3. Validate each `$VERTICAL` exists in `src/content/verticals/`.
4. Validate each `$TALK` exists in `src/content/talks/`.
5. Validate each `$SPEAKER` exists in `src/content/speakers/`.
6. Validate each `$SPONSOR` exists in `src/content/sponsors/`.

```bash
ls src/content/verticals/
ls src/content/talks/
ls src/content/speakers/
ls src/content/sponsors/
ls src/content/meetups/ | grep "$DATE" || true
```

### Step 2: Generate the Bilingual File

Create `src/content/meetups/YYYY-MM-DD_{slug}.md` using the frontmatter template. Translate the title and description into Spanish (informal-professional tuteo). Always include both `en` and `es` keys for `title`, `description`, and `hero.alt`.

**Body** — write a short program description in the primary language (typically Spanish for local meetups), followed by a `### Summary in English` / `### Resumen en español` block summarising the key points in the other language.

### Step 3: Image Setup (Optional but Recommended)

1. If `$HERO_IMAGE` is provided, verify the file exists at `public/images/meetups/<slug>/hero.{ext}`.
2. If the file is missing, instruct the user to drop the source into `public/images/_staging/` and run `pnpm run images:optimize` (or invoke `/optimize-image`).
3. Hero alt text MUST be present in both `en` and `es`.

### Step 4: Validate

```bash
pnpm run biome:check
pnpm run astro:check
pnpm run build
pnpm run md:check:strict
```

The build should pick up the new meetup automatically and emit `/meetups/<slug>/` and `/meetups/<slug>.md` (plus `/es/...` twins).

## Output Format

```
## Meetup Created

### File
- `src/content/meetups/YYYY-MM-DD_{slug}.md`

### URLs
- English: `/meetups/{slug}/` (+ `.md`)
- Spanish: `/es/meetups/{slug}/` (+ `.md`)

### Details
- **Title (EN):** {title.en}
- **Title (ES):** {title.es}
- **Date:** {date}
- **Mode:** {mode}
- **Venue:** {venue.name} ({venue.city}, {venue.country})
- **Verticals:** {verticals}
- **Status:** {status}
- **Talks linked:** {talks.length}
- **Speakers linked:** {speakers.length}

### Build: Passing

### Commit Message
content: add meetup "{title.en}"
```

## Guardrails

### Scope Limits

- **Maximum files:** 4 (1 meetup file + up to 3 supporting assets like a hero image already optimised).
- **Maximum LOC:** 600 (frontmatter + body combined).
- **Allowed directories:** `src/content/meetups/`, `public/images/meetups/`.
- **Forbidden directories:** `src/content/talks/`, `src/content/speakers/`, `src/content/sponsors/`, `src/content/verticals/`, `src/pages/`, `src/components/`.

### Safety Checks

- [ ] Slug is unique under `src/content/meetups/`.
- [ ] Slug is English-only (no Spanish slugs).
- [ ] All `verticals`, `talks`, `speakers`, `sponsors` references resolve.
- [ ] `title`, `description`, and `hero.alt` have both `en` and `es` keys.
- [ ] `description` is 130-160 characters per language.
- [ ] Spanish has correct diacritical marks (ñ, accents).
- [ ] `pnpm run build` passes.

### Stop Conditions

**Stop and ask** if:

- A referenced talk/speaker/vertical/sponsor does not exist (do not auto-create — use their own skills).
- The hero image does not exist and the user has not approved a placeholder.
- The slug conflicts with an existing meetup on the same date.

## Definition of Done

- [ ] File created at `src/content/meetups/YYYY-MM-DD_{slug}.md`
- [ ] Both EN and ES content populated (frontmatter + body)
- [ ] All references resolve to existing collection entries
- [ ] `pnpm run biome:check` passes
- [ ] `pnpm run astro:check` passes
- [ ] `pnpm run build` succeeds
- [ ] `pnpm run md:check:strict` passes (AEO twin generated automatically)
- [ ] Spanish orthography verified (no `pequeno`, `codigo`, `tamano`, etc.)

## Related

- [`add-event`](../add-event/SKILL.md) — Workshops, hackathons, conferences (non-meetup formats).
- [`add-ptd-edition`](../add-ptd-edition/SKILL.md) — Pereira Tech Day annual conference editions.
- [`optimize-image`](../optimize-image/SKILL.md) — Hero image optimisation.
- [`translate-sync`](../translate-sync/SKILL.md) — Sync EN/ES quality.

## Changelog

| Version | Date       | Changes |
| ------- | ---------- | ------- |
| 1.0.0   | 2026-06-01 | Initial skill: bilingual meetup creation with vertical/talk/speaker/sponsor references and AEO twin auto-generation via build. |
