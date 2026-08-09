# Commands Reference

> **Auto-maintained.** Update this file whenever a skill or command is added or removed.
> This repository (Pereira Tech Talks v3.0.0) has its own commands tailored to an Astro-based bilingual community platform with rich content collections (blog, slides, meetups, events, Pereira Tech Days, verticals, speakers, talks, contributors, sponsors, channels).
> See [Skills & Agents Catalog](skills_agents_catalog.md) for detailed tiers, capabilities, and domain guides.

---

## How to Invoke Commands

Different agents use different prefixes — **the behavior is identical, only the prefix changes:**

| Agent | Prefix | Example |
|-------|--------|---------|
| **Claude Code** | `/` (native) | `/add-blog-post` |
| **OpenAI Codex** | `#` | `#add-blog-post` |
| **Cursor AI** | `#` | `#add-blog-post` |
| **Gemini / others** | `#` | `#add-blog-post` |

> **Why `#` for non-Claude agents?** Most AI CLIs (Codex, Cursor) intercept `/` as their own system commands, so `/add-blog-post` never reaches the AI. Using `#` avoids that interception. You can also just write the command name in plain text: "run add-blog-post".

When a command is invoked (via `/`, `#`, or by name), the agent MUST:

1. **READ** the linked procedure file completely
2. **FOLLOW** its step-by-step instructions exactly
3. **DO NOT** improvise or skip steps — the procedure file IS the spec

---

## Deep Work Plans

> Thin delegators to the installed [`deepworkplan` skill](../skills/deepworkplan/SKILL.md) (currently **v2.17.0**, from [`DailybotHQ/deepworkplan-skill`](https://github.com/DailybotHQ/deepworkplan-skill)). Plans live in `.dwp/plans/`; drafts in `.dwp/drafts/`. Opt-in addons installed: `ai-diff-reviewer` (Flow A local-only review), `dependency-upgrade` (`/lib-upgrade`), `design-system` (`/design-system`).

| Command | Procedure File | Description |
|---------|---------------|-------------|
| `/dwp-create` | `.agents/commands/dwp-create.md` | Create a deep work plan (unified flow: info, draft, refine, final) |
| `/dwp-execute` | `.agents/commands/dwp-execute.md` | Execute an existing deep work plan task by task |
| `/dwp-refine` | `.agents/commands/dwp-refine.md` | Refine a draft or modify an existing final plan |
| `/dwp-resume` | `.agents/commands/dwp-resume.md` | Resume an interrupted deep work plan from the first open task |
| `/dwp-status` | `.agents/commands/dwp-status.md` | Check status of deep work plans without executing |
| `/dwp-verify` | `.agents/commands/dwp-verify.md` | Objective pass/fail conformance report for the repo and its plans |

## Git & Version Control

| Command | Procedure File | Description |
|---------|---------------|-------------|
| `/branch` | `.agents/commands/branch.md` | Generate branch names following naming convention |
| `/commit` | `.agents/commands/commit.md` | Generate a conventional commit from staged changes |
| `/pr` | `.agents/commands/pr.md` | Generate a pull request description from branch changes |
| `/git-commit-push` | `.agents/skills/git-commit-push/SKILL.md` | Commit all changes and push to remote |

## Code Quality & Review

| Command | Procedure File | Description |
|---------|---------------|-------------|
| `/code-review` | `.agents/commands/code-review.md` | Review code focusing on critical issues |
| `/pr-review-lite` | `.agents/skills/pr-review-lite/SKILL.md` | Quick checklist review of a PR (style, bugs, patterns) |
| `/fix-lint` | `.agents/skills/fix-lint/SKILL.md` | Fix Biome linting/formatting errors in 1-3 files |
| `/type-fix` | `.agents/skills/type-fix/SKILL.md` | Fix TypeScript type errors in 1-3 files |
| `/quick-fix` | `.agents/skills/quick-fix/SKILL.md` | Fix small bugs in 1-3 files following existing patterns |
| `/security-check` | `.agents/skills/security-check/SKILL.md` | Quick security checklist (secrets, API routes, client exposure) |

## Blog & Content

| Command | Procedure File | Description |
|---------|---------------|-------------|
| `/new-post` | `.agents/commands/new-post.md` | Create a new blog post (interactive guided flow) |
| `/add-blog-post` | `.agents/skills/add-blog-post/SKILL.md` | Create blog posts — topic mode (writes content) or content mode (scaffolding) |
| `/add-slide-deck` | `.agents/skills/add-slide-deck/SKILL.md` | Create slide decks — internal Reveal.js, external-embed, or external-link |
| `/add-meetup` | `.agents/skills/add-meetup/SKILL.md` | Create a Pereira Tech Talks monthly meetup entry (bilingual frontmatter, optional talk/speaker/sponsor refs) |
| `/add-event` | `.agents/skills/add-event/SKILL.md` | Create a non-meetup event entry (workshop, hackathon, conference, webinar) in the `events` collection |
| `/add-ptd-edition` | `.agents/skills/add-ptd-edition/SKILL.md` | Create a Pereira Tech Day annual edition (schedule, keynotes, brand kit, organizers, gallery) |
| `/issue-certificates` | `.agents/skills/issue-certificates/SKILL.md` | Batch-issue signed attendance certificates from CSV (import → sign → verify → build) |
| `/audit-analytics` | `.agents/skills/audit-analytics/SKILL.md` | Audit Umami event coverage, first-party proxy, and privacy-safe payloads |
| `/audit-language-integrity` | `.agents/skills/audit-language-integrity/SKILL.md` | Audit sitewide language integrity and triage the scanner's two confidence tiers |
| `/audit-content-parity` | `.agents/skills/audit-content-parity/SKILL.md` | Audit whether ES and EN carry the same content, and fix the six classes in the order that avoids re-work |
| `/promote-post` | `.agents/skills/promote-post/SKILL.md` | Generate social media content for blog posts across multiple platforms |
| `/optimize-image` | `.agents/skills/optimize-image/SKILL.md` | Convert and optimize images to WebP for blog posts |
| `/audit-post` | `.agents/skills/audit-post/SKILL.md` | Pre-publication audit for blog posts (SEO, AEO, accessibility, images, content quality, i18n) |
| `/audit-series` | `.agents/skills/audit-series/SKILL.md` | Pre-publication audit for blog series (definition, ordering, cross-post consistency, navigation) |
| `/doc` | `.agents/commands/doc.md` | Document a module following the documentation guide |
| `/doc-edit` | `.agents/skills/doc-edit/SKILL.md` | Update documentation files (README, comments, MDX, markdown) |

## Feature Development

| Command | Procedure File | Description |
|---------|---------------|-------------|
| `/add-component` | `.agents/skills/add-component/SKILL.md` | Create new Astro or Svelte component with correct patterns |
| `/add-page` | `.agents/skills/add-page/SKILL.md` | Create new page with routing and MainLayout |
| `/update-styles` | `.agents/skills/update-styles/SKILL.md` | Update Tailwind styles with dark mode support |
| `/refactor-safe` | `.agents/skills/refactor-safe/SKILL.md` | Safe refactor in bounded scope (1-10 files, no behavior change) |
| `/write-tests` | `.agents/skills/write-tests/SKILL.md` | Add or expand unit/integration tests (Vitest) |

## i18n & Translation

| Command | Procedure File | Description |
|---------|---------------|-------------|
| `/translate-sync` | `.agents/skills/translate-sync/SKILL.md` | Synchronize content between English and Spanish versions |

## Design System

| Command | Procedure File | Description |
|---------|---------------|-------------|
| `/design-system` | `.agents/commands/design-system.md` | Create or refresh [`docs/DESIGN.md`](../../docs/DESIGN.md) — the agent-facing UI contract (`--ptt-*` tokens, type/spacing/radius scales, component patterns, WCAG AA rules) — via the DeepWorkPlan [`design-system` addon](../skills/deepworkplan/addons/design-system/SKILL.md). `visual-ui` profile only |

## Dependency Management

| Command | Procedure File | Description |
|---------|---------------|-------------|
| `/lib-upgrade` | `.agents/commands/lib-upgrade.md` | Safely upgrade pnpm dependencies (batched, validated, revertible) via the DeepWorkPlan [`dependency-upgrade` addon](../skills/deepworkplan/addons/dependency-upgrade/SKILL.md) — patch/minor/major batches gated by `biome:check`, `astro:check`, `test`, `build` |

## Skills & Agents Management

| Command | Procedure File | Description |
|---------|---------------|-------------|
| `/skill-create` | `.agents/commands/skill-create.md` | Create a new skill with guided workflow |
| `/skill-list` | `.agents/commands/skill-list.md` | List all available skills with tier and description |
| `/agent-create` | `.agents/commands/agent-create.md` | Create a new agent with guided workflow |
| `/agent-list` | `.agents/commands/agent-list.md` | List all available agents with tier and description |

---

## Maintaining This File

> **CRITICAL:** This file MUST be updated whenever a skill or command is added or removed.

When creating new skills via `/skill-create`:
1. Add the command to the correct category table above
2. Use format: | `/command-name` | `.agents/skills/command-name/SKILL.md` | Brief description |

When creating new commands via `.agents/commands/`:
1. Add the command to the correct category table above
2. Use format: | `/command-name` | `.agents/commands/command-name.md` | Brief description |
