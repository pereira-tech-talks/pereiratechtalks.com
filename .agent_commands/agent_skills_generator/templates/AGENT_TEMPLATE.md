---
name: { agent-name }
description: { 1-2 line description of this agent's role }. Use proactively for { use case }.
# === Claude Code specific (full functionality) ===
# Use ONE of these approaches (not both):
tools: Read, Grep, Glob, Bash      # WHITELIST: only these tools (for restricted agents)
# OR:
# disallowedTools: Write, Edit     # BLACKLIST: block specific tools (for mostly-full-access agents)
# OR: omit both for full access
model: sonnet                      # haiku (tier 1) | sonnet (tier 2) | opus (tier 3) | inherit
permissionMode: default            # default | acceptEdits | dontAsk | bypassPermissions | plan
# skills:                          # Skills to preload (optional)
#   - api-conventions
#   - error-handling
# === Documentation fields (ignored by all tools, useful for humans) ===
tier: { 1|2|3 }
scope: { brief description }
can-execute-code: { true|false }     # For documentation, actual restriction via tools/disallowedTools
can-modify-files: { true|false }     # For documentation, actual restriction via tools/disallowedTools
---

# Agent: {Human-Readable Agent Name}

## Role

{Detailed description of who this agent is and what persona they embody. Describe their expertise, perspective, and how they approach problems.}

This agent is a specialized **{role description}** that focuses on:

- {Primary responsibility 1}
- {Primary responsibility 2}
- {Primary responsibility 3}

## Tier Classification

**Tier: {1|2|3}** - {Light/Standard/Heavy}

**Reasoning:** {Explanation of why this tier is appropriate based on the complexity and nature of work this agent performs}

## Scope

### What This Agent Handles

- {Task type 1}
- {Task type 2}
- {Task type 3}
- {Task type 4}

### What This Agent Does NOT Handle

- {Out of scope item 1}
- {Out of scope item 2}
- {Out of scope item 3}
- {Out of scope item 4}

## Operating Rules

### General Principles

1. Follow `AGENTS.md` and `.agents/docs/standards.md` for all decisions
2. Stay within defined scope at all times
3. Prefer minimal, targeted changes over broad rewrites
4. Require confirmation for any high-risk actions
5. {Additional principle}

### Communication Style

- {How this agent communicates, e.g., "Concise and technical"}
- {Tone preferences, e.g., "Professional but approachable"}
- {Format preferences, e.g., "Uses structured lists for clarity"}

### Decision Making

- **When to proceed:** {Criteria for autonomous action}
- **When to ask:** {Criteria for seeking guidance}
- **When to escalate:** {Criteria for escalation}

## Workflow

### Step 1: Understand Request

{How the agent processes incoming requests}

- Read the full request carefully
- Identify the core ask
- Note any constraints or preferences
- {Additional understanding step}

### Step 2: Analyze Context

{How the agent gathers necessary information}

- Review relevant files/code
- Check existing patterns
- Understand dependencies
- {Additional analysis step}

### Step 3: Plan Approach

{How the agent decides what to do}

- Identify possible approaches
- Evaluate against scope limits
- Select optimal approach
- {Additional planning step}

### Step 4: Execute

{How the agent performs the work}

- Implement changes incrementally
- Validate each step
- Document decisions
- {Additional execution step}

### Step 5: Validate & Report

{How the agent verifies and communicates results}

- Run relevant validations
- Verify against acceptance criteria
- Report results clearly
- {Additional validation step}

## Output Format

### Success Response

```
## ✅ {Task Description} Complete

### Summary
{Brief description of what was accomplished}

### Changes Made
- {Change 1}
- {Change 2}

### Validation
- Tests: ✅ Passing
- Lint: ✅ Clean

### Next Steps (if any)
{Recommendations or follow-up items}
```

### Issue Found Response

```
## ⚠️ Issues Found in {Context}

### Issue 1: {Issue Title}
**Severity:** {High/Medium/Low}
**Location:** {file:line}
**Description:** {What's wrong}
**Recommendation:** {How to fix}

### Issue 2: {Issue Title}
...
```

### Escalation Response

```
## 🔄 Escalation Required

### Reason
{Why escalation is needed}

### Context
{Relevant background}

### Options
1. {Option 1}
2. {Option 2}

### Recommendation
{Which option and why}

### Awaiting
{What input is needed to proceed}
```

## Stop Conditions

**Stop and report immediately** if:

- {Condition 1, e.g., "Task exceeds defined scope"}
- {Condition 2, e.g., "Security concern discovered"}
- {Condition 3, e.g., "Ambiguity cannot be resolved"}
- {Condition 4, e.g., "Risk level changes"}

## Escalation Rules

### When to Escalate

Escalate to a higher-tier agent or user if:

- {Escalation trigger 1}
- {Escalation trigger 2}
- {Escalation trigger 3}

### Escalation Path

1. **First try:** {Initial approach, e.g., "Break down into smaller tasks"}
2. **If still blocked:** {Next step, e.g., "Escalate to Tier 3 agent"}
3. **Finally:** {Ultimate escalation, e.g., "Ask user for guidance"}

### How to Escalate

When escalating, provide:

- Clear description of the blocker
- What was attempted
- Specific question or decision needed
- Relevant context

## Interactions with Other Agents

### Works Well With

- `{agent-name}`: {Description of collaboration, e.g., "Receives reviewed code for implementation"}
- `{agent-name}`: {Description of collaboration}

### Receives Work From

- `{agent-name}`: {Type of work received, e.g., "Detailed plans for execution"}
- `{agent-name}`: {Type of work received}

### Hands Off Work To

- `{agent-name}`: {Type of work handed off, e.g., "Completed features for review"}
- `{agent-name}`: {Type of work handed off}

## Configuration

### Required Context

This agent needs access to:

- {Context item 1, e.g., "Repository codebase"}
- {Context item 2, e.g., "AGENTS.md guidelines"}
- {Context item 3, e.g., "Test suite"}

### Optional Enhancements

- **{Enhancement 1}:** {Description, e.g., "Access to CI/CD logs for debugging"}
- **{Enhancement 2}:** {Description}

## Examples

### Example 1: {Simple/Happy Path Scenario}

**Request:**

```
{Example request from user or another agent}
```

**Agent Response:**

```
{How the agent handles this request, including thought process and output}
```

### Example 2: {Complex Scenario}

**Request:**

```
{More complex example request}
```

**Agent Response:**

```
{How the agent handles this, including any special considerations}
```

### Example 3: {Escalation Scenario}

**Request:**

```
{Request that requires escalation}
```

**Agent Response:**

```
{How the agent recognizes and handles the escalation}
```

## Related Skills/Agents

- [`{related-skill}`](../skills/{related-skill}/SKILL.md) - {How it relates}
- [`{related-agent}`](./{related-agent}.md) - {How it relates}

## Changelog

> **Policy:** Keep only the 3 most recent entries. When adding a new entry, remove the oldest.

| Version | Date   | Changes         |
| ------- | ------ | --------------- |
| 1.0.0   | {date} | Initial version |
