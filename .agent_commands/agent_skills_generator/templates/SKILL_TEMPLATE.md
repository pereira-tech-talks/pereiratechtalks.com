---
name: { skill-name }
description: { 1-2 line description }. Use proactively for { use case }.
# === Universal fields (Claude Code + Cursor + Codex) ===
disable-model-invocation: false    # Set true for manual-only invocation
# === Claude Code specific (full functionality) ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash  # Adjust per skill needs
model: sonnet                      # haiku (tier 1) | sonnet (tier 2) | opus (tier 3)
# argument-hint: "[parameter]"    # Uncomment if skill takes arguments
# context: fork                    # Uncomment to run in isolated subagent
# agent: Explore                   # Which subagent when context: fork
# === Documentation fields (ignored by all tools, useful for humans) ===
tier: { 1|2|3 }
intent: { plan|execute|review|docs|tests|fix|create }
max-files: { N }
max-loc: { N }
---

# Skill: {Human-Readable Skill Name}

## Objective

{Clear, specific statement of what this skill accomplishes. One or two sentences that answer: "What does this skill do?"}

## Non-Goals

{Explicit list of what this skill does NOT do. This is critical for preventing scope creep.}

- Does NOT {action that might be confused as in-scope}
- Does NOT {another out-of-scope action}
- Does NOT {yet another boundary}

## Tier Classification

**Tier: {1|2|3}** - {Light/Standard/Heavy}

**Reasoning:** {Explanation of why this tier is appropriate based on scope, risk, and reasoning requirements}

## Inputs

### Required Parameters

- `$PRIMARY_INPUT`: {Description of the main input this skill needs}
- `$SECONDARY_INPUT`: {Description of another required input, if any}

### Optional Parameters

- `$OPTIONAL_PARAM`: {Description} (default: `{default_value}`)

## Prerequisites

Before running this skill, ensure:

- [ ] {Prerequisite condition 1, e.g., "Working directory is clean (no uncommitted changes)"}
- [ ] {Prerequisite condition 2, e.g., "Tests are passing"}
- [ ] {Prerequisite condition 3}

## Steps

### Step 1: {Step Name}

{Detailed instructions for this step. Be specific about what to do.}

```
{Example command or action if applicable}
```

### Step 2: {Step Name}

{Detailed instructions for this step.}

### Step 3: {Step Name}

{Detailed instructions for this step.}

### Step 4: Validate Changes

{How to verify the changes are correct.}

```bash
# Example validation commands
pnpm run test
pnpm run lint
```

## Output Format

{Describe the expected output format. What should the skill produce?}

### Success Output

```
{Template/example of successful output}
```

### Failure Output

```
{Template/example of failure output}
```

## Guardrails

### Scope Limits

- **Maximum files:** {N}
- **Maximum LOC:** {N}
- **Allowed directories:** {list or "any"}
- **Forbidden directories:** {list or "none"}

### Safety Checks

Before making changes:

- [ ] {Safety check 1, e.g., "Verify no breaking changes to public API"}
- [ ] {Safety check 2, e.g., "Ensure tests exist for modified code"}
- [ ] {Safety check 3}

### Stop Conditions

**Stop immediately** and report if:

- {Condition 1, e.g., "Task requires more than {N} files"}
- {Condition 2, e.g., "Change exceeds {N} LOC"}
- {Condition 3, e.g., "Requires understanding complex business logic not documented"}
- {Condition 4, e.g., "Involves security-sensitive code"}

## Definition of Done

This skill is **complete** when ALL of the following are true:

- [ ] {Completion criterion 1, e.g., "All requested changes are implemented"}
- [ ] {Completion criterion 2, e.g., "Tests pass"}
- [ ] {Completion criterion 3, e.g., "Linting passes"}
- [ ] {Completion criterion 4, e.g., "Changes are committed with descriptive message"}

## Escalation Conditions

**Escalate to a higher tier** (or ask user) if:

- {Escalation trigger 1, e.g., "Scope exceeds defined limits"}
- {Escalation trigger 2, e.g., "Architectural decisions are required"}
- {Escalation trigger 3, e.g., "Risk assessment changes during execution"}

**Escalation Path:**

1. First: Try to break down the task into smaller pieces
2. Then: If still exceeds scope, escalate to Tier {N+1}
3. Finally: Ask user for guidance

## Examples

### Example 1: {Simple/Happy Path Scenario}

**Context:** {Describe the situation}

**Input:**

```
$PRIMARY_INPUT: {example value}
$SECONDARY_INPUT: {example value}
```

**Execution:**
{Brief description of what happens}

**Output:**

```
{Example output}
```

### Example 2: {Edge Case or Complex Scenario}

**Context:** {Describe the situation}

**Input:**

```
$PRIMARY_INPUT: {example value}
```

**Execution:**
{Brief description including any special handling}

**Output:**

```
{Example output}
```

### Example 3: {Escalation Scenario}

**Context:** {Describe a situation that requires escalation}

**Input:**

```
$PRIMARY_INPUT: {example value}
```

**Result:** Escalated because {reason}

## Related Skills/Agents

- [`{related-skill-name}`](../{related-skill-name}/SKILL.md) - {How it relates}
- [`{related-agent-name}`](../../agents/{related-agent-name}.md) - {How it relates}

## Changelog

> **Policy:** Keep only the 3 most recent entries. When adding a new entry, remove the oldest.

| Version | Date   | Changes         |
| ------- | ------ | --------------- |
| 1.0.0   | {date} | Initial version |
