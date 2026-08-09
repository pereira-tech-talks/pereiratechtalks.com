---
name: audit-language-integrity
description: Audit the sitewide language integrity of the build — Spanish URLs must render Spanish and English URLs English, in HTML and in the `.md` twin. Runs the scanner, triages its two-tier output, and orders the fixes. Use proactively after a content drop, a serializer change, or before a release.
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

# Skill: Audit Language Integrity

## Objective

Prove that every public URL renders the language its path promises — Spanish at
`/`, English at `/en` — in the **HTML and in the `.md` twin**, and fix what does
not.

The script is one command. This skill exists because **reading its output is the
hard part**: the scanner is a heuristic with two confidence tiers, its "false
positives" have repeatedly turned out to be classifier bugs, and the order you
fix defects in changes how many of them there are.

Contract and mechanism: [`docs/I18N_GUIDE.md`](../../../docs/I18N_GUIDE.md).

## Non-Goals

- Does NOT translate content — that is authoring work, and
  [`docs/WRITING_CRAFT_GUIDE.md`](../../../docs/WRITING_CRAFT_GUIDE.md) forbids
  inventing facts about past events.
- Does NOT add an allowlist, an ignore file, or a suppression comment. See
  "Never allowlist a false positive" below.
- Does NOT touch `.md` completeness (`pnpm run md:check`) or SEO
  (`pnpm run seo:check`) — sibling gates with their own contracts.

## Tier Classification

**Tier: 2** — Standard. Read-mostly analysis over the whole build, with bounded
content edits to close what it finds.

## Inputs

| Input | Required | Notes |
|---|---|---|
| A current build | yes | The scanner reads `dist/`, not `src/` |
| `$SCOPE` | no | A collection to focus on (`meetups`, `speakers`, …) |

## Steps

### Step 1: Build, then scan

```bash
pnpm run build
pnpm run lang:check
```

Read the summary before anything else:

```
   Audited:   482 pages
   Flagged:   0        ← defects (confidence >= 0.9 AND >= 2 markers)
   Review:    4        ← reported, never failed on
```

For a per-page report:

```bash
node scripts/audit-language-integrity.mjs --report tmp/lang-audit
```

### Step 2: Understand the two tiers before acting

- **Flagged** — a whole block confidently in the wrong language. These are
  defects. Measured precision **0.92**.
- **Review** — below the confidence line, almost always correct prose carrying
  an untranslated proper noun (`Session at Noche de DevOps`). Measured precision
  **0.08**. **Do not "fix" these** — you will damage correct content.

The scanner also has a documented **8-token floor**: blocks shorter than that
are not classified at all. A short wrong-language line will not be caught. That
is the price of not flagging every heading and venue name.

### Step 3: Fix in this order — it collapses the count fastest

1. **Bodies.** A missing `{slug}.en.md` sibling makes the whole English page
   Spanish. One file fixes dozens of blocks. Check first:
   ```bash
   for f in src/content/meetups/*.md; do
     case "$f" in *.en.md) continue;; esac
     [ -f "${f%.md}.en.md" ] || echo "missing EN body: $f"
   done
   ```
2. **Frontmatter titles.** A Spanglish `title.en` ("Web Development Moderno")
   surfaces on the detail page, the index, and every speaker who spoke there.
3. **Referenced collections.** Talk titles and abstracts render on meetup and
   speaker pages, so an untranslated `title.en` in `talks` leaks onto both.
4. **Section labels inside bodies.** `### Fuentes` vs `### Sources`, `por` vs
   `by`, `**Ponente:**` vs `**Speaker:**`.
5. **Rendered slugs.** A component printing `slug.replace(/-/g, ' ')` instead of
   the entry's title leaks a Spanish slug onto an English page. Grep for it.

### Step 4: Never allowlist a false positive

If a page looks correct but is flagged, the classifier is probably wrong — and
fixing the classifier is the required action, not suppressing the page.

Three "false positives" were documented and dismissed during
`PLAN_sitewide_language_seo_aeo_audit`; **all three were classifier bugs**, and
fixing them took the sitewide count from 3 flagged to 0:

| Symptom | Actual cause |
|---|---|
| An English sentence scored confidently Spanish | `(EN/ES)` lowercases into `en` + `es`, two of the strongest Spanish stopwords |
| A Reveal deck's `<figcaption>` scored as prose | `markdownToText` did not strip embedded HTML |
| A cited English book title in a Spanish post | `confidence` measured one-sidedness, so a single marker scored 1.00 |

The classifier is `src/lib/language-detect.ts`, covered by
`tests/unit/lib/language-detect.test.ts`. Add a regression test with the real
sentence when you change it.

### Step 5: Re-run and confirm

```bash
pnpm run build && pnpm run lang:check:strict   # must exit 0
pnpm run test                                  # the content-parity suites
```

## Validation

```bash
pnpm run build
pnpm run lang:check:strict
pnpm run md:check:strict
pnpm run test
pnpm run biome:check
```

## Safety Checks

- [ ] Only **flagged** pages were changed; **review**-tier pages left alone.
- [ ] No allowlist, ignore file, or suppression was added.
- [ ] Spanish edits keep their diacritics (Standards greps in
      [`docs/STANDARDS.md`](../../../docs/STANDARDS.md)).
- [ ] No fact was invented to fill a gap in a historical meetup.
- [ ] A classifier change ships with a regression test quoting the real sentence.

## Stop Conditions

**Stop and ask** if:

- A flagged page needs content that does not exist (an untranslated body for an
  event nobody recorded) — record the gap, do not invent it.
- The fix would change a proper noun, an event name, or a venue.
- Flagged count **rises** after a change — you have translated something that
  was already correct.

## Definition of Done

- [ ] `pnpm run lang:check:strict` exits 0
- [ ] Every remaining review-tier entry was eyeballed and is genuinely correct
- [ ] `pnpm run md:check:strict` still passes (twins follow the bodies)
- [ ] `pnpm run test` and `pnpm run biome:check` pass

## Related

- [`translate-sync`](../translate-sync/SKILL.md) — parity between language pairs
- [`add-meetup`](../add-meetup/SKILL.md) — writes both bodies for new meetups
- [`i18n-guardian`](../../agents/i18n-guardian.md) — reads this skill's report
- [`docs/I18N_GUIDE.md`](../../../docs/I18N_GUIDE.md) · [`docs/features/CONTENT_QA_CHECKLIST.md`](../../../docs/features/CONTENT_QA_CHECKLIST.md)

## Changelog

| Version | Date | Changes |
| ------- | ---- | ------- |
| 1.0.0 | 2026-08-09 | Initial skill, extracted from PLAN_sitewide_language_seo_aeo_audit (206 flagged pages → 0). |
