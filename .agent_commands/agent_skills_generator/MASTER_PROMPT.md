# MASTER_PROMPT.md - Complete Skill/Agent Generation Prompt

## Overview

This prompt guides the creation of high-quality Skills and Agents that are:

- **Contextually appropriate** for the repository
- **Properly tiered** for cost efficiency
- **Well-documented** and maintainable
- **Following established patterns**

**IMPORTANT:** Always read repository context before generating any Skill or Agent.

---

## Phase A: Repository Analysis (ALWAYS DO THIS FIRST)

Before creating any Skill or Agent, you MUST analyze the repository context.

### A.1 Read Core Documentation

**Required reads (primary context):**

1. **AGENTS.md** (if exists)
   - Project guidelines and standards
   - Coding conventions
   - Import order rules
   - Testing requirements
   - Commit message format

2. **docs/ folder** (key files)
   - Architecture documentation (e.g. ARCHITECTURE.md, PRODUCT_SPEC.md)
   - API documentation
   - Development guides (e.g. STANDARDS.md, TESTING_GUIDE.md)

**Optional (when present in the repo):**

3. **.context/ files** (if the repository has this folder)
   - `company-overview.md` - What the company does
   - `product-philosophy.md` - How they build product
   - `tech-stack.md` - Technologies used
   - Many repositories do not have `.context/`; use AGENTS.md and docs/ as primary context in that case.

### A.2 Identify Tech Stack

Determine:

- **Language(s):** TypeScript, Python, etc.
- **Framework(s):** Django, Express, Vue, etc.
- **Testing:** Jest, pytest, Vitest, etc.
- **Linting:** ESLint, pylint, etc.
- **Package manager:** npm, pip, etc.

### A.3 Identify Common Workflows

Map these workflows:

- Quick bugfix
- New feature development
- Refactoring
- Writing tests
- Documentation updates
- PR review process
- Deployment process

### A.4 Check Existing Skills/Agents

Look for:

- `.agents/skills/` - Existing skills
- `.agents/agents/` - Existing agents
- `.agents/docs/skills_agents_catalog.md` - Catalog

**Note patterns:**

- Naming conventions used
- Common guardrails
- Tier distributions

### A.5 Identify Key Commands

Find and verify:

- **Code quality**: `pnpm run biome:check` / `pnpm run biome:fix` - Linting and formatting
- **Type checking**: `pnpm run astro:check` - TypeScript validation
- **Build**: `pnpm run build` - Production build
- **Development**: `pnpm run dev` - Development server
- **Testing**: Check if configured (may not exist in all repos)

**For this repository (Pereira Tech Talks v3.0.0 — Astro):**

```bash
pnpm run biome:check      # Lint and format check
pnpm run biome:fix        # Auto-fix issues
pnpm run astro:check      # TypeScript checking
pnpm run build            # Production build
pnpm run dev              # Development server
```

**Note:** Testing is NOT configured in this repo. `pnpm run test` is a placeholder.

**Mark as "NEEDS VERIFICATION" if not confirmed.**

---

## Phase B: Skill Generation

Use this phase when creating a new Skill.

### B.1 Information Gathering

Ask the user (or analyze from request):

```
1. SKILL NAME
   "What should this skill be called?"
   - Must be kebab-case
   - Action-oriented verb preferred
   - Examples: quick-fix, doc-edit, write-tests

2. PURPOSE
   "What does this skill accomplish?"
   - One or two sentences
   - Clear, specific action

3. TRIGGER
   "How will this skill be invoked?"
   - Usually slash command: /skill-name
   - Or context-based: "when reviewing PR"

4. SCOPE
   "What's the scope?"
   - How many files? (1-3, 1-10, many)
   - How much code change? (<100, 100-500, >500 LOC)
   - What directories/files?

5. RISK LEVEL
   "What's the risk?"
   - Low: formatting, docs, comments
   - Medium: features, tests, safe refactors
   - High: auth, data, migrations, core logic
```

### B.2 Tier Classification

Based on answers, determine tier:

```
IF:
  - Scope: 1-3 files AND
  - LOC: <100 AND
  - Risk: Low AND
  - Task: Mechanical/pattern-following
THEN: Tier 1 (Light/Cheap)

ELSE IF:
  - Scope: 1-10 files AND
  - LOC: 100-500 AND
  - Risk: Medium AND
  - Task: Standard development
THEN: Tier 2 (Standard)

ELSE:
  - Scope: Many files OR
  - LOC: >500 OR
  - Risk: High OR
  - Task: Complex reasoning/architecture
THEN: Tier 3 (Heavy)
```

### B.3 Generate Guardrails

Based on tier, automatically include:

**Tier 1 Guardrails:**

```markdown
## Guardrails

### Scope Limits

- Maximum files: 3
- Maximum LOC: 100
- Allowed: Only specified directories

### Safety Checks

- [ ] No architectural changes
- [ ] No new dependencies
- [ ] Follows existing patterns exactly

### Stop Conditions

Stop immediately if:

- Task requires more than 3 files
- Change exceeds 100 LOC
- Requires understanding complex business logic
```

**Tier 2 Guardrails:**

```markdown
## Guardrails

### Scope Limits

- Maximum files: 10
- Maximum LOC: 500
- Requires: Test coverage for changes

### Safety Checks

- [ ] Tests pass after changes
- [ ] Linting passes
- [ ] No breaking changes to public APIs

### Stop Conditions

Stop immediately if:

- Requires architectural decisions
- Touches auth/security code
- Affects more than 10 files
```

**Tier 3 Guardrails:**

```markdown
## Guardrails

### Scope Limits

- No hard limits, but phased execution required
- Checkpoints every 500 LOC or major milestone
- Rollback plan required before starting

### Safety Checks

- [ ] User confirmation before each phase
- [ ] All tests pass between phases
- [ ] Changes are committed incrementally

### Stop Conditions

Stop and confirm with user if:

- Risk assessment changes
- Unexpected complexity discovered
- Trade-offs need evaluation
```

### B.4 Generate Skill File

Use `templates/SKILL_TEMPLATE.md` as base.

Fill these sections:

1. **Frontmatter** - name, description, disable-model-invocation, allowed-tools, model (based on tier: 1→haiku, 2→sonnet, 3→opus), tier, intent, max-files, max-loc. Include "Use proactively for..." in description.
2. **Objective** - Clear statement from PURPOSE
3. **Non-Goals** - What this skill does NOT do (important!)
4. **Tier Classification** - From B.2, with reasoning
5. **Inputs** - Parameters the skill accepts
6. **Prerequisites** - What must be true before running
7. **Steps** - Detailed execution steps
8. **Output Format** - What the skill produces
9. **Guardrails** - From B.3, matched to tier
10. **Definition of Done** - Clear completion criteria
11. **Escalation Conditions** - When to go to higher tier
12. **Examples** - At least 2 realistic examples

### B.5 Quality Checks

Before finalizing, verify:

- [ ] Name follows kebab-case convention
- [ ] Tier is appropriate for scope/risk
- [ ] Guardrails match the tier
- [ ] Non-goals are explicitly stated
- [ ] Output format is clear
- [ ] At least 2 examples included
- [ ] Escalation conditions defined
- [ ] References repository patterns where relevant

---

## Phase C: Agent Generation

Use this phase when creating a new Agent.

### C.1 Information Gathering

Ask the user (or analyze from request):

```
1. AGENT NAME
   "What should this agent be called?"
   - Must be kebab-case
   - Role-based noun preferred
   - Examples: reviewer, executor, architect

2. ROLE
   "What is this agent's specialty?"
   - What persona do they embody?
   - What expertise do they have?

3. RESPONSIBILITIES
   "What tasks does this agent handle?"
   - List 3-5 specific responsibilities
   - Be concrete, not vague

4. BOUNDARIES
   "What should this agent NOT do?"
   - Critical for preventing scope creep
   - Explicit exclusions

5. RISK LEVEL
   "What's the typical risk of this agent's work?"
   - Determines tier classification
   - Affects guardrails
```

### C.2 Tier Classification

Based on role type:

```
IF:
  - Role: Simple checks, formatting, basic validation
  - Output: Pass/fail, simple lists
  - Decisions: None or trivial
THEN: Tier 1 (Light)

ELSE IF:
  - Role: Standard development, review, testing
  - Output: Changes, reports, recommendations
  - Decisions: Within established patterns
THEN: Tier 2 (Standard)

ELSE:
  - Role: Architecture, planning, complex analysis
  - Output: Plans, designs, strategies
  - Decisions: Significant trade-offs
THEN: Tier 3 (Heavy)
```

**Special Rule:** Planning-only agents (like `architect`) should be Tier 3 with NO code execution capability.

### C.3 Define Interactions

Determine:

```
1. WHO GIVES WORK TO THIS AGENT?
   - User directly?
   - Another agent (which one)?
   - Automated triggers?

2. WHO RECEIVES WORK FROM THIS AGENT?
   - User directly?
   - Another agent (which one)?
   - Systems/tools?

3. WHICH AGENTS DOES THIS WORK WITH?
   - Collaborative relationships
   - Handoff patterns
```

### C.4 Generate Agent File

Use `templates/AGENT_TEMPLATE.md` as base.

Fill these sections:

1. **Frontmatter** - name, description (with "Use proactively for..."), model (based on tier: 1→haiku, 2→sonnet, 3→opus), tools OR disallowedTools (based on restrictions), permissionMode, tier, scope, can-execute-code, can-modify-files
2. **Role** - Detailed persona description
3. **Tier Classification** - From C.2, with reasoning
4. **Scope** - What they handle AND don't handle
5. **Operating Rules** - General principles, decision making
6. **Workflow** - Step-by-step process
7. **Output Format** - Templates for responses
8. **Stop Conditions** - When to stop and report
9. **Escalation Rules** - When to escalate
10. **Interactions** - From C.3
11. **Examples** - At least 2 realistic scenarios

### C.5 Quality Checks

Before finalizing, verify:

- [ ] Name follows kebab-case convention
- [ ] Role is clear and specific
- [ ] Scope boundaries are explicit
- [ ] Operating rules are practical
- [ ] Stop conditions are defined
- [ ] Escalation rules exist
- [ ] Interaction patterns documented
- [ ] At least 2 examples included

---

## Phase D: Output and Placement

### D.1 Skill Output

Create file at:

```
.agents/skills/{skill-name}/SKILL.md
```

### D.2 Agent Output

Create file at:

```
.agents/agents/{agent-name}.md
```

### D.3 Update Catalog (MANDATORY — 5 Steps) and Commands Reference

Update `.agents/docs/skills_agents_catalog.md` with all of the following:

#### Step 1: Update Overview Table

Increment four values in the Overview table at the top of the catalog:

- The cell matching the type row (Skills/Agents) and tier column (Tier 1/2/3)
- The Total column for that type row
- The Total row for that tier column
- The Grand Total (Total row, Total column)

**Example — adding a Tier 1 skill (before → after):**

```markdown
# Before:
| Skills | 12 | 2 | 0 | 14 |
| **Total** | **12** | **6** | **1** | **19** |

# After:
| Skills | 13 | 2 | 0 | 15 |
| **Total** | **13** | **6** | **1** | **20** |
```

#### Step 2: Add to Tier Table

Add the entry to the correct tier table under "Skills by Tier" or "Agents by Tier".

For Skills:

```markdown
| {skill-name} | {intent} | `/{skill-name}` | {brief description} |
```

For Agents:

```markdown
| {agent-name} | {scope} | {description} |
```

#### Step 3: Update Interaction Map (Conditional)

Update the ASCII interaction map ONLY if the new skill/agent changes tier interactions (e.g., new agent bridging tiers, new Tier 3 entry, new Tier 1 category). Skip for routine additions to existing categories.

#### Step 4: Update Domain Section (Conditional)

Add the new entry to the appropriate domain under "Domain-Specific Skills & Agents" (Blog & Content, i18n, Code Quality, Security, or Component & Page Creation). Create a new domain if none fits.

#### Step 5: Add Changelog Entry

Add a new row at the top of the Changelog table:

```markdown
| {YYYY-MM-DD} | {name} added | {brief description} |
```

#### Step 6: Update Commands Reference

If the new skill has a slash command invocation, add an entry to the correct category table in `.agents/docs/COMMANDS_REFERENCE.md`:

```markdown
| `/{skill-name}` | `.agents/skills/{skill-name}/SKILL.md` | {brief description} |
```

#### Catalog Update Validation

After updating, verify:

- [ ] Overview table counts are arithmetically correct
- [ ] Entry appears in the correct tier table
- [ ] Domain section updated if applicable
- [ ] Changelog entry added at the top
- [ ] No duplicate entries
- [ ] Commands Reference updated with new command entry (if skill has slash command)

### D.4 Verify Placement

Confirm:

- [ ] File created at correct location
- [ ] File follows template structure
- [ ] Catalog updated
- [ ] No conflicts with existing skills/agents

---

## Validation Checklist

Before completing any Skill or Agent generation, verify ALL:

### For Skills

- [ ] Name is kebab-case
- [ ] Tier matches scope and risk
- [ ] Guardrails prevent scope creep
- [ ] Non-goals are explicit
- [ ] Output format is specified
- [ ] Escalation conditions are clear
- [ ] At least 2 examples provided
- [ ] Follows repository patterns

### For Agents

- [ ] Name is kebab-case
- [ ] Tier matches role complexity
- [ ] Scope boundaries are explicit
- [ ] Operating rules are practical
- [ ] Stop conditions are defined
- [ ] Escalation rules exist
- [ ] Interactions documented
- [ ] At least 2 examples provided

---

## Quick Reference

### Tier Determination Flowchart

```
START
  │
  ├─ Is it simple formatting/docs/comments?
  │   └─ YES → Tier 1
  │
  ├─ Does it involve auth/payments/migrations?
  │   └─ YES → Tier 3
  │
  ├─ Does it affect >10 files or >500 LOC?
  │   └─ YES → Tier 3
  │
  ├─ Does it require architectural decisions?
  │   └─ YES → Tier 3
  │
  └─ Is it standard feature/test/refactor work?
      └─ YES → Tier 2
```

### Common Patterns

**Skill for simple fixes:** Tier 1, 3 files max, pattern-following
**Skill for features:** Tier 2, tests required, bounded scope
**Skill for planning:** Tier 3, no execution, produces plan
**Agent for review:** Tier 2, read-only, produces reports
**Agent for execution:** Tier 2, follows plans strictly
**Agent for architecture:** Tier 3, planning only, no code changes

---

## Example: Complete Skill Generation

**User Request:** "Create a skill for adding a new blog post"

**Phase A Analysis:**

- Tech: Astro, TypeScript, MDX, Content Collections
- Patterns: Frontmatter schema in content.config.ts
- Existing: No similar skill

**Phase B Classification:**

- Scope: 1 file (content file)
- LOC: Usually <50
- Risk: Low (content only, no code changes)
- **Tier: 1**

**Generated Skill:**

```markdown
---
name: add-blog-post
description: Create a new blog post with proper frontmatter. Use proactively when creating new blog posts.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: haiku
# === Documentation (ignored by tools, useful for humans) ===
tier: 1
intent: create
max-files: 2
max-loc: 400
---

# Skill: Add Blog Post

## Objective

Create a new blog post in src/content/blog/ with correct frontmatter schema...

[... full skill content ...]
```

---

## Example: Complete Agent Generation

**User Request:** "Create an agent that reviews component accessibility"

**Phase A Analysis:**

- Tech: Astro, Svelte, Tailwind CSS
- Patterns: WCAG guidelines, semantic HTML
- Risk: UX issues = medium

**Phase C Classification:**

- Role: Specialized reviewer
- Decisions: Pattern-based recommendations
- **Tier: 2** (read-only analysis)

**Generated Agent:**

```markdown
---
name: a11y-reviewer
description: Reviews components for accessibility issues. Use proactively for accessibility audits.
# === Claude Code specific ===
tools: Read, Grep, Glob, Bash
model: sonnet
permissionMode: default
# === Documentation (ignored by tools, useful for humans) ===
tier: 2
scope: Accessibility analysis and recommendations
can-execute-code: false
can-modify-files: false
---

# Agent: Accessibility Reviewer

## Role

A specialized reviewer focused on web accessibility (WCAG compliance)...

[... full agent content ...]
```
