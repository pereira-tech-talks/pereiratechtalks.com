# MODEL_ROUTING.md - Cost-Efficient Model Strategy

## Overview

This document defines the model routing strategy for Skills and Agents. The goal is to optimize for:

1. **Correctness** - Right output for the task
2. **Consistency** - Predictable behavior
3. **Cost efficiency** - Don't waste expensive compute on simple tasks
4. **Maintainability** - Easy to understand and update

**Core Principle:** Match the model's capability to the task's complexity.

### Routing Summary (Quick Reference)

- **Tier 3 (Heavy):** Planning and heavy reasoning — architecture, deep work plans, complex analysis, security-sensitive design.
- **Tier 2 (Standard):** Plan execution and standard development — implementing features, following plans, tests, safe refactors.
- **Tier 1 (Light):** Simple, mechanical tasks — formatting, docs, typos, small fixes, quick checks.

For large tasks, use the **two-phase pattern** (Plan with Tier 3 → Execute with Tier 2); see "Two-Phase Flow Pattern" below.

---

## Tier Definitions

### Tier 1: Light / Cheap

**Purpose:** Simple, low-risk, repetitive tasks

**Characteristics:**
| Aspect | Limit |
|--------|-------|
| Scope | 1-3 files |
| LOC | <100 lines changed |
| Risk | Low (no auth, payments, data) |
| Reasoning | Minimal (follow patterns) |

**Examples:**

- Formatting and linting fixes
- Documentation edits
- Code comment improvements
- Typo corrections
- Small boilerplate generation
- Quick review checklists
- Simple refactoring (rename)

**Guardrails:**

- ✓ Strict file count limit (max 3)
- ✓ No architectural changes
- ✓ Must follow existing patterns exactly
- ✓ No new dependencies
- ✓ No external API calls

**Recommended Model Family:**

- Cheap/Fast models
- Examples: Codex-class, Haiku-class, GPT-3.5-class
- Characteristics: Fast, cheap, good at pattern-following

---

### Tier 2: Standard / Mid

**Purpose:** Everyday coding, moderate reasoning

**Characteristics:**
| Aspect | Limit |
|--------|-------|
| Scope | 1-10 files |
| LOC | 100-500 lines changed |
| Risk | Medium (standard features) |
| Reasoning | Moderate (context-aware) |

**Examples:**

- Feature implementation with tests
- Bug fixes with investigation
- Safe refactors (small to medium)
- Test writing with edge cases
- API endpoint implementation
- Component creation
- PR review (thorough)
- Standard debugging

**Guardrails:**

- ✓ Standard Definition of Done checks
- ✓ Bounded planning (don't over-engineer)
- ✓ Must write tests for changes
- ✓ Commit after each logical change
- ✓ Run linting and tests before completion

**Recommended Model Family:**

- Standard capability models
- Examples: Sonnet-class, GPT-4.1-class
- Characteristics: Good reasoning, reliable, balanced cost

---

### Tier 3: Heavy / Reasoning Frontier

**Purpose:** Complex architecture, long planning, deep debugging

**Characteristics:**
| Aspect | Limit |
|--------|-------|
| Scope | Many files (10+) |
| LOC | >500 lines changed |
| Risk | High (auth, payments, core) |
| Reasoning | Deep (architecture, trade-offs) |

**Examples:**

- Deep work plans
- System design
- Multi-module refactors
- Complex debugging (concurrency, race conditions)
- Database migrations
- Security-sensitive changes
- Performance optimization (system-wide)
- Breaking changes / major versions

**Guardrails:**

- ✓ Phased plan required
- ✓ Checkpoints and rollback plan
- ✓ Explicit user confirmations
- ✓ Limited execution per session
- ✓ Document all decisions and trade-offs

**Recommended Model Family:**

- Frontier reasoning models
- Examples: Opus-class, o1/o3-class
- Characteristics: Deep reasoning, complex planning, expensive

---

## Routing Table

### Skills Routing

| Skill                  | Default Tier | Escalate To | When to Escalate          |
| ---------------------- | ------------ | ----------- | ------------------------- |
| `/quick-fix`           | 1            | 2           | >3 files or complex logic |
| `/doc-edit`            | 1            | 1           | Never                     |
| `/pr-review-lite`      | 1            | 2           | Security concerns found   |
| `/format-code`         | 1            | 1           | Never                     |
| `/feature-implement`   | 2            | 3           | Architecture impact       |
| `/write-tests`         | 2            | 2           | Never                     |
| `/refactor-safe`       | 2            | 3           | >10 files affected        |
| `/bug-investigate`     | 2            | 3           | Root cause unclear        |
| `/deep-work-plan`      | 3            | 3           | Already highest           |
| `/architecture-review` | 3            | 3           | Already highest           |
| `/security-audit`      | 2            | 3           | Auth/data issues          |
| `/db-migration`        | 3            | 3           | Always Tier 3             |

### Agents Routing

| Agent              | Default Tier | Escalate To | When to Escalate       |
| ------------------ | ------------ | ----------- | ---------------------- |
| `executor`         | 2            | 3           | Plan ambiguity         |
| `reviewer`         | 2            | 3           | Security/arch concerns |
| `qa`               | 2            | 2           | Never                  |
| `security-auditor` | 2            | 3           | Auth/crypto/data       |
| `perf-optimizer`   | 2            | 3           | Architecture changes   |
| `architect`        | 3            | 3           | Already highest        |

---

## Escalation Rules

### Tier 1 → Tier 2 Triggers

Escalate when ANY of these occur:

| Trigger        | Threshold              |
| -------------- | ---------------------- |
| File count     | >3 files               |
| Lines of code  | >100 LOC               |
| Business logic | Requires understanding |
| Test impact    | Changes affect tests   |
| Not mechanical | Requires decisions     |

**Example:**

```
User: "Fix the typo in utils.ts"
→ Tier 1: Simple, single file, mechanical

User: "Fix the typo and also update the related tests"
→ Tier 2: Multiple files, test understanding needed
```

### Tier 2 → Tier 3 Triggers

Escalate when ANY of these occur:

| Trigger            | Threshold                 |
| ------------------ | ------------------------- |
| File count         | >10 files                 |
| Lines of code      | >500 LOC                  |
| Security sensitive | Auth, payments, user data |
| Architecture       | Design decisions needed   |
| Trade-offs         | Multiple valid approaches |
| Cross-service      | Affects multiple services |
| Data integrity     | Risk of data loss         |

**Example:**

```
User: "Add a new API endpoint for user preferences"
→ Tier 2: Standard feature work

User: "Refactor the authentication system to use OAuth"
→ Tier 3: Security-sensitive, architecture impact
```

### Immediate Tier 3 Triggers

**Always** use Tier 3 for:

- Database schema migrations
- Authentication/authorization changes
- Payment processing changes
- Production deployment scripts
- Breaking API changes
- Core infrastructure changes
- "I'm not sure how to approach this"

---

## Two-Phase Flow Pattern

**Recommended for large tasks:** Use Tier 3 (frontier model) for Phase 1 (Plan), then Tier 2 (standard model) for Phase 2 (Execute) and Phase 3 (Verify). This pattern saves significant compute while maintaining quality.

### Overview

```
┌─────────────────────────────────────────────────┐
│  Phase 1: PLAN (Tier 3 - Frontier Model)        │
│  ─────────────────────────────────────────      │
│  • Analyze full scope                           │
│  • Identify risks and unknowns                  │
│  • Create detailed, phased plan                 │
│  • Define checkpoints and rollback points       │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│  Phase 2: EXECUTE (Tier 2 - Standard Model)     │
│  ─────────────────────────────────────────      │
│  • Follow plan strictly                         │
│  • Execute step by step                         │
│  • Run validations after each step              │
│  • Commit changes incrementally                 │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│  Phase 3: VERIFY (Tier 2 - Standard Model)      │
│  ─────────────────────────────────────────      │
│  • Run all tests                                │
│  • Verify behavior matches plan                 │
│  • Check for regressions                        │
│  • Document what was done                       │
└─────────────────────────────────────────────────┘
```

### Phase 1: Plan with Tier 3

**Use frontier reasoning model to:**

1. **Analyze Scope**
   - Read all affected files
   - Understand dependencies
   - Map the change surface

2. **Identify Risks**
   - What could go wrong?
   - What's the blast radius?
   - Are there unknowns?

3. **Create Detailed Plan**
   - Break into atomic steps
   - Order by dependency
   - Estimate complexity per step

4. **Define Safety Measures**
   - Checkpoints (when to verify)
   - Rollback points (how to undo)
   - Success criteria (how to know it worked)

**Output:** A detailed plan document with numbered steps.

### Phase 2: Execute with Tier 2

**Use standard model to:**

1. **Follow Plan Strictly**
   - Execute exactly as planned
   - No improvisation
   - No scope expansion

2. **Step-by-Step Execution**
   - One step at a time
   - Verify before moving on
   - Document any deviations

3. **Run Validations**
   - Tests after each step
   - Linting after each step
   - Type checking after each step

4. **Incremental Commits**
   - Commit after each logical unit
   - Clear commit messages
   - Easy to rollback

### Phase 3: Verify with Tier 2

**Use standard model to:**

1. **Run All Tests**
   - Unit tests
   - Integration tests
   - E2E if applicable

2. **Verify Behavior**
   - Does it match the plan's intent?
   - Any unexpected side effects?

3. **Check for Regressions**
   - Compare before/after
   - Check related functionality

4. **Document**
   - What was done
   - Any deviations from plan
   - Lessons learned

### When to Escalate Back to Tier 3

During execution, escalate back to Tier 3 if:

- Plan step is ambiguous
- Unexpected complexity discovered
- Risk assessment changes
- Trade-off decision needed
- Multiple valid paths forward

---

## Anti-Patterns (AVOID THESE)

### ❌ Using Tier 3 for Simple Tasks

**Bad:**

```
Use Opus to fix a typo in README.md
```

**Good:**

```
Use Haiku to fix a typo in README.md
```

**Why:** Wastes expensive compute on trivial task.

---

### ❌ Using Tier 1 for Complex Tasks

**Bad:**

```
Use Haiku to design authentication system
```

**Good:**

```
Use Opus to design authentication system
```

**Why:** Cheap model can't handle complex reasoning.

---

### ❌ Loading Huge Context

**Bad:**

```
Read all 50 files in src/ before making a small fix
```

**Good:**

```
Read only the 2 files directly involved in the fix
```

**Why:** Unnecessary context wastes tokens and confuses the model.

---

### ❌ Expanding Scope Without Escalation

**Bad:**

```
"While I'm here, I'll also refactor the entire module"
```

**Good:**

```
"This is beyond my scope. Escalating to Tier 2/3."
```

**Why:** Scope creep leads to bugs and cost overruns.

---

### ❌ Skipping Verification

**Bad:**

```
Made the changes. Done!
```

**Good:**

```
Made the changes. Running tests... All pass. Done!
```

**Why:** Unverified changes may break things.

---

## Cost Playbook Summary

| Situation                   | Recommended Action              |
| --------------------------- | ------------------------------- |
| Simple fix, clear pattern   | Tier 1                          |
| Documentation updates       | Tier 1                          |
| Formatting/linting          | Tier 1                          |
| New feature with tests      | Tier 2                          |
| Bug fix with investigation  | Tier 2                          |
| Safe refactoring            | Tier 2                          |
| "How should I design this?" | Tier 3 (planning only)          |
| Large refactor              | Tier 3 plan → Tier 2 execute    |
| Security/Auth changes       | Always Tier 3 for planning      |
| Database migrations         | Always Tier 3                   |
| Debugging tricky issue      | Start Tier 2, escalate if stuck |
| "I'm not sure"              | Tier 3                          |

---

## Quick Decision Tree

```
START: New task arrives
  │
  ├─► Is it formatting/docs/comments only?
  │     YES → Tier 1
  │
  ├─► Does it touch auth/payments/migrations?
  │     YES → Tier 3
  │
  ├─► Does it affect >10 files or >500 LOC?
  │     YES → Tier 3
  │
  ├─► Does it require architecture decisions?
  │     YES → Tier 3
  │
  ├─► Is it standard feature/test/refactor?
  │     YES → Tier 2
  │
  ├─► 1-3 files, <100 LOC, mechanical?
  │     YES → Tier 1
  │
  └─► Unsure?
        → Tier 2, monitor, escalate if needed
```

---

## Model Mapping (Reference)

**Note:** Actual model availability varies by platform. These are reference mappings.

| Tier | Claude | OpenAI  | Description                      |
| ---- | ------ | ------- | -------------------------------- |
| 1    | Haiku  | GPT-3.5 | Fast, cheap, pattern-following   |
| 2    | Sonnet | GPT-4.1 | Balanced, reliable, reasoning    |
| 3    | Opus   | o1/o3   | Deep reasoning, complex planning |

In practice, use the best available model that matches the tier's requirements.

---

## Official `model` Field (Claude Code Implementation)

The tier system is now **actively enforced** in Claude Code via the `model` field in skill/agent frontmatter.

### For Skills (`.agents/skills/{name}/SKILL.md`)

```yaml
---
name: quick-fix
description: Fix small bugs. Use proactively for simple bug fixes.
model: haiku          # Claude Code routes to Haiku model
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
tier: 1               # Documentation only (ignored by tools)
---
```

### For Agents (`.agents/agents/{name}.md`)

```yaml
---
name: architect
description: System design and planning. Use proactively for architecture decisions.
model: opus           # Claude Code routes to Opus model
tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
permissionMode: plan
tier: 3               # Documentation only (ignored by tools)
---
```

### How It Works

| Field Value | Effect in Claude Code | Effect in Cursor/Codex |
|-------------|----------------------|------------------------|
| `model: haiku` | Uses Claude Haiku (fast/cheap) | Ignored (uses default model) |
| `model: sonnet` | Uses Claude Sonnet (balanced) | Ignored (uses default model) |
| `model: opus` | Uses Claude Opus (frontier reasoning) | Ignored (uses default model) |
| `model: inherit` | Uses parent conversation model | Ignored |
| (omitted) | Uses parent conversation model | Uses default model |

### Before vs After

| Before (Documentation Only) | After (Actually Works in Claude Code) |
|-----|------|
| `tier: 1` — ignored by all tools | `tier: 1` + `model: haiku` — Claude Code routes to fast model |
| `tier: 2` — ignored by all tools | `tier: 2` + `model: sonnet` — Claude Code routes to balanced model |
| `tier: 3` — ignored by all tools | `tier: 3` + `model: opus` — Claude Code routes to frontier model |
| `can-execute-code: false` — ignored | `tools: Read, Grep, Glob` — Claude Code enforces read-only |
| `can-modify-files: false` — ignored | Omit Write/Edit from `tools` — Claude Code enforces restriction |

The `tier` field is kept for documentation but the `model` field is what Claude Code actually reads and uses.
