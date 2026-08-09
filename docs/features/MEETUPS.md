# Meetups

See `AGENTS.md` and `/add-meetup` for the full workflow.

## The body model — two files per meetup

A meetup is **one entry plus one body sibling**:

```
src/content/meetups/
├── 2026-06-24_qa-pilar-del-software.md      ← frontmatter + Spanish body
└── 2026-06-24_qa-pilar-del-software.en.md   ← English body only
```

The entry holds every piece of structured data — date, venue, speakers, talks,
sponsors, gallery — because none of it has a language dimension and duplicating
it would let the two copies drift. The sibling holds **only** English prose: no
frontmatter, no restated data. The loader's `generateId` strips `.en`, so both
share an id.

Worked example. `2026-06-24_qa-pilar-del-software.md`:

```markdown
---
title:
  en: "QA: the pillar of software"
  es: "QA: Pilar del software"
description:
  en: "Time to talk about quality. Two talks on the lessons open source left us…"
  es: "Llegó el momento de hablar de calidad. Dos charlas sobre las lecciones…"
date: 2026-06-24
venue: { name: "Universidad Tecnológica de Pereira", city: "Pereira", country: "Colombia" }
speakers: [juan-alejandro-perez-bermudez]
talks: [qa-pilar-del-software--1-qa-first-open-source]
---

## Llegó el momento de hablar de calidad

La calidad de software ha evolucionado mucho más allá de la detección de errores…
```

And `2026-06-24_qa-pilar-del-software.en.md` — nothing but the body:

```markdown
## Time to talk about quality

Software quality has moved well beyond catching bugs…
```

**Rendering.** `getMeetupBodyEntry(meetup, lang)` returns the entry to render
and an `untranslated` flag. When English is requested and no sibling exists it
serves the Spanish body **behind a visible notice** — never silently. Omitting
the body would hide real content; serving it unlabelled is the defect the
mechanism exists to remove.

**Section labels belong to one language.** A Spanish body writes `### Fuentes`,
`**Charlas:**`, `**Ponente:**` and `por`; an English body writes `### Sources`,
`**Talks:**`, `**Speaker:**` and `by`. `tests/unit/lib/bilingual-body-parity.test.ts`
fails on a body carrying the other language's boilerplate.

**`title.en` must be real English.** Not the Spanish title with one word
swapped — "Web Development Moderno" and "Revolutionizing el Deep Learning" were
both real, and both failed the reader. The same test asserts this.

Verticals use the identical mechanism (`{slug}.en.md`, `verticalBodiesEn`). See
[I18N Guide](../I18N_GUIDE.md).

## `/meetups` timeline

One list, not two. `getAllMeetupShowcase()` (`src/lib/meetup.ts`) merges
`getUpcomingMeetupShowcase()` and `getPastMeetupShowcase()` newest-first, and
`MeetupsPage.astro` groups the result by year under a single **Todos los
meetups / All meetups** heading (no eyebrow). Upcoming entries keep the status
badge `MeetupCard` / `EditionCard` already render (`Próximamente`,
`RSVP abierto`); completed entries render no badge.

Pereira Tech Day editions are part of that timeline — a PTD is a meetup with a
bigger stage, and `MeetupShowcaseItem` carries both shapes
(`{ type: 'meetup' }` / `{ type: 'pereira-tech-day' }`). The upcoming flagship
is folded in only when no regular meetup already covers its calendar month, so
August 2026 shows the edition card instead of a duplicate. Keeping editions in
this list is what gives every meetup — PTD included — one obvious path to its
speakers, talks, and sponsors. See
[Pereira Tech Days](./PEREIRA_TECH_DAYS.md).

## Speakers on flyers (mandatory mapping)

Meetup cover/hero images almost always print the speaker roster. Empty `speakers: []` is a defect when the flyer names people.

1. Open `public/images/meetups/{slug}/hero.*` and read every printed name + role.
2. Resolve or create `src/content/speakers/{slug}.yaml` (English slug, bilingual `role`/`bio`).
3. Fill meetup frontmatter `speakers: [slug, …]` left-to-right as on the flyer when known.
4. Prefer aliasing short flyer names to an existing profile (e.g. “Juan Perez” → `mega-barto`) over duplicates.
5. Illegible/candid archive photos → leave empty and note `needs-human`; do not invent names.

Census / remap work for the full archive lives under `.dwp/plans/PLAN_exhaustive_speakers_from_flyers/`.

## Memories gallery

Optional on-site gallery via meetup frontmatter `gallery: [{ src, alt?, caption? }]`.

Convention: `public/images/meetups/{slug}/memories/{n}.webp` (+ matching `gallery` entries). Empty `gallery` hides the section. External albums remain on `linkPhotos`. Photo ingest is a follow-up plan; schema/UI are ready.
