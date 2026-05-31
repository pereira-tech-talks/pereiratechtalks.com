# Example Prompts for Agent Library Upgrades

This directory contains **copy-paste ready prompts** for common library upgrade scenarios.

## Quick Index

- **[UPGRADE_ALL.md](./UPGRADE_ALL.md)** - Upgrade all available packages (recommended)
- **[UPGRADE_MINOR_ONLY.md](./UPGRADE_MINOR_ONLY.md)** - Upgrade only minor/patch versions
- **[UPGRADE_SPECIFIC.md](./UPGRADE_SPECIFIC.md)** - Upgrade specific packages

---

## Usage

Simply copy the prompt text and paste it into your AI agent (Cursor AI, Claude Code, or OpenAI Codex).

The agent will:

1. Follow the instructions in the prompt
2. Reference the comprehensive guide at `.agent_commands/agent_library_upgrades/GUIDE.md`
3. Execute the upgrade process step-by-step
4. Generate a comprehensive report

---

## Prompt Structure

Each prompt includes:

- **Clear objective** - What to accomplish
- **Reference to guide** - Where to find detailed instructions
- **Expected outcome** - What the final result should be
- **Validation steps** - How to verify success

---

## Customization

You can customize these prompts by:

- Adding specific package names
- Excluding certain packages
- Adding additional validation steps
- Requesting specific report formats

---

## Best Practices

1. **Always backup** before upgrading (commit current state)
2. **Review the upgrade plan** before execution
3. **Test after upgrades** (run `codecheck`)
4. **Review the report** before committing changes

---

## Getting Help

- **Comprehensive guide:** `../GUIDE.md` - Complete execution instructions
- **System overview:** `../README.md` - System overview and features
- **Agent commands:** `../../README.md` - Overview of all agent command systems
