# Audit: agent_skills_generator — Repository Fit

This document records how well the agent_skills_generator fits **this repository** (Pereira Tech Talks v3.0.0: Astro, Svelte, TypeScript, Tailwind CSS, Biome).

---

## What Fits This Repo

- **3-tier model (Tier 1/2/3)** — Aligns with cost-efficient model use; planning vs execution vs simple tasks.
- **Two-phase pattern (Plan Tier 3 → Execute Tier 2)** — Matches intent: heavy reasoning for planning, standard model for execution.
- **Output locations** — `.agents/skills/`, `.agents/agents/`, `.agents/docs/skills_agents_catalog.md` exist and are correct.
- **AGENTS.md** — MASTER_PROMPT and GUIDE already list AGENTS.md as a required/primary read.
- **Templates and structure** — SKILL_TEMPLATE, AGENT_TEMPLATE, CREATE_SKILL.md, CREATE_AGENT.md are generic and work for any repo.
- **GUIDE and MODEL_ROUTING** — No Python/repo-specific assumptions; tier definitions are language-agnostic.

---

## Repository Context

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Astro** | 5.16.15 | Static site generator |
| **Svelte** | 5.48.0 | Interactive components |
| **TypeScript** | 5.9.3 | Type-safe development |
| **Tailwind CSS** | 4.1.18 | Utility-first styling |
| **Biome** | 2.3.11 | Linting and formatting |
| **MDX** | 4.3.13 | Enhanced Markdown |

### Key Documentation

| Document | Purpose |
|----------|---------|
| `AGENTS.md` | Main AI agent guidance (primary read) |
| `docs/ARCHITECTURE.md` | Technical architecture |
| `docs/STANDARDS.md` | Coding conventions |
| `docs/PRODUCT_SPEC.md` | Product vision and features |
| `docs/DEVELOPMENT_COMMANDS.md` | npm scripts reference |

### Validation Commands

```bash
# Code quality (REQUIRED before commits)
pnpm run biome:check          # Lint and format check
pnpm run biome:fix            # Auto-fix issues
pnpm run astro:check          # TypeScript checking

# Build validation
pnpm run build                # Full production build
```

**Note:** Testing is NOT configured. `pnpm run test` is a placeholder.

---

## Context Sources: Current vs Recommended

| Source    | Currently recommended            | Recommended for this repo                                  |
| --------- | -------------------------------- | ---------------------------------------------------------- |
| AGENTS.md | Yes (required)                   | Yes — primary                                              |
| docs/     | Yes (key files)                  | Yes — PRODUCT_SPEC, ARCHITECTURE, STANDARDS                |
| .context/ | Yes (if exist) / implied primary | No — repo does not have it; make optional or remove        |

---

## Skills and Agents Alignment

### Existing Skills

| Skill | Repo Fit | Notes |
|-------|----------|-------|
| `quick-fix` | ✅ Good | Update validation commands |
| `doc-edit` | ✅ Good | Works as-is |
| `fix-lint` | ⚠️ Update | Change ESLint → Biome |
| `type-fix` | ✅ Good | Update validation commands |
| `write-tests` | ⚠️ Update | Testing not configured yet |
| `refactor-safe` | ✅ Good | Update validation commands |
| `security-check` | ⚠️ Update | Remove Lambda references |
| `pr-review-lite` | ✅ Good | Update checklist |
| `git-commit-push` | ✅ Good | Works as-is |

### Existing Agents

| Agent | Repo Fit | Notes |
|-------|----------|-------|
| `architect` | ✅ Good | Generic, works for Astro |
| `executor` | ✅ Good | Generic |
| `reviewer` | ✅ Good | Update validation commands |
| `security-auditor` | ⚠️ Update | Remove AWS references |

---

## Required Updates

### 1. Validation Commands

**Old (serverless):**
```bash
pnpm run test
pnpm run eslint:check
pnpm run prettier:check
```

**New (Astro):**
```bash
pnpm run biome:check
pnpm run astro:check
pnpm run build
```

### 2. Test Naming

**Old:** `*.spec.ts` (Mocha)
**New:** Testing not configured; when added, use `*.test.ts` or `*.spec.ts` (Vitest)

### 3. Logger References

**Old:** Use Logger from `src/common/logger.ts`
**New:** `console.*` is acceptable (no custom logger)

### 4. Path References

**Old:** `src/functions/`, `src/common/`, `test/`
**New:** `src/components/`, `src/pages/`, `src/lib/`, `src/content/`

---

## Summary

- **Fits:** Tier system, two-phase pattern, .agents/ output, AGENTS.md, generic templates
- **Updates needed:**
  - Change ESLint → Biome in skills
  - Update validation commands
  - Remove serverless/Lambda references
  - Note that testing is not configured
  - Update path examples to Astro structure
