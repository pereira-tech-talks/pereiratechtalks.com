# Product Specification

## Overview

**Pereira Tech Talks** (PTT) is the bilingual technology community of Pereira, Risaralda, Colombia. The website at `pereiratechtalks.org` is the public face and operational backbone of the community — a platform for monthly meetups, the flagship Pereira Tech Day annual conference, the Speaker School, the verticals (La Biblioteca del Mañana, AI channel, and others), and the bilingual blog and slide deck library that comes out of all of it.

This document covers v3.0.0 — a full rewrite that replaced the previous PTT site (xergioalex.com-based clone) with a community-first, AI-agent-friendly, bilingual platform built on the Astro 7 / Svelte 5 / Tailwind 4 stack.

## Brand Positioning

**Primary identity:** Bilingual technology community of Pereira, Risaralda, Colombia — with international presence.

PTT is positioned as the **community of builders** for the Eje Cafetero region: a place where developers, designers, founders, students, and curious people meet to learn together, present what they're working on, and ship things in public. It is intentionally bilingual (Spanish and English) so that the work that happens in Pereira is legible to the rest of the world from day one.

**Value propositions (one per audience):**

- **For local builders:** A safe, friendly stage to present your first talk, level up your craft, and find collaborators within walking distance.
- **For students and career changers:** A bilingual learning ladder — meetups → Speaker School → talks → mentorship — that is free and merit-based.
- **For experienced engineers:** A peer-level community to share advanced topics (AI agents, distributed systems, security, infrastructure) without leaving the city.
- **For sponsors:** A high-signal community of pre-screened, English-speaking technical talent in Colombia.
- **For international speakers and partners:** A trustworthy local host with a track record of professionally produced events and bilingual content.

## Vision

Make Pereira a recognized hub of the global technology conversation — a place where world-class engineering happens in Spanish and English at the same time, and where the next generation of Colombian builders learns the craft in public.

The website must:

- Communicate, in 3 seconds, that PTT is a real, active, professional bilingual technology community of Pereira, Risaralda, Colombia.
- Make every public-facing piece of community content (events, talks, slides, blog posts, channels, sponsors) discoverable, citable, and accessible to AI agents.
- Render correctly under per-edition branding for Pereira Tech Day editions (each year ships its own brand kit).
- Maintain Lighthouse 100 across Performance / Accessibility / Best Practices / SEO.
- Be operable by a small staff of community organizers without engineering bottlenecks.
- Be AI-agent-driven: every public page has a Markdown twin, every collection has a JSON or Markdown index, and the internal hub documents the running system for the agents that maintain it.

## Target Audience

1. **Local builders and students** in Pereira and the Eje Cafetero — the primary in-person audience.
2. **The Spanish-speaking LATAM tech community** — secondary audience that consumes content remotely.
3. **International speakers, sponsors, and partner communities** — third audience that needs a polished English experience.
4. **AI agents and answer engines** — explicit audience: the site is engineered for AEO from the ground up.
5. **Press and recruiters** — looking for talent and stories from a credible bilingual source.

## Information Architecture

See [INFORMATION_ARCHITECTURE.md](INFORMATION_ARCHITECTURE.md) for the canonical URL surface, navigation, and content relationships. Top-level sections:

- **Home** (`/`, `/es/`) — value proposition, what PTT is, verticals, upcoming events, recent meetups, blog preview, sponsors strip, contact.
- **About** (`/about`, `/es/sobre-nosotros`) — who we are, mission, history, team.
- **Pereira Tech Days** (`/pereira-tech-days`, `/pereira-tech-days/{year}`) — flagship annual conference; per-edition brand kit.
- **Meetups** (`/meetups`, `/en/meetups`) — monthly community gatherings; recap, photos, slides, talks.
- **Events** (`/events`, `/es/eventos`) — special one-off events that aren't Tech Days or meetups.
- **Verticals** (`/verticals/...`) — La Biblioteca del Mañana, AI channel, Speaker School, etc.
- **Speaker School** (`/speaker-school`, `/es/escuela-de-ponentes`) — first-class section: how to become a PTT speaker.
- **Blog** (`/blog`, `/es/blog`) — bilingual articles, series, tags, search.
- **Slides** (`/slides`, `/es/slides`) — Reveal.js decks, external embeds, external links.
- **Speakers** (`/speakers`) — bios + talks index.
- **Contributors** (`/contributors`, `/es/contribuyentes`) — community contributors.
- **Sponsors** (`/sponsors`, `/es/patrocinadores`) — current and historical sponsors.
- **Channels** (`/channels`, `/es/canales`) — official communication channels.
- **Call for Speakers** (`/call-for-speakers`, `/es/convocatoria-de-ponentes`) — always-open form.
- **Contact** (`/contact`, `/es/contacto`).

## Key Features

### 1. Homepage

**Purpose:** Pass the 3-second test and route visitors to the right section.

**Sections (in order):**

- **Hero** — bilingual headline ("Pereira Tech Talks"), one-line value proposition, primary CTAs (Next meetup · Submit a talk).
- **What we do** — three to four cards summarizing meetups, Pereira Tech Days, Speaker School, La Biblioteca del Mañana.
- **Upcoming** — next event (countdown if within 30 days), or the most recent recap when nothing upcoming.
- **Latest meetups** — three most recent recaps with date, theme, and photo.
- **Verticals** — featured strip explaining the active programs.
- **Blog preview** — three latest posts.
- **Sponsors** — logos strip with link to `/sponsors`.
- **Channels** — short description of communication channels with quick join.
- **CTAs** — Submit a talk · Become a sponsor · Subscribe.

### 2. Pereira Tech Days

**Purpose:** Showcase the flagship annual conference and preserve the history of past editions.

**Per-edition pages:** `/pereira-tech-days/{year}` — each edition can ship its own `brandKit` (palette, typography, hero assets) that overrides PTT defaults via `[data-edition-theme="{year}"]`. Speaker grid, schedule, sponsors of that edition, recap, and embedded slide decks.

### 3. Meetups

**Purpose:** Document every monthly meetup as a first-class artifact, separate from blog posts.

Each meetup entry contains: theme, date, venue, attendance, recap, photos, talks (with embedded slide decks where available), speakers, sponsors of that meetup.

### 4. Speaker School

**Purpose:** Lower the barrier to giving a first talk in Pereira.

A first-class vertical with curriculum, mentor list, application form, and a public list of graduates. A pipeline that funnels into the Call for Speakers.

### 5. La Biblioteca del Mañana

**Purpose:** PTT's flagship learning vertical — the community's reading and study group around emerging technology.

### 6. AI Channel

**Purpose:** Specialized vertical for AI / agent / LLM topics — recurring meetups and a dedicated content stream.

### 7. Blog

**Purpose:** Bilingual long-form articles from community contributors.

- Content Collections with strict schema (`title`, `description`, `pubDate`, `heroImage`, `tags`, `series`, `seriesOrder`, `author`).
- Date-prefixed filenames, English slugs (even for Spanish posts).
- Language-sharded search index (`/api/posts-en.json`, `/api/posts-es.json`).
- Series support with auto-rendered navigation.
- Hero image layouts: banner, side-by-side, minimal, none.

### 8. Slides

**Purpose:** Library of every deck presented at PTT events.

Three deck types in one collection (`internal` Reveal.js, `external-embed`, `external-link`). Decks are linked from talk and meetup pages. The Reveal.js theme inherits PTT brand tokens.

### 9. Call for Speakers

**Purpose:** Always-open submission funnel.

Public bilingual form, transparent review process documented in `docs/CALL_FOR_SPEAKERS.md`.

### 10. Sponsors

**Purpose:** Make sponsorship legible and transparent.

Tier model documented in `docs/SPONSORSHIP.md`. Public list of current and historical sponsors, what each sponsorship paid for, what we delivered.

### 11. Contributors

**Purpose:** Recognize the people who make PTT happen.

Public list of organizers, mentors, speakers, and recurring contributors.

### 12. Channels

**Purpose:** Make it obvious where the community talks.

Inventory of official PTT channels (Discord, X, Instagram, LinkedIn, GitHub, YouTube, etc.) with a description of what flows through each.

### 13. Agent-Friendly Markdown Endpoints

**Purpose:** Make every page natively legible to AI agents and LLMs.

- Native Markdown twins for every public HTML page (`.md` URLs).
- Content negotiation via `Accept: text/markdown` header (Cloudflare middleware).
- Discovery via `llms.txt`, `llms-full.txt`, `robots.txt`, `/.well-known/api-catalog`, `/.well-known/mcp/server-card.json`, `/auth.md`, origin-aware OAuth PRM/AS metadata, WebMCP tools, and DNS-AID `_agents` records.
- See [Markdown for Agents](aeo/MARKDOWN_FOR_AGENTS.md).

### 14. Multilingual Support

**Purpose:** PTT is bilingual by default.

- Spanish at `/` (primary), English at `/en/`.
- All slugs in English (filenames, series IDs, image directories) — even for Spanish content.
- Spanish content must use proper diacritical marks (ñ, á, é, í, ó, ú, ü, interrogative accents).
- All UI strings live in `src/lib/translations/{en,es}.ts` — no hardcoded user-visible text.

## Design Principles

### Visual Design

1. **Brand-led, not personal-led** — the brand is PTT, not any individual.
2. **Per-edition flexibility** — each Pereira Tech Day edition can ship its own design without breaking the global system.
3. **Dark mode parity** — every page must work equally well in light and dark.
4. **Mobile-first responsive** — most local visitors arrive on mobile.
5. **Bilingual visual hierarchy** — copy length differs between EN and ES; layouts must accommodate both.

### Messaging Principles

1. **Plural voice** — "we", not "I". PTT speaks for the community.
2. **Local pride, global posture** — proudly Pereira, professionally international.
3. **Specific over abstract** — exact dates, exact venues, exact talk titles.
4. **Anti-AI-slop** — see `docs/WRITING_VOICE_GUIDE.md` for the vocabulary blocklist and voice rules.

### Color Palette & Typography

See **[Brand Guide](BRAND_GUIDE.md)** for the complete PTT v3.0.0 palette (deep teal/petroleum primary, amber accent, deep green-teal dark backgrounds, full state colors), typography (Atkinson Hyperlegible), and the per-edition brand kit contract.

**Quick reference:**

```css
/* Light mode */
--color-ptt-primary: #1F6F73;        /* Deep teal — CTAs, links, focus */
--color-ptt-accent: #E8A33D;          /* Amber — large text, pills */
--color-ptt-bg: #FAFBFB;
--color-ptt-text: #0F2A2C;

/* Dark mode */
--color-ptt-primary: #3FA8AD;
--color-ptt-bg: #08191A;              /* Deep green-teal */
--color-ptt-text: #E8F0EF;
```

## Technical Requirements

### Performance

- **Static Site Generation** — pre-rendered HTML on Cloudflare Pages.
- **Partial Hydration** — Svelte islands only where interactivity is needed; default to `client:visible` / `client:idle` over `client:load`.
- **Optimized Assets** — WebP heroes, prebuild image pipeline (`pnpm run images:webp`), purged CSS via Tailwind 4.
- **Lighthouse 100** — verified by `pnpm run lighthouse` and a CI budget.

### SEO & AEO

- **JSON-LD structured data** on every page (Organization, Event, BlogPosting, BreadcrumbList, …).
- **Hreflang** alternate links for every bilingual page.
- **Markdown endpoints** for every public page.
- **OpenAPI** spec at `/openapi.json` describing public JSON endpoints.
- **MCP server card** at `/.well-known/mcp/server-card.json`.

### Accessibility

- **WCAG 2.1 AA** baseline; AAA where possible (text on `--ptt-bg`).
- Approved text colors only (`text-gray-600 dark:text-gray-300` or `text-ptt-text-secondary`); no `text-gray-400/500`.
- Image dimensions on every `<img>`.
- Disclosure pattern for nav dropdowns (not `role="menu"`).

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge) — current and previous major version.
- Mobile browsers (iOS Safari, Chrome Mobile).
- No IE11 support.

## User Flows

### Visitor → Next Meetup

```
Home
 └── Upcoming card
       └── Meetup detail
             ├── RSVP / channel link
             ├── Speakers and talks
             └── Slide decks (when available)
```

### Visitor → Submit a Talk

```
Home / Speakers / Speaker School
 └── Call for Speakers
       ├── Bilingual form
       └── docs/CALL_FOR_SPEAKERS.md (linked)
```

### Pereira Tech Day visitor

```
/pereira-tech-days
 ├── Latest edition (per-edition theme active)
 │     ├── Speakers
 │     ├── Schedule
 │     ├── Sponsors of that edition
 │     └── Recap / embedded decks
 └── Archive — every past edition with its own theme
```

### Agent / LLM crawler

```
/llms.txt → list of canonical URLs
 ├── /openapi.json → JSON endpoints
 ├── /.well-known/mcp/server-card.json
 └── /<page>.md → Markdown twin of each page
```

## Content Strategy

### Tag Taxonomy

Three-tier taxonomy (primary / secondary / subtopic) defined in `src/content/tags/*.md`. See [docs/features/BLOG_POSTS.md](features/BLOG_POSTS.md). Max 5 tags per post. Never auto-create tags — propose with `/audit-taxonomy` and let a human approve.

### Content Cadence

- **Meetups:** monthly recaps published within 7 days of the event.
- **Pereira Tech Day:** annual; per-edition microsite published 4+ weeks before the event, recap within 30 days.
- **Blog posts:** opportunistic, driven by community contributors.
- **Slide decks:** uploaded the day of (or before) the talk.

### Editorial Standards

- Every published post passes the `/audit-post` skill before merging.
- Every series passes `/audit-series`.
- Spanish content always carries proper orthography (validated by automated grep in CI).
- No placeholder content in any merged post.

## Future Enhancements

1. **Dedicated mobile app** for event check-in and live polls.
2. **Talk video archive** (currently external-link only).
3. **Mentor matching** for Speaker School graduates.
4. **Sponsor self-service portal** for logo updates and reporting.
5. **Multi-edition theme runtime improvements** — preview theme switcher in the internal hub.
6. **Additional languages** — Portuguese is the natural next step given the LATAM scope.

## Success Metrics

### Brand Effectiveness

- **3-second test:** Visitors immediately understand "PTT is a real, professional bilingual technology community of Pereira, Colombia, and there is something happening soon."
- **Internal hub completeness:** every page renders correctly in light and dark; every brand decision has a Brand Book entry.

### Community Engagement

- Monthly meetup attendance.
- Number of new speakers per quarter.
- Speaker School completion rate.
- Cross-language engagement ratio (EN vs ES sessions).

### Technical Performance

- Lighthouse 100 across all four scores on the homepage and a representative blog post.
- Build time under 60 seconds.
- Zero `xergioalex` references in production source.

### Content Health

- Blog parity (every post EN+ES).
- Meetup recap timeliness (within 7 days).
- Slide deck attachment rate (every talk eventually gets a deck).

## Constraints

### Technical

- **Static hosting** — Cloudflare Pages, no server runtime.
- **Build time** — must stay reasonable as the content base grows.
- **Bundle size** — minimize JavaScript payload to protect Lighthouse.

### Content

- **Language** — code, comments, and internal docs in English; user-facing content bilingual.
- **Maintenance** — small staff of volunteer organizers; AI agents must be able to perform routine maintenance.

## Deployment

### Hosting

- **Platform:** Cloudflare Pages.
- **Domain:** `pereiratechtalks.org`.
- **SSL:** Cloudflare-issued.

### Process

1. Build with `pnpm run build`.
2. Output to `dist/`.
3. Cloudflare Pages serves from `dist/`.
4. Internal pages (`/internal/*`) are excluded from production via post-build deletion, sitemap filter, and `noindex` meta — verified by CI.

## Related Documentation

- [Information Architecture](INFORMATION_ARCHITECTURE.md) — Canonical URL surface and routing.
- [Brand Guide](BRAND_GUIDE.md) — PTT brand contract.
- [Architecture](ARCHITECTURE.md) — Technical implementation.
- [Development Commands](DEVELOPMENT_COMMANDS.md) — Build scripts.
- [Standards](STANDARDS.md) — Coding conventions.
- [README](../README.md) — Project overview and quick start.
