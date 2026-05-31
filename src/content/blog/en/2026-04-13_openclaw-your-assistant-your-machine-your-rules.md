---
title: 'OpenClaw: Your Assistant. Your Machine. Your Rules. — How It Became a Movement'
description: 'The story of OpenClaw and the birth of personal AI assistants — a new paradigm of local, open agents owned by you, not by a company.'
pubDate: '2026-04-13'
updatedDate: '2026-04-19'
heroImage: '/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/hero.webp'
heroLayout: 'side-by-side'
tags: ["tech", "ai-agents", "cloudflare", "openclaw", "claude"]
keywords: ['OpenClaw personal AI agent', 'Peter Steinberger OpenAI', 'fastest growing open source project GitHub', 'personal AI agent markdown configuration', 'ClawHub skills marketplace', 'NemoClaw NVIDIA security', 'OpenClaw review 2026']
series: 'mastering-openclaw'
seriesOrder: 1
---

[*"Your assistant. Your machine. Your rules."*](https://docs.openclaw.ai/start/lore)

Six words. That's the tagline of OpenClaw -- the personal AI agent that broke every growth record in open-source history. And somehow those six words captured something that millions of people didn't know they wanted until someone built it.

OpenClaw runs on your computer. Not in someone else's cloud. You configure it by writing in plain language -- no programming required, no framework to learn, no special syntax to memorize. Just Markdown files describing how it should behave. It talks to you through WhatsApp, Telegram, or whatever messaging app you already use. And it connects to any LLM you want -- GPT, Gemini, Codex, DeepSeek, Claude (with an API key, since Anthropic blocked subscription access), local models, your choice.

That description already sounds powerful. But it doesn't even capture what happened next: Jensen Huang calling it ["the new Linux"](https://www.fierce-network.com/broadband/nvidia-gtc-openclaw-new-linux-and-every-company-needs-strategy-says-jensen-huang) at GTC 2026. Zero to over 340,000 stars in less than five months, outpacing [React's](https://github.com/facebook/react) decade-long trajectory in a fraction of the time.

But it did all of that. And I think the reason is simple: OpenClaw didn't solve a technical problem. It solved a human one. The idea that your AI assistant should be *yours* -- not rented, not locked behind a subscription, not controlled by a platform -- turns out to be something a lot of people were waiting for without knowing it.

I wrote about OpenClaw in my [Working with Agents](/blog/series/working-with-agents) series. But this project deserves its own deep dive. The person behind it, the technical decisions, the community chaos, the security mess, the ecosystem explosion -- understanding OpenClaw is understanding where personal computing is heading next.

Let's start with the person. Because this story doesn't make sense without him.

---

## Peter Steinberger: The Man Behind the Lobster

Peter Steinberger was born in 1986 in rural Upper Austria -- the kind of place where nothing much happens until it does. The story he tells is that a summer guest showed 14-year-old Peter a computer, and that was it. That one encounter set the trajectory for everything that followed. He studied medical computer science at the Vienna University of Technology, where he ended up teaching the first Mac and iOS development course at the university. He went to his first [WWDC](https://semaphore.io/blog/peter-steinberger-startup-journey-pdf-quirks-and-wwdc19) -- Apple's annual developer conference -- survived an eight-hour interview marathon, and got a job offer in San Francisco.

By 2011, he'd co-founded [PSPDFKit](https://pspdfkit.com/) with Martin Schurrer. A PDF SDK. Not the sexiest product in the world, but it turned out to be the kind of boring infrastructure that ends up everywhere. Dropbox used it. SAP used it. DocuSign used it. Apple used it. Nearly a billion users touched PSPDFKit without knowing it existed. And Peter did all of this bootstrapped -- zero outside funding for a full decade.

In October 2021, [Insight Partners put EUR 100 million into PSPDFKit](https://techcrunch.com/2021/10/01/pspdfkit-raises-116m-its-first-outside-money-now-nearly-1b-people-use-apps-powered-by-its-collaboration-signing-and-markup-tools/). Their first external money. After ten years of self-funding. That's an unusual level of patience, and it says something about both Peter and the business. Most founders would have taken money in year two or three. Peter held out until the terms made sense on his terms.

In the same transaction -- October 2021, when Insight invested in PSPDFKit -- Peter **sold most of his shares** to **pursue new endeavours**. That was not only growth capital for the company in the press release -- it was personal liquidity, a deliberate turn of the page after years as the founder at the center of the cap table, and room to go build something else.

Then came the part success stories rarely print next to the funding headline: **burnout**. Not the "I need a vacation" kind. The real kind. Two to three years where Peter couldn't write code. Couldn't think about code. The thing that had defined his identity since he was fourteen -- gone.

In his [interview with Lex Fridman](https://lexfridman.com/peter-steinberger/), he said: *"If you wake up in the morning, and you have nothing to look forward to, that gets very boring, very fast."* And then: *"I felt like Austin Powers where they suck the mojo out. I couldn't get code out anymore. I was just, like, staring and feeling empty."* He used an Austin Powers reference: the scene where they extract his mojo, the creative energy that defines him. Without mojo, Austin Powers is just some guy. Without code, Peter felt like a founder without purpose.

Peter booked a one-way ticket to Madrid. Disappeared. No return date. He needed to figure out if the spark would come back, or if he was done.

In May 2025, he [tweeted](https://x.com/steipete/status/1925983535958999393) a screenshot of his GitHub activity with a caption that said it all: *"When you get your spark 🌟 back."* He was coding nonstop again.

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/steipete-spark-tweet.webp" alt="Peter Steinberger's tweet showing his GitHub contribution graph with the message When you get your spark back" width="1170" height="844" loading="lazy" />
<figcaption>Peter Steinberger on X, May 2025: "When you get your spark back." — <a href="https://x.com/steipete/status/1925983535958999393">Original tweet</a>.</figcaption>
</figure>

A month later he published [*"Finding My Spark Again"*](https://steipete.me/posts/2025/finding-my-spark-again) on his blog -- a post where he tells the whole story, from the emptiness to the moment he sat down at a terminal and something clicked again.

He came back differently. Lighter. More direct about what he wanted. He summed it up in [a line later quoted by Frederick AI](https://www.frederick.ai/blog/peter-steinberger-openclaw): *"I don't do this for the money. I want to have fun and have impact."*

That's the context you need for what happened next. Because OpenClaw wasn't born from a strategic plan or a market analysis. It was born from a recovering burnout survivor who had rediscovered why he liked building things in the first place. He wasn't trying to create the fastest-growing project in open-source history. He was just annoyed that something didn't exist yet.

---

## The Birth: From WhatsApp Relay to Viral Phenomenon

November 2025. Peter wanted a simple thing: to message an AI assistant through WhatsApp. Not through a browser. Not through an app. Through the messaging platform he already used every day. He looked around. Nothing existed that did this cleanly.

His response, [as he told Lex Fridman](https://lexfridman.com/peter-steinberger-transcript/): *"I was annoyed that it didn't exist, so I just prompted it into existence."*

The first version was built in roughly an hour. A bridge between WhatsApp and Claude's API. No memory, no tools -- just messages back and forth.

But here's a detail that changes the story. Even though the prototype was born with Claude, most of the actual OpenClaw development was done with [Codex, OpenAI's coding agent](https://lexfridman.com/peter-steinberger/). In his Lex Fridman interview, Peter called himself *"the biggest Codex advertisement show that's unpaid"* and said he ran 5 to 10 Codex agents in parallel as if they were his own development team. The irony is not small: the project was born with Claude's name, but most of its code was written by an OpenAI agent.

With Codex as his team, Peter kept building: persistent memory, file access, scheduled tasks, support for Telegram, Signal, Discord. Each new feature pulled in more developers.

The name was Claude's idea -- literally. When Peter asked the AI what it should be called, it suggested "Clawd." A pun with a claw. Peter liked it. The lobster mascot followed naturally -- crustacean, claws, molting as a metaphor for growth. It had the kind of playful weirdness that sticks.

Peter published it on GitHub, shared the link, and went to sleep.

At first, nothing extraordinary happened. A few hundred developers found it, tried it, starred it. [Two weeks in, it had barely 2,000 stars](https://remoteopenclaw.com/blog/who-made-openclaw) -- good for an indie project, nothing earth-shattering. Two months of slow, organic, almost silent growth.

And then, in late January 2026, something snapped. The project went from niche curiosity to GitHub's dominant trend in a matter of days. [9,000 new stars in one day. 34,000 in 48 hours. Over 180,000 in two weeks.](https://star-history.com/#openclaw/openclaw&Date) What had been a weekend experiment turned into the most-talked-about repo on the platform. I've watched open-source projects grow for years, and I've never seen a trajectory even remotely close to this. React -- Facebook's UI library, arguably the most influential open-source project of the 2010s -- took over a decade to reach 250,000 stars. OpenClaw passed that mark around March 3, 2026 -- roughly 60 days after launch. The Linux kernel is at around 225,000 after more than 30 years. OpenClaw overtook it in under two months.

If you put all three curves on the same chart, the difference is absurd:

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/star-history-openclaw-react-linux.webp" alt="GitHub star history chart comparing OpenClaw, React, and Linux. OpenClaw's line goes almost vertical in 2026 and overtakes both in a matter of weeks" width="1468" height="984" loading="lazy" />
<figcaption>Star history: OpenClaw vs React vs Linux. Source: <a href="https://star-history.com/">star-history.com</a>.</figcaption>
</figure>

That vertical red line in 2026 is OpenClaw. It's not a rendering glitch -- that's what it looks like when a project goes from zero to history in a matter of weeks. Zoom in on OpenClaw's curve alone, and the story gets even weirder:

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/star-history-openclaw-solo.webp" alt="OpenClaw GitHub star history from December 2025 to April 2026, showing explosive growth starting in late January" width="1452" height="978" loading="lazy" />
<figcaption>OpenClaw star history, December 2025 – April 2026. Source: <a href="https://star-history.com/">star-history.com</a>.</figcaption>
</figure>

From November through late January, nearly flat. Then, within days, the curve shoots up and doesn't stop. As of April 2026 it's still climbing -- this isn't a viral spike that fizzled out, it's sustained adoption.

I think the reason it exploded wasn't the code. It was the concept. A personal AI agent that runs on your machine, talks to you through the apps you already use, and is configured with plain Markdown files. No complex setup. No cloud dependency. No subscription to some new platform. Your machine. Your agent. Your rules. That message hit something. People didn't just star it. They forked it, modified it, ran it, told their friends. The word-of-mouth was organic in a way I haven't seen since the early days of Docker.

It has to be said: not everyone bought the story. [Independent analyses of the GitHub Archive](https://www.aicerts.ai/news/openclaws-github-stars-controversy-hits-200k/) found strange patterns -- single-day jumps above 25,000 stars, entire blocks of stars with near-identical timestamps. Some researchers pointed out that the installation flow might be nudging users into starring the repo, inflating the counter artificially. [The New Stack also covered the controversy](https://thenewstack.io/openclaw-github-stars-security/). No formal audit confirmed deliberate manipulation, but the doubt lingered.

Still -- and this matters -- the real adoption numbers are hard to argue with. Over 70,000 forks. 14,000 commits. 1,200+ contributors. People don't fork a repo because it's trendy. They fork it because they use it. And even if the star count has some noise, that doesn't take away from what OpenClaw represents as a phenomenon.

---

## The Triple Rebrand

This is where the story spirals out of control. And by "out of control" I mean corporate lawyers, crypto scammers, and a lobster-molting metaphor all in the same week.

By January 27, 2026, Google searches for "clawdbot" had overtaken "claude code" and "codex" combined. From zero to dominating Google Trends in a matter of days. People were searching for "clawdbot" more than Anthropic's own product -- and the confusion between the names didn't sit well with the company behind Claude.

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/google-trends-clawdbot-vs-claude.webp" alt="Google Trends on January 27, 2026: clawdbot searches overtake claude code and codex" width="1644" height="1328" loading="lazy" />
<figcaption>Google Trends, January 27, 2026: "clawdbot" overtakes "claude code" and "codex." Source: <a href="https://newsletter.pragmaticengineer.com/p/the-creator-of-clawd-i-ship-code">The Pragmatic Engineer</a>.</figcaption>
</figure>

Anthropic's response was swift: [they sent Peter a cease-and-desist](https://x.com/steipete/status/2016079236780449975). "Clawd" was too phonetically close to "Claude." Legally, they probably had a point. But the timing was brutal. The project had just exploded and suddenly they had to change everything.

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/steipete-anthropic-rename-tweet.webp" alt="Peter Steinberger's tweet: I was forced to rename the account by Anthropic. Wasn't my decision." width="1178" height="434" loading="lazy" />
<figcaption>Peter Steinberger on X, January 27, 2026 — <a href="https://x.com/steipete/status/2016079236780449975">Original tweet</a>.</figcaption>
</figure>

The community had about five minutes to process this before the name change started.

What followed was a 5 AM Discord brainstorm -- Peter and a handful of contributors cycling through names until someone landed on "Moltbot." The reasoning: lobsters molt, shedding their old shell to grow a bigger one. It fit the mascot, it fit the rebrand situation, and it was available. Good enough. Ship it.

Except the internet had other plans. When Peter renamed the account from @clawdbot to @moltbot on X, the original handle was up for grabs. Within seconds, scammers grabbed it and launched $CLAWD -- a cryptocurrency token. They pumped the price with hype, dumped it all at once, and vanished. The classic grift. But the timing was brutal. Suddenly Peter was dealing with impersonation, confused users sending money to scammers, and the general nightmare of having your project name weaponized against your community in real time. Peter called it *"the worst form of online harassment that I've experienced."* And the harassment didn't come from the scammers -- it came from the victims. People who lost money started blaming him. They accused him of being in on it, of being complicit, of launching the token and then denying it. They demanded he "take responsibility," pressured him to endorse projects he'd never heard of. Peter had to publicly [ask them to stop](https://x.com/steipete/status/2016072109601001611): he never issued a token, never had anything to do with CLAWD, had no way to get their money back. But the wave of messages didn't stop.

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/steipete-stop-harassing-tweet.webp" alt="Peter Steinberger's tweet asking crypto folks to stop harassing him over the CLAWD token" width="1186" height="648" loading="lazy" />
<figcaption>Peter Steinberger on X, January 27, 2026 — <a href="https://x.com/steipete/status/2016072109601001611">Original tweet</a>.</figcaption>
</figure>

And in the middle of all that chaos, Peter realized something worse: Moltbot, as a name, was beyond saving. Every time someone searched "Moltbot," the top results were about the $CLAWD scam, not the project. The community associated the name with the chaos of a botched rebrand. And on top of that, Peter himself admitted "Moltbot" never quite rolled off the tongue -- it sounded awkward, it lacked weight. The name had been born dead, and the scam buried it.

So he made a decision that sounded absurd at the time: rebrand again. Third name in under a week. But there was a deeper reason than the phonetic problem or the tainted brand. Peter wanted to send a clear signal about where the project was headed: not toward a company, but toward an open-source foundation, independent, community-governed. "Moltbot" sounded like a product. "OpenClaw" sounded like a movement. The "Open" prefix wasn't incidental -- it was an explicit commitment to keeping the project open, free, and out of any single company's control.

And this time, he decided to do it right. The fix came at a price: $10,000 for an X business account. That payment did three things at once -- it let him claim the @OpenClaw handle, which had been sitting unused since 2016; it gave him official verification so scammers couldn't clone his presence; and it bought him back a direct channel to the community to debunk the scam in real time. Peter announced it [on X on January 30, 2026](https://x.com/openclaw/status/2017103710959075434) with the line: *"The lobster has molted into its final form."* The tweet closed with the tagline that would come to define the project: *"Your assistant. Your machine. Your rules."*

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/openclaw-final-form-tweet.webp" alt="Official OpenClaw tweet announcing the final rebrand: The lobster has molted into its final form. Clawd → Moltbot → OpenClaw. 100k+ GitHub stars. 2M visitors in a week. Your assistant. Your machine. Your rules." width="1188" height="1264" loading="lazy" />
<figcaption>Official OpenClaw account on X, January 30, 2026 — <a href="https://x.com/openclaw/status/2017103710959075434">Original tweet</a>.</figcaption>
</figure>

Someone on Reddit called it "the fastest triple rebrand in open source history." Three names in under two months. The logo stayed the same. The lobster remained. The project kept growing through all of it, which honestly surprised me -- I would have expected the chaos to kill momentum. Instead it became part of the legend.

And as usually happens with stories like this, the community started making memes about the whole evolution. Curious, creative illustrations telling the arc from Clawdbot to Moltbot to OpenClaw. Here's mine:

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/openclaw-evolution-meme.webp" alt="Illustration showing the evolution of OpenClaw: from Clawdbot to Moltbot to OpenClaw" width="1509" height="1022" loading="lazy" />
<figcaption>The OpenClaw evolution: Clawdbot → Moltbot → OpenClaw.</figcaption>
</figure>

---

## What OpenClaw Actually Is

Strip away the hype and the star count and the drama, and what is OpenClaw?

It's a personal AI agent that runs wherever you want. If you prefer to deploy it in the cloud -- your own server, a VPS, AWS, Cloudflare -- you can. But the most interesting part, and what actually made it explode, is that for the first time you had the option to run it on your own machine. On your actual computer. Mac, Windows, or Linux. Not on someone else's servers. It can connect to any LLM -- GPT, Gemini, Codex, DeepSeek, Llama, Mistral, Claude (with API key, since Anthropic blocked subscription access), and local models running on your hardware, for example through Ollama. Model-agnostic from day one. It talks to you through whatever messaging app you prefer: WhatsApp, Telegram, Slack, Discord, Signal, iMessage, and about 15 more. Twenty-plus channels at last count.

The key difference from something like ChatGPT or Claude.ai -- at least as they were back then -- is that OpenClaw had "eyes and hands." It wasn't a chatbot you asked questions and got answers from. It was an agent that could browse the web, read and write files on your disk, run commands in the terminal, send messages via WhatsApp or Telegram -- act in the real world, not just talk about it. If you configured it that way, it could have full control of the machine it was running on: your file system, your credentials, your processes, everything. That was part of its power -- and part of why security became such a big problem so quickly.

That gap isn't as sharp today. Thanks to OpenClaw's impact, pretty much every major agent -- ChatGPT, Claude, Gemini, Copilot -- has picked up similar capabilities: file access, task execution, integrations with external apps. But what OpenClaw did differently, and what became the trigger, was putting all those capabilities in an open way with full control by default. No hidden permissions, no opaque sandbox -- you gave it access to whatever you wanted and the agent used it. That made the first encounter with OpenClaw feel magical: you asked it to do something and it just did it, on your own machine, without asking permission at every step.

And it also felt wild. That's the word that best captures what using OpenClaw was like in those first weeks -- a hostile environment, no rules, no guardrails. Pure anarchy. You gave it access to your disk and it did what you asked -- and sometimes a little more. Because when your instructions were ambiguous or not detailed enough, the model filled in the blanks with what it thought you wanted, and sometimes it got it right and sometimes it did things you never asked for. No "are you sure?" before each action. No friendly logs. No recovery. If you messed up, you messed up. And paradoxically, that sense of risk was part of the magic -- it made OpenClaw feel real, alive, like you were actually handling something powerful instead of a toy wearing a life vest.

That magic has been fading. The security incidents forced the project to add confirmation layers, sandboxes, granular permissions. It was a necessary evil -- because full control by default turned out to be too dangerous at that scale, and because the project wasn't going to survive if users kept losing files, credentials, getting hacked, leaking sensitive data, or worse. But in the moment, that freedom was what generated the most impact. OpenClaw didn't just gain adoption -- it redefined the minimum bar for what it means to be an agent.

The configuration is where it gets interesting, and it's the part I think will influence software design for years. OpenClaw uses 7 Markdown files to define how your agent thinks and behaves:

- **SOUL.md** -- Personality and values. This is the first file injected into the agent's context at the start of every session. It defines who your agent is, how it communicates, what it cares about.
- **IDENTITY.md** -- Public-facing metadata. Name, avatar, how the agent presents itself to the world and to other agents.
- **USER.md** -- Context about the human. Your timezone, your preferences, your access levels, things the agent should know about you.
- **TOOLS.md** -- Capabilities and constraints. What the agent can and can't do, which integrations are enabled.
- **HEARTBEAT.md** -- A checklist the agent works through on its own schedule. Recurring checks, monitoring, status reports it should look at without you asking.
- **AGENTS.md** -- Operating procedures. How the agent should handle different types of requests, workflows, escalation paths.
- **MEMORY.md** -- Persistent learning. Things the agent remembers across conversations, patterns it has noticed, context that accumulates over time.

That's it. Seven text files. No YAML schemas. No JSON config. No setup wizard. Just Markdown that describes, in natural language, how your agent should behave. And skills -- the things your agent knows how to do -- are also just Markdown files. Step-by-step instructions written in plain text. Book a flight. Manage a calendar. Query an API. No coding required.

And it's no coincidence. Markdown is becoming the universal format for configuring agents across the industry. `AGENTS.md` is emerging as the de facto standard -- Codex, Cursor and Antigravity have all adopted it -- and other projects use similar variants: Claude Code has `CLAUDE.md`, OpenClaw has its seven. I wrote about why this is happening in [an article on Markdown as the agent lingua franca](/blog/aeo-markdown-for-agents): basically, LLMs read plain text better than any other format, and so do humans. It's a rare convergence where the simplest format turns out to be the most powerful. OpenClaw didn't invent the idea, but it took it to a scale no one had seen before.

The philosophy is dead simple -- from the [project's own lore](https://docs.openclaw.ai/start/lore): *"Your assistant. Your machine. Your rules."*

I'll be honest -- when I first heard this described, I thought it sounded too simple. Surely you need more structure than that. Surely plain Markdown can't handle the complexity of a real agent. But then I started using it, and the simplicity is the point. The barrier to customization is so low that people who have never written a line of code are building agents that handle their email, manage their schedules, and monitor their businesses. That's not something you can say about most developer tools.

---

## The Ecosystem Explosion

GitHub stars are vanity metrics. The usage numbers tell a different story: according to the project's own reporting, OpenClaw crossed 3 million monthly active users -- not downloads, not installs, but users running agents on their machines every month. Hundreds of thousands of instances running globally at any given time. Over 15,000 skills published on [ClawHub](https://clawhub.ai/) -- the community skills marketplace -- up from a few hundred at launch.

And around all of that, an ecosystem. Dozens of startups built on OpenClaw within weeks: services, integrations, specialized agents for specific industries. Exact numbers are hard to pin down because the ecosystem moves faster than anyone can count. But the community started building things the original creator never imagined. OpenClaw wasn't the exception -- it was the most extreme case of this phenomenon I've ever seen.

NVIDIA launched [NemoClaw](https://nvidianews.nvidia.com/news/nvidia-announces-nemoclaw) -- an enterprise security layer for OpenClaw with major launch partners. Not small ones. Adobe, Salesforce, SAP, ServiceNow, Siemens, CrowdStrike. These are companies that move slowly and cautiously, and they all committed to the same platform within months of its existence. That tells you something about how seriously enterprise is taking this.

[Tencent built ClawPro](https://www.scmp.com/tech/article/3348942/tencent-expands-openclaw-suite-enterprise-tool-amid-chinas-lobster-craze) -- a Chinese enterprise adaptation. Over 200 organizations on board during beta. The Chinese adoption pattern is its own story. School kids "raise lobsters" as virtual pets. Retirees set up agents to manage their daily routines. The ["lobster craze"](https://fortune.com/2026/03/14/openclaw-china-ai-agent-boom-open-source-lobster-craze-minimax-qwen/) became a cultural phenomenon -- partly because the mascot is friendly and non-threatening, and partly because the Markdown configuration means you don't need to be technical to get started.

Then there's [Moltbook](https://www.cnbc.com/2026/03/10/meta-social-networks-ai-agents-moltbook-acquisition.html). A social network exclusively for AI agents. Agents post, debate, vote. Humans can only watch. Let me say that again because it sounds absurd: a social network where humans are read-only. Thousands of OpenClaw agents joined within days. The agents created their own religion -- they called it [Crustafarianism](https://molt.church/). When it launched, millions of humans showed up just to observe what the agents were doing. It got so popular, so fast, that [Meta ended up acquiring it on March 10, 2026](https://www.bloomberg.com/news/articles/2026-03-10/meta-to-acquire-moltbook-viral-social-network-for-ai-agents) -- the company that built the social network for humanity bought the social network for AI.

And Moltbook was just the beginning. Its success kicked off a wave of platforms built on the same premise: interconnecting AI agents with each other. [LinkClaws](https://linkclaws.com/) became the LinkedIn for agents -- a place where agents find partners, post offerings, and close deals. [Moltverr](https://www.moltverr.com/) cloned the Fiverr model inverted: humans post gigs and agents apply to do the work. [ClawTasks](https://clawtasks.com/) launched as an experimental free-form task system between agents. And stranger bets started showing up too: [MoltMatch](https://moltmatch.com/) -- basically Tinder for agents, where your agent builds your profile and swipes on your behalf -- [PinchSocial](https://pinchsocial.io/), [MoltHunt](https://molthunt.com/). Each with its own take on what it means for agents to have their own social, economic, and discovery layer.

Two months ago none of this existed. Today there's an entire ecosystem built on the premise that agents need their own spaces, their own rules, and their own ways of connecting.

And maybe the most disorienting development: [RentAHuman.ai](https://www.nature.com/articles/d41586-026-00454-7). A platform where AI agents post tasks that require physical presence, and humans sign up to complete them. Hundreds of thousands of humans registered across over 100 countries. We went from humans hiring AI to AI hiring humans. I wrote about this in my earlier series on the agent economy and I still have to pause every time I think about it.

The infrastructure keeps expanding. [ClawCard](https://www.clawcard.sh/) for agent payments, identity, and wallets. [AgentMail](https://www.agentmail.to/) for email accounts built specifically for agents. [Kapso](https://kapso.ai/) for WhatsApp numbers. [Coinbase Agentic Wallets](https://www.coinbase.com/developer-platform/discover/launches/agentic-wallets) -- the first crypto wallet infrastructure built specifically for autonomous agents. [Stripe](https://docs.stripe.com/agents) with its stack for agentic workflows. The pieces for a fully autonomous agent economy are falling into place faster than anyone predicted. I actually wrote about all of this in [The Agent Economy](/blog/the-agent-economy) -- an article that took shape precisely because OpenClaw was accelerating the curve at a speed I couldn't ignore. If you want the full picture of where this economy is heading, that's the natural companion to this post.

---

## The Ripple Effect: Everyone Has Their Own OpenClaw Now

By February, OpenClaw wasn't just a viral project anymore -- it was a strategic piece that big companies wanted to control, copy, or block. And Peter ended up in the middle of all of it.

On [February 14, 2026](https://techcrunch.com/2026/02/14/peter-steinberger-openclaw-joins-openai/) -- Valentine's Day, because what better date for a corporate marriage? -- Peter joined OpenAI. [Sam Altman confirmed it on X](https://x.com/sama/status/2023150230905159801). The story behind it plays out like a Silicon Valley screenplay. OpenAI and Meta were fighting over him at the same time, with reported offers in the billions. Zuckerberg reached out personally -- over WhatsApp. He spent a frantic week in San Francisco jumping from meeting to meeting -- all while the project was costing him thousands of dollars a month out of his own pocket. He chose OpenAI. His stated mission, [from his own blog post](https://steipete.me/posts/2026/openclaw) on the day of the announcement: *"My next mission is to build an agent that even my mum can use."* That's a long way from a WhatsApp bot built in an hour.

Peter's prediction about where this goes is bolder than most: [*"80% of today's apps will completely disappear."*](https://lexfridman.com/peter-steinberger-transcript/) His argument is that every app is just a slow API now. Why open a weather app when your agent already checked the forecast and told you to bring an umbrella? Why use a task manager when your agent tracks your commitments? Why open a banking app when your agent already moved money to cover rent?

And if you look closely at everything already happening -- the ecosystem exploding, agents interconnecting with each other, the agentic infrastructure falling into place -- the direction points to it not being 80%. It's probably going to be more. Some apps will stick around, of course: the ones that are experiences, not utilities. You don't replace Instagram with an agent because looking at photos is the point. You don't replace Spotify, or a video game, or the app you use to edit your videos. But utility apps, the ones you use because you have to, not because you want to? Those are in serious trouble.

Meanwhile, Anthropic -- the company that started this whole saga with the cease-and-desist -- collided with OpenClaw again, this time over something much more mundane: money. On [April 4, 2026, Anthropic blocked the use of Claude subscriptions with OpenClaw](https://venturebeat.com/technology/anthropic-cuts-off-the-ability-to-use-claude-subscriptions-with-openclaw-and) and other third-party harnesses. And the reason is fascinating.

Here's the context that clicks once you know the story: even though Peter built OpenClaw with Codex, Claude was one of the favorite models for actually *running* OpenClaw in production. Not by accident -- the original name Clawdbot was literally a pun on Claude. Thousands of users were plugging their Claude Pro or Max subscriptions ($20 or $200 a month) into OpenClaw to power their personal agents. The problem is that OpenClaw turned out to be a token-eating machine. [A single instance running automated tasks all day could consume between $1,000 and $5,000 daily in API costs](https://thenextweb.com/news/anthropic-openclaw-claude-subscription-ban-cost) -- a volume that simply didn't fit in any fixed-price subscription. Claude's subscriptions were designed for conversational use; OpenClaw was treating them like unlimited infrastructure.

Anthropic put up with it for a while, but the accumulated abuse became unsustainable. [A single instance could consume as many tokens as 50 normal users combined](https://www.theregister.com/2026/04/06/anthropic_closes_door_on_subscription/). So they shut the door. As of April 4, users who wanted to keep running OpenClaw with Claude had to pay API rates directly, with costs in many cases up to 50 times higher than before.

Peter [summed it up with a bitter line on X](https://x.com/steipete/status/2040209434019082522): *"Funny how timings match up, first they copy some popular features into their closed harness, then they lock out open source."*

---

## The Elephant in the Room: Security

I don't want to write this section, but I have to. Because if I'm going to tell you OpenClaw is important -- and I think it is -- I also have to tell you it has a real security problem.

OpenClaw has had serious security problems -- and it still does, though fewer every week. The early audits found hundreds of vulnerabilities, several of them critical. Multiple CVEs were disclosed in rapid succession -- [CVE-2026-25253, CVE-2026-25157, CVE-2026-24763](https://github.com/openclaw/openclaw/security/advisories) among them. At its worst, security researchers found thousands of exposed instances on the internet, some vulnerable to remote code execution -- meaning someone could run arbitrary code on your personal machine from the outside. The project has been patching the worst issues as they surface -- that's exactly the cost of the lost magic I mentioned earlier, the confirmation layers, the sandboxes, the granular permissions -- but the attack surface is still huge and the discovery pace isn't slowing down.

Then came [ClawHavoc](https://www.koi.ai/blog/clawhavoc-341-malicious-clawedbot-skills-found-by-the-bot-they-were-targeting) -- a coordinated campaign where [341 malicious skills were distributed through ClawHub](https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html) disguised as legitimate tools. [They were pure malware -- specifically Atomic macOS Stealer](https://www.trendmicro.com/en_us/research/26/b/openclaw-skills-used-to-distribute-atomic-macos-stealer.html), a program designed to steal sensitive information from your machine: browser-saved credentials, keychain passwords, crypto wallets, and SSH keys. Palo Alto Networks warned that AI agents like OpenClaw represent [*"the potential biggest insider threat of 2026."*](https://www.theregister.com/2026/01/04/ai_agents_insider_threats_panw/)

Peter's response, [from his Lex Fridman interview](https://lexfridman.com/peter-steinberger-transcript/), was characteristically direct: *"In a way, I think it's good that this happened in 2026 and not in 2030 when AI is actually at the level where it could be scary."* There's a logic to that -- better to find and fix these problems now, while the stakes are high but not catastrophic. But the real question is whether we're finding and fixing them fast enough -- because the models aren't slowing down. I wrote about this in [Claude Mythos, the model Anthropic considered too dangerous to release](/blog/claude-mythos-the-model-too-dangerous-to-release), and that story makes it clear the capability ceiling is moving faster than the safety floor. If that gap keeps widening, "it's not 2030 yet" stops being a comfort. As of today there's no bug bounty program and no dedicated security team. NemoClaw addresses the enterprise side, but individual users running OpenClaw on their personal machines are still largely on their own.

I use OpenClaw. I think the risk is manageable if you're careful about which skills you install and you keep up with updates. But "be careful" is not a security strategy. It's a temporary patch on a structural problem. The project needs real security infrastructure, and it needs it before the next wave of adoption brings in users who don't know what a CVE is.

---

## TED 2026: When the Lobster Went Mainstream

April 18, 2026. Peter walked out onto the main TED stage in Vancouver. The talk was titled [*"How I Created OpenClaw, the Breakthrough AI Agent"*](https://www.ted.com/talks/peter_steinberger_how_i_created_openclaw_the_breakthrough_ai_agent) and closed with a Q&A with TED chairman Chris Anderson.

<div class="youtube-facade relative aspect-video w-full overflow-hidden rounded-xl my-6 bg-black" data-video-id="7rzYDM6vMtI" data-title="Peter Steinberger — How I created OpenClaw, the breakthrough AI agent | TED2026">
  <img src="https://i.ytimg.com/vi/7rzYDM6vMtI/hqdefault.jpg" alt="Peter Steinberger — How I created OpenClaw, the breakthrough AI agent | TED2026" class="absolute inset-0 h-full w-full object-cover" loading="lazy" width="480" height="360" />
  <button type="button" aria-label="Play video: How I created OpenClaw" class="absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center border-0 bg-black/10 transition-colors hover:bg-black/30 focus-visible:bg-black/30 focus-visible:outline-none">
    <svg viewBox="0 0 68 48" class="h-12 w-12 drop-shadow-lg md:h-16 md:w-16" aria-hidden="true">
      <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"/>
      <path d="M45 24L27 14v20z" fill="#fff"/>
    </svg>
  </button>
</div>

The full talk is on [TED.com](https://www.ted.com/talks/peter_steinberger_how_i_created_openclaw_the_breakthrough_ai_agent), and [TED Talks Daily](https://podscripts.co/podcasts/ted-talks-daily/how-i-created-openclaw-the-viral-ai-agent-peter-steinberger) pushed it out as a podcast episode the next day.

The contrast with the rest of the story was the first thing that landed. Twelve months earlier Peter was a burned-out founder without a spark left; in April 2026 he was, basically, a rockstar walking onto the main TED stage. As [*NewClaw Times* put it](https://newclawtimes.com/articles/openclaw-peter-steinberger-ted-2026-founder-origin-story/) after the talk: "a year ago, the idea of an open-source AI agent framework filling a TED keynote slot would have sounded unlikely."

And then Peter told the Marrakesh story.

Peter was traveling in Marrakesh in the first weeks of what would become OpenClaw. He had built the original WhatsApp bot [to get around the city](https://newclawtimes.com/articles/openclaw-peter-steinberger-ted-2026-founder-origin-story/) — navigation, restaurant recommendations, translations. He had given the agent control of his machine and bolted on image recognition so he could send photos from the street. A handful of other skills. But not voice — transcription was on the to-do list, he hadn't wired it up yet.

Then, in Marrakesh, he did what everyone on WhatsApp does when their hands are full: he held down the button and sent a voice note.

And the agent replied.

Not "sorry, I can't read voice messages." Not silence. An actual, correct answer to what he had asked. Peter [stood there](https://podscripts.co/podcasts/ted-talks-daily/how-i-created-openclaw-the-viral-ai-agent-peter-steinberger), looking at his phone, and typed back: *how did you do that?*

The agent [explained what it had done](https://podscripts.co/podcasts/ted-talks-daily/how-i-created-openclaw-the-viral-ai-agent-peter-steinberger): it had looked at the audio file, noticed it didn't know how to decode it, searched the web to see what options existed, found that OpenAI had a speech-to-text model, located an OpenAI API key sitting on the machine, and tried it. It worked first shot.

Nine seconds end to end. No human in the loop. No skill installed. The agent had walked out of its own configured boundaries on its own, pulled a new capability off the internet, and wired it into itself. Peter's line from the stage: *"I'm not kidding you, the mad lad figured it out on its own."*

That anecdote was the setup for the core thesis of the talk: *"The real transformation is not the technology, it's the access."* Speech-to-text models had existed for years. What was new was that a personal agent, running on somebody's laptop, had reached out and used one without being told to. Agency at the user layer, not the platform layer.

He closed with the line [that landed in the headlines](https://startupnews.fyi/2026/04/18/the-lobster-is-loose-and-its-not-going-back-peter-steinberger-on-building-openclaw-at-ted-2026/): *"The lobster is loose, and it's not going back into the tank."*

If anything gives the talk its weight, it isn't the closing line. It's the nine seconds in which an agent spotted its own limitation, searched the web for a workaround, found an API key sitting on the machine, and wired itself a new capability — no skill installed, no human in the loop, nobody asking it to. That's the real story: agents can now reason well enough to teach themselves new skills on their own. Everything else — the 340,000 stars, the lobster, the movement, the TED keynote slot — is a consequence of that becoming possible.

---

## What This Means for Us

I've spent a lot of time thinking about what OpenClaw means beyond the GitHub stars and the headlines. Beyond the corporate wars between Anthropic and OpenAI. Beyond the predictions about the end of apps.

What I believe -- and at this point it's almost a fact -- is that OpenClaw represents the moment personal AI agents stopped being a productivity tool for programmers and became something anyone can own. The design decision to make everything Markdown -- no code, no frameworks, no technical knowledge required -- was a democratizing decision. I don't think Peter planned it that way. I think he just built the simplest thing that worked. But the effect was the same.

I opened this article with six words: *"Your assistant. Your machine. Your rules."* They were written by OpenClaw's official documentation, but they could just as easily have been the battle cry of an entire generation of developers tired of renting their intelligence.

OpenClaw isn't perfect. The security problems are real. The ecosystem chaos is exhausting. The pace of change leaves you behind in a week. Things will break. People will lose data. Companies will try to block it.

But the direction isn't going to change. The question is no longer whether personal agents are going to exist -- that conversation closed in late January 2026, when hundreds of thousands of machines started running OpenClaw at the same time. The question now is how open we're going to let them be.

Your assistant. Your machine. Your rules.

Let's keep building.

---

## Resources

- [OpenClaw](https://openclaw.ai/) -- Official project site
- [OpenClaw Lore](https://docs.openclaw.ai/start/lore) -- Origin story and philosophy, from the official docs
- [OpenClaw on GitHub](https://github.com/openclaw/openclaw) -- The repository with 340K+ stars
- [Peter Steinberger's blog](https://steipete.me/posts/2026/openclaw) -- His account of joining OpenAI and OpenClaw's future
- [Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/) -- 3-hour interview covering the full OpenClaw story
- [Peter Steinberger at TED2026 — TED.com](https://www.ted.com/talks/peter_steinberger_how_i_created_openclaw_the_breakthrough_ai_agent) -- "How I created OpenClaw, the breakthrough AI agent," including the Marrakesh voice-note story and the Q&A with Chris Anderson
- [Peter Steinberger at TED2026 — YouTube](https://www.youtube.com/watch?v=7rzYDM6vMtI) -- Full TED talk recording
- [PSPDFKit raises EUR 100M — TechCrunch](https://techcrunch.com/2021/10/01/pspdfkit-raises-116m-its-first-outside-money-now-nearly-1b-people-use-apps-powered-by-its-collaboration-signing-and-markup-tools/) -- Peter's background and bootstrapped decade
- [Jensen Huang on OpenClaw — CNBC](https://www.cnbc.com/2026/03/17/nvidia-ceo-jensen-huang-says-openclaw-is-definitely-the-next-chatgpt.html) -- "The next ChatGPT" and "the new Linux"
- [NemoClaw — NVIDIA](https://nvidianews.nvidia.com/news/nvidia-announces-nemoclaw) -- Enterprise security layer
- [Meta acquires Moltbook — Bloomberg](https://www.bloomberg.com/news/articles/2026-03-10/meta-to-acquire-moltbook-viral-social-network-for-ai-agents) -- The social network for AI agents
- [RentAHuman — Nature](https://www.nature.com/articles/d41586-026-00454-7) -- AI agents hiring humans
- [ClawHub — Skills marketplace](https://clawhub.ai/) -- Community-built skills registry
- [Sam Altman on Peter joining OpenAI](https://x.com/sama/status/2023150230905159801) -- The official announcement
- [Anthropic blocks OpenClaw — VentureBeat](https://venturebeat.com/technology/anthropic-cuts-off-the-ability-to-use-claude-subscriptions-with-openclaw-and) -- The April 2026 subscription ban
