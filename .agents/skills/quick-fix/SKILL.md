---
name: quick-fix
description: Fix small bugs and issues in 1-3 files following existing patterns. Use proactively for simple bug fixes.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: haiku
# === Documentation (ignored by tools, useful for humans) ===
tier: 1
intent: fix
max-files: 3
max-loc: 100
---

# Skill: Quick Fix

## Objective

Fix small bugs, typos, or issues in 1-3 files by following existing code patterns. This skill handles simple, mechanical fixes that don't require architectural decisions. Adapted for this repo: Astro, Svelte, TypeScript; follow AGENTS.md conventions.

## Non-Goals

- Does NOT refactor large sections of code
- Does NOT add new features
- Does NOT change architectural patterns
- Does NOT modify more than 3 files
- Does NOT handle security-sensitive code

## Tier Classification

**Tier: 1** - Light/Cheap

**Reasoning:** Small scope (1-3 files), low risk (follows patterns), mechanical task (no complex reasoning), quick execution.

## Inputs

### Required Parameters

- `$ISSUE`: Description of the bug or issue to fix
- `$FILES`: File(s) to examine/modify (optional - will search if not provided)

### Optional Parameters

- `$PATTERN`: Existing pattern to follow (default: infer from codebase)

## Prerequisites

Before running this skill, ensure:

- [ ] Working directory is clean (no uncommitted changes)
- [ ] Issue is clearly defined and small in scope
- [ ] No ongoing work on the same files

## Steps

### Step 1: Understand the Issue

- Read the issue description
- Identify the expected vs actual behavior
- Locate the relevant file(s)

### Step 2: Analyze the Code

- Read the affected file(s)
- Understand the existing pattern
- Identify the root cause

### Step 3: Implement the Fix

- Make the minimal change needed
- Follow existing code patterns exactly
- Preserve formatting and style
- Support dark mode if UI-related (use Tailwind's `dark:` variant)

### Step 4: Validate Changes

Run validation commands for this repo:

```bash
pnpm run biome:check
pnpm run astro:check
```

## Output Format

### Success Output

```
## ✅ Quick Fix Complete

### Issue
{Brief description of what was fixed}

### Changes
- `{file1}`: {what changed}
- `{file2}`: {what changed}

### Validation
- Biome: ✅ Clean
- TypeScript: ✅ Passing

### Commit Message
fix: {description}
```

### Failure Output

```
## ❌ Quick Fix Not Possible

### Reason
{Why this can't be fixed with quick-fix}

### Recommendation
{Escalate to Tier 2 or provide alternative}
```

## Guardrails

### Scope Limits

- **Maximum files:** 3
- **Maximum LOC:** 100
- **Allowed:** Any directory in src/
- **Forbidden:** Security-sensitive files

### Safety Checks

Before making changes:

- [ ] Change is minimal and targeted
- [ ] No architectural modifications
- [ ] Follows existing patterns (see AGENTS.md, docs/STANDARDS.md)
- [ ] No new dependencies added

### Stop Conditions

**Stop immediately** if:

- Issue requires more than 3 files
- Change exceeds 100 LOC
- Requires understanding complex business logic
- Requires adding new dependencies
- Existing patterns are unclear

## Definition of Done

- [ ] Issue is resolved
- [ ] `pnpm run biome:check` passes
- [ ] `pnpm run astro:check` passes
- [ ] Change follows existing patterns
- [ ] Change is minimal (no over-engineering)

## Escalation Conditions

**Escalate to Tier 2** if:

- Scope exceeds 3 files
- Root cause is complex
- Fix requires new patterns
- Tests need to be written (testing not configured)

**Escalation Path:**
1. Try to break into smaller fixes
2. If not possible, escalate to executor agent or feature-implement skill

## Examples

### Example 1: Fix a Typo

**Context:** Typo in component text

**Input:**
```
$ISSUE: Hero section says "Wellcome" instead of "Welcome"
$FILES: src/components/home/HeroSection/HeroSection.astro
```

**Execution:**
1. Open file, find typo, replace
2. Run `pnpm run biome:check` and `pnpm run astro:check`
3. Commit with `fix: correct typo in hero section`

### Example 2: Fix Dark Mode Issue

**Context:** Component doesn't support dark mode

**Input:**
```
$ISSUE: Footer text is invisible in dark mode
$FILES: src/components/Footer.astro
```

**Execution:**
1. Open file, add `dark:text-gray-100` classes
2. Run `pnpm run biome:check`
3. Commit with `fix: add dark mode support to footer`

### Example 3: Escalation

**Context:** Bug affects multiple components

**Input:**
```
$ISSUE: Blog pagination is broken across all tag pages
$FILES: src/pages/blog/tag/...
```

**Result:** Escalate — involves multiple files and complex routing logic; use Tier 2.

## Related

- [doc-edit](../doc-edit/SKILL.md) - Documentation-only fixes
- [type-fix](../type-fix/SKILL.md) - TypeScript type errors only
- [reviewer](../../agents/reviewer.md) - For reviewing fixes
