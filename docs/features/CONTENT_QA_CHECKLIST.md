# Content QA Checklist

Agent-facing gates before shipping content or closing a content DWP.

## Bilingual parity

- [ ] Blog/slides/pages: EN and ES twins exist with the same English slug
- [ ] Meetups and verticals: entry under `src/content/{meetups,verticals}/` with
      `title`/`description`/`hero.alt` in both `en` and `es`, **plus a
      `{slug}.en.md` body sibling**
- [ ] `title.en` is real English, not the Spanish title with a word swapped
- [ ] Each body speaks one language — a Spanish body writes `### Fuentes` and
      `por`, an English body `### Sources` and `by`
- [ ] YAML entities (`speakers`, `sponsors`, …): `en`/`es` fields filled — no Spanish pasted into `en`

## Content parity — same content, not just the same language

Being in the right language is [language integrity](#language-integrity). This
is the separate question of whether the two versions say the **same thing**.

- [ ] Every URL in one body exists in the other — no source reaches only one
      set of readers
- [ ] Same structure: same headings, list items and paragraph breaks, and the
      `---` rule before the Sources block in both
- [ ] Real paragraph breaks, not soft line breaks — a single newline renders as
      a space, so `**Ponente:** Ana\n**Rol:** CTO` runs together on one line
- [ ] Linked talks' abstracts appear in both bodies, each in its own language,
      taken as authored — not translated from the other when both exist
- [ ] Generated boilerplate abstracts (*"Charla de {speaker} en el meetup …"*)
      left out; they restate what the body already says
- [ ] Every external link verified to resolve **to what it claims** — an event
      ID returning 200 may still be somebody else's event
- [ ] `pnpm run parity:check` reports 0 `content-loss` and 0 `structural`

## Orthography

- [ ] Spanish user-facing text uses ñ and accented vowels
- [ ] Run Standards greps from [STANDARDS](../STANDARDS.md) (ignore English **slugs**)

## Voice & completeness

- [ ] No placeholders: `[TODO]`, `[TBD]`, `[AUTHOR]`, “Historical Pereira Tech Talks meetup” boilerplate
- [ ] Follow [Writing Voice Guide](../WRITING_VOICE_GUIDE.md)
- [ ] Meetup EN summaries are real English (or an honest archive note), not Spanish paste

## Language integrity

- [ ] `pnpm run lang:check` reports **0 flagged pages** — Spanish URLs render
      Spanish, English URLs render English, in HTML *and* in the `.md` twin
- [ ] A page flagged as a **false positive** is fixed in the classifier, not
      allowlisted. All three known false positives turned out to be classifier
      bugs (see `src/lib/language-detect.ts`)

## `.md` completeness

- [ ] `pnpm run md:check` passes — every page has a **complete** twin, not a
      summary. It asserts required sections per page type, no bare-slug rows, a
      well-formed front block, one Site Navigation block, and content coverage
- [ ] Entity references carry a name **and** a link to that entity's own `.md`
- [ ] Agent MD twins updated under `src/content/pages/{en,es}/` when page copy
      changes — unless the page is now generated (home, communities, calendar,
      contact, call-for-speakers, `/pereira-tech-day`), in which case it follows
      the source automatically

## SEO / AEO

- [ ] `pnpm run seo:check` reports **0 flagged URLs**
- [ ] Meta descriptions land in **130–160 characters**. Prefer extending
      `buildMetaDescription`'s clauses with true facts over rewriting copy —
      and never pad to hit the count

## Automated

```bash
pnpm run test                 # includes the bilingual-parity and body-selection suites
pnpm run biome:check
pnpm run astro:check
pnpm run build                # the three gates below read dist/
pnpm run md:check             # completeness + language of every .md twin
pnpm run lang:check           # sitewide language integrity
pnpm run seo:check            # per-URL SEO and structured data
pnpm run parity:check         # ES/EN carry the same content (reads src/content/)
```

Each has a `:strict` variant that exits non-zero; all four run in CI after the
build (`.github/workflows/code_check.yml`). `parity:check` is the exception that
reads `src/content/` rather than `dist/` — parity is a property of the authored
files, so it can be caught before a build.

## What the gates do not catch

Both of these cost a real plan real time
(`PLAN_meetup_programming_and_call_for_speakers`, 2026-08). Neither is
detectable by any of the four gates.

### An empty state passes every gate

A content feature built while its collection is empty will pass `md:check`,
`lang:check`, `seo:check` and `parity:check` — because the surface it adds does
not render, so there is nothing for the gates to compare. Four consecutive tasks
shipped green that way; the first commit of real content produced **ten**
`md:check` failures at once (a missing line-up notice, missing panel prose, a
raw enum where the page showed a localized label, and an unreflected form).

**Therefore:** a feature is not verified until its content exists. Seed at least
one entry per state the feature can be in, rebuild, and re-run the gates *before*
calling the UI work done. `pnpm run build` page count is a cheap sanity check
that the entries actually landed.

### Slug language

No gate checks whether a slug is English. `md`, `lang`, `seo` and `parity` all
pass happily on `src/content/meetups/2026-09-23_meetup-de-septiembre-2026.md`,
and the rule lives only in `AGENTS.md` (DON'T #21),
[MEETUPS.md](./MEETUPS.md) and the `/add-meetup` skill.

**Therefore:** check it by eye, or by diff review, on every new content file. The
slug is the public URL and the cross-collection reference key, so renaming after
publication breaks live links.

### A green gate is not a correct page

The four gates assert **structure**: a twin exists, a canonical is present, an
`Event` block is emitted, the two languages carry the same sections. None of
them reads the page for **truth**.

`PLAN_branch_audit_and_pr` (2026-08) found four real defects behind four green
gates, on pages `seo:check` had passed 492/492:

- `eventAttendanceMode` was a hardcoded constant, so four **online** meetups
  announced themselves to search engines as in-person events in Pereira;
- `startDate` was emitted as UTC midnight, which in UTC−5 renders as the evening
  **before** — every meetup on the site advertised the wrong day;
- the agent twins printed "0 charlas" for programmed months while the HTML card
  hid the count at zero, so page and twin disagreed on the same row.

**Therefore:** on any change that emits structured data or a twin row, read the
**built output** — parse the JSON-LD out of `dist/`, diff a twin row against the
card that renders the same data. `seo:check` asks whether an `Event` block
exists; only you can ask whether it is true.

### A hand-curated audit list rots, and nothing tells you

`scripts/responsive-audit/urls.json` is maintained by hand. Nothing fails when a
template is missing from it, so its coverage is only as good as the last person
to remember. When the same plan looked, it held 46 routes and **no
`meetup-detail` template at all** — the build produces **190** such routes, every
one audited at zero viewports. Two more of its routes pointed at a post since
marked `draft: true`: they returned **404**, the capture logged them `ok`, and CI
passed on them, because **a missing page has no overflow**.

**Therefore:** when a page template ships, add it to `urls.json` *and* to the
template allowlist inside `tests/e2e/responsive/overflow.spec.ts` — the list is
only the gate's input, and the allowlist downstream silently drops what it does
not name. Compare `urls.json` against `pnpm run responsive:inventory` output
after any routing change.

- [ ] Every new content file's slug is English, in both languages
- [ ] Every state the feature supports has at least one real entry, and the
      gates were re-run after it landed
- [ ] Structured data and twin rows verified against the **built output**, not
      the template
- [ ] New page templates added to `urls.json` **and** the `overflow.spec.ts`
      allowlist
