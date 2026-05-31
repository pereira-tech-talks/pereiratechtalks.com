# How to Resume Interrupted Deep Work Plans

Copy-paste ready prompts for resuming plans after interruptions.

---

## When to Resume

Use these prompts when execution was interrupted by:

- ✅ Internet connection loss
- ✅ IDE crash (Cursor, VS Code, etc.)
- ✅ Agent hitting token/context limits
- ✅ Intentional breaks (overnight, lunch, etc.)
- ✅ System shutdown or errors

---

## Simple Resume (Use 95% of the time) ⭐

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

Check task list. Continue from first [ ] task. Review git log.
```

**That's it!** The agent will:

- Check which tasks are `[x]` vs `[ ]`
- Find where to resume
- Review git history
- Continue without redoing work

---

## Resume Examples

### Resume UI Expansion (After Internet Loss)

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_ui_showcase_expansion/README.md

Check task list. Continue from first [ ] task. Review git log.
```

---

### Resume Backend Refactoring (After Cursor Crash)

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_refactor_checkin_engine/README.md

Check task list. Continue from first [ ] task. Review git log.
```

---

### Resume Testing Plan (After Break)

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_auth_testing/README.md

Check task list. Continue from first [ ] task. Review git log.
```

---

## Resume with Status Report (When You Need Details)

**Use when you want to know exactly what happened:**

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

Before resuming, report:
1. Which tasks are [x] vs [ ]?
2. What does git log show? (last 10 commits)
3. Any uncommitted changes? (git status)
4. What's in the current task's log?

Then continue from first [ ] task.
```

---

## Resume Scenarios

### Scenario 1: Clean Interruption (All Work Committed)

**What happened:** Internet dropped after you committed task 2.

**Prompt:**

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

Check task list. Continue from first [ ] task.
```

**Agent will:**

- See tasks 1-2 are `[x]` (done)
- Task 3 is `[ ]` (pending)
- Start working on task 3

---

### Scenario 2: Interrupted Mid-Task (Uncommitted Changes)

**What happened:** Cursor crashed while working on task 3.

**Prompt:**

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

Check git diff for uncommitted work. Complete the current [ ] task.
```

**Agent will:**

- See task 3 is `[ ]` (in progress)
- Run `git diff` to see what was changed
- Review changes, complete task 3
- Validate, log, commit
- Move to task 4

---

### Scenario 3: Validation Failed in Previous Session

**What happened:** Task 2 validation failed, agent logged and stopped.

**Prompt:**

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

Read current [ ] task's log for blocker. Fix validation. Continue.
```

**Agent will:**

- See task 2 is `[ ]` (blocked)
- Read Completion & Log section (e.g., "coverage at 45%, need 50%")
- Fix the issue
- Re-run validation
- If pass: mark `[x]`, commit, move on
- If fail: log again, stop

---

## Detailed Resume (Full Control)

**Use when you need complete control over the resume process:**

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

Steps:
1. Read plan README - check task status [x] vs [ ]
2. Run: git log --oneline -10
3. Run: git status
4. Run: git diff (if uncommitted changes)
5. Read current [ ] task's Completion & Log

Report findings:
- Last completed task: [?]
- Current task: [?]
- Uncommitted work: [yes/no]
- Blocker notes: [any?]

Then resume from first [ ] task following normal rules.
```

---

## Troubleshooting Resumes

### Not Sure Where We Left Off

**Problem:** You don't remember what was completed.

**Solution:**

```
Check status of: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

Report:
1. Tasks [x] vs [ ] in plan README
2. git log --oneline -10
3. git status
4. Last task's Completion & Log

Tell me where we should resume.
```

---

### Found Uncommitted Work But Not Sure if Valid

**Problem:** `git diff` shows changes but you're not sure if they're correct.

**Solution:**

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

git diff shows uncommitted changes. Review them:
- If valid: complete and commit
- If incomplete: finish them
- If unclear: ask me before continuing
```

---

### Task Marked Complete But Validation Might Have Failed

**Problem:** Task shows `[x]` but you suspect validation didn't pass.

**Solution:**

```
Check task: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/[N].task_{title}.md

Read Completion & Log section. Did validation pass?
- If yes: move to next [ ] task
- If no: revert to [ ], fix, re-validate
```

---

## What Happens During Resume

When you resume a plan, the agent will:

1. ✅ Read plan README
2. ✅ Check task list (`[x]` vs `[ ]`)
3. ✅ Find first `[ ]` task (resumption point)
4. ✅ Run `git status` / `git log` to see current state
5. ✅ Check task's Completion & Log for notes
6. ✅ Assess any uncommitted work
7. ✅ Continue from that task
8. ✅ **Never redo `[x]` tasks**
9. ✅ **Never skip `[ ]` tasks**

---

## Critical Rules for Resuming

### ✅ DO:

- **Trust the task list**: `[x]` = done, `[ ]` = pending
- **Check git history**: See what was actually completed
- **Read completion logs**: Look for blocker notes
- **Review uncommitted work**: Decide if valid
- **Continue from first `[ ]`**: Maintain strict order

### ❌ DON'T:

- **Don't redo completed work**: If `[x]`, it's done
- **Don't skip tasks**: Even if you think they're unnecessary
- **Don't ignore blocker logs**: Read what previous session noted
- **Don't assume**: Always verify current state

---

## Quick Checklist for Resuming

Before resuming, verify:

- [ ] Checked plan README for task status
- [ ] Ran `git log` to see recent commits
- [ ] Ran `git status` to check uncommitted work
- [ ] Read current task's Completion & Log
- [ ] Know which task to resume from
- [ ] Ready to continue without duplicating work

---

**Next steps:**

- Create a new plan? See [CREATE_PLAN.md](./CREATE_PLAN.md)
- Execute a plan? See [EXECUTE_PLAN.md](./EXECUTE_PLAN.md)
