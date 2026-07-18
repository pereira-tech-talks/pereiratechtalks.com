# Documentation Index

Welcome to the **Pereira Tech Talks** documentation. This guide helps developers and AI agents understand, maintain, and extend the v3.0.0 platform.

## Quick Navigation

### Getting Started

| Document | Description |
|----------|-------------|
| [AI Agent Onboarding](AI_AGENT_ONBOARDING.md) | Quick start guide for AI coding assistants |
| [Development Commands](DEVELOPMENT_COMMANDS.md) | npm scripts and CLI reference |
| [Standards](STANDARDS.md) | Coding conventions and best practices |

### Architecture & Design

| Document | Description |
|----------|-------------|
| [Product Spec](PRODUCT_SPEC.md) | Vision, features, and goals for Pereira Tech Talks |
| [Information Architecture](INFORMATION_ARCHITECTURE.md) | URL surface, navigation, content relationships |
| [Brand Guide](BRAND_GUIDE.md) | PTT palette, typography, logo, voice & per-edition kits |
| [Architecture](ARCHITECTURE.md) | Technical architecture, patterns, and decisions |
| [Performance](PERFORMANCE.md) | SSG optimization, images, caching strategies |

### Community & Governance

| Document | Description |
|----------|-------------|
| [Code of Conduct](CODE_OF_CONDUCT.md) | Behavior expectations across PTT spaces |
| [Contributing](CONTRIBUTING.md) | Ways to contribute and code workflow |
| [Governance](GOVERNANCE.md) | Roles, decisions, financial transparency |
| [Community Guidelines](COMMUNITY_GUIDELINES.md) | Day-to-day behavior in PTT spaces |
| [Communication Channels](COMMUNICATION_CHANNELS.md) | Inventory of official PTT channels |
| [Call for Speakers](CALL_FOR_SPEAKERS.md) | Always-open speaker submission process |
| [Sponsorship](SPONSORSHIP.md) | Sponsorship tiers and benefits |

### Development Guides

| Document | Description |
|----------|-------------|
| [Testing Guide](TESTING_GUIDE.md) | Test setup and conventions |
| [I18N Guide](I18N_GUIDE.md) | Internationalization and language support |
| [Security](SECURITY.md) | Static site security best practices |
| [Accessibility](ACCESSIBILITY.md) | WCAG AA compliance, contrast, ARIA patterns |
| [SEO](SEO.md) | Meta tags, structured data, multilingual SEO, AEO |
| [Analytics](ANALYTICS.md) | Tracking, GSC, verification |

### AI & Collaboration

| Document | Description |
|----------|-------------|
| [AI Agent Collaboration](AI_AGENT_COLLAB.md) | Multi-agent coordination guidelines |
| [Documentation Guide](DOCUMENTATION_GUIDE.md) | How to write and maintain docs |
| [Documentation Inventory](DOCUMENTATION_INVENTORY.md) | Coverage tracking |
| [Markdown for Agents](aeo/MARKDOWN_FOR_AGENTS.md) | AEO Markdown endpoints contract |

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Astro** | 5.16.15 | Static site generator |
| **Svelte** | 5.48.0 | Interactive components |
| **TypeScript** | 5.9.3 | Type-safe development |
| **Tailwind CSS** | 4.1.18 | Utility-first styling with PTT design tokens |
| **Biome** | 2.3.11 | Linting and formatting |
| **MDX** | 4.3.13 | Enhanced Markdown |

## Project Structure Overview

```
pereiratechtalks.org/
├── src/
│   ├── components/      # Reusable UI components (.astro, .svelte)
│   ├── content/         # Content Collections
│   │   ├── blog/{en,es}/         # Blog posts (date-prefixed slugs)
│   │   ├── slides/{en,es}/       # Reveal.js / external decks
│   │   ├── meetups/{en,es}/      # Monthly meetup recaps
│   │   ├── events/{en,es}/       # One-off events
│   │   ├── pereira-tech-days/    # Pereira Tech Day editions (per-edition brand)
│   │   ├── verticals/            # La Biblioteca del Mañana, AI, Speaker School, etc.
│   │   ├── speakers/             # Speaker bios
│   │   ├── talks/                # Individual talks
│   │   ├── sponsors/             # Sponsor entries
│   │   ├── channels/             # Communication channel inventory
│   │   ├── contributors/         # Community contributors
│   │   ├── tags/                 # Tag taxonomy
│   │   ├── series/               # Multi-part content series
│   │   └── authors/              # Author YAML files
│   ├── layouts/         # MainLayout, InternalLayout, ShowcaseLayout, SlideLayout
│   ├── lib/             # Utility functions and types (per collection)
│   ├── pages/           # File-based routing (EN root, ES /es/, /internal/ dev-only)
│   └── styles/          # Tailwind 4 theme tokens (--color-ptt-*)
├── public/              # Static assets (images, fonts, icons, .well-known/)
├── docs/                # This documentation folder
├── .agents/             # Cross-agent skills (incl. the deepworkplan skill), commands, agent definitions
└── .dwp/                # Deep Work Plan outputs — plans/ + drafts/ (git-ignored)
```

## Quick Commands

```bash
# Development
pnpm run dev              # Start dev server (http://localhost:8888)
pnpm run build            # Production build
pnpm run astro:preview    # Preview build

# Code Quality
pnpm run biome:check      # Check linting/formatting
pnpm run biome:fix        # Auto-fix issues
pnpm run astro:check      # TypeScript checking
pnpm run test             # Run unit tests

# Content
pnpm run images:optimize  # Process staged images
pnpm run md:check         # Verify HTML→Markdown parity for agents

# Deployment
pnpm run build            # Production build (Cloudflare Pages)
```

## Key Concepts

### Content Collections

Pereira Tech Talks v3.0.0 uses a rich content model with multiple collections (see schemas in `src/content.config.ts`):

- **blog** — articles with `title`, `description`, `pubDate`, `heroImage`, `tags`, `series`, `author`
- **slides** — discriminated union (`internal` Reveal.js / `external-embed` / `external-link`)
- **meetups** — monthly community gatherings (separate from one-off events and from the blog)
- **events** — special one-off events
- **pereiraTechDays** — annual flagship events with per-edition `brandKit` (palette, typography, hero assets) scoped via `[data-edition-theme="{year}"]`
- **verticals** — community programs (La Biblioteca del Mañana, AI channel, Speaker School, etc.)
- **speakers / talks / contributors / sponsors / channels** — supporting collections

### Component Types

1. **Astro Components** (`.astro`) — Static, build-time rendered (default for non-interactive content)
2. **Svelte Components** (`.svelte`) — Interactive, client-side hydrated

Use `client:visible` or `client:idle` directives by default; reserve `client:load` for above-the-fold interactivity. Reveal.js decks use `client:only="svelte"` (documented exception).

### Internationalization

- English: `/` (default)
- Spanish: `/es/`

Components receive a `lang` prop for language-specific content. UI strings live in `src/lib/translations/{en,es}.ts`. All slugs (blog, slides, series) MUST be in English even for Spanish posts.

### Per-Edition Branding

Pereira Tech Days editions ship a `brandKit` field that overrides PTT design tokens within their route subtree only. See [Brand Guide → Per-Edition Kits](BRAND_GUIDE.md) and the live preview at `/internal/brand/per-edition-kits`.

## For AI Agents

If you're an AI coding assistant, start here:

1. **Read [AGENTS.md](../AGENTS.md)** — Main guidance document
2. **Read [AI Agent Onboarding](AI_AGENT_ONBOARDING.md)** — Quick checklist
3. **Follow [Standards](STANDARDS.md)** — Coding conventions
4. **Browse the Internal Hub** — Live `/internal/brand` and `/internal/ui` document the running system; the Brand Book is canonical

## Contributing

1. Follow the coding standards in [STANDARDS.md](STANDARDS.md)
2. Update relevant documentation after changes
3. Run `pnpm run biome:check` before committing
4. Use conventional commit messages
5. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow

## Documentation Maintenance

When updating documentation:

- Keep language consistent (English only — Spanish content lives in `src/content/{blog,pages,...}/es/`)
- Update cross-references when renaming/moving docs
- Add new documents to this index
- Track coverage in [DOCUMENTATION_INVENTORY.md](DOCUMENTATION_INVENTORY.md)

