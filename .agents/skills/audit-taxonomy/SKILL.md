---
name: audit-taxonomy
description: Audit the blog tag taxonomy — frequency analysis, orphan detection, hierarchy validation, and proposals for new subtopic tags. Read-only — proposes, never modifies tags or posts. Use proactively before each release cycle or after a content drop of 5+ posts.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Glob, Grep, Bash
model: sonnet
# === Documentation (ignored by tools, useful for humans) ===
tier: 2
intent: review
max-files: 0
max-loc: 0
---

# Skill: Audit Tag Taxonomy

## Objective

Run a comprehensive audit of the blog tag taxonomy and produce a structured proposal report. The audit checks tag frequency, identifies orphan tags, validates the parent hierarchy, and surfaces untagged-but-recurring technologies/concepts that may warrant new **subtopic** (tier-3) tags.

This is a **read-only** skill. It produces a markdown report and **never** creates tag files, edits post frontmatter, or modifies translations. Acting on the report is a separate decision the user makes — typically by following [`/add-blog-post`](../add-blog-post/SKILL.md) governance or by running a follow-up plan to backfill tags.

For the canonical governance rules (tiers, parenting, naming, quotas), see [`docs/features/BLOG_POSTS.md`](../../../docs/features/BLOG_POSTS.md).

## Non-Goals

- Does NOT create new tag files in `src/content/tags/`.
- Does NOT modify any blog post frontmatter.
- Does NOT add or edit translations in `src/lib/translations/`.
- Does NOT change UI components or styling.
- Does NOT enforce decisions — it proposes; the user reviews.

## Tier Classification

**Tier: 2** — Standard

**Reasoning:** Read-only analysis across the full blog corpus + tags collection + translations files. Produces a multi-section markdown report. Requires reasoning to filter "passing mention" vs "focus" candidates and to suggest parents and quotas. Moderate scope.

## Inputs

### Optional Parameters

- `$THRESHOLD`: minimum number of posts mentioning a candidate tech for it to be proposed as a new subtopic. Default: `3`.
- `$DATE`: date stamp for the report filename. Default: today (`YYYY-MM-DD`).

## Prerequisites

Before running this skill:

- [ ] `src/content/blog/{en,es}/` exist with at least 10 posts.
- [ ] `src/content/tags/` exists.
- [ ] `src/lib/translations/{en,es}.ts` exist.

## Reference Documentation

- [Blog Posts Guide § Tags](../../../docs/features/BLOG_POSTS.md) — governance rules.
- [add-blog-post skill](../add-blog-post/SKILL.md) — canonical post-authoring procedure (uses tag governance).
- The original tier-3 design spec (if present): `.agent_commands/agent_deep_work_plans/results/plans/PLAN_implement_third_level_tags_taxonomy/analysis_results/TIER_3_DESIGN_SPEC.md`.

## Steps

### Step 1: Inventory the corpus

Count posts in `src/content/blog/en/**/*.md*` excluding `_demo/` and `_drafts/`. Verify EN/ES parity (each EN post has an ES counterpart with the same tag list).

### Step 2: Tag frequency table

Parse `tags:` arrays from frontmatter for the EN corpus (ES tag arrays should mirror EN per the parity rule). Build a sorted top-N table with: slug, tier (looked up from `src/content/tags/<slug>.md` `tier:` field), count, sample posts.

### Step 3: Detect orphan tags

A tag with **count = 1** is an orphan unless it is a deliberate seed (e.g., the first post of a new series). Flag orphans for review. Note in the report which orphans look intentional vs which look like one-off mistakes.

### Step 4: Validate hierarchy

For each tag in `src/content/tags/`:

- Check `parent` resolves to a known tag.
- Check primary tags have no `parent`.
- Check secondary tags' parent is a primary tag.
- Check subtopic tags have a parent, and that parent is secondary (preferred) or primary (fallback — flag for review).

This mirrors the build-time `validateTagHierarchy()` in `src/lib/blog.ts` but reports findings in the audit document. (The build will warn anyway; the audit summarizes them in one place.)

### Step 5: Untagged-recurring-concept scan

Use a curated list of candidate technologies (extend as the corpus grows). The starting set:

```
astro, svelte, cloudflare, golang, graphql, vue, django, docker, tensorflow,
mongodb, spark, react, nextjs, kotlin, java, php, rust, openclaw, openai,
anthropic, mcp, prolog, racket, meteor, aframe, webvr, tradingview, websocket,
tailwind, biome, terraform, kubernetes
```

For each candidate:
1. Run case-insensitive regex over post titles + body content.
2. Count posts where at least one match exists.
3. **Editorial filter:** for candidates above the count threshold, eyeball at least 5 sample posts. Mark each as "focus" or "passing mention". Reject candidates whose mentions are predominantly passing tech-listings.
4. If a candidate would duplicate an existing secondary tag (e.g., `python-lang` vs `python`), reject.

### Step 6: Generate candidate proposals

For each candidate that passes Step 5's filters:

- Slug (lowercase, kebab-case, English-only).
- Proposed parent (existing secondary preferred; primary fallback flagged).
- EN + ES name + description (≤ 1 sentence each).
- List of posts that should receive the tag (file paths, EN side — ES counterparts mirror).
- Per-post quota check: would adding this tag exceed the 5-tag cap? If yes, propose a tag to demote (lowest tier first; never primary).

### Step 7: Write the report

Output to `tmp/audit-taxonomy/{YYYY-MM-DD}_taxonomy_audit.md`. Sections:

1. **Methodology** — corpus size, threshold, tools used.
2. **Tag frequency table** — top 30+, with tier and count.
3. **Orphan tags** — list with context.
4. **Hierarchy validation** — any warnings.
5. **Untagged recurring concepts** — full table with verdict per candidate.
6. **Recommended subtopic tags** — final list with parents, names, descriptions, post lists, demotion notes.
7. **Decline list** — one-line rationale per declined candidate.
8. **Summary** — counts and a one-paragraph "what to do next".

### Step 8: Hand off

The skill ends with a clear pointer to the report path. The user reviews and decides whether to:
- Open a deep work plan to apply recommendations.
- Adjust the threshold and re-run.
- Defer.

## Output Format

The skill writes ONE file: `tmp/audit-taxonomy/{YYYY-MM-DD}_taxonomy_audit.md`. The path is git-ignored per the repo's `tmp/` convention — this is intentional, the report is ephemeral.

### Success Output (printed to console)

```
✓ Audit complete.

Report: tmp/audit-taxonomy/2026-05-09_taxonomy_audit.md

Summary:
- Posts analyzed: {N}
- Existing tags: {primary} primary + {secondary} secondary + {subtopic} subtopic
- Orphan tags flagged: {count}
- Hierarchy warnings: {count}
- Subtopic candidates recommended: {count}
- Subtopic candidates declined: {count}

Next: review the report, then either open a backfill plan or adjust the
threshold and re-run with different inputs.
```

### Failure Output

If the corpus is too small (< 10 posts) or `src/content/tags/` is missing, abort with a clear message:

```
✗ Audit aborted.

Reason: {specific reason}.

Required state:
- src/content/blog/en/ exists with ≥ 10 published posts
- src/content/tags/ exists
- src/lib/translations/{en,es}.ts exist
```

## Guardrails

### Scope Limits

- **Maximum files modified:** 0 (read-only).
- **Maximum LOC changed:** 0.
- **Allowed directories:** `tmp/audit-taxonomy/` (output only).
- **Forbidden directories:** `src/`, `docs/`, `.agents/` (read-only access).

### Safety Checks

Before producing the report:

- [ ] Confirm `src/content/blog/en/` and `src/content/tags/` are readable.
- [ ] Confirm the script runs in dry-run mode (no writes to `src/`).
- [ ] Confirm output path is under `tmp/`.

### Stop Conditions

**Stop immediately** and report if:

- The corpus has fewer than 10 published posts (signal too noisy for a meaningful audit).
- `src/content/tags/` is missing or empty.
- Any source file is opened in write mode (a bug — abort and surface).

## Definition of Done

This skill is complete when:

- [ ] The audit report is written to `tmp/audit-taxonomy/{YYYY-MM-DD}_taxonomy_audit.md`.
- [ ] The report has all 8 sections from Step 7.
- [ ] No file under `src/`, `docs/`, or `.agents/` was modified.
- [ ] The console summary lists post count, candidate counts, and the report path.

## Escalation Conditions

**Escalate (ask the user) if:**

- The corpus shows hierarchy violations that would affect existing posts (e.g., a primary tag was retroactively demoted).
- A candidate appears in 30+ posts (suggests a missed secondary-tier promotion, not a subtopic).
- More than 10 candidates pass all filters at the default threshold (the user may want to stagger backfill across multiple plans).

## Examples

### Example 1: Routine quarterly audit

**Context:** It's been 3 months since the last audit. The user wants a refreshed picture.

**Input:**
```
$THRESHOLD: 3 (default)
```

**Execution:** Skill runs all 8 steps. Finds 2 new candidate technologies above the threshold (`langgraph`, `vercel`).

**Output:** `tmp/audit-taxonomy/2026-08-01_taxonomy_audit.md` with the candidate list and per-post recommendations.

### Example 2: After a large content drop

**Context:** User added 8 posts in the past week (a new series).

**Input:**
```
$THRESHOLD: 2 (lowered to surface emerging concepts faster)
```

**Execution:** Skill catches a new series-driven subtopic candidate that wouldn't pass the default threshold.

### Example 3: Escalation

**Context:** A candidate (`mcp`) appears in 30+ posts.

**Result:** Escalated. The skill flags this in the report and asks the user whether to promote `mcp` from a candidate-subtopic to a new SECONDARY tag — a structural change beyond the skill's scope.

## Related Skills/Agents

- [`add-blog-post`](../add-blog-post/SKILL.md) — uses the tag governance enforced by this audit's recommendations.
- [`audit-post`](../audit-post/SKILL.md) — per-post audit (orthogonal: post-level health vs. taxonomy-level).
- [`audit-series`](../audit-series/SKILL.md) — series-level audit; uses tag hierarchy for cross-post consistency.
- [`i18n-guardian`](../../agents/i18n-guardian.md) — verifies EN/ES tag parity if the audit surfaces drift.

## Changelog

| Version | Date       | Changes                                                              |
| ------- | ---------- | -------------------------------------------------------------------- |
| 1.0.0   | 2026-05-09 | Initial version. Created during PLAN_implement_third_level_tags_taxonomy. |
