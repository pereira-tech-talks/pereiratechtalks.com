# AI Agent Collaboration Guide

Guidelines for coordinating multiple AI coding assistants working on Pereira Tech Talks v3.0.0.

## Overview

Multiple AI agents can work on this codebase:

| Agent | Guidance File | Capabilities |
|-------|--------------|--------------|
| **Cursor AI** | `.cursorrules` (if exists), `AGENTS.md` | Full IDE integration |
| **Claude Code** | `CLAUDE.md` → `AGENTS.md` | Terminal access, file editing |
| **ChatGPT/Codex** | `AGENTS.md` | Code generation, review |
| **Gemini** | `AGENTS.md` | Code generation, analysis |
| **GitHub Copilot** | Context-based | Inline completions |

## Single Source of Truth

**`AGENTS.md` is the canonical reference** for all agents.

```
AGENTS.md ← Single source of truth
    │
    ├── CLAUDE.md imports via @AGENTS.md
    ├── Cursor reads directly
    └── Others reference directly
```

### Synchronization Rules

When updating agent guidance:

1. **Update `AGENTS.md`** with the change
2. **Verify `CLAUDE.md`** still imports correctly
3. **Don't duplicate** - Keep info in one place

## Agent Handoff Protocol

When work transfers between agents or sessions:

### 1. Document Current State

Before stopping:

```markdown
## Handoff Notes

### Completed
- [x] Added BlogSearch component
- [x] Updated content.config.ts

### In Progress
- [ ] Search pagination (50% done)

### Blocked
- Waiting for API design decision

### Files Changed
- src/components/blog/BlogSearch.svelte
- src/content.config.ts

### Next Steps
1. Complete pagination logic
2. Add loading states
3. Write documentation
```

### 2. Commit Incrementally

Don't leave uncommitted work:

```bash
# Commit before handoff
git add -A
git commit -m "wip: blog search - pagination in progress"
```

### 3. Clear Context Transfer

New agent should:

1. Read `AGENTS.md` first
2. Check recent commits: `git log --oneline -10`
3. Check uncommitted changes: `git status && git diff`
4. Read handoff notes if any

## Communication Patterns

### Code Comments for Agents

Use clear TODO comments:

```typescript
// TODO: Add error handling for API failures
// NOTE: This pattern matches BlogCard - keep consistent
// FIXME: Dark mode not working on mobile
```

### Commit Messages

Use conventional commits with clear context:

```bash
# Good - clear what and why
git commit -m "feat: add blog search with debounced input

- Uses /api/posts-{lang}.json shard endpoints for search index
- Debounces input by 300ms
- Filters by title, description, and tags"

# Bad - vague
git commit -m "add search"
```

### PR Descriptions

Include context for reviewers (human or AI):

```markdown
## Summary
Added client-side blog search functionality.

## Changes
- New BlogSearch.svelte component
- Language-sharded search endpoints (`/api/posts-en.json`, `/api/posts-es.json`)

## Testing
- [x] Search filters correctly
- [x] Works with empty query
- [x] Dark mode supported

## Notes for Reviewers
Search is static-first and shard-based for scale. Keep
`pnpm run search:budgets` green to avoid payload regressions.
```

## Conflict Resolution

### When Agents Disagree

1. **Check `AGENTS.md`** - Standards take precedence
2. **Follow existing patterns** - Consistency over preference
3. **Document decision** - Add to relevant docs

### Merge Conflicts

If conflicts arise:

1. Understand both changes
2. Merge manually if complex
3. Run validation:
   ```bash
   pnpm run biome:check && pnpm run astro:check && pnpm run build
   ```
4. Test affected features

## Best Practices

### For All Agents

- ✅ Read `AGENTS.md` at start of session
- ✅ Follow established patterns
- ✅ Commit frequently with clear messages
- ✅ Run validation before considering work complete
- ✅ Document non-obvious decisions

### Session Start Checklist

```markdown
1. [ ] Read AGENTS.md
2. [ ] Check git status
3. [ ] Review recent commits
4. [ ] Understand current task scope
5. [ ] Verify dev environment works (pnpm run dev)
```

### Session End Checklist

```markdown
1. [ ] Commit all changes
2. [ ] Run full validation
3. [ ] Document any handoff notes
4. [ ] Update docs if needed
```

## Agent-Specific Notes

### Cursor AI

- Full IDE access
- Can run terminal commands
- Has file context from workspace

### Claude Code

- Terminal and file access
- Reads `CLAUDE.md` which imports `AGENTS.md`
- Good for complex multi-file changes

### ChatGPT/Codex

- Code generation focused
- May need manual file updates
- Reference `AGENTS.md` in prompts

### GitHub Copilot

- Inline completions
- Context from open files
- Follow patterns in visible code

## Documentation Sync

### What to Synchronize

| Content | Location | Notes |
|---------|----------|-------|
| Coding standards | `AGENTS.md`, `docs/STANDARDS.md` | Keep aligned |
| Commands | `AGENTS.md`, `docs/DEVELOPMENT_COMMANDS.md` | Full list in docs |
| Architecture | `AGENTS.md` summary, `docs/ARCHITECTURE.md` full | |

### What NOT to Synchronize

- Agent-specific workflows (keep in respective files)
- Temporary notes (use comments/commits)
- Session-specific context

## Troubleshooting

### Agent Seems Confused

1. Explicitly reference `AGENTS.md`
2. Provide file paths for context
3. Show example from codebase

### Inconsistent Output

1. Check if following different patterns
2. Point to existing code examples
3. Clarify which pattern to follow

### Work Gets Repeated

1. Check commit history
2. Look for handoff notes
3. Review recent file changes

## DeepWorkPlan Addons (optional, non-blocking)

The vendored `deepworkplan` skill (v2.17.0) ships five opt-in addons; this repo wires in **three** — `ai-diff-reviewer` (Flow A, local-only), `dependency-upgrade`, and `design-system`. All are **best-effort and never block** DWP `create`/`execute`. The core methodology has **zero** dependency on any of them — declining or uninstalling any addon still leaves a fully AI-first repo.

> The `dailybot` and `devcontainer` addons ship inside the skill pack but are **not installed** here. DailyBot still appears across the site as a community **sponsor** (`src/content/sponsors/dailybot.yaml`) and in the branch/PR naming conventions — that content is unrelated to the DWP addon.

### AI Diff Reviewer — Security Review augmentation (Flow A, local-only)

Installed in **Flow A**: vendored skill (`.agents/skills/ai-diff-reviewer/`) + repo-tailored `.review/extension.md`. **No CI workflow** (`.github/workflows/pr-review.yml`) — Flow B is deferred.

- The mandatory DWP **Security Review** task gains a local-review step: invoke *"Review my current branch"* (or `/ai-diff-reviewer`), then append the verdict + findings table + per-finding bodies under `## AI Diff Reviewer local review` in the plan's `analysis_results/SECURITY_REVIEW.md`.
- **Severity contract:** a `critical` finding blocks Security Review completion until fixed or explicitly accepted; `warning`/`info` are reported but do not block.
- **Never blocks.** Skipped (one warning) if the skill or extension is missing, or the local review errors. Flow A needs **no** provider secret — an unset `CURSOR_API_KEY` is Flow B / CI only and never a reason to skip the local pass.
- **To upgrade to Flow B later:** run `/deepworkplan-addon-ai-diff-reviewer`, choose Flow B; the upstream `setup` sub-skill writes `pr-review.yml` reading the same `.review/extension.md` for byte-identical CI parity.

### Dependency upgrade — `/lib-upgrade`

The `dependency-upgrade` addon backs `/lib-upgrade`: detects this repo's manager (**pnpm**), classifies upgrades by semver, upgrades in safe batches, runs the real gate (`pnpm run biome:check && pnpm run astro:check && pnpm run test && pnpm run build`) after each, reverts a failing batch, and summarizes. It never auto-commits — it surfaces the diff for you to commit.

### Design system — `docs/DESIGN.md` + `/design-system`

The `design-system` addon backs [`docs/DESIGN.md`](DESIGN.md): the agent-facing UI contract derived from this repo's **real** design source (the Tailwind 4 `@theme` block in `src/styles/global.css`, `tailwind.config.mjs`, `docs/BRAND_GUIDE.md`, and the `src/components/ui/` primitives). Only the **`visual-ui`** profile is applied — this repo has no styled-CLI surface (`scripts/*.mjs` use plain `console.log`, no chalk/ora) and no conversational surface (no chat/email SDK), so the `cli-output` and `conversational` profiles are deliberately not installed.

- Agents generating or editing UI read `DESIGN.md` for tokens, scales, component patterns, and the integrity rules (WCAG AA, light + dark, reduced motion, edition-scoped palettes).
- `BRAND_GUIDE.md` remains the wider brand rationale (logo, voice, per-edition kits); `DESIGN.md` is the operational contract. Keep them consistent — `DESIGN.md` documents *shipped* behavior and flags any divergence.
- Run **`/design-system`** to regenerate the file after design changes.

## Resources

- [AGENTS.md](../AGENTS.md) - Main guidance
- [STANDARDS.md](STANDARDS.md) - Coding conventions
- [AI_AGENT_ONBOARDING.md](AI_AGENT_ONBOARDING.md) - Quick start
