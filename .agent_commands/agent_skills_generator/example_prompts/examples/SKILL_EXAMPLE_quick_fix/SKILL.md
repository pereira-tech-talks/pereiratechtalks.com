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

Fix small bugs, typos, or issues in 1-3 files by following existing code patterns. This skill handles simple, mechanical fixes that don't require architectural decisions.

## Non-Goals

- Does NOT refactor large sections of code
- Does NOT add new features
- Does NOT change architectural patterns
- Does NOT modify more than 3 files
- Does NOT handle security-sensitive code (auth, payments)

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

### Step 4: Validate Changes

- Run relevant tests
- Run linter
- Verify the fix addresses the issue

```bash
pnpm run test -- --related
pnpm run lint
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
- Tests: ✅ Passing
- Lint: ✅ Clean

### Commit Message
```

fix: {description}

```

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
- **Allowed:** Any directory
- **Forbidden:** Security-sensitive files (auth, payments)

### Safety Checks

Before making changes:

- [ ] Change is minimal and targeted
- [ ] No architectural modifications
- [ ] Follows existing patterns
- [ ] No new dependencies added

### Stop Conditions

**Stop immediately** if:

- Issue requires more than 3 files
- Change exceeds 100 LOC
- Requires understanding complex business logic
- Involves auth, security, or payment code
- Requires adding new dependencies
- Existing patterns are unclear

## Definition of Done

- [ ] Issue is resolved
- [ ] Tests pass
- [ ] Linter passes
- [ ] Change follows existing patterns
- [ ] Change is minimal (no over-engineering)

## Escalation Conditions

**Escalate to Tier 2** if:

- Scope exceeds 3 files
- Root cause is complex
- Fix requires new patterns
- Tests don't exist and need to be written

**Escalation Path:**

1. Try to break into smaller fixes
2. If not possible, escalate to `/feature-implement` or `executor` agent

## Examples

### Example 1: Fix a Typo

**Context:** Typo in error message

**Input:**

```
$ISSUE: Error message says "Invlaid" instead of "Invalid"
$FILES: src/utils/validation.ts
```

**Execution:**

1. Open src/utils/validation.ts
2. Find "Invlaid"
3. Replace with "Invalid"
4. Run tests
5. Commit

**Output:**

```
## ✅ Quick Fix Complete

### Issue
Fixed typo in error message ("Invlaid" → "Invalid")

### Changes
- `src/utils/validation.ts`: Fixed typo on line 42

### Validation
- Tests: ✅ Passing
- Lint: ✅ Clean
```

### Example 2: Fix Null Check

**Context:** Missing null check causes crash

**Input:**

```
$ISSUE: App crashes when user.name is null
$FILES: src/components/UserCard.tsx
```

**Execution:**

1. Open UserCard.tsx
2. Find the null reference
3. Add optional chaining or null check
4. Run tests
5. Commit

**Output:**

```
## ✅ Quick Fix Complete

### Issue
Added null check for user.name

### Changes
- `src/components/UserCard.tsx`: Added optional chaining `user?.name`

### Validation
- Tests: ✅ Passing
- Lint: ✅ Clean
```

### Example 3: Escalation Needed

**Context:** Bug in authentication flow

**Input:**

```
$ISSUE: Login sometimes fails silently
$FILES: src/auth/login.ts
```

**Result:** Escalated

```
## ❌ Quick Fix Not Possible

### Reason
Issue involves authentication code which is security-sensitive.
Root cause requires deeper investigation across multiple services.

### Recommendation
Escalate to Tier 2 with `/bug-investigate` skill or `security-auditor` agent.
```

## Related Skills/Agents

- [`doc-edit`](../doc-edit/SKILL.md) - For documentation-only fixes
- [`reviewer`](../../agents/reviewer.md) - For reviewing fixes

## Changelog

| Version | Date    | Changes         |
| ------- | ------- | --------------- |
| 1.0.0   | 2024-01 | Initial version |
