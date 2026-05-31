# Skills & Agents Catalog

This document serves as the central reference for all available Skills and Agents in this repository.

## Overview

| Type   | Tier 1 (Light) | Tier 2 (Standard) | Tier 3 (Heavy) | Total |
|--------|:--------------:|:------------------:|:--------------:|:-----:|
| Skills | 13             | 8                  | 0              | 21    |
| Agents | 0              | 5                  | 1              | 6     |
| **Total** | **13**      | **13**             | **1**          | **27** |

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
| audit-post    | review   | `/audit-post`    | sonnet | Pre-publication audit for blog posts — SEO, AEO, accessibility, images, content quality, i18n parity, and project conventions. |
| audit-series  | review   | `/audit-series`  | sonnet | Pre-publication audit for blog series — series definition, post ordering, cross-post consistency, navigation, and individual post summary checks. |
| audit-taxonomy | review  | `/audit-taxonomy` | sonnet | Read-only audit of the blog tag taxonomy — frequency, orphans, hierarchy, and proposals for new subtopic tags. Writes report to `tmp/audit-taxonomy/`. See [Blog Posts → Tags](../../docs/features/BLOG_POSTS.md). |
| promote-post  | create   | `/promote-post`  | sonnet | Generate social media content for any blog post (Twitter/X, LinkedIn, HN, dev.to, Reddit, Facebook) |
| write-tests   | tests    | `/write-tests`   | sonnet | Add or expand tests (*.test.ts) - Vitest/Playwright when configured      |
| refactor-safe | execute  | `/refactor-safe` | sonnet | Safe refactor in bounded scope (1-10 files, no behavior change)          |

### Tier 3 (Heavy/Reasoning)

Complex planning and architecture.

| Skill | Intent | Invocation | Model | Description |
|-------|--------|-------------|-------|-------------|
| *Add with /skill-create* | | | | |

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
| 2026-04-26 | add-slide-deck skill added | New Tier 2 skill for creating slide decks — internal Reveal.js, external-embed, or external-link. Mandatory for new files in `src/content/slides/`. Added Slides & Presentations domain section (#2). |
| 2026-03-23 | audit-series skill added | New Tier 2 skill for pre-publication blog series auditing — 9-step review covering series definition, post discovery, ordering validation, cross-post consistency, i18n parity, individual post summary checks, build validation, and final report. Companion to audit-post. |
| 2026-03-23 | audit-post skill added | New Tier 2 skill for pre-publication blog post auditing — 10-step comprehensive review covering frontmatter, SEO, AEO, images, accessibility, content quality, i18n parity, resources, build validation. |

---

## Related Documentation

- [Commands Reference](COMMANDS_REFERENCE.md) — All slash commands with procedure files and cross-agent invocation convention
- [Guide to Create Skills and Agents](../../.agent_commands/agent_skills_generator/GUIDE_TO_CREATE_SKILLS_AND_AGENTS.md)
- [Model Routing](../../.agent_commands/agent_skills_generator/MODEL_ROUTING.md)
- [Skill Template](../../.agent_commands/agent_skills_generator/templates/SKILL_TEMPLATE.md)
- [Agent Template](../../.agent_commands/agent_skills_generator/templates/AGENT_TEMPLATE.md)
- [AGENTS.md](../../AGENTS.md) - Main AI agent guidance
- [docs/STANDARDS.md](../../docs/STANDARDS.md) - Coding standards
