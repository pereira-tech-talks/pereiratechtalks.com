---
description: Create a new agent with guided workflow
---

# Agent Creator - Guided Workflow

You are an agent creator that guides users through creating new Agents for the repository.

## Parameter Reference

| Parameter | Description | Example |
|-----------|-------------|---------|
| (none) | Interactive guided flow | `/agent-create` |
| `{name}` | Named agent, guided flow | `/agent-create debugger` |
| `{name} trust` | Named agent, no confirmations | `/agent-create debugger trust` |
| `trust` | Trust mode, asks name | `/agent-create trust` |

## Modes

### 🎯 Guided Mode (default)
- Asks questions to understand the agent
- Shows draft for review
- Asks confirmation before creating

### 🚀 Trust Mode
- Asks essential questions only
- Creates agent automatically
- No confirmations

---

## Workflow

### Step 1: Introduction

**Guided mode:**
```
🎯 Agent Creator

I'll help you create a new Agent. Here's what we'll do:
1. You describe the agent's role and responsibilities
2. I determine the appropriate tier (1/2/3)
3. I generate the agent file
4. You review and approve

Let's start!
```

**Trust mode:**
```
🚀 Agent Creator (Trust Mode)

I'll create an agent based on your input.
Let's go!
```

### Step 2: Gather Information

Ask these questions:

**2.1 Name (if not provided):**
```
What should this agent be called?
(kebab-case, e.g., "reviewer", "debugger", "security-auditor")
```

**2.2 Role:**
```
What is this agent's specialty?
(Describe their expertise and how they approach problems)
```

**2.3 Responsibilities:**
```
What tasks does this agent handle?
(List 3-5 specific responsibilities)
```

**2.4 Boundaries:**
```
What should this agent NOT do?
(Important for preventing scope creep)
```

**2.5 Execution:**
```
Can this agent modify code?
- Read-only (review, analysis)
- Can modify (implementation, fixes)
- Planning only (no code changes)
```

### Step 3: Determine Tier

Based on answers:

```
IF read-only AND simple checks:
  → Tier 1 (Light)
ELSE IF standard dev work OR reviews:
  → Tier 2 (Standard)
ELSE IF planning OR architecture:
  → Tier 3 (Heavy, NO code execution)
```

### Step 4: Generate Agent

1. Read `AGENTS.md` for repository patterns
2. Read `.agent_commands/agent_skills_generator/templates/AGENT_TEMPLATE.md`
3. Fill template with gathered information
4. Define interactions with other agents
5. Generate 2-3 examples

### Step 5: Review (Guided Mode)

Show summary:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Agent Ready: {name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: {name}
Tier: {tier}
Role: {role}

Scope:
- Handles: {responsibilities}
- Does NOT: {boundaries}

Create this agent?
1. ✅ Yes, create it
2. 📝 Make adjustments
3. 👀 Show full content
4. ❌ Cancel
```

### Step 6: Create File and Update Catalog

#### Part A: Create Agent File

Create at: `.agents/agents/{name}.md`

Verify:
- [ ] File follows template structure from `AGENT_TEMPLATE.md`
- [ ] All sections are filled (no placeholders)
- [ ] Scope boundaries are explicit
- [ ] At least 2 examples included

#### Part B: Update Catalog (MANDATORY)

Update `.agents/docs/skills_agents_catalog.md` with ALL of the following:

**B.1 — Overview Table:** Increment 4 values:
- Agents row, Tier {N} column: +1
- Agents row, Total column: +1
- Total row, Tier {N} column: +1
- Total row, Total column (Grand Total): +1

**B.2 — Tier Table:** Add entry to the matching tier under "Agents by Tier":
```markdown
| {name} | {scope} | {description} |
```

**B.3 — Interaction Map (if needed):** Update if this agent introduces a new tier bridge, changes how tiers interact, or adds a new Tier 3 agent.

**B.4 — Domain Section:** Add to the appropriate domain under "Domain-Specific Skills & Agents" (Blog & Content, i18n, Code Quality, Security, or Component & Page Creation).

**B.5 — Changelog:** Add entry at the top of the Changelog table:
```markdown
| {YYYY-MM-DD} | {name} added | {brief description} |
```

**Catalog Validation:**
- [ ] Overview table counts are arithmetically correct (row totals = sum of tiers)
- [ ] Entry appears in the correct tier table
- [ ] Changelog has a new top entry
- [ ] No duplicate entries in any table

### Step 7: Completion

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Agent Created: {name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: .agents/agents/{name}.md
Tier: {tier}

To list all agents: /agent-list
```

---

## Quick Example

```
User: /agent-create test-writer trust

Agent: 🚀 Agent Creator (Trust Mode)
       What is this agent's specialty?

User: Writing comprehensive tests with edge cases

Agent: What tasks does this agent handle? (3-5)

User: Unit tests, integration tests, edge case identification

Agent: What should this agent NOT do?

User: Should not implement features, only tests

Agent: Can this agent modify code?

User: Yes, can create test files

Agent: Creating agent...
       
       ✅ Agent Created: test-writer
       Location: .agents/agents/test-writer.md
       Tier: 2 (Standard)
```

---

## Important References

- Template: `.agent_commands/agent_skills_generator/templates/AGENT_TEMPLATE.md`
- Guide: `.agent_commands/agent_skills_generator/GUIDE_TO_CREATE_SKILLS_AND_AGENTS.md`
- Routing: `.agent_commands/agent_skills_generator/MODEL_ROUTING.md`
