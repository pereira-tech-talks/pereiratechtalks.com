---
name: type-fix
description: Fix TypeScript type errors in 1-3 files (explicit types, prefer no any). Use proactively for TypeScript type issues.
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

# Skill: Type Fix

## Objective

Fix TypeScript compilation errors related to types in 1-3 files: add explicit type annotations, fix return types and argument types. Adapted for this repo: Astro, Svelte, TypeScript; follow AGENTS.md and existing type patterns in `src/lib/types.ts`.

## Non-Goals

- Does NOT refactor logic or add features
- Does NOT change runtime behavior
- Does NOT modify more than 3 files
- Does NOT introduce new type files without agreement

## Tier Classification

**Tier: 1** - Light/Cheap

**Reasoning:** Mechanical type fixes in small scope; low risk; pattern-following (existing types in lib/).

## Inputs

### Required Parameters

- `$FILES`: File(s) with type errors (or "current file" / leave empty to use compiler output)
- `$ERRORS`: Optional — specific error messages or `astro check` output

### Optional Parameters

- `$CONTEXT`: Related type definitions to reuse (e.g., from `src/lib/types.ts`)

## Prerequisites

Before running this skill, ensure:

- [ ] Type errors are from TypeScript compiler or IDE (not runtime)
- [ ] No uncommitted changes or working on a dedicated branch

## Steps

### Step 1: Identify Errors

- Run `pnpm run astro:check` or read IDE errors for the target files
- List missing types, incompatible signatures

### Step 2: Apply Type Fixes

- Add explicit parameter and return types
- Use types from `src/lib/types.ts` or Astro's built-in types
- Use `import type` for type-only imports
- Fix generic parameters if needed
- Do not change logic

### Step 3: Validate

```bash
pnpm run astro:check
pnpm run biome:check
```

## Output Format

### Success Output

```
## ✅ Type Fix Complete

### Files
- `{file1}`: {what was fixed}
- `{file2}`: {what was fixed}

### Validation
- TypeScript: ✅ No errors
- pnpm run astro:check: ✅
- pnpm run biome:check: ✅

### Commit Message
fix: resolve TypeScript types in {files}
```

### Escalation

```
## ❌ Type Fix Not Enough

### Reason
{Errors require new type definitions / many files / architectural types}

### Recommendation
Escalate to Tier 2 or architect for type design.
```

## Guardrails

### Scope Limits

- **Maximum files:** 3
- **Maximum LOC changed:** 100
- **Allowed:** Annotations, using existing types from lib/types.ts

### Stop Conditions

**Stop and escalate** if:

- New shared types needed
- More than 3 files affected
- Changes affect component API surface

## Definition of Done

- [ ] No TypeScript errors in target files
- [ ] `pnpm run astro:check` passes
- [ ] `pnpm run biome:check` passes

## Common Astro Types

```typescript
// Built-in Astro types
import type { APIRoute } from 'astro';
import type { CollectionEntry } from 'astro:content';

// Content Collection types
type BlogPost = CollectionEntry<'blog'>;
type TagEntry = CollectionEntry<'tags'>;

// Component props
interface Props {
  title: string;
  description?: string;
}
```

## Related

- [fix-lint](../fix-lint/SKILL.md) - Biome/style fixes
- [quick-fix](../quick-fix/SKILL.md) - Small bug fixes
- [reviewer](../../agents/reviewer.md) - Review type quality
