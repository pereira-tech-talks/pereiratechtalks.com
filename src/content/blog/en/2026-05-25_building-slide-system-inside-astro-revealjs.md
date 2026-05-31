---
title: "Building a Multilingual Slide System Inside Astro with Reveal.js"
description: "How I built a two-type slide deck catalog inside my Astro website — discriminated unions, AEO twins, asset isolation, and live theme sync."
pubDate: 2026-05-25T11:00:00Z
tags: ["web-development", "talks", "astro", "svelte", "portfolio"]
series: "slides-as-code"
seriesOrder: 2
heroImage: "/images/blog/posts/building-slide-system-inside-astro-revealjs/hero.webp"
heroLayout: side-by-side
relatedSlide: "demo-revealjs-features"
draft: false
keywords: [astro slides, reveal.js astro integration, slides as content, discriminated union schema, AEO markdown twins, presentation system]
---

After [researching the slides-as-code tools available to developers today](/blog/best-slides-as-code-presentation-tools) —Reveal.js, Slidev, Marp, Spectacle, and a handful more— I chose [Reveal.js](https://revealjs.com) to build my site's presentation system.

The goal was concrete: I wanted my talks to live in the same place as my blog. Not scattered across Google Slides, a PDF parked somewhere, and an external domain, but inside my own site and treated as first-class content: same Content Collection, same i18n, same SEO as any post.

There was a second condition: the system had to be drivable by AI agents. If slides are plain text —`.md` files in the repo— an agent can generate one, reorder a section, or translate an entire deck the same way it edits any other file, and I'm left with what actually matters: the narrative.

This post is the case study of how I built it: the architecture decisions, the two types of presentations the system supports, and the problems that only showed up once I started using it in front of real audiences.

## Why Reveal.js?

The full tool-by-tool comparison lives in [a separate breakdown of the slides-as-code options](/blog/best-slides-as-code-presentation-tools). What I care about here is the other half: why Reveal fit my site when the others didn't. And it almost all comes down to one distinction: **Reveal.js is a library; the strongest alternatives are applications.** A library I import into my own build; an application forces me to maintain its build alongside mine.

Reveal is vanilla JavaScript, with no framework dependency. I import it in a Svelte component, initialize it on mount, and the rest of the page stays standard Astro: same build, same Content Collections, same i18n, same SEO. The integration boundary fits in a few dozen lines. On top of that it ships what I need for technical talks —native Markdown, fragments, auto-animate, step-through code highlighting— as composable plugins, without tying me to any runtime.

The other options I evaluated were good, but each one collided with that same boundary. **Marp** is the easiest to learn, but its interactivity is limited —no fragments, no live code demos— and its defaults aim at a presentation-grade PDF, not a web experience inside my site. **Spectacle** is elegant if your project already runs on React; mine doesn't, so adopting it meant pulling in a second framework runtime just for the slides.

The hardest one to rule out was **Slidev**, because it has the best authoring experience of the bunch. But Slidev isn't a library, it's an application. To use it inside an Astro site I'd have to maintain two parallel universes: Astro's `package.json` and Slidev's, with Vue, Vite, and its entire dependency tree. Two build pipelines. Two theme systems that don't talk to each other —Slidev's UnoCSS-based theming and my own Tailwind v4 setup that lives on `<html class="dark">`.

And, above all, I'd lose Astro's Content Collections: no Zod validation, no draft filtering, no `getCollection()`. Slidev's output is a SPA with hash-based routing, invisible to `@astrojs/sitemap`. Reveal sidesteps all of it for one underlying reason: it's something I embed, not something I have to host on the side.

## Two Deck Types, One Content Collection

The system supports two types of presentations. It wasn't an upfront design decision: they came out of taking inventory of what I already needed to show.

1. **Native decks.** Talks authored in Markdown inside the repo, which Reveal renders at build time. Theme, transition, and syntax highlighting are controlled from the frontmatter.
2. **External decks.** Presentations hosted elsewhere — Google Slides, slides.com, the talks I gave before this system existed. For those I don't try to embed something that may or may not render correctly: I generate an info page with title, description, event, hero image, and a button that opens the deck on its original host.

Two is enough because each one answers a different situation. Native decks are for new talks I write here; external decks bring the back catalog into the same timeline without forcing me to migrate every file.

Both live in a single Content Collection (`slides` in [`src/content.config.ts`](https://github.com/xergioalex/xergioalex.com/blob/main/src/content.config.ts)), with a Zod schema modeled as a discriminated union:

```typescript
const slideSchema = z.discriminatedUnion('type', [
  nativeSlideSchema,    // type: 'native'
  externalSlideSchema   // type: 'external'
]);
```

Each variant extends a base schema (title, description, event date, draft) with fields specific to its type. The concrete benefit shows up in the code that consumes the decks: when I write `if (deck.data.type === 'native')`, TypeScript already knows `deck.data.theme` exists in that branch. No casting, no extra runtime checks; the discriminated union does the work.

Using one collection instead of two simplifies everything downstream. The catalog at [`/slides`](/slides) calls `getSlideDecks(lang)` once and renders both types in a single timeline. The `.md` agent endpoints handle every type in one `getStaticPaths`. And migrating a deck from one type to another is a one-field frontmatter change, with no file moves.

## Rendering: Reveal Reads Native Markdown

Native decks don't need a custom parser. The route takes `deck.body` —the raw Markdown from the `.md` file— and embeds it inside a `<textarea>` that Reveal knows how to interpret:

```html
<section data-markdown
  data-separator="^---$"
  data-separator-vertical="^--$">
  <textarea data-template>{deck.body}</textarea>
</section>
```

Reveal's Markdown plugin parses that content on hydration and turns it into real `<section>` elements, with fragments, auto-animate, and code highlighting intact.

The trade-off is clear and worth naming: the initial HTML doesn't contain the slides, so before the JavaScript runs the deck is empty. To avoid the flash, the container starts at `opacity-0` and only becomes visible once Reveal fires its `ready` event. In exchange for that small cost, I get authoring flexibility the alternatives didn't offer.

## Asset Isolation: Zero Bytes Outside the Slides

One condition was non-negotiable: visiting `/`, `/blog`, `/about`, or even the catalog at [`/slides`](/slides) must load **zero bytes of Reveal.js**. This isn't performance purism. Reveal and its CSS are intrusive —they take over viewport sizing, scroll behavior, keyboard shortcuts— and if those styles leak into the rest of the site, ordinary pages break in ways that are hard to diagnose.

Astro's per-route asset graph solves this with no extra effort. Reveal's CSS is imported only in [`SlideLayout.astro`](https://github.com/xergioalex/xergioalex.com/blob/main/src/layouts/SlideLayout.astro), and that layout is used only by native-deck routes. As a result, Reveal's chunks appear exclusively in those pages' HTML. I confirmed it after the build by grepping `dist/` for references to those chunks: only the native-deck pages include them; the rest of the site stays clean.

## AEO Twins: One `.md` for Every `.html`

The site has an explicit policy: every HTML page must have a parallel `.md` endpoint serving `text/markdown`, so AI agents can read the content without rendering JavaScript or parsing HTML. It's documented in [`docs/aeo/MARKDOWN_FOR_AGENTS.md`](https://github.com/xergioalex/xergioalex.com/blob/main/docs/aeo/MARKDOWN_FOR_AGENTS.md) and enforced by `npm run md:check:strict` during the build. I cover the full reasoning in my series [*AEO: From Invisible to Cited*](/blog/series/aeo-from-invisible-to-cited/): how to build a site that AI answer engines can find, understand, and cite, from structured data and markdown endpoints to agent-readiness scoring.

Slides follow that policy through `[slug].md.ts` endpoints:

- For native decks, the twin serves the raw Markdown body. An agent reading [`/slides/demo-revealjs-features.md`](/slides/demo-revealjs-features.md) gets the full content as readable text.
- For `external` decks, it serves a structured stub with title, description, event metadata, and the external URL.

The result is that an agent can answer *"what talks has Sergio published about DevOps?"* without opening a browser.

## The Catalog

The catalog has its own route at [`/slides`](/slides) and is a dedicated index page, not a section bolted onto the blog.

[`SlidesPage.astro`](https://github.com/xergioalex/xergioalex.com/blob/main/src/components/pages/SlidesPage.astro) collects all non-draft decks for the current language and hands them to [`SlidesTimelineInfiniteScroll.svelte`](https://github.com/xergioalex/xergioalex.com/blob/main/src/components/slides/SlidesTimelineInfiniteScroll.svelte), a Svelte component that loads pages progressively through a JSON endpoint. The initial render delivers the first batch, and the rest arrives as the visitor scrolls, so a catalog of a hundred decks doesn't ship a hundred cards on first paint.

Each [`SlideCard.astro`](https://github.com/xergioalex/xergioalex.com/blob/main/src/components/slides/SlideCard.astro) shows the hero image (or a gradient placeholder), a badge with the deck type, the title, event metadata, description, and tags. The same component powers both the [`/slides`](/slides) index and any embedded surface —homepage previews, related-deck panels— that consumes that JSON endpoint.

## The Problems That Only Show Up With an Audience

The architecture worked on my machine long before it worked for anyone else. Three concrete problems marked that difference, and none of them was obvious until I had real decks, with real images, in front of a room.

**The overview thumbnails rendered blank.** Reveal hides off-screen slides with the `[hidden]` attribute, and Tailwind v4's preflight ships its own `[hidden] { display: none }` rule. When you press `O` to enter overview mode, Reveal tries to show every thumbnail, but Tailwind's rule keeps them hidden and the screen comes up empty. The diagnosis was the expensive part; the fix is a few lines: strip the `[hidden]` attribute on the `overviewshown` event and let Reveal's CSS regain control.

**Vertical centering was computed too early.** Reveal sets each slide's `top` through its `layout()` method, roughly `(slideHeight − section.scrollHeight) / 2`. The problem is that `layout()` runs on init, usually before raster images have finished decoding. With a `scrollHeight` still too small, `top` lands too high; once the image finally paints, the block leaves empty space above it and can clip off the 1280×720 canvas. The fix lives in [`RevealDeck.svelte`](https://github.com/xergioalex/xergioalex.com/blob/main/src/components/slides/RevealDeck.svelte): wire `load` and `error` handlers on every `<img>` once, and reschedule `deck.layout()` on the next animation frame so centering uses the final `scrollHeight`. Authors still declare `width` and `height` on every image; the engine handles the timing problem.

**Click-to-advance collided with overview mode.** I wanted a click anywhere on the slide to advance the presentation, like a clicker. But in overview mode Reveal uses the click to *select* a slide, not to advance, and a double-advance would feel broken. The current handler listens for clicks on the slide area, ignores them while overview is active, and also ignores them when they come from a link, button, or input, so embedded interactive content keeps working. One click, one advance, no false positives.

## The Authoring Layer: Primitives and Background Modes

The schema and the engine are half the system. The other half is authoring ergonomics, which is what decides whether I'll want to write the next deck: how fast do I go from a blank file to a presentable slide?

The answer lives in [`src/content/slides/_layouts/`](https://github.com/xergioalex/xergioalex.com/tree/main/src/content/slides/_layouts), with **19 reusable layout primitives** as copy-paste Markdown snippets. Each one includes a header explaining when to use it, the HTML structure (Tailwind helpers plus Markdown), and a working example. The `_layouts/` directory is excluded from the slides content collection glob, so snippets never ship as deck pages.

The layouts cover the talk archetypes I actually use: `title-hero`, `section-divider`, `two-column-split`, `three-column-cards`, `image-left/right/centered/full-bleed`, `video-left/right/centered`, `quote`, `code-with-callout`, `big-stat`, `comparison-table`, `process-steps`, `timeline`, `team-avatars`, and `closing-cta`. They're all responsive: three-column grids stack below 768px, and tables shrink their font size below 640px.

On top of the layouts sit **8 background modes** in [`_layouts/backgrounds/`](https://github.com/xergioalex/xergioalex.com/tree/main/src/content/slides/_layouts/backgrounds): solid color, gradient (with five presets, including "Void Navy" and "Brand"), image-with-text (with an overlay that guarantees contrast), full-screen image, video-with-text, full-screen video (muted and looped), CSS patterns, and iframe backgrounds.

Everything is themed from a CSS custom-property layer in [`src/styles/slides.css`](https://github.com/xergioalex/xergioalex.com/blob/main/src/styles/slides.css). Tokens like `--slide-bg`, `--slide-surface`, and `--slide-accent`, along with Reveal's own `--r-*` variables, redefine themselves when `<html class="dark">` flips. Changing one token instantly updates every deck, every primitive, and every background mode. The [live demo deck](/slides/demo-revealjs-features) exercises every primitive and every background in sequence, and it serves as both a complete reference and a visual test whenever I adjust a token.

## What I Left for Later

**Parsing the `<section>` elements at build time.** The current approach leaves the HTML opaque until Reveal runs. The AEO twins make up for that for AI agents, but for traditional crawlers and for the first human paint there's still that brief `opacity-0` moment. A future iteration could turn the Markdown into `<section>` elements during the build. I postponed it because, for now, keeping authoring flexibility matters more.

**Faceted search in the catalog.** Infinite scroll handles the volume, but the order is still chronological. Once the catalog passes 50 decks, filtering by tag, event, or year will be the next thing to address. The data model already supports it; the UI is what's missing.

**Homepage preview.** The homepage already has a [`TechTalksPostsSection`](https://github.com/xergioalex/xergioalex.com/blob/main/src/components/home/TechTalksPostsSection.astro) that surfaces posts tagged `talks`. A parallel `RecentDecksSection` could surface recent decks using the same JSON endpoint that powers the [`/slides`](/slides) infinite scroll: the same data, the same card component, just with a smaller initial limit.

What convinces me most about the result is how unceremonious creating a new deck became. I open a `.md` file, write, review it at [`/slides`](/slides), present it, and it gets archived, and the agent crawling the site can read it just like any article. There's no separate domain, no separate build, no parallel theme system. It's, in essence, a post that gets presented instead of read.

## Resources

- [Reveal.js v6 release notes](https://github.com/hakimel/reveal.js/releases/tag/6.0.0)
- [Slides feature guide](https://github.com/xergioalex/xergioalex.com/blob/main/docs/features/SLIDES.md) — full authoring documentation in the repo
- [Live demo deck](/slides/demo-revealjs-features) — all Reveal.js features, layouts, and background modes in action
- [Slides catalog](/slides) — the dedicated index page with infinite scroll
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) — how collections and Zod schemas work
