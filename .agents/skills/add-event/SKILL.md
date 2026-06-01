---
name: add-event
description: Create a non-meetup event entry — workshop, hackathon, conference, or webinar — in the events collection. Use proactively when adding workshops, hackathons, or external community events to the site.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
argument-hint: "[title, type, date, location, optional related meetup/talk slugs]"
# === Documentation (ignored by tools, useful for humans) ===
tier: 2
intent: create
max-files: 3
max-loc: 500
---

# Skill: Add Event

## Objective

Create a new entry in the `events` content collection for Pereira Tech Talks v3.0.0. The `events` collection covers any non-monthly-meetup format: workshops, hackathons, conferences, webinars, or `pereira-tech-day` references.

> **Heuristic — which collection?**
>
> - Monthly community gathering → `meetups` (use `/add-meetup`).
> - Annual flagship conference (PTD) → `pereiraTechDays` (use `/add-ptd-edition`).
> - Workshop / hackathon / webinar / external conference → `events` (this skill).

## Mandatory Invocation Policy (CRITICAL)

This skill is the mandatory workflow for creating new entries in `src/content/events/`.

- All AI agents and assistants MUST use `/add-event` when creating new files in `src/content/events/`.
- Do NOT create new event files manually unless the user explicitly requests bypassing the skill.
- Each event is a single bilingual YAML/Markdown file.

## Non-Goals

- Does NOT create or modify schemas (`src/content.config.ts`)
- Does NOT create new tags, verticals, sponsors, talks, or speakers
- Does NOT replace `/add-meetup` (use that for monthly gatherings)
- Does NOT replace `/add-ptd-edition` (use that for PTD annual conferences)
- Does NOT optimize images (use `/optimize-image`)

## Tier Classification

**Tier: 2** — Standard. Bilingual fields, type-specific validation, optional cross-collection references.

## Inputs

### Required

- `$TITLE`: Event title (bilingual).
- `$TYPE`: `workshop` | `hackathon` | `conference` | `webinar` | `meetup` | `pereira-tech-day`. Picking `meetup` is allowed but `/add-meetup` is preferred for monthly meetups.
- `$DATE`: ISO date `YYYY-MM-DD`.
- `$LOCATION`: `{ name, city, country, online }` — `online: true` for virtual-only events.

### Optional

- `$SLUG`: Custom slug (default: kebab-case of title, English-only).
- `$DESCRIPTION`: 130-160 char description per language (auto-drafted if absent).
- `$END_DATE`: For multi-day events.
- `$HERO_IMAGE`: Path under `public/images/events/<slug>/hero.{ext}`.
- `$VERTICALS`: Verticals the event belongs to (must exist).
- `$SPONSORS`: Sponsor refs.
- `$RELATED`: Cross-references — `[{ collection: 'meetups' | 'pereiraTechDays' | 'talks', slug }]`.
- `$STATUS`: `announced` | `scheduled` | `completed` | `cancelled` (default inferred from date).

## Reference Documentation

- **[Content Collections schema](../../../src/content.config.ts)** — `events` collection (lines 310-350).
- **[Architecture Guide](../../../docs/ARCHITECTURE.md)**.

## Quick Reference

**File naming:** `YYYY-MM-DD_{slug}.yaml` in `src/content/events/` (YAML preferred; Markdown allowed if a body is needed).

**Slugs:** English-only. Always.

**Images:** Stored in `public/images/events/<slug>/`. Hero: `hero.{ext}`.

### Frontmatter Template (YAML form)

```yaml
title:
  en: "NodeSchool Day Pereira 2026"
  es: "NodeSchool Day Pereira 2026"
description:
  en: "Hands-on JavaScript and Node.js workshops with a local edition of the global NodeSchool International Day."
  es: "Talleres prácticos de JavaScript y Node.js en una edición local del NodeSchool International Day global."
type: workshop
date: 2026-06-23
location:
  name: "Hub Innovación UTP"
  city: "Pereira"
  country: "Colombia"
  online: false
hero:
  src: "/images/events/nodeschool-day-pereira-2026/hero.webp"
  alt:
    en: "NodeSchool Day Pereira 2026"
    es: "NodeSchool Day Pereira 2026"
  layout: banner
verticals:
  - monthly-meetups
related:
  - collection: meetups
    slug: "2026-06-23_nodeschool-day-pereira-2026"
sponsors: []
status: scheduled
draft: false
```

If you need a freeform body, switch to a `.md` file with the same frontmatter wrapped in `---` lines.

## Steps

### Step 1: Pick Type and Validate

1. Confirm `$TYPE` is one of the allowed enum values.
2. If `$TYPE === 'meetup'`, ask the user to confirm — `/add-meetup` is usually the correct skill.
3. If `$TYPE === 'pereira-tech-day'`, ask the user to confirm — `/add-ptd-edition` is the correct skill for the canonical PTD record.

### Step 2: Validate References

```bash
ls src/content/verticals/
ls src/content/meetups/ | head -20
ls src/content/pereiraTechDays/
ls src/content/talks/ | head -20
ls src/content/sponsors/
```

- Each `$VERTICALS` entry must exist.
- Each `$RELATED` entry must resolve to a real slug in the named collection.
- Each `$SPONSORS` entry must exist in `src/content/sponsors/`.

### Step 3: Generate the File

Create `src/content/events/YYYY-MM-DD_{slug}.yaml` (preferred) or `.md` (if a body is needed). Populate every required field with bilingual values for `title`, `description`, and `hero.alt`.

### Step 4: Image Setup (Optional)

1. Verify `public/images/events/<slug>/hero.{ext}` exists.
2. If missing, instruct the user to drop the source into `public/images/_staging/` and run `pnpm run images:optimize`.

### Step 5: Validate

```bash
pnpm run biome:check
pnpm run astro:check
pnpm run build
pnpm run md:check:strict
```

## Output Format

```
## Event Created

### File
- `src/content/events/YYYY-MM-DD_{slug}.yaml`

### Details
- **Title (EN):** {title.en}
- **Title (ES):** {title.es}
- **Type:** {type}
- **Date:** {date}{endDate}
- **Location:** {location.name} ({location.city}, {location.country}) — {online ? "online" : "in-person"}
- **Verticals:** {verticals}
- **Related:** {related}
- **Status:** {status}

### Build: Passing

### Commit Message
content: add event "{title.en}"
```

## Guardrails

### Scope Limits

- **Maximum files:** 3 (event file + up to 2 supporting assets).
- **Maximum LOC:** 500.
- **Allowed directories:** `src/content/events/`, `public/images/events/`.
- **Forbidden directories:** `src/content/meetups/`, `src/content/pereiraTechDays/`, `src/content/talks/`, `src/pages/`, `src/components/`.

### Safety Checks

- [ ] Slug unique under `src/content/events/`.
- [ ] Slug is English-only.
- [ ] `$TYPE` matches one of the schema enum values.
- [ ] All `verticals`, `related`, and `sponsors` references resolve.
- [ ] `title`, `description`, and `hero.alt` are bilingual.
- [ ] Spanish orthography verified.
- [ ] `pnpm run build` passes.

### Stop Conditions

**Stop and ask** if:

- A referenced collection entry does not exist.
- The user asks to create a `meetup` or `pereira-tech-day` event — confirm before bypassing the dedicated skills.
- The hero image is missing.

## Definition of Done

- [ ] File created at `src/content/events/YYYY-MM-DD_{slug}.yaml`
- [ ] Bilingual fields populated
- [ ] References validated
- [ ] `pnpm run biome:check`, `astro:check`, `build`, `md:check:strict` all pass
- [ ] Spanish text has correct diacritical marks

## Related

- [`add-meetup`](../add-meetup/SKILL.md) — Monthly community meetups.
- [`add-ptd-edition`](../add-ptd-edition/SKILL.md) — Pereira Tech Day annual editions.
- [`optimize-image`](../optimize-image/SKILL.md) — Hero image optimisation.

## Changelog

| Version | Date       | Changes |
| ------- | ---------- | ------- |
| 1.0.0   | 2026-06-01 | Initial skill: bilingual event creation for workshops, hackathons, conferences, webinars with cross-collection `related` references. |
