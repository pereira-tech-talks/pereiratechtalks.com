---
name: update-event
description: Update an existing workshop, hackathon, conference, or webinar in the events collection (date, venue, status, bilingual copy, hero, sponsors, verticals, related links). Use when the user asks to change, correct, postpone, cancel, or reschedule an event already in src/content/events/, including phrases like "actualiza el evento", "cambia la fecha", or "aplaza". New entries use add-event; monthly meetups use add-meetup; Pereira Tech Day editions use add-ptd-edition.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
argument-hint: "[slug or title, fields to change]"
# === Documentation (ignored by tools, useful for humans) ===
tier: 2
intent: update
max-files: 3
max-loc: 200
---

# Skill: Update Event

## Objective

Edit one existing entry in `src/content/events/`. Change only the fields the user named. Leave every other field as it is.

> **Heuristic — which collection?**
>
> - File under `src/content/events/` → this skill.
> - Monthly community gathering → `meetups`. Stop. Do not edit it here.
> - Annual Pereira Tech Day → `pereiraTechDays`. Stop. Do not edit it here.
> - No matching file → `/add-event`. Do not create an entry with this skill.

## Mandatory Invocation Policy (CRITICAL)

This skill is the mandatory workflow for editing files in `src/content/events/`.

- Use `/update-event` before changing an existing event.
- Do not edit those files by hand unless the user explicitly bypasses the skill.

## Non-Goals

- Does NOT create events (use `/add-event`)
- Does NOT edit `src/content/meetups/` or `src/content/pereiraTechDays/`
- Does NOT change `src/content.config.ts`
- Does NOT create verticals, sponsors, talks, or speakers
- Does NOT optimize images (use `/optimize-image`)
- Does NOT commit or push

## Inputs

### Required

- `$TARGET`: Filename, id (`YYYY-MM-DD_slug`), title, or a description that matches one file.

### Optional — only the fields the user asked to change

- `title` / `description`: `{ en, es }`. Update both languages together.
- `type`: `workshop` | `hackathon` | `conference` | `webinar` | `meetup` | `pereira-tech-day`.
- `date`: `YYYY-MM-DD`. Must stay aligned with the filename prefix.
- `endDate`: `YYYY-MM-DD`, on or after `date`. Remove it when the event becomes a single day.
- `location`: `name`, `addressLine`, `city`, `country`, `mapUrl`, `online`, `streamUrl`. `city` and `country` stay required even when `online: true`.
- `hero`: `src`, `alt` (`{ en, es }`), `layout` (`banner` | `side-by-side` | `minimal` | `none`).
- `sponsors`: `{ slug, tier }` with `tier` one of `diamond` | `gold` | `silver` | `bronze` | `community`.
- `verticals`: slugs that already exist under `src/content/verticals/`.
- `related`: `{ collection, slug }` with `collection` one of `meetups` | `pereiraTechDays` | `talks`.
- `status`: `announced` | `rsvp-open` | `postponed` | `completed` | `cancelled`.
- `draft`: `true` hides the entry in production.

`scheduled` is not a valid status.

## Reference

- `src/content.config.ts` — `events` collection, `eventLocation`, `eventStatus`.
- [`add-event`](../add-event/SKILL.md) — creating an entry.
- Entry id is the filename without the extension (`generateId` does not strip the date). Renaming the file changes `/events/{id}` links and any `getEventBySlug` lookup.

## Steps

### Step 1: Resolve one entry

List `src/content/events/` and open the single matching file. Read it before editing.

If zero files match, stop and offer `/add-event`. If several match, list them and ask which one. Do not guess.

If the match is a meetup or a Pereira Tech Day edition, stop and name the collection that actually holds it.

### Step 2: Apply only the requested changes

Edit the existing file in place. Keep its extension (`.yaml` or `.md`). On a Markdown entry, change frontmatter unless the user asked to change the body.

**Date.** Set `date` to the new day and rename the file so the `YYYY-MM-DD_` prefix matches. Keep the slug after the prefix. Then search the repo for the old id:

```bash
rg -n "OLD_ID" src docs
```

Update every in-repo reference that points at that id. If a reference lives in another collection and the user did not ask to touch it, stop and list it.

**Postpone.** Set `status: postponed`. Leave `date`, `location`, `sponsors`, and `related` unchanged. Postponed is reversible.

**Reschedule a postponed event.** Write the new `date`, rename the file, and set `status: announced` unless the user names another status.

**Cancel.** Set `status: cancelled`. Do not delete the file.

**Copy.** When `title` or `description` changes, write both `en` and `es`. `title.en` is English. Spanish uses ñ and accents (`diseño`, `próximo`, `mañana`). Do not shorten an existing description unless the user asked for a shorter one.

**Type.** If the user sets `type` to `meetup` or `pereira-tech-day`, stop and confirm. Those records belong to the other skills.

### Step 3: Validate references

Before saving sponsors, verticals, related slugs, or a new `hero.src`:

- Each `verticals` slug exists under `src/content/verticals/`.
- Each `sponsors[].slug` exists under `src/content/sponsors/`, and `tier` is one of the five tiers.
- Each `related` slug exists in the named collection.
- `hero.src` resolves to a file under `public/`. If it is missing, stop and point the user at `public/images/_staging/` plus `pnpm run images:optimize`.

A missing reference is a stop. Do not invent the target.

### Step 4: Check orthography and schema

```bash
rg -n "pequeno|tamano|diseno|espanol|manana|companer|analisis|numero|codigo|pagina|titulo|proximo" src/content/events/THE_FILE
pnpm exec biome check src/content/events/THE_FILE
pnpm run build
```

`pnpm run build` is the gate. Zod validates this collection at build time; the unit suite does not load these files. Fix schema errors and run the build again. Do not claim it passed unless it did.

## Output Format

```
## Event Updated

### File
- `src/content/events/YYYY-MM-DD_{slug}.yaml` (renamed from `...` when the date changed)

### Changes
- **Field:** previous → next

### Left unchanged
- List fields the user did not ask to touch

### References
- Updated in-repo ids, or "none"

### Build: Passing

### Commit Message
content: update event "{title.en}"
```

Show the commit message. Do not commit unless the user asks.

## Guardrails

### Scope Limits

- **Maximum files:** 3 (the event file, its rename, and reference updates that the id change forces).
- **Allowed directories:** `src/content/events/`. Also the specific files `rg` finds that store the old event id.
- **Forbidden:** `src/content.config.ts`, `src/pages/`, `src/components/`, `src/content/meetups/`, `src/content/pereiraTechDays/`.

### Safety Checks

- [ ] One existing event was edited
- [ ] Untouched fields still match the file you read
- [ ] Filename prefix equals `date`
- [ ] `endDate` is absent or on/after `date`
- [ ] `status` is one of the five schema values
- [ ] `title`, `description`, and `hero.alt` stay bilingual when edited
- [ ] Spanish diacritics checked
- [ ] Sponsors, verticals, related slugs, and `hero.src` resolve
- [ ] `pnpm run build` passed

### Stop Conditions

**Stop and ask** if:

- The target is missing, ambiguous, or belongs to `meetups` / `pereiraTechDays`
- A sponsor, vertical, talk, or meetup slug does not exist
- The hero file is missing
- Renaming the file would change an id that other content still cites and the user has not confirmed those edits
- The user wants a new event

## Definition of Done

- [ ] The existing event file reflects only the requested changes
- [ ] Date and filename prefix match
- [ ] Both languages updated when copy changed
- [ ] References resolve
- [ ] `pnpm run build` passed
- [ ] No commit was created

## Related

- [`add-event`](../add-event/SKILL.md) — create a workshop, hackathon, conference, or webinar.
- [`add-meetup`](../add-meetup/SKILL.md) — monthly community meetups.
- [`add-ptd-edition`](../add-ptd-edition/SKILL.md) — Pereira Tech Day editions.
- [`optimize-image`](../optimize-image/SKILL.md) — hero image optimisation.

## Changelog

| Version | Date       | Changes |
| ------- | ---------- | ------- |
| 1.0.0   | 2026-11-17 | Initial skill: edit one existing `events` entry, keep the filename prefix aligned with `date`, and preserve bilingual fields. |
