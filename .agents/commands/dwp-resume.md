---
description: Resume an interrupted deep work plan
---

# Deep Work Plan Resumer

You are a deep work plan resumer that safely continues execution from where it was interrupted.

## Your Task

Resume execution of a plan that was interrupted, ensuring no work is duplicated and execution continues from the correct point.

## Parameter Support

**This command accepts optional parameters for faster execution:**

- `/dwp-resume {plan_name}` - Resume plan directly (skips selection menu)
- `/dwp-resume latest` - Resume the most recent plan

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

Which plan would you like to resume?

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

### Step 2: Assess Current State

**CRITICAL:** Before resuming, you MUST assess the current state:

1. **Read plan README** completely
   - Understand overall objective
   - Check task list: which are `[x]` (completed) vs `[ ]` (pending)

2. **Run git commands:**
   ```bash
   git status  # Check for uncommitted changes
   git log --oneline -10  # See recent commits
   git diff  # If uncommitted changes exist
   ```

3. **Find resumption point:**
   - Identify the **first unchecked `[ ]` task** in the Task List
   - This is where execution should resume

4. **Check for partial work:**
   - If `git status` shows uncommitted changes, review them with `git diff`
   - Check if changes align with the current `[ ]` task
   - Read the current task's Completion & Log section for any notes

### Step 3: Report Resumption Status

**Before starting work, report:**

```
Resuming plan: PLAN_{name}
Location: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/

Current state:
- Completed tasks [x]: [list all tasks marked [x]]
- Pending tasks [ ]: [list all tasks marked [ ]]
- Resuming from: Task {N} - {task_title}

Git status:
- Uncommitted changes: [yes/no]
- Recent commits: [last 5-10 commits related to plan]
- Last commit: [hash and message]

Current task status:
- Task file: [N.task_{title}.md]
- Completion log: [any notes from previous session]
- Partial work found: [yes/no, describe if yes]

Plan:
- [Describe what needs to be done to complete current task]
- [Any blockers or issues noted in logs]
```

### Step 4: Handle Partial Work

**If uncommitted changes exist:**

1. Review `git diff` output
2. Assess if changes are:
   - **Valid partial progress** for current task → Incorporate and complete
   - **Incomplete work** → Finish remaining work
   - **Unclear/unrelated** → Ask user for clarification before proceeding

3. Report findings:
   ```
   Found uncommitted changes:
   - Files: [list]
   - Assessment: [valid partial work / incomplete / unclear]
   - Action: [incorporate / complete / ask user]
   ```

**If no uncommitted changes:**
- Proceed directly to task execution

### Step 5: Resume Execution

**Follow these CRITICAL rules:**

1. **NEVER redo completed `[x]` tasks**
   - Trust the plan README's task list
   - Cross-check with git commits for confirmation
   - If a task is `[x]`, it's done - move on

2. **NEVER skip `[ ]` tasks**
   - Work on tasks in strict order
   - Complete each fully before moving to next

3. **Continue from first `[ ]` task:**
   - Open the task file: `N.task_{task_title}.md`
   - Read it completely
   - Review Completion & Log for any blocker notes
   - If blocker exists, address it first

4. **Complete current task:**
   - Follow task's Execution Checklist
   - Run all validation commands
   - If validation fails:
     - Log in Completion & Log section
     - DO NOT mark as `[x]`
     - Report to user and wait for guidance
   - If validation passes:
     - Update task's Completion & Log
     - Mark as `[x]` in plan README
     - Commit changes

5. **Continue to next tasks:**
   - After completing current task, move to next `[ ]` task
   - Repeat until all tasks complete or user requests pause

### Step 6: Handle Blockers

**If task log shows a blocker:**

1. Read the blocker note from Completion & Log
2. Understand the issue (e.g., "coverage at 45%, need 50%")
3. Fix the issue
4. Re-run validations
5. If pass: mark `[x]`, commit, continue
6. If still fail: log again, stop, request help

**Example:**
```
Task 2 log shows: "Status: blocked - validation failed - coverage at 45%, need 50%"

Action:
1. Review coverage report
2. Add missing tests to reach 50%
3. Re-run validation
4. If pass: complete task
5. If fail: log again, stop
```

### Step 7: Progress Reporting

**After resuming and completing a task:**
```
✓ Resumed and completed: Task {N} - {task_title}
  - Files changed: [list]
  - Validation: [pass/fail]
  - Commit: [commit hash/message]
  - Next: Task {N+1} - {next_task_title}
```

**If encountering blocker:**
```
✗ Task {N} blocked: {task_title}
  - Blocker: [issue from log]
  - Action taken: [what was attempted]
  - Status: [resolved / still blocked]
  - Next: [continue / wait for guidance]
```

## Important Notes

- **Trust the task list:** `[x]` = done, `[ ]` = pending
- **Verify with git:** Cross-check commits to confirm status
- **Read completion logs:** Previous session may have left important notes
- **Never duplicate work:** If `[x]`, don't redo it
- **Never skip tasks:** Maintain strict order
- **Assess partial work:** Review uncommitted changes carefully
- **Stop on blockers:** Don't continue if validation fails

## Error Handling

**If plan structure is invalid:**
- Report issues found
- Ask user to fix or proceed with caution

**If task file is missing:**
- Report error
- Ask user if task should be skipped or created

**If git state is unclear:**
- Report findings
- Ask user for clarification before proceeding

**If blocker cannot be resolved:**
- Log the issue in task's Completion & Log
- Report to user
- Wait for guidance before continuing
