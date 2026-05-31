# CREATE_SKILL.md - Skill Creation Prompt

## Overview

This prompt guides the creation of a new Skill. Follow each phase carefully to ensure the skill is well-designed, properly scoped, and follows repository conventions.

---

## Phase 1: Gather Information

Ask the user these questions (or extract from their request):

### 1.1 Skill Name

```
What should this skill be called?

Requirements:
- Must be kebab-case (lowercase with hyphens)
- Should be action-oriented
- Should be descriptive but concise

Examples:
  ✓ quick-fix
  ✓ doc-edit
  ✓ pr-review-lite
  ✓ write-tests
  ✗ QuickFix (not kebab-case)
  ✗ fix (too vague)
```

### 1.2 Purpose

```
What does this skill accomplish?

Provide a clear, specific answer in 1-2 sentences.
Focus on the ACTION, not implementation details.

Examples:
  ✓ "Fixes small bugs in 1-3 files following existing patterns"
  ✓ "Updates documentation files including README and code comments"
  ✗ "Does stuff with code" (too vague)
```

### 1.3 Trigger/Invocation

```
How will this skill be invoked?

Common patterns:
- Slash command: /skill-name
- Contextual: "When reviewing a PR"
- Explicit: "Use the X skill to..."
```

### 1.4 Scope

```
What's the scope of this skill?

Answer these:
- How many files will it typically affect? (1-3, 1-10, many)
- How much code will change? (<100 LOC, 100-500 LOC, >500 LOC)
- Which directories/files are in scope?
- Which directories/files are OUT of scope?
```

### 1.5 Risk Level

```
What's the risk level of this skill's actions?

LOW risk:
- Formatting, comments, documentation
- No logic changes
- Easily reversible

MEDIUM risk:
- Feature code changes
- Test modifications
- Safe refactoring

HIGH risk:
- Auth/security code
- Payment processing
- Data migrations
- Core business logic
```

---

## Phase 2: Classify Tier

Based on the answers from Phase 1, determine the appropriate tier:

### Decision Matrix

| If...                                                                | Then Tier... |
| -------------------------------------------------------------------- | ------------ |
| 1-3 files AND <100 LOC AND Low risk AND Mechanical/pattern-following | **Tier 1**   |
| 1-10 files AND 100-500 LOC AND Medium risk AND Standard development  | **Tier 2**   |
| Many files OR >500 LOC OR High risk OR Complex reasoning needed      | **Tier 3**   |

### Tier 1 Indicators

- Simple, repetitive task
- Clear pattern to follow
- No judgment calls needed
- Quick execution (<5 minutes)

### Tier 2 Indicators

- Standard development work
- Some reasoning required
- Tests should be written
- Moderate execution time

### Tier 3 Indicators

- Complex or risky
- Architecture decisions
- Multiple valid approaches
- Significant planning needed

---

## Phase 3: Read Repository Context

**BEFORE generating the skill, read:**

1. **AGENTS.md** (if exists)
   - Coding standards
   - Testing requirements
   - Commit message format

2. **Existing skills** in `.agents/skills/`
   - Naming patterns
   - Common guardrails
   - Output formats

3. **Tech stack**
   - Language-specific patterns
   - Framework conventions
   - Testing frameworks

---

## Phase 4: Generate Skill File

### 4.1 Use the Template

Copy `templates/SKILL_TEMPLATE.md` as your starting point.

### 4.2 Fill All Sections

**Required sections (must have content):**

- Objective
- Non-Goals
- Tier Classification
- Inputs
- Steps
- Output Format
- Guardrails
- Definition of Done
- Escalation Conditions
- Examples (at least 2)

### 4.3 Match Guardrails to Tier

**Tier 1 Guardrails:**

```markdown
### Scope Limits

- Maximum files: 3
- Maximum LOC: 100

### Stop Conditions

- Task requires more than 3 files
- Change exceeds 100 LOC
- Requires business logic understanding
```

**Tier 2 Guardrails:**

```markdown
### Scope Limits

- Maximum files: 10
- Maximum LOC: 500

### Stop Conditions

- Requires architectural decisions
- Touches auth/security code
- Affects more than 10 files
```

**Tier 3 Guardrails:**

```markdown
### Scope Limits

- Phased execution required
- Checkpoints every major milestone

### Stop Conditions

- User confirmation required between phases
- Unexpected complexity discovered
```

### 4.4 Write Realistic Examples

Each example should include:

- Context (situation)
- Input (parameters)
- Execution (what happens)
- Output (result)

Include at least:

1. Happy path example
2. Edge case example
3. (Optional) Escalation example

---

## Phase 5: Validate Before Saving

### Checklist

- [ ] **Name:** Follows kebab-case convention
- [ ] **Tier:** Appropriate for scope and risk
- [ ] **Objective:** Clear and specific
- [ ] **Non-Goals:** Explicitly stated
- [ ] **Guardrails:** Match the tier
- [ ] **Output Format:** Clearly specified
- [ ] **Examples:** At least 2 realistic examples
- [ ] **Escalation:** Conditions defined
- [ ] **Repository Patterns:** Follows existing conventions

### Common Mistakes to Avoid

❌ Tier mismatch (using Tier 1 for complex work)
❌ Missing non-goals (scope will creep)
❌ Vague guardrails (won't prevent overreach)
❌ No escalation path (will get stuck)
❌ Abstract examples (not helpful)

---

## Phase 6: Place the File

### Create Skill

```bash
# Create directory
mkdir -p .agents/skills/{skill-name}

# Create skill file
# Place content in .agents/skills/{skill-name}/SKILL.md
```

### Update Catalog

Add entry to `.agents/docs/skills_agents_catalog.md`:

```markdown
| {skill-name} | {tier} | {intent} | `/{skill-name}` | {brief description} |
```

---

## Quick Reference: Skill Generation Flow

```
User Request
     │
     ▼
┌─────────────────┐
│ Gather Info     │
│ - Name          │
│ - Purpose       │
│ - Scope         │
│ - Risk          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Classify Tier   │
│ 1 = Light       │
│ 2 = Standard    │
│ 3 = Heavy       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Read Context    │
│ - AGENTS.md     │
│ - Existing      │
│ - Tech stack    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate File   │
│ - Use template  │
│ - Fill sections │
│ - Add examples  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validate        │
│ - Checklist     │
│ - Review        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Place File      │
│ - Create dir    │
│ - Save SKILL.md │
│ - Update catalog│
└─────────────────┘
```

---

## Example: Full Skill Creation

**User Request:** "I need a skill that helps me fix linting errors quickly"

### Phase 1: Information Gathered

- Name: `fix-lint`
- Purpose: Fix linting errors reported by ESLint
- Scope: 1-5 files, <100 LOC typically
- Risk: Low (formatting/style only)

### Phase 2: Tier Classification

- Scope: Small (1-5 files)
- LOC: Low (<100)
- Risk: Low
- Task: Mechanical
- **→ Tier 1**

### Phase 3: Context Read

- AGENTS.md: Uses ESLint with Prettier
- Existing skills: None similar
- Tech: TypeScript, ESLint

### Phase 4: Generated Skill

```markdown
---
name: fix-lint
description: Automatically fix ESLint errors in specified files
tier: 1
intent: fix
---

# Skill: Fix Lint Errors

## Objective

Fix ESLint errors in the specified files using auto-fix where possible.

## Non-Goals

- Does NOT fix TypeScript type errors
- Does NOT refactor code for style preferences
- Does NOT modify business logic

## Tier Classification

**Tier: 1** - Light
**Reasoning:** Mechanical task, follows patterns, low risk, small scope.

[... rest of skill ...]
```

### Phase 5: Validated

✅ All checklist items pass

### Phase 6: Placed

- Created `.agents/skills/fix-lint/SKILL.md`
- Updated catalog
