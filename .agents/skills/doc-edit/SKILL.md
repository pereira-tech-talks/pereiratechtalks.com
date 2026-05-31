---
name: doc-edit
description: Update documentation files including README, comments, and inline docs. Use proactively for documentation updates.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep
model: haiku
# === Documentation (ignored by tools, useful for humans) ===
tier: 1
intent: docs
max-files: 10
max-loc: 200
---

# Skill: Doc Edit

## Objective

Update documentation files such as README, code comments, JSDoc, and markdown files. This skill handles documentation-only changes with no code logic modifications. Adapted for this Astro repo: follow docs/ and AGENTS.md; all content in English; supports MDX in blog posts.

**Scope includes:**
- `docs/*.md` - Project documentation
- `src/**/README.md` - Component/folder documentation  
- `src/content/blog/*.md` - Blog posts (Markdown)
- `src/content/blog/*.mdx` - Blog posts (MDX with components)
- Code comments in `.astro`, `.svelte`, `.ts` files

## Non-Goals

- Does NOT modify code logic
- Does NOT add new features
- Does NOT refactor code
- Does NOT change function signatures
- Does NOT update tests

## Tier Classification

**Tier: 1** - Light/Cheap

**Reasoning:** Documentation-only changes are low risk, don't affect runtime behavior, and follow clear patterns. No complex reasoning required.

## Inputs

### Required Parameters

- `$TASK`: Description of what documentation needs updating
- `$FILES`: File(s) to update (optional - will search if not provided)

### Optional Parameters

- `$STYLE`: Documentation style guide to follow (default: infer from existing; see docs/DOCUMENTATION_GUIDE.md)

## Prerequisites

Before running this skill, ensure:

- [ ] Documentation change is clearly defined
- [ ] No code logic changes are needed

## Steps

### Step 1: Understand the Request

- Read the documentation task
- Identify which files need updating (docs/, README, code comments)
- Note the documentation style used (see AGENTS.md, docs/)

### Step 2: Review Existing Documentation

- Read current documentation
- Note formatting patterns
- Identify style conventions

### Step 3: Make Updates

- Update documentation following existing style
- Keep formatting consistent
- Preserve voice and tone
- All content in English

### Step 4: Validate

- Check spelling and grammar
- Verify links work (if applicable)
- Run lint if touching code files with comments only:

```bash
pnpm run biome:check
```

## Output Format

### Success Output

```
## ✅ Documentation Updated

### Summary
{What was documented}

### Files Changed
- `{file1}`: {what changed}
- `{file2}`: {what changed}

### Commit Message
docs: {description}
```

## Guardrails

### Scope Limits

- **Maximum files:** 10
- **Maximum LOC:** 200 (documentation lines)
- **Allowed:** .md, .txt, comments in code files; docs/
- **Forbidden:** Modifying code logic

### Stop Conditions

**Stop immediately** if:

- Request involves code logic changes
- Documentation requires technical decisions
- Style guide is unclear and significant

## Definition of Done

- [ ] Documentation is accurate
- [ ] Formatting is consistent
- [ ] Spelling/grammar is correct
- [ ] No code logic was modified

## Escalation Conditions

**Escalate** if:

- Code changes are also needed
- Technical decisions required
- Major documentation restructuring needed

## Related

- [quick-fix](../quick-fix/SKILL.md) - For code fixes
- [reviewer](../../agents/reviewer.md) - For reviewing docs
