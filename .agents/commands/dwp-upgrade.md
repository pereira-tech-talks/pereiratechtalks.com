---
description: Check for a newer DeepWorkPlan skill release and upgrade it safely (provided by the installed `deepworkplan` skill)
---

# /dwp-upgrade — provided by the `deepworkplan` skill

> Thin alias. The flow lives in the installed `deepworkplan` skill — this file
> only routes to it, so there is a single source of truth and no drift.

## What to do

Route this invocation to the **upgrade** sub-skill of the installed `deepworkplan`
skill and follow it: read `.agents/skills/deepworkplan/upgrade/SKILL.md` and
execute its flow. It checks the latest published tag against the version
installed at `.agents/skills/deepworkplan/`, reports whether a newer release
exists, and — before overwriting anything — diffs the incoming release against
the installed tree so a local adaptation of the vendored skill is surfaced
rather than silently lost. It installs only after explicit confirmation.

> The skill package and the harness content are independent. After upgrading the
> package, run `/dwp-verify`: if it reports a `harness-version finding`, the
> repository's `AGENTS.md` / `docs/` still reflect an older standard and the
> `onboard` sub-skill in upgrade mode is what reconciles them.

> Other agents: invoke the skill's `deepworkplan-upgrade` sub-skill directly
> (`/deepworkplan-upgrade` in Claude Code, `#deepworkplan-upgrade` elsewhere).
> This `dwp-upgrade` file is the shorter, conventional alias.
