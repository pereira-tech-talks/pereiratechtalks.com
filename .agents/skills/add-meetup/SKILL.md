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
- `$VERTICAL`: One or more slugs from `src/content/verticals/` (default: `["monthly-meetups"]`)

### Required for a meetup that is already organised — omitted in **planned mode**

- `$VENUE`: Venue object — `{ name, city, country }`. Default city/country to `Pereira`/`Colombia` if not provided. **Optional** since the programming feature: you cannot book a room five months out.
- `$MODE`: `in-person` | `virtual` | `hybrid` (defaults to `in-person`)

### Optional

- `$SLUG`: Custom slug (default: kebab-case of title, **English-only**).
- `$DESCRIPTION`: 130-160 char description. If omitted, the skill drafts one from the title and date.
- `$HERO_IMAGE`: Path under `public/images/meetups/<slug>/hero.{ext}`.
- `$STATUS`: `announced` | `rsvp-open` | `postponed` | `completed` | `cancelled` (default: `announced`). These are the only values the `eventStatus` enum in `src/content.config.ts` accepts — `scheduled` is **not** valid there and fails the build. (`scheduled` *is* valid inside `callForSpeakers.status` — a different field, see **Planned mode** below.)
- `$DATE_CONFIDENCE`: `confirmed` | `tentative` | `month-only` (default: `confirmed`). See **Planned mode**.
- `$CALL_FOR_SPEAKERS`: the meetup's own call — see **Planned mode**.
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

## Planned Mode — programming a meetup before its line-up exists

The community programmes months ahead, often before a single speaker is
confirmed. Planned mode creates that meetup from a **date alone**.

### What planned mode needs, and what it deliberately does not

| Field | Planned mode |
|---|---|
| `title`, `description`, `date`, `pubDate`, `verticals` | **Required**, as always |
| `dateConfidence` | **Required decision** — see below |
| `callForSpeakers` | Optional, but the reason planned mode exists |
| `venue` | **Omit.** You have not booked a room. |
| `mode` | **Omit.** Defaults to `in-person`. |
| `hero` / `heroImage` | **Omit.** The card renders a typographic date tile instead of a stock placeholder. |
| `speakers`, `talks`, `sponsors` | **Omit.** The line-up is *derived* from these being empty; never state it twice. |
| `status` | `announced` |

### `dateConfidence` — pick one, honestly

```yaml
dateConfidence: confirmed    # default. The day is a commitment.
dateConfidence: tentative    # the day is a proposal and may move.
dateConfidence: month-only   # only the month is fixed.
```

`date` stays **required and real** in all three cases — sorting, year grouping
and the `Event` structured data all read it. For `month-only`, set the month's
usual cadence day; every surface then renders the month alone
("Noviembre de 2026") and the `<time datetime>` attribute carries `YYYY-MM`, so
nothing claims a day the community has not fixed.

Do **not** reach for `tentative` out of caution. A `confirmed` date that later
moves is a normal edit; a page permanently hedging is worse for the reader than
a date that changed once.

### `callForSpeakers`

```yaml
callForSpeakers:
  status: open              # open | scheduled | closed
  formats: [lightning]      # subset of regular | lightning | panel | workshop
  opensAt: 2026-09-15       # optional — before this it renders as "scheduled"
  closesAt: 2026-11-04      # optional — after this the call is closed
  slots: 3                  # optional — "quedan 3 espacios"
  note:                     # optional bilingual line
    es: "Solo charlas relámpago este mes."
    en: "Lightning talks only this month."
```

`formats` is the whole point: it is what lets the site tell a speaker with a
workshop which month can actually stage one. Pick only what you can host.

**A call auto-closes.** Once the meetup date or `closesAt` has passed, every
surface reports the call closed regardless of `status` — a stale `open` must
never invite a proposal to an event that already happened. Read the state
through `getCallForSpeakersState()` in `src/lib/meetup.ts`; never compare
`status` inline.

### Body shape for a planned meetup

A planned meetup has no talks to describe, so its body says what the month is
for and what the call accepts — **nothing else**. Both languages carry the same
content; only the section label differs.

`src/content/meetups/2027-03-24_march-meetup-2027.md` — note the **English
slug** even though the body is Spanish (`AGENTS.md` DON'T #21):

```markdown
## Meetup de marzo

{one or two sentences: what this month is for}

{one sentence: what is and is not decided yet}

### Convocatoria

{one or two sentences: what the call accepts and how to propose}
```

`…2027-03-24_march-meetup-2027.en.md` — the same shape, `### Call for
speakers` as the heading, real English throughout.

### The rules that matter here

1. **Invent nothing.** No speaker, no topic, no venue, no "expect deep dives
   into…". If it is not decided, the body does not claim it. This is the same
   rule `docs/WRITING_CRAFT_GUIDE.md` applies to past events, and it binds
   harder for future ones.
2. **Same structure both sides.** Identical heading, list, link, image and
   paragraph counts, and identical URL sets. That is the class of finding
   `parity:check` fails the build on.
3. **Short is correct.** A planned meetup with a three-sentence body in both
   languages is *right*. Padding it to look substantial is the failure mode.
   `parity:check` reports such a pair as `thin-both` and does **not** fail —
   thinness is expected here.
4. **Real English on the English side**, real Spanish with correct diacritics on
   the Spanish side. `title.en` must be genuine English, not the Spanish title
   with one word swapped — `tests/unit/lib/bilingual-body-parity.test.ts` fails
   on that.
5. **English slug**, `YYYY-MM-DD_slug.md` naming, and an `.en.md` sibling — the
   same rules as any meetup.

### Filling a planned meetup in later

When speakers are confirmed, edit the same entry: add `speakers` / `talks`, add
the venue and hero, set `dateConfidence: confirmed`, and set
`callForSpeakers.status: closed` (or delete the block). The line-up state
follows automatically from the arrays — there is nothing else to update.

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
