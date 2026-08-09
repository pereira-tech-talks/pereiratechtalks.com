---
name: audit-content-parity
description: Audit whether the Spanish and English versions of the same entry carry the same content — same sources, same structure, same bilingual fields. Runs the parity scanner, triages its six classes, and fixes them in the order that avoids re-work. Use after a content drop, a translation pass, or before a release.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Glob, Grep, Bash, Edit
model: sonnet
# === Documentation (ignored by tools, useful for humans) ===
tier: 2
intent: review
max-files: 20
max-loc: 400
---

# Skill: Audit Content Parity

## Objective

Prove that the two languages of every entry carry the **same content** — and fix
what does not.

This is **not** [`audit-language-integrity`](../audit-language-integrity/SKILL.md).
That skill asks *is this page in the language its URL promises?* This one asks
*do the two versions say the same thing?* A page passes the first and fails the
second whenever a Spanish body gains a paragraph, a source, or a whole talk that
its English sibling never gets — both remain correct in their own language,
which is exactly why nothing else catches it. When that gap was first measured,
**88 of 94 body pairs had drifted** while every existing gate stayed green.

Contract: [`docs/I18N_GUIDE.md` § Content parity](../../../docs/I18N_GUIDE.md).

The command is one line. This skill exists because the scanner reports six
classes that call for four different responses, and **fixing them in the wrong
order creates re-work**.

## Non-Goals

- Judging whether a page is in the right language → `audit-language-integrity`.
- Judging whether a `.md` twin is complete → `pnpm run md:check`.
- Writing new prose. Parity is restored from material the repository already
  holds. If it holds nothing, the entry stays short **in both languages** —
  see [`docs/WRITING_CRAFT_GUIDE.md`](../../../docs/WRITING_CRAFT_GUIDE.md).

## Tier Classification

Tier 2 — review and repair. Touches content files, never runtime code.

## Inputs

Optional: a collection or slug to focus on. With no argument, audits everything.

## Steps

### Step 1: Scan

```bash
pnpm run parity:check
```

Unlike its sibling gates this reads **`src/content/`, not `dist/`** — parity is a
property of the authored files, so no build is needed.

```bash
node scripts/audit-content-parity.mjs --report tmp/parity-audit
```

### Step 2: Read the six classes before touching anything

| Class | Means | Blocks CI | What to do |
|---|---|---|---|
| `content-loss` | a URL in one language, not the other | **yes** | Fix first. Never ambiguous. |
| `structural` | headings / list items / paragraph counts differ | **yes** | Fix second. |
| `field-missing` | a bilingual `{en,es}` field empty on one side | **yes** | Fix with the owning collection. |
| `field-pointer` | a field saying "see the Spanish abstract" | **yes** | Write the real translation. |
| `thin-both` | short in **both** languages | no | An archive gap, not a parity defect. Enrich only from repo data. |
| `field-skew` | one side ≥1.5× the other | no | **Read them.** Most are correct Spanish expansion. |

### Step 3: Fix in this order — it is not arbitrary

1. **`content-loss` first.** Structural edits made before content is settled get
   redone when a missing section arrives.
2. **`structural` second**, once the content is final.
3. **`thin-both` last**, and only from repository data.

### Step 4: The four traps

**A URL returning 200 is not the right URL.** Meetup.com resolves an event by ID
and ignores the group slug in the path, so `/pereira-tech-talks/events/{id}`
renders *any* event under our URL. 47 archive links returned 200 while showing
*Paleopalooza*, *Yoga for Teens 13-17*, a French NLP workshop. Verify the page is
the event you mean — match its JSON-LD `startDate` to the entry's `date` and its
`og:title` to the topic:

```bash
curl -sL -A 'Mozilla/5.0' "$URL" | grep -o '"startDate":"[^"]*"' | head -1
curl -sL -A 'Mozilla/5.0' "$URL" | grep -oE '<meta[^>]*property="og:title"[^>]*>'
```

For YouTube, use oEmbed — HTML scraping returns nothing for live videos:

```bash
curl -s "https://www.youtube.com/oembed?url=$URL&format=json"
```

**Never propagate a link before verifying it.** The instinct on
`only in EN: <url>` is to copy it to Spanish. Check it first: every English-only
URL in the first audit was fabricated or dead, and copying would have carried the
defect into the language that was correct.

**A metric can improve while the page gets worse.** Injecting 133 generated talk
abstracts of the form *"Charla de {speaker} en el meetup {title} de Pereira Tech
Talks"* cut thin pairs 42 → 4 and read as padding. Only 38 of 171 abstracts are
real. **Read the output, not just the number.**

**Verify the measuring tool before trusting a large count.** 86 of 111 structural
findings once came from the scanner's own regex eating a blank line. A finding
count that looks implausibly large usually is.

### Step 5: Re-scan and validate

```bash
pnpm run parity:check
pnpm run test && pnpm run biome:check && pnpm run astro:check && pnpm run build
pnpm run md:check:strict && pnpm run lang:check:strict && pnpm run seo:check:strict
```

## Validation

- `content-loss`, `structural`, `field-missing`, `field-pointer` all **0**.
- No body lost words — compare against `HEAD` before committing.
- `lang:check:strict` still 0 flagged: an edit meant to restore parity must not
  drop the wrong language into a body.

## Safety Checks

- **Never** reach parity by deleting from the richer language. Raise the poorer
  one, or record the gap.
- Spanish keeps its ñ and accents ([STANDARDS](../../../docs/STANDARDS.md)).
- Each body speaks one language: `### Fuentes` / `por` in Spanish,
  `### Sources` / `by` in English. Only the labels differ.

## Stop Conditions

Stop and ask if:

- Restoring parity would need a fact the repository does not hold.
- A source URL resolves to something other than what it claims — report it, do
  not guess a replacement.
- The two languages disagree on a **fact** (a different date, venue, or speaker)
  rather than on wording.

## Definition of Done

- [ ] `pnpm run parity:check` reports 0 in all four blocking classes
- [ ] Every `field-skew` survivor read by hand and justified
- [ ] Every URL added verified to resolve **to what it claims**
- [ ] No word count fell on either side
- [ ] `pnpm run test`, `biome:check`, `astro:check`, `build` pass
- [ ] `md:check:strict`, `lang:check:strict`, `seo:check:strict` pass

## Related

- [`audit-language-integrity`](../audit-language-integrity/SKILL.md) — the sibling
  question: is each page in the language its URL promises?
- [`translate-sync`](../translate-sync/SKILL.md) — translation quality.
- [`add-meetup`](../add-meetup/SKILL.md) — produces 1:1 bodies by construction.
- [`audit-post`](../audit-post/SKILL.md) — single-post quality review.

## Changelog

| Version | Date       | Changes |
| ------- | ---------- | ------- |
| 1.0.0   | 2026-08-09 | Initial skill: six-class triage, fix ordering, and the four traps found while bringing 94 pairs to parity. |
