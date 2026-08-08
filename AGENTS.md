# AGENTS.md — Documentation for AI Agents

**Purpose:** Single source of truth for all AI coding assistants (Claude Code, Cursor AI, OpenAI Codex, Google Gemini, GitHub Copilot, and others) operating on the Pereira Tech Talks v3.0.0 codebase.

## Detailed Documentation

| Category | Guide | Purpose |
|----------|-------|---------|
| Architecture | [Architecture](docs/ARCHITECTURE.md) | Components, Content Collections, Svelte integration, project structure, per-edition theming runtime |
| Standards | [Standards](docs/STANDARDS.md) | Canonical coding rules, orthography, import order |
| Brand | [Brand Guide](docs/BRAND_GUIDE.md) | PTT global identity, per-edition kits, voice & tone |
| Design | [Design System](docs/DESIGN.md) | Agent-facing UI contract — `--ptt-*` tokens, type/spacing/radius scales, component patterns |
| Product | [Product Spec](docs/PRODUCT_SPEC.md) | Vision, audiences, verticals, success metrics |
| Blog | [Blog Posts](docs/features/BLOG_POSTS.md) | Tags, series, hero layouts, images, content lifecycle |
| Blog Lifecycle | [Blog Content Lifecycle](docs/features/BLOG_CONTENT_LIFECYCLE.md) | End-to-end blog workflow |
| Forms | [Forms](docs/features/FORMS.md) | Dailybot intakes — Contact, CFS, Speaker School, Sponsors, Calendar, CoC |
| Forms | [Forms](docs/features/FORMS.md) | Dailybot intakes — Contact, CFS, Speaker School, Sponsors, Calendar, CoC |
| Certificates | [Certificates](docs/features/CERTIFICATES.md) | Individual diploma pages, print/PDF, verify UX, fixtures |
| Authors | [Authors](docs/features/AUTHORS.md) | Multi-author support, YAML schema, AuthorCard, JSON-LD |
| Contributors | [Contributors](docs/features/CONTRIBUTORS.md) | Equipo directory — flat organizers + unified alumni |
| Sponsors | [Sponsors](docs/features/SPONSORS.md) | Community partners — current/past (tiers on PTD only) |
| Community stats | [Community Stats](docs/features/COMMUNITY_STATS.md) | Derived About counters via `getCommunityStats()` |
| Talks | [Talks](docs/features/TALKS.md) | Talk entries, speaker history, meetup/PTD linkage |
| Writing Voice | [Writing Voice Guide](docs/WRITING_VOICE_GUIDE.md) | Anti-AI-slop checklist, PTT voice, vocabulary blocklist |
| Content QA | [Content QA Checklist](docs/features/CONTENT_QA_CHECKLIST.md) | Bilingual parity, orthography, SEO/AEO, automated gates |
| Writing Craft | [Writing Craft Guide](docs/WRITING_CRAFT_GUIDE.md) | Narrative structure, fact verification, quote handling, refinement |
| Testing | [Testing](docs/TESTING_GUIDE.md) | Vitest setup, conventions, writing tests |
| Commands | [Development Commands](docs/DEVELOPMENT_COMMANDS.md) | npm scripts, Astro CLI, build workflows |
| i18n | [I18N Guide](docs/I18N_GUIDE.md) | Spanish primary + English first-class international |
| Performance | [Performance](docs/PERFORMANCE.md) | Astro SSG optimization, image handling, caching, per-edition perf |
| Accessibility | [Accessibility](docs/ACCESSIBILITY.md) | WCAG AA, contrast ratios, ARIA, per-edition palette verification |
| SEO | [SEO](docs/SEO.md) | Meta tags, Organization/Event/Person JSON-LD, hreflang, AEO |
| Security | [Security](docs/SECURITY.md) | Static site + community-form threat model |
| Documentation | [Documentation Guide](docs/DOCUMENTATION_GUIDE.md) | When and how to update docs |
| Analytics | [Analytics](docs/ANALYTICS.md) | Tracking, GSC, verification |
| Community | [Code of Conduct](docs/CODE_OF_CONDUCT.md) · [Contributing](docs/CONTRIBUTING.md) · [Governance](docs/GOVERNANCE.md) · [Community Guidelines](docs/COMMUNITY_GUIDELINES.md) | Operational community rules |
| Channels & Forms | [Communication Channels](docs/COMMUNICATION_CHANNELS.md) · [Call for Speakers](docs/CALL_FOR_SPEAKERS.md) · [Sponsorship](docs/SPONSORSHIP.md) | Public-facing community processes |
| AI Agents | [Agent Onboarding](docs/AI_AGENT_ONBOARDING.md), [Agent Collaboration](docs/AI_AGENT_COLLAB.md) | Setup, handoff, coordination |
| Skills/Agents | [Skills & Agents Catalog](.agents/docs/skills_agents_catalog.md) | Available skills and agents |
| Commands | [Commands Reference](.agents/docs/COMMANDS_REFERENCE.md) | All slash commands with procedure files |

## Project Overview

**Pereira Tech Talks** (`pereiratechtalks.org`) — bilingual community website for the Pereira technical community (Risaralda, Colombia). Running monthly meetups since 2017, the annual **Pereira Tech Day** conference, the **Speaker School** mentorship track, **La Biblioteca del Mañana** reading group, the AI/agents channel, and an active blog and slide library. Static site architecture deployed to Cloudflare Pages.

This is **v3.0.0** — the third major iteration of the website, rebuilt on the modern Astro stack and designed to be **fully understandable and operable by AI agents**.

**Technology Stack:**

- **Astro 7.x** — Static site generator (islands architecture). The Rust `.astro` compiler is the default (the old `experimental.rustCompiler` flag was removed)
- **Sätteri** — the Rust Markdown/MDX compiler, configured via `markdown.processor: satteri({ hastPlugins: [...] })` from `@astrojs/markdown-satteri`. It does **not** run remark/rehype plugins: markdown transforms live in `src/lib/satteri-plugins.ts` as HAST plugins. `@astrojs/mdx` inherits the processor, so `.md` and `.mdx` share one pipeline. **Never** add `markdown.remarkPlugins`/`rehypePlugins` (deprecated) or a `rehype-*` dependency — port the transform to a Sätteri HAST plugin instead
- **Svelte 5.x** — Interactive components (with `client:visible`/`client:idle`/`client:only` hydration directives)
- **TypeScript 6.x** — Type-safe development. **Pinned to 6.x on purpose:** TypeScript 7's native compiler does not yet expose the programmatic API `astro check` relies on, so upgrading breaks the type-check gate. Do not bump until [withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321) ships
- **Tailwind CSS 4.x** — Utility-first styling with the PTT `@theme` token system
- **Biome 2.x** — Linter and formatter (replaces ESLint + Prettier)
- **MDX** — Enhanced Markdown for blog posts
- **Reveal.js 6.x** — Slide system for talks
- **Cloudflare Pages** — Hosting; Cloudflare Pages Functions for forms

## Project Structure

> Full tree with all files: **[Architecture Guide](docs/ARCHITECTURE.md#project-structure)**

```
src/
├── components/                # UI components (Astro + Svelte)
│   ├── home/                  # Homepage sections
│   ├── meetups/               # MeetupCard, MeetupTimeline, RSVP widget
│   ├── events/                # EventCard, EventCalendar, Countdown
│   ├── pereira-tech-days/     # PTD edition components, EditionScope, schedule
│   ├── verticals/             # Speaker School, La Biblioteca del Mañana, AI Channel
│   ├── speakers/ talks/       # Directories + detail components
│   ├── community/             # Contributors, sponsors (tiered), channels, press
│   ├── blog/                  # BlogCard, BlogGrid, Search, SeriesNav
│   ├── slides/                # SlideEmbed for talk pages
│   ├── layout/                # Header.svelte, MobileMenu.svelte, LanguageSwitcher
│   ├── pages/                 # Shared page components (*Page.astro)
│   └── forms/                 # ContactForm, CallForSpeakersForm, SponsorForm
├── content/                   # Astro Content Collections
│   ├── authors/               # YAML, one per author/contributor
│   ├── blog/{en,es}/          # Community blog posts (YYYY-MM-DD_slug.md)
│   ├── slides/{en,es}/        # Talk decks (3 types: internal/external-embed/external-link)
│   ├── tags/ series/          # Tag definitions + series
│   ├── meetups/               # Monthly meetups — single bilingual file per meetup
│   ├── events/                # Calendar events (workshops, hackathons, etc.)
│   ├── pereiraTechDays/       # PTD editions with brandKit per edition
│   ├── verticals/             # Vertical metadata (Speaker School, etc.)
│   ├── speakers/ talks/       # Speakers + talks directory
│   ├── contributors/          # Organizers, mentors, vertical leads
│   ├── sponsors/              # Tiered sponsors (Diamond/Gold/Silver/Bronze/Community)
│   ├── channels/              # Communication channels metadata
│   └── pages/{en,es}/         # Markdown-for-Agents endpoints
├── layouts/                   # MainLayout, InternalLayout, ShowcaseLayout, SlideLayout
├── lib/                       # blog.ts, meetups.ts, events.ts, ptd.ts, i18n.ts, translations/
├── pages/                     # File-based routing
│   ├── (root ES routes)       # /, /about, /meetups, /events, /pereira-tech-days, ...
│   ├── en/                    # Mirror in English (Spanish is the primary language, served at /)
│   ├── internal/              # Dev-only hub (brand book, design system, admin views)
│   └── api/                   # JSON endpoints (search index, sitemap helpers)
└── styles/                    # global.css (Tailwind 4 @theme PTT tokens), slides.css

public/images/                  # Brand · blog · meetups · events · pereira-tech-days · speakers · sponsors
scripts/                        # Build utilities (image optimization, agent skills index)
docs/                           # Project documentation
.agents/                        # Cross-agent skills, commands, agents, settings (canonical)
.claude → .agents               # Backward-compat symlink for Claude Code
.dwp/                           # Deep Work Plan outputs — plans/ + drafts/ (git-ignored)
tmp/                            # Temporary workspace (git-ignored)
```

## Temporary Workspace (`tmp/`)

The `tmp/` directory is a **git-ignored scratch space** for agents and developers.

**Use it for:** temporary prompts, outputs, drafts, one-off analysis results, debug logs, ephemeral files.

**Rules:** Everything inside `tmp/` is ignored by git (except `.gitkeep`). Do NOT store anything permanent here. When a user asks for a temporary file or scratch artifact, **write it to `tmp/`**.

## Skills, Commands, and Agents (`.agents/`)

The `.agents/` directory is the **canonical, cross-agent home** for everything that defines how AI assistants behave in this repo: skills, slash commands, agent definitions, internal documentation, and settings. The same content is consumed by Claude Code, Cursor AI, OpenAI Codex, Gemini, and any other coding agent that picks up local skills/commands.

```
.agents/
├── agents/        # Agent definitions (architect, executor, reviewer, ...)
├── commands/      # Slash commands (commit, pr, branch, dwp-*, ...)
├── skills/        # Skill procedures (add-blog-post, add-meetup, fix-lint, ...)
├── docs/          # Catalogs and references (skills_agents_catalog.md, COMMANDS_REFERENCE.md)
├── README.md      # Conventions for authoring skills, agents, and commands
├── settings.json  # Claude Code env (env vars, experimental flags)
└── settings.local.json # Claude Code local permissions (git-tracked)
```

**Backward compatibility — `.claude/` symlink:** Claude Code historically reads from `.claude/`. To keep that working without duplicating files, **`.claude` is a symlink to `.agents`**. Use `.agents/...` as the canonical path in **all new documentation, prompts, and skill/command files**. Do not edit files via the `.claude/` symlink.

## CRITICAL: Mandatory Requirements

### 1. Language Standards

**ALL code, comments, and documentation MUST be in English.** Always update documentation after important changes. Public content is bilingual (Spanish primary, English first-class international).

### 2. Orthography & Diacritical Marks (MANDATORY)

**All user-facing text MUST use proper orthography.** Spanish content MUST include ñ (e.g., `pequeño`, `diseño`, `español`, `compañero`, `mañana`), accented vowels (`análisis`, `código`, `página`, `versión`, `próximo`), and interrogative accents (`cómo`, `qué`, `cuál`, `dónde`, `cuándo`).

**Quick validation** before committing Spanish text:

```bash
grep -rn 'pequeno\|tamano\|diseno\|espanol\|manana\|companer' src/content/ src/lib/translations/es.ts
grep -rn 'analisis\|numero\|codigo\|ejecucion\|version\|pagina\|titulo\|proximo' src/content/ src/lib/translations/es.ts
```

If any match is found, fix it before committing. Full word lists in **[Standards Guide](docs/STANDARDS.md)**.

### 3. Import Order Convention (MANDATORY)

```typescript
// 1. Node.js native modules
import { dirname, resolve } from 'node:path';

// 2. Third-party packages
import { defineConfig } from 'astro/config';
import { z } from 'astro:content';

// 3. Internal project modules (using @ alias)
import Header from '@/components/layout/Header.svelte';
import { SITE_TITLE } from '@/lib/constances';
import { getMeetups } from '@/lib/meetups';

// 4. Type imports (separate group)
import type { APIRoute } from 'astro';
import type { CollectionEntry } from 'astro:content';
```

### 4. Type Hints (RECOMMENDED)

Prefer explicit types on function signatures. Biome allows `any` for flexibility, but explicit types are better. See **[Standards Guide](docs/STANDARDS.md)** for examples.

### 5. Code Quality (MANDATORY)

```bash
pnpm run biome:check        # Check linting and formatting
pnpm run biome:fix          # Auto-fix issues
pnpm run biome:fix:unsafe   # Fix with unsafe transformations
```

**DO NOT use ESLint or Prettier** — this project uses Biome exclusively.

### 6. Testing

```bash
pnpm run test           # Run all tests (single run)
pnpm run test:watch     # Watch mode
pnpm run test:coverage  # With coverage report
```

Tests use `*.test.ts` naming in `tests/unit/`. Coverage target: 80%+ on `src/lib/`. See **[Testing Guide](docs/TESTING_GUIDE.md)**.

### 7. Multilingual Content Synchronization (MANDATORY)

**ALL content changes MUST be synchronized across both active languages (es as primary, en as international).** No exceptions.

**Content type rules:**

- **Pages:** Create 1 shared `*Page.astro` in `src/components/pages/` + thin 3-line wrappers in `src/pages/` (Spanish primary, served at `/`) and `src/pages/en/` (English, served at `/en`) passing `lang` as string literal.
- **Blog Posts:** Both `src/content/blog/en/` and `src/content/blog/es/` MUST have the equivalent post. Translate `title`, `description`, body. Preserve `pubDate`, `heroImage`, `tags`, `author`, code blocks. **Use `/add-blog-post` skill for new posts.**
- **Meetups:** One bilingual file per meetup in `src/content/meetups/` (`title`/`description` with `en`/`es`). **Use `/add-meetup` skill.**
- **Events / PTD editions:** Define in single source-of-truth collection (`events`, `pereiraTechDays`); translatable fields use `{ en, es }` shape per the Zod schema (Task 4).
- **Authors / Contributors:** Defined as YAML with localized `role`/`bio` (`en`/`es` keys required by schema). Posts and talks reference by slug.
- **Translation Strings:** Add to BOTH `src/lib/translations/en.ts` and `es.ts`. Update `types.ts` with any new interface keys.
- **Components:** Use `getTranslations(lang)` from `@/lib/translations`. **Never hardcode user-visible strings.**
- **Agent-Friendly Markdown (MANDATORY):** When page or translation content changes, update the corresponding `src/content/pages/{en,es}/*.md` files. These serve as Markdown endpoints for AI agents and MUST stay in sync. See **[Markdown for Agents](docs/aeo/MARKDOWN_FOR_AGENTS.md)**.

**Compliance checklist:**

- [ ] Pages exist in both `src/pages/` (ES, root) and `src/pages/en/` (EN)
- [ ] Blog posts exist in both `src/content/blog/en/` and `src/content/blog/es/`
- [ ] Meetup entries exist in `src/content/meetups/` with both `en` and `es` fields filled
- [ ] Same `author` slug used in EN and ES versions of a post
- [ ] New/updated authors and contributors have both `role.en`/`role.es` and `bio.en`/`bio.es` filled in
- [ ] UI strings in both `en.ts` and `es.ts`
- [ ] No hardcoded user-visible text
- [ ] Page Markdown files updated in both `src/content/pages/en/` and `src/content/pages/es/`

**Tools:** `/translate-sync` skill, `i18n-guardian` agent. Adding a new language: see **[I18N Guide](docs/I18N_GUIDE.md)**.

### 8. Brand & Per-Edition Theming (MANDATORY)

Pereira Tech Talks v3.0.0 uses a global PTT brand **plus** per-edition brand kits for each Pereira Tech Day.

**Hard rules:**

1. The global PTT palette (`--ptt-primary`, `--ptt-bg`, `--ptt-text`, etc., declared in `src/styles/global.css` via Tailwind 4 `@theme`) is the **default identity** of `pereiratechtalks.org`. Use it on every public page that is NOT a Pereira Tech Day edition route.
2. Per-edition kits override the palette **only inside `[data-edition-theme="{year}"]`** wrappers (the `EditionScope` component). Header, footer, language switcher, and theme toggle render as siblings (not descendants) of the wrapper, so the umbrella PTT brand stays visible on every PTD page.
3. **Never set `--ptt-*` variables outside global stylesheets or `[data-edition-theme]` scopes.** No inline `style="--ptt-primary: ..."` on individual components.
4. The accent color (`--ptt-accent`, `#E8A33D` light) **fails WCAG AA on `--ptt-bg`** — reserve it for icons, pills with `--ptt-bg-elevated`, large text, or decorative motifs. **Never** use it for body text.
5. Each per-edition kit MUST include estimated WCAG ratios in its definition (validated by Task 1's contrast script).

Full reference: **[Brand Guide](docs/BRAND_GUIDE.md)** + dev-only **[`/internal/brand`](http://localhost:8888/internal/brand)** Brand Book.

### 9. Performance-First Mindset (MANDATORY)

1. **Prefer static over dynamic** — use `.astro` for non-interactive content
2. **Choose the laziest hydration** — `client:visible` or `client:idle` over `client:load`. `client:only="svelte"` only when DOM is truly required (e.g., Reveal.js)
3. **Minimize JavaScript** — prefer CSS-only solutions over JS
4. **Use native browser APIs** — IntersectionObserver over scroll listeners, native `loading="lazy"`
5. **Optimize images** — always include dimensions, lazy load below-fold content
6. **Avoid layout shifts** — reserve space for async content, `font-display: swap`
7. **Keep search payload lean** — language-sharded endpoints, minimal index schema
8. **Per-edition kits** — must NOT cause FOUC on edition pages (palette CSS is in the build output, applied via attribute selector at SSR time)
9. **Protect Lighthouse scores** — run `pnpm run search:budgets` after search changes; aim for 100% across categories

See **[Performance Guide](docs/PERFORMANCE.md)**.

### 10. Accessibility Standards (MANDATORY)

1. **WCAG AA contrast** — 4.5:1 normal text, 3:1 large text
2. **Approved text colors** — `text-gray-600 dark:text-gray-300` (or PTT tokens `text-ptt-secondary`) for secondary text. **NEVER** `text-gray-400`, `text-gray-500`, `dark:text-gray-400`, `dark:text-gray-500`
3. **Image dimensions** — every `<img>` must have `width` and `height`
4. **Semantic HTML** — proper heading hierarchy, landmarks, button vs link
5. **Text alternatives** — meaningful `alt` for informative images, `alt=""` for decorative
6. **Keyboard navigation** — all interactive elements focusable and operable
7. **ARIA** — disclosure pattern for nav dropdowns (not `role="menu"`)
8. **Per-edition palette verification** — every PTD edition kit must clear WCAG AA on body text and large text combinations before publishing
9. **Reduced motion** — all non-essential animations honor `prefers-reduced-motion: reduce`

See **[Accessibility Guide](docs/ACCESSIBILITY.md)**.

### 11. Analytics Verification Policy (MANDATORY)

1. Do not add or reintroduce `PUBLIC_GOOGLE_SITE_VERIFICATION`
2. Do not add `google-site-verification` meta tags in templates/components
3. Keep Bing verification as optional env-based meta tag (`PUBLIC_BING_SITE_VERIFICATION`)
4. GSC verification is DNS-only (Domain property DNS TXT)

## Shared Agent Coordination

Multiple AI agents collaborate on this codebase. When updating agent guidance, mirror changes across all relevant files. See **[AI Agent Collaboration](docs/AI_AGENT_COLLAB.md)**.

### DWP Security Review augmentation — AI Diff Reviewer addon (optional, local-only / Flow A)

The [AI Diff Reviewer addon](.agents/skills/deepworkplan/addons/ai-diff-reviewer/SKILL.md) is installed in **Flow A (local-only)**: vendored skill at `.agents/skills/ai-diff-reviewer/` + a repo-tailored `.review/extension.md`. The mandatory DWP **Security Review** task gains an additional local-review step — invoke *"Review my current branch"*, then append the verdict + findings table under `## AI Diff Reviewer local review` in `analysis_results/SECURITY_REVIEW.md`. A `critical` finding follows the Security Review contract (blocks until fixed or explicitly accepted); `warning`/`info` are reported but do not block. Best-effort and **never-block** — skipped (with one warning) if the skill or extension is absent. **No CI workflow** is installed (Flow B deferred); Flow A needs **no** provider secret.

## Quick Commands

```bash
pnpm run dev                # Dev server (http://localhost:8888)
pnpm run build              # Production build (astro check && astro build)
pnpm run astro:preview      # Preview production build
pnpm run biome:check        # Lint and format check
pnpm run biome:fix          # Auto-fix lint issues
pnpm run astro:check        # TypeScript type checking
pnpm run test               # Run unit tests
pnpm run test:coverage      # Tests with coverage
pnpm run images:optimize    # Process staged images
pnpm run md:check           # Verify every HTML page has a matching .md for agents
pnpm run md:check:strict    # Same as above; exits 1 on missing (for CI)
pnpm run search:budgets     # Search payload budgets
pnpm run lighthouse         # Lighthouse audit
pnpm run release            # Bump version and release commit
pnpm run ncu:check          # Check for package updates
```

Full command reference: **[Development Commands](docs/DEVELOPMENT_COMMANDS.md)**.

## Architecture Patterns

> Full patterns with code examples: **[Architecture Guide](docs/ARCHITECTURE.md)**

### 1. Astro Components

`.astro` files are the foundation. Script block (frontmatter) runs at build time. Use for all non-interactive content. Svelte is only for interactive components.

```astro
---
interface Props {
  title: string;
  count?: number;
}
const { title, count = 5 } = Astro.props;
---

<section class="py-12">
  <h2 class="text-2xl font-bold text-ptt dark:text-ptt">{title}</h2>
</section>
```

### 2. Content Collections

All structured content (blog, meetups, events, PTDs, verticals, speakers, talks, contributors, sponsors, channels, tags, series, authors) uses Astro Content Collections with Zod schemas defined in `src/content.config.ts`. See [Architecture Guide](docs/ARCHITECTURE.md) and Task 4 for the full schema.

### 3. Svelte Integration

Use Svelte for interactive components. Always include a `client:*` directive (`client:visible` preferred over `client:load`). `client:only="svelte"` only when DOM is required (e.g., Reveal.js).

### 4. Page Wrapper Pattern (MANDATORY)

Pages in `src/pages/` are ultra-minimal 3-line routing wrappers. All logic lives in `*Page.astro` components in `src/components/pages/`.

**Key rules:**

- Page components handle `MainLayout` internally — wrappers **never** import `MainLayout`
- The `lang` prop is passed as a **string literal** (`"en"`, `"es"`), not a variable
- For a new page: create **1 `*Page.astro` component** + **N thin wrappers** (one per language)
- All user-visible text uses `getTranslations(lang)`, all URLs use `getUrlPrefix(lang)`

**Page component** (`src/components/pages/AboutUsPage.astro`):

```astro
---
import MainLayout from '@/layouts/MainLayout.astro';
import { getTranslations } from '@/lib/translations';
import { getUrlPrefix, type Language } from '@/lib/i18n';

interface Props { lang: Language; }
const { lang } = Astro.props;
const t = getTranslations(lang);
const prefix = getUrlPrefix(lang);
---

<MainLayout lang={lang} title={t.aboutUsPage.title} description={t.aboutUsPage.description}>
  <!-- page content using t.* for text, prefix for URLs -->
</MainLayout>
```

**Wrapper** (`src/pages/about-us.astro` — 3 lines):

```astro
---
import AboutUsPage from '@/components/pages/AboutUsPage.astro';
---
<AboutUsPage lang="en" />
```

### 5. i18n Routing

Spanish pages at root (`src/pages/` → `/`), English in `src/pages/en/` (→ `/en`). Language is **URL-first**: there is no automatic redirect from browser language or `localStorage` — see [I18N Guide → Language selection](docs/I18N_GUIDE.md#language-selection-url-first). The switcher may still write `localStorage['ptt:lang']` as a soft preference; only `?lang=` may pin/redirect. Page components in `src/components/pages/` receive `lang` and handle translations internally. Spanish is the **primary language** of the community and therefore the unprefixed default; English is first-class international. Never hardcode a `/en` or `/es` prefix — derive it from `getUrlPrefix(lang)`.

### 6. Per-Edition Theming Runtime

Each Pereira Tech Day edition ships its own `brandKit` in the content entry under `src/content/pereiraTechDays/{year}.{json,yaml}`. The runtime (`EditionThemeProvider` / `EditionScope`) writes scoped CSS variables under `[data-edition-theme="{year}"]` so only the edition body re-skins, never chrome. See [Brand Guide §9](docs/BRAND_GUIDE.md) and `/internal/brand/per-edition-kits`.

### 7. Internal Hub (Dev-Only)

Dev-only portal at `/internal/`. Uses `InternalLayout` or `ShowcaseLayout` (never `MainLayout`). English-only, no Page Wrapper pattern. Automatically excluded from production builds via three layers (post-build deletion, sitemap filter, noindex meta). Sub-sections include `brand/` (Brand Book), `ui/` (Component Showcase), `authors/`, `meetups/`, `events/`, `ptd/` (admin views), `guide/` (style guides).

## Blog Post Conventions

> Full reference: **[Blog Posts Guide](docs/features/BLOG_POSTS.md)**

The blog hosts **community blog posts** (recaps, deep-dives, vertical announcements, speaker spotlights, technical guides). It is **separate** from the meetups collection — meetups have their own dedicated content type, listing, and detail pages.

**File naming:** `YYYY-MM-DD_slug.{md,mdx}` in `src/content/blog/{en,es}/`. Date prefix stripped from URLs. **Slugs MUST always be in English** — both `en/` and `es/` versions use the same English slug.

**Tags:** Flat `tags` array in frontmatter. Three tiers (primary / secondary / subtopic) resolved at build time from `src/content/tags/*.md`. Max 5 tags per post (1-2 primary + 0-3 secondary + 0-3 subtopic; max 3 subtopics; ≥ 1 primary required). Never auto-create tags without user approval — propose with [`/audit-taxonomy`](.agents/skills/audit-taxonomy/SKILL.md) and let the user approve.

**Series:** Posts reference `series: "{slug}"` and `seriesOrder: {n}`. Series defined in `src/content/series/`. **Series slugs MUST be in English** (e.g., `the-library-of-tomorrow`, not `la-biblioteca-del-manana`).

**Authors:** Posts reference `author: "{slug}"`. Authors are PTT contributors (organizers, speakers, community writers) defined as YAML in `src/content/authors/{slug}.yaml` with localized `role`/`bio` (`en`/`es`) and avatar at `public/images/authors/{slug}.webp`. Both EN and ES versions of a post must use the same `author` slug. Internal directory: `/internal/authors`.

**Resources section:** Include external links (docs, repos, tools). Do NOT list related articles or previous chapters — they appear in the series navigation below.

**Hero layouts:** `banner` (default, landscape), `side-by-side` (square), `minimal` (thumbnail), `none` (text-only). Set based on image aspect ratio.

**Demo posts:** In `_demo/` folders only. Never shown in listings/search. Accessible by direct URL in dev only.

**Images:** Stored in `public/images/blog/posts/{slug}/`. Hero: `hero.{ext}`. Use `pnpm run images:optimize` for staged images.

**New post workflow:** Use `/add-blog-post` skill (mandatory). Do not create blog post files manually.

## Meetups Conventions

> Full reference: **[Meetups Guide](docs/features/MEETUPS.md)** (created in Task 4 onwards)

**File naming:** `YYYY-MM-DD_slug.md` in `src/content/meetups/`. **Slugs MUST be in English.**

**Frontmatter:** `title`, `description`, `date`, `vertical` (Speaker School / La Biblioteca del Mañana / AI Channel / general), `format` (online / in-person / hybrid), `venue` (optional), `speakers` (array of slugs), `talks` (array of slugs, optional), `recordingUrl` (optional), `slidesUrl` (optional), `coverImage`.

**URL surface:** `/meetups` (timeline) + `/meetups/{slug}` (detail). English: `/en/meetups`, `/en/meetups/{slug}`. Spanish is unprefixed at `/`.

**New meetup workflow:** Use `/add-meetup` skill.

## Events & Pereira Tech Days Conventions

> Full reference: **[Events Guide](docs/features/EVENTS.md)** (created in Task 4 onwards)

**Events** are calendar items (workshops, hackathons, ad-hoc gatherings). Listed at `/events`.

**Pereira Tech Days** are the annual flagship conferences. Each year has:

- A content entry at `src/content/pereiraTechDays/{year}.{json,yaml}` containing the `brandKit` (palette, typography, hero motifs).
- A landing page at `/pereira-tech-days/{year}` (and `/es/pereira-tech-days/{year}`) wrapped by `EditionScope` so the kit applies only inside.
- Optional sub-routes for the schedule, sponsors, speakers, recap, etc.

**Slug rule:** Always English at the year level (e.g., `2024`, `2025`, `2026`). Per-edition slugs for nested routes also English.

## Speakers, Talks & Slides Linkage

- **Speakers** live in `src/content/speakers/{slug}.yaml` with localized `bio`, `role`, social links, avatar.
- **Talks** live in `src/content/talks/{slug}.yaml` (or `.md` for recap content) referencing one or more `speakers`, an optional `slides` slug, an optional `recordingUrl`, and the `event`/`meetup` it belongs to.
- **Slides** are managed by the existing slides system (`src/content/slides/{en,es}/`). A talk page embeds its deck via `<SlideEmbed deck={slidesEntry} />` (Task 13).

## Slides Conventions

> Full reference: **[Slides Guide](docs/features/SLIDES.md)**

**Three deck types:** `internal` (Reveal.js Markdown), `external-embed` (iframe), `external-link` (stub info page). All three share one `slides` Zod discriminated-union collection in `src/content.config.ts`.

**File naming:** `YYYY-MM-DD_slug.md` in `src/content/slides/{en,es}/`. **Slugs MUST be in English** on both languages.

**URL surface:** `/slides/<slug>` (and `/es/slides/<slug>`). Catalog at `/slides` and `/es/slides`.

**Reveal.js config:** Virtual canvas 1280×720 (16:9), base font 32px, scaled by Reveal to fit any viewport/projector. Palette derives from PTT global brand by default; per-edition decks may opt-in by setting `--slide-accent` inside `[data-edition-theme]`.

**Chrome UI:** Back-link (top-left) uses site logo on PTT dark background; toolbar (top-right) with language toggle, theme toggle, fullscreen.

**Asset isolation:** Reveal.js CSS/JS only loads on internal deck pages via `SlideLayout.astro`. Never import Reveal CSS in `MainLayout` or other layouts.

**Images:** Stored in `public/images/slides/<slug>/`. Hero: `hero.{ext}`.

**Hydration:** `RevealDeck.svelte` uses `client:only="svelte"` (documented exception to `client:visible` preference — Reveal needs DOM).

**New deck workflow:** Use `/add-slide-deck` skill (mandatory).

## Documentation Standards

Update docs after: adding components/pages, changing schemas, updating config, adding npm scripts, establishing patterns. See **[Documentation Guide](docs/DOCUMENTATION_GUIDE.md)**.

## Common Mistakes to Avoid

### DON'T:

1. Put interactive logic in `.astro` files (use Svelte)
2. Skip `client:*` directive for interactive Svelte components
3. Import `MainLayout` in page wrappers (it belongs inside `*Page.astro`)
4. Hardcode translatable text in templates
5. Create content without covering both Spanish (primary) and English
6. Use `client:load` when `client:visible` or `client:idle` would suffice
7. Add JS solutions when CSS can achieve the same result
8. Use `text-gray-400`, `dark:text-gray-400`, or `dark:text-gray-500` for body text (fails WCAG AA)
9. Use `role="menu"` for nav dropdowns (use disclosure pattern)
10. Skip heading levels (e.g., h1 → h3 without h2)
11. Forget `alt=""` on decorative images or `aria-label` on icon-only links
12. Use `MainLayout` for internal hub pages (use `InternalLayout` or `ShowcaseLayout`)
13. Add multilingual variants for internal pages (English-only, dev-only)
14. Reference `/internal/` pages from public pages
15. Name blog/meetup/slide files without date prefix (use `YYYY-MM-DD_slug.md`)
16. Put blog images outside `public/images/blog/posts/{slug}/` (or meetup images outside `public/images/meetups/{slug}/`, etc.)
17. Put demo posts outside `_demo/` folders
18. Write Spanish content without proper accents/tildes/ñ
19. List related articles or previous chapters in the Resources section when the post belongs to a series
20. **Leave placeholder content** — `[AUTHOR: ...]`, `[TODO: ...]`, `[TBD]`, or any bracketed "fill in later" text. Published content must be complete. Zero tolerance.
21. **Use Spanish slugs for blog posts, meetups, series, or PTD editions** — all slugs MUST be in English
22. **Override `--ptt-*` tokens outside `src/styles/global.css` or `[data-edition-theme]` scopes** — per-edition kits must be scoped; no inline `style="--ptt-primary: ..."`
23. **Let per-edition palette leak outside `/pereira-tech-days/{year}/*`** — header/footer/lang switcher/theme toggle must keep the global PTT brand even on edition pages
24. **Import Reveal CSS outside `SlideLayout`** — Reveal styles must not leak to non-deck routes
25. **Add a new top-level page without updating `src/middleware.ts`** — the middleware has a hardcoded allowlist (`KNOWN_ROOT_PATHS` / `KNOWN_EN_PATHS`). New top-level routes return 404 until added to the allowlist. See [Architecture → Middleware Allowlist](docs/ARCHITECTURE.md#middleware-allowlist-critical).
26. Use `--ptt-accent` for body text — it fails WCAG AA on `--ptt-bg`. Reserve for icons, large text, pills with `--ptt-bg-elevated`.

### DO:

1. Use Biome for linting (`pnpm run biome:check` before commits)
2. Use Svelte for interactive components with appropriate `client:*` directive
3. Support dark mode with Tailwind's `dark:` variant and PTT tokens
4. Use `@` path alias for imports
5. Use the Page wrapper pattern (thin wrappers + `*Page.astro`)
6. Create/update content in both Spanish (primary) and English
7. Use `text-gray-600 dark:text-gray-300` (or `text-ptt-secondary`) for secondary text (WCAG AA)
8. Include `width` and `height` on all `<img>` elements
9. Use date-prefix naming for blog posts, meetups, and slide decks (`YYYY-MM-DD_slug.md`)
10. Verify Spanish diacritical marks before committing
11. Ensure no placeholder content (`grep -rn '\[AUTHOR:\|\[AUTOR:\|\[TODO:\|\[TBD\]\|\[FIXME\]' src/content/` → zero matches)
12. Use discriminated union narrowing for deck type checks (`if (deck.data.type === 'internal')`)
13. Add both EN and ES versions for all blog posts, meetups, and slide decks
14. Wrap PTD edition pages in `EditionScope` and verify chrome stays on global PTT brand
15. Use `text-ptt`/`bg-ptt-bg`/`border-ptt-border` PTT tokens (Task 5) on new components

## Pre-Commit Checklist

- [ ] All code in English
- [ ] `pnpm run test` passes
- [ ] `pnpm run biome:check` passes
- [ ] `pnpm run astro:check` passes
- [ ] `pnpm run build` succeeds
- [ ] `pnpm run md:check` passes
- [ ] Dark mode works in new components
- [ ] Content in both Spanish (primary) and English
- [ ] Translation strings in both locale files
- [ ] Spanish content has correct diacritical marks
- [ ] No placeholder content (`[AUTHOR:`, `[TODO:`, etc.)
- [ ] Meta descriptions: 130-160 characters
- [ ] Accessibility: approved text contrast, image dimensions, heading hierarchy
- [ ] Performance: lightest hydration, minimal JS
- [ ] PTT tokens used (no leftover non-PTT design tokens)
- [ ] Per-edition palettes scoped to `[data-edition-theme]` only
- [ ] Commit message in English (conventional format)

## Skills & Agents

- **Skills** — Reusable procedures via slash commands: `quick-fix`, `doc-edit`, `pr-review-lite`, `fix-lint`, `write-tests`, `type-fix`, `refactor-safe`, `security-check`, `git-commit-push`, `translate-sync`, `add-blog-post`, `add-meetup`, `add-talk`, `add-slide-deck`, `add-event`, `add-ptd-edition`, `issue-certificates`, `promote-post`, `optimize-image`, `audit-post`, `audit-series`, `audit-taxonomy`, `audit-analytics`
- **Agents** — Specialized workers: `reviewer`, `executor`, `architect`, `security-auditor`, `i18n-guardian`, `content-writer`
- **Critical policy:** New blog posts MUST use `/add-blog-post`; new meetups MUST use `/add-meetup`; new talks MUST use `/add-talk`; new slide decks MUST use `/add-slide-deck`; new PTD editions MUST use `/add-ptd-edition`
- **Management:** `/skill-list`, `/agent-list`, `/skill-create`, `/agent-create`
- **Full catalog:** [Skills & Agents Catalog](.agents/docs/skills_agents_catalog.md)

### Execution Modes

| Mode | Support | Description |
|------|---------|-------------|
| Sequential | All agents | Default — tasks one at a time |
| Subagents | Claude Code | Helper agents within session |
| Team Agents | Claude Code only | Parallel instances with shared coordination |
| Orchestrator | All agents | Child DWPs in sub-repos |

See [Team Agents Reference](docs/technical/TEAM_AGENTS_REFERENCE.md) for details.

## Slash Commands (All Agents)

**This section applies to ALL agents** — Claude Code, OpenAI Codex, Cursor AI, Gemini, and any other assistant.

### How to Invoke Commands

| Agent | Prefix | Example |
|-------|--------|---------|
| **Claude Code** | `/` (native) | `/add-blog-post` |
| **OpenAI Codex** | `#` | `#add-blog-post` |
| **Cursor AI** | `#` | `#add-blog-post` |
| **Gemini / others** | `#` | `#add-blog-post` |

> **Why `#` for non-Claude agents?** Most AI CLIs (Codex, Cursor) intercept `/` as their own system commands. Using `#` avoids interception. You can also write the command name in plain text: "run add-blog-post".

When a command is invoked (via `/`, `#`, or by name), the agent MUST:

1. **Look up** the command in **[Commands Reference](.agents/docs/COMMANDS_REFERENCE.md)** to find its procedure file
2. **READ** the linked procedure file completely
3. **FOLLOW** its step-by-step instructions exactly
4. **DO NOT** improvise or skip steps — the procedure file IS the spec

> **If a user prompt starts with `#`** (e.g., `#add-blog-post`, `#quick-fix`), treat it as a command invocation — look up the command name (without `#`) in the [Commands Reference](.agents/docs/COMMANDS_REFERENCE.md) and execute its procedure.

## Conventional Commits

**Format:** `<type>(<scope>): <description>`

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`

**Common scopes:** `brand`, `meetups`, `events`, `ptd`, `verticals`, `speakers`, `talks`, `blog`, `slides`, `i18n`, `a11y`, `seo`, `aeo`, `forms`, `community`, `home`, `nav`

Examples:

- `feat(brand): bootstrap PTT v3.0.0 brand & design system`
- `feat(meetups): add monthly meetup timeline + detail pages`
- `feat(ptd): add Pereira Tech Day 2024 edition with brandKit`
- `fix(a11y): resolve contrast on navigation dropdown`
- `docs: rewrite documentation for pereiratechtalks.org v3.0.0`
