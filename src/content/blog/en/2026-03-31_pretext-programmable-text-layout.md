---
title: "PreTeXt: The Library That Makes Text Programmable"
description: "I didn't get the hype around a text measurement library. So I built dozens of demos — from masonry grids to a sphere that reflows text at 60fps."
pubDate: "2026-03-31"
heroImage: "/images/blog/posts/pretext-programmable-text-layout/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "javascript", "web-development", "design"]
keywords: ["pretext javascript text layout library", "DOM reflow text measurement alternative", "60fps text animation javascript pretext", "pretext cheng lou programmable text", "layoutNextLine variable width text", "text measurement without DOM reflow", "pretext prepare layout API demo"]
---

I saw [Cheng Lou's post](https://x.com/_chenglou/status/2037713766205608234) about PreTeXt blowing up and my first reaction was: really? A text measurement library? That's what has people excited?

I clicked through to the [repo](https://github.com/chenglou/pretext). Read the README. Watched the demo GIFs. And I'll be honest — I didn't get it. The API looked clean, sure. `prepare()` and `layout()`. Two functions. But my brain kept asking: why do I care about measuring text height? CSS already does that. The browser handles it. What problem is this actually solving?

I read the docs twice. I still didn't get it.

So I did what I always do when I don't understand something — I built things with it. Not one demo. Not five. Thirty-nine. A full [interactive lab](https://pretext.xergioalex.com/) with demos ranging from basic text measurement to a sphere that chases your cursor while text reflows around it at 60 frames per second.

Dozens of demos later, I get it. And I think you will too.

---

## How Text Measurement Actually Works on the Web

Most developers never think about text measurement. You put text in a container, CSS wraps it, and the browser figures out the height. Done.

But the moment you need to *know* that height before rendering — how tall will this paragraph be at 320px wide? — you're in trouble.

Here's what the browser actually does when you ask:

```javascript
// The traditional way: ask the browser
function measureTextHeight(text, width, font) {
  const el = document.createElement('div');
  el.style.cssText = `position:absolute;visibility:hidden;width:${width}px;font:${font}`;
  el.textContent = text;
  document.body.appendChild(el);    // reflow!
  const height = el.offsetHeight;   // reflow!
  document.body.removeChild(el);
  return height;
}
// Every call = 2 reflows. For 500 cards = 1,000 reflows.
```

Create a hidden element. Set the text and width. Append it to the DOM — which can force the browser to recalculate layout. Read the height — another forced layout read. Remove it. Repeat.

That kind of measurement work [can force the browser to recalculate layout](https://developer.chrome.com/docs/performance/insights/forced-reflow). Sounds manageable until you need to do it 500 times for a card grid. Or on every resize. Or — and this is where it gets painful — 60 times per second for an animation.

If you've ever built a masonry layout and seen cards jump around on load — that's this. The browser didn't know how tall the text would be until it rendered it. So it renders, measures, repositions, and you see the jump. Most masonry libraries work around this rather than eliminating it cleanly.

And you can't cache the results, because the height changes every time the container width changes. Resize the window? Measure everything again. Switch to a mobile layout? Measure everything again. Animate a container's width? Measure everything 60 times per second.

---

## Two Phases. That's the Whole Idea.

[PreTeXt](https://github.com/chenglou/pretext) is by [Cheng Lou](https://github.com/chenglou) — if you've been around React long enough, you know that name. He's a longtime React contributor, the creator of [react-motion](https://github.com/chenglou/react-motion), and someone closely associated with the Reason/ReScript world. He's currently at [Midjourney](https://venturebeat.com/technology/midjourney-engineer-debuts-new-vibe-coded-open-source-standard-pretext-to). He tends to gravitate toward foundational problems.

His idea with PreTeXt is almost deceptively simple: separate the expensive work from the repeated work. Even Cheng Lou himself [downplays it](https://x.com/_chenglou/status/2038486958708851074): *"supposedly 'innovative' text layout library / looks inside / just a parser and a cache."* And honestly, that's what makes it interesting — the power isn't in complexity, it's in what that parser and cache make possible.

**Phase 1 — `prepare(text, font)`:** Do all the heavy lifting once. Unicode text segmentation via [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter), word boundary detection, font measurement via [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText). This phase figures out where every possible line break could go and how wide each segment of text is. In the current benchmark snapshot from the repo, this step takes about 19ms for a shared batch of 500 texts.

**Phase 2 — `layout(prepared, width, lineHeight)`:** Pure arithmetic. No DOM access. No Canvas. No string manipulation. Just math on the cached measurements from phase 1. In that same benchmark snapshot, `layout()` takes about 0.09ms for the same 500-text batch. Roughly 200x faster there.

```typescript
import { prepare, layout } from '@chenglou/pretext';

// Phase 1: one-time analysis (~0.04ms)
const prepared = prepare(text, '16px Inter');

// Phase 2: instant height at ANY width (~0.0002ms each)
const narrow = layout(prepared, 300, 24);  // { height: 144, lineCount: 6 }
const wide = layout(prepared, 600, 24);    // { height: 72, lineCount: 3 }
const mobile = layout(prepared, 200, 24);  // { height: 216, lineCount: 9 }

// Same prepared data, three different widths, near-zero cost.
```

The idea that finally made it click for me — and took me too long to see — is that `prepare()` is the one-time bill. After that, `layout()` is close to free relative to the initial pass.

It's like pre-compiling a regex. The first call costs something. Every match after that is nearly instant.

The numbers make it concrete. In the checked-in benchmark snapshot from the repo, a shared batch of 500 text blocks looks like this:

- **PreTeXt `prepare()`:** ~19ms for the batch
- **PreTeXt `layout()`:** ~0.09ms for that same batch

If you're resizing, relaying out, or probing several widths, that's where the win starts to matter.

But it goes beyond just measuring heights. With `layoutNextLine()`, you can process text line by line — and each line can have a different available width:

```typescript
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';

const prepared = prepareWithSegments(text, '16px Inter');
let cursor = 0;
let lineNumber = 0;

while (true) {
  const availableWidth = getAvailableWidth(lineNumber, obstaclePosition);
  const line = layoutNextLine(prepared, cursor, availableWidth);
  if (!line) break;

  renderLine(line, lineNumber);
  cursor = line.endOffset;
  lineNumber++;
}
```

This is what CSS `float` wishes it could do. Except this recomputes 60 times per second as you drag an obstacle around the page. CSS floats are static rectangles decided at render time. This is dynamic, arbitrary shapes, recalculated every frame.

---

## So I Built a Lab

I learn by building. Reading docs alone doesn't do it for me — I need to push the edges, find the limits, break things until I understand why they work.

So I built a [full lab](https://pretext.xergioalex.com/). [Astro](https://astro.build/) 6 for the static shell, [Svelte](https://svelte.dev/) 5 for the interactive islands — the same stack I use for [this website](/blog/astro-and-svelte-the-future-of-web-development/) and that I've been arguing is the future of web development. 39 interactive demos organized from foundational to what I can only describe as spectacular. The lab follows the [islands architecture](https://docs.astro.build/en/concepts/islands/) pattern — every page loads as static HTML in milliseconds, and only the demos themselves ship JavaScript via `client:only="svelte"`. Walking the talk.

One thing that matters here: **PreTeXt is completely framework-agnostic.** It's pure JavaScript — no React dependency, no Vue plugin, no Svelte binding. Just an algorithm. I built the lab with Astro and Svelte because that's my stack and they're really well-suited for this kind of thing — Svelte 5's [runes](https://svelte.dev/docs/svelte/what-are-runes) (`$state`, `$effect`) made the reactive demos almost trivial to wire up, and Astro's static generation meant the lab loads fast even with dozens of heavy interactive components. But you could use PreTeXt with React, Vue, vanilla JS, Canvas, WebGL, or anything that runs in a browser. At the end of the day, what you have is a great algorithm that takes text and a font, and gives you layout math. What you do with those numbers is entirely up to you.

I think the best way to understand a library is to find where it stops being useful. So that's what I tried to do. I kept building increasingly absurd demos — [text flowing around obstacles](https://pretext.xergioalex.com/demos/flow-around-obstacle/), [text shaped into silhouettes](https://pretext.xergioalex.com/demos/text-silhouette/), [text as physics bodies](https://pretext.xergioalex.com/demos/text-collision/), [text as game mechanics](https://pretext.xergioalex.com/demos/text-breakout/), [text sucked into a black hole](https://pretext.xergioalex.com/demos/text-black-hole/), [an entire ocean simulated with letter-particles](https://pretext.xergioalex.com/demos/text-ocean-sph/) — waiting for PreTeXt to break. It didn't.

Honestly, I spent more time than I'd like to admit on the [Editorial Engine](https://pretext.xergioalex.com/demos/editorial-engine/) demo. Getting the orb physics to feel right while the text reflowed around them was tricky — even with PreTeXt doing the hard measurement part, the coordination between physics simulation and per-line layout required a lot of iteration.

The [repo is public](https://github.com/xergioalex/pretext-lab) if you want to dig into the code. But I'd recommend trying the [live demos](https://pretext.xergioalex.com/) first — some of these really need to be experienced, not read about.

Here's what I organized:

- **Foundational** (4 demos) — the basics: measuring text, resize behavior, DOM vs PreTeXt benchmarks
- **Practical** (5 demos) — real UI patterns: masonry cards, chat bubbles, canvas text, multilingual support
- **Advanced** (13 demos) — per-line control: text flowing around obstacles, editorial layouts, magazine columns, PDF reflow across devices, comic speech balloons, subtitle composition, OCR reconstruction
- **Spectacular** (17 demos) — things that are hard to imagine on the web: a sphere chasing your cursor through text, text breakout, audio-reactive typography, physics-based text collisions, text origami, a black hole that devours words, an ocean of letter-particles with SPH fluid physics

---

## Why This Changes Things

PreTeXt isn't just "faster DOM measurement." It enables patterns that were previously impractical, awkward, or too expensive to do in the hot path.

**60fps text animations.** [Wave distortion](https://pretext.xergioalex.com/demos/wave-distortion/) running a sine wave through line widths every frame. [Text vortex](https://pretext.xergioalex.com/demos/text-vortex/) spinning characters and reassembling them. [Gravity letters](https://pretext.xergioalex.com/demos/gravity-letters/) falling and bouncing with physics. In the [Dragon Chase](https://pretext.xergioalex.com/demos/dragon-chase/), a sphere follows your cursor and text reflows around it — that's 30-50 calls to `layoutNextLine()` per frame, all under 16ms. These stop being practical if every frame depends on fresh DOM measurements.

**Canvas text with proper line breaks.** The [Canvas API has no concept of text wrapping](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText). You call `fillText()` and it draws a single line. If you want multi-line text with word wrapping, you're on your own. PreTeXt provides the missing brain — it computes where every line break should go, and you render the result to Canvas.

**Text as interactive medium.** Games. Physics simulations. [Audio-reactive typography](https://pretext.xergioalex.com/demos/audio-reactive/) where text layout responds to real-time sound. [Voronoi cells](https://pretext.xergioalex.com/demos/voronoi-text/) filled with reflowing text. [Text collision worlds](https://pretext.xergioalex.com/demos/text-collision/) where paragraphs are rigid bodies that bounce off each other. And my personal favorites from the latest batch: a [particle pool](https://pretext.xergioalex.com/demos/text-particle-pool/) where 4,000 character-particles rain down and accumulate with real physics — scatter them with your cursor and watch them resettle — and an [ocean simulation](https://pretext.xergioalex.com/demos/text-ocean-sph/) using Smoothed Particle Hydrodynamics where letters behave like water, with a boat bobbing on waves made of characters. That one broke my brain a little.

**LLM streaming layouts.** Size a chat bubble as text streams in without relying on repeated DOM measurement. Less jumping, less scroll jank. Try the [streaming text demo](https://pretext.xergioalex.com/demos/streaming-text/).

It also handles Unicode seriously — thanks to [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter), CJK text can break between characters, Arabic and Hebrew run right-to-left, Thai uses dictionary-based word breaking, emoji clusters stay together. Try the [multilingual stress test](https://pretext.xergioalex.com/demos/i18n-stress/) — the demo covers 9 writing-system samples and edge cases. A lot of lightweight JavaScript text utilities start to show cracks once you leave plain Latin text. PreTeXt is clearly aiming at that harder problem space. Zero external dependencies — just browser APIs that already exist.

I think we'll see this kind of separation — expensive analysis once, cheap computation forever — show up in more areas beyond text. PreTeXt just found it first.

---

## When It Makes Sense — and When It Doesn't

After that many demos it's easy to walk away thinking PreTeXt should be everywhere. It shouldn't.

PreTeXt solves a concrete problem: you need to know text dimensions **before** rendering, or you need to recalculate them **many times** without paying the cost of a DOM reflow each time. If your project doesn't have that problem, the library doesn't give you anything the browser doesn't already handle on its own.

**When it's worth it:**

- Masonry layouts or virtualized grids where you need exact heights before the first render
- Animations or interactions where text is recalculated every frame (60fps)
- Text rendering in Canvas, SVG, or WebGL — where the browser gives you no line wrapping
- Streaming interfaces (LLM chat) where you want to size the container before the text finishes arriving
- Editorial tools with text flowing around dynamic objects

**When you don't need it:**

- Static sites or blogs where text renders once and CSS handles the layout. This very site, for example — it doesn't use PreTeXt. It doesn't need to.
- Pages where text lives inside fixed containers and doesn't change dynamically
- Applications where a single reflow on page load is acceptable and there are no text animations
- Any case where calling `getBoundingClientRect()` once or twice solves your problem without perceptible overhead

The library is powerful, but it's not a silver bullet. It's an infrastructure tool for cases where text measurement is in the hot path — when measuring is the bottleneck, not something that happens once on load. Most websites never reach that point. The ones that do — feeds with thousands of cards, visual editors, heavy interactive experiences — are the ones that benefit the most.

## I Cracked the Black Box Open

I started this project not understanding the hype. A text measurement library, I thought. How exciting could that possibly be.

Dozens of demos later, I don't just understand it — I'm excited about it. It's fast and the API is clean, sure. But that's not why. It's because it changes what's possible. Text on the web has been a black box controlled by CSS for as long as I've been building websites. PreTeXt opens that box and hands you the controls.

Building the lab also reinforced something I've been saying for a while: [Astro and Svelte are a seriously powerful combination](/blog/astro-and-svelte-the-future-of-web-development/). Astro gave me a fast static shell with file-based routing and zero JS by default. Svelte gave me reactive, performant islands where all the PreTeXt magic happens. And PreTeXt — being completely framework-agnostic — slotted right in without a single adapter or wrapper. That's how good tools should work: they compose with anything.

Try the [lab](https://pretext.xergioalex.com/). Break things. Build something I didn't think of. The [code is all open](https://github.com/xergioalex/pretext-lab), and Cheng Lou's [original library](https://github.com/chenglou/pretext) is MIT-licensed and dependency-free.

Let's keep building.

---

## Resources

- [PreTeXt Library](https://github.com/chenglou/pretext) — Cheng Lou's original library (MIT, zero dependencies)
- [PreTeXt Lab](https://pretext.xergioalex.com/) — All 39 interactive demos
- [PreTeXt Lab Source Code](https://github.com/xergioalex/pretext-lab) — Full source for all demos (Astro + Svelte)
- [VentureBeat: Midjourney engineer debuts PreTeXt](https://venturebeat.com/technology/midjourney-engineer-debuts-new-vibe-coded-open-source-standard-pretext-to) — Press coverage of the library's release
- [Forced reflow](https://developer.chrome.com/docs/performance/insights/forced-reflow) — Chrome DevTools docs on why forced reflows are expensive
- [What forces layout/reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) — Paul Irish's detailed list of reflow triggers
- [Intl.Segmenter (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) — The browser API PreTeXt uses for Unicode text segmentation
- [Islands Architecture](https://jasonformat.com/islands-architecture/) — Jason Miller's original article on the pattern used by Astro
