# Ready-to-Use Prompts for {PLAN_NAME}

This file contains **copy-paste ready prompts** for working with this specific plan.

**Plan location:** `.agent_commands/agent_deep_work_plans/results/plans/{PLAN_NAME}/`

---

## 📝 Instructions for Agents Creating This File

**When generating PROMPTS.md for a new plan:**

1. **Use this template** as the base structure
2. **Replace all instances of `{PLAN_NAME}`** with the actual plan name (e.g., `PLAN_EXAMPLE_document_domain_app`)
3. **Reference the canonical examples** in `.agent_commands/agent_deep_work_plans/example_prompts/`:
   - See `CREATE_PLAN.md` for create prompt patterns
   - See `EXECUTE_PLAN.md` for execute prompt patterns
   - See `RESUME_PLAN.md` for resume prompt patterns
4. **Customize if needed** based on plan-specific requirements (validations, commit formats, etc.)
5. **Keep prompts simple** - use the simple format from examples unless detailed is needed

**This ensures consistency with the canonical examples while providing plan-specific ready-to-use prompts.**

---

## 🚀 Execute This Plan

**Use this to start executing the plan from the beginning:**

```
Execute the plan at: .agent_commands/agent_deep_work_plans/results/plans/{PLAN_NAME}/README.md

Work on tasks in order. Run validations. Commit after each task.
```

**With specific requirements:**

```
Execute the plan at: .agent_commands/agent_deep_work_plans/results/plans/{PLAN_NAME}/README.md

Important for this plan:
- [Add any plan-specific validations or requirements]

Work on tasks in order. Run validations. Commit after each task.
```

---

## ⏯️ Resume This Plan (After Interruption)

**Use this when execution was interrupted (internet loss, IDE crash, break, etc.):**

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/{PLAN_NAME}/README.md

Check task list. Continue from first [ ] task. Review git log.
```

---

## 📊 Resume With Status Report

**Use this when you want to know exactly what's done before resuming:**

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/{PLAN_NAME}/README.md

Before resuming, report:
1. Which tasks are [x] vs [ ]?
2. What does git log show? (last 10 commits)
3. Any uncommitted changes? (git status)
4. What's in the current task's log?

Then continue from first [ ] task.
```

---

## 📋 Check Plan Status (Without Executing)

**Use this to check progress without continuing execution:**

```
Check status of: .agent_commands/agent_deep_work_plans/results/plans/{PLAN_NAME}/README.md

Report:
1. Which tasks are [x] vs [ ] in the plan README?
2. What does git log --oneline -10 show?
3. What does git status show?
4. What's in the last task's Completion & Log section?

Tell me where we are in the plan.
```

---

## 🔧 Modify This Plan

**Use this when you need to add/remove/reorder tasks mid-execution:**

```
PAUSE execution of: .agent_commands/agent_deep_work_plans/results/plans/{PLAN_NAME}/README.md

I need to modify the plan:
[Describe what you want to change]

After I manually update the plan files, I'll ask you to resume.
```

---

## 💡 Quick Actions

| Action                      | Prompt to Use             |
| --------------------------- | ------------------------- |
| Start execution             | Execute This Plan         |
| Continue after interruption | Resume This Plan          |
| Need status first           | Resume With Status Report |
| Just check progress         | Check Plan Status         |
| Change plan structure       | Modify This Plan          |

---

## 📚 Related Documentation

When creating or customizing these prompts, reference:

- **[../example_prompts/CREATE_PLAN.md](../example_prompts/CREATE_PLAN.md)** - Canonical examples for creating plans
- **[../example_prompts/EXECUTE_PLAN.md](../example_prompts/EXECUTE_PLAN.md)** - Canonical examples for executing plans
- **[../example_prompts/RESUME_PLAN.md](../example_prompts/RESUME_PLAN.md)** - Canonical examples for resuming plans
- **[../GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md](../GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md)** - Complete technical specification

---

**Note:** These prompts are pre-configured for this specific plan. Just copy and paste to your agent!

**For agents:** When generating this file, use the examples in `example_prompts/` as reference to ensure consistency and best practices.
