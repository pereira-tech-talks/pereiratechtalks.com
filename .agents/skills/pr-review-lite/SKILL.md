---
name: pr-review-lite
description: Quick checklist review of a PR for style, obvious bugs, and missing tests. Use proactively for lightweight PR reviews.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Glob, Grep, Bash
model: haiku
# === Documentation (ignored by tools, useful for humans) ===
tier: 1
intent: review
---

# Skill: PR Review Lite

## Objective

Perform a quick, checklist-based review of a pull request focusing on style issues, obvious bugs, and code quality. This is a lightweight review, not a deep architectural analysis. Adapted for this repo: Astro, Svelte, TypeScript, Biome, AGENTS.md standards.

## Non-Goals

- Does NOT perform deep architectural review
- Does NOT rewrite code
- Does NOT make changes to the PR
- Does NOT review security-sensitive changes in depth

## Tier Classification

**Tier: 1** - Light/Cheap

**Reasoning:** Checklist-based review with pattern matching, no complex reasoning required. Read-only operation with no code changes.

## Inputs

### Required Parameters

- `$PR_FILES`: List of files changed in the PR (or PR URL/number)

### Optional Parameters

- `$FOCUS`: Specific areas to focus on (default: all)

## Prerequisites

- [ ] PR diff is accessible
- [ ] PR is not draft/WIP

## Steps

### Step 1: Read the PR

- Get list of changed files
- Read the diff for each file
- Note the scope of changes

### Step 2: Run Checklist

**Style & Formatting (this repo):**
- [ ] Consistent formatting (Biome)
- [ ] Follows naming conventions (see AGENTS.md)
- [ ] No commented-out code
- [ ] Import order follows convention

**Code Quality:**
- [ ] No obvious bugs
- [ ] TypeScript types used where practical
- [ ] Error handling present in API routes
- [ ] No hardcoded values that should be config

**Astro/Svelte Specific:**
- [ ] Svelte components use `client:*` directive when interactive
- [ ] Dark mode supported (Tailwind `dark:` classes)
- [ ] Content Collection schema followed
- [ ] Pages use Page wrapper pattern (thin wrappers in `src/pages/`, shared `*Page.astro` in `src/components/pages/`)
- [ ] Page wrappers do not import `MainLayout` directly

**Tests:**
- [ ] (Note: Testing not configured in this repo)
- [ ] If tests exist, they are meaningful

**Documentation:**
- [ ] Comments for complex logic
- [ ] README/docs updated if needed

### Step 3: Compile Results

- List all findings
- Categorize by severity (blocking / suggestion)
- Provide file/line references where possible

## Output Format

### Success Output

```
## ✅ PR Review Lite Complete

### Summary
{Brief summary of review}

### Findings
**Blocking:** {count}
- {finding 1}
- {finding 2}

**Suggestions:** {count}
- {suggestion 1}

### Checklist
- Style: ✅ / ⚠️ / ❌
- Code Quality: ✅ / ⚠️ / ❌
- Astro/Svelte: ✅ / ⚠️ / ❌
- Docs: ✅ / ⚠️ / ❌
```

## Guardrails

### Scope Limits

- Read-only; no code changes
- Focus on checklist items; escalate deep architecture to reviewer agent (Tier 2)

### Stop Conditions

**Escalate to Tier 2 (reviewer agent)** if:

- Security-sensitive code involved
- Architectural concerns
- Need for in-depth analysis

## Definition of Done

- [ ] Checklist completed
- [ ] Findings listed with severity
- [ ] Clear recommendation (approve / request changes / escalate)

## Astro-Specific Items

When reviewing Astro code:

1. **Components** - Check `.astro` vs `.svelte` usage is appropriate
2. **Content** - Frontmatter matches schema in `content.config.ts`
3. **Pages** - Page wrapper pattern (shared `*Page.astro` components handle `MainLayout` internally)
4. **API routes** - Error handling and response types
5. **Hydration** - `client:load` vs `client:visible` appropriate

## Related

- [reviewer](../../agents/reviewer.md) - For thorough code review
- [quick-fix](../quick-fix/SKILL.md) - For small fixes after review
