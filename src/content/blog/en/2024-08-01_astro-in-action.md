---
title: "Astro in Action"
description: "Why Astro won me over — Microsoft and Firebase cases, measurable gains, and a live Pereira Tech Talks migration to prove it is not hype."
pubDate: "2024-08-01"
heroImage: "/images/blog/posts/astro-in-action/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "web-development", "javascript"]
keywords: ["Astro in Action talk", "Astro Microsoft Firebase case study", "Pereira Tech Talks Astro", "Astro framework performance", "Astro islands architecture", "Astro zero JavaScript default", "Astro vs Next.js comparison"]
---

**Astro in Action** is about answering a question I kept hearing: *Is it worth it?* It's new. It's just another web framework. I wanted to show why Astro stands out — with real case studies, real numbers, and a real project: migrating [Pereira Tech Talks](https://www.pereiratechtalks.org/) to Astro as the demo of the talk.

---

## Is It Worth It?

I started with the skepticism. Astro is relatively new. The JavaScript ecosystem is full of frameworks. Why add another one? I walked through two case studies that convinced me — and that I hoped would convince the audience.

---

## Microsoft: Fluent Design System

Microsoft had tried several tools to build their [Fluent design docs](https://fluent2.microsoft.design/). Other frameworks and CMSs were too rigid, hard to maintain, or painful to migrate. They didn't integrate well with their Figma workflow and the design stories they wanted to tell.

Their requirements: **lightweight**, support their design system library, easy to maintain from a DevOps perspective, extensibility for DocSearch or Algolia, and support for the latest React. Astro fit: it ships **zero JavaScript by default**, is easy to deploy, tool-agnostic, lightweight, and supports React.

The result: the Fluent team built new pages in **half the time** compared to their previous stack. Developers and designers stayed aligned. That's when I knew Astro wasn't just hype.

---

## Firebase: From Blogger to Astro

The [Firebase blog](https://firebase.blog/) story hit even closer. A team of 10 developers hosted their blog on Blogger. They had to write posts in Google Docs, then convert drafts to Blogger. A short post could take an hour before publishing. Images and interactive components required handcrafted HTML. Blogger didn't even have profile images — you had to insert HTML and CSS directly into each post.

They needed: a modern developer experience, faster publishing, a more performant blog, and less friction for a team of 10. They rebuilt with Astro.

**Results:** Publishing went from **hours to minutes**. Build time with GitHub Actions went from 6 minutes to **1.5 minutes** — a **75% reduction**. That's engineering as marketing: the tool itself makes the team more productive.

---

## Community and Rising Stars

I also showed where Astro stands in the ecosystem. [JavaScript Rising Stars](https://risingstars.js.org/) tracks usage, awareness, interest, retention, and positivity. Astro has been climbing. The community is growing. That matters when you're betting on a stack.

---

## Features That Matter

I walked through what makes Astro different:

- **Islands** — Ship only the JavaScript you need, where you need it
- **UI-agnostic** — Use React, Svelte, Vue, or vanilla. Zero lock-in
- **Server-first** — HTML by default, JS as an enhancement
- **Content-driven** — Built for blogs, docs, and content sites
- **Deploy everywhere** — Vercel, Netlify, Cloudflare, static hosting

That said, **Astro isn't right for every project**. If you're building a highly interactive single-page app like Figma or a real-time dashboard, React or Svelte on their own might be better. Astro excels at content-heavy sites where most of the page is static and interactivity is the exception, not the rule. Knowing when *not* to use a tool is as important as knowing when to use it.

---

## Pereira Tech Talks: The Demo

The main outcome of the talk was the migration itself. [Pereira Tech Talks](https://www.pereiratechtalks.org/) had been running for years — since September 2017. A community blog: static, landing page, easy to maintain, free to host. The original stack used Ghost in Docker. Maintenance cost around $5–8/month.

We rebuilt it with Astro. [v2.pereiratechtalks.org](https://v2.pereiratechtalks.org/) became the live demo — static and dynamic, blogging, landing page, easy to maintain, connected to simple storage, real-time support where needed. One developer. Two weeks. The site is now lighter, faster, and easier to contribute to.

<figure>
<img src="/images/blog/posts/astro-in-action/poster.webp" alt="Promotional poster for Astro in Action talk at Camellando Coworking" loading="lazy" />
<figcaption>The event poster — August 1, Camellando Coworking, Pereira. The talk used the live Pereira Tech Talks migration as its main demo.</figcaption>
</figure>

---

## Event Memories

<figure>
<div class="grid grid-cols-2 gap-4 not-prose">
  <img src="/images/blog/posts/astro-in-action/sergio-presenting-astro-talk.webp" alt="Sergio during the Astro in Action talk" width="600" height="400" class="rounded-xl object-cover w-full aspect-[4/3]" loading="lazy" />
  <img src="/images/blog/posts/astro-in-action/audience-at-meetup.webp" alt="Audience at the Astro in Action meetup" width="600" height="400" class="rounded-xl object-cover w-full aspect-[4/3]" loading="lazy" />
  <img src="/images/blog/posts/astro-in-action/group-photo-attendees.webp" alt="Group photo of attendees at Astro in Action meetup" width="600" height="400" class="col-span-2 rounded-xl object-cover w-full aspect-[4/3]" loading="lazy" />
</div>
<figcaption>The Astro in Action meetup crowd — developers who came to see whether the framework could deliver on its promise in a live demo.</figcaption>
</figure>

---

## Let's Build Something

I ended with an invitation: contribute. The [Pereira Tech Talks repo](https://github.com/pereira-tech-talks/pereiratechtalks.org) is open. Astro 4 had just landed. The ecosystem is maturing. If you're building a blog, a landing page, or a content site — Astro is worth a look.

[View slides](https://slides.com/xergioalex/astro-in-action)

Let's keep building.
