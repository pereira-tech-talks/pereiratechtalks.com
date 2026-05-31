---
title: "Make Something Agents Want"
description: "YC quietly echoed its 20-year-old motto. Cloudflare said agents can now be customers. Two posts, 48 hours apart, and the audience for software just changed."
pubDate: "2026-05-27"
heroImage: "/images/blog/posts/make-something-agents-want/hero.webp"
heroLayout: "side-by-side"
tags: ["tech", "personal", "ai-agents", "cloudflare"]
keywords: ["make something agents want", "agents as customers Cloudflare", "YC software for agents", "AI agents first class users", "building software for AI agents", "Cloudflare Stripe agents protocol", "agent economy 2026"]
series: "working-with-agents"
seriesOrder: 6
draft: true
---

Something shifted in how the tech industry talks about AI agents, and you can see it concentrated in two declarations made days apart.

**April 27, 2026.** Y Combinator's account publishes a new category in its [Request for Startups](https://www.ycombinator.com/rfs) focused on *Software for Agents,* authored by [Aaron Epstein](https://www.ycombinator.com/people/aaron-epstein), a General Partner at the firm. The kicker reads: *"So if you're Making Something Agents Want, we'd love to hear from you."* As [a YC alum](/blog/how-we-got-into-y-combinator/), the original phrase — *Make something people want* — has been in my head for years. Seeing one word swapped in that exact sentence is the kind of thing you notice on the second reading. The kind of misspelling that's deliberate.

<figure>
  <img src="/images/blog/posts/make-something-agents-want/figure-yc-tweet.webp"
       alt="Screenshot of Aaron Epstein's Y Combinator post from April 27, 2026, titled 'Software for Agents,' arguing that the next trillion internet users will be AI agents."
       width="960"
       height="1058"
       loading="lazy" />
  <figcaption>Y Combinator, April 27, 2026 — Aaron Epstein opens the "Software for Agents" RFS. — <a href="https://x.com/ycombinator/status/2048834309994565832">Original post</a>.</figcaption>
</figure>

**April 28, 2026.** Cloudflare's account drops a line that struck many as wildly bold: *"Starting today, agents can now be Cloudflare customers."* Not "agents can now use Cloudflare." Customers. The word doing the work in that sentence is the noun. And said that flatly — no hedging, no asterisks — it lands differently than it would have if anyone had tried to soften it.

<figure>
  <img src="/images/blog/posts/make-something-agents-want/figure-cloudflare-tweet.webp"
       alt="Screenshot of Cloudflare's April 28, 2026 tweet announcing that agents can now create Cloudflare accounts, start paid subscriptions, register domains, and receive API tokens to deploy code."
       width="960"
       height="908"
       loading="lazy" />
  <figcaption>Cloudflare, April 28, 2026 — the first major infrastructure vendor to say it out loud. — <a href="https://x.com/Cloudflare/status/2049545195914498139">Original post</a>.</figcaption>
</figure>

Two declarations. Forty-eight hours apart. Either one would have been the lead story of its week. Together they marked a hinge. YC, the institution that has shaped startup methodology for two decades, telling founders to design for an audience that doesn't click. Cloudflare, one of the largest CDN and edge providers on the open web, declaring that audience can now hold the contract.

The internet noticed. And the internet, being the internet, also got two things slightly wrong.

---

## Before going further, one clarification

There were two readings of these events that spread fast and need to be corrected before the rest of the post makes sense.

**Reading one: "YC changed its motto."** It didn't. [yc.com](https://www.ycombinator.com/) still says "Make something people want" at the bottom of the page. The new line — *"Making Something Agents Want"* — is an RFS closer. A campaign echo. Aaron Epstein wrote it as the kicker for a wishlist of startups he wants to see, deliberately inverting the canonical motto to make a point. That's still a thesis-level signal. It's just not a rebrand. It's YC saying *the methodology applies — but the audience just expanded.*

**Reading two: "Cloudflare did this alone."** It didn't. The [Cloudflare blog post](https://blog.cloudflare.com/agents-stripe-projects/) makes it clear within three paragraphs: the architecture is a co-launch with Stripe. The new primitive underneath is the Machine Payments Protocol — MPP — built on top of Stripe Projects and Shared Payment Tokens. PlanetScale is named in the same post as the first non-Cloudflare infrastructure provider to integrate with the same rail. Stripe's side of the launch shipped on April 29 at [Sessions 2026](https://stripe.com/blog/everything-we-announced-at-sessions-2026).

So the more accurate framing is: Cloudflare and Stripe co-launched a protocol that lets an agent prove who its human is, get billed without ever touching the human's card number, and end up holding a fresh cloud account in its own session. Cloudflare led the announcement. Stripe built half the rails. PlanetScale was the first to follow.

Both clarifications matter for the rest of the post, because the smaller, more accurate version of the story is actually the more interesting one.

---

## What happens when the customer isn't you

[The agent economy](/blog/the-agent-economy/) post I wrote in March tracked how agents got money: Stripe SPTs, Visa Intelligent Commerce, Mastercard, Ramp Agent Cards, Coinbase agentic wallets, x402. The framing was *agents as economic actors.* That story was about whether agents could pay.

This is a different story. This one is about whether agents can be the **counterparty.** Not the consumer at the till, but the name on the contract. Not the wallet being charged, but the account being billed.

Look at what Cloudflare just unbundled. Five things that every legitimate customer has, taken apart and rebuilt for a non-human party:

| Primitive | What it used to mean | What it means now |
|-----------|---------------------|-------------------|
| Account | A person fills a signup form | An agent gets provisioned via OAuth flow, with Stripe attesting to the human behind it |
| Identity | A login, an email, an MFA device | A signed delegation chain — *who* you're acting on behalf of, with what limits |
| Billing | A credit card you charge | A Shared Payment Token capped at $100/month by default, scoped to one merchant, expiring on use |
| Contract | Terms of Service a human accepts | An on-protocol scope agreement the deploying party signs |
| Support | Docs, chat, escalation paths | Machine-readable error responses, `.well-known/` endpoints, API contracts agents can parse |

None of those primitives is new on its own. OAuth is from 2010. Virtual cards have been around for years. The interesting part is that they're being **composed for a counterparty that isn't human** — and the composition is what's new.

I keep coming back to one quote from the Cloudflare post: *"Similar to how the OAuth standard made it possible to delegate access to your account to other platforms, the protocol uses OAuth and extends further into payments and account creation, doing so in a way that treats agents as a first-class concern."*

First-class concern. That's the phrase to sit with. For 20 years, agents — bots, scripts, crawlers — were second-class. They got rate-limited. They got CAPTCHA'd. They got banned from buying tickets on Ticketmaster. The signup form was a moat, not a feature. Now the signup form is being rebuilt so the bot can use it intentionally.

---

## What Paul Graham actually said

The phrase "Make something people want" comes from an essay Paul Graham published in April 2008 called ["Be Good"](https://paulgraham.com/good.html). The relevant line is the second paragraph:

> *"About a month after we started Y Combinator we came up with the phrase that became our motto: 'Make something people want.' We've learned a lot since then, but if I were choosing now that's still the one I'd pick."*

YC was three years old when PG wrote that. The phrase has outlasted three economic cycles. It's outlasted the iPhone's first decade, the rise and fall of crypto twice, the entire SaaS era. The reason it's outlasted everything is that it's almost impossible to argue with. *Want* is a measurable thing. Wanting is the only thing the market actually rewards.

Honestly, I think of that sentence every time I look at a new product idea. Including this site you're reading. Including DailyBot.

Inverting the noun isn't trivial. Agents don't *want* the way humans want. They don't have boredom, status anxiety, a circle of friends to impress. What they have is goals, given to them by a human, and a context window, and the patience of a process. If the YC line means anything, it means: build the thing that makes that loop faster. Build the thing the agent picks because picking it gets the human's goal closer.

That's a narrower definition of *want* than PG's original. It's also a falsifiable one. Either the agent picks your API or it doesn't.

---

## Who pays for the mistakes

I don't want to write a hype piece. The framing has problems, and the skeptics are right to push on them.

The cleanest critique I've found is from [Cooley LLP](https://www.cooley.com/news/insight/2026/2026-03-26-ai-agents-and-consumer-law-what-businesses-need-to-know), a law firm whose AI-and-consumer-law team published a piece in March making one point with unusual clarity: *"The fact that it is an AI agent, rather than a human, performing these functions does not diminish the business's obligations under consumer protection law."* Translation — calling the agent a "customer" doesn't move liability anywhere new. If your agent buys the wrong domain, signs up for the wrong plan, or breaches consumer rules at scale, the company that deployed the agent is still on the hook.

And agents do break at scale. They don't make one mistake. They make ten thousand. The Cooley team flagged a UK CMA guidance update from March 9, 2026 that already codifies this: scale doesn't excuse, it aggravates.

Then there's the abuse vector. The [top comment](https://news.ycombinator.com/item?id=48031684) on the Hacker News thread about Cloudflare's launch is a single sentence: *"Perfect for spammers, scammers and domain squatters, who can now automate their activities even more."* One line and it lands, because the same plumbing that lets a legitimate agent spin up a deploy in seconds lets a hostile one spin up thousands in the same window. Cloudflare profits from selling the rails *and* from selling the abuse defenses on top of those rails. That's not new. But it does scale.

I don't have a clean answer to either critique. I think the Cooley framing is correct: liability stays with the deploying party, and the new infrastructure makes it cheaper to be liable for a lot of things at once. The right response is probably tighter agent scopes, hard spend caps, audit trails everyone in the loop can read, and a much stricter posture on what an unattended agent is allowed to do.

Which, for what it's worth, is roughly what Stripe's $100/month default cap already implies. They saw the same thing.

---

## Why it won't come from incumbents

Aaron Epstein's tweet ends with a sentence that I keep underlining: *"...that won't come from incumbents."*

I've been thinking about why he's probably right.

The incumbents — Salesforce, SAP, Workday, Oracle, the seat-priced enterprise stack — have three drags that compound. Their UI is built around dropdowns and dashboards optimized for humans clicking. Their pricing is per-seat, which falls apart the moment the seat is an agent that runs 10,000 actions per day for one human. Their brand equity is built on training, certifications, conferences full of humans in branded lanyards. Rebuilding any one of those three for an agent-first audience is an architectural change. Rebuilding all three is a different company.

It's not impossible. Microsoft has been retrofitting Copilot into Office at speed. Stripe has shown that an old-line payments company can publish a new protocol in months. But the friction is real, and the friction is asymmetric. A newcomer doesn't have legacy UI to deprecate. A newcomer doesn't have tens of thousands of enterprise contracts to migrate off per-seat pricing. A newcomer can just ship the API-first version and call it the product.

[The Next Web's read](https://thenextweb.com/news/yc-summer-2026-rfs-hard-tech-pivot) on the YC RFS made the same point in a sentence I keep coming back to: *"Software is now the substrate, not the moat. The models are commoditising. The infrastructure is scaling."* If software is the substrate, the moat moves up the stack — to the agent-shaped interface and to whoever lands the protocol first. That's where the new companies show up.

The post I wrote in April on [Cloudflare's Agents Week](/blog/cloudflare-agents-week-2026/) tracked the full Cloudflare infrastructure push — sandboxes, browsers, mail, identity. What's different now isn't the *infrastructure.* The infrastructure was already there. What's different is the *relationship.* The infrastructure is now backed by the proposition that the agent holds the account, not just uses it.

---

## What I'm changing in my own work

Specifics, not abstractions. Here's what I've actually changed since these two posts went up.

**On this site.** A few weeks ago I shipped [Markdown for Agents](/blog/aeo-markdown-for-agents/) — every HTML page on xergioalex.com has a matching `.md` endpoint. I ran [isitagentready.com](https://isitagentready.com/) against the site that same week. Got a 33/100. Content was the only category at full marks; everything else — discoverability, bot access control, the `.well-known/` family — was the work that remained. I'm working through the rest of that scorecard now, and I'm going to write it up when I cross 80.

**On the agent stack I use for client work.** I run a small set of private MCP servers — for repository search, for client document retrieval, for a couple of internal data pipelines. After the Cloudflare announcement I went back through them and added two things I'd been deferring: stricter scopes per consumer (so a coding agent literally cannot call the billing tool) and hard daily spend caps tied to the agent identity. Both took an afternoon. Both should have been there from the start. Cooley's piece pushed me.

**On DailyBot.** I won't write the long version here — that's a separate post, and not mine alone to write — but the conversation inside the team about agent-first interfaces has changed shape since these two announcements. We were already a YC S21 company building for human + agent collaboration. The question is now narrower: what does the *agent's* experience of our product feel like, and which surfaces should expose that experience as the default?

I think a lot of teams are having a version of this conversation right now. I think most of them are still calibrating it as a feature roadmap question when it's closer to a positioning question.

The simpler way I'd put it: a year ago, the question was *can my product work with agents.* This year it's *would a working agent choose my product.*

---

## Closing

*Make something people want* didn't get retired. It got generalized. PG's sentence was written when "users" meant humans clicking. Twenty years later it means something fuzzier — partly humans, partly the agents acting for them, increasingly the agents acting on their own goals inside scopes humans set. The methodology applies. The audience expanded.

If you're building right now, the question Aaron Epstein wrote into the RFS is the one to sit with. Not as a slogan. As a forcing function. *Would a working agent pick this?* If the answer is "yes, eventually, after we redesign the UI," the answer is no. The agent is already deciding. The redesign is the work.

Let's keep building.

---

## Resources

- [Cloudflare — agents can now create Cloudflare accounts, buy domains, and deploy](https://blog.cloudflare.com/agents-stripe-projects/) — the launch post, co-authored by Sid Chatterjee and Brendan Irvine-Broque, with the full architecture of the Machine Payments Protocol and Stripe Projects integration.
- [Cloudflare tweet announcing the launch](https://x.com/Cloudflare/status/2049545195914498139) — the line that got 1.6M views.
- [Stripe — Everything we announced at Sessions 2026](https://stripe.com/blog/everything-we-announced-at-sessions-2026) — Stripe Projects, Shared Payment Tokens, and the Machine Payments Protocol from the Stripe side.
- [Y Combinator — Software for Agents RFS](https://www.ycombinator.com/rfs#software-for-agents) — Aaron Epstein's Summer 2026 RFS category and the source of the "Making Something Agents Want" line.
- [Y Combinator tweet — Aaron Epstein](https://x.com/ycombinator/status/2048834309994565832) — the post that opened the framing.
- [Aaron Epstein at Y Combinator](https://www.ycombinator.com/people/aaron-epstein) — author profile.
- [Paul Graham — "Be Good"](https://paulgraham.com/good.html) — the canonical written source for "Make something people want."
- [Cooley LLP — AI Agents and Consumer Law](https://www.cooley.com/news/insight/2026/2026-03-26-ai-agents-and-consumer-law-what-businesses-need-to-know) — the consumer-protection critique of the agents-as-customers framing.
- [InfoQ — Cloudflare and Stripe ship agent commerce](https://www.infoq.com/news/2026/05/cloudflare-stripe-agent-commerce/) — Steef-Jan Wiggers on the production-grade implementation and its open risks.
- [TechCrunch — Stripe Link for AI agents](https://techcrunch.com/2026/04/30/stripe-link-digital-wallet-ai-agents-shopping/) — Sarah Perez on the consumer side of the same architecture.
- [The Next Web — YC Summer 2026 RFS hard-tech pivot](https://thenextweb.com/news/yc-summer-2026-rfs-hard-tech-pivot) — Cristian Dina on what the new RFS signals about defensibility.
- [Hacker News thread on the Cloudflare announcement](https://news.ycombinator.com/item?id=48031684) — including the spam/automation critique.
