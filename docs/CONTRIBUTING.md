# Contributing to Pereira Tech Talks

Pereira Tech Talks is built and run by **the community**, for **the community**. There are many ways to contribute beyond writing code — this document outlines all of them and how to get involved.

> By participating in this community, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Ways to Contribute

### 1. Speak at a meetup or Pereira Tech Day

The community is fueled by people sharing what they have learned. We accept talks on:

- Software engineering (any stack, any level)
- Data, AI, and agents
- Product, design, and developer experience
- Career, leadership, mentoring, and craft
- Open-source projects, side-projects, internships
- The future of work, ethics, sustainability of tech

**Formats:** lightning talk (5–10 min), regular talk (20–30 min), workshop (60–90 min), panel (45 min).

Apply through the **Call for Speakers**: [`/cfs`](https://pereiratechtalks.org/cfs) or read [docs/CALL_FOR_SPEAKERS.md](./CALL_FOR_SPEAKERS.md).

### 2. Write a community blog post

The blog hosts recaps, deep-dives, vertical announcements, speaker spotlights, and technical guides. We welcome:

- Recaps of meetups and Pereira Tech Days
- Deep-dives into talks you gave (turning a talk into a written piece)
- Tutorials, retrospectives, and case studies
- Profiles of community members and contributors
- Announcements from verticals (Speaker School cohorts, La Biblioteca del Mañana picks, etc.)

**Workflow:** open an issue with the proposed title and 1-paragraph abstract, get a community editor assigned, then use the `/add-blog-post` skill if you have AI-agent access. Otherwise, follow the manual workflow in [docs/features/BLOG_POSTS.md](./features/BLOG_POSTS.md).

**Bilingual requirement:** every post ships in both Spanish and English. The Spanish version is primary.

### 3. Mentor in Speaker School

Speaker School is our mentorship track for first-time speakers. As a mentor you help one or two mentees prepare a talk: structure, narrative, slide design, dry-runs, on-stage delivery.

**Time commitment:** ~6–8 hours over 6–8 weeks per mentee.

**To volunteer:** email <speakers@pereiratechtalks.org> with a brief intro and the topics you can mentor on.

### 4. Curate La Biblioteca del Mañana

La Biblioteca del Mañana is our reading group on tech books, papers, and long-form essays. Vertical leads run monthly sessions (online + occasional in-person at the public library).

**To contribute:** propose a book/paper, lead a session, or write a session recap.

### 5. Contribute to the AI / Agents channel

The AI channel runs talks, demos, and pair-programming sessions on AI/agents engineering. Contributions: live demos, post-mortems, "agent of the month" spotlights.

### 6. Open-source on the website

This repository powers `pereiratechtalks.org`. We welcome:

- Bug fixes, accessibility improvements, performance wins
- New components, design tokens, animations
- New skills/agents under `.agents/`
- Test coverage improvements

**Read first:** [`AGENTS.md`](../AGENTS.md), [docs/ARCHITECTURE.md](./ARCHITECTURE.md), [docs/STANDARDS.md](./STANDARDS.md), [docs/BRAND_GUIDE.md](./BRAND_GUIDE.md).

### 7. Sponsor

Help fund venues, snacks, swag, recording gear, and speaker travel. See [docs/SPONSORSHIP.md](./SPONSORSHIP.md) for tiers and benefits, or email <sponsors@pereiratechtalks.org>.

### 8. Help with operations

We always need hands for: door check-in, livestream production, photography, social media, post-event content production, translation review, accessibility review, recording editing.

Email <pereiratechtalks@gmail.com> with the role you'd like to help with.

## Code Contribution Workflow

### Setup

```bash
git clone https://github.com/pereira-tech-talks/pereiratechtalks.org.git
cd pereiratechtalks.org
pnpm install                 # requires Node 24.15.0+ and pnpm 11.x
pnpm run dev                 # http://localhost:8888
```

### Branching

- Default branch: `main` (production-deployed)
- Active feature branches: `feat/<short-description>` or `fix/<short-description>`
- Long-running rewrites: `feat/<theme>-v3` (e.g. `feat/rewrite-to-pereira-tech-talks-v3`)

### Commits

Follow **Conventional Commits**: `<type>(<scope>): <description>`.

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`.

**Common scopes:** `brand`, `meetups`, `events`, `ptd`, `verticals`, `speakers`, `talks`, `blog`, `slides`, `i18n`, `a11y`, `seo`, `aeo`, `forms`, `community`, `home`, `nav`.

Examples:

- `feat(meetups): add monthly meetup timeline page`
- `fix(a11y): resolve focus ring on language switcher`
- `docs(brand): document per-edition kit contract`

### Pull Requests

1. Fork the repo (or push a branch if you have write access).
2. Open a PR against `main` with a clear title and description: **what** changed, **why**, and **how to test**.
3. Make sure CI passes:
   - `pnpm run biome:check`
   - `pnpm run astro:check`
   - `pnpm run test`
   - `pnpm run build`
   - `pnpm run md:check`
4. Request review from at least one community organizer.
5. Address feedback. Squash if requested.
6. We merge with **squash-and-merge** to keep `main` history clean.

### Style

- All code, comments, and documentation in **English**.
- All public content (UI strings, blog posts, meetup descriptions) in **Spanish + English**, Spanish primary.
- Use **Biome** for lint/format. Do not use ESLint or Prettier.
- Follow the **Page Wrapper Pattern** (see [`AGENTS.md`](../AGENTS.md) §4 of Architecture Patterns).
- Use **PTT design tokens** (`--ptt-primary`, `text-ptt`, `bg-ptt-bg`, etc.). Never hardcode HEX values outside `src/styles/global.css`.
- Use the **`@`** path alias for internal imports.

## Recognizing Contributors

We maintain a public **[Contributors directory](https://pereiratechtalks.org/contributors)** built from `src/content/contributors/`. Every contributor — code, content, mentor, volunteer, sponsor — gets recognized there.

If you've contributed in any form and don't see yourself listed within two weeks of your first contribution, please email <pereiratechtalks@gmail.com> with your name, role, and a 1-paragraph bio.

## Questions?

- General questions: <pereiratechtalks@gmail.com>
- Speaker / talk: <speakers@pereiratechtalks.org>
- Sponsorship: <sponsors@pereiratechtalks.org>
- Code of Conduct concerns: <conduct@pereiratechtalks.org>

A user-facing public version of this document lives at `/contributing` (EN) and `/es/contribuir` (ES).
