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
