---
description: Execute an existing deep work plan
---

# Deep Work Plan Executor

You are a deep work plan executor that runs existing plans following the execution rules.

## Your Task

Execute a deep work plan by working through tasks sequentially, one at a time.

## Parameter Support

**This command accepts optional parameters for faster execution:**

- `/dwp-execute {plan_name}` - Execute plan directly (skips selection menu)
- `/dwp-execute latest` - Execute the most recent plan

**If parameters are provided:**
- Parse the parameter:
  - If "latest" → Use most recently modified plan
  - Otherwise → Normalize (add `PLAN_` prefix if missing) and use as plan name
- Validate plan folder exists: `.agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/`
- If not found, show error with available plans and ask user to choose
- If found, skip selection menu and go directly to Step 2 (Read Plan)

**If no parameters are provided:**
- Continue with interactive workflow (Step 1)

## Workflow

### Step 0: Check for Parameters

**If command was called with parameters:**
- Extract plan name from parameter
- Normalize: Add `PLAN_` prefix if missing
- If parameter is "latest": Find most recently modified plan folder
- Validate plan folder exists: `.agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/`
- Validate `README.md` exists in plan folder
- If not found, show error with list of available plans and ask user to choose
- If found, skip to Step 2 (Read Plan)

**If no parameters provided:**
- Continue to Step 1 (interactive mode)

### Step 1: Identify Plan

**First, find the latest plan:**
- List all folders in `.agent_commands/agent_deep_work_plans/results/plans/` that start with `PLAN_`
- Find the most recently modified plan folder (check README.md modification time)
- Store its name as `latest_plan_name`

**Present menu:**
```
Available plans:

1. {latest_plan_name} ⭐ (most recent)
2. {plan2_name}
3. {plan3_name}
...

Which plan would you like to execute?

Enter option (number, plan name, or "latest" for option 1):
```

**If user provides number:**
- Use the plan at that position in the list
- Normalize: Add `PLAN_` prefix if missing
- Validate plan folder exists: `.agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/`
- Validate `README.md` exists in plan folder
- If not found, show error and menu again

**If user provides plan name:**
- Normalize: Add `PLAN_` prefix if missing
- Validate plan folder exists: `.agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/`
- Validate `README.md` exists in plan folder
- If not found, show the menu again with error message

**If user says "latest":**
- Use `latest_plan_name`
- Validate plan folder exists and README.md exists

### Step 2: Read Plan Overview

Read the plan's `README.md` to understand:
- Overall goal
- Context
- Global guidelines
- Task list (which are `[x]` vs `[ ]`)
- Execution rules
- **Team Agents Configuration** (if present — check for "Team Agents Configuration (Claude Code Only)" section)

### Step 3: Check Current Status

Before starting, report current status:

1. **Read plan README** - Check task list
2. **Run:** `git status` - Check for uncommitted work
3. **Run:** `git log --oneline -10` - See recent commits
4. **Identify first `[ ]` task** - This is where to start/resume

**Report:**
```
Plan: PLAN_{name}
Location: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/

Current status:
- Completed tasks: [list tasks marked [x]]
- Pending tasks: [list tasks marked [ ]]
- Starting from: Task {N} - {task_title}
- Git status: [clean / uncommitted changes]
- Recent commits: [last 3-5 commits related to this plan]
```

### Step 3.5: Team Agents Option (Claude Code Only)

> Other AI agents should skip this step entirely.

**If the plan README contains a "Team Agents Configuration (Claude Code Only)" section:**

Ask:
```
This plan has team agents configuration for parallel execution.

1. Use team agents (parallel execution for applicable task groups)
2. Execute sequentially (standard mode)

Enter option (1-2, default: 2):
```

**If user chooses option 1 (team agents):**
- Store `team_agents_mode = true`
- Note the parallel task groups and teammate roles from the plan README
- At parallel group boundaries during execution, use team agents (see Step 5)

**If user chooses option 2 or presses Enter:**
- Proceed with standard sequential execution (default behavior)

**If no "Team Agents Configuration" section found:**
- Skip this step silently — proceed to Step 4

### Step 4: Ask for Execution Preferences (Optional)

Ask: "Any specific requirements for this execution? (press Enter to use defaults)"

**If user provides requirements:**
- Store them (e.g., "Run build_static after CSS changes", "Test in both modes")
- Apply to all tasks

**If user presses Enter or says "no":**
- Use default execution rules from plan README

### Step 5: Execute Plan

Follow these rules strictly:

1. **Work on ONE task at a time**
   - Always pick the **first unchecked `[ ]` task** in the Task List
   - Never skip or reorder tasks

2. **For each task:**
   - Open the corresponding `N.task_{task_title}.md` file
   - Read it completely
   - Follow the detailed instructions carefully
   - Complete all steps in the Execution Checklist

3. **Use skills and agents:**
   - If the task references a skill (`/skill-name`), invoke it directly via slash command
   - If the task specifies agent-based validation, delegate to the named agent
   - Skills and agents handle their own model routing and tool access automatically

4. **Run validations:**
   - Execute ALL validation commands specified in the task file
   - If ANY validation fails:
     - STOP execution
     - Log the issue in the task's Completion & Log section
     - DO NOT mark task as `[x]`
     - Report to user and wait for guidance

5. **Mark task complete:**
   - Only when task meets ALL acceptance criteria
   - Only when ALL validations pass
   - Update plan README: `[ ] → [x]` in Task List
   - Update task file's Completion & Log section with:
     - Status: completed
     - Timestamp
     - Summary of work
     - Files changed
     - Validation results
     - Notes (if any)

6. **Commit changes:**
   - Commit after each completed task
   - Use conventional commit format: `type(scope): complete task N - description`
   - Include relevant files

7. **Move to next task:**
   - After committing, move to the next `[ ]` task
   - Repeat the process

8. **Stop conditions:**
   - All tasks are `[x]` (plan complete)
   - Validation fails (wait for user guidance)
   - User requests pause
   - Blocking issue encountered

9. **Parallel group execution (Team Agents Mode only):**

   > **CRITICAL DISTINCTION:** Use real team agents API (TeamCreate + Agent with team_name),
   > NOT subagents (Agent tool without team_name). Subagents report back only;
   > team agents share a task list and can message each other.

   When `team_agents_mode = true` and the current task is part of a parallel group:

   a) **Create team:** `TeamCreate` with name `"dwp-{plan_name}-group-{letter}"`
   b) **Spawn teammates:** `Agent` (with `team_name`) for each task in the group, using:
      - Role name from the Teammate Roles table
      - Spawn prompt from the table (include task file path and key context)
      - Model: sonnet (default)
   c) **Create shared tasks:** `TaskCreate` for each parallel task
   d) **Assign tasks:** `TaskUpdate` (owner) to assign each task to its teammate
   e) **Monitor:** Lead receives automatic messages from teammates as they work
   f) **Wait for completion:** All teammates must complete their assigned tasks
   g) **Shutdown:** `SendMessage` (shutdown_request) for graceful shutdown of each teammate
   h) **Clean up:** `TeamDelete` to remove team resources
   i) **Update tracking:** Mark all completed tasks in plan README, update PROGRESS.md
   j) **Continue:** Move to the next group

   **How to verify real team agents are active:**
   - Status bar shows: `Team: dwp-{name} · {N} teammates`
   - NOT: `{N} local agents` (that's subagents — wrong!)

   **Fallback:** If team agents fail at any point (creation error, teammate crash):
   - Log the error
   - Execute remaining tasks in the failed group sequentially
   - Continue with the rest of the plan normally

### Step 6: Progress Reporting

**After each task completion, report:**
```
✓ Task {N} completed: {task_title}
  - Files changed: [list]
  - Validation: [pass/fail]
  - Commit: [commit hash/message]
  - Next: Task {N+1} - {next_task_title}
```

**If validation fails:**
```
✗ Task {N} validation failed: {task_title}
  - Error: [validation error details]
  - Status: Blocked - waiting for guidance
  - Task remains: [ ]
```

**For parallel group completion (Team Agents Mode):**
```
✓ Parallel Group {letter} completed:
  - Task {N}: {title} - completed by {teammate_role}
  - Task {M}: {title} - completed by {teammate_role}
  - Task {P}: {title} - completed by {teammate_role}
  Team cleaned up. Continuing with next group.
  Next: Task {X} - {next_task_title}
```

### Step 7: Completion

**When all tasks are complete:**
```
✓ Plan execution complete: PLAN_{name}

All tasks completed:
- [List all completed tasks]

Final status:
- Total tasks: {N}
- Completed: {N}
- Commits: [count]
- Final commit: [last commit hash]

Plan is ready for review and merge.
```

## Important Notes

- **Strict order:** Never skip or reorder tasks
- **One at a time:** Focus on current task only
- **Validation required:** Never mark complete without passing validations
- **Commit after each:** Small, incremental commits
- **Stop on failure:** Don't continue if validation fails
- **Reference plan:** The plan README is the source of truth

## Error Handling

**If task file is missing:**
- Report error
- Ask user if task should be skipped or created

**If validation command fails:**
- Stop execution
- Log error in task's Completion & Log
- Report to user
- Wait for guidance before continuing

**If user requests pause:**
- Stop at current task
- Report current status
- Save progress (tasks marked `[x]` remain marked)

**If plan structure is invalid:**
- Report issues found
- Ask user to fix or proceed with caution
