# Team Agents Reference

Team agents are an experimental Claude Code feature that allows multiple Claude Code instances to work together in parallel with shared task lists and inter-agent messaging.

**Official documentation:** https://code.claude.com/docs/en/agent-teams

**Status:** Experimental (disabled by default)

**Applies to:** Claude Code only. Other AI agents (Cursor, Codex, Gemini) do not support this feature and should ignore all team agents configuration.

---

## 1. Decision Matrix

When to use each execution mode:

| Scenario | Approach | Why |
|----------|----------|-----|
| Sequential dependent tasks | Sequential | Tasks depend on each other |
| Quick focused sub-tasks | Subagents | Lower overhead, results return to caller |
| 3+ independent parallel tasks | Team Agents | Shared coordination, inter-agent messaging |
| Multi-repo feature work | Orchestrator | Each repo gets own DWP |
| Same-file edits | Sequential | Teammates would overwrite each other |
| Simple single-session tasks | Sequential | Team overhead exceeds benefit |
| Debugging competing hypotheses | Team Agents | Parallel investigation with debate |
| Code review (multiple lenses) | Team Agents | Security + performance + tests simultaneously |

---

## 2. Comparison Table

| Aspect | Sequential | Subagents | Team Agents | Orchestrator |
|--------|-----------|-----------|-------------|-------------|
| **Support** | All agents | Claude Code | Claude Code only | All agents |
| **Context** | Main session | Own window, results return | Own window, fully independent | Own DWP per repo |
| **Communication** | N/A | Report back to caller only | Message each other directly | Via shared artifacts |
| **Coordination** | Manual / plan order | Main agent manages all work | Shared task list, self-coordination | Parent DWP manages |
| **Token cost** | Lowest | Low-medium | High (each is full instance) | Varies |
| **Best for** | Dependent tasks | Focused research, quick helpers | Parallel independent work | Cross-repo work |
| **Setup** | None | None | Enable env var | DWP infrastructure |

---

## 3. Architecture

An agent team consists of four components:

| Component | Role |
|-----------|------|
| **Team Lead** | The main Claude Code session that creates the team, spawns teammates, and coordinates work |
| **Teammates** | Separate Claude Code instances that each work on assigned tasks independently |
| **Task List** | Shared list of work items that teammates claim and complete |
| **Mailbox** | Messaging system for communication between agents |

### Storage

- **Team config:** `~/.claude/teams/{team-name}/config.json`
- **Task list:** `~/.claude/tasks/{team-name}/`

The team config contains a `members` array with each teammate's name, agent ID, and agent type.

### Permissions

Teammates start with the lead's permission settings. After spawning, individual teammate modes can be changed, but per-teammate modes cannot be set at spawn time.

### Context

Each teammate has its own context window. When spawned, it loads:
- CLAUDE.md and project context (same as a regular session)
- MCP servers and skills
- The spawn prompt from the lead

The lead's conversation history does **NOT** carry over to teammates.

---

## 4. Configuration

### Enable Team Agents

Set the environment variable in `.agents/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### Display Modes

| Mode | Description | Requirements |
|------|-------------|-------------|
| **In-process** (default) | All teammates run inside main terminal. Use Shift+Down to cycle. | Any terminal |
| **Split panes** | Each teammate gets its own pane. | tmux or iTerm2 |

The default is `"auto"`: split panes if already inside tmux, in-process otherwise.

Override via settings:
```json
{
  "teammateMode": "in-process"
}
```

Or per-session:
```bash
claude --teammate-mode in-process
```

---

## 5. Working with Team Agents

### Starting a Team

Tell Claude in natural language:
```
Create an agent team with 3 teammates to work on tasks 2, 3, and 4 in parallel.
```

Or more specifically:
```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

### Specifying Plan Approval

For complex work, require teammates to plan before implementing:
```
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

### Talking to Teammates Directly

- **In-process mode:** Shift+Down to cycle, type to message. Enter to view session, Escape to interrupt. Ctrl+T for task list.
- **Split-pane mode:** Click into a teammate's pane.

### Assigning and Claiming Tasks

- **Lead assigns:** Tell the lead which task to give to which teammate
- **Self-claim:** Teammates pick up the next unassigned, unblocked task automatically

Task claiming uses file locking to prevent race conditions.

### Shutting Down Teammates

```
Ask the researcher teammate to shut down
```

The teammate can approve (exits gracefully) or reject (with explanation).

### Cleaning Up the Team

```
Clean up the team
```

Always use the lead to clean up. Shut down all teammates first.

---

## 6. Integration with DWP Plans

Team agents integrate with Deep Work Plans through the **progressive enhancement pattern**. All team agents additions are optional overlays.

### Progressive Enhancement Rules

1. **ADDITIVE ONLY** — Required information stays in standard sections
2. **AFTER standard sections** — Team agents metadata at END of files
3. **OPTIONAL** — Removing all team agents sections changes nothing
4. **SEQUENTIAL-COMPATIBLE** — All tasks work when executed one at a time
5. **Marked "(Claude Code Only)"** — Other agents skip these sections

### Plan README Format

Add at the end of plan README:

```markdown
## Team Agents Configuration (Claude Code Only)

> **Note:** This section is used by Claude Code team agents for parallel execution.
> Other AI agents should ignore this section and execute all tasks sequentially.

### Parallel Task Groups

| Group | Tasks | Teammates | Description |
|-------|-------|-----------|-------------|
| Sequential | 1-2 | Lead only | Setup |
| Parallel A | 3, 4, 5 | 3 teammates | Independent work |
| Sequential | 6 | Lead only | Integration |
| Sequential | 7, 8 | Lead only | Mandatory final tasks |

### Teammate Roles

| Role | Assigned Tasks | Model | Spawn Prompt |
|------|---------------|-------|-------------|
| {Role} | {N} | sonnet | "{context}" |
```

### Task File Format

Add at the end of task files:

```markdown
## Team Agents Metadata (Claude Code Only)

- **Parallel Group:** A
- **Teammate Role:** Security Reviewer
- **Can Run With:** Tasks 4, 5
- **Blocks:** Task 6
- **Files Owned:** src/auth/, tests/auth/
```

### Execution Flow

1. Lead reads plan README and detects "Team Agents Configuration" section
2. Asks user: team agents or sequential?
3. Sequential tasks execute normally (lead handles them)
4. At parallel group boundary: create team, spawn teammates, assign tasks
5. Teammates work independently, follow standard task execution rules
6. Lead waits for all parallel tasks to complete
7. Lead shuts down teammates, cleans up team
8. Continue with next group

**Fallback:** If team agents are unavailable → all tasks execute sequentially.

---

## 7. Best Practices

### Give Teammates Enough Context

Include task-specific details in spawn prompts. Teammates don't inherit the lead's conversation.

### Choose Appropriate Team Size

- **3-5 teammates** for most workflows
- **5-6 tasks per teammate** keeps everyone productive
- Token costs scale linearly with teammates
- Three focused teammates often outperform five scattered ones

### Size Tasks Appropriately

- **Too small:** Coordination overhead exceeds benefit
- **Too large:** Teammates work too long without check-ins
- **Just right:** Self-contained units with clear deliverables

### Avoid File Conflicts

Each teammate should own different files. Two teammates editing the same file leads to overwrites.

### Monitor and Steer

Check in on progress, redirect approaches that aren't working, synthesize findings. Don't let a team run unattended too long.

### Wait for Teammates to Finish

If the lead starts implementing itself instead of waiting:
```
Wait for your teammates to complete their tasks before proceeding
```

---

## 8. Troubleshooting

### Teammates Not Appearing

- In in-process mode, press Shift+Down to cycle through active teammates
- Check that the task was complex enough to warrant a team
- For split panes, verify tmux is installed: `which tmux`
- For iTerm2, verify `it2` CLI is installed and Python API enabled

### Too Many Permission Prompts

Pre-approve common operations in permission settings before spawning teammates.

### Teammates Stopping on Errors

Check their output using Shift+Down, then either give additional instructions or spawn a replacement.

### Lead Shuts Down Before Work is Done

Tell the lead to keep going or wait for teammates to finish.

### Orphaned tmux Sessions

```bash
tmux ls
tmux kill-session -t <session-name>
```

---

## 9. Limitations

- **No session resumption** with in-process teammates (`/resume` doesn't restore them)
- **Task status can lag** — teammates sometimes fail to mark tasks as completed
- **Shutdown can be slow** — teammates finish current request before stopping
- **One team per session** — clean up current team before starting new one
- **No nested teams** — teammates cannot spawn their own teams
- **Lead is fixed** — cannot promote a teammate to lead
- **Permissions set at spawn** — all teammates start with lead's permission mode
- **Split panes** require tmux or iTerm2 (not VS Code terminal, Windows Terminal, or Ghostty)

---

## 10. Hooks Integration

Use hooks to enforce rules:

- **`TeammateIdle`** — Runs when a teammate is about to go idle. Exit code 2 sends feedback and keeps the teammate working.
- **`TaskCompleted`** — Runs when a task is being marked complete. Exit code 2 prevents completion and sends feedback.

---

## Related Documentation

- [AGENTS.md](../../AGENTS.md) — Root agent instructions
- [DWP Guide](../../.agent_commands/agent_deep_work_plans/GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md) — Plan creation spec
- [Skills & Agents Catalog](../../.agents/docs/skills_agents_catalog.md) — Available skills and agents
- [Official Claude Code Team Agents Docs](https://code.claude.com/docs/en/agent-teams) — Authoritative API reference
