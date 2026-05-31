---
name: git-commit-push
description: Commit all staged/unstaged changes and push to remote. Use proactively for committing and pushing changes.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Glob, Grep, Bash
model: haiku
# === Documentation (ignored by tools, useful for humans) ===
tier: 1
intent: execute
max-files: unlimited
---

# Skill: Git Commit & Push

## Objective

Commit all current changes with a well-crafted conventional commit message and push to the remote repository.

## Non-Goals

- Does NOT create new branches
- Does NOT resolve merge conflicts
- Does NOT force push
- Does NOT amend previous commits (unless explicitly requested)
- Does NOT push to protected branches (main/master) without confirmation

## Tier Classification

**Tier: 1** - Light/Cheap

**Reasoning:** This is a mechanical, low-risk task that follows established patterns (conventional commits). The AI analyzes changes and generates an appropriate commit message.

## Inputs

### Required Parameters

- None - the skill analyzes the current git state

### Optional Parameters

- `$MESSAGE`: Custom commit message (default: auto-generated from changes)
- `$SCOPE`: Commit scope override (default: inferred from files)

## Prerequisites

Before running this skill, ensure:

- [ ] You are in a git repository
- [ ] There are changes to commit (staged or unstaged)
- [ ] No merge conflicts exist

## Steps

### Step 1: Check Git Status

Review current repository state:

```bash
git status
```

If working tree is clean, report "Nothing to commit" and stop.

### Step 2: Review Changes

Analyze what changed:

```bash
git diff --stat
git diff HEAD
```

Identify:
- Which files changed
- Type of changes (new features, fixes, docs, refactor, etc.)
- Scope/area affected

### Step 3: Check Recent Commits

Review commit message style:

```bash
git log --oneline -5
```

Follow the repository's existing commit message conventions.

### Step 4: Stage Changes

Add all changes:

```bash
git add -A
```

### Step 5: Create Commit

Generate a conventional commit message based on changes:

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <description>

<body if needed>
EOF
)"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Step 6: Push to Remote

Push to the current branch:

```bash
git push
```

If upstream not set:

```bash
git push -u origin HEAD
```

### Step 7: Confirm Success

Verify the push:

```bash
git status
git log --oneline -1
```

## Output Format

### Success Output

```
## ✅ Committed and Pushed

### Commit
`<commit-hash>` <commit-message>

### Branch
<branch-name> → origin/<branch-name>

### Changes
- <N> files changed
- <N> insertions(+), <N> deletions(-)

### Files
- <file1>
- <file2>
...
```

### Nothing to Commit Output

```
## ℹ️ Nothing to Commit

Working tree is clean. No changes to commit.
```

### Error Output

```
## ❌ Commit Failed

### Error
<error message>

### Suggestion
<how to resolve>
```

## Guardrails

### Scope Limits

- **Maximum files:** Unlimited (commits whatever is changed)
- **Allowed:** Any tracked files
- **Forbidden:** Force push, push to main/master without confirmation

### Safety Checks

- [ ] Not pushing to protected branch without confirmation
- [ ] No merge conflicts present
- [ ] Commit message follows conventional format

### Stop Conditions

**Stop immediately** if:

- Merge conflicts exist
- Push to main/master requested (ask for confirmation)
- Authentication fails
- Remote is ahead (pull needed first)

## Definition of Done

- [ ] All changes are committed
- [ ] Commit message follows conventional format
- [ ] Changes are pushed to remote
- [ ] Git status shows clean working tree

## Escalation Conditions

**Ask user** if:

- Pushing to main/master branch
- Remote has changes not in local (need to pull first)
- Commit message is ambiguous (multiple unrelated changes)

## Examples

### Example 1: Component Update

**Context:** User updated a blog component

**Execution:**
```bash
git add -A
git commit -m "fix(blog): handle empty search query gracefully"
git push
```

**Output:**
```
## ✅ Committed and Pushed

### Commit
`a1b2c3d` fix(blog): handle empty search query gracefully

### Branch
fix/blog-search → origin/fix/blog-search

### Changes
- 2 files changed
- 15 insertions(+), 3 deletions(-)
```

### Example 2: New Feature

**Context:** User added dark mode support to a component

**Execution:**
```bash
git add -A
git commit -m "feat(theme): add dark mode to footer component

- Add dark mode Tailwind classes
- Update color scheme
- Test with theme toggle"
git push
```

**Output:**
```
## ✅ Committed and Pushed

### Commit
`d4e5f6g` feat(theme): add dark mode to footer component

### Branch
feature/dark-mode-footer → origin/feature/dark-mode-footer

### Changes
- 3 files changed
- 45 insertions(+), 12 deletions(-)
```

### Example 3: Nothing to Commit

**Context:** User says "commit and push" but no changes exist

**Output:**
```
## ℹ️ Nothing to Commit

Working tree is clean. No changes to commit.
```

## Related Skills/Agents

- [`quick-fix`](../quick-fix/SKILL.md) - Often used before this skill
- [`pr-review-lite`](../pr-review-lite/SKILL.md) - Review before committing

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01 | Initial version |
