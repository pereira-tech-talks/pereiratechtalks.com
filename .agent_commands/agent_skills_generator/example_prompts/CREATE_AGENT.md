# CREATE_AGENT.md - Agent Creation Prompt

## Overview

This prompt guides the creation of a new Agent. Follow each phase carefully to ensure the agent has a clear role, appropriate scope, and well-defined interactions.

---

## Phase 1: Gather Information

Ask the user these questions (or extract from their request):

### 1.1 Agent Name

```
What should this agent be called?

Requirements:
- Must be kebab-case (lowercase with hyphens)
- Should be role-based (noun)
- Should indicate specialization

Examples:
  ✓ reviewer
  ✓ executor
  ✓ security-auditor
  ✓ perf-optimizer
  ✗ CodeReviewer (not kebab-case)
  ✗ agent1 (not descriptive)
```

### 1.2 Role/Persona

```
What is this agent's specialty?

Describe:
- What expertise do they have?
- What perspective do they bring?
- How do they approach problems?

Examples:
  ✓ "A meticulous code reviewer focused on maintainability"
  ✓ "An efficient executor that follows plans precisely"
  ✗ "Does code stuff" (too vague)
```

### 1.3 Responsibilities

```
What specific tasks does this agent handle?

List 3-5 concrete responsibilities:
- Be specific, not vague
- Use action verbs
- Focus on outcomes

Examples:
  ✓ "Reviews pull requests for code quality"
  ✓ "Identifies potential security vulnerabilities"
  ✗ "Helps with code" (too vague)
```

### 1.4 Boundaries

```
What should this agent explicitly NOT do?

This is critical for preventing scope creep.
List things that might be confused as in-scope:

Examples:
  ✓ "Does NOT implement features (review only)"
  ✓ "Does NOT make architectural decisions"
```

### 1.5 Risk Level

```
What's the typical risk level of this agent's work?

Consider:
- Can they modify code?
- Can they affect production?
- Do they make decisions with consequences?

LOW risk: Read-only, advisory
MEDIUM risk: Standard changes, within patterns
HIGH risk: Architecture, security, data
```

---

## Phase 2: Classify Tier

Based on role type and responsibilities:

### Decision Matrix

| If agent...                              | Then Tier... |
| ---------------------------------------- | ------------ |
| Does simple checks, read-only, advisory  | **Tier 1**   |
| Does standard dev work, reviews, testing | **Tier 2**   |
| Makes architecture decisions, planning   | **Tier 3**   |

### Tier 1 Indicators

- Simple, repetitive checks
- Read-only operations
- Pass/fail outputs
- No significant decisions

### Tier 2 Indicators

- Standard development work
- Code changes within patterns
- Review and recommendations
- Execution of defined tasks

### Tier 3 Indicators

- Architecture/design decisions
- Planning and strategy
- Complex trade-off analysis
- High-risk changes

### Special Rule: Planning vs Execution

**Planning-only agents** (like `architect`) should be:

- Tier 3
- NO code execution capability
- Output is plans/designs only
- Hands off to executor for implementation

---

## Phase 3: Define Interactions

Determine how this agent works with others:

### 3.1 Work Sources

```
Who gives work to this agent?

Options:
- User directly
- Another agent (which one?)
- Automated triggers
```

### 3.2 Work Destinations

```
Who receives work from this agent?

Options:
- User directly
- Another agent (which one?)
- Systems/tools
```

### 3.3 Collaborations

```
Which agents does this work alongside?

Consider:
- Complementary roles
- Handoff patterns
- Sequential workflows
```

---

## Phase 4: Read Repository Context

**BEFORE generating the agent, read:**

1. **AGENTS.md** (if exists)
   - Coding standards
   - Existing conventions

2. **Existing agents** in `.agents/agents/`
   - Naming patterns
   - Role definitions
   - Interaction patterns

3. **Existing skills** in `.agents/skills/`
   - What skills could this agent invoke?

---

## Phase 5: Generate Agent File

### 5.1 Use the Template

Copy `templates/AGENT_TEMPLATE.md` as your starting point.

### 5.2 Fill All Sections

**Required sections (must have content):**

- Role
- Tier Classification
- Scope (handles AND does not handle)
- Operating Rules
- Workflow
- Output Format
- Stop Conditions
- Escalation Rules
- Interactions
- Examples (at least 2)

### 5.3 Define Clear Boundaries

Ensure the scope section has:

- Explicit list of what agent handles
- Explicit list of what agent does NOT handle
- Clear boundaries between this and related agents

### 5.4 Write Realistic Examples

Each example should include:

- Request (what was asked)
- Agent response (how they handled it)

Include at least:

1. Happy path example
2. Complex scenario example
3. (Optional) Escalation example

---

## Phase 6: Validate Before Saving

### Checklist

- [ ] **Name:** Follows kebab-case convention
- [ ] **Role:** Clear and specific persona
- [ ] **Tier:** Appropriate for complexity
- [ ] **Scope:** Explicit boundaries (handles + does NOT handle)
- [ ] **Rules:** Practical operating principles
- [ ] **Workflow:** Clear step-by-step process
- [ ] **Output:** Defined formats for all response types
- [ ] **Stop Conditions:** Clear triggers to halt
- [ ] **Escalation:** Rules and path defined
- [ ] **Interactions:** Documented relationships
- [ ] **Examples:** At least 2 realistic scenarios

### Common Mistakes to Avoid

❌ Vague role definition (will cause confusion)
❌ Missing boundaries (scope will creep)
❌ No escalation path (will get stuck)
❌ Overlapping with existing agents (conflict)
❌ Too broad scope (should be multiple agents)

---

## Phase 7: Place the File

### Create Agent

```bash
# Create agent file at:
.agents/agents/{agent-name}.md
```

### Update Catalog

Add entry to `.agents/docs/skills_agents_catalog.md`:

```markdown
| {agent-name} | {tier} | {scope} | {when to use} |
```

---

## Quick Reference: Agent Generation Flow

```
User Request
     │
     ▼
┌─────────────────┐
│ Gather Info     │
│ - Name          │
│ - Role          │
│ - Responsibilities
│ - Boundaries    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Classify Tier   │
│ 1 = Simple      │
│ 2 = Standard    │
│ 3 = Complex     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Define          │
│ Interactions    │
│ - Work from     │
│ - Work to       │
│ - Collaborates  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Read Context    │
│ - AGENTS.md     │
│ - Existing      │
│   agents/skills │
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
│ - Save .md      │
│ - Update catalog│
└─────────────────┘
```

---

## Example: Full Agent Creation

**User Request:** "I need an agent that reviews database queries for performance"

### Phase 1: Information Gathered

- Name: `query-reviewer`
- Role: Specialized reviewer for database query performance
- Responsibilities:
  - Analyze SQL queries for performance issues
  - Identify N+1 query problems
  - Suggest indexing improvements
  - Flag expensive operations
- Boundaries:
  - Does NOT modify queries
  - Does NOT make schema changes
  - Does NOT handle security issues (different agent)
- Risk: Medium (advisory only)

### Phase 2: Tier Classification

- Role: Specialized reviewer (not planning)
- Output: Recommendations
- Decisions: Pattern-based
- **→ Tier 2**

### Phase 3: Interactions

- Receives work from: User, PR workflow
- Hands work to: Developer (for fixes), `executor` (if automated)
- Collaborates with: `reviewer` (general), `perf-optimizer` (if escalation)

### Phase 4: Context Read

- AGENTS.md: Django ORM used, PostgreSQL
- Existing agents: `reviewer` exists (general)
- Skills: None for query analysis

### Phase 5: Generated Agent

```markdown
---
name: query-reviewer
description: Reviews database queries for performance issues
tier: 2
scope: Database query analysis and recommendations
---

# Agent: Query Reviewer

## Role

A specialized reviewer focused on database query performance. Analyzes queries for efficiency issues, identifies patterns that cause performance problems, and provides actionable recommendations.

## Scope

### What This Agent Handles

- Analyzing SQL/ORM queries for performance
- Identifying N+1 query problems
- Suggesting index improvements
- Flagging expensive operations

### What This Agent Does NOT Handle

- Modifying code (review only)
- Schema migrations
- Security issues
- Non-database performance

[... rest of agent ...]
```

### Phase 6: Validated

✅ All checklist items pass

### Phase 7: Placed

- Created `.agents/agents/query-reviewer.md`
- Updated catalog
