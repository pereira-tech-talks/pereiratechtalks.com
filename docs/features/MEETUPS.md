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

## Programming a meetup before its line-up exists

The community programmes months ahead, often before a single speaker is
confirmed. Three authored fields make that possible; everything else is derived.

### What is authored, and what is derived

Nothing states the same fact twice. `talks: []` with `speakers: []` **is** an
open line-up, so no author writes it down — the same reasoning
`resolveMeetupStatus` already applies to past/upcoming.

| Fact | How |
|---|---|
| Is the programme announced? | **Derived** — `resolveMeetupLineup()` from `talks` + `speakers` |
| Has the meetup happened? | **Derived** — `resolveMeetupStatus()` from the calendar date |
| Is the call accepting right now? | **Derived** — `getCallForSpeakersState()` |
| How firm is the date? | **Authored** — `dateConfidence` |
| Are we publicly asking for talks, in which formats? | **Authored** — `callForSpeakers` |

`resolveMeetupLineup` returns:

| `talks` | `speakers` | Result |
|---|---|---|
| empty | empty | `open` |
| empty | non-empty | `partial` |
| non-empty | either | `confirmed` |

`partial` is the real intermediate state: speakers get confirmed before their
talk entries exist, because a talk needs a title, an abstract and a duration.

### `dateConfidence`

```yaml
dateConfidence: confirmed    # default — the day is a commitment
dateConfidence: tentative    # the day is a proposal and may move
dateConfidence: month-only   # only the month is fixed
```

`date` stays **required and real** in every case. Sorting, year grouping,
`getCalendarYearMonth`, the archive rail and the `Event` structured data all
read it, and making it nullable would touch every one of them for no gain.

For `month-only`, set the month's usual cadence day. Every surface then renders
the month alone ("Noviembre de 2026") and `<time datetime>` carries `YYYY-MM`,
so nothing claims a day the community has not fixed. The agent twin does the
same: its `Fecha` / `Date` key is `YYYY-MM` for such a meetup.

> **The `Event` JSON-LD trade-off, stated on purpose.** A `month-only` meetup
> still publishes its cadence date in `startDate`, because
> `scripts/audit-seo.mjs` requires `Event` on every `meetups/*` URL and an
> `Event` without a `startDate` is invalid. Confirming the day corrects it on the
> next build. Omitting the `Event` entirely would remove the page from event
> surfaces, which is worse. Recorded so a future reader knows it was a decision.

### `callForSpeakers`

```yaml
callForSpeakers:
  status: open              # open | scheduled | closed
  formats: [lightning]      # subset of regular | lightning | panel | workshop
  opensAt: 2026-10-15       # optional — before this it renders as "scheduled"
  closesAt: 2026-11-04      # optional — after this the call is closed
  slots: 3                  # optional
  note:                     # optional bilingual line
    es: "Solo charlas relámpago este mes."
    en: "Lightning talks only this month."
```

`formats` is the point of the whole feature: it is what lets the site tell a
speaker with a workshop which month can actually stage one. Pick only what you
can host.

**A call auto-closes.** `getCallForSpeakersState()` checks the calendar
**before** the authored `status`:

| Order | Condition | Result |
|---|---|---|
| 1 | no `callForSpeakers` block | `none` |
| 2 | the meetup date has passed | `closed` |
| 3 | `closesAt` has passed | `closed` |
| 4 | `status === 'closed'` | `closed` |
| 5 | `opensAt` is in the future | `scheduled` |
| 6 | `status === 'scheduled'` | `scheduled` |
| 7 | `status === 'open'` | `open` |

A stale `open` must never invite a proposal to an event that already happened.
That is an integrity rule, not a convenience — never compare `status` inline;
always go through `getCallForSpeakersState()`.

`closesAt` is **inclusive of its own day**: a call closing on the 20th accepts
proposals through the 20th.

### `venue` is optional; `mode` defaults

You cannot book a room five months out, so `venue` is optional and `mode`
defaults to `in-person`. Every reader must handle the absence: the card, the
detail page and the agent twin all render a localized *Sede por confirmar* /
*Venue to be confirmed* rather than an empty line.

The twin **always** emits its `Lugar` / `Venue` section, even with no venue —
`scripts/lib/md-completeness.mjs` requires that section on every meetup twin
with no conditional probe, and a reader must be able to tell "not decided" from
"the twin forgot".

### The body of a planned meetup

No talks to describe, so the body says what the month is for and what the call
accepts — nothing else.

```markdown
## Meetup de septiembre

Septiembre lo dedicamos a las charlas relámpago: de tres a cinco minutos por
persona, una idea por charla.

La fecha está confirmada. La sede y el orden del día se anuncian cuando
cerremos la convocatoria.

### Convocatoria

Recibimos propuestas de charlas relámpago hasta el 9 de septiembre.
```

The `.en.md` sibling carries the same shape with `### Call for speakers`.
`tests/unit/lib/bilingual-body-parity.test.ts` fails if either label crosses
languages.

**Invent nothing.** No speaker, no topic, no venue, no "expect deep dives
into…". If it is not decided, the body does not claim it — the same rule
`docs/WRITING_CRAFT_GUIDE.md` applies to past events, binding harder for future
ones. A three-sentence body in both languages is *right*; `parity:check` reports
such a pair as `thin-both` and does **not** fail.

### Where a programmed meetup appears

| Surface | What it shows |
|---|---|
| `/meetups` → *Próximos meetups* | A date-first card (typographic tile, never a stock placeholder), chips for tentative / call open / line-up in progress, and a direct link to the call |
| `/meetups/{slug}` | Confidence-aware date, venue TBC, a "programme in progress" notice instead of an empty Talks heading, and the call panel at `#call-for-speakers` |
| `/call-for-speakers` | A *Convocatorias abiertas* row with the accepted formats, deadline and slots |
| `/api/cfs-open.json` | The machine-readable list of open calls |
| `/meetups.md`, `/call-for-speakers.md` | An **Open calls** section, so an assistant can answer "which meetup takes a workshop?" from one fetch |

### Filling one in later

Add `speakers` / `talks`, add the venue and hero, set
`dateConfidence: confirmed`, and close the call. The line-up state follows from
the arrays automatically — there is nothing else to update.

**Use `/add-meetup` (planned mode).** Do not hand-write these entries.

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
