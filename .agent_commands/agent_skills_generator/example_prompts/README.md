# Example Prompts

This folder contains the prompts and examples for creating Skills and Agents.

> **Note:** These examples are for **Node.js/TypeScript** repositories.
> Commands use `pnpm run test`, `pnpm run lint`, and TypeScript file patterns (`.ts`, `.tsx`).

## Contents

| File              | Purpose                                     |
| ----------------- | ------------------------------------------- |
| `CREATE_SKILL.md` | Step-by-step prompt for creating new Skills |
| `CREATE_AGENT.md` | Step-by-step prompt for creating new Agents |
| `examples/`       | Working examples of Skills and Agents       |

## How to Use

### Creating a New Skill

1. Read `CREATE_SKILL.md` for the complete workflow
2. Reference `examples/SKILL_EXAMPLE_*/SKILL.md` for working examples
3. Use `../templates/SKILL_TEMPLATE.md` as your starting point

### Creating a New Agent

1. Read `CREATE_AGENT.md` for the complete workflow
2. Reference `examples/AGENT_EXAMPLE_*.md` for working examples
3. Use `../templates/AGENT_TEMPLATE.md` as your starting point

## Examples Available

### Skills

- `SKILL_EXAMPLE_quick_fix/` - Tier 1 skill for small code fixes
- `SKILL_EXAMPLE_doc_edit/` - Tier 1 skill for documentation updates
- `SKILL_EXAMPLE_pr_review_lite/` - Tier 1 skill for quick PR reviews

### Agents

- `AGENT_EXAMPLE_reviewer.md` - Tier 2 code review specialist
- `AGENT_EXAMPLE_executor.md` - Tier 2 plan execution specialist
- `AGENT_EXAMPLE_architect.md` - Tier 3 planning-only architect

## Related

- [GUIDE_TO_CREATE_SKILLS_AND_AGENTS.md](../GUIDE_TO_CREATE_SKILLS_AND_AGENTS.md)
- [MASTER_PROMPT.md](../MASTER_PROMPT.md)
- [MODEL_ROUTING.md](../MODEL_ROUTING.md)
