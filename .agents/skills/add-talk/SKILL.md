---
name: add-talk
description: Create a talk entry in src/content/talks/ linked to speakers and a meetup, event, or Pereira Tech Day. Use when adding sessions for speaker history and meetup/PTD detail pages.
disable-model-invocation: false
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
argument-hint: "[title, speakers, meetup-or-ptd slug, date, type]"
tier: 2
intent: create
---

# Skill: Add Talk

## Objective

Create a bilingual talk file under `src/content/talks/` and wire it into the parent meetup / PTD `talks[]` (or schedule `talkSlug`) so `/speakers/{slug}` and event pages show the session.

## Mandatory policy

- Prefer this skill over hand-authoring talk files.
- Speakers must already exist in `src/content/speakers/`.
- English slug segment; bilingual `title` / `abstract`; Spanish orthography on `es`.
- Past sessions: `status: recorded`. Types: `talk` | `keynote` | `lightning` | `panel` | `workshop`.
- Filename: `{event-slug}--{n}-{talk-slug}.md` (1-based index per event).
- Never invent people or specific titles without evidence (meetup body, flyer, PTD YAML).

## Steps

1. Confirm speaker YAML slugs exist.
2. Choose next `--{n}-` index for that event slug.
3. Write the talk Markdown (see `docs/features/TALKS.md`).
4. Append the talk id to the meetup `talks: []` (or set PTD schedule `talkSlug` / lightning entry).
5. Run `pnpm run astro:check`.

## Non-goals

- Does not create speakers (create speaker YAML first).
- Does not create meetups (`/add-meetup`) or PTD editions (`/add-ptd-edition`).
