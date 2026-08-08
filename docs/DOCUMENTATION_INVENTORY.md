# Documentation Inventory

Tracking documentation coverage for Pereira Tech Talks v3.0.0.

## Documentation Files

### Core Documentation

| File | Status | Last Updated | Description |
|------|--------|--------------|-------------|
| [AGENTS.md](../AGENTS.md) | ✅ Current | 2026-01 | Main AI agent guidance |
| [CLAUDE.md](../CLAUDE.md) | ✅ Current | 2026-01 | Claude Code wrapper |
| [README.md](../README.md) | ✅ Current | - | Project overview |

### docs/ Folder

| File | Status | Description |
|------|--------|-------------|
| [README.md](README.md) | ✅ Current | Documentation index |
| [PRODUCT_SPEC.md](PRODUCT_SPEC.md) | ✅ Current | Product vision and features |
| [ARCHITECTURE.md](ARCHITECTURE.md) | ✅ Current | Technical architecture |
| [STANDARDS.md](STANDARDS.md) | ✅ Current | Coding conventions |
| [DEVELOPMENT_COMMANDS.md](DEVELOPMENT_COMMANDS.md) | ✅ Current | npm scripts reference |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | ✅ Current | Testing setup (future) |
| [SECURITY.md](SECURITY.md) | ✅ Current | Security best practices |
| [PERFORMANCE.md](PERFORMANCE.md) | ✅ Current | Performance optimization |
| [I18N_GUIDE.md](I18N_GUIDE.md) | ✅ Current | Internationalization |
| [API_REFERENCE.md](API_REFERENCE.md) | ✅ Current | API endpoints |
| [AI_AGENT_ONBOARDING.md](AI_AGENT_ONBOARDING.md) | ✅ Current | Quick start for AI agents |
| [AI_AGENT_COLLAB.md](AI_AGENT_COLLAB.md) | ✅ Current | Multi-agent coordination |
| [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md) | ✅ Current | Documentation standards |
| [BRAND_GUIDE.md](BRAND_GUIDE.md) | ✅ Current | Color palette, typography, logo, visual identity |
| [DOCUMENTATION_INVENTORY.md](DOCUMENTATION_INVENTORY.md) | ✅ Current | This file |

### docs/features/ Folder

| File | Status | Description |
|------|--------|-------------|
| [README.md](features/README.md) | ✅ Current | Features index |
| [BLOG_SEARCH.md](features/BLOG_SEARCH.md) | ✅ Current | Client-side search functionality |
| [DARK_MODE.md](features/DARK_MODE.md) | ✅ Current | Theme toggle and persistence |
| [I18N.md](features/I18N.md) | ✅ Current | Multi-language support |
| [PAGINATION.md](features/PAGINATION.md) | ✅ Current | Blog post pagination |
| [PUBLIC_ASSETS.md](features/PUBLIC_ASSETS.md) | ✅ Current | Static assets structure |
| [RSS_FEED.md](features/RSS_FEED.md) | ✅ Current | RSS feed generation |

### src/ README Files

| File | Status | Description |
|------|--------|-------------|
| [src/README.md](../src/README.md) | ✅ Current | Source folder overview |
| [src/components/README.md](../src/components/README.md) | ✅ Current | Components overview |
| [src/components/blog/README.md](../src/components/blog/README.md) | ✅ Current | Blog components |
| [src/components/home/README.md](../src/components/home/README.md) | ✅ Current | Home page sections |
| [src/components/layout/README.md](../src/components/layout/README.md) | ✅ Current | Layout components |
| [src/lib/README.md](../src/lib/README.md) | ✅ Current | Utility functions |
| [src/pages/README.md](../src/pages/README.md) | ✅ Current | Routing and pages |
| [src/layouts/README.md](../src/layouts/README.md) | ✅ Current | Page layouts |
| [src/content/README.md](../src/content/README.md) | ✅ Current | Content Collections |
| [src/styles/README.md](../src/styles/README.md) | ✅ Current | Styling guide |

### DeepWorkPlan skill (`.agents/skills/deepworkplan/`)

| File | Status | Description |
|------|--------|-------------|
| [SKILL.md](../.agents/skills/deepworkplan/SKILL.md) | ✅ Current | DWP router skill (routes to sub-skills) |
| [create/ · execute/ · refine/ · resume/ · status/ · verify/](../.agents/skills/deepworkplan/) | ✅ Current | Plan-execute-verify sub-skills (`/dwp-*`) |
| [onboard/](../.agents/skills/deepworkplan/onboard/SKILL.md) | ✅ Current | Make a repo AI-first |
| [author/](../.agents/skills/deepworkplan/author/SKILL.md) | ✅ Current | Create/update skills & agents (`/skill-create`, `/agent-create`) |
| [guide/GUIDE.md](../.agents/skills/deepworkplan/guide/GUIDE.md) | ✅ Current | DWP methodology guide |
| [addons/dependency-upgrade/](../.agents/skills/deepworkplan/addons/dependency-upgrade/SKILL.md) | ✅ Current | Dependency upgrade addon (`/lib-upgrade`) |

### .agents/ Documentation

| File | Status | Description |
|------|--------|-------------|
| [README.md](../.agents/README.md) | ✅ Current | Claude commands overview |
| [skills/](../.agents/skills/) | ✅ Current | Reusable skills (9 total) |
| [agents/](../.agents/agents/) | ✅ Current | Specialized agents (4 total) |
| [docs/skills_agents_catalog.md](../.agents/docs/skills_agents_catalog.md) | ✅ Current | Catalog of skills/agents |

## Coverage Summary

### By Category

| Category | Files | Coverage |
|----------|-------|----------|
| Core | 3 | 100% |
| docs/ | 15 | 100% |
| docs/features/ | 6 | 100% |
| src/ READMEs | 10 | 100% |
| public/ | 1 | 100% |
| Agent Commands | 5 | 100% |
| Claude System | 4 | 100% |

### Total

- **Documentation Files:** 44
- **Current:** 44
- **Needs Review:** 0

## AI Interoperability Checklist

| Area | Status | Description |
|------|--------|-------------|
| Root Documentation | ✅ | AGENTS.md, CLAUDE.md, README.md |
| Architecture Docs | ✅ | Full technical documentation |
| Component Docs | ✅ | README.md in each component folder |
| Feature Docs | ✅ | docs/features/ with 5 feature docs |
| Agent Commands | ✅ | Deep work plans, skills, upgrades |
| Skills & Agents | ✅ | 9 skills, 4 agents documented |
| Example Plans | ✅ | Astro-specific example plan |

**AI Interoperability: 100%**

## Recently Removed Files

The following serverless-specific files were removed:

- `DATABASE_SCHEMAS.md` - DynamoDB (not applicable)
- `SERVERLESS_CONFIGURATION.md` - Not applicable
- `API_ENDPOINTS.md` - Replaced by API_REFERENCE.md
- `ERROR_HANDLING.md` - Generic patterns in STANDARDS.md
- `ENVIRONMENT_VARIABLES.md` - Minimal env vars for static site
- `features/` (old) - Serverless feature docs (4 files)

## Documentation Maintenance

- [ ] Review quarterly for accuracy
- [ ] Update after major changes
- [ ] Keep synchronized with code

## How to Update This Inventory

1. When adding new docs, add row to appropriate table
2. When removing docs, move to "Recently Removed" section
3. When updating docs, update "Last Updated" if significant
4. Review status monthly

## Status Legend

| Status | Meaning |
|--------|---------|
| ✅ Current | Up to date with codebase |
| ⚠️ Review | May need updates |
| ❌ Outdated | Known to be out of date |
| 📝 Draft | Work in progress |
