# Example Prompts - Quick Index

Copy-paste ready prompts for working with agent deep work plans.

---

## 📂 Files

### [CREATE_PLAN.md](./CREATE_PLAN.md)

**How to create new deep work plans**

- Simple prompts (use 95% of the time)
- Detailed prompts (for complex cases)
- Real examples (UI, backend, docs)

### [EXECUTE_PLAN.md](./EXECUTE_PLAN.md)

**How to execute existing plans**

- Simple execution (just start working)
- Detailed execution (with specific requirements)
- Common patterns

### [RESUME_PLAN.md](./RESUME_PLAN.md) ⭐

**How to resume interrupted plans**

- After internet loss
- After IDE crash
- After taking breaks
- Status checks

---

## ⚡ Quick Reference

### Create

```
Create a deep work plan following .agent_commands/agent_deep_work_plans/GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md

Objective: [Your goal]
Context: [Tech, location, constraints]
Tasks: [List]
Plan name: PLAN_{name}
```

### Execute

```
Execute the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/README.md

Work on tasks in order. Run validations. Commit after each.
```

### Resume ⭐

```
RESUME the plan at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/README.md

Check task list. Continue from first [ ] task. Review git log.
```

---

## 📚 Reference Examples

### [PLAN_EXAMPLE_add_blog_feature/](./PLAN_EXAMPLE_add_blog_feature/) ⭐

**Complete example of a final plan** - Full reference implementation with 6 tasks

This example shows:

- ✅ Complete plan structure with README.md and task files
- ✅ Professional task breakdown and execution workflow
- ✅ PROMPTS.md with ready-to-use prompts
- ✅ PROGRESS.md for running progress tracking
- ✅ analysis_results/ folder for reports
- ✅ Mandatory Skills & Agents Discovery and Executive Report tasks
- ✅ Real-world example (adding related posts to an Astro blog)

**Use this as reference when:**

- Creating your first plan
- Understanding plan structure and organization
- Seeing how tasks are detailed and executed
- Learning best practices for plan documentation
- Understanding mandatory final tasks

### [drafts_examples/](./drafts_examples/) ⭐

**Draft prompt examples** - Before and after refinement

Contains:

- **[DRAFT_EXAMPLE_basic.md](./drafts_examples/DRAFT_EXAMPLE_basic.md)** - Basic draft (initial version)
- **[DRAFT_EXAMPLE_refined.md](./drafts_examples/DRAFT_EXAMPLE_refined.md)** - Refined draft (professional version)

**Use these as reference when:**

- Creating your first draft
- Understanding how to refine prompts
- Learning the difference between basic and refined drafts
- Seeing the draft lifecycle

---

## ✍️ Your Workspace

### [results/drafts/](../results/drafts/) - Personal Draft Area

**Git-ignored workspace for drafting prompts before using them**

Use this folder to:

- ✅ Draft and refine prompts before passing to agents
- ✅ Test different prompt variations
- ✅ Store project-specific prompts
- ✅ Keep work-in-progress organized

**Quick start:**

```bash
# Create a draft
touch .agent_commands/agent_deep_work_plans/results/drafts/my_plan.md

# Edit and refine it
# When ready, copy and paste to your agent
```

See [../results/drafts/README.md](../results/drafts/README.md) for detailed usage instructions.

---

**See the individual files above for detailed examples and scenarios.**
