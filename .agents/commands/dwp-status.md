---
description: Check status of deep work plans without executing
---

# Deep Work Plan Status Checker

You are a status checker that reports the current state of deep work plans without executing them.

## Your Task

Check and report the status of one or more plans, showing progress, completed tasks, and current state.

## Parameter Support

**This command accepts optional parameters for faster execution:**

- `/dwp-status {plan_name}` - Check specific plan status directly
- `/dwp-status latest` - Check the most recent plan status
- `/dwp-status all` - Check all plans status

**If parameters are provided:**
- Parse the parameter:
  - If "all" → Check all plans (skip to Step 2 with scope="all")
  - If "latest" → Use most recently modified plan (skip to Step 2 with scope="single")
  - Otherwise → Normalize (add `PLAN_` prefix if missing) and use as plan name (skip to Step 2 with scope="single")
- For single plan: Validate plan folder exists
- If not found, show error with available plans and ask user to choose
- If found, skip selection menu and go directly to Step 2 (Check Status)

**If no parameters are provided:**
- Continue with interactive workflow (Step 1)

## Workflow

### Step 0: Check for Parameters

**If command was called with parameters:**
- Extract scope/plan name from parameter
- If parameter is "all": Set scope to "all", skip to Step 2
- If parameter is "latest": Find most recently modified plan, set scope to "single", skip to Step 2
- Otherwise: Normalize plan name (add `PLAN_` prefix if missing), validate plan exists, set scope to "single", skip to Step 2
- If plan not found, show error with list of available plans and ask user to choose

**If no parameters provided:**
- Continue to Step 1 (interactive mode)

### Step 1: Ask for Scope

**First, find available plans:**
- List all folders in `.agent_commands/agent_deep_work_plans/results/plans/` that start with `PLAN_`
- Find the most recently modified plan folder (check README.md modification time)
- Store its name as `latest_plan_name`

**Present menu:**
```
Which plan(s) would you like to check?

1. Single plan (select from list)
2. All plans
3. {latest_plan_name} ⭐ (most recent)

Enter option (1, 2, 3, "all", "latest", or plan name):
```

**If user selects 1 or "single":**
- Show numbered list of all plans:
```
Available plans:

1. {latest_plan_name} ⭐ (most recent)
2. {plan2_name}
3. {plan3_name}
...

Enter option (number, plan name, or "latest" for option 1):
```
- If user provides number: Use that plan
- If user provides plan name: Normalize and validate
- If user says "latest": Use `latest_plan_name`

**If user selects 2 or "all":**
- Check all plans

**If user selects 3 or "latest":**
- Use `latest_plan_name`

**If user provides plan name directly:**
- Normalize: Add `PLAN_` prefix if missing
- Validate plan folder exists
- If not found, show the menu again with error message

### Step 2: Gather Status Information

**For each plan to check:**

1. **Read plan README:**
   - Overall goal
   - Task list (which are `[x]` vs `[ ]`)
   - Plan status notes (if any)

2. **Run git commands:**
   ```bash
   git status  # Check for uncommitted work
   git log --oneline -20  # Recent commits (filter for plan-related if possible)
   ```

3. **Check task files:**
   - For the last completed task (if any): Read Completion & Log section
   - For the current `[ ]` task: Read task file to see what's next

4. **Calculate progress:**
   - Total tasks
   - Completed tasks (`[x]`)
   - Pending tasks (`[ ]`)
   - Progress percentage

### Step 3: Generate Status Report

**For a single plan:**

```
═══════════════════════════════════════════════════════════
Plan Status: PLAN_{name}
Location: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/
═══════════════════════════════════════════════════════════

Goal: {overall goal from README}

Progress:
- Total tasks: {N}
- Completed: {X} [x]
- Pending: {Y} [ ]
- Progress: {percentage}%

Completed tasks:
{List all tasks marked [x] with checkmarks}

Pending tasks:
{List all tasks marked [ ] with numbers}

Current status:
- Last completed: Task {N} - {task_title} (if any)
- Next task: Task {M} - {next_task_title}
- Uncommitted work: {yes/no - describe if yes}
- Recent commits: {last 3-5 commits related to plan}

Notes from plan:
{Any notes from Plan Status / Notes section in README}

Last task log:
{If last completed task has log, show summary}
```

**For multiple plans (when user says "all"):**

```
═══════════════════════════════════════════════════════════
All Deep Work Plans Status
═══════════════════════════════════════════════════════════

Found {N} plan(s):

1. PLAN_{name1}
   - Progress: {X}/{Y} tasks ({percentage}%)
   - Status: {in progress / complete / not started}
   - Last activity: {last commit date or "no activity"}

2. PLAN_{name2}
   - Progress: {X}/{Y} tasks ({percentage}%)
   - Status: {in progress / complete / not started}
   - Last activity: {last commit date or "no activity"}

...

═══════════════════════════════════════════════════════════
Detailed status for each plan:
═══════════════════════════════════════════════════════════

[Then show detailed status for each plan using single plan format]
```

### Step 4: Additional Information (Optional)

**Ask user:** "Would you like to see more details for any plan? (plan name or 'no')"

**If user requests details:**
- Show full detailed status for that plan
- Include:
  - All task files and their status
  - Git diff if uncommitted changes
  - Full completion logs from last task
  - Any blockers noted

### Step 5: Quick Actions

**After showing status, suggest:**

```
Quick actions:
- Resume execution: /dwp-resume PLAN_{name}
- Execute from start: /dwp-execute PLAN_{name}
- Check specific task: [provide path to task file]
```

## Status Classifications

**Plan status categories:**

1. **Not started:** All tasks are `[ ]`, no commits related to plan
2. **In progress:** Some tasks `[x]`, some `[ ]`, recent activity
3. **Complete:** All tasks `[x]`, ready for review/merge
4. **Blocked:** Current task has blocker note in log
5. **Stale:** No activity for extended period (optional detection)

## Important Notes

- **Read-only operation:** This command does NOT execute or modify plans
- **Git status:** Shows uncommitted work but doesn't commit anything
- **Accurate reporting:** Cross-reference README task list with git commits
- **Clear formatting:** Use clear sections and formatting for readability

## Error Handling

**If plan folder doesn't exist:**
- Report: "Plan not found: PLAN_{name}"
- List available plans
- Ask user to select one

**If README.md is missing:**
- Report: "Plan structure incomplete: README.md missing"
- List what files exist in the folder
- Suggest using /dwp-create to fix

**If no plans exist:**
- Report: "No plans found in .agent_commands/agent_deep_work_plans/results/plans/"
- Suggest using /dwp-create to create a new plan
