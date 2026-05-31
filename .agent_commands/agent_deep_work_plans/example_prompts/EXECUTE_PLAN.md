# How to Execute Deep Work Plans

Copy-paste ready prompts for executing existing deep work plans.

---

## Simple Execution (Use 95% of the time)

```
Execute the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

Work on tasks in order. Run validations. Commit after each task.
```

**That's it!** The plan README contains all the instructions the agent needs.

---

## Examples

### Execute UI Expansion Plan

```
Execute the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_ui_showcase_expansion/README.md

Work on tasks in order. Run validations. Commit after each task.
```

---

### Execute Backend Refactoring

```
Execute the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_refactor_checkin_engine/README.md

Work on tasks in order. Run validations. Commit after each task.
```

---

### Execute Testing Plan

```
Execute the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_auth_testing/README.md

Work on tasks in order. Run validations. Commit after each task.
```

---

## Detailed Execution (When You Need More Control)

**Use when you want to emphasize specific requirements:**

```
Execute the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

Execution rules:
- Work on ONE task at a time
- Run ALL validations before marking complete
- Commit after each task: "type(scope): complete task N - description"
- STOP if validation fails

Important for this plan:
[Add specific requirements here, e.g., "Test in both light/dark modes"]

Begin now.
```

---

## With Progress Reporting

**When you want status updates after each task:**

```
Execute the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

After completing each task, report:
- Task completed: [task number and title]
- Validation results: [pass/fail]
- Next task: [what's next]

Then continue to next task.
```

---

## Common Scenarios

### Execute and Report Only on Completion

```
Execute the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

Work through all tasks. Report back when ALL tasks are complete or if you encounter a blocker.
```

---

### Execute with Specific Validation Emphasis

```
Execute the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

CRITICAL: For this plan, ensure:
- Run build_static after every CSS change
- Test in both light and dark modes
- Run codecheck and verify 50%+ coverage

Work on tasks in order. Stop if any validation fails.
```

---

### Execute with Custom Commit Format

```
Execute the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

Commit each task as: "feat(ui): task N - description"

Work on tasks in order. Run validations. Commit after each.
```

---

## Troubleshooting

### Agent Skipped a Task

```
STOP. You skipped task [N].

Go back to: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/[N].task_{title}.md

Complete task [N] first, then continue.
```

---

### Validation Failed But Agent Continued

```
STOP. Task [N] validation failed but you marked it complete.

Revert: [x] → [ ] in plan README
Fix validation errors
Re-run validations
Only mark [x] when ALL pass
```

---

### Need to Pause Execution

```
PAUSE execution of: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

Report current status:
- Tasks completed: [list]
- Current task: [in progress/not started]
- Uncommitted work: [yes/no]

We'll resume later.
```

---

### Need to Modify Plan Mid-Execution

```
PAUSE execution of: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_name}/README.md

I need to modify the plan: [describe changes]

Wait for me to update, then we'll resume.
```

---

## What Happens During Execution

When you execute a plan, the agent will:

1. ✅ Read the plan README
2. ✅ Find the first unchecked `[ ]` task
3. ✅ Open the task file (e.g., `1.task_create_buttons.md`)
4. ✅ Follow the task's instructions
5. ✅ Run validation commands specified in the task
6. ✅ Update the task's Completion & Log section
7. ✅ Mark task as `[x]` in plan README
8. ✅ Update PROGRESS.md with task summary
9. ✅ Commit changes
10. ✅ Move to next `[ ]` task
11. ✅ Repeat until all tasks complete (including mandatory final tasks)
12. ✅ Final task generates Executive Report in `analysis_results/`

---

## Tips

### ✅ DO:

- **Trust the plan**: The plan README has all the details
- **Keep prompts simple**: Usually just the plan path is enough
- **Let agent work**: Don't micromanage each task
- **Check progress**: Ask for updates if plan is long

### ❌ DON'T:

- **Don't skip validation emphasis**: If certain validations are critical, mention them
- **Don't forget to pause**: Use PAUSE if you need to stop
- **Don't let agent skip tasks**: Enforce strict order
- **Don't continue after failures**: STOP if validation fails

---

**Next steps:**

- Execution interrupted? See [RESUME_PLAN.md](./RESUME_PLAN.md)
- Need to create a plan? See [CREATE_PLAN.md](./CREATE_PLAN.md)
