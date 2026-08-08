---
description: Objectively verify repository and plan DWP conformance (pass/fail) (provided by the installed `deepworkplan` skill)
---

# /dwp-verify — provided by the `deepworkplan` skill

> Thin alias. The flow lives in the installed `deepworkplan` skill — this file
> only routes to it, so there is a single source of truth and no drift.

## What to do

Route this invocation to the **verify** sub-skill of the installed `deepworkplan`
skill and follow it: read `.agents/skills/deepworkplan/verify/SKILL.md` and
execute its flow. It produces an objective pass/fail conformance report against
the DWP specification's Conformance criteria — repository artifacts
(`AGENTS.md`, `docs/`, `.agents/`, `.dwp/`, the `.claude → .agents` symlink) and,
when a plan is named, that plan's well-formedness. It makes **no changes**.

> Other agents: invoke the skill's `deepworkplan-verify` sub-skill directly
> (`/deepworkplan-verify` in Claude Code, `#deepworkplan-verify` elsewhere). This
> `dwp-verify` file is the shorter, conventional alias.
