---
type: native
title: "Slides v2 — Kitchen Sink Demo"
description: "Kitchen-sink showcase of every layout, background, and Reveal.js feature in the v2 slide system — splits, full-bleed images, quotes, stats, tables, math."
pubDate: 2026-04-25
updatedDate: 2026-05-14
heroImage: "/images/slides/demo-revealjs-features/hero.webp"
relatedPost: "building-slide-system-inside-astro-revealjs"
draft: false
theme: dark
transition: slide
syntaxHighlight: true
math: true
eventName: "Pereira Tech Talks Demo"
eventDate: 2026-04-25
---

<!-- ==================== Cover ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #08191A 0%, #0F2A2C 100%)" -->

# Slides v2 — Kitchen Sink

### Every layout, background, and feature in one deck

<small>Pereira Tech Talks · 2026</small>

Note: The opening slide. Use a title-hero pattern with a strong gradient to set the visual tone for the whole deck.

---

<!-- ==================== Section: Layouts ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Part 01</span>
  <h2>Layouts</h2>
</div>

---

## Two-Column Split

<div class="slide-grid-2">
  <div>
    <h3>Left side</h3>
    <p>Compare two ideas side-by-side. Aim for parallel structure to make the contrast obvious.</p>
  </div>
  <div>
    <h3>Right side</h3>
    <p>Stacks vertically below 768px so it stays readable on phones in the back row.</p>
  </div>
</div>

---

## Three Pillars

<div class="slide-grid-3">
  <div class="slide-card">
    <span class="slide-card__icon">🚀</span>
    <h3>Speed</h3>
    <p>Ship the smallest valuable thing first.</p>
  </div>
  <div class="slide-card">
    <span class="slide-card__icon">🧭</span>
    <h3>Clarity</h3>
    <p>If a sentence cannot explain it, the design is unfinished.</p>
  </div>
  <div class="slide-card">
    <span class="slide-card__icon">🤝</span>
    <h3>Trust</h3>
    <p>Earned in drops, lost in buckets.</p>
  </div>
</div>

---

## Image on the Left

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <img src="https://picsum.photos/seed/demo-left/640/480" alt="Sample image illustrating the left column" width="640" height="480" class="slide-image-full" />
  </div>
  <div>
    <h3>Anchor the visual</h3>
    <p>Walk the audience through what they are seeing, then land a single takeaway.</p>
  </div>
</div>

---

## Image on the Right

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <h3>Lead with the idea</h3>
    <p>Useful for storytelling beats — say it first, then anchor visually.</p>
  </div>
  <div>
    <img src="https://picsum.photos/seed/demo-right/640/480" alt="Sample image illustrating the right column" width="640" height="480" class="slide-image-full" />
  </div>
</div>

---

<!-- .slide: data-background-image="https://picsum.photos/seed/fullbleed/1920/1080" data-background-size="cover" data-background-position="center" data-background-opacity="0.85" class="slide-bg-overlay--dark" -->

## Image, Full-Bleed

<small>The image IS the message. Overlay keeps text readable.</small>

---

<blockquote class="slide-quote">
  "The best way to predict the future is to build it — small, kind, and on purpose."
</blockquote>
<cite class="slide-quote-cite">— Pull-Quote Layout · 2026</cite>

---

## Code with Callout

<div class="slide-grid-2 slide-grid--align-center">
  <div>

```typescript
async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}
```

  </div>
  <div>
    <h3>What's happening</h3>
    <ul>
      <li>Plain <code>fetch</code></li>
      <li>Throws on non-2xx</li>
      <li>Returns parsed JSON</li>
    </ul>
  </div>
</div>

---

<div class="slide-stat">
  <span class="slide-stat__number">87%</span>
  <span class="slide-stat__label">of teams that ran async standups for 60 days kept doing it</span>
  <p class="slide-stat__context">DailyBot internal cohort, 2017–2018</p>
</div>

---

## Comparison Table

<table class="slide-table">
  <thead>
    <tr><th>Feature</th><th>Reveal.js</th><th>Slidev</th><th>Google Slides</th></tr>
  </thead>
  <tbody>
    <tr><td>Markdown-first</td><td>Yes</td><td>Yes</td><td>No</td></tr>
    <tr><td>Self-host</td><td>Yes</td><td>Yes</td><td>No</td></tr>
    <tr><td>Free</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
    <tr><td>Real-time co-edit</td><td>No</td><td>No</td><td>Yes</td></tr>
  </tbody>
</table>

---

## Process — How It Works

<ol class="slide-steps">
  <li><strong>Define</strong><br/>Architecture, schemas, constraints.</li>
  <li><strong>Scaffold</strong><br/>Let agents draft the boilerplate.</li>
  <li><strong>Review</strong><br/>Read the diff like a reviewer would.</li>
  <li><strong>Ship</strong><br/>Commit, push, validate via CI.</li>
</ol>

---

## Timeline

<ul class="slide-timeline">
  <li><time>2017</time><span>Internal Slack bot for standups</span></li>
  <li><time>2018</time><span>Public launch, first paying customers</span></li>
  <li><time>2019</time><span>1,000 teams, ramen profitable</span></li>
  <li><time>2020</time><span>5,000 teams during the COVID remote-work boom</span></li>
  <li><time>2021</time><span>Y Combinator S21 batch</span></li>
</ul>

---

## Team

<div class="slide-team">
  <figure>
    <img src="https://i.pravatar.cc/120?img=1" alt="Co-presenter avatar" width="100" height="100" />
    <figcaption><strong>Jane Doe</strong><br/><span>Founder · CEO</span></figcaption>
  </figure>
  <figure>
    <img src="https://i.pravatar.cc/120?img=2" alt="Co-presenter avatar" width="100" height="100" />
    <figcaption><strong>John Doe</strong><br/><span>Co-founder · CTO</span></figcaption>
  </figure>
  <figure>
    <img src="https://i.pravatar.cc/120?img=3" alt="Co-presenter avatar" width="100" height="100" />
    <figcaption><strong>Alex Doe</strong><br/><span>Head of Product</span></figcaption>
  </figure>
</div>

---

<!-- ==================== Section: Backgrounds ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Part 02</span>
  <h2>Backgrounds</h2>
</div>

---

<!-- .slide: data-background-color="#1e3a5f" -->

## Solid Color

White text auto-applies via has-dark-background.

---

<!-- .slide: data-background-gradient="radial-gradient(circle at top, #d81540 0%, #0f1124 80%)" -->

## Gradient

Forced white text via the [data-background-gradient] cascade.

---

<!-- .slide: data-background-image="https://picsum.photos/seed/bgimg2/1920/1080" data-background-size="cover" data-background-position="center" data-background-opacity="0.8" class="slide-bg-overlay--dark" -->

## Image with Overlay

55% black overlay guarantees text readability.

---

<!-- .slide: class="slide-bg-pattern--dots" -->

## Pattern — Dots

CSS-only repeating dot pattern.

---

<!-- .slide: class="slide-bg-pattern--grid" -->

## Pattern — Grid

CSS-only blueprint feel.

---

<!-- ==================== Section: Existing Reveal Features ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Part 03</span>
  <h2>Reveal Features</h2>
</div>

---

## Fragments

Click to reveal each item:

- First point <!-- .element: class="fragment fade-up" -->
- Second point <!-- .element: class="fragment fade-up" -->
- Third point <!-- .element: class="fragment fade-up" -->

---

<!-- .slide: data-auto-animate -->

## Auto-Animate

<div data-id="box" style="background: #2563eb; width: 100px; height: 100px; border-radius: 8px; margin: 0 auto;"></div>

---

<!-- .slide: data-auto-animate -->

## Auto-Animate

<div data-id="box" style="background: #7c3aed; width: 300px; height: 200px; border-radius: 32px; margin: 0 auto;"></div>

---

## Code Highlight (Stepped)

```typescript [1-2|4-6|8-10]
import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown';

const deck = new Reveal({
  plugins: [Markdown],
});

deck.initialize().then(() => {
  console.log('Reveal.js is ready!');
});
```

---

## Math (KaTeX)

The quadratic formula:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

Euler's identity:

$$e^{i\pi} + 1 = 0$$

---

<!-- ==================== Media Layouts ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #0f1124 0%, #152e45 50%, #1a3a5a 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Part 04</span>

## Media Layouts

</div>

---

## Video Centered

<video data-autoplay loop muted class="slide-video" width="960" height="540">
  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
</video>

---

## Video on the Left

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <video data-autoplay loop muted class="slide-video" width="640" height="360">
      <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
    </video>
  </div>
  <div>
    <h3>Anchor the visual</h3>
    <p>Walk the audience through what they are watching, then land a single takeaway.</p>
  </div>
</div>

---

## Video on the Right

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <h3>Lead with the idea</h3>
    <p>Say it first, then anchor visually with the clip. Useful for storytelling beats.</p>
  </div>
  <div>
    <video data-autoplay loop muted class="slide-video" width="640" height="360">
      <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
    </video>
  </div>
</div>

---

## Image Centered

<img src="https://picsum.photos/seed/centered/960/540" alt="Landscape photo" width="960" height="540" class="slide-image-full" />

<small>A single image with title and optional caption</small>

---

## Video Contained

<video data-autoplay loop muted class="slide-media-contained" width="960" height="540">
  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
</video>

<small>Centered with breathing room on all sides</small>

---

## Image Contained

<img src="https://picsum.photos/seed/contained/960/540" alt="Landscape photo" width="960" height="540" class="slide-media-contained" />

<small>Centered with breathing room on all sides</small>

---

<!-- .slide: data-background-video="https://www.w3schools.com/html/mov_bbb.mp4" data-background-video-loop data-background-video-muted data-background-size="cover" -->

&nbsp;

Note: Video fullscreen — no text, pure visual mood. The clip fills the entire slide.

---

<!-- .slide: data-background-image="https://picsum.photos/seed/fullscreen/1920/1080" data-background-size="cover" data-background-position="center" -->

&nbsp;

Note: Image fullscreen — no text, pure visual impact. The photo fills the entire slide.

---

<!-- .slide: data-background-video="https://www.w3schools.com/html/mov_bbb.mp4" data-background-video-loop data-background-video-muted data-background-size="cover" class="slide-bg-overlay--dark" -->

## Video Background with Text

A looping clip behind the content — the overlay guarantees text readability.

---

## Vertical Slides

Press **down arrow** to navigate vertically.

--

### Vertical Sub-Slide 1

Nested content using the `--` separator.

--

### Vertical Sub-Slide 2

You can go as deep as you need.

---

## Speaker Notes

Press **S** to open the speaker view.

Note: Speaker notes are visible only in speaker view. Use them for talking points, reminders, or timing cues.

---

<!-- ==================== Closing ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #0f1124 0%, #152e45 100%)" -->

## Thank You

<p>All snippets and helpers live in <strong>src/styles/slides.css</strong> and <strong>src/content/slides/_layouts/</strong></p>

<a href="https://pereiratechtalks.org/en/slides" class="slide-cta">Browse all decks →</a>

<small>Built with Reveal.js inside Astro · pereiratechtalks.org</small>
