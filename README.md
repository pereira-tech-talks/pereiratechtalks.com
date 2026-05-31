<div align="center">

# Pereira Tech Talks

**Bilingual community website** · `pereiratechtalks.org` · v3.0.0

[![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?logo=astro)](https://astro.build)
[![Svelte](https://img.shields.io/badge/Svelte-5.x-FF3E00?logo=svelte)](https://svelte.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Live Site](https://pereiratechtalks.org) · [Architecture](./docs/ARCHITECTURE.md) · [Product Spec](./docs/PRODUCT_SPEC.md) · [Brand Book](./docs/BRAND_GUIDE.md)

</div>

---

## Overview

Pereira Tech Talks is the technical community of Pereira (Risaralda, Colombia), running meetups, the annual **Pereira Tech Day** conference, the **Speaker School** mentorship track, **La Biblioteca del Mañana** reading group, an AI/agents channel, and an active blog and slide library — since 2017.

This repository hosts the v3.0.0 community website: a fully bilingual (Spanish primary, English first-class international) static site built on the modern Astro stack, designed to be **fully understandable and operable by AI agents**.

### Highlights

| Feature | Description |
| :------ | :---------- |
| **Bilingual** | Full Spanish & English with route parity (Spanish primary; English international) |
| **Verticals** | Speaker School · La Biblioteca del Mañana · AI Channel · Monthly Meetups |
| **Pereira Tech Day** | Per-edition pages with their own brand kit (palette + typography), scoped so the umbrella PTT brand stays in chrome |
| **Slides system** | Reveal.js decks for talks, embeddable in talk detail pages |
| **Community-driven** | Contributors, organizers, mentors, sponsors — all first-class content collections |
| **AEO-ready** | Markdown-for-Agents endpoints for every public page |
| **Dark mode** | Petroleum-teal canvas (`#08191A`) per the v3.0.0 brand identity |
| **Performance** | Lighthouse 100 target across Performance / SEO / Best Practices / Accessibility |
| **AI-first** | Every workflow documented for AI agents: skills, agents, slash commands |

---

## Quick Start

```bash
# Use Node 24.15.0+ (defined in .nvmrc) and pnpm 11.x
pnpm install

# Dev server
pnpm run dev          # http://localhost:8888

# Build
pnpm run build

# Preview production build
pnpm run astro:preview
```

### Quality gates

```bash
pnpm run biome:check        # Lint + format check (Biome)
pnpm run astro:check        # TypeScript + Astro diagnostics
pnpm run test               # Vitest unit tests
pnpm run md:check           # Markdown-for-Agents parity
pnpm run search:budgets     # Search payload budgets
pnpm run lighthouse         # Lighthouse CI
```

Full command reference: [Development Commands](./docs/DEVELOPMENT_COMMANDS.md).

---

## Project Structure

```
src/
├── components/                # UI components (Astro + Svelte)
│   ├── home/                  # Homepage sections
│   ├── meetups/               # Meetup cards & timeline
│   ├── events/                # Event cards & calendar
│   ├── pereira-tech-days/     # PTD edition components
│   ├── verticals/             # Vertical pages (Speaker School, etc.)
│   ├── speakers/ talks/       # Speaker & talk directories
│   ├── community/             # Contributors, sponsors, channels
│   ├── blog/                  # Blog cards, search, series
│   ├── layout/                # Header.svelte, MobileMenu.svelte
│   └── pages/                 # Shared page components (*Page.astro)
├── content/                   # Astro Content Collections
│   ├── authors/ blog/{en,es}/ slides/{en,es}/ tags/ series/
│   ├── meetups/{en,es}/       # Monthly meetups
│   ├── events/                # Calendar events
│   ├── pereiraTechDays/       # PTD editions (with brandKit per edition)
│   ├── verticals/ speakers/ talks/
│   ├── contributors/ sponsors/ channels/
├── layouts/                   # MainLayout, InternalLayout, ShowcaseLayout, SlideLayout
├── lib/                       # blog.ts, i18n.ts, translations/, content helpers
├── pages/                     # File-based routing (EN root, ES under /es/)
│   ├── internal/              # Dev-only hub (brand book, design system, admin)
│   └── api/                   # JSON endpoints (search index, sitemap helpers)
└── styles/                    # global.css (Tailwind 4 @theme tokens), slides.css

public/images/                  # Brand, blog, meetups, events, PTDs, speakers, sponsors
docs/                           # Project documentation
.agents/                        # Cross-agent skills, commands, agents, settings
.agent_commands/                # Deep work plan templates and skill/agent generators
tmp/                            # Git-ignored scratch space
```

Full tree with all files: [Architecture Guide](./docs/ARCHITECTURE.md#project-structure).

---

## The Brand Foundation

Pereira Tech Talks v3.0.0 is built on a deliberate visual identity:

- **Global PTT primary** — Petroleum Teal `#1F6F73` (light) / `#3FA8AD` (dark)
- **Dark canvas** — Deep green-teal `#08191A`
- **Accent** — Warm amber `#E8A33D` (icons, pills, large text only)
- **Typography** — Inter Variable (display, headings, body, mono via system stack)
- **Per-edition kits** — Each Pereira Tech Day edition (e.g. PTD 2024 with `Bebas Neue` uppercase + coral `#F06D6D`) overrides the palette inside `[data-edition-theme]` only — the umbrella PTT brand stays visible in header, footer, language switcher, and theme toggle on every edition page.

Full guide: [Brand Book](./docs/BRAND_GUIDE.md). Live in dev: [`/internal/brand`](http://localhost:8888/internal/brand).

---

## Multilingual Content (Mandatory)

Every public page exists in both Spanish and English. Translation strings live in `src/lib/translations/{en,es}.ts` with types in `types.ts`. Spanish content **always** uses ñ, accented vowels, and interrogative accents — verified by greps in [`AGENTS.md`](./AGENTS.md#2-orthography--diacritical-marks-mandatory).

Adding a new language: see [I18N Guide](./docs/I18N_GUIDE.md).

---

## AI Agent-First

Every workflow that humans use is also documented for AI agents:

- **Skills** — reusable procedures invoked via slash commands (`/add-blog-post`, `/add-meetup`, `/audit-post`, …). See [`.agents/skills/`](./.agents/skills/) and the [Skills & Agents Catalog](./.agents/docs/skills_agents_catalog.md).
- **Agents** — specialized workers (`reviewer`, `executor`, `architect`, `security-auditor`, `i18n-guardian`, `content-writer`).
- **Markdown-for-Agents** — every public HTML page has a parallel `.md` endpoint that AI assistants can fetch directly.

Single source of truth for all AI assistants: [`AGENTS.md`](./AGENTS.md). Onboarding: [`docs/AI_AGENT_ONBOARDING.md`](./docs/AI_AGENT_ONBOARDING.md).

---

## Documentation

**Operational docs** for organizers, contributors, and sponsors:

- [Code of Conduct](./docs/CODE_OF_CONDUCT.md)
- [Contributing](./docs/CONTRIBUTING.md)
- [Governance](./docs/GOVERNANCE.md)
- [Community Guidelines](./docs/COMMUNITY_GUIDELINES.md)
- [Communication Channels](./docs/COMMUNICATION_CHANNELS.md)
- [Call for Speakers](./docs/CALL_FOR_SPEAKERS.md)
- [Sponsorship](./docs/SPONSORSHIP.md)

**Engineering docs:**

- [Architecture](./docs/ARCHITECTURE.md) · [Standards](./docs/STANDARDS.md) · [Brand Guide](./docs/BRAND_GUIDE.md)
- [Testing](./docs/TESTING_GUIDE.md) · [Development Commands](./docs/DEVELOPMENT_COMMANDS.md) · [Performance](./docs/PERFORMANCE.md)
- [I18N](./docs/I18N_GUIDE.md) · [SEO](./docs/SEO.md) · [Accessibility](./docs/ACCESSIBILITY.md) · [Security](./docs/SECURITY.md)
- [Writing Voice](./docs/WRITING_VOICE_GUIDE.md) · [Writing Craft](./docs/WRITING_CRAFT_GUIDE.md)

**Product:**

- [Product Spec](./docs/PRODUCT_SPEC.md) — vision, audiences, verticals, success metrics

---

## Deployment

Deployed to **Cloudflare Pages**. The build runs `astro check && astro build`, then post-build scripts strip the dev-only `/internal/*` routes from the production output.

DNS: `pereiratechtalks.org` (Domain property; GSC verification via DNS TXT). Bing verification optional via `PUBLIC_BING_SITE_VERIFICATION` env var.

---

## License

MIT — see [LICENSE](./LICENSE).

Pereira Tech Talks is a community organization. Trademarks (logos, the "Pereira Tech Talks" and "Pereira Tech Day" names) are reserved.

---

## Contact

- General: <hello@pereiratechtalks.org>
- Speakers: <speakers@pereiratechtalks.org>
- Sponsors: <sponsors@pereiratechtalks.org>
- Press: <press@pereiratechtalks.org>
- Code of Conduct reports: <conduct@pereiratechtalks.org>

Channels: see [Communication Channels](./docs/COMMUNICATION_CHANNELS.md).
