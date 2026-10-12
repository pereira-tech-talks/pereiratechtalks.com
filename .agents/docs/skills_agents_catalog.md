# Skills & Agents Catalog

This document serves as the central reference for all available Skills and Agents in this repository.

## Overview

| Type   | Tier 1 (Light) | Tier 2 (Standard) | Tier 3 (Heavy) | Total |
|--------|:--------------:|:------------------:|:--------------:|:-----:|
| Skills | 13             | 11                 | 1              | 25    |
| Agents | 0              | 5                  | 1              | 6     |
| **Total** | **13**      | **15**             | **2**          | **30** |

---

## Skills by Tier

Skills are reusable "how-to" procedures invoked via slash commands.

### Tier 1 (Light/Cheap)

Fast, low-risk, pattern-following tasks.

| Skill           | Intent | Invocation        | Model  | Description                                                                 |
|-----------------|--------|-------------------|--------|-----------------------------------------------------------------------------|
| quick-fix       | fix    | `/quick-fix`      | haiku  | Fix small bugs in 1-3 files following existing patterns                    |
| doc-edit        | docs   | `/doc-edit`       | haiku  | Update documentation (README, comments, MDX, markdown)                      |
| pr-review-lite  | review | `/pr-review-lite` | haiku  | Quick checklist review of a PR (style, obvious bugs, Astro patterns)        |
| fix-lint        | fix    | `/fix-lint`       | haiku  | Fix Biome linting/formatting errors in 1-3 files                           |
| type-fix        | fix    | `/type-fix`       | haiku  | Fix TypeScript type errors in 1-3 files (explicit types, Astro types)      |
| security-check  | review | `/security-check` | haiku  | Quick security checklist (secrets, API routes, client exposure)             |
| git-commit-push | execute| `/git-commit-push`| haiku  | Commit all changes and push to remote                                       |
| add-component   | create | `/add-component`  | haiku  | Create new Astro or Svelte component with correct patterns                  |
| add-page        | create | `/add-page`       | haiku  | Create new page with routing and MainLayout                                 |
| add-timeline-page | create | `/add-timeline-page` | haiku | Add a new tag-filtered infinite-scroll timeline page (e.g. /trading, /entrepreneur) |
| translate-sync  | execute| `/translate-sync` | haiku  | Synchronize content between English and Spanish versions                    |
| optimize-image  | execute| `/optimize-image` | haiku  | Convert and optimize images to WebP for blog posts and series               |
| update-styles   | fix    | `/update-styles`  | haiku  | Update Tailwind styles with dark mode support                               |

### Tier 2 (Standard)

Everyday development work.

| Skill         | Intent   | Invocation       | Model  | Description                                                              |
|---------------|----------|------------------|--------|--------------------------------------------------------------------------|
| add-blog-post | create   | `/add-blog-post` | sonnet | **Mandatory for new blog posts** — topic mode (writes content) or content mode (scaffolding). |
| add-slide-deck | create  | `/add-slide-deck` | sonnet | **Mandatory for new slide decks** — internal Reveal.js, external-embed, or external-link. |
| add-meetup    | create   | `/add-meetup`    | sonnet | **Mandatory for new meetups** — bilingual entries in the `meetups` collection with optional talk/speaker/sponsor references. Includes **planned mode**: programming a meetup from a date alone (`dateConfidence`, `callForSpeakers`, no venue/hero/line-up). |
| add-talk      | create   | `/add-talk`      | sonnet | **Mandatory for new talks** — bilingual talk files linked to speakers + meetup/PTD event. |
| add-event     | create   | `/add-event`     | sonnet | **Mandatory for new events** — workshops, hackathons, conferences, webinars in the `events` collection. |
| audit-post    | review   | `/audit-post`    | sonnet | Pre-publication audit for blog posts — SEO, AEO, accessibility, images, content quality, i18n parity, and project conventions. |
| audit-series  | review   | `/audit-series`  | sonnet | Pre-publication audit for blog series — series definition, post ordering, cross-post consistency, navigation, and individual post summary checks. |
| audit-taxonomy | review  | `/audit-taxonomy` | sonnet | Read-only audit of the blog tag taxonomy — frequency, orphans, hierarchy, and proposals for new subtopic tags. Writes report to `tmp/audit-taxonomy/`. See [Blog Posts → Tags](../../docs/features/BLOG_POSTS.md). |
| audit-analytics | review | `#audit-analytics` | sonnet | Audit Umami event coverage, first-party proxy wiring, and privacy-safe payloads against `src/lib/analytics.ts` + `docs/ANALYTICS.md`. |
| audit-language-integrity | review | `/audit-language-integrity` | sonnet | Audit sitewide language integrity — Spanish URLs render Spanish, English URLs English, in HTML **and** in the `.md` twin. Triages the scanner's two confidence tiers and orders the fixes. See [I18N Guide](../../docs/I18N_GUIDE.md). |
| audit-content-parity | review | `/audit-content-parity` | sonnet | Audit whether the two languages of an entry carry the **same content** — same sources, same structure, same `{en,es}` fields. The sibling question to language integrity: a page can be correct English and still be missing what the Spanish says. Triages six classes and orders the fixes. See [I18N Guide § Content parity](../../docs/I18N_GUIDE.md). |
| verify-form-intake | verify | `/verify-form-intake` | sonnet | Prove an intake form reaches Dailybot end to end — real browser, real Pages Function (`wrangler pages dev`), every answer read back **by question UUID**, then the test data deleted. Closes the gap between the unit tests (which call the Function directly) and the e2e suites (which intercept the endpoint). Run whenever a form field is added, made required, or remapped. See [Forms](../../docs/features/FORMS.md). |
| promote-post  | create   | `/promote-post`  | sonnet | Generate social media content for any blog post (Twitter/X, LinkedIn, HN, dev.to, Reddit, Facebook) |
| write-tests   | tests    | `/write-tests`   | sonnet | Add or expand tests (*.test.ts) - Vitest/Playwright when configured      |
| refactor-safe | execute  | `/refactor-safe` | sonnet | Safe refactor in bounded scope (1-10 files, no behavior change)          |

### Tier 3 (Heavy/Reasoning)

Complex planning and architecture.

| Skill | Intent | Invocation | Model | Description |
|-------|--------|-------------|-------|-------------|
| add-ptd-edition | create | `/add-ptd-edition` | sonnet | **Mandatory for new Pereira Tech Day editions** — annual conference with schedule, keynotes, brand kit, organizers, and gallery. |
| issue-certificates | create | `#issue-certificates` | sonnet | Batch-issue signed attendance certificates from CSV (import → sign → verify → build). Never commit private keys or attendee emails. |

---

## Agents by Tier

Agents are specialized personas for different types of work.

### Tier 2 (Standard)

Development and review specialists.

| Agent             | Scope                          | Model  | Description                                                |
|-------------------|---------------------------------|--------|------------------------------------------------------------|
| reviewer          | Code review and quality analysis | sonnet | Thorough PR review; Astro/Svelte patterns, dark mode, quality |
| executor          | Executing predefined plans     | sonnet | Follows plans step by step; implements and validates      |
| security-auditor  | Security review (read-only)    | sonnet | Static site security; API routes, secrets, client exposure |
| i18n-guardian     | Multilingual content & translation quality | sonnet | Translation quality specialist; multilingual consistency enforcer |
| content-writer    | Blog posts, portfolio articles, narrative content | sonnet | Expert multilingual content writer with personal-professional voice |

### Tier 3 (Heavy/Reasoning)

Planning and architecture specialists.

| Agent     | Scope                                  | Model | Description                                      |
|-----------|----------------------------------------|-------|--------------------------------------------------|
| architect | Architecture, design, planning (no code) | opus  | Component design, routing, Content Collections planning |

---

## Skill-Agent Interaction Map

This diagram shows how skills and agents interact during typical workflows.

```
                        TIER 3 - Planning & Architecture
  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │   architect                                                  │
  │   Designs component structure, routing, Content Collections  │
  │   Output: Implementation plans, architecture decisions       │
  │                                                              │
  └──────────────────────┬───────────────────────────────────────┘
                         │ plans flow down
                         ▼
                        TIER 2 - Execution & Review
  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │   executor ─────────────── implements using ──────┐          │
  │   Follows plans strictly,                         │          │
  │   validates each step                             ▼          │
  │                                          ┌────────────────┐  │
  │                                          │ Tier 2 Skills  │  │
  │                                          │ add-blog-post  │  │
  │                                          │ add-slide-deck │  │
  │                                          │ audit-post     │  │
  │                                          │ audit-series   │  │
  │                                          │ write-tests    │  │
  │                                          │ refactor-safe  │  │
  │                                          └────────┬───────┘  │
  │                                                   │          │
  │   content-writer ◄──── writes articles ───────────┘          │
  │   reviewer ◄──────── validates output ────────────┘          │
  │   security-auditor ◄─── security review ──────────┘          │
  │   i18n-guardian ◄──── multilingual audit ──────────┘          │
  │                                                              │
  └──────────────────────┬───────────────────────────────────────┘
                         │ uses atomic skills
                         ▼
                        TIER 1 - Atomic Skills
  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │   Creation         Fix/Update        Review       Execute    │
  │   ─────────        ──────────        ──────       ───────    │
  │   add-component    quick-fix         pr-review    git-commit │
  │   add-page         fix-lint          security     translate  │
  │   add-blog-post    type-fix          -check       -sync      │
  │                    update-styles                  -push      │
  │                                                              │
  │   Documentation                                              │
  │   ─────────────                                              │
  │   doc-edit                                                   │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘
```

### Typical Workflow

1. **architect** creates an implementation plan (Tier 3)
2. **executor** follows the plan, invoking Tier 1/2 skills as needed (Tier 2)
3. **content-writer** crafts blog posts and portfolio articles using `/add-blog-post` (Tier 2)
4. `/audit-post` runs a comprehensive pre-publication review per post (Tier 2)
5. `/audit-series` validates series-level consistency (ordering, cross-post parity, navigation) (Tier 2)
6. **reviewer**, **security-auditor**, and **i18n-guardian** validate the output (Tier 2)
7. Issues found are fixed using atomic Tier 1 skills
8. After publishing, `/promote-post` generates social media content for distribution (Tier 2)

---

## Domain-Specific Skills & Agents

### 1. Blog & Content Development

Skills, commands, and agents for creating and managing blog content.

| Resource | Type | Description |
|----------|------|-------------|
| new-post | Command | Interactive guided flow for creating blog posts (`/new-post`) |
| add-blog-post | Skill (T2) | Create blog posts — topic mode (writes) or content mode (scaffolding) |
| audit-post | Skill (T2) | Pre-publication audit for individual posts — SEO, AEO, accessibility, images, content quality, i18n |
| audit-series | Skill (T2) | Pre-publication audit for series — definition, ordering, cross-post consistency, navigation |
| promote-post | Skill (T2) | Generate social media content for any blog post across multiple platforms |
| doc-edit | Skill (T1) | Update documentation, README, comments, MDX files |
| content-writer | Agent (T2) | Expert multilingual content writer with personal-professional voice |

**Relationship:** `/new-post` (command) guides the user interactively, while `add-blog-post` (skill) is used programmatically by agents. Both follow conventions from `docs/features/BLOG_POSTS.md` and `docs/features/BLOG_CONTENT_LIFECYCLE.md`. After creation, use `/audit-post` for individual post review and `/audit-series` for series-level validation (ordering, cross-post consistency, navigation). After publishing, use `/promote-post` to generate social media content for distribution.

**Mandatory policy:** Any new file creation in `src/content/blog/` must go through `add-blog-post` to enforce multilingual parity and schema/frontmatter consistency.

### 2. Slides & Presentations

Skills and resources for creating and managing presentation decks (Reveal.js internal, external-embed, external-link).

| Resource | Type | Description |
|----------|------|-------------|
| add-slide-deck | Skill (T2) | **Mandatory for new decks** — creates internal Reveal.js, external-embed, or external-link deck files |
| optimize-image | Skill (T1) | Convert and optimize hero images to WebP for slide decks |
| translate-sync | Skill (T1) | Synchronize deck content between EN and ES versions |
| i18n-guardian | Agent (T2) | Translation quality verification for deck metadata |

**Relationship:** `/add-slide-deck` creates the deck files in `src/content/slides/{en,es}/`. Use `/optimize-image` for hero images in `public/images/slides/<slug>/`. The feature documentation lives in `docs/features/SLIDES.md`.

**Mandatory policy:** Any new file creation in `src/content/slides/` must go through `add-slide-deck` to enforce multilingual parity, schema consistency, and correct slug conventions.

### 3. i18n & Translation

Resources for multilingual content management (currently English/Spanish, N-language ready).

| Resource | Type | Description |
|----------|------|-------------|
| translate-sync | Skill (T1) | Synchronize content across active languages |
| add-page | Skill (T1) | Create multilingual pages with shared components + thin wrappers |
| add-blog-post | Skill (T2) | Create multilingual blog posts — topic or content mode |
| i18n-guardian | Agent (T2) | Translation quality specialist; multilingual consistency enforcer |

### 4. Code Quality & Review

Resources for maintaining code quality and reviewing changes.

| Resource | Type | Description |
|----------|------|-------------|
| fix-lint | Skill (T1) | Fix Biome linting/formatting errors |
| type-fix | Skill (T1) | Fix TypeScript type errors |
| pr-review-lite | Skill (T1) | Quick checklist review of a PR |
| quick-fix | Skill (T1) | Fix small bugs in 1-3 files |
| write-tests | Skill (T2) | Add or expand tests (Vitest/Playwright) |
| refactor-safe | Skill (T2) | Safe refactor in bounded scope |
| reviewer | Agent (T2) | Thorough PR review; Astro/Svelte patterns, quality |

### 5. Security

Resources for security review and auditing.

| Resource | Type | Description |
|----------|------|-------------|
| security-check | Skill (T1) | Quick security checklist (secrets, API routes, client exposure) |
| security-auditor | Agent (T2) | Static site security; API routes, secrets, client exposure |

### 6. Component & Page Creation

Resources for creating new UI components and pages.

| Resource | Type | Description |
|----------|------|-------------|
| add-component | Skill (T1) | Create new Astro or Svelte component with correct patterns |
| add-page | Skill (T1) | Create new page with routing and MainLayout |
| add-timeline-page | Skill (T1) | Add a new tag-filtered infinite-scroll timeline page (e.g. /trading, /entrepreneur) |
| update-styles | Skill (T1) | Update Tailwind styles with dark mode support |
| architect | Agent (T3) | Component design, routing, Content Collections planning |
| executor | Agent (T2) | Follow plans step by step; implement and validate |

---

## Decision Guide: Skill vs Agent

Use this table to decide whether to invoke a Skill or an Agent.

| Criteria | Use a Skill | Use an Agent |
|----------|-------------|--------------|
| **Task scope** | Single, well-defined action | Multi-step or judgment-based work |
| **Invocation** | Slash command (`/fix-lint`) | By name or role ("as reviewer") |
| **Autonomy** | Follows procedure exactly | Makes decisions within scope |
| **Duration** | Short, completes quickly | May take longer, multi-phase |
| **Output** | Predictable, templated | Variable, context-dependent |
| **Examples** | Fix lint errors, create a component | Review a PR, plan architecture |

### When to Combine

- **architect** (Agent) produces a plan, then **executor** (Agent) implements it using **add-component**, **add-page**, and **write-tests** (Skills)
- **reviewer** (Agent) finds issues, then **fix-lint**, **type-fix**, or **quick-fix** (Skills) resolve them
- **i18n-guardian** (Agent) audits translations, then **translate-sync** (Skill) synchronizes content
- **content-writer** (Agent) crafts narrative articles, using **add-blog-post** (Skill) for file creation and **i18n-guardian** (Agent) for translation quality

---

## Quick Reference

### How to Use Skills

> See [Commands Reference](COMMANDS_REFERENCE.md) for the complete command list with procedure file paths.

```bash
# List available skills
/skill-list

# Create a new skill
/skill-create
```

### How to Use Agents

```bash
# List available agents
/agent-list

# Create a new agent
/agent-create
```

### File Locations

- **Skills:** `.agents/skills/{skill-name}/SKILL.md`
- **Agents:** `.agents/agents/{agent-name}.md`
- **Catalog:** `.agents/docs/skills_agents_catalog.md`

---

## Compatibility Notes

Skills and agents use the **Agent Skills open standard** (agentskills.io) for cross-tool compatibility.

| Feature | Claude Code | Cursor | Codex |
|---------|-------------|--------|-------|
| Skill invocation (`/skill-name`) | Yes | Yes | Yes |
| Auto-invocation by description | Yes | Yes | Yes |
| Model routing (haiku/sonnet/opus) | Yes | Ignored | Ignored |
| `allowed-tools` (skills) | Yes | Ignored | Ignored |
| `tools`/`disallowedTools` (agents) | Yes | Ignored | Ignored |
| `permissionMode` (agents) | Yes | Ignored | Ignored |
| Custom fields (tier, intent, etc.) | Ignored | Ignored | Ignored |
| Team agents (parallel execution) | Yes | Ignored | Ignored |

**Key insight**: The `model` column above reflects Claude Code routing. Other tools ignore this field and use their default model.

---

## Execution Modes

Plans and tasks can be executed in different modes depending on complexity and parallelism requirements.

| Mode | Support | Token Cost | Best For | Description |
|------|---------|-----------|----------|-------------|
| Sequential | All agents | Lowest | Dependent tasks, simple plans | Default — tasks one at a time, in order |
| Subagents | Claude Code | Low-Medium | Focused research, quick helpers | Helper agents within session, report back only |
| Team Agents | Claude Code only | High | 3+ parallel independent tasks | Multiple instances with shared task list and messaging |
| Orchestrator | All agents | Varies | Multi-repo feature work | Parent DWP spawns child DWPs in sub-repos |

### When to Use Each Mode

| Scenario | Recommended Mode | Why |
|----------|-----------------|-----|
| Tasks depend on each other | Sequential | No parallelism benefit |
| Quick focused sub-task | Subagents | Lower overhead than team agents |
| 3+ independent parallel tasks | Team Agents | Shared coordination, inter-agent messaging |
| Same-file edits | Sequential | Teammates would overwrite each other |
| Multi-repo changes | Orchestrator | Each repo gets own DWP |
| Simple single-session work | Sequential | Team overhead exceeds benefit |

### Execution Mode Integration

```
Sequential (default)     Subagents              Team Agents
---------------------   ----------              -----------
Task 1 -> Task 2 ->    Main --> Sub1            Lead --> Teammate1
Task 3 -> Task 4         |<---- result             |<---- messages
                        Main --> Sub2            Lead --> Teammate2
                          |<---- result             |<---- messages
                                                 Lead --> Teammate3
                                                    |<---- messages
                                                 Shared task list
```

> Team agents are used for DWP parallel task groups. See [Team Agents Reference](../../docs/technical/TEAM_AGENTS_REFERENCE.md).

---

## Astro-Specific Notes

All skills and agents are adapted for this Astro repository:

- **Linting:** Biome (not ESLint)
- **Type checking:** `pnpm run astro:check`
- **Build:** `pnpm run build`
- **Components:** Astro (.astro) and Svelte (.svelte)
- **Styling:** Tailwind CSS with dark mode
- **Content:** Content Collections in `src/content/`
- **i18n:** Multilingual-ready (currently English/Spanish) with centralized config in `src/lib/i18n.ts`, modular translations in `src/lib/translations/`, shared page components in `src/components/pages/`, and thin per-language wrappers
- **Testing:** Not yet configured (Vitest/Playwright planned)

---

## Changelog

> **Policy:** Keep only the 3 most recent entries. When adding a new entry, remove the oldest.

| Date | Change | Details |
|------|--------|---------|
| 2026-10-11 | DWP skill upgraded to v7.3.0 · every addon enabled · container on devcontainer-kit v0.2.5 | Vendored `deepworkplan` 7.0.1 → **7.3.0** from the tagged release (171 files verified against its `SHA256SUMS`); `dailybot` → 3.23.4 and `ai-diff-reviewer` → 3.3.1; all eight addons in `.dwp/config.json` (devcontainer v0.2.5, agentkit v0.3.0, herdr v0.1.0, vim v0.6.0, in-pack v7.3.0); Dailybot lifecycle hooks in `.agents/settings.json`; the hand-written container replaced by a dck-rendered one (agents kit, editor, Dailybot, Herdr mesh). |
| 2026-10-09 | DWP skill upgraded to v7.0.1 · ai-diff-reviewer to v3.3.0 | Bumped the vendored `deepworkplan` skill 6.0.2 → **7.0.1** (field-tested on 7.0.0-beta.1, then 7.0.0) via the pinned tree-URL install `npx skills add https://github.com/DailybotHQ/deepworkplan-skill/tree/v7.0.1 --skill deepworkplan` (171/171 files match the release `SHA256SUMS`; no stray files; `skills-lock.json` now records `ref: v7.0.1`). Standard stamp 6.0.0 → **7.0.0**. Delegators match the v7 templates (`delegators.py check`: 9/9 OK). `ai-diff-reviewer` 3.2.2 → **3.3.0** (identical to the checksum-verified release tarball; Flow A, `.review/extension.md` kept). Addon registry `.dwp/config.json` (new in v7) is now **tracked** (`.gitignore`: `.dwp/*` + `!.dwp/config.json`) and enables `ai-diff-reviewer`, `dependency-upgrade`, `design-system`, `herdr`, `agentkit`, `vim` (the last three noted as deferred machine-level installs), plus the `host` record `subagents: true`; `devcontainer` declined (the repo keeps its own `docker/local/` stack); `dailybot` not enabled. `AGENTS.md` Bounded autonomy section updated for v7 abilities. Existing `.dwp/` plans untouched. |
| 2026-10-01 | DWP skill upgraded to v6.0.2 · Dailybot skill to v3.23.2 | Bumped the vendored `deepworkplan` skill 5.5.4 → **6.0.2** (checksums verified with `setup.sh --verify`; installed tree was byte-identical to v5.5.4, so no local adaptations were lost). Standard stamp 5.0.0 → **6.0.0**. Added the v6 records (capability declaration, authority boundaries, outcome mapping) to `AGENTS.md`. Refreshed the vendored `dailybot` skill 3.16.1 → 3.23.2; `ai-diff-reviewer` already at the latest (v3.2.2, Flow A, `.review/extension.md` kept). Existing `.dwp/` plans untouched. |

---

## Related Documentation

- [Commands Reference](COMMANDS_REFERENCE.md) — All slash commands with procedure files and cross-agent invocation convention
- [Author sub-skill (create/update skills & agents)](../skills/deepworkplan/author/SKILL.md) — invoked via `/skill-create` and `/agent-create`
- [Skill Template](../skills/deepworkplan/author/templates/SKILL_TEMPLATE.md)
- [Agent Template](../skills/deepworkplan/author/templates/AGENT_TEMPLATE.md)
- [AGENTS.md](../../AGENTS.md) - Main AI agent guidance
- [docs/STANDARDS.md](../../docs/STANDARDS.md) - Coding standards

### Harness refresh — 2026-10-11

DeepWorkPlan v7.6.0, AI Diff Reviewer v3.3.9 and Dailybot skill v3.23.12 are vendored at their verified tags. All eight existing addons still fit; the pack’s all-addons upgrade planner drives their reconciliation. The devcontainer is re-rendered with dck v0.3.0 (ak v0.5.0, herdr-peers v0.2.1, Vim v0.7.0), keeping the repository’s own hook and Dockerfile sections. Existing command delegators, review extension, design system and historical plans remain. Exact refs and content hashes are in `skills-lock.json`.

### Final orchestra refresh — 2026-10-11

DeepWorkPlan v7.6.1 is installed byte-for-byte from its verified tagged release. The fitting addon set is preserved; dck v0.3.1 reconciles the container and brings herdr-peers v0.2.2, retaining the site hook and unmanaged Dockerfile sections. This final round verifies that a second `dck up` preserves shared token presence and that Codex peers route asks and replies using the explicit `--pane` caller address. Reviewer v3.3.9, Dailybot skill v3.23.12, ak v0.5.0 and Vim v0.7.0 remain at their pins. Historical plans and the host editor are unchanged.

## Dogfood reconciliation — 2026-10-12

DeepWorkPlan v7.6.3, AI Diff Reviewer v3.3.11 and Dailybot skill v3.23.14 are pinned in `skills-lock.json`. The existing addon set still fits. The container is rendered with dck v0.3.5, coding-agents-kit v0.5.3 and herdr-peers v0.2.3; DeepWorkPlan Vim v0.7.0 remains a container editor layer. Repository hooks, review rules, design documentation and historical plans are preserved.

## Dogfood reconciliation — 2026-10-12 (DeepWorkPlan v7.7.0)

DeepWorkPlan v7.7.0 is installed from its tagged release and verified against the release `SHA256SUMS` (178 files, exact file set). AI Diff Reviewer v3.3.11 and Dailybot skill v3.23.14 remain at the pack's pins. The pack now pins coding-agents-kit v0.6.1 and herdr-peers v0.3.2; the container stays rendered with dck v0.3.5 (coding-agents-kit v0.5.3, herdr-peers v0.2.3) until a devcontainer-kit release carries the new pins, so the registry keeps those two addons at their rendered versions. DeepWorkPlan Vim v0.7.0, repository hooks, review rules and historical plans are unchanged.
