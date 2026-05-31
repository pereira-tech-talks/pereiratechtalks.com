# Agent Commands

## Overview

This directory contains **specialized command systems** that provide structured instructions for AI agents (Cursor AI, Claude Code, OpenAI Codex) to execute complex, multi-step tasks autonomously.

Each subdirectory in `.agent_commands/` represents a different **agent command system**, each designed for a specific type of task or workflow.

---

## Purpose

These command systems enable AI agents to:

- **Work autonomously** on complex, multi-step tasks
- **Follow structured workflows** with clear instructions and validation
- **Maintain consistency** across different agent sessions
- **Provide audit trails** of work completed
- **Resume interrupted work** without duplicating completed steps

---

## Available Agent Command Systems

### 1. Agent Skills Generator

**Location:** `agent_skills_generator/`

**Purpose:** System for creating reusable **Skills** and **Agents** that help AI assistants work more effectively with cost-efficient model selection.

**What Are Skills and Agents?**

- **Skills**: Reusable "how-to" procedures invoked via slash commands (e.g., `/quick-fix`, `/doc-edit`)
- **Agents**: Specialized worker personas for specific tasks (e.g., `reviewer`, `executor`, `architect`)

**3-Tier Model Strategy:**

| Tier  | Name     | Use Case                        | Model      |
| ----- | -------- | ------------------------------- | ---------- |
| **1** | Light    | Simple fixes, formatting, docs  | Cheap/Fast |
| **2** | Standard | Features, tests, safe refactors | Standard   |
| **3** | Heavy    | Architecture, planning, complex | Frontier   |

**Quick Start:**

```bash
/skill-create         # Create a new skill (guided)
/skill-list           # List available skills
/agent-create         # Create a new agent (guided)
/agent-list           # List available agents
```

**Key Files:**

- `agent_skills_generator/README.md` - Overview
- `agent_skills_generator/GUIDE_TO_CREATE_SKILLS_AND_AGENTS.md` - Complete guide
- `agent_skills_generator/MASTER_PROMPT.md` - Generation prompt
- `agent_skills_generator/MODEL_ROUTING.md` - Tier routing rules

**Output Locations:**

- Skills: `.agents/skills/{skill-name}/SKILL.md`
- Agents: `.agents/agents/{agent-name}.md`
- Catalog: `.agents/docs/skills_agents_catalog.md`

---

### 2. Agent Deep Work Plans

**Location:** `agent_deep_work_plans/`

**Purpose:** System for creating and executing long-duration, multi-task deep-work plans that enable agents to work autonomously for extended periods (hours, overnight sessions).

**Use Cases:**

- Large refactoring projects
- Multi-component feature development
- Documentation reorganization
- UI expansion projects
- Complex testing implementations

**Key Features:**

- Single-task focus (one task at a time)
- Strict execution order
- Built-in validation at each step
- Completion logs and audit trails
- Resume capability for interrupted work

**Quick Start:**

- See `agent_deep_work_plans/README.md` for overview
- See `agent_deep_work_plans/example_prompts/` for copy-paste ready prompts
- See `agent_deep_work_plans/GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md` for comprehensive guide

---

### 3. Agent Library Upgrades

**Location:** `agent_library_upgrades/`

**Purpose:** System for safely upgrading all project dependencies (npm packages) with validation, testing, and rollback capabilities.

**Use Cases:**

- Regular dependency maintenance
- Security patch updates
- Targeted package upgrades
- Major version migrations (with approval)

**Key Features:**

- Automatic discovery of available updates (`ncu` / `npm-check-updates`)
- Smart prioritization (minor upgrades first, major with approval)
- Automatic rollback on failures
- Retry logic with failure isolation (max 3 attempts)
- Comprehensive reporting (success and failure)
- Pre and post-upgrade validation

**Quick Start:**

- See `agent_library_upgrades/README.md` for overview
- See `agent_library_upgrades/example_prompts/` for copy-paste ready prompts
- See `agent_library_upgrades/GUIDE.md` for comprehensive execution guide

---

## Structure

```
.agent_commands/
├── README.md                          ← you are here
├── agent_skills_generator/            ← Skills & Agents creation system
│   ├── README.md
│   ├── GUIDE_TO_CREATE_SKILLS_AND_AGENTS.md
│   ├── MASTER_PROMPT.md
│   ├── MODEL_ROUTING.md
│   ├── AUDIT_REPO_FIT.md
│   ├── example_prompts/
│   └── templates/
├── agent_deep_work_plans/             ← Deep work execution plans
│   ├── README.md
│   ├── GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md
│   ├── example_prompts/
│   └── results/
├── agent_library_upgrades/            ← Library upgrade system
│   ├── README.md
│   ├── GUIDE.md
│   ├── example_prompts/
│   └── templates/
└── [future_command_systems]/          ← Additional command systems
```

---

## Adding New Agent Command Systems

When creating a new agent command system:

1. **Create a new subdirectory** under `.agent_commands/` with a descriptive name (snake_case)
2. **Include a README.md** explaining:
   - Purpose and use cases
   - Quick start guide
   - Key features
   - Structure and conventions
3. **Follow project standards:**
   - All documentation in English
   - Clear, structured instructions
   - Validation steps
   - Examples and templates
4. **Update this README.md** to include the new system in the "Available Agent Command Systems" section
5. **Update agent documentation files** (`CLAUDE.md`, `AGENTS.md`) to reference the new system

---

## Integration with Project Standards

All agent command systems must follow project standards defined in:

- **`CLAUDE.md`** - Claude Code guidelines
- **`AGENTS.md`** - Main AI agent guidelines
- **`docs/STANDARDS.md`** - Canonical repository standards

Key requirements:

- ✅ **English only** - All instructions, logs, and documentation
- ✅ **Type hints** - All generated code should use TypeScript with type annotations where practical
- ✅ **Testing** - Testing not yet configured; validation uses build and lint checks
- ✅ **Documentation updates** - Update relevant docs after changes
- ✅ **Code quality** - Run `pnpm run biome:check` and `pnpm run astro:check`

---

## Best Practices

### When Using Agent Commands

- ✅ **Read the system's README first** to understand its purpose and workflow
- ✅ **Follow the structured instructions** exactly as documented
- ✅ **Run all validation steps** before marking tasks complete
- ✅ **Update logs and documentation** as you work
- ✅ **Commit after completing each major step**

### When Creating New Command Systems

- ✅ **Start with a clear purpose** - What specific problem does this solve?
- ✅ **Design for autonomy** - Agents should be able to execute without constant human intervention
- ✅ **Include validation** - Every step should have clear success criteria
- ✅ **Provide examples** - Include copy-paste ready prompts and templates
- ✅ **Document thoroughly** - Clear README, guides, and examples
- ✅ **Test the system** - Create a test run before documenting

---

## Quick Reference

### Agent Skills Generator

**Create a skill:**

```bash
/skill-create my-skill        # Guided mode
/skill-create my-skill trust  # Trust mode (auto)
```

**Create an agent:**

```bash
/agent-create my-agent        # Guided mode
/agent-create my-agent trust  # Trust mode (auto)
```

**List available:**

```bash
/skill-list                   # List all skills
/agent-list                   # List all agents
```

---

### Agent Deep Work Plans

**Create a plan:**

> "Create a new deep work plan for [objective] following the structure defined in `.agent_commands/agent_deep_work_plans/GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md`."

**Execute a plan:**

> "Execute the plan at `.agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_title}/README.md`."

**Resume a plan:**

> "RESUME the plan at `.agent_commands/agent_deep_work_plans/results/plans/PLAN_{plan_title}/README.md`."

### Agent Library Upgrades

**Upgrade all packages:**

> "Upgrade all project dependencies following `.agent_commands/agent_library_upgrades/GUIDE.md`. Prioritize minor upgrades first, ask about major upgrades, and generate a comprehensive report."

**Upgrade minor versions only:**

> "Upgrade only minor and patch versions of all packages following `.agent_commands/agent_library_upgrades/GUIDE.md`. Skip major upgrades."

**Upgrade specific packages:**

> "Upgrade the following packages: [package1, package2, ...] following `.agent_commands/agent_library_upgrades/GUIDE.md`."

---

## Related Documentation

- **[AI Agent Onboarding](docs/AI_AGENT_ONBOARDING.md)** - Environment setup and standards
- **[Repository Standards](docs/STANDARDS.md)** - Canonical rules for all agents
- **[AI Agent Collaboration](docs/AI_AGENT_COLLAB.md)** - Handoff and communication guidelines
- **[Development Commands](docs/DEVELOPMENT_COMMANDS.md)** - Command reference for agents

---

## Summary

The `.agent_commands/` directory provides structured, reusable command systems that enable AI agents to execute complex tasks autonomously while maintaining quality, consistency, and auditability.

Each command system is self-contained with its own documentation, examples, and workflows, making it easy for agents to understand and execute tasks without constant human guidance.
