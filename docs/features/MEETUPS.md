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

## Body shape and bilingual parity

The two bodies are the **same content in two languages** — not a Spanish recap
and an English summary of it. All 94 ES/EN pairs in the repository now follow one
shape, and `pnpm run parity:check` fails the build when a change breaks it.

```markdown
## {title in this body's language}

{intro — date, venue, who is on the programme}

{context paragraphs}

### Charlas                          ← `### Talks` in the sibling

**{talk title}**

**Ponente:** {speaker name}          ← `**Speaker:**`

{the talk's abstract, in this body's language}

---

### Fuentes                          ← `### Sources`

- Página original del evento: [Meetup.com]({url})   ← `Original event page:`
- Grabación: {url}                                  ← `Recording:`
```

Only the section **labels** differ per language. Everything else — headings, list
items, paragraph breaks, the `---` rule before Sources, and every URL — is
identical on both sides.

### The rules, and why each exists

| Rule | Why |
|---|---|
| Every URL in one body exists in the other | Otherwise one set of readers silently loses a source. This is the class that fails CI. |
| Same headings, list items and paragraph counts | Two languages that render differently are not the same page. |
| Real paragraph breaks, never soft line breaks | Markdown renders a single newline as a space, so `**Ponente:** Ana⏎**Rol:** CTO` renders run together on one line. 22 Spanish bodies read that way. |
| Pull each linked talk's `abstract` into the body, in that body's language | The material is already authored and already bilingual — use `abstract.es` for the Spanish file and `abstract.en` for the English one. Never translate one into the other when both exist. |
| Skip a boilerplate abstract | 133 of 171 talks carry a generated *"Charla de {speaker} en el meetup {title} de Pereira Tech Talks"*. It restates the body. Title and speaker alone are still worth adding. |
| Verify a link resolves **to what it claims** | 47 archive event links returned HTTP 200 and rendered unrelated public events — *Paleopalooza*, *Yoga for Teens*, a French NLP workshop. Meetup resolves an event by ID and ignores the group slug in the path. |
| Never invent facts about a past event | If the repository holds nothing, the body stays short **in both languages**. See [WRITING_CRAFT_GUIDE](../WRITING_CRAFT_GUIDE.md). |

Two meetups — `maraton-utp-2018` and `inauguracion-gdg-pereira` — have no linked
talks and no recoverable sources. They are short on purpose, in both languages.

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
