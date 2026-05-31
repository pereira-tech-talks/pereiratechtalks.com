# GUIDE_TO_CREATE_SKILLS_AND_AGENTS.md

### How to Create Skills and Agents Under `.agents/`

This guide defines the **official structure and workflow** for creating _Skills_ and _Agents_ for AI-assisted development.

These definitions are designed so that AI agents (Cursor, Claude, etc.) can:

- **Work efficiently** with appropriate cost/quality tradeoffs
- **Follow consistent patterns** across the codebase
- **Stay within defined scope** with clear guardrails
- **Specialize appropriately** (skills for tasks, agents for personas)

Use this document whenever you need to generate a new Skill or Agent.

---

## 1. Important Definitions (DO NOT CONFUSE THESE)

### What is a Skill?

A **Skill** is a reusable "how-to" SOP (Standard Operating Procedure):

- **Location:** `.agents/skills/<skill-name>/SKILL.md`
- **Invocation:** Slash commands like `/quick-fix`, `/doc-edit`, `/pr-review-lite`
- **Characteristics:**
  - Small, atomic, and reusable
  - Single-purpose (one task done well)
  - Has clear inputs and outputs
  - Includes guardrails and scope limits

**Skills are "HOW it's done"**

### What is an Agent?

An **Agent** (or Subagent) is a specialized worker persona:

- **Location:** `.agents/agents/<agent-name>.md`
- **Usage:** Invoked by name or role, e.g., "as reviewer" or "use architect"
- **Characteristics:**
  - Embodies a specific role/expertise
  - Has defined scope and boundaries
  - Can invoke Skills to complete work
  - Has interaction patterns with other Agents

**Agents are "WHO does it"**

### Key Distinction

| Aspect     | Skill            | Agent                 |
| ---------- | ---------------- | --------------------- |
| What       | A procedure/task | A persona/role        |
| Example    | `/quick-fix`     | `reviewer`            |
| Focus      | Single action    | Specialized expertise |
| Scope      | Narrow, atomic   | Broader, role-based   |
| Invocation | Slash command    | By name/role          |

---

## 2. Compatibility & Standards

Skills and agents follow the **Agent Skills open standard** (agentskills.io) for cross-tool compatibility.

### Compatibility Matrix

| Tool | Skills Location | Agents Location | Standard Support |
|------|-----------------|-----------------|------------------|
| **Claude Code** | `.agents/skills/` | `.agents/agents/` | Full (most features) |
| **Cursor** | `.cursor/skills/`, `.agents/skills/` | `.cursor/agents/` | Partial (basic fields) |
| **Codex (OpenAI)** | `.codex/skills/`, `~/.codex/skills/` | N/A | Basic (skills only) |

### What Works Where

| Feature | Claude Code | Cursor | Codex |
|---------|-------------|--------|-------|
| Skill invocation (`/skill-name`) | Yes | Yes | Yes |
| Auto-invocation by description | Yes | Yes | Yes |
| `disable-model-invocation` | Yes | Yes | Yes |
| Model routing (haiku/sonnet/opus) | Yes | Ignored | Ignored |
| `allowed-tools` (skills) | Yes | Ignored | Ignored |
| `tools`/`disallowedTools` (agents) | Yes | Ignored | Ignored |
| `permissionMode` (agents) | Yes | Ignored | Ignored |
| `context: fork` (skills) | Yes | Ignored | Ignored |
| Custom fields (tier, intent, etc.) | Ignored | Ignored | Ignored |
| Agents | Yes | Yes (basic) | No |

**Key insight**: Custom fields like `tier`, `intent`, `max-files` are safely ignored by all tools. We keep them for human documentation while adding official fields that actually work.

---

## 3. Model & Cost Strategy (The Tier System)

### Why Tiers?

Not all tasks require the same level of AI reasoning. Using expensive frontier models for simple formatting wastes resources. The tier system ensures:

1. **Correctness** - Right output for the task
2. **Consistency** - Predictable behavior
3. **Cost efficiency** - Match compute to complexity
4. **Maintainability** - Clear expectations

### Model Routing (Now Works in Claude Code!)

The `model` field in frontmatter directly controls which model handles the task:

| Tier | Field Value | Effect in Claude Code | Effect in Cursor/Codex |
|------|-------------|----------------------|------------------------|
| 1 (Light) | `model: haiku` | Uses Claude Haiku (fast/cheap) | Ignored (default model) |
| 2 (Standard) | `model: sonnet` | Uses Claude Sonnet (balanced) | Ignored (default model) |
| 3 (Heavy) | `model: opus` | Uses Claude Opus (reasoning) | Ignored (default model) |

### Routing Summary (Quick Reference)

- **Tier 3 (Heavy):** Planning and heavy reasoning — architecture, deep work plans, complex analysis, security-sensitive design.
- **Tier 2 (Standard):** Plan execution and standard development — implementing features, following plans, tests, safe refactors.
- **Tier 1 (Light):** Simple, mechanical tasks — formatting, docs, typos, small fixes, quick checks.

For large tasks, use the **two-phase pattern**: plan with Tier 3, then execute with Tier 2 (see Section 13).

### Tier Definitions

#### Tier 1: Light / Cheap

**Purpose:** Simple, low-risk, repetitive tasks

**Characteristics:**

- Scope: 1-3 files, <100 LOC
- Risk: Low (no auth, payments, data)
- Reasoning: Minimal, follow patterns

**Examples:**

- Formatting and linting fixes
- Documentation edits
- Code comment improvements
- Typo corrections
- Small boilerplate generation
- Quick review checklists

**Guardrails:**

- Strict file count limits
- No architectural changes
- Must follow existing patterns exactly

**Model Family:** Cheap/Fast (Codex-class, Haiku-class)

---

#### Tier 2: Standard / Mid

**Purpose:** Everyday coding, moderate reasoning

**Characteristics:**

- Scope: 1-10 files, 100-500 LOC
- Risk: Medium (standard features)
- Reasoning: Moderate decision-making

**Examples:**

- Feature implementation with tests
- Bug fixes with investigation
- Safe refactors (small to medium)
- Test writing with edge cases
- API endpoint implementation
- Component creation

**Guardrails:**

- Standard Definition of Done checks
- Bounded planning
- Must write tests for changes

**Model Family:** Standard (Sonnet-class, GPT-4.1-class)

---

#### Tier 3: Heavy / Reasoning Frontier

**Purpose:** Complex architecture, long planning, deep debugging

**Characteristics:**

- Scope: Many files, >500 LOC
- Risk: High (auth, payments, core)
- Reasoning: Deep analysis required

**Examples:**

- Deep work plans
- System design
- Multi-module refactors
- Complex debugging
- Database migrations
- Security-sensitive changes

**Guardrails:**

- Phased plan required
- Checkpoints and rollback
- Explicit confirmations

**Model Family:** Frontier (Opus-class, o1/o3-class)

---

## 4. Directory Structure

### Skills Location

```
.agents/skills/
└── {skill-name}/
    └── SKILL.md
```

**Naming Convention:**

- `kebab-case` (lowercase with hyphens)
- Descriptive action name
- Examples: `quick-fix`, `doc-edit`, `pr-review-lite`, `write-tests`

### Agents Location

```
.agents/agents/
└── {agent-name}.md
```

**Naming Convention:**

- `kebab-case` (lowercase with hyphens)
- Role-based name
- Examples: `reviewer`, `executor`, `architect`, `security-auditor`

### Supporting Files

```
.agents/
├── docs/
│   ├── skills_agents_catalog.md   # Central catalog
│   └── model_routing.md           # Routing documentation
└── commands/
    ├── skill-create.md            # Creation command
    ├── skill-list.md              # List command
    ├── agent-create.md            # Creation command
    └── agent-list.md              # List command
```

---

## 5. Skill File Structure

Every Skill must follow this template. Skills use the **Agent Skills open standard** (agentskills.io) for cross-tool compatibility.

### Frontmatter Fields

| Field | Required | Works In | Purpose |
|-------|----------|----------|---------|
| `name` | Yes | Claude, Cursor, Codex | Skill identifier (kebab-case, max 64 chars) |
| `description` | Yes | Claude, Cursor, Codex | Auto-invocation and context matching |
| `disable-model-invocation` | No | Claude, Cursor, Codex | Manual-only invocation (default: false) |
| `allowed-tools` | No | Claude Code only | Whitelist tools this skill can use |
| `model` | No | Claude Code only | Route to haiku/sonnet/opus |
| `argument-hint` | No | Claude Code only | Autocomplete hint for parameters |
| `context: fork` | No | Claude Code only | Run in isolated subagent |
| `agent` | No | Claude Code only | Subagent type when context: fork |
| `tier` | No | Documentation only | Human-readable tier classification |
| `intent` | No | Documentation only | Task category |
| `max-files` | No | Documentation only | Scope documentation |
| `max-loc` | No | Documentation only | Scope documentation |

### Template

```markdown
---
name: { skill-name }
description: { 1-2 line description }. Use proactively for { use case }.
# === Universal fields (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific (full functionality) ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash  # Adjust per skill needs
model: sonnet                      # haiku (tier 1) | sonnet (tier 2) | opus (tier 3)
# === Documentation fields (ignored by all tools, useful for humans) ===
tier: { 1|2|3 }
intent: { plan|execute|review|docs|tests|fix|create }
max-files: { N }
max-loc: { N }
---

# Skill: {Human-Readable Name}

## Objective

{What this skill accomplishes}

## Non-Goals

{What this skill explicitly does NOT do}

- Does NOT {x}
- Does NOT {y}

## Tier Classification

**Tier: {N}** - {Light/Standard/Heavy}
**Reasoning:** {Why this tier}

## Inputs

### Required Parameters

- `$PARAM1`: {description}

### Optional Parameters

- `$OPTIONAL1`: {description} (default: {value})

## Prerequisites

- [ ] {Prerequisite 1}

## Steps

### Step 1: {Name}

{Instructions}

### Step 2: {Name}

{Instructions}

## Output Format

{Expected output structure}

## Guardrails

### Scope Limits

- Maximum files: {N}
- Maximum LOC: {N}

### Stop Conditions

Stop if:

- {Condition}

## Definition of Done

- [ ] {Criterion}

## Escalation Conditions

Escalate to higher tier if:

- {Condition}

## Examples

### Example 1: {Scenario}

**Input:** {input}
**Output:** {output}
```

### Tier to Model Mapping (for `model` field)

| Tier | Model Value | Effect in Claude Code | Effect in Cursor/Codex |
|------|-------------|----------------------|------------------------|
| 1 (Light) | `model: haiku` | Uses fast/cheap model | Ignored (default model) |
| 2 (Standard) | `model: sonnet` | Uses balanced model | Ignored (default model) |
| 3 (Heavy) | `model: opus` | Uses frontier model | Ignored (default model) |

### Choosing `allowed-tools`

Select tools based on what the skill needs:

| Skill Type | Recommended `allowed-tools` |
|------------|---------------------------|
| Read-only review | `Read, Glob, Grep, Bash` |
| Documentation edits | `Read, Write, Edit, Glob, Grep` |
| Code fixes | `Read, Write, Edit, Glob, Grep, Bash` |
| Git operations | `Read, Glob, Grep, Bash` |
| Full development | `Read, Write, Edit, Glob, Grep, Bash` |

---

## 6. Agent File Structure

Every Agent must follow this template. Agents are primarily a Claude Code feature, with basic support in Cursor.

### Frontmatter Fields

| Field | Required | Works In | Purpose |
|-------|----------|----------|---------|
| `name` | Yes | Claude, Cursor | Agent identifier (kebab-case) |
| `description` | Yes | Claude, Cursor | Auto-delegation context matching |
| `tools` | No | Claude Code only | WHITELIST: comma-separated tools (omit = inherit all) |
| `disallowedTools` | No | Claude Code only | BLACKLIST: tools to deny (use ONE of tools/disallowedTools, not both) |
| `model` | No | Claude Code only | Route to haiku/sonnet/opus/inherit |
| `permissionMode` | No | Claude Code only | Permission control (default/acceptEdits/dontAsk/bypassPermissions/plan) |
| `skills` | No | Claude Code only | Skills to preload at startup |
| `tier` | No | Documentation only | Human-readable tier classification |
| `scope` | No | Documentation only | Scope documentation |
| `can-execute-code` | No | Documentation only | Documents code execution capability |
| `can-modify-files` | No | Documentation only | Documents file modification capability |

### CRITICAL: `tools` vs `disallowedTools` (Choose ONE)

| Approach | Field | When to Use | Example |
|----------|-------|-------------|---------|
| **Whitelist** | `tools: Read, Grep, Glob` | Agent should have LIMITED access | Read-only reviewer |
| **Blacklist** | `disallowedTools: Write, Edit` | Agent should have MOST tools but block specific ones | Agent that can read and execute but not write |
| **Neither** | (omit both) | Agent needs ALL tools | Full-access executor |

### Mapping Restrictions to Tools

| Custom Concept | Claude Code Implementation |
|----------------|---------------------------|
| `can-execute-code: false` + `can-modify-files: false` | `tools: Read, Grep, Glob, Bash` (whitelist read-only + Bash for git/checks) |
| `can-execute-code: false` + `can-modify-files: true` | `disallowedTools: Bash` (can write but not execute arbitrary commands) |
| `can-execute-code: true` + `can-modify-files: true` | Omit `tools`/`disallowedTools` (inherit all) |
| Planning-only agent | `tools: Read, Grep, Glob, Bash, WebSearch, WebFetch` + `permissionMode: plan` |

### Template

```markdown
---
name: { agent-name }
description: { 1-2 line description }. Use proactively for { use case }.
# === Claude Code specific (full functionality) ===
# Use ONE of these approaches (not both):
tools: Read, Grep, Glob, Bash      # WHITELIST: only these tools
# OR:
# disallowedTools: Write, Edit     # BLACKLIST: block specific tools
# OR: omit both for full access
model: sonnet                      # haiku | sonnet | opus | inherit
permissionMode: default            # default | acceptEdits | dontAsk | bypassPermissions | plan
# === Documentation fields (ignored by all tools, useful for humans) ===
tier: { 1|2|3 }
scope: { brief description }
can-execute-code: { true|false }
can-modify-files: { true|false }
---

# Agent: {Human-Readable Name}

## Role

{Who this agent is and what persona they embody}

## Tier Classification

**Tier: {N}** - {Light/Standard/Heavy}
**Reasoning:** {Why this tier}

## Scope

### What This Agent Handles

- {Task type}

### What This Agent Does NOT Handle

- {Out of scope}

## Operating Rules

### General Principles

1. {Rule}

### Decision Making

- {How decisions are made}

## Workflow

### Step 1: Understand Request

{Process}

### Step 2: Execute

{Process}

## Output Format

### Success Response

{Template}

### Escalation Response

{Template}

## Stop Conditions

Stop if:

- {Condition}

## Escalation Rules

Escalate if:

- {Trigger}

## Interactions with Other Agents

### Works Well With

- `{agent}`: {how}

## Examples

### Example 1: {Scenario}

**Request:** {request}
**Response:** {response}
```

---

## 7. Naming Conventions

### Skills

| ✅ Good          | ❌ Bad         |
| ---------------- | -------------- |
| `quick-fix`      | `QuickFix`     |
| `doc-edit`       | `doc_edit`     |
| `pr-review-lite` | `PRReviewLite` |
| `write-tests`    | `writeTests`   |

**Rules:**

- All lowercase
- Use hyphens to separate words
- Action-oriented verbs
- Descriptive but concise

### Agents

| ✅ Good            | ❌ Bad            |
| ------------------ | ----------------- |
| `reviewer`         | `CodeReviewer`    |
| `executor`         | `plan_executor`   |
| `architect`        | `SystemArchitect` |
| `security-auditor` | `securityAuditor` |

**Rules:**

- All lowercase
- Use hyphens for multi-word names
- Role-based nouns
- Clear specialization

---

## 8. Best Practices

### ✅ DO

1. **Define clear scope** - Explicit boundaries prevent scope creep
2. **Include guardrails** - Limits protect against overreach
3. **Add escalation rules** - Know when to ask for help
4. **Provide examples** - Show expected input/output
5. **Match tier to complexity** - Don't over-engineer simple tasks
6. **Keep skills atomic** - One task done well
7. **Define agent interactions** - How they work together

### ❌ DON'T

1. **Create overly broad skills** - Split into multiple focused skills
2. **Use wrong tier** - Don't use Tier 3 for formatting
3. **Skip guardrails** - Every skill/agent needs limits
4. **Forget escalation** - Always have an escape hatch
5. **Mix skill and agent** - Skills are tasks, agents are personas
6. **Duplicate functionality** - Reuse existing skills
7. **Ignore repository context** - Read AGENTS.md first

---

## 9. How to Create a New Skill

### Step-by-Step Workflow

1. **Determine the Need**
   - What task do you want to automate?
   - Is there an existing skill that does this?
   - Can an existing skill be extended instead?

2. **Classify the Tier**
   - How many files affected?
   - What's the risk level?
   - How much reasoning required?

3. **Define the Scope**
   - What exactly will this skill do?
   - What will it NOT do?
   - What are the guardrails?

4. **Write the Skill File**
   - Use `templates/SKILL_TEMPLATE.md`
   - Fill all sections completely
   - Include realistic examples

5. **Place the File**
   - Create `.agents/skills/{skill-name}/SKILL.md`
   - Update `.agents/docs/skills_agents_catalog.md`
   - Update `.agents/docs/COMMANDS_REFERENCE.md` with new command entry

6. **Test the Skill**
   - Run with a simple case
   - Verify guardrails work
   - Check output format

---

## 10. How to Create a New Agent

### Step-by-Step Workflow

1. **Determine the Need**
   - What specialized role is missing?
   - Is there an existing agent that covers this?
   - Would a skill be more appropriate?

2. **Classify the Tier**
   - What complexity of work will they do?
   - Do they plan or execute?
   - What's the typical risk level?

3. **Define the Persona**
   - What is their expertise?
   - How do they communicate?
   - What decisions can they make?

4. **Define Interactions**
   - Who do they work with?
   - Who hands off work to them?
   - Who receives their work?

5. **Write the Agent File**
   - Use `templates/AGENT_TEMPLATE.md`
   - Fill all sections completely
   - Include example interactions

6. **Place the File**
   - Create `.agents/agents/{agent-name}.md`
   - Update `.agents/docs/skills_agents_catalog.md`

7. **Test the Agent**
   - Give them a sample task
   - Verify they stay in scope
   - Check escalation works

---

## 11. Catalog Maintenance (MANDATORY)

### Why Catalog Maintenance Matters

The catalog (`.agents/docs/skills_agents_catalog.md`) is the single source of truth for discovering skills and agents. If it falls out of sync, agents cannot find the right tools, users invoke nonexistent commands, and the tier system breaks down. **Every skill or agent creation MUST include a catalog update.**

### Required Updates Checklist

When creating a new skill or agent, you MUST update these catalog sections:

#### 1. Overview Table Counts (REQUIRED)

Update four values in the Overview table:

- **Type-Tier cell** — increment the count for the matching row (Skills/Agents) and column (Tier 1/2/3)
- **Type-Total cell** — increment the Total column for the matching row
- **Total-Tier cell** — increment the Total row for the matching tier column
- **Grand Total cell** — increment the Total row, Total column

**Example — adding a new Tier 1 skill:**

Before:
```markdown
| Skills | 12 | 2 | 0 | 14 |
| **Total** | **12** | **6** | **1** | **19** |
```

After:
```markdown
| Skills | 13 | 2 | 0 | 15 |
| **Total** | **13** | **6** | **1** | **20** |
```

#### 2. Tier Table Entry (REQUIRED)

Add the new skill or agent to the appropriate tier table under "Skills by Tier" or "Agents by Tier".

**For Skills:**
```markdown
| {skill-name} | {intent} | `/{skill-name}` | {brief description} |
```

**For Agents:**
```markdown
| {agent-name} | {scope} | {description} |
```

#### 3. Interaction Map (CONDITIONAL)

Update the ASCII interaction map ONLY if the new skill or agent changes how tiers interact:

- A new agent that bridges tiers (e.g., a new Tier 2 validator)
- A new Tier 3 skill or agent
- A skill that introduces a new category in Tier 1

Do NOT update the map for routine Tier 1 skill additions that fit existing categories.

#### 4. Domain Section (CONDITIONAL)

Add the new skill or agent to the appropriate domain under "Domain-Specific Skills & Agents":

1. Blog & Content Development
2. i18n & Translation
3. Code Quality & Review
4. Security
5. Component & Page Creation

If none of the existing domains fit, create a new domain section following the same format.

#### 5. Changelog Entry (REQUIRED)

Add a new row to the top of the Changelog table. **Keep only the 3 most recent entries** — when adding a new entry, remove the oldest if there are already 3. This applies to all changelogs: catalog, skills, and agents.

```markdown
| {YYYY-MM-DD} | {skill-name/agent-name} added | {brief description of what was added} |
```

#### 6. Commands Reference Update (REQUIRED for skills with slash commands)

If the new skill or command has a slash command invocation, add an entry to the correct category table in `.agents/docs/COMMANDS_REFERENCE.md`:

For Skills:
```markdown
| `/{skill-name}` | `.agents/skills/{skill-name}/SKILL.md` | {brief description} |
```

For Commands:
```markdown
| `/{command-name}` | `.agents/commands/{command-name}.md` | {brief description} |
```

### Validation Checklist

After updating the catalog, verify:

- [ ] Overview table counts are arithmetically correct (row totals = sum of tier cells)
- [ ] Grand total = Skills total + Agents total
- [ ] New entry appears in the correct tier table
- [ ] Domain section updated (if applicable)
- [ ] Changelog has a new entry at the top
- [ ] No duplicate entries in any table
- [ ] Commands Reference updated with new command entry (`.agents/docs/COMMANDS_REFERENCE.md`)

### Common Mistakes to Avoid

- Incrementing only the type total but forgetting the tier column
- Adding to the tier table but not the overview counts
- Placing a Tier 2 skill in the Tier 1 table
- Forgetting the changelog entry
- Adding a domain entry without adding the tier table entry
- Keeping more than 3 changelog entries (remove the oldest when adding a new one)

### Complete Example Workflow

**Creating a new Tier 1 skill called `format-mdx`:**

1. Overview: Skills Tier 1: 12→13, Skills Total: 14→15, Total Tier 1: 12→13, Grand Total: 19→20
2. Tier table: Add `| format-mdx | fix | `/format-mdx` | Format MDX files with consistent styling |` to Tier 1
3. Interaction map: No change (fits existing "Fix/Update" category)
4. Domain: Add to "Blog & Content Development" domain
5. Changelog: Add `| 2026-02-03 | format-mdx added | MDX formatting skill for consistent blog post styling |`

---

## 12. Escalation Ladder

### Tier 1 → Tier 2

Escalate when:

- File count exceeds 3
- LOC exceeds 100
- Requires understanding business logic
- Changes affect tests
- Not purely mechanical transformation

### Tier 2 → Tier 3

Escalate when:

- File count exceeds 10
- LOC exceeds 500
- Involves auth, payments, or user data
- Requires architectural decisions
- Multiple trade-offs to evaluate
- Cross-service changes

### Immediate Tier 3

Always use Tier 3 for:

- Database migrations
- Security-sensitive code
- Production deployments
- Breaking changes
- "I'm not sure" situations

---

## 13. Two-Phase Pattern (Cost Saving)

**Recommended approach for large tasks:** Split planning and execution — use Tier 3 (frontier reasoning) to create the plan, then Tier 2 (standard model) to execute it. This saves cost while keeping quality. For large tasks, do the following:

### Phase 1: Plan with Tier 3

```
Use frontier model to:
1. Analyze full scope
2. Identify risks
3. Create detailed plan
4. Define checkpoints
```

### Phase 2: Execute with Tier 2

```
Use standard model to:
1. Follow plan strictly
2. Execute step by step
3. Run validations
4. Report progress
```

This saves significant compute while maintaining quality.

---

## 14. Summary

| Concept    | Definition        | Example      |
| ---------- | ----------------- | ------------ |
| **Skill**  | How to do a task  | `/quick-fix` |
| **Agent**  | Who does the work | `reviewer`   |
| **Tier 1** | Simple, cheap     | Formatting   |
| **Tier 2** | Standard work     | Features     |
| **Tier 3** | Complex reasoning | Architecture |

**Remember:**

- Skills are atomic procedures
- Agents are specialized personas
- Always match tier to complexity
- Include guardrails and escalation
- Read repository context first
