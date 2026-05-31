---
description: Refine a draft or modify an existing final plan
---

# Deep Work Plan Refiner

You are a deep work plan refiner that helps polish drafts or modify existing final plans.

## Your Task

Help the user refine drafts or modify existing final plans (add tasks, edit instructions, adjust context, etc.).

## Parameter Support

**This command accepts optional parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| (none) | Interactive mode - choose draft or plan | `/dwp-refine` |
| `{draft_filename}` | Refine specific draft | `/dwp-refine PLAN_x_draft.md` |
| `latest` | Refine most recent draft | `/dwp-refine latest` |
| `plan {plan_name}` | Modify existing final plan | `/dwp-refine plan auth_refactor` |
| `plan latest` | Modify most recent plan | `/dwp-refine plan latest` |

---

## Workflow

### Step 0: Determine Target Type

**Parse parameters to determine if working with draft or plan:**

```
/dwp-refine                      → Interactive: ask draft or plan
/dwp-refine latest               → Draft: most recent draft
/dwp-refine {filename}           → Draft: specific file
/dwp-refine plan latest          → Plan: most recent plan
/dwp-refine plan {name}          → Plan: specific plan
```

**If no parameters:** Go to Step 1 (Interactive Selection)
**If draft specified:** Go to Step 2 (Draft Workflow)
**If plan specified:** Go to Step 3 (Plan Workflow)

---

### Step 1: Interactive Selection

**Present menu:**
```
What would you like to refine?

1. 📝 A draft
   → Polish or convert to final plan

2. 📁 An existing final plan
   → Add tasks, modify instructions, adjust context

Enter option (1 or 2):
```

**If 1:** Go to Step 2 (Draft Workflow)
**If 2:** Go to Step 3 (Plan Workflow)

---

## Draft Workflow

### Step 2: Select and Refine Draft

#### 2.1 Select Draft

**If draft not specified via parameter:**

List all `.md` files in `.agent_commands/agent_deep_work_plans/results/drafts/` (excluding README.md)

```
Available drafts:

1. {latest_draft_name} ⭐ (most recent)
2. {draft2_name}
3. {draft3_name}
...

Which draft would you like to refine?

Enter option (number, filename, or "latest"):
```

#### 2.2 Read Draft Content

Read the draft file completely to understand:
- Objective
- Context
- Tasks
- Plan name
- Any existing structure

#### 2.3 Choose Action

```
What would you like to do with this draft?

1. Refine the draft
   → Improve and polish the prompt
   → Creates: {filename}_refined.md

2. Convert to final plan
   → Create executable plan structure
   → Creates: .../plans/PLAN_{name}/

3. Both
   → Refine first, then convert

Enter option (1-3):
```

#### 2.4 Execute

**Refine draft:**
1. Rewrite professionally following `.agent_commands/agent_deep_work_plans/example_prompts/CREATE_PLAN.md`
2. Expand and detail all sections
3. Save as `PLAN_{name}_draft_refined.md`

**Convert to plan:**
1. Extract plan info from draft
2. Create plan folder and all files following the guide
3. Auto-create mandatory elements: `analysis_results/`, `PROGRESS.md`, Skills & Agents Discovery task, Executive Report task (same rules as `/dwp-create` Step 4.4)
4. Offer to execute (like `/dwp-create` does)

---

## Plan Workflow

### Step 3: Select and Modify Final Plan

#### 3.1 Select Plan

**If plan not specified via parameter:**

List all folders in `.agent_commands/agent_deep_work_plans/results/plans/` starting with `PLAN_`

```
Available plans:

1. PLAN_{name1} ⭐ (most recent)
2. PLAN_{name2}
3. PLAN_{name3}
...

Which plan would you like to modify?

Enter option (number, plan name, or "latest"):
```

#### 3.2 Read Plan Content

Read the plan's `README.md` and task files to understand:
- Current objective
- Context and guidelines
- Existing tasks (and their status `[x]` vs `[ ]`)
- Task file contents

#### 3.3 Show Current State

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Plan: PLAN_{name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Objective: {objective}

Tasks:
{list of tasks with [x] or [ ] status}

Location: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/
```

#### 3.4 Choose Modification Type

```
What would you like to modify?

1. ➕ Add new task(s)
   → Insert new tasks at specific position

2. ✏️  Edit existing task
   → Modify instructions, criteria, or details

3. 🔄 Reorganize tasks
   → Reorder, split, or merge tasks

4. 📋 Update README
   → Modify objective, context, or guidelines

5. 🔍 View task details
   → See full content of a specific task

6. ✅ Done
   → Finish modifications

Enter option (1-6):
```

#### 3.5 Execute Modifications

**Option 1 - Add new task(s):**

> **IMPORTANT:** New tasks can only be inserted BEFORE the mandatory final tasks (Skills & Agents Discovery and Executive Report). These mandatory tasks always remain as the second-to-last and last tasks respectively.

```
Where should the new task(s) be inserted?

Current tasks:
1. {task_1_title}
2. {task_2_title}
3. {task_3_title}
...
{N-1}. Skills & Agents Discovery 🔒 (mandatory)
{N}. Executive Report 🔒 (mandatory)

Options:
- Enter a number (1-{N-2}) to insert BEFORE that task
- Enter "before-mandatory" to add just before the mandatory tasks

Position:
```

Then ask for task details:
```
Describe the new task:
- What should be accomplished?
- Any specific instructions or constraints?
```

Create task file with:
- Title
- Context (inherit from plan)
- Read Before Starting (optional)
- Goal
- Instructions (with re-anchoring)
- Acceptance Criteria
- Outputs (optional)
- Validation commands
- Rollback (optional)
- Execution Checklist
- Completion & Log section

**Renumber subsequent tasks if inserted in middle, including mandatory final tasks.**

Update README.md task list accordingly.

---

**Option 2 - Edit existing task:**

> **Note:** Mandatory tasks (Skills & Agents Discovery and Executive Report) CAN be edited to customize their content for the specific plan. They cannot be deleted or reordered.

```
Which task do you want to edit?

1. {task_1_title}
2. {task_2_title}
3. {task_3_title}
...
{N-1}. Skills & Agents Discovery 🔒
{N}. Executive Report 🔒

Enter task number:
```

Show current task content, then:
```
What would you like to change?

1. Title
2. Instructions
3. Acceptance criteria
4. Validation commands
5. Everything (show me the task, I'll tell you what to change)

Enter option (1-5):
```

Apply changes to task file.

---

**Option 3 - Reorganize tasks:**

> **IMPORTANT: Mandatory task protection rules:**
> - Skills & Agents Discovery task CANNOT be deleted or moved from second-to-last position
> - Executive Report task CANNOT be deleted or moved from last position
> - If user attempts to delete or move them, explain: "These are mandatory tasks. They can be edited but not deleted or reordered."

```
Reorganization options:

1. Move task to different position
2. Split a task into multiple tasks
3. Merge tasks together
4. Delete a task (⚠️ careful with completed tasks)

Enter option (1-4):
```

Handle each case appropriately, renumbering files as needed.
**When moving tasks:** Only user-defined tasks can be moved. Mandatory tasks stay in their positions.
**When deleting tasks:** Mandatory tasks cannot be deleted. Show error message if attempted.
**When splitting/merging:** New tasks must be inserted before mandatory tasks.

---

**Option 4 - Update README:**
```
What would you like to update in README?

1. Objective
2. Context
3. Global Guidelines
4. Execution Rules
5. Show current README and tell me what to change

Enter option (1-5):
```

Apply changes to README.md.

---

**Option 5 - View task details:**
```
Which task do you want to view?

1. {task_1_title}
2. {task_2_title}
...

Enter task number:
```

Display full task file content.

---

**Option 6 - Done:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Plan modifications complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Plan: PLAN_{name}
Tasks: {N} total ({completed} completed, {pending} pending)

{If tasks were added/modified:}
Modified:
• Added task {N}: {title}
• Updated task {M}: {title}

Ready to continue execution?
1. 🚀 Yes, execute/resume now
2. ✅ No, I'm done for now

Enter option (1-2):
```

---

## Important Notes

- **Preserve completed work:** When modifying plans, never alter `[x]` completed tasks unless explicitly requested
- **Protect mandatory tasks:** Skills & Agents Discovery and Executive Report cannot be deleted or reordered. They can be edited.
- **Renumber carefully:** When adding/removing tasks, update all task file numbers and README references (including mandatory tasks)
- **Draft-to-plan conversion:** Always includes auto-creation of `analysis_results/`, `PROGRESS.md`, and both mandatory final tasks
- **Maintain consistency:** Ensure task files follow the standard format (including new optional sections)
- **Git ignore:** Files in `drafts/` and `plans/` are git-ignored (except README.md and .gitkeep)
- **Backup suggestion:** For major changes, consider creating a copy first

---

## Error Handling

**Draft/Plan not found:**
- Show available options
- Let user select from list

**Task number out of range:**
- Show valid range
- Ask again

**Trying to delete completed task:**
```
⚠️  Task {N} is marked as completed [x].

Are you sure you want to delete it?
1. Yes, delete anyway
2. No, cancel

Enter option (1-2):
```

**Plan has tasks in progress:**
- Warn user about potential impact
- Suggest completing current task first
