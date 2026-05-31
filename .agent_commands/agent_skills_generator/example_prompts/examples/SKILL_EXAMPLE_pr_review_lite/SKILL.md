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

Perform a quick, checklist-based review of a pull request focusing on style issues, obvious bugs, and missing test coverage. This is a lightweight review, not a deep architectural analysis.

## Non-Goals

- Does NOT perform deep architectural review
- Does NOT rewrite code
- Does NOT make changes to the PR
- Does NOT review security-sensitive changes in depth
- Does NOT review database migrations

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

Go through each item:

**Style & Formatting:**

- [ ] Consistent formatting
- [ ] Follows naming conventions
- [ ] No debug code left (console.log, print)
- [ ] No commented-out code

**Code Quality:**

- [ ] No obvious bugs
- [ ] No null/undefined issues
- [ ] Error handling present
- [ ] No hardcoded values that should be config

**Tests:**

- [ ] Tests exist for new code
- [ ] Tests are meaningful (not just coverage)
- [ ] Edge cases considered

**Documentation:**

- [ ] Comments for complex logic
- [ ] Public APIs documented
- [ ] README updated if needed

### Step 3: Compile Results

- List all findings
- Categorize by severity
- Provide suggestions

## Output Format

```
## 📋 PR Review Lite: {PR Title/Number}

### Summary
- Files reviewed: {N}
- Issues found: {N}
- Severity: {Low/Medium/High}

### ✅ Passed Checks
- {Check that passed}
- {Another check that passed}

### ⚠️ Issues Found

#### Issue 1: {Title}
**Severity:** Low/Medium/High
**File:** {filename}:{line}
**Issue:** {Description}
**Suggestion:** {How to fix}

#### Issue 2: {Title}
...

### 💡 Suggestions (Optional)
- {Nice-to-have improvement}

### Verdict
{APPROVE / REQUEST_CHANGES / NEEDS_DISCUSSION}
```

## Guardrails

### Scope Limits

- Review time: < 5 minutes
- Depth: Checklist-based only
- Changes: None (read-only)

### Stop Conditions

**Stop and escalate** if:

- PR involves security-sensitive code
- PR involves database migrations
- PR requires architectural review
- Changes are too complex for quick review

## Definition of Done

- [ ] All files reviewed
- [ ] Checklist completed
- [ ] Findings documented
- [ ] Verdict provided

## Escalation Conditions

**Escalate to `reviewer` agent** if:

- Complex architectural changes
- Security concerns found
- Major refactoring detected

## Examples

### Example 1: Clean PR

**Input:**

```
$PR_FILES: src/components/Button.tsx, src/components/Button.test.tsx
```

**Output:**

```
## 📋 PR Review Lite: Add Button component

### Summary
- Files reviewed: 2
- Issues found: 0
- Severity: None

### ✅ Passed Checks
- Consistent formatting
- Tests exist
- No debug code
- Error handling present

### Verdict
APPROVE - Looks good! Clean implementation with tests.
```

### Example 2: Issues Found

**Input:**

```
$PR_FILES: src/utils/api.ts
```

**Output:**

```
## 📋 PR Review Lite: Add API helper

### Summary
- Files reviewed: 1
- Issues found: 2
- Severity: Medium

### ✅ Passed Checks
- Consistent formatting
- Follows naming conventions

### ⚠️ Issues Found

#### Issue 1: Missing Error Handling
**Severity:** Medium
**File:** src/utils/api.ts:25
**Issue:** fetch call has no error handling
**Suggestion:** Add try-catch or .catch()

#### Issue 2: No Tests
**Severity:** Medium
**File:** src/utils/api.ts
**Issue:** No test file found
**Suggestion:** Add src/utils/api.test.ts

### Verdict
REQUEST_CHANGES - Please address the issues above.
```

## Related Skills/Agents

- [`reviewer`](../../agents/reviewer.md) - For deep reviews
- [`quick-fix`](../quick-fix/SKILL.md) - For fixing issues found

## Changelog

| Version | Date    | Changes         |
| ------- | ------- | --------------- |
| 1.0.0   | 2024-01 | Initial version |
