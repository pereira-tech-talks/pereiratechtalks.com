---
title: "Behind dailybot.com's Astro migration: the engineer's view"
description: "I led dailybot.com's migration from a visual-editor CMS to Astro. The team's story is on the dailybot.com blog. Here's the engineering underneath it."
pubDate: "2026-04-20"
heroLayout: "none"
tags: ["portfolio", "tech", "web-development", "dailybot", "astro"]
keywords:
  - "dailybot astro migration engineer"
  - "astro content collections multilingual case study"
  - "markdown twin AEO pipeline astro"
  - "CI floor non-engineers ship astro"
  - "cursor as visual CMS"
  - "rebuild vs port CMS migration"
  - "astro 700 pages 3 languages"
draft: true
---

Over the last six weeks I led the migration of [dailybot.com](https://www.dailybot.com) from a visual-editor CMS to [Astro](https://astro.build). The team's side of that story is on the DailyBot blog: [How we migrated dailybot.com to Astro](https://www.dailybot.com/blog/how-we-migrated-dailybot-to-astro/). That piece is the "we" — why we moved, what the new pace feels like, what it changed for the company.

This is the "I". The engineering underneath it. The scaffolding that let four non-engineers ship to production without me in the loop, and the specific pieces I'd tell another engineer to build if they were about to do the same migration.

I've already made the long argument for [Astro and Svelte](/blog/astro-and-svelte-the-future-of-web-development/) on this blog. I'm not going to re-argue it here. If you want the "why Astro", read that one. This post is the "how I built the floor".

---

## The shape of the problem I was handed

Here's what was on my desk at the end of Q1:

- **16 page types × 3 languages ≈ 700 pages per language.** Blog, academy, help center, integrations, templates, changelog, careers, legal pages, developers, and more — each with its own shape.
- **A full rebrand landing in the same window.** New identity, new type ramp, new spacing, a redrawn component library. Not before the migration, not after — during.
- **A team of five: one engineer, four non-engineers.** A product manager, a designer, a growth lead, and a content lead. The migration wasn't going to work if I was the bottleneck on every change.
- **One quarter.** That was it.

The gap wasn't performance — the old site was fine. The gap was velocity. Every other surface in the company had started moving at agent speed. The marketing site moved at CMS speed. A layout tweak that was five minutes in our product app was a multi-day exercise in the visual editor. That's the problem I was actually solving.

---

## What I optimized for, and what I did not

The most important call I made early was **rebuild, don't port**. Component-for-component translation would have preserved decisions we already wanted to revisit. We kept URLs and content; we rebuilt everything else. I'd made a much smaller version of this call when I [built my personal site from scratch](/blog/building-xergioalex-website/) — a one-person site is a very different animal from a five-person, 700-page one, but the instinct was the same: if you're going to do the work, do the rebuild.

The second call was framing the job. My job wasn't to build the prettiest site. It was to **build the floor** — the content model, the schemas, the CI, the onboarding — so that four other people could stand on it and ship. The ceiling would take care of itself. I spent most of the six weeks on the floor.

I did not chase: a custom visual page builder, a bespoke authoring DSL, or any "magic" that would have to be maintained forever. Astro + TypeScript + Zod covered every authoring need we actually had.

---

## Collections as the content model

The single most valuable thing I built is also the least glamorous: a `src/content.config.ts` with **12 typed Astro Content Collections**, one per surface — `blog`, `series`, `changelog`, `tags`, `templates`, `academy`, `integrations`, `skills`, `careers`, `helpCenter`, `pages`, `authors`. Each one has its own Zod schema. Each entry — a blog post, a help article, an integration page — is a file on disk with frontmatter validated at build time.

This is the move that paid back the migration cost. At 700 pages per language, the question "are the three languages in sync?" stops being something a human reviews in a spreadsheet and becomes a **compile error**. Miss a `description` in Portuguese? Build fails. Misspell a `tag`? Build fails. Forget a hero image on a new academy article? Build fails. Every content invariant I used to police by hand, the schema polices for me now — and for every non-engineer editing files on their own.

I've written about this pattern at a smaller scale in [Building a multilingual website](/blog/building-multilingual-website/). Same pattern. Different scale. Going from 2 languages × one site type to 3 languages × 16 surfaces is where the schema stops being "nice" and starts being the only way you'd ever catch drift.

One honest thing: getting all twelve schemas right took longer than I budgeted. Not because the schemas are hard — they aren't — but because every schema choice constrains what editors can author. Too loose and you catch nothing; too strict and you create friction for the people you're trying to enable. I rewrote the blog schema three times before it felt right.

---

## The markdown-twin pipeline

Every HTML page on dailybot.com also ships as clean markdown. Request any URL with `Accept: text/markdown`, or just append `.md` to the path, and you get the same page as plain markdown — the format AI agents read most naturally:

```bash
curl -H 'Accept: text/markdown' https://www.dailybot.com/blog/how-we-migrated-dailybot-to-astro/
curl https://www.dailybot.com/blog/how-we-migrated-dailybot-to-astro.md
```

Two equivalent ways to retrieve the same page. Agents don't have to parse HTML; humans never see the difference.

The piece that makes this safe to rely on is `scripts/check-md-parity.mjs`. It walks every HTML route the build produces and asserts a matching markdown twin exists for it. It runs in CI on every PR. If a PR adds a new page type and forgets to wire up the markdown version, the build fails — before anything hits production.

I've written the concept side of this in [AEO: markdown for agents](/blog/aeo-markdown-for-agents/). What I want to flag here is the pipeline discipline: a feature like "every page has a markdown twin" only stays true if something enforces it automatically. The second you rely on a checklist, you've lost. `check-md-parity` is three hundred lines of boring glue. It's also the reason dailybot.com scored a straight 100 on [isitagentready.com](https://isitagentready.com/) without any scramble at the end of the migration — the pipeline had already been quietly paying the tax for months.

---

## The CI floor that let non-engineers ship

This is the one I'm proudest of. It's also the one you'd never see from outside.

Every PR on dailybot.com — mine, the PM's, the designer's — has to pass the same pipeline before it can merge:

1. TypeScript type check.
2. Biome lint + format (one tool for both — the reasons [I replaced ESLint and Prettier with Biome](/blog/why-i-ditched-eslint-prettier-for-biome/) apply here tenfold).
3. Vitest test suite.
4. Lighthouse CI run against the build, enforcing a score **floor** on performance, accessibility, best practices, and SEO.
5. A clean production Astro build.

The Lighthouse floor is the subtle one. We don't care about the ceiling — if dailybot.com scores a straight 100 one week and a 98 the next, that's still a fast site. What I care about is that a PR can't regress the floor. The moment a render-blocking script sneaks into a layout or somebody introduces a missing-alt-text regression, the check fails and the PR stops.

This is what made handing the keys to the PM not reckless. The worst a bad PR can do is fail a check and ask for a fix. Nothing ships to production that didn't clear the same bar my own work has to clear. And honestly, that floor caught me at least as often as it caught anyone else — once on a commit that would have shipped a slow mobile interaction on the pricing page, which I'd never have caught by eye.

A full CI run takes about 100 seconds. That number is the whole reason the workflow feels fast instead of bureaucratic.

---

## Cursor-as-CMS, in practice

The hardest technical question of the migration was never a technical question. It was: *how do four non-engineers ship through a git repo every day?*

The answer was Cursor. Not as an IDE — as the literal visual editor for the site.

The onboarding was two hours. A short session on git basics, a short session on how Cursor works, a short session on how to **brief** an agent so the instruction actually lands. Then helping each person set up their local environment. That's it. The next day, all three of them — PM, designer, growth lead — were opening pull requests.

What made it click wasn't the editor. It was the pattern we gave them: open the live preview next to the editor, use the inspector to point at the specific element, tell the agent what to change. Underneath every click was the actual codebase, and every edit was a diff. The "[Astro is still a CMS]" reframe in the DailyBot post isn't a reframe — it's literally what the working surface looks like all day.

Three pieces of scaffolding made that work at team scale:

- **`docs/AGENTS.md`** — one source of truth for every agent working on the repo. Project conventions, import order, voice guide, the works. Every agent, every engineer, every non-engineer reads from the same document. I keep it in sync across collaborators obsessively; it's the single highest-leverage doc in the repo.
- **`scripts/generate-agent-skills-index.mjs`** — auto-generates a machine-readable index of every skill and agent in the repo so coding agents can discover them without me telling them what to look for.
- **A catalog of project-specific skills** — `add-blog-post`, `translate-sync`, `optimize-image`, `audit-post`, and a dozen more. Every recurring task is encoded as a skill. The non-engineers don't memorize procedures; they invoke the skill.

If I'd tried to run this migration two years ago, without agents capable of translating natural-language briefs into diffs, none of this would have worked. I'd have been the bottleneck. The non-engineers would have waited on me, and we'd have shipped the site in six months instead of six weeks. This is the concrete case study of what I've been writing about in [From programmer to orchestrator](/blog/from-programmer-to-orchestrator/) and [The art of directing agents](/blog/the-art-of-directing-agents/). In the migration, the theory became the floor.

---

## What I'd do differently

Two honest calls, looking back.

**I should have built `check-md-parity` before writing any page, not after finding drift.** I added it in week three, after spotting an English blog post without a Spanish twin that had been live for days. The fix was thirty minutes; the drift would never have happened if the script had been in CI from day one. Classic "the tool existed, I just didn't build it early enough" mistake.

**I should have put the Lighthouse floor in CI from week one, not week two.** We shipped one iteration of the rebrand that quietly regressed mobile performance on the templates index, and I only caught it when I manually ran Lighthouse mid-week. Nothing broken, nothing public, but an hour of cleanup I'd have avoided with the floor in place from the start.

Neither of these are interesting enough to have made the company post. They're the kind of thing an engineer only tells another engineer.

---

## The deliverable under the deliverable

The real output of this migration wasn't the new dailybot.com. It was the system that lets four non-engineers ship to production without me in the loop.

On a normal Tuesday, the PM opens a PR with a new changelog entry. The designer updates the spacing on a pricing tier. The growth lead tweaks copy on a landing page. Each one passes CI, hits preview, gets reviewed, merges, goes live — sometimes in the same afternoon, usually without a single message to me.

That is the migration that mattered. The URL didn't change; the site looks different but behaves the same; the Lighthouse score went up a few points. None of that is the story. The story is that the shape of who can move our public surface changed, because the agents finally got good enough to sit between non-engineers and a git repo and translate one to the other. I've been writing about [this shift](/blog/from-programmer-to-orchestrator/) for a year. Running this migration is the first time I've watched it happen at team scale.

If your team is where we were at the end of 2025 — a visual-editor CMS that's slower than the pace of the rest of your company — the call isn't really about Astro. It's about whether you want one engineer moving your public surface, or everyone.

Let's keep building.

---

## Resources

- [DailyBot company post — How we migrated DailyBot to Astro](https://www.dailybot.com/blog/how-we-migrated-dailybot-to-astro/)
- [Astro](https://astro.build/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [isitagentready.com](https://isitagentready.com/)
