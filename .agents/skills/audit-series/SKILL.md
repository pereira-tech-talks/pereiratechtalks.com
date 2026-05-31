---
name: audit-series
description: Pre-publication audit for blog series — validates series definition, post ordering, cross-post consistency, navigation, and runs individual post audits for all posts in the series. Use proactively before publishing any blog series.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Glob, Grep, Bash
model: sonnet
argument-hint: "[series-slug]"
# === Documentation (ignored by tools, useful for humans) ===
tier: 2
intent: review
max-files: 0
max-loc: 0
---

# Skill: Audit Blog Series

## Objective

Run a comprehensive pre-publication audit on a blog series, checking the series definition, post ordering, cross-post consistency, i18n parity, individual post health, and build validation. Produces a structured PASS/FAIL/WARN report with a final verdict: **SERIES READY TO PUBLISH** or **NEEDS FIXES**.

This is a **read-only** skill. It inspects files and reports findings. It does not modify any files.

For individual post deep-review, use [`/audit-post`](../audit-post/SKILL.md). This skill complements audit-post by validating series-level concerns that span multiple posts.

## Non-Goals

- Does NOT fix issues (use `/quick-fix`, `/fix-lint`, `/translate-sync`, or manual edits)
- Does NOT create or modify blog posts (use `/add-blog-post`)
- Does NOT create or modify series definitions
- Does NOT optimize images (use `/optimize-image`)
- Does NOT run a full individual audit-post for each post (recommends doing so separately)

## Tier Classification

**Tier: 2** - Standard

**Reasoning:** Requires reading the series definition, discovering and cross-referencing multiple blog posts across two languages, validating ordering invariants, checking frontmatter consistency, running summary checks on each post, and producing a structured multi-post report. Moderate reasoning for interpreting cross-post relationships.

## Inputs

### Required Parameters

- `$SERIES_SLUG`: Series slug (kebab-case identifier matching a file in `src/content/series/`). If omitted, the skill MUST list available series and ask the user which one to audit before proceeding.

## Prerequisites

Before running this skill, ensure:

- [ ] Series definition file exists in `src/content/series/`
- [ ] At least one blog post references this series
- [ ] Node modules are installed (`node_modules/` exists)

## Reference Documentation

- **[Blog Posts Guide](../../../docs/features/BLOG_POSTS.md)** — Series architecture, frontmatter schema, series navigation
- **[SEO Guide](../../../docs/SEO.md)** — Meta tags, keywords, character limits
- **[Accessibility Guide](../../../docs/ACCESSIBILITY.md)** — Contrast, alt text, heading hierarchy
- **[Writing Voice Guide](../../../docs/WRITING_VOICE_GUIDE.md)** — AI slop blocklist, voice patterns, placeholder checks
- **[Blog Content Lifecycle](../../../docs/features/BLOG_CONTENT_LIFECYCLE.md)** — Published, scheduled, demo visibility
- **[Content Config](../../../src/content.config.ts)** — Series and blog Zod schemas

## Steps

### Step 0: Resolve Series

1. If `$SERIES_SLUG` is not provided, list all available series from `src/content/series/` and ask the user which one to audit. Stop until they respond.
2. Verify the series definition file exists at `src/content/series/${SERIES_SLUG}.md`.
3. If the file does not exist, report an error and stop.
4. Read the series definition file completely.

```bash
# List all available series
ls src/content/series/

# Check if the specific series exists
ls src/content/series/${SERIES_SLUG}.md
```

### Step 1: Series Definition Validation

Check the series definition file against the schema in `src/content.config.ts`:

| Check | Rule | Severity |
|-------|------|----------|
| `name` | Present, non-empty, matches the filename slug | FAIL if missing or mismatched |
| `title` | Present, non-empty | FAIL if missing |
| `description` | Present, 130-160 characters (count exact) | FAIL if missing; FAIL if outside range |
| `keywords` | Present, array, 5-8 items | WARN if missing; WARN if outside 5-8 range |
| `heroImage` | If set, referenced file exists at `public${heroImage}` | WARN if missing field; FAIL if path is set but file does not exist |
| `order` | Present, numeric | WARN if missing (defaults to 0) |

**Character counting for description:**
```bash
# Count exact characters
echo -n "DESCRIPTION_TEXT_HERE" | wc -c
```

Report the exact character count for the series description.

### Step 2: Discover All Posts in Series

1. Search all blog posts (EN and ES) for `series: "${SERIES_SLUG}"` in frontmatter.
2. List all found posts with their `seriesOrder` values, file paths, and language.
3. Verify each post exists in both EN and ES.

```bash
# Find all posts in this series (EN)
grep -rl "series: \"${SERIES_SLUG}\"" src/content/blog/en/ --include="*.md" --include="*.mdx"

# Find all posts in this series (ES)
grep -rl "series: \"${SERIES_SLUG}\"" src/content/blog/es/ --include="*.md" --include="*.mdx"
```

| Check | Rule | Severity |
|-------|------|----------|
| Posts found | At least 1 post references this series | FAIL if zero posts found |
| EN/ES parity | Every EN post has a matching ES post (same filename) | FAIL if any post missing in one language |
| Post count | Report total unique posts in the series | INFO |

**Note:** A series with only 1 post is valid — series can start with one post and grow over time.

### Step 3: Post Ordering Validation

Extract `seriesOrder` from each post's frontmatter and validate the sequence:

```bash
# Extract seriesOrder values from EN posts
grep -A1 "series: \"${SERIES_SLUG}\"" src/content/blog/en/*.md src/content/blog/en/*.mdx 2>/dev/null | grep "seriesOrder:"
```

| Check | Rule | Severity |
|-------|------|----------|
| `seriesOrder` present | Every post in the series has a `seriesOrder` value | FAIL if any post is missing `seriesOrder` |
| Starts at 1 | The lowest `seriesOrder` is 1 | FAIL if starts at 0 or another number |
| No gaps | Values are sequential (1, 2, 3... not 1, 3, 5) | FAIL if gaps exist |
| No duplicates | No two posts share the same `seriesOrder` | FAIL if duplicates found |
| EN/ES match | `seriesOrder` is identical in EN and ES versions of each post | FAIL if mismatch |

Report the ordered list of posts:
```
Post 1: {slug} (seriesOrder: 1)
Post 2: {slug} (seriesOrder: 2)
...
```

### Step 4: Cross-Post Consistency

For all posts in the series, check consistency:

| Check | Rule | Severity |
|-------|------|----------|
| Same `series` slug | All posts reference exactly `"${SERIES_SLUG}"` | FAIL if any mismatch |
| All have `seriesOrder` | No post has `series` without `seriesOrder` | FAIL if missing |
| Consistent primary tags | All posts share the same primary tags (from the tags collection where `tier: primary`) | WARN if primary tags differ across posts |
| `pubDate` ordering | Post with `seriesOrder: N` has a `pubDate` on or before post with `seriesOrder: N+1` | WARN if publication order does not match series order |
| No series self-references in Resources | No post lists other posts from the same series in its Resources/Recursos section (series navigation handles this automatically) | WARN if series posts found in Resources |

**pubDate ordering check:**
```bash
# Extract pubDate and seriesOrder for comparison
grep -E "^(pubDate|seriesOrder):" src/content/blog/en/*_*.md | sort
```

**Resources section check:**
```bash
# Check for links to other series posts in Resources sections
# Look for slug patterns of other posts in the series
```

### Step 5: i18n Parity for Series

| Check | Rule | Severity |
|-------|------|----------|
| All posts bilingual | Every post exists in both `src/content/blog/en/` and `src/content/blog/es/` | FAIL if any post missing |
| Same filenames | EN and ES use identical filenames for each post | FAIL if filename mismatch |
| Same `seriesOrder` | EN and ES versions of each post have the same `seriesOrder` | FAIL if mismatch |
| Same `tags` | EN and ES versions of each post have the same `tags` array | FAIL if different |
| Same `pubDate` | EN and ES versions of each post have the same `pubDate` | FAIL if different |
| Correct link prefixes | EN posts use `/blog/` links, ES posts use `/es/blog/` links | WARN if wrong prefix |

**Note:** The series definition file itself does not need i18n — series titles are translated via the translation files (`src/lib/translations/{en,es}.ts`).

```bash
# Compare frontmatter between EN and ES for each post
# For each post slug in the series:
head -15 src/content/blog/en/*_${POST_SLUG}.md
head -15 src/content/blog/es/*_${POST_SLUG}.md
```

### Step 6: Individual Post Audits (Summary)

For each post in the series, run the following summary checks. These are a subset of the full `/audit-post` checks — enough to catch blocking issues without duplicating the full audit.

**For each post (both EN and ES):**

| Check | Rule | Severity |
|-------|------|----------|
| `title` | Present, non-empty | FAIL if missing |
| `description` | Present, 130-160 characters | FAIL if outside range |
| `tags` | Present, max 5, all exist in `src/content/tags/` | FAIL if tag does not exist |
| `keywords` | Present, 5-8 entries | WARN if missing or outside range |
| Hero image exists | If `heroImage` is set, file exists at `public${heroImage}` | FAIL if path set but file missing |
| Images are WebP | Post images in `public/images/blog/posts/{slug}/` are `.webp` | WARN if non-WebP found |
| No placeholder content | Zero matches for `[AUTHOR:`, `[AUTOR:`, `[TODO:`, `[TBD]`, `[FIXME]` | FAIL if any found |
| Spanish diacritical marks | ES version uses proper accents (no `pequeno`, `tamano`, `diseno`, etc.) | FAIL if common words missing accents |
| No voseo | ES version uses tuteo only (no `tenés`, `podés`, `sabés`, etc.) | FAIL if voseo found |
| Heading hierarchy | No skipped levels (e.g., `##` followed by `####`) | FAIL if skipped |

```bash
# Check placeholders across all series posts
grep -rn '\[AUTHOR:\|\[AUTOR:\|\[TODO:\|\[TBD\]\|\[FIXME\]' src/content/blog/en/*_${POST_SLUG}.md src/content/blog/es/*_${POST_SLUG}.md

# Check diacritical marks in ES
grep -rn 'pequeno\|tamano\|diseno\|espanol\|manana\|analisis\|numero\|codigo\|ejecucion\|version\|pagina\|titulo' src/content/blog/es/*_${POST_SLUG}.md

# Check voseo in ES
grep -rn 'tenés\|podés\|sabés\|querés\|hacés\|buscás\|necesitás\|decís' src/content/blog/es/*_${POST_SLUG}.md

# Check heading hierarchy
grep -n '^#' src/content/blog/en/*_${POST_SLUG}.md
```

**6b. Writing voice & tone consistency (across series):**

Read the **[Writing Voice Guide](../../../docs/WRITING_VOICE_GUIDE.md)** and check that ALL posts in the series maintain consistent voice:

| Check | Rule | Severity |
|-------|------|----------|
| Consistent authority style | All posts use first-person lived experience, not abstract citations | WARN if any post shifts to impersonal |
| Consistent tone | No post shifts dramatically in register (e.g., casual → academic) | WARN if tone inconsistency detected |
| AI slop vocabulary | No words from the AI vocabulary blocklist in any post | WARN if found |
| Specificity maintained | All posts use real names, numbers, places — not vague references | WARN if any post is too generic |
| No marketing language | Body text avoids sales-pitch tone across all posts | WARN if detected |

```bash
# Check AI slop vocabulary across all series posts
for POST_SLUG in ${POST_SLUGS}; do
  echo "=== ${POST_SLUG} ===" && grep -rni 'genuinely\|comprehensive\|best-in-class\|beautifully\|radical premise\|worth highlighting\|worth calling out\|key insight\|key takeaway\|this is where.*shines\|game-changer\|revolutionary\|leveraging\|harnessing' src/content/blog/en/*_${POST_SLUG}.md src/content/blog/es/*_${POST_SLUG}.md
done
```

**Important:** This is a summary check. For deep review of any individual post (including full voice analysis), recommend running `/audit-post {slug}` separately.

### Step 7: Navigation & Build

Run the project build to verify series navigation renders correctly:

```bash
pnpm run build 2>&1 | tail -30
```

| Check | Rule | Severity |
|-------|------|----------|
| Build passes | `pnpm run build` exits with code 0 | FAIL if build fails |
| No series warnings | No build warnings mentioning any post in the series | WARN if warnings found |

### Step 8: Final Report

Generate a summary report using the format below.

## Output Format

### Success Output (SERIES READY TO PUBLISH)

```
## Series Audit: {series-slug}

### Series Overview
- **Name:** {title}
- **Total Posts:** {count}
- **Status:** All posts published / {N} scheduled
- **Definition:** `src/content/series/{slug}.md`

### Post Summary

| # | Slug | EN | ES | Frontmatter | Images | Content | i18n |
|---|------|----|----|-------------|--------|---------|------|
| 1 | post-slug-1 | PASS | PASS | PASS | PASS | PASS | PASS |
| 2 | post-slug-2 | PASS | PASS | PASS | PASS | PASS | PASS |
| 3 | post-slug-3 | PASS | PASS | PASS | PASS | PASS | PASS |

### Series-Level Checks

| Category              | Status | Details                               |
|-----------------------|--------|---------------------------------------|
| Series Definition     | PASS   | Description: 148 chars, 7 keywords    |
| Post Ordering         | PASS   | 1-2-3, sequential, no gaps            |
| Cross-Post Consistency| PASS   | Tags consistent, pubDate order OK     |
| i18n Parity           | PASS   | All posts bilingual                   |
| Individual Posts      | PASS   | All posts pass summary checks         |
| Build                 | PASS   | Build succeeded                       |

### Blocking Issues (FAIL)
None

### Warnings (WARN)
None

### Suggestions (INFO)
- For deep review of each post, run `/audit-post {slug}` individually

### Verdict: SERIES READY TO PUBLISH
```

### Failure Output (NEEDS FIXES)

```
## Series Audit: {series-slug}

### Series Overview
- **Name:** {title}
- **Total Posts:** {count}
- **Status:** {N} published, {M} scheduled
- **Definition:** `src/content/series/{slug}.md`

### Post Summary

| # | Slug | EN | ES | Frontmatter | Images | Content | i18n |
|---|------|----|----|-------------|--------|---------|------|
| 1 | post-slug-1 | PASS | PASS | PASS | PASS | PASS | PASS |
| 2 | post-slug-2 | PASS | FAIL | FAIL | PASS | PASS | FAIL |
| 3 | post-slug-3 | PASS | PASS | PASS | WARN | FAIL | PASS |

### Series-Level Checks

| Category              | Status | Details                                       |
|-----------------------|--------|-----------------------------------------------|
| Series Definition     | FAIL   | Description: 172 chars (max 160)              |
| Post Ordering         | FAIL   | Gap: seriesOrder jumps from 1 to 3            |
| Cross-Post Consistency| WARN   | Post 2 has different primary tags              |
| i18n Parity           | FAIL   | post-slug-2 missing ES version                |
| Individual Posts      | FAIL   | 2 posts have blocking issues                  |
| Build                 | PASS   | Build succeeded                               |

### Blocking Issues (FAIL) -- Must fix before publishing
1. **Series Definition:** Description is 172 characters (must be 130-160)
2. **Post Ordering:** seriesOrder gap — jumps from 1 to 3 (missing seriesOrder 2)
3. **i18n Parity:** `post-slug-2` has no ES version at `src/content/blog/es/`
4. **Post 2 (post-slug-2):** ES description is 168 chars (must be 130-160)
5. **Post 3 (post-slug-3):** Placeholder `[TODO: add conclusion]` found in EN at line 89

### Warnings (WARN) -- Should fix
1. **Cross-Post Consistency:** Post 2 uses tags `[tech, ai]` while posts 1 and 3 use `[tech, web-development]`
2. **Post 3 (post-slug-3):** Non-WebP image found in `public/images/blog/posts/post-slug-3/`

### Suggestions (INFO)
- For deep review of each post, run `/audit-post {slug}` individually

### Verdict: NEEDS FIXES (5 blocking, 2 warnings)
```

## Guardrails

### Scope Limits

- **Maximum files:** 0 (read-only, no modifications)
- **Maximum LOC:** 0 (no code changes)
- **Allowed directories:** `src/content/blog/`, `src/content/series/`, `src/content/tags/`, `public/images/blog/` (read-only)
- **Forbidden actions:** Creating, editing, or deleting any files

### Safety Checks

- [ ] This skill is read-only — it MUST NOT modify any files
- [ ] Build validation runs against the entire project, not just the series
- [ ] Report clearly distinguishes FAIL (blocking) from WARN (non-blocking) from INFO (suggestions)

### Stop Conditions

**Stop immediately** and report if:

- Series definition file cannot be found for the given slug
- Zero posts reference the series (empty series with no content)
- User has not provided a slug and has not responded to the prompt asking for one

## Definition of Done

This skill is **complete** when ALL of the following are true:

- [ ] All 9 steps (Step 0 through Step 8) have been executed
- [ ] Every check has a clear PASS, FAIL, WARN, or INFO status
- [ ] The final report is generated with both the per-post summary table and the series-level checks table
- [ ] All blocking issues are listed with specific file locations
- [ ] A final verdict is rendered (SERIES READY TO PUBLISH or NEEDS FIXES)
- [ ] No files have been modified

## Escalation Conditions

**Escalate to user** if:

- Build fails for reasons unrelated to the audited series
- Posts use MDX with custom components that cannot be statically analyzed
- Series has posts in `_demo/` folders (demo posts are not published — auditing may not apply)
- Frontmatter contains fields not in the standard schema

## Examples

### Example 1: Clean Series

**Input:**
```
$SERIES_SLUG: the-library-of-tomorrow
```

**Result:** Series definition valid, 8 posts found, ordering 1-8 sequential, all posts bilingual, all summary checks pass, build succeeds. Verdict: SERIES READY TO PUBLISH.

### Example 2: Series with Issues

**Input:**
```
$SERIES_SLUG: trading-journey
```

**Result:** Series definition description too short (89 chars), seriesOrder gap (1, 2, 4 — missing 3), one post missing ES version. Verdict: NEEDS FIXES (3 blocking).

### Example 3: No Slug Provided

**Input:**
```
/audit-series
```

**Result:** Skill lists available series and asks: "Which series would you like to audit? Available series: `the-library-of-tomorrow`, `working-with-agents`, `aeo-from-invisible-to-cited`."

### Example 4: Series Not Found

**Input:**
```
$SERIES_SLUG: nonexistent-series
```

**Result:** Error — no file found at `src/content/series/nonexistent-series.md`. Stopped.

### Example 5: Single-Post Series

**Input:**
```
$SERIES_SLUG: new-tutorial
```

**Result:** Series definition valid, 1 post found (seriesOrder: 1), all checks pass. Verdict: SERIES READY TO PUBLISH. Note: series currently has only 1 post — this is valid, the series can grow over time.

## Related Skills/Agents

- [`audit-post`](../audit-post/SKILL.md) — Deep audit for individual posts. Use `/audit-post {slug}` for comprehensive review of each post in the series. audit-series runs summary checks; audit-post runs the full 10-step review.
- [`add-blog-post`](../add-blog-post/SKILL.md) — Creates blog posts (run audit-series after adding posts to a series)
- [`translate-sync`](../translate-sync/SKILL.md) — Fix i18n parity issues found by audit
- [`optimize-image`](../optimize-image/SKILL.md) — Fix image format/size issues found by audit
- [`quick-fix`](../quick-fix/SKILL.md) — Fix small issues found by audit
- [`fix-lint`](../fix-lint/SKILL.md) — Fix formatting issues
- [`content-writer`](../../agents/content-writer.md) — Rewrite content to fix voice/quality issues
- [`i18n-guardian`](../../agents/i18n-guardian.md) — Verify translation quality for issues found by audit
- [`reviewer`](../../agents/reviewer.md) — Broader code review (audit-series is blog-specific)

## Changelog

> **Policy:** Keep only the 3 most recent entries. When adding a new entry, remove the oldest.

| Version | Date       | Changes |
| ------- | ---------- | ------- |
| 1.0.0   | 2026-03-23 | Initial version — 9-step comprehensive series audit covering series definition, post discovery, ordering validation, cross-post consistency, i18n parity, individual post summary checks, build validation, and final report. |
