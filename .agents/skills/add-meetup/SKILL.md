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

Create a new entry in the `meetups` content collection for Pereira Tech Talks v3.0.0. A meetup represents a single monthly community gathering (in-person, virtual, or hybrid). Each meetup is one bilingual Markdown file that drives the `/meetups/<slug>` and `/en/meetups/<slug> (ES unprefixed at /meetups/<slug>)` pages plus the AEO Markdown twins.

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
- `$STATUS`: `announced` | `rsvp-open` | `completed` | `cancelled` (default: `announced`). These are the only values the `eventStatus` enum in `src/content.config.ts` accepts — `scheduled` is **not** valid and fails the build.
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

**URL surface:** `/meetups/<slug>` (EN) and `/en/meetups/<slug> (ES unprefixed at /meetups/<slug>)` (ES).

**Slugs:** English-only, even for Spanish-primary content.

**Images:** Stored in `public/images/meetups/<slug>/`. Hero: `hero.{ext}`.

**Status semantics:**

- `announced`: Date set, registration not yet open or in-progress.
- `rsvp-open`: Confirmed, registration open.
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
gallery: []  # optional memories — public/images/meetups/{slug}/memories/
status: announced
draft: false
---
```

Body content is freeform Markdown (program description, schedule, callouts).

**A meetup is two files.** The entry carries the frontmatter and the **Spanish**
body; a `{slug}.en.md` sibling carries the **English** body and nothing else —
no frontmatter, no restated structured data. Do **not** append a
`Summary in English`, `Resumen en español`, or `> **EN:**` companion block
inside either body: the two languages live in two files.

```
src/content/meetups/
├── 2026-06-24_qa-pilar-del-software.md      ← frontmatter + Spanish body
└── 2026-06-24_qa-pilar-del-software.en.md   ← English body only
```

Each body speaks one language throughout, section labels included: Spanish
writes `### Fuentes`, `**Charlas:**`, `**Ponente:**`, `por`; English writes
`### Sources`, `**Talks:**`, `**Speaker:**`, `by`. Skipping the sibling makes
`/en/meetups/{slug}` serve the Spanish body behind an "untranslated" notice and
keeps `pnpm run lang:check` flagging it. See
[I18N Guide](../../../docs/I18N_GUIDE.md).

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

### Step 2: Generate Both Files

1. Create `src/content/meetups/YYYY-MM-DD_{slug}.md` using the frontmatter
   template. Always include both `en` and `es` keys for `title`, `description`
   and `hero.alt`. **`title.en` must be real English** — not the Spanish title
   with one word swapped ("Web Development Moderno" and
   "Revolutionizing el Deep Learning" both shipped that way and both failed the
   reader). Write the body in Spanish (informal-professional tuteo).
2. Create `src/content/meetups/YYYY-MM-DD_{slug}.en.md` containing **only** the
   English body — no frontmatter fence, no repeated metadata. It is a
   translation of the Spanish body, not a summary of it.

If a fact is genuinely unknown for a historical meetup, say so in both bodies.
Never invent details about a past event
([Writing Craft Guide](../../../docs/WRITING_CRAFT_GUIDE.md)).

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

## Body Shape and Bilingual Parity (MANDATORY)

The two bodies are **the same content in two languages** — not a full Spanish
recap and an English summary of it. Whatever one carries, the other carries.

### Canonical shape

Use this in both files. It is what 94 of 94 existing pairs now follow.

```markdown
## {title in this body's language}

{intro paragraph — date, venue, who is on the programme}

{one or two paragraphs of context}

### Charlas          ← `### Talks` in the English sibling

**{talk title}**

**Ponente:** {speaker name}       ← `**Speaker:**` in English

{the talk's abstract, in this body's language}

---

### Fuentes          ← `### Sources` in English

- Página original del evento: [Meetup.com]({url})   ← `Original event page:`
- Grabación: {url}                                  ← `Recording:`
```

### The rules

1. **Same sources in both.** Every URL in one body exists in the other. This is
   the one thing `parity:check` fails the build on, and it is never ambiguous.
2. **Same structure.** Same headings, same list items, same paragraph breaks,
   and the `---` rule before the Sources block in both. Only the section
   *labels* differ per language — `Fuentes`/`Sources`, `Ponente`/`Speaker`.
3. **Real paragraph breaks, never soft line breaks.** Markdown renders a single
   newline as a space, so `**Ponente:** Ana\n**Rol:** CTO` renders run together
   on one line. Separate blocks with a blank line in both languages.
4. **Pull each linked talk's abstract into the body**, in that body's language,
   taking `abstract.es` for the Spanish file and `abstract.en` for the English
   one. Do **not** translate one into the other when both exist, and do not
   paraphrase either.
5. **Skip a boilerplate abstract.** Many older talks carry a generated line of
   the form *"Charla de {speaker} en el meetup {title} de Pereira Tech Talks"*.
   It restates what the body already says — leave it out. Title and speaker
   alone are still worth adding.
6. **Verify every URL before writing it.** A link that 404s, or an event ID that
   resolves to somebody else's event, is worse than no link. Check the page is
   the event you mean, not merely that it returns 200 — 47 archive links
   returned 200 and pointed at unrelated public events.
7. **Never invent facts about a past event.** If the repository holds nothing,
   the body stays short in both languages. See `docs/WRITING_CRAFT_GUIDE.md`.

## Output Format

```
## Meetup Created

### File
- `src/content/meetups/YYYY-MM-DD_{slug}.md`

### URLs
- English: `/meetups/{slug}/` (+ `.md`)
- Spanish: `/meetups/{slug}/` (+ `.md`); English: `/en/meetups/{slug}/`

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

- **Maximum files:** 5 (meetup entry + `.en.md` body sibling + up to 3 supporting assets like a hero image already optimised).
- **Maximum LOC:** 600 (frontmatter + both bodies combined).
- **Allowed directories:** `src/content/meetups/`, `public/images/meetups/`.
- **Forbidden directories:** `src/content/talks/`, `src/content/speakers/`, `src/content/sponsors/`, `src/content/verticals/`, `src/pages/`, `src/components/`.

### Safety Checks

- [ ] Slug is unique under `src/content/meetups/`.
- [ ] Slug is English-only (no Spanish slugs).
- [ ] All `verticals`, `talks`, `speakers`, `sponsors` references resolve.
- [ ] `title`, `description`, and `hero.alt` have both `en` and `es` keys.
- [ ] `title.en` reads as English, not a word-swapped Spanish title.
- [ ] The `{slug}.en.md` sibling exists and contains only the English body.
- [ ] `description` is 130-160 characters per language.
- [ ] Spanish has correct diacritical marks (ñ, accents).
- [ ] `pnpm run build` passes.

### Stop Conditions

**Stop and ask** if:

- A referenced talk/speaker/vertical/sponsor does not exist (do not auto-create — use their own skills).
- The hero image does not exist and the user has not approved a placeholder.
- The slug conflicts with an existing meetup on the same date.

## Definition of Done

- [ ] Files created at `src/content/meetups/YYYY-MM-DD_{slug}.md` **and** `…_{slug}.en.md`
- [ ] Both EN and ES frontmatter populated (`title`, `description`, `hero.alt`)
- [ ] Spanish body in the entry, English body in the sibling — neither carrying the other language's section labels
- [ ] Both bodies follow the canonical shape, with the `---` rule before the Sources block
- [ ] Every URL in one body exists in the other, and each was verified to resolve to the event it claims
- [ ] Linked talks' abstracts pulled into both bodies in their own language, boilerplate ones skipped
- [ ] `pnpm run parity:check` reports 0 content-loss and 0 structural findings
- [ ] All references resolve to existing collection entries
- [ ] `pnpm run biome:check` passes
- [ ] `pnpm run astro:check` passes
- [ ] `pnpm run build` succeeds
- [ ] `pnpm run md:check:strict` passes (AEO twin generated automatically)
- [ ] `pnpm run lang:check` reports 0 flagged pages
- [ ] `pnpm run seo:check` reports 0 flagged URLs
- [ ] Spanish orthography verified (no `pequeno`, `codigo`, `tamano`, etc.)

## Related

- [`add-event`](../add-event/SKILL.md) — Workshops, hackathons, conferences (non-meetup formats).
- [`add-ptd-edition`](../add-ptd-edition/SKILL.md) — Pereira Tech Day annual conference editions.
- [`optimize-image`](../optimize-image/SKILL.md) — Hero image optimisation.
- [`translate-sync`](../translate-sync/SKILL.md) — Sync EN/ES quality.

## Changelog

| Version | Date       | Changes |
| ------- | ---------- | ------- |
| 1.3.0   | 2026-08-09 | Add the canonical body shape and the bilingual parity rules — same sources, same structure, talk abstracts in both languages, boilerplate abstracts skipped, every URL verified against the event it claims. `pnpm run parity:check` joins the Definition of Done. |
| 1.2.0   | 2026-08-09 | Meetups are now two files: the entry keeps the Spanish body, a `{slug}.en.md` sibling carries the English one. Frontmatter-only bilingual coverage left every `/en/meetups/*` page rendering Spanish prose. |
| 1.1.0   | 2026-08-08 | Drop `Summary in English` / `> **EN:**` body companions; bilingual coverage is frontmatter-only for the shared body. |
| 1.0.0   | 2026-06-01 | Initial skill: bilingual meetup creation with vertical/talk/speaker/sponsor references and AEO twin auto-generation via build. |
