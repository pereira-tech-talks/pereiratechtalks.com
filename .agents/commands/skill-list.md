---
description: List all available skills with tier and description
---

# Skill List

Lists all available skills in the repository, organized by tier.

## Parameter Reference

| Parameter | Description | Example |
|-----------|-------------|---------|
| (none) | List all skills | `/skill-list` |
| `tier:N` | Filter by tier | `/skill-list tier:1` |
| `{query}` | Search by name/description | `/skill-list review` |

---

## Workflow

### Step 1: Scan Skills

Read all skills from `.agents/skills/*/SKILL.md`

Extract from each:
- Name (from frontmatter)
- Description (from frontmatter)
- Tier (from frontmatter)
- Intent (from frontmatter)

### Step 2: Apply Filters

If `tier:N` provided, filter to that tier.
If query provided, filter by name/description match.

### Step 3: Display Results

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Available Skills
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Tier 1 (Light/Cheap)
Fast, low-risk, pattern-following tasks

| Skill | Intent | Description |
|-------|--------|-------------|
| `quick-fix` | fix | Small bug fixes in 1-3 files |
| `doc-edit` | docs | Documentation updates |
| `pr-review-lite` | review | Quick PR checklist |

## Tier 2 (Standard)
Everyday development work

| Skill | Intent | Description |
|-------|--------|-------------|
| `feature-implement` | execute | Add features with tests |
| `write-tests` | tests | Create unit/integration tests |
| `refactor-safe` | execute | Safe code refactoring |

## Tier 3 (Heavy/Reasoning)
Complex planning and architecture

| Skill | Intent | Description |
|-------|--------|-------------|
| `deep-work-plan` | plan | Complex multi-step planning |
| `architecture-review` | review | Design decisions |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: {N} skills

📝 Create new: /skill-create
📖 Details: .agents/skills/{name}/SKILL.md
```

---

## Filtered Output Example

```
User: /skill-list tier:1

Agent:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Tier 1 Skills (Light/Cheap)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Skill | Intent | Description |
|-------|--------|-------------|
| `quick-fix` | fix | Small bug fixes in 1-3 files |
| `doc-edit` | docs | Documentation updates |
| `pr-review-lite` | review | Quick PR checklist |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Showing: 3 Tier 1 skills
```

---

## Search Example

```
User: /skill-list review

Agent:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Skills matching "review"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Skill | Tier | Description |
|-------|------|-------------|
| `pr-review-lite` | 1 | Quick PR checklist |
| `architecture-review` | 3 | Design decisions |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Found: 2 skills
```

---

## If No Skills Found

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 No Skills Found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No skills found in .agents/skills/

To create your first skill: /skill-create
```
