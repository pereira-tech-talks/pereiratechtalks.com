---
name: fix-lint
description: Fix Biome linting/formatting errors in 1-3 files using auto-fix and minimal manual edits. Use proactively for lint issues.
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

# Skill: Fix Lint

## Objective

Fix Biome linting and formatting errors in specified files: run `pnpm run biome:fix` (or equivalent), then resolve any remaining issues with minimal manual edits. Adapted for this repo: Astro, TypeScript, Biome; no logic changes; follow AGENTS.md conventions.

## Non-Goals

- Does NOT fix TypeScript type errors (use type-fix or Tier 2)
- Does NOT refactor logic or add features
- Does NOT modify more than 3 files
- Does NOT change behavior

## Tier Classification

**Tier: 1** - Light/Cheap

**Reasoning:** Mechanical fixes (formatting, rule compliance); small scope (1–3 files, <100 LOC); low risk.

## Inputs

### Required Parameters

- `$FILES`: File(s) to fix (paths or "current file"); optional — default to files reported by Biome

### Optional Parameters

- `$RULES`: Specific rules to focus on (default: all reported)

## Prerequisites

Before running this skill, ensure:

- [ ] No uncommitted changes or working on a dedicated branch
- [ ] Biome config is present (biome.json)

## Steps

### Step 1: Run Auto-Fix

```bash
pnpm run biome:fix
# or for specific files:
pnpm exec biome check --write "path/to/files"
```

### Step 2: Address Remaining Issues

- Read remaining Biome messages
- Apply minimal edits (e.g., add missing types, fix import order per AGENTS.md)
- Do not change logic

### Step 3: Validate

```bash
pnpm run biome:check
pnpm run astro:check
```

## Output Format

### Success Output

```
## ✅ Lint Fix Complete

### Files
- `{file1}`: {what was fixed}
- `{file2}`: {what was fixed}

### Validation
- pnpm run biome:check: ✅
- pnpm run astro:check: ✅

### Commit Message
style: fix Biome issues in {files}
```

### Escalation

```
## ❌ Fix Lint Not Enough

### Reason
{Remaining issues require type changes / refactor / many files}

### Recommendation
Escalate to Tier 2 or use quick-fix for logical issues.
```

## Guardrails

### Scope Limits

- **Maximum files:** 3
- **Maximum LOC changed:** 100
- **Allowed:** Style, import order, simple rule compliance

### Stop Conditions

**Stop and escalate** if:

- Fixes require logic changes or new types across many files
- More than 3 files need changes
- Auto-fix causes build failures (revert and escalate)

## Definition of Done

- [ ] `pnpm run biome:check` passes for modified files
- [ ] `pnpm run astro:check` passes
- [ ] No behavior change

## Related

- [quick-fix](../quick-fix/SKILL.md) - Small bug fixes
- [doc-edit](../doc-edit/SKILL.md) - Docs only
