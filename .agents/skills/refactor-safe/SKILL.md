---
name: refactor-safe
description: Safe refactor in bounded scope (1-10 files, no behavior change). Use proactively for safe, bounded refactoring tasks.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
# === Documentation (ignored by tools, useful for humans) ===
tier: 2
intent: execute
max-files: 10
max-loc: 500
---

# Skill: Refactor Safe

## Objective

Refactor code in a bounded scope (1-10 files, up to ~500 LOC) without changing observable behavior. Extract functions, rename for clarity, reorder imports, split modules. Adapted for this repo: Astro, Svelte, TypeScript; follow docs/STANDARDS.md and AGENTS.md.

## Non-Goals

- Does NOT change public API or behavior
- Does NOT add new features
- Does NOT do large-scale or cross-module architecture changes
- Does NOT touch security-related logic without explicit scope

## Tier Classification

**Tier: 2** - Standard

**Reasoning:** Moderate reasoning (dependencies, component impact); scope 1-10 files, 100-500 LOC; safe, reversible refactors only.

## Inputs

### Required Parameters

- `$TARGET`: File(s) or directory to refactor (e.g., `src/components/blog/`)
- `$GOAL`: What to refactor (e.g., "extract helper", "rename for clarity", "split into smaller components")

### Optional Parameters

- `$CONSTRAINTS`: What not to change (e.g., "keep component props unchanged")

## Prerequisites

Before running this skill, ensure:

- [ ] Build passes (`pnpm run build`)
- [ ] Scope is clear and bounded (1-10 files)
- [ ] No concurrent changes to same files

## Steps

### Step 1: Establish Baseline

- Run build and note current behavior
- List files and dependencies in scope
- Identify what must not change (props, exports, behavior)

### Step 2: Plan Refactor

- Break into small steps (extract one function, then rename, etc.)
- Ensure each step keeps build working

### Step 3: Execute Step by Step

- One logical change at a time
- Run `pnpm run biome:check` and `pnpm run astro:check` after each step
- Commit after each step if desired (incremental commits)

### Step 4: Final Validation

```bash
pnpm run biome:check
pnpm run astro:check
pnpm run build
```

## Output Format

### Success Output

```
## ✅ Refactor Safe Complete

### Target
{What was refactored}

### Changes
- `{file1}`: {what changed}
- `{file2}`: {what changed}

### Behavior
- No intentional behavior change
- Build passes

### Validation
- pnpm run biome:check: ✅
- pnpm run astro:check: ✅
- pnpm run build: ✅

### Commit Message
refactor: {brief description}
```

## Guardrails

### Scope Limits

- **Maximum files:** 10
- **Maximum LOC changed:** 500
- **Allowed:** Extract, rename, reorder, split within same module/area

### Stop Conditions

**Stop and escalate** if:

- Public API or behavior must change
- More than 10 files or 500 LOC
- Build starts failing and root cause is unclear
- Data flow significantly affected

## Definition of Done

- [ ] Refactor goal achieved within scope
- [ ] `pnpm run biome:check` passes
- [ ] `pnpm run astro:check` passes
- [ ] `pnpm run build` passes
- [ ] No intentional behavior change

## Escalation Conditions

**Escalate to architect** if: cross-module design, API changes, or large-scale restructure needed.

## Examples

### Example 1: Extract Utility Function

**Input:**
```
$TARGET: src/components/blog/BlogGrid.svelte
$GOAL: Extract date formatting to lib/
```

**Execution:**
1. Create `src/lib/date.ts` with `formatDate` function
2. Update `BlogGrid.svelte` to import from lib/
3. Run validation
4. Commit with `refactor: extract date formatting to lib/`

### Example 2: Split Large Component

**Input:**
```
$TARGET: src/components/home/HeroSection/HeroSection.astro
$GOAL: Split into smaller subcomponents
```

**Execution:**
1. Identify logical sections
2. Create subcomponents (e.g., `HeroTitle.astro`, `HeroActions.astro`)
3. Import in main component
4. Run validation
5. Commit with `refactor: split HeroSection into subcomponents`

## Related

- [quick-fix](../quick-fix/SKILL.md) - Small fixes
- [write-tests](../write-tests/SKILL.md) - Add/expand tests
- [reviewer](../../agents/reviewer.md) - Review refactor
- [architect](../../agents/architect.md) - For design decisions
