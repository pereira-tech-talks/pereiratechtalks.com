---
description: Author or update a specialized agent in this repo (provided by the installed `deepworkplan` skill)
---

# /agent-create — provided by the `deepworkplan` skill

> Thin alias. The flow lives in the installed `deepworkplan` skill — this file
> only routes to it, so there is a single source of truth and no drift.

## What to do

Route this invocation to the **author** sub-skill of the installed `deepworkplan`
skill and follow its **Create an agent** flow: read
`.agents/skills/deepworkplan/author/SKILL.md` and execute it, passing along any
arguments as the agent name/role. New agents live in `.agents/agents/`. Choose a
model tier with justification and keep this repo's `.agents/docs/` catalog
(`skills_agents_catalog.md`) in sync.

> Other agents: invoke the skill's `deepworkplan-author` sub-skill directly
> (`/deepworkplan-author` in Claude Code, `#deepworkplan-author` elsewhere). This
> `agent-create` file is the shorter, conventional alias.
