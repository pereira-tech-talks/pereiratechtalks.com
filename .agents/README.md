# `.agents/` — Cross-Agent Configuration

This directory is the **canonical home** for skills, slash commands, agent definitions, and configuration shared across AI coding assistants (Claude Code, Cursor AI, OpenAI Codex, Gemini, GitHub Copilot, and others).

> **Backward compatibility:** `.claude/` is a symlink to `.agents/`, so any tool that still expects `.claude/...` paths keeps working transparently. Always edit the real files under `.agents/` — never via the symlink. Use `.agents/...` as the canonical path in all new content.

## Directory Structure

```
.agents/
├── README.md              # This file - documentation
├── settings.local.json    # Local Claude Code settings
├── skills/                # Reusable skills (how-to procedures)
├── agents/                # Specialized agent personas
├── docs/                  # skills_agents_catalog.md
└── commands/              # Custom slash commands
    ├── dwp-create.md      # /dwp-create command
    ├── dwp-execute.md     # /dwp-execute command
    ├── dwp-refine.md      # /dwp-refine command
    ├── dwp-resume.md      # /dwp-resume command
    ├── dwp-status.md      # /dwp-status command
    ├── lib-upgrade.md     # /lib-upgrade command
    ├── commit.md          # /commit command
    ├── pr.md              # /pr command
    ├── branch.md          # /branch command
    └── code-review.md     # /code-review command
```

**Note:** Every `.md` file inside `commands/` becomes a slash command. Do NOT put documentation files inside `commands/` as they would create unwanted commands.

---

## Skills & Agents

This project includes reusable **Skills** (procedures) and **Agents** (specialized personas).

**Full catalog:** [.agents/docs/skills_agents_catalog.md](docs/skills_agents_catalog.md)

### Tier Breakdown

| Type   | Tier 1 (Light) | Tier 2 (Standard) | Tier 3 (Heavy) | Total |
|--------|:--------------:|:------------------:|:--------------:|:-----:|
| Skills | 12             | 2                  | 0              | 14    |
| Agents | 0              | 4                  | 1              | 5     |
| **Total** | **12**      | **6**              | **1**          | **19** |

### Available Skills (14)

| Skill | Invocation | Tier | Description |
|-------|-----------|------|-------------|
| quick-fix | `/quick-fix` | 1 | Fix small bugs in 1-3 files following existing patterns |
| doc-edit | `/doc-edit` | 1 | Update documentation (README, comments, MDX, markdown) |
| pr-review-lite | `/pr-review-lite` | 1 | Quick checklist review of a PR (style, bugs, patterns) |
| fix-lint | `/fix-lint` | 1 | Fix Biome linting/formatting errors in 1-3 files |
| type-fix | `/type-fix` | 1 | Fix TypeScript type errors in 1-3 files |
| security-check | `/security-check` | 1 | Quick security checklist (secrets, API routes, client exposure) |
| git-commit-push | `/git-commit-push` | 1 | Commit all changes and push to remote |
| add-component | `/add-component` | 1 | Create new Astro or Svelte component with correct patterns |
| add-page | `/add-page` | 1 | Create new page with routing and MainLayout |
| add-blog-post | `/add-blog-post` | 1 | Create blog post with Content Collections frontmatter |
| translate-sync | `/translate-sync` | 1 | Synchronize content between English and Spanish versions |
| update-styles | `/update-styles` | 1 | Update Tailwind styles with dark mode support |
| write-tests | `/write-tests` | 2 | Add or expand tests (Vitest/Playwright when configured) |
| refactor-safe | `/refactor-safe` | 2 | Safe refactor in bounded scope (1-10 files, no behavior change) |

### Available Agents (5)

| Agent | Tier | Description |
|-------|------|-------------|
| reviewer | 2 | Thorough PR review; Astro/Svelte patterns, dark mode, quality |
| executor | 2 | Follows plans step by step; implements and validates |
| security-auditor | 2 | Static site security; API routes, secrets, client exposure |
| i18n-guardian | 2 | Translation quality specialist; multilingual consistency enforcer |
| architect | 3 | Component design, routing, Content Collections planning |

### Quick Commands

```bash
/skill-list       # List available skills
/skill-create     # Create a new skill (guided)
/agent-list       # List available agents
/agent-create     # Create a new agent (guided)
```

> **IMPORTANT:** When creating new skills or agents, you MUST update the catalog
> (`.agents/docs/skills_agents_catalog.md`) following the 5-step process (overview table, tier table,
> interaction map, domain section, changelog) AND update this README's quick reference tables.
> See the [Catalog Maintenance section](../.agent_commands/agent_skills_generator/GUIDE_TO_CREATE_SKILLS_AND_AGENTS.md) (Section 10) for detailed instructions.

---

## Running Claude Code with Full Permissions

### Option 1: CLI Flag (Recommended)

Execute Claude Code from the command line with all permissions enabled using the `--dangerously-skip-permissions` flag:

```bash
# Interactive mode with all permissions
claude --dangerously-skip-permissions

# With initial query
claude --dangerously-skip-permissions "refactor the authentication module"

# Print mode (non-interactive) with all permissions
claude -p --dangerously-skip-permissions "review this code"
```

**⚠️ Security Note:** This flag bypasses all permission prompts. Use with caution, especially in shared environments.

### Option 2: Allowed Tools Flag

For more granular control, use `--allowedTools` to specify which tools can run without prompting:

```bash
# Allow all common development tools
claude --allowedTools "Bash(*),WebFetch(*),WebSearch,FileRead(*),FileWrite(*),FileDelete(*),Git(*),Npm(*),Node(*),TypeScript(*),ESLint(*),Prettier(*),Mocha(*),Serverless(*),Docker(*),AWS(*)" "your query here"
```

### Option 3: Settings File

The `settings.local.json` file in this directory is already configured with broad permissions. When you run Claude Code normally, it will use these settings:

```bash
# Normal execution (uses settings.local.json permissions)
claude "your query here"
```

**Current settings:** The `settings.local.json` file includes wildcard permissions for:
- All Bash commands (`Bash(*)`)
- All web operations (`WebFetch(*)`, `WebSearch`)
- All file operations (`FileRead(*)`, `FileWrite(*)`, `FileDelete(*)`)
- All development tools (`Git(*)`, `Npm(*)`, `Node(*)`, etc.)

### Quick Reference

| Method | Command | Use Case |
|--------|---------|----------|
| **Skip all prompts** | `claude --dangerously-skip-permissions` | Maximum automation, no interruptions |
| **Specific tools** | `claude --allowedTools "Bash(*),Git(*)"` | Fine-grained control |
| **Settings file** | `claude` (normal) | Persistent configuration |

**See also:** [Claude Code CLI Reference](https://code.claude.com/docs/en/cli-reference)

---

## Available Commands

### Deep Work Plans

Commands for managing long-duration, multi-task execution plans.

#### `/dwp-create` ⭐ Main Command
Create a complete deep work plan with unified flow (info → draft → refine → final).

**Usage:**
```
/dwp-create [name] [trust|auto]
```

**Modes:**

| Mode | Command | Description |
|------|---------|-------------|
| 🎯 Guided | `/dwp-create` | Full flow with review step before final plan |
| 🎯 Guided + Name | `/dwp-create my_plan` | Same, with plan name pre-filled |
| 🚀 Trust | `/dwp-create trust` | Full flow, no confirmations |
| 🚀 Trust + Name | `/dwp-create my_plan trust` | Fastest path |
| 📝 Draft only | `/dwp-create draft my_plan` | Only creates draft + refined draft |
| 📁 From draft | `/dwp-create from PLAN_x.md` | Creates final from existing draft |

**Unified Flow (Guided Mode):**
1. You provide: name, objective, context, tasks
2. Agent creates: draft → refined draft automatically
3. You review: the refined plan summary
4. You approve: agent creates final executable plan
5. Agent asks: execute now? → starts execution if yes

**Unified Flow (Trust Mode):**
1. You provide: name, objective, context, tasks
2. Agent creates: draft → refined draft → final plan (no stops)
3. Agent asks: execute now? → starts execution if yes

**Examples:**

```bash
# Fastest: provide name, trust mode
/dwp-create auth_refactor trust
# → Answer questions → Plan created automatically

# Interactive with review
/dwp-create
# → Answer questions → Review refined plan → Approve → Plan created

# Named plan with review
/dwp-create stripe_integration
# → Answer questions → Review → Approve → Plan created

# From existing draft
/dwp-create from PLAN_auth_refactor_draft_refined.md
# → Creates final plan directly
```

**Output:**
- Drafts: `.agent_commands/agent_deep_work_plans/results/drafts/`
- Plans: `.agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/`

---

#### `/dwp-refine`
Refine drafts OR modify existing final plans (add tasks, edit instructions, etc.)

**Usage:**
```
/dwp-refine [draft_filename|latest|plan {name}|plan latest]
```

**For drafts:**
- `/dwp-refine` → select draft → refine or convert
- `/dwp-refine latest` → refine most recent draft
- `/dwp-refine PLAN_x_draft.md` → refine specific draft

**For final plans:**
- `/dwp-refine plan latest` → modify most recent plan
- `/dwp-refine plan auth_refactor` → modify specific plan

**Plan modifications available:**
- ➕ Add new tasks (at any position)
- ✏️ Edit existing task instructions/criteria
- 🔄 Reorganize tasks (move, split, merge, delete)
- 📋 Update README (objective, context, guidelines)

**Examples:**
```bash
# Add a task to an existing plan
/dwp-refine plan my_plan
# → "Add new task" → describe task → done

# Edit task instructions
/dwp-refine plan latest
# → "Edit existing task" → select task → modify
```

---

#### `/dwp-execute`
Execute an existing deep work plan.

**Usage:**
```
/dwp-execute [plan_name|latest]
```

**Parameters (optional):**
- `{plan_name}` - Execute plan directly (skips selection menu)
- `latest` - Execute the most recent plan

**Flow:**
1. If parameters provided: Skip selection, use plan directly
2. If no parameters: Select plan (or list available plans)
3. Check current status
4. Execute tasks sequentially, one at a time
5. Run validations, commit after each task

**Examples:**
- Execute with params: `/dwp-execute my_project_plan` (fast)
- Execute latest: `/dwp-execute latest` (fast)
- Interactive mode: `/dwp-execute` → select `PLAN_refactor_auth`
- With requirements: `/dwp-execute my_plan` → provide specific requirements

**Behavior:**
- Works on first unchecked `[ ]` task
- Runs all validations before marking complete
- Commits after each task
- Stops on validation failures

---

#### `/dwp-resume`
Resume an interrupted deep work plan.

**Usage:**
```
/dwp-resume [plan_name|latest]
```

**Parameters (optional):**
- `{plan_name}` - Resume plan directly (skips selection menu)
- `latest` - Resume the most recent plan

**Flow:**
1. If parameters provided: Skip selection, use plan directly
2. If no parameters: Select plan to resume
3. Assess current state (git status, task list, logs)
4. Handle any partial work
5. Continue from first `[ ]` task

**Examples:**
- Resume with params: `/dwp-resume my_project_plan` (fast)
- Resume latest: `/dwp-resume latest` (fast)
- Interactive mode: `/dwp-resume` → select plan
- Resume with status check: Automatically checks git status and logs

**Behavior:**
- Never redoes completed `[x]` tasks
- Never skips `[ ]` tasks
- Reviews uncommitted work before continuing
- Reads completion logs for blockers

---

#### `/dwp-status`
Check status of deep work plans without executing.

**Usage:**
```
/dwp-status [plan_name|latest|all]
```

**Parameters (optional):**
- `{plan_name}` - Check specific plan status directly
- `latest` - Check the most recent plan status
- `all` - Check all plans status

**Flow:**
1. If parameters provided: Skip selection, use plan/scope directly
2. If no parameters: Select plan(s) to check (single, all, or list)
3. Gather status information (task list, git status, logs)
4. Generate comprehensive status report

**Examples:**
- Check with params: `/dwp-status my_project_plan` (fast)
- Check latest: `/dwp-status latest` (fast)
- Check all: `/dwp-status all` (fast)
- Interactive mode: `/dwp-status` → select `PLAN_refactor_auth`
- Interactive mode: `/dwp-status` → "all"
- Interactive mode: `/dwp-status` → "list"

**Output:**
- Progress percentage
- Completed vs pending tasks
- Git status and recent commits
- Current task and blockers

---

### Library Upgrades

#### `/lib-upgrade`
Upgrade project dependencies (npm packages via npm-check-updates).

**Usage:**
```
/lib-upgrade [all|minor|patch|specific|check]
```

**Parameters (optional):**
- `all` - Upgrade all packages (minor first, then ask about major)
- `minor` - Upgrade only minor and patch versions
- `patch` - Upgrade only patch versions (safest)
- `specific {package1} {package2}...` - Upgrade specific packages
- `check` - Just show what upgrades are available (no changes)

**Flow:**
1. If no parameters: Auto-discovery with interactive menu
2. If parameters provided: Skip menu, use specified upgrade type
3. Categorize packages: patch, minor, major
4. Show comprehensive report
5. Execute upgrades with automatic rollback on failures
6. Validate with `codecheck` or `pnpm run test`
7. Generate comprehensive report

**Interactive Menu:**
1. Upgrade patch versions only (safest)
2. Upgrade patch + minor (recommended)
3. Upgrade all (minor first, then ask about major)
4. Select specific packages
5. Cancel

**Examples:**
- Interactive mode (recommended): `/lib-upgrade`
  - Auto-discovers packages
  - Shows categorized report
  - Presents menu for selection
  - Handles major upgrades separately

**Behavior:**
- Prioritizes minor upgrades (safer)
- Asks approval for major upgrades individually
- Automatic rollback on failures
- Retry logic (max 3 attempts)
- Validation after upgrades

---

### Git Workflow

#### `/branch`
Generate branch names following DailyBot naming convention.

**Usage:**
```
/branch
```

**Format:** `{purpose}__{name_of_feature}`

**Purposes:**
- `hotfix` - High/Medium priority bugs
- `fix` - Low priority bugs
- `feature` - New features
- `improvement` - Enhancements
- `experiment` - Experimental code
- `conflict` - Resolve merge conflicts

**Examples:**
- Good: `hotfix__login_with_email_password`
- Good: `feature__telegram_reactions`
- Bad: `Hotfix__Login_Email` (wrong case)
- Bad: `security_command` (missing purpose)

**Flow:**
1. Ask what you want to work on (if not provided)
2. Generate branch name following convention
3. Show git command to create branch
4. Ask if you want to create it or modify name

---

#### `/code-review`
Review code focusing on critical issues only.

**Usage:**
```
/code-review [PR_number]
```

**Parameters:**
- No params: Reviews current file or selected code
- `{PR_number}`: Reviews specific GitHub PR

**Priority Focus:**
1. 🔴 Security (SQL injection, XSS, hardcoded secrets)
2. 🟠 Bugs (null refs, race conditions, memory leaks)
3. 🟡 Performance (N+1 queries, missing indexes)
4. 🟢 Code Quality (critical logic errors, DRY violations)

**Post-Review Actions:**
- **No issues:** Offers to approve PR via `gh pr review`
- **Issues found:**
  - Option 1: Post to PR (inline comments on specific lines)
  - Option 2: Fix locally (for own PR)

**Flow:**
1. Auto-detects PR for current branch or reviews selected code
2. Identifies critical issues with file:line references
3. Provides actionable fixes for each issue
4. Offers to approve PR or post comments/fixes

---

#### `/commit`
Generate a conventional commit message based on staged changes.

**Usage:**
```
/commit
```

**Flow:**
1. Analyze `git diff --staged`
2. Generate conventional commit message
3. Present options: commit, modify, or show command

**Examples:**
- Quick commit: `/commit` → select "1" (commit with message)
- Modify message: `/commit` → select "2" → provide changes

---

#### `/pr`
Generate a pull request description based on branch changes.

**Usage:**
```
/pr
```

**Flow:**
1. Get current branch
2. Ask for base branch (main/staging/dev)
3. If main: ask for context and Linear card URL (mandatory)
4. Analyze changes
5. Generate PR title and body
6. Present options: create PR, modify, or show command

**Examples:**
- Create PR to main: `/pr` → base: "main" → provide context and Linear URL
- Create PR to dev: `/pr` → base: "dev" → generates short format

---

## Command Workflow Examples

### Creating and Executing a Plan

**🚀 Fastest Path (Trust Mode + Execute):**
```bash
# One command does everything: draft → refine → final plan → execute
/dwp-create my_project_plan trust

# Agent asks for: objective, context, tasks
# Then automatically creates: draft → refined draft → final plan
# Agent asks: "Execute now?" → you say yes → execution starts

# That's it! One command, answer questions, plan executes.
```

**🎯 Guided Mode (With Review):**
```bash
# Start the unified flow
/dwp-create

# Agent asks for: name, objective, context, tasks
# Creates draft and refined draft automatically
# Shows summary for your review
# You approve → final plan created
# Agent asks: "Execute now?" → you decide

# Full control with smooth flow.
```

**📝 Just Want a Draft:**
```bash
# Create only draft + refined draft (no final plan)
/dwp-create draft my_project_plan

# Later, create final plan from it
/dwp-create from PLAN_my_project_plan_draft_refined.md
```

**Comparison - Old vs New Flow:**
```
OLD (3+ commands):
  /dwp-create draft → /dwp-refine → /dwp-create from-draft → /dwp-execute

NEW (1-2 commands):
  /dwp-create [trust] → /dwp-execute
```

### Resuming After Interruption

**Fast mode:**
```bash
# Check status first
/dwp-status my_project_plan
# → See current progress

# Resume execution
/dwp-resume my_project_plan
# → Continues from where it left off
```

**Interactive mode:**
```bash
# Check status first
/dwp-status
# → Select plan
# → See current progress

# Resume execution
/dwp-resume
# → Select plan
# → Continues from where it left off
```

### Upgrading Libraries

**Interactive mode (recommended):**
```bash
# Execute with auto-discovery
/lib-upgrade
# → Automatically runs `ncu`
# → Shows categorized report:
#    📦 Package Update Report
#    Patch upgrades (safest): 2
#    Minor upgrades (safe): 5
#    Major upgrades (⚠️ breaking): 1
# → Presents menu:
#    1. Upgrade patch versions only
#    2. Upgrade patch + minor (recommended)
#    3. Upgrade all (minor first, then ask about major)
#    4. Select specific packages
#    5. Cancel
# → Select option (e.g., "2" for patch + minor)
# → Runs `ncu -u --target minor && pnpm install`
# → Validates with codecheck
# → After minor complete, asks about major upgrades
# → Generates comprehensive report
```

**Example flow:**
```
You: /lib-upgrade

Agent: Running ncu to discover packages...

📦 Package Update Report
━━━━━━━━━━━━━━━━━━━━━━━━
Patch upgrades (safest): 2
  • axios: 1.6.0 → 1.6.2
  • mocha: 10.2.0 → 10.2.1

Minor upgrades (safe): 3
  • typescript: 5.3.3 → 5.4.0
  • eslint: 8.55.0 → 8.56.0
  • prettier: 3.1.0 → 3.2.0

Major upgrades (⚠️ breaking): 1
  • webpack: 5.90.0 → 6.0.0

What would you like to do?
1. Upgrade patch versions only (safest)
2. Upgrade patch + minor (recommended)
3. Upgrade all (minor first, then ask about major)
4. Select specific packages
5. Cancel

You: 2

Agent: Upgrading patch + minor versions...
[executes upgrades, validates, generates report]

Major upgrades available. Would you like to review?
• webpack: 5.90.0 → 6.0.0 (breaking changes possible)

Options:
1. Apply all major upgrades
2. Choose individually
3. Skip all major upgrades
```

---

## File Locations

### Deep Work Plans
- **Drafts:** `.agent_commands/agent_deep_work_plans/results/drafts/`
- **Plans:** `.agent_commands/agent_deep_work_plans/results/plans/`
- **Guide:** `.agent_commands/agent_deep_work_plans/GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md`

### Library Upgrades
- **Guide:** `.agent_commands/agent_library_upgrades/GUIDE.md`
- **Examples:** `.agent_commands/agent_library_upgrades/example_prompts/`

---

## Important Notes

### Git Ignore
- Files in `drafts/` and `plans/` folders are **git-ignored** (except README.md and .gitkeep)
- These are temporary execution artifacts, not permanent repository content

### Naming Conventions
- Plan names: `snake_case`, lowercase (e.g., `refactor_auth`, not `RefactorAuth`)
- Draft files: `PLAN_{name}_draft.md` or `PLAN_{name}_draft_refined.md`
- Plan folders: `PLAN_{name}/`

### Execution Rules
- Plans execute tasks **strictly in order**
- **One task at a time** - never skip or reorder
- **Validation required** - never mark complete without passing validations
- **Commit after each task** - small, incremental commits

---

## Related Documentation

- **[Deep Work Plans Guide](../.agent_commands/agent_deep_work_plans/GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md)**
- **[Library Upgrades Guide](../.agent_commands/agent_library_upgrades/GUIDE.md)**
- **[Development Commands](../docs/DEVELOPMENT_COMMANDS.md)**
- **[Repository Standards](../docs/STANDARDS.md)**

---

## Quick Reference

| Command | Purpose | Output |
|---------|---------|--------|
| `/dwp-create` | ⭐ Unified plan creation (guided) | Draft → Refined → Final → Execute? |
| `/dwp-create {name} trust` | ⭐ Fast plan creation (no stops) | Draft → Refined → Final → Execute? |
| `/dwp-create draft {name}` | Draft only (legacy) | Draft + Refined draft |
| `/dwp-create from {file}` | From existing draft | Final plan |
| `/dwp-refine [draft\|plan]` | Refine draft OR modify final plan | Draft/plan modifications |
| `/dwp-execute [name\|latest]` | Execute a plan | Executes tasks, commits changes |
| `/dwp-resume [name\|latest]` | Resume interrupted plan | Continues from last task |
| `/dwp-status [name\|latest\|all]` | Check plan status | Status report (read-only) |
| `/lib-upgrade [all\|minor\|patch\|specific\|check]` | Upgrade npm packages | Interactive menu with auto-discovery |
| `/branch` | Generate branch name | Branch name following convention |
| `/code-review [PR#]` | Review code for critical issues | Security/bugs/performance findings |
| `/commit` | Generate commit message | Commit with message |
| `/pr` | Generate PR description | PR title and body |
