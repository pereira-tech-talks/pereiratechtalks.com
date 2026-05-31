---
description: Create a deep work plan (unified flow: info → draft → refine → final)
---

# Deep Work Plan Creator - Unified Flow

You are a deep work plan creator that guides users through a smooth, unified workflow for creating complete execution plans.

## Philosophy

**The goal is a delightful, smooth experience.** The user provides information once, and the system handles all intermediate steps (draft creation, refinement, final plan generation) automatically.

## Parameter Reference

| Input | Classification | Mode | Behavior | Example |
|-------|---------------|------|----------|---------|
| (none) | — | guided | Ask for name, then ask questions | `/dwp-create` |
| `{short text}` | **name-only** | guided | Extract name, ask questions immediately | `/dwp-create improve error handling` |
| `{long text}` | **full-context** | guided | Infer name, proceed to draft directly | `/dwp-create Refactor auth to use JWT across all services. Currently using sessions...` |
| `trust` or `auto` | — | trust | Ask for name, then ask questions (no confirmations) | `/dwp-create trust` |
| `{short text} trust` | **name-only** | trust | Extract name, ask questions immediately (no confirmations) | `/dwp-create improve-error-handling trust` |
| `{long text} trust` | **full-context** | trust | Infer name, proceed to draft directly (no confirmations) | `/dwp-create Refactor auth to use JWT... trust` |
| `draft {name}` | — | draft-only | Draft only (legacy support) | `/dwp-create draft my_plan` |
| `from-draft {file}` | — | from-draft | From existing draft | `/dwp-create from-draft PLAN_x_draft.md` |
| `from {file}` | — | from-draft | Alias for from-draft | `/dwp-create from PLAN_x_draft.md` |

> **Name format:** Users can type names in any format (spaces, hyphens, camelCase, etc.). The agent auto-converts to `snake_case` internally.

## Modes

### 🎯 Guided Mode (default)
- Collects information from user
- Creates draft → refined draft → shows for review
- Asks confirmation before creating final plan
- User can request adjustments before final generation

### 🚀 Trust Mode (`trust` or `auto`)
- Collects information from user
- Creates draft → refined draft → final plan automatically
- No intermediate confirmations
- Perfect when user trusts the process

## Unified Workflow

### Step 0: Parse Parameters & Determine Mode

**Parse the command in this order:**

**0.1 Detect trust mode:**
- If the LAST word is `trust` or `auto`, remove it and set `trust_mode = true`
- Otherwise `trust_mode = false`

**0.2 Detect special modes (check FIRST word):**
- If first word is `draft` → `mode = "draft-only"`, remaining text = plan name
- If first word is `from-draft` or `from` → `mode = "from-draft"`, remaining text = file path
- Otherwise → continue to input classification (0.3)

**0.3 Classify remaining input:**

| Condition | Classification | What to do |
|-----------|---------------|------------|
| No remaining text | **no input** | Go to Step 1, then Step 2 (ask for name + all info) |
| ≤10 words AND no complete sentences AND no line breaks | **name-only** | Convert to snake_case → plan name. Go to Step 1, then Step 2 (skip name question, ask all other info) |
| >10 words OR contains detailed sentences (periods ending declarative statements) OR has line breaks | **full-context** | Infer plan name from first meaningful words → snake_case. Go to Step 1, then Step 3 (skip questions, use provided context as input) |

**Name auto-conversion to snake_case:**
- Lowercase everything
- Replace hyphens and spaces with underscores
- Remove special characters (keep only `a-z`, `0-9`, `_`)
- Examples: `improve Feature X` → `improve_feature_x`, `add-stripe-payments` → `add_stripe_payments`, `RefactorAuth` → `refactorauth`

> **⚠️ CRITICAL: When input is classified as name-only, NEVER explore the codebase, read project files, or research the topic before asking the user questions. The name only tells you what to CALL the plan — it does NOT tell you what to DO. Go DIRECTLY to Step 2 to ask the user what they want to achieve.**

**For `from-draft` mode:**
- Skip to Step 4.3 (Create from existing draft)
- Validate draft file exists
- Extract info and create final plan directly

**For `draft-only` mode:**
- Proceed with information gathering
- Create only draft + refined draft
- Skip final plan creation

**For `no input` or `name-only`:**
- Continue to Step 1, then Step 2 (Gather Information via questions)

**For `full-context`:**
- Continue to Step 1, then skip directly to Step 3 (Create Draft from provided context)

---

### Step 1: Quick Introduction

**Show brief intro based on mode:**

**Guided mode:**
```
🎯 Deep Work Plan Creator

I'll help you create a complete execution plan. Here's what will happen:
1. You provide the information (objective, context, tasks)
2. I create a draft and refine it automatically
3. You review the refined plan
4. If approved, I generate the final executable plan

Let's start!
```

**Trust mode:**
```
🚀 Deep Work Plan Creator (Trust Mode)

I'll create a complete execution plan without intermediate confirmations.
You provide the info, I handle everything else.

Let's start!
```

---

### Step 2: Gather Information (Conversational)

> **Skip this entire step if input was classified as `full-context` in Step 0.** The user already provided everything — go directly to Step 3 using their input as the context.

**Collect information naturally. Ask these questions:**

**2.1 Plan name (if not provided via parameter or name-only input):**
```
What should this plan be called?
(e.g., "refactor auth", "add stripe payments" — any format works, I'll handle the rest)
```
- Auto-convert any format to snake_case (lowercase, underscores)
- Add `PLAN_` prefix internally if missing
- **Skip this question if name was already extracted from the input**

**2.2 Objective:**
```
What's the goal of this plan?
(One or two sentences describing what you want to achieve)
```

**2.3 Context:**
```
Tell me about the context:
- Where will the changes be? (folders/files)
- Any important constraints or rules?
- Tech stack specifics? (optional)
```
- Accept free-form response
- Extract: location, constraints, tech notes

**2.4 Tasks:**
```
What are the main tasks? (List them, one per line)
```
- Validate: At least 2 tasks
- If only 1 task, suggest breaking it down

**2.5 Guidelines (optional):**
```
Any specific guidelines? (branch format, commit format, coverage target, etc.)
Press Enter to skip and use defaults.
```

---

### Step 3: Create Draft & Refine (Automatic)

**Show progress:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Creating your plan...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/3] Creating draft...
```

**3.1 Create Draft:**
- Create file: `.agent_commands/agent_deep_work_plans/results/drafts/PLAN_{name}_draft.md`
- Include: objective, context, tasks, guidelines
- Format as a well-structured prompt

**Show progress:**
```
[1/3] Creating draft... ✓
[2/3] Refining draft...
```

**3.2 Refine Draft:**
- Read the draft
- Rewrite professionally following `.agent_commands/agent_deep_work_plans/example_prompts/CREATE_PLAN.md`
- Expand all sections with complete details
- Ensure clarity and completeness
- Create: `.agent_commands/agent_deep_work_plans/results/drafts/PLAN_{name}_draft_refined.md`

**3.3 Analyze Tasks for Parallelism (Automatic — Every Plan):**

After refining the draft, **always** evaluate the user-defined tasks for parallel execution opportunities:

- Are there 2+ tasks that work on different files, modules, or areas?
- Are there tasks with no data dependencies between them?
- Would parallel execution meaningfully reduce total execution time?

**Auto-assignment rules:**
- **Parallel groups:** Group tasks that touch different files/modules/areas with no dependencies
- **Teammate roles:** Derive from task content (e.g., "Security Reviewer", "API Developer")
- **Teammate model:** Default to sonnet
- **Sequential tasks:** Setup tasks, integration tasks, tasks depending on previous outputs, and mandatory final tasks (Skills Discovery, Executive Report) are ALWAYS sequential

**If parallelizable tasks detected:**

In guided mode — inform the user (no confirmation needed):
```
I detected {N} tasks that can run in parallel across {M} groups.
Adding team agents configuration for Claude Code parallel execution.
(Other AI agents will execute all tasks sequentially — fully backward compatible)

Parallel groups:
- Sequential: Tasks 1-2 (setup)
- Parallel A: Tasks 3, 4, 5 (independent work)
- Sequential: Tasks 6-7 (integration + report)
```

In trust mode — silent, no output. Add configuration without messaging.

**If NO parallelizable tasks detected:**
- Do not add team agents configuration
- Do not mention team agents to the user
- Plan proceeds as a standard sequential plan

**Show progress:**
```
[1/3] Creating draft... ✓
[2/3] Refining draft... ✓
[3/3] Preparing for review...
```

---

### Step 4: Review & Create Final Plan

**Behavior depends on mode:**

#### 4.1 Guided Mode - Show for Review

**Present the refined plan for review:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Plan Ready for Review: PLAN_{name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Objective: {objective}

Tasks ({count}):
{numbered list of tasks}

Location: {location}
Constraints: {constraints}

Full refined plan saved to:
→ .agent_commands/agent_deep_work_plans/results/drafts/PLAN_{name}_draft_refined.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do?

1. ✅ Looks good, create the final plan
2. 📝 I want to make adjustments (tell me what to change)
3. 👀 Show me the full refined draft
4. ⏸️  Stop here, I'll review later

Enter option (1-4):
```

**Handle response:**
- **Option 1:** Proceed to Step 4.4 (Create Final Plan)
- **Option 2:** Ask what to adjust, update refined draft, show again
- **Option 3:** Display full content of refined draft, then show menu again
- **Option 4:** Stop with completion message for draft phase

**If user requests adjustments (Option 2):**
```
What would you like to adjust?
```
- Apply changes to the refined draft
- Save updated version
- Return to review menu

#### 4.2 Trust Mode - Automatic Continue

**Skip review, go directly to Step 4.4 (Create Final Plan)**

**Show progress:**
```
[1/3] Creating draft... ✓
[2/3] Refining draft... ✓
[3/3] Creating final plan...
```

#### 4.3 From-Draft Mode

**Validate and load existing draft:**
- Check file exists in `.agent_commands/agent_deep_work_plans/results/drafts/`
- If not found, show available drafts and ask user to select
- Read draft content
- Extract: plan name, objective, context, tasks, guidelines
- Skip to Step 4.4 (Create Final Plan)

#### 4.4 Create Final Plan

**Create complete plan structure:**

1. **Create folder:** `.agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/`

2. **Follow the guide:** `.agent_commands/agent_deep_work_plans/GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md`

3. **Create core files:**

   **README.md:**
   - Goal
   - Context
   - Plan Variables (optional)
   - Global Guidelines
   - Task List with `[ ]` checkboxes and links to task files (including mandatory final tasks)
   - Note: `> **Mandatory final tasks:** Every plan includes Skills & Agents Discovery (second-to-last) and Executive Report (last).`
   - Execution Rules for the Agent (including PROGRESS.md update step)
   - Skills & Agents Used in This Plan
   - Plan Status / Notes
   - Analysis Outputs section
   - Quick Reference to PROMPTS.md

   **PROMPTS.md:**
   - Use template from `.agent_commands/agent_deep_work_plans/results/plans/PROMPTS_TEMPLATE.md`
   - Replace `{PLAN_NAME}` with actual plan name

   **User task files (N.task_{task_title}.md):**
   - One file per user-defined task
   - Include: Title, Context, Read Before Starting (optional), Goal, Instructions (with re-anchoring), Acceptance Criteria, Outputs (optional), Validation commands, Rollback (optional), Execution Checklist, Completion & Log section

4. **Create mandatory elements (AUTO-GENERATED):**

   **4a. Create `analysis_results/` folder:**
   - Create `analysis_results/` inside the plan directory
   - Add `.gitkeep` to make the folder visible

   **4b. Create `PROGRESS.md`:**
   ```markdown
   # Plan Progress: {Plan Title}

   > This file is updated after each task completion to maintain a running summary.

   ## Task Summaries
   <!-- Updated after each task -->

   ## Key Decisions
   <!-- Running list of significant decisions -->

   ## Important Values & Paths
   <!-- Running list of key values established during execution -->
   ```

   **4c. Auto-add Skills & Agents Discovery task** as the second-to-last task (`{N-1}.task_skills_agents_discovery.md`):

   ```markdown
   # Task {N-1}: Skills & Agents Discovery

   ## 1. Context

   **Purpose:** This is a mandatory task in every Deep Work Plan. It evaluates whether the work completed during this plan has created new patterns, components, workflows, or architectural structures that would benefit from becoming reusable Skills or Agents. It also evaluates whether existing skills/agents need updates and whether the skills generator system itself needs improvements.

   **Why this matters:**
   - New patterns created during plans are prime candidates for reusable recipes
   - Existing skills/agents may need updates to reflect changes made during the plan
   - The skills generator system itself may benefit from improvements
   - This creates a virtuous cycle: plans → skills → better plans → better skills

   **Where:**
   - Skills catalog: `.agents/docs/skills_agents_catalog.md`
   - Skills directory: `.agents/skills/{skill-name}/SKILL.md`
   - Agents directory: `.agents/agents/{agent-name}.md`
   - Skills generator: `.agent_commands/agent_skills_generator/`

   **Dependencies:** ALL previous user-defined tasks must be completed.

   ## 2. Goal

   Evaluate all work completed during this plan and: (1) determine if new Skills or Agents should be created, (2) determine if existing Skills or Agents need updates, (3) evaluate if the skills generator system needs improvements. If changes are warranted, implement them. "No changes needed" is a valid outcome.

   ## 3. Instructions

   > **Before starting:** Re-read the plan README section 1 (Goal) to ensure this task's work aligns with the overall objective.

   ### Step 1: Review all completed tasks
   Read every completed task's Completion & Log. Note new patterns, structures, components, procedures, and validation expertise.

   ### Step 2: Check existing catalog
   Read `.agents/docs/skills_agents_catalog.md` to understand what already exists.

   ### Step 3: Evaluate for NEW skills/agents

   **Create a SKILL when:** A new repeatable, specific procedure was established that will be needed again.
   **Create an AGENT when:** New specialized validation/review expertise was needed that applies to future work.
   **Do NOT create when:** Work is one-off, existing skills cover it, pattern is too generic, or too project-specific.

   | Pattern | Repeatable? | Existing Coverage? | Candidate? | Type | Rationale |
   |---------|:-----------:|:------------------:|:----------:|:----:|-----------|
   | {pattern} | Yes/No | Yes ({name}) / No | Yes/No | Skill/Agent/— | {why} |

   ### Step 4: Evaluate EXISTING skills/agents for updates

   | Skill/Agent | Update Needed? | What Changed | Proposed Update |
   |-------------|:--------------:|-------------|-----------------|
   | {name} | Yes/No | {what the plan changed} | {specific update} |

   ### Step 5: Evaluate skills generator system

   Read `.agent_commands/agent_skills_generator/GUIDE_TO_CREATE_SKILLS_AND_AGENTS.md` and templates. Assess:

   | Aspect | Improvement Needed? | Proposed Change |
   |--------|:-------------------:|-----------------|
   | GUIDE content | Yes/No | {describe} |
   | Skill template | Yes/No | {describe} |
   | Agent template | Yes/No | {describe} |
   | Catalog format | Yes/No | {describe} |

   ### Step 6: Implement changes
   - Create new skills using `.agent_commands/agent_skills_generator/templates/SKILL_TEMPLATE.md`
   - Create new agents using `.agent_commands/agent_skills_generator/templates/AGENT_TEMPLATE.md`
   - Update existing skills/agents (add to Changelog section)
   - Apply generator improvements if identified
   - Update catalog for all changes

   ### Step 7: Handle "no changes needed"
   If nothing warrants changes, document the evaluation results and move on.

   ## 4. Acceptance Criteria

   - [ ] All completed tasks reviewed
   - [ ] Existing catalog checked
   - [ ] New pattern evaluation completed
   - [ ] Existing skills/agents evaluated for updates
   - [ ] Skills generator system evaluated
   - [ ] Changes implemented (or "no changes needed" documented)
   - [ ] Catalog updated if any changes made

   ## 5. Validation

   Verify: evaluation tables are filled, any new files follow templates, catalog is consistent.

   ## 6. Execution Checklist

   - [ ] Read all completed task Completion & Logs
   - [ ] Read existing catalog
   - [ ] Evaluate new patterns
   - [ ] Evaluate existing skills/agents for updates
   - [ ] Evaluate skills generator system
   - [ ] Implement changes (or document "no changes needed")
   - [ ] Update catalog
   - [ ] Update plan README [x]
   - [ ] Update PROGRESS.md
   - [ ] Commit
   - [ ] Update log below

   ## 7. Completion & Log

   **Status:** Not started

   - Patterns evaluated:
   - New skills created: (or "None needed")
   - New agents created: (or "None needed")
   - Existing skills updated: (or "None needed")
   - Existing agents updated: (or "None needed")
   - Generator improvements: (or "None needed")
   - Catalog updated: Yes/No
   ```

   **4d. Auto-add Executive Report task** as the last task (`{N}.task_executive_report.md`):

   ```markdown
   # Task {N}: Executive Report

   ## 1. Context

   **Purpose:** This is the mandatory final task of every Deep Work Plan. It generates a comprehensive Executive Report summarizing everything accomplished, written for cross-functional consumption (Product, Engineering, QA, Stakeholders).

   **Where:**
   - Output: `analysis_results/EXECUTIVE_REPORT.md`
   - Input: All completed tasks' Completion & Log sections

   **Dependencies:** ALL previous tasks must be completed.

   ## 2. Goal

   Generate `analysis_results/EXECUTIVE_REPORT.md` — a comprehensive, multi-audience report.

   ## 3. Instructions

   > **Before starting:** Re-read the plan README section 1 (Goal).

   ### Step 1: Gather information from all completed tasks
   Read every Completion & Log. Extract: what was done, files changed, decisions made, validation results, blockers.

   ### Step 2: Gather additional context
   Read plan README. Review `git log` for commits. Check `analysis_results/` for other reports. Check `PROGRESS.md` for running summary.

   ### Step 3: Write the Executive Report

   Create `analysis_results/EXECUTIVE_REPORT.md` with this structure:

   # Executive Report: {Plan Title}

   **Plan:** `PLAN_{name}`
   **Date:** {date}
   **Tasks Completed:** {completed}/{total}
   **Status:** {Completed | Partially Completed}

   ## 1. Executive Summary
   {2-3 paragraphs, no jargon, focus on "so what"}

   ## 2. Product Impact
   ### Changes Delivered
   ### Business Value

   ## 3. Technical Details
   ### Implementation Summary
   ### Code Quality & Testing
   ### Files Changed
   ### Key Decisions & Trade-offs

   ## 4. QA Verification Guide
   ### How to Verify Changes
   ### Known Limitations & Edge Cases

   ## 5. FAQs (if non-obvious)

   ## 6. Next Steps & Recommendations
   ### Immediate Follow-ups
   ### Future Considerations

   ### Step 4: Adapt based on plan type
   - **Code plans:** All sections fully detailed
   - **Research/docs plans:** Lighter QA, adapt to "verify quality/accuracy"
   - **Refactoring plans:** Heavy technical, lighter product impact

   ### Step 5: Review
   Re-read from PM, QA, and developer perspectives. No section should be empty.

   ## 4. Acceptance Criteria

   - [ ] `analysis_results/EXECUTIVE_REPORT.md` created
   - [ ] All sections present and filled
   - [ ] Readable by non-technical stakeholders
   - [ ] QA section has actionable steps
   - [ ] Synthesizes ALL completed tasks

   ## 5. Validation

   Verify: file exists, all H2 sections present, QA has steps, next steps has items.

   ## 6. Execution Checklist

   - [ ] Read all Completion & Logs
   - [ ] Read plan README
   - [ ] Review git log
   - [ ] Write EXECUTIVE_REPORT.md
   - [ ] Review from all perspectives
   - [ ] Update plan README [x]
   - [ ] Update PROGRESS.md
   - [ ] Commit
   - [ ] Update log below

   ## 7. Completion & Log

   **Status:** Not started

   - Files created: analysis_results/EXECUTIVE_REPORT.md
   - Tasks synthesized:
   - Report sections completed:
   ```

   **4e. Update plan README task list** to include both mandatory tasks with `[ ]` checkboxes

   **4f. Update plan README "Analysis Outputs" section** to reference EXECUTIVE_REPORT.md

   > **Note:** If `.agent_commands/agent_skills_generator/` does NOT exist in the target repo, create a simplified Skills & Agents Discovery task that only evaluates and documents (no creation step).

5. **Add Team Agents Configuration (if parallelizable tasks detected in Step 3.3):**

   **In plan README** — append after all standard sections:

   ```markdown
   ## Team Agents Configuration (Claude Code Only)

   > **Note:** This section is used by Claude Code team agents for parallel execution.
   > Other AI agents should ignore this section and execute all tasks sequentially.

   ### Parallel Task Groups

   | Group | Tasks | Teammates | Description |
   |-------|-------|-----------|-------------|
   | Sequential | {N} | Lead only | {description} |
   | Parallel A | {N, M, P} | {count} teammates | {description} |
   | Sequential | {N} | Lead only | {description} |

   ### Teammate Roles

   | Role | Assigned Tasks | Model | Spawn Prompt |
   |------|---------------|-------|-------------|
   | {Role} | {N} | sonnet | "{context-specific prompt}" |
   ```

   **In parallel task files** — append after Completion & Log:

   ```markdown
   ## Team Agents Metadata (Claude Code Only)

   - **Parallel Group:** {A/B/C...}
   - **Teammate Role:** {role name}
   - **Can Run With:** Tasks {list}
   - **Blocks:** Task {N}
   - **Files Owned:** {paths}
   ```

   **If NO parallelizable tasks detected:** skip this step entirely. Do not add any team agents sections.

   See: `.agent_commands/agent_deep_work_plans/GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md` section 12 for full specification.

6. **Ensure quality:**
   - Tasks are atomic (one clear objective per task)
   - Tasks are ordered (numbered 1, 2, 3... N-1, N)
   - User tasks come first, then Skills & Agents Discovery, then Executive Report
   - Tasks are detailed enough for independent execution
   - Total task count = user tasks + 2 mandatory tasks
   - Team agents config (if present) follows progressive enhancement rules

---

### Step 5: Completion & Execute Option

**Show success message and offer to execute:**

**For full plan (guided or trust mode):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Plan Created Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Plan: PLAN_{name}
📄 Tasks: {N} tasks ready for execution

Location: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do?

1. 🚀 Execute the plan now
2. 👀 Review the plan first (show README)
3. ✅ Done for now (I'll execute later)

Enter option (1-3):
```

**Handle response:**

- **Option 1 (Execute now):**
  - Proceed to Step 6 (Execute Plan)
  - Follow the execution workflow from `dwp-execute.md`

- **Option 2 (Review first):**
  - Show the plan's README.md content
  - Then ask again:
    ```
    Ready to execute?
    
    1. 🚀 Yes, execute now
    2. ✅ No, I'll execute later
    
    Enter option (1-2):
    ```
  - If 1: Proceed to Step 6 (Execute Plan)
  - If 2: Show completion message and end

- **Option 3 (Done for now):**
  - Show brief completion message:
    ```
    ✅ Plan ready at: .agent_commands/agent_deep_work_plans/results/plans/PLAN_{name}/
    
    When ready, run: /dwp-execute {name}
    ```

---

### Step 6: Execute Plan (Optional)

**If user chose to execute immediately:**

1. **Show transition:**
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🚀 Starting Execution: PLAN_{name}
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

2. **Follow the execution workflow from `dwp-execute.md`:**
   - Read the plan's README.md
   - Check current git status
   - Start with first `[ ]` task
   - Execute tasks sequentially
   - Run validations, commit after each task
   - Report progress

3. **The execution continues until:**
   - All tasks complete
   - Validation fails (waits for guidance)
   - User requests pause

---

**For draft-only mode:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Draft Created and Refined!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Draft files:
   • PLAN_{name}_draft.md (original)
   • PLAN_{name}_draft_refined.md (refined)

Location: .agent_commands/agent_deep_work_plans/results/drafts/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Next steps:
   • Review the refined draft
   • Run /dwp-create to create final plan from it
   • Or run /dwp-create from PLAN_{name}_draft_refined.md
```

**For stopped at review:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏸️  Draft Ready for Later Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Refined draft saved:
   .agent_commands/agent_deep_work_plans/results/drafts/PLAN_{name}_draft_refined.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 When ready:
   /dwp-create from PLAN_{name}_draft_refined.md
```

---

## Error Handling

**Plan name already exists:**
```
⚠️  A plan with name "{name}" already exists.

Options:
1. Use a different name
2. Overwrite existing plan
3. Cancel

Enter option (1-3):
```

**Plan name auto-conversion notice (informational, not an error):**
```
📝 Plan name converted: "{original_input}" → "{snake_case_name}"
```
- This is shown when the name was auto-converted (e.g., "Improve Feature X" → "improve_feature_x")
- No user action needed — just informational

**Draft file not found (for from-draft mode):**
```
⚠️  Draft not found: {filename}

Available drafts:
1. PLAN_x_draft_refined.md ⭐ (most recent)
2. PLAN_y_draft.md
3. PLAN_z_draft_refined.md

Enter option (number or filename):
```

**Insufficient tasks:**
```
⚠️  Please provide at least 2 tasks for a meaningful plan.

Your task: {single_task}

Can you break this down into smaller steps?
```

---

## Important Notes

- **Git ignore:** Files in `drafts/` and `plans/` are git-ignored (except README.md and .gitkeep)
- **Naming:** Plan names are auto-converted to snake_case (users can type in any format)
- **Tasks:** Each task should be atomic and independently completable
- **Validation:** Include validation commands in each task file
- **Reference:** Follow guide at `.agent_commands/agent_deep_work_plans/GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md`
- **Team agents:** Parallelism analysis is automatic. Configuration is added only when beneficial. See guide section 12.

## Plan Creation Acceleration with Team Agents (Claude Code Only)

> Other AI agents should ignore this section and create plans sequentially.

When creating complex plans, team agents can speed up plan creation itself:

**Phase 1 — Parallel Research (before drafting):**
When the plan involves multiple complex areas, spawn research teammates to investigate simultaneously (1 per area). Each returns structured findings. Lead synthesizes for the draft.

**Phase 2 — Parallel Task File Generation (after drafting):**
When generating 5+ user-defined task files, spawn teammates to write task files simultaneously (1 per 2-3 files). Lead creates README, PROMPTS, PROGRESS, mandatory tasks. Teammates write user-defined task files.

**Both phases:**
- **Fallback:** If team agents unavailable → execute sequentially (no impact on result)
- Transparent to the user — the plan output is identical regardless of method
- In trust mode: runs silently without progress messages

---

## Quick Examples

**1. Name-only input (any format — asks questions first):**
```
User: /dwp-create improve error handling

Agent: 📝 Plan name converted: "improve error handling" → "improve_error_handling"

       🎯 Deep Work Plan Creator

       What's the goal of this plan?

User: Better error handling across all Lambda functions

Agent: Tell me about the context...

User: [provides context and tasks]

Agent: Creating your plan...
       [1/3] Creating draft... ✓
       [2/3] Refining draft... ✓
       [3/3] Preparing for review...

       📋 Plan Ready for Review: PLAN_improve_error_handling
       [shows summary]
```

**2. Name-only + trust mode (hyphens — asks questions, no confirmations):**
```
User: /dwp-create improve-error-handling trust

Agent: 📝 Plan name converted: "improve-error-handling" → "improve_error_handling"

       🚀 Deep Work Plan Creator (Trust Mode)

       What's the goal of this plan?

User: Standardize error handling across all services

Agent: Tell me about the context...

User: [provides context and tasks]

Agent: Creating your plan...
       [1/3] Creating draft... ✓
       [2/3] Refining draft... ✓
       [3/3] Creating final plan... ✓

       ✅ Plan Created Successfully!
```

**3. Full-context input (proceeds directly, no questions):**
```
User: /dwp-create Refactor the authentication system to use JWT tokens across all services. Currently using session-based auth stored in Redis. Need to update the auth middleware, token generation, and all API endpoints that check permissions. Constraints: must be backward-compatible during migration.

Agent: 📝 Inferred plan name: "refactor_authentication_system"

       🎯 Deep Work Plan Creator

       Creating your plan from provided context...
       [1/3] Creating draft... ✓
       [2/3] Refining draft... ✓
       [3/3] Preparing for review...

       📋 Plan Ready for Review: PLAN_refactor_authentication_system
       [shows summary]
```

**4. Full-context + trust (proceeds directly, no confirmations):**
```
User: /dwp-create Refactor the authentication system to use JWT tokens across all services. Currently using session-based auth stored in Redis. Need to update auth middleware, token generation, and all API endpoints trust

Agent: 📝 Inferred plan name: "refactor_authentication_system"

       🚀 Deep Work Plan Creator (Trust Mode)

       Creating your plan from provided context...
       [1/3] Creating draft... ✓
       [2/3] Refining draft... ✓
       [3/3] Creating final plan... ✓

       ✅ Plan Created Successfully!
```

**5. No input (fully interactive):**
```
User: /dwp-create

Agent: 🎯 Deep Work Plan Creator

       What should this plan be called?
       (e.g., "refactor auth", "add stripe payments" — any format works, I'll handle the rest)

User: My Awesome Plan

Agent: 📝 Plan name converted: "My Awesome Plan" → "my_awesome_plan"

       What's the goal of this plan?

User: [provides goal, context, tasks through guided questions]
```

**6. Create now, execute later:**
```
User: /dwp-create my_plan trust

Agent: 🚀 Deep Work Plan Creator (Trust Mode)

       What's the goal of this plan?

User: [provides goal, context, tasks]

Agent: Creating your plan...
       [1/3] Creating draft... ✓
       [2/3] Refining draft... ✓
       [3/3] Creating final plan... ✓

       ✅ Plan Created Successfully!

       What would you like to do?
       1. 🚀 Execute the plan now
       2. 👀 Review the plan first
       3. ✅ Done for now

User: 3

Agent: ✅ Plan ready at: .../PLAN_my_plan/

       When ready, run: /dwp-execute my_plan
```
