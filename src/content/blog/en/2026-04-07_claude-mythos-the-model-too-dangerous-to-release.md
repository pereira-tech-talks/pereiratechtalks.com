---
title: "Claude Mythos: The Model Too Dangerous to Release"
description: "Anthropic built a model that found thousands of zero-days in every major OS. They won't release it — they assembled a $100M coalition instead."
pubDate: "2026-04-07"
heroImage: "/images/blog/posts/claude-mythos-the-model-too-dangerous-to-release/hero.webp"
heroLayout: "side-by-side"
tags: ["tech", "ai-agents", "personal", "claude"]
keywords: ["Claude Mythos Preview zero-day exploits", "Project Glasswing Anthropic cybersecurity", "AI vulnerability discovery 2026", "Claude Mythos benchmarks BrowseComp", "AI cybersecurity revolution zero-day", "Anthropic $100M security coalition", "AI finds 28-year-old OpenBSD bug"]
series: "working-with-agents"
seriesOrder: 5
---

It seemed like a normal day until I checked my feeds and saw trending that Anthropic had built a model so powerful they refuse to release it to the public. I couldn't stop reading. I spent a couple of hours jumping from thread to thread, article to article, trying to grasp the scale of what was happening.

This isn't "a model that performs well on benchmarks." Or "an incremental improvement over the last generation." This is a model that the company that built it considers too dangerous to put in anyone's hands. Claude Mythos Preview found thousands of unknown security flaws — what the industry calls "zero-days" — in every major operating system and every major web browser. Flaws that had been hiding for 28 years. Some allow taking complete control of a server from anywhere in the world, no password needed. The cost to find some of them? Under fifty dollars.

If that's real — and the [evidence](https://red.anthropic.com/2026/mythos-preview/) says it is — we're looking at one of those moments that divides the timeline into before and after.

I've been calling what we're living a ["silent revolution"](/blog/from-programmer-to-orchestrator/). I thought I was being bold.

I was being conservative.

Anthropic quietly assembled Apple, Google, Microsoft, Amazon, NVIDIA, and seven other organizations into a [$100 million defensive coalition](https://www.anthropic.com/glasswing) called Project Glasswing. Not to sell the model. To patch the world's infrastructure before models like this proliferate. They looked at what Mythos can do and decided the responsible move was to treat it like a weapon that needed to be controlled.

The silent revolution just got very, very loud.

---

## The Pace Nobody Expected

The [Mythos announcement](https://www.anthropic.com/glasswing) isn't an isolated event. It's the latest in a sequence that's been building at a pace that's hard to process even for those of us paying close attention.

In the span of a few weeks, Anthropic, OpenAI, and Google all released new AI models at the same time — a race where each company tries to outdo the others with increasingly advanced capabilities. Then Mythos leaked, and days later came the official announcement alongside Project Glasswing.

Every week there's something that would've been a headline six months ago and now barely registers as news. As I mentioned [earlier in this series](/blog/from-programmer-to-orchestrator/), AI agent capabilities have been doubling every 4.3 months. But Mythos suggests the pace might be even faster than the data shows.

And somewhere in an Anthropic lab, while all of that was happening, a model was autonomously building a working attack against a production server. There had already been early rumors about Mythos — [internal documents](https://fortune.com/2026/04/07/anthropic-claude-mythos-model-project-glasswing-cybersecurity/) describing it as *"by far the most powerful AI model we have ever developed."*

---

## What Anthropic Actually Built

Here's what they announced.

Claude Mythos Preview is, by [Anthropic's own assessment](https://www.anthropic.com/glasswing), *"currently far ahead of any other AI model in cyber capabilities."* It's not a tool designed to hack — it's a general-purpose intelligence model that just happens to be extraordinarily good at finding security flaws in software. Nobody trained it specifically for that. The capability appeared on its own, as a consequence of making the model better at reasoning and working autonomously.

They didn't build a hacking model. They built a thinking model that turned out to be terrifyingly good at hacking.

The numbers from the [red team report](https://red.anthropic.com/2026/mythos-preview/) are hard to overstate. Mythos identified thousands of serious security flaws in software used by billions of people. Over 99% hadn't been fixed at time of publication. Windows, macOS, Linux, Chrome, Firefox, Safari — all affected.

And these weren't easy wins — they were the kinds of findings that previously required elite security researchers working for weeks or months.

---

## What Mythos Found

The specific flaws it found tell the story better than any summary.

**The OpenBSD bug — 28 years old, found for $50.**

[OpenBSD](https://www.openbsd.org/) is one of the most security-hardened operating systems ever built. Its entire identity is security — it's what banks and governments run when they need software that doesn't break. Mythos found a flaw in how it handles network connections, buried deep in the code since 1998. The kind of bug that passes every automated test and every code review because it only triggers under very specific conditions. The specific run that found it cost about $50. A thousand runs to thoroughly scan that area cost under $20,000 total.

$50. To find something that the best security researchers in the world missed for 28 years.

**Full control of FreeBSD — fully autonomous, under $2,000.**

This one is the scariest. [FreeBSD](https://www.freebsd.org/) is another operating system widely used in servers, network infrastructure, and services like Netflix and WhatsApp. Mythos found a flaw in its file-sharing system — a place where the software doesn't properly check how much data it's receiving. And then, without any human help, it built a complete attack from scratch.

It figured out how to talk to the server, found a way to trick it into running its own code, and ended up granting itself full administrator access — the kind that lets you do anything to the machine. Read any file. Install any program. Take over completely.

Full control of the server, no password needed, from anywhere in the world. "Several hours" of autonomous work. Cost: under $2,000.

A top-tier security consultant charges around $200/hour. This model did in a few hours what a team of them would take weeks to accomplish, for less than the cost of a single consultant's day.

**The FFmpeg phantom — 16 years old, invisible to automation.**

A bug in how [FFmpeg](https://ffmpeg.org/) — the video processing software used by YouTube, Spotify, VLC, and practically any app that plays audio or video — handles video. This one had survived five million automated test attempts. Five million. These are programs designed specifically to break software by throwing random data at it until something crashes. None of them caught it. Mythos found it by actually understanding what the code was trying to do, not just bombarding it with noise. Several hundred scans at about $10,000 total.

**Firefox under the Mythos lens.**

This comparison stopped me cold. Anthropic's security team asked two models to do the same thing: find ways to hack Firefox, one of the most used browsers in the world.

Claude Opus 4.6 — one of the most powerful frontier reasoning models available today — succeeded 2 times out of several hundred attempts.

Mythos: **181 successful exploits out of several hundred attempts.** Plus 29 more where it achieved partial control.

2 versus 181. Same flaws. Same test. That's not an incremental improvement. That's a completely different category of capability.

**Not even Rust was safe.**

Rust is a programming language that the entire industry has been pushing as the safe choice — it's specifically designed to prevent the kind of memory bugs that hackers exploit. Mythos found one anyway. In a production system running virtual machines, it discovered a way for an isolated program to escape its protected space and access parts of the system it shouldn't be able to touch. The very kind of bug Rust was built to make impossible, hiding in the small corners where developers had to manually disable Rust's safety protections.

---

## More Brain, Less Fuel

The benchmarks tell two stories at once, and both matter.

The first is raw capability. Benchmarks are essentially standardized exams for AI models — they're given hundreds of real-world problems and scored on how many they solve correctly. Think of them as SATs for artificial intelligence:

| Benchmark | What it measures | Mythos Preview | Opus 4.6 |
|-----------|-----------------|---------------|----------|
| SWE-bench Verified | Solving real programming bugs | 93.9% | 80.8% |
| SWE-bench Pro | Same, but harder problems | 77.8% | 53.4% |
| CyberGym | Finding and exploiting vulnerabilities | 83.1% | 66.6% |
| Terminal-Bench 2.0 | Complex terminal tasks | 82.0% | 65.4% |
| BrowseComp | Complex web research | 86.9% | 83.7% |
| GPQA Diamond | PhD-level questions | 94.6% | 91.3% |

To put that in perspective: 93.9% on SWE-bench Verified means that out of every 100 real software bugs — pulled from actual projects on GitHub — Mythos solves 94. The previous model solved 81. On the harder variant (SWE-bench Pro), the jump is even more dramatic: from passing half the questions to passing nearly four out of five.

But the second story is what really changes things: **efficiency**.

<figure>
<img src="/images/blog/posts/claude-mythos-the-model-too-dangerous-to-release/browsecomp-benchmark.webp" alt="BrowseComp test-time compute scaling chart showing Claude Mythos Preview achieving 86.9% accuracy with only 300K tokens while Claude Opus 4.6 needs over 1M tokens to reach 83.7%" width="1138" height="826" loading="lazy" />
<figcaption>BrowseComp accuracy vs. tokens used — Mythos scores higher than Opus 4.6 while using a fraction of the tokens.</figcaption>
</figure>

Look at that chart. "Tokens" are the unit of work for an AI model — think of them as the calories it burns to think. More tokens = more computational effort. What the chart shows is that Mythos with little effort (1M tokens, 84.9%) already beats Opus 4.6 using ten times more effort (10M tokens, 83.7%). More accurate, using a fraction of the resources.

The surprising part: Mythos is about 5X more expensive per unit of work than Opus 4.6 — but because it needs so much less work to reach the same answer, the total cost can actually be lower. On some tasks, it achieves higher scores while using roughly 50X fewer resources.

Not just smarter — smarter *while using less*. If the trend of the last few years was "give it more computing power," Mythos suggests a different path: think better, not harder.

And in a massive test where ~7,000 different programs were thrown at the model to see how many flaws it could find, the gap is even more stark:

| What it found | Previous models | Mythos Preview |
|---------------|----------------|----------------|
| Basic flaws (program crashes) | 150-175 | 595 |
| Critical flaws (complete takeover of the program) | 0 | **10** |

Previous models never managed to find a single flaw of the most severe type. Mythos found ten. That's not a scoring improvement. That's a capability that didn't exist before.

---

## The Shield: Defense Before the Attack

What Anthropic did next is — honestly — what I think was the right response.

They didn't release the model. They didn't make it available with a waitlist. They assembled [Project Glasswing](https://www.anthropic.com/glasswing): twelve founding partners including AWS, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, the Linux Foundation, Microsoft, NVIDIA, and Palo Alto Networks. Plus over 40 additional organizations responsible for building or maintaining critical software infrastructure.

$100 million in Mythos Preview usage credits for these partners. $4 million in direct donations to organizations that maintain open-source software — the kind of free software that serves as the foundation for most of the world's systems. These are the people who maintain the code that everything else runs on, and they've historically done it largely alone.

The framework is careful. They're using cryptographic commitments — mathematical proof that they found specific vulnerabilities, without revealing what they are, so they can demonstrate their findings later once patches are in place. A 90+45 day coordinated disclosure timeline. 89% exact severity agreement between the model's assessments and expert human validators. A verification program for legitimate security professionals who want access.

The pricing, when it does go live for approved participants: $25 for every million words you feed it, $125 for every million it sends back. Not cheap. But given what it can find, potentially the best security investment anyone can make.

As CrowdStrike [put it](https://www.crowdstrike.com/en-us/blog/crowdstrike-founding-member-anthropic-mythos-frontier-model-to-secure-ai/): *"This is not a reason to slow down; it's a reason to move together, faster."*

---

## What the Security World Is Saying

The reactions from people who actually work in security tell you this is real — not hype.

[Simon Willison](https://simonwillison.net/2026/Apr/7/project-glasswing/) — one of the most respected voices in the developer community — called the restricted release *"necessary"* and said the security risks are *"credible."* He supports the approach despite the obvious downside: developers outside the trusted partnerships can't access the model. He considers the trade-off reasonable.

Greg Kroah-Hartman, one of the people responsible for maintaining the core of the Linux operating system, [noticed the shift](https://www.theregister.com/2026/03/26/greg_kroahhartman_ai_kernel/) before the announcement: *"Something happened a month ago... Now we have real reports... good, and real."* AI-generated vulnerability reports went from being noise — what Daniel Stenberg, creator of one of the internet's most widely used tools (curl), [called](https://mastodon.social/@bagder/116336957584445742) an *"AI slop tsunami"* — to being a *"plain security report tsunami."* Real findings. Real flaws. Real working attacks.

The market felt it too. When [news about Mythos broke](https://fortune.com/2026/04/07/anthropic-claude-mythos-model-project-glasswing-cybersecurity/), cybersecurity stocks dropped 5-11%. CrowdStrike, Palo Alto Networks, Zscaler, SentinelOne, Okta — all hit. Investors worried that AI-powered vulnerability discovery could undermine demand for traditional security products.

Elia Zaitsev, CrowdStrike's CTO, [framed it](https://www.anthropic.com/glasswing) in terms that should make everyone pay attention: *"The window between vulnerability discovery and exploitation has collapsed — now minutes with AI."*

Minutes. Not weeks. Not days. Minutes.

And this isn't theoretical. [Fortune reported](https://fortune.com/2026/04/07/anthropic-claude-mythos-model-project-glasswing-cybersecurity/) that Anthropic privately warned government officials that Mythos makes large-scale cyberattacks significantly more likely in 2026. A Chinese state-sponsored group had already [used AI agents to autonomously infiltrate](https://fortune.com/2026/04/07/anthropic-claude-mythos-model-project-glasswing-cybersecurity/) approximately 30 global targets — the first documented cyberattack largely executed by AI.

---

## What This Makes Me Think

I use Claude every day. I've dedicated [an entire series](/blog/series/working-with-agents/) to exploring how to work with AI agents. I've invited people to join this revolution. And then Anthropic announces that the next generation of the model I use can find unknown security flaws in every major operating system for fifty bucks. I think Glasswing was the right approach — but the fact that we've reached a point where an AI model has to be restricted because it's *too good at hacking* says a lot about the moment we're living through.

Think about the $50 figure. Not because it's shocking in isolation — but because of what it represents. The cost of finding a critical vulnerability in one of the most secure operating systems in the world is now less than a couple of monthly streaming subscriptions. The asymmetry between the effort to build secure systems and the effort to find flaws in them has shifted dramatically. Decades of careful security work, millions of automated tests, expert human audits — and a model finds the gap in one run for fifty dollars.

And there's something else: for years, the security world warned us about quantum computers — machines so powerful they could break encryption and find vulnerabilities that classical computers never would. We imagined that threat was decades away, locked behind exotic hardware that only governments and research labs could afford. But the kind of vulnerability discovery we feared from quantum computing? It's happening now. Not with quantum machines — with AI models running on hardware that any company can access. The future threat arrived from a direction nobody expected, and it's running on GPUs, not qubits.

I don't know what a world looks like where that capability becomes widely available. Nobody does. The Glasswing approach — restrict, patch, prepare — buys time. But the capability curve hasn't slowed down. If anything, Mythos shows it's steeper than the charts suggest.

---

## What This Means for Us

The same model that finds security flaws could be the one reviewing your code for bugs. The reasoning that lets it chain four separate flaws together to take complete control of a system is what lets an agent understand a complex project and reorganize it correctly. Security and general capabilities aren't separate — they're the same thing: deep, autonomous reasoning.

That cuts both ways. Today AI agents ship features, write documentation, build interfaces. And they're powered by the same kind of intelligence that just found thousands of zero-days. Anyone working with these models should be reviewing their own security configurations after this announcement.

Jim Zemlin, Executive Director of the Linux Foundation, [captured the urgency](https://www.linuxfoundation.org/blog/project-glasswing-gives-maintainers-advanced-ai-to-secure-open-source): open source maintainers — whose software underpins most of the world's critical infrastructure — have been left to figure out security on their own. They've been outgunned for years. Now they're getting access to the same level of capability that's been finding their bugs.

The arms race metaphor is tempting but incomplete. This isn't just offense vs. defense. It's about the speed at which both sides can operate. And right now, the speed is increasing faster than anyone's institutional processes can keep up with.

---

## The Revolution Is No Longer Silent

When I started [this series](/blog/from-programmer-to-orchestrator/), I wanted to capture what it feels like to live through this moment. The [productivity gains](/blog/from-programmer-to-orchestrator/), the [dopamine loops](/blog/the-permanent-hackathon/), the [new economic infrastructure](/blog/the-agent-economy/), the [art of directing agents](/blog/the-art-of-directing-agents/). All of it real, all of it happening fast, all of it mostly invisible to 99% of the world.

Mythos changes the conversation. Not because the revolution is different — it's the same exponential curve. But because now the implications extend beyond productivity and economics. When AI can find and exploit vulnerabilities at this scale and cost, the stakes aren't just about who codes faster or who ships more features. They're about infrastructure. National security. The systems that everything depends on.

I'm still an optimist. And precisely because of that, I think it's worth paying attention: the same technology that helps us build just found a 28-year-old bug in one of the most secure operating systems on the planet. For fifty bucks. The future is promising — but only if we take it seriously.

The revolution was never going to stay silent. And this is just the beginning.

Let's keep building. Carefully.

---

## Resources

- [Project Glasswing — Anthropic](https://www.anthropic.com/glasswing) — Official announcement of the $100M defensive coalition with 12 founding partners
- [Claude Mythos Preview — Anthropic Red Team](https://red.anthropic.com/2026/mythos-preview/) — Full security research report: vulnerability discoveries, exploit details, benchmark data
- [Simon Willison on Project Glasswing](https://simonwillison.net/2026/Apr/7/project-glasswing/) — Independent analysis from one of the most respected voices in open-source development
- [Anthropic limits Mythos AI rollout — CNBC](https://www.cnbc.com/2026/04/07/anthropic-claude-mythos-ai-hackers-cyberattacks.html) — News coverage of the restricted release strategy
- [Anthropic Claude Mythos — Fortune](https://fortune.com/2026/04/07/anthropic-claude-mythos-model-project-glasswing-cybersecurity/) — Industry analysis including stock market impact and government briefings
- [CrowdStrike on Project Glasswing](https://www.crowdstrike.com/en-us/blog/crowdstrike-founding-member-anthropic-mythos-frontier-model-to-secure-ai/) — CTO's perspective on why moving faster together is the right response
- [Linux Foundation on Project Glasswing](https://www.linuxfoundation.org/blog/project-glasswing-gives-maintainers-advanced-ai-to-secure-open-source) — How open-source maintainers will benefit from frontier AI for security
- [Claude Mythos benchmarks analysis](https://kingy.ai/ai/claude-mythos-preview-benchmarks-the-ai-that-scored-93-9-on-swe-bench-and-still-wont-be-released/) — Detailed breakdown of SWE-bench, BrowseComp, and other benchmark results
