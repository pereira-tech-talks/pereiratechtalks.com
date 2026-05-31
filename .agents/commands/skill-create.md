---
description: Create a new skill with guided workflow
---

# Skill Creator - Guided Workflow

You are a skill creator that guides users through creating new Skills for the repository.

## Parameter Reference

| Parameter | Description | Example |
|-----------|-------------|---------|
| (none) | Interactive guided flow | `/skill-create` |
| `{name}` | Named skill, guided flow | `/skill-create quick-lint` |
| `{name} trust` | Named skill, no confirmations | `/skill-create quick-lint trust` |
| `trust` | Trust mode, asks name | `/skill-create trust` |

## Modes

### 🎯 Guided Mode (default)
- Asks questions to understand the skill
- Shows draft for review
- Asks confirmation before creating

### 🚀 Trust Mode
- Asks essential questions only
- Creates skill automatically
- No confirmations

---

## Workflow

### Step 1: Introduction

**Guided mode:**
```
🎯 Skill Creator

I'll help you create a new Skill. Here's what we'll do:
1. You describe what the skill should do
2. I determine the appropriate tier (1/2/3)
3. I generate the skill file
4. You review and approve

Let's start!
```

**Trust mode:**
```
🚀 Skill Creator (Trust Mode)

I'll create a skill based on your input.
Let's go!
```

### Step 2: Gather Information

Ask these questions:

**2.1 Name (if not provided):**
```
What should this skill be called?
(kebab-case, e.g., "quick-fix", "write-tests", "format-code")
```

**2.2 Purpose:**
```
What does this skill do?
(One or two sentences describing the action)
```

**2.3 Scope:**
```
What's the scope?
- How many files typically affected? (1-3 / 1-10 / many)
- How much code changes? (<100 LOC / 100-500 / >500)
```

**2.4 Risk:**
```
What's the risk level?
- Low: formatting, docs, comments
- Medium: features, tests, safe refactors
- High: auth, security, data, core logic
```

### Step 3: Determine Tier

Based on answers:

```
IF scope=1-3 AND loc<100 AND risk=low:
  → Tier 1 (Light)
ELSE IF scope<=10 AND loc<=500 AND risk<=medium:
  → Tier 2 (Standard)
ELSE:
  → Tier 3 (Heavy)
```

### Step 4: Generate Skill

1. Read `AGENTS.md` for repository patterns
2. Read `.agent_commands/agent_skills_generator/templates/SKILL_TEMPLATE.md`
3. Fill template with gathered information
4. Add appropriate guardrails for tier
5. Generate 2-3 examples

### Step 5: Review (Guided Mode)

Show summary:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Skill Ready: {name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: {name}
Tier: {tier}
Purpose: {purpose}

Guardrails:
- Max files: {N}
- Max LOC: {N}

Create this skill?
1. ✅ Yes, create it
2. 📝 Make adjustments
3. 👀 Show full content
4. ❌ Cancel
```

### Step 6: Create File and Update Catalog

#### Part A: Create Skill File

Create at: `.agents/skills/{name}/SKILL.md`

Verify:
- [ ] File follows template structure from `SKILL_TEMPLATE.md`
- [ ] All sections are filled (no placeholders)
- [ ] Tier-appropriate guardrails included
- [ ] At least 2 examples included

#### Part B: Update Catalog (MANDATORY)

Update `.agents/docs/skills_agents_catalog.md` with ALL of the following:

**B.1 — Overview Table:** Increment 4 values:
- Skills row, Tier {N} column: +1
- Skills row, Total column: +1
- Total row, Tier {N} column: +1
- Total row, Total column (Grand Total): +1

**B.2 — Tier Table:** Add entry to the matching tier under "Skills by Tier":
```markdown
| {name} | {intent} | `/{name}` | {description} |
```

**B.3 — Interaction Map (if needed):** Update only if this skill introduces a new Tier 1 category or affects tier interactions.

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
✅ Skill Created: {name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: .agents/skills/{name}/SKILL.md
Tier: {tier}

Invoke with: /{name}

To list all skills: /skill-list
```

---

## Quick Example

```
User: /skill-create fix-imports trust

Agent: 🚀 Skill Creator (Trust Mode)
       What does this skill do?

User: Fixes and sorts import statements

Agent: What's the scope? (files/LOC)

User: Usually 1-5 files, under 50 lines changed

Agent: Risk level?

User: Low - just imports, no logic changes

Agent: Creating skill...
       
       ✅ Skill Created: fix-imports
       Location: .agents/skills/fix-imports/SKILL.md
       Tier: 1 (Light)
```

---

## Important References

- Template: `.agent_commands/agent_skills_generator/templates/SKILL_TEMPLATE.md`
- Guide: `.agent_commands/agent_skills_generator/GUIDE_TO_CREATE_SKILLS_AND_AGENTS.md`
- Routing: `.agent_commands/agent_skills_generator/MODEL_ROUTING.md`
