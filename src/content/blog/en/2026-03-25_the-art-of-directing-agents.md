---
title: "The Hidden Job of the AI Era: The Art of Directing Agents"
description: "AI agents aren't productivity multipliers — they're judgment multipliers. Why direction matters more than the model, and what that means for engineering."
pubDate: "2026-03-25"
heroImage: "/images/blog/posts/the-art-of-directing-agents/hero.webp"
heroLayout: "side-by-side"
tags: ["tech", "ai-agents", "personal"]
keywords: ["art of directing agents", "better instructions AI agents", "delegating to coding agents", "how to work with AI agents", "AI agent direction vs prompting", "same model different results AI", "framing work for AI agents"]
series: "working-with-agents"
seriesOrder: 2
---

In the last few months, I've noticed something that I now think is one of the most important truths about working with AI agents: give two people the same model, the same agent, the same codebase, and the same setup, and the results can still be abysmally different. Not slightly different — abysmally different. One person gets something clean, coherent, surprisingly solid, and close to production-ready. The other gets something vague, brittle, overcomplicated, or simply pointed in a different direction. The model didn't change. The agent didn't change. The setup didn't change. What changed was the human directing the work.

And I think that's the part a lot of people still don't see. We spend so much time talking about models — which one is smarter, which one is better at coding, which one has better benchmarks, which one has the longer context window, which one is worth paying for. And yes, all of that matters. But frontier models have reached a point where they're already tremendously capable. Each model-to-model jump sometimes feels almost imperceptible — not because there aren't real improvements, but because the baseline is already so high. Better models will surely come — they always do — but the current ones already do extraordinary work. We'll probably reach a point where the difference between one model and another becomes less and less noticeable, where the whole "which model is best?" conversation becomes almost irrelevant. And in practice, I'm already seeing it: the quality of the result often depends less on the model than on the quality of the direction behind it.

That's why I've been rethinking what the hidden job of the AI era really is. At first, I thought a big part of it was reviewing the work done by agents. And yes, review still matters. A lot. But the more I work with agents every day, the more convinced I am that the hidden job starts earlier than review. Much earlier. It starts before the output exists.

It starts when you frame the problem. When you define the task. When you decide what matters. When you set the boundaries. When you provide the right context. When you make the work clear enough that the agent can actually do it well. The hidden job is not just reviewing the agent's work — it is directing it. And the better I get at this, the more I feel that this is one of the real arts of modern engineering.

---

## The Output Starts Earlier Than Most People Think

When people evaluate AI, they usually look at the visible part — the code, the UI, the diff, the test suite, the final answer — and then they ask: was it good or bad? That makes sense. It's the part we can see. But the quality of the result usually starts much earlier than that. It starts in how the work was framed.

What is the real problem? What are we actually trying to solve? What part of the system matters here? What constraints are non-negotiable? What should absolutely not be touched? Are we optimizing for speed, maintainability, simplicity, low risk, or just momentum? These are not side details around the task. They are the task.

That's one of the biggest shifts I've felt in this new way of working. Before, a lot of this thinking happened during implementation. You started coding, hit ambiguity, figured things out on the way, made tradeoffs in motion, adjusted as you went. Now a lot of that has moved upstream. Because when execution becomes this fast, ambiguity becomes expensive. It's similar to what happens with TDD — in test-driven development you define what should happen, what behavior you expect, what conditions the code must meet, and only then do you write the implementation that satisfies those criteria. Directing agents feels the same way: you define the constraints, the expected outcome, and the boundaries before the agent writes a single line. The difference is that in TDD you were doing it for your own code. Now you're doing it for someone else's work — someone who executes much faster than you do.

A human developer will often slow down naturally when a request is underspecified. An agent usually won't. It will keep moving, fill in the blanks, make assumptions, choose a direction. And sometimes it will do all of that with enough confidence that the result looks good until you realize it solved the wrong problem. I learned this the hard way back when I was still inexperienced at giving instructions. I would give the agent vague directions about something I wanted to build — the what, but not the how. I wouldn't specify which patterns to follow, which existing services to reuse, which conventions to respect. And the agent would do what anyone would do with incomplete information: figure out the best way to solve it on its own. The result was often code that worked, sometimes even well-structured, but didn't fit with the rest of the system. It would create its own abstractions where others already existed, choose different approaches from what we used, make architectural decisions I would never have made. This happens especially when the project isn't well-documented and the agent has no way to answer basic questions about the architecture, the folder structure, the available services, or the team's conventions. The code was objectively good. The direction was not. And I'd end up undoing work that never should have happened — not because the agent failed, but because I didn't give it enough context to get it right.

That is why I keep coming back to the same idea: **the result starts long before the output.** It starts in the direction.

---

## This Is Not Really About Prompting

A lot of people still call this prompting. I get it — that's the word we had. But honestly, the more I work this way, the less useful that word feels. Because what I'm doing most of the time does not feel like just "prompting." It feels like designing work. It feels like taking something fuzzy and turning it into something delegable. It feels like deciding what context matters, what constraints matter, what should remain stable, what quality bar we're aiming for, and where the agent is likely to go wrong if I leave too much open.

There's a moment in Andrej Karpathy's [recent interview on No Priors](https://www.youtube.com/watch?v=kwSVtQ7dziU) that stuck with me. Sarah Guo, the interviewer, describes how her day-to-day feels: *"Code's not even the right verb anymore, right? But I have to express my will to my agents for 16 hours a day."* And Karpathy cuts in with a single word: *"Manifest."* I love that framing — not coding, not prompting, but expressing your will to agents. Manifesting. I think they're both onto something. That's closer to what it actually feels like than any other word I've heard. Others call it vibe coding — Karpathy himself [coined the term in February 2025](https://x.com/karpathy/status/1886192184808149383). But even that falls short. Vibe coding sounds casual, improvised, like you're just going with the flow. What I do every day is anything but casual. It's deliberate, structured, and it requires deeply understanding what you're asking for.

<iframe width="100%" style="aspect-ratio:16/9" loading="lazy" srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/kwSVtQ7dziU?autoplay=1><img src=/images/blog/posts/the-art-of-directing-agents/karpathy-no-priors.webp alt='Andrej Karpathy on Code Agents, AutoResearch, and the Loopy Era of AI — No Priors interview'><span>&#x25BA;</span></a>" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Andrej Karpathy on Code Agents, AutoResearch, and the Loopy Era of AI — No Priors interview"></iframe>

A good instruction is not just better phrasing. It's not a trick, and it's not a formula. A good instruction is usually a compressed form of structured thinking — what problem needs to be solved, what context matters, what constraints must be preserved, what should not be changed, what quality bar is expected, and when the agent should stop and ask instead of guessing. Anthropic's own [prompt engineering guidance](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) covers most of these dimensions — specifying context, constraints, and success criteria. But the label "prompting" still makes it sound like a writing exercise, when in practice it's closer to a systems design exercise.

That distinction matters, because when people reduce this to prompting, they make the work sound much lighter than it really is. The leverage is not in writing a prettier request. The leverage is in understanding the work deeply enough to define it well. Good delegation is not asking for work — it is defining work clearly enough that it can be executed correctly.

---

## The playing field didn't level — it shifted

There's a very seductive story in the air right now. It goes something like this: now that AI can code, everyone is closer to operating at the same level. The tools are getting so strong that expertise matters less. Access is flattening the playing field.

There is something real in that. The floor has absolutely risen. People who could not build before can now build. People who used to be blocked by implementation can now move. Designers, PMs, founders, marketers, operators — I've seen all of them get much closer to execution because agents close part of the distance. That part is real, and honestly, it's one of the most exciting things happening right now.

But I don't think it means the difference between people disappeared. I think it moved. It shifted upstream, into the quality of direction.

A junior and an expert can sit in front of the same exact setup and still get radically different outcomes, because they are not really doing the same thing. They are not just "using AI." They are framing, scoping, constraining, and directing the work at very different levels. Access to the tool alone doesn't produce the productivity gains. The directing skill matters as much as the tool.

Karpathy said something in the same interview that clicked everything into place for me: *"Everything feels like it's a skill issue. It's not that the capability is not there."* When the agent delivers something bad, the reflex is to blame the model. Sometimes that blame is fair. But more often than I'd like to admit, the problem was mine — the task was vague, the constraints were weak, or I left too much open for the agent to guess. The more experienced person is usually better at seeing the real problem behind the task, anticipating ambiguity before the agent hits it, preserving architectural intent, and knowing when a task is ready to delegate and when it still isn't.

I've seen tasks where the distance between a weak instruction and a strong one was not 10% better or worse — it was the difference between "this kind of works" and "this is solid enough to build on." The same model can look mediocre in one person's hands and remarkable in another's. Not because the model changed. Because the direction changed.

---

## Judgment Multipliers

One of the reasons this matters so much is that agents are real amplifiers. A well-directed agent can feel almost unfair. It moves fast. It stays coherent. It handles complexity better than you expected. It gives you leverage that, honestly, still feels surreal some days.

But a poorly directed agent can also move fast — and that's the problem. It can move fast in the wrong direction. It can confidently overbuild. It can solve the wrong problem cleanly. It can generate something polished on top of a bad understanding of the task. A lot of bad output is just badly framed work arriving quickly.

That's why I've started thinking of agents less as productivity multipliers and more as **judgment multipliers**. They multiply the upside of clarity. And they multiply the cost of confusion in equal measure. A well-directed task leads to sharper results, sharper review, higher-leverage work. A poorly directed task leads to rescue work — cleaning up ambiguity that should have been resolved earlier, correcting assumptions the agent should not have had to make, dragging the work back toward the real objective after it drifted.

The difference between these two experiences is one of the clearest signs that the real leverage starts earlier than most people think. It starts in the direction.

---

## Spec-driven development: TDD for the agentic era

Earlier in this article I compared directing agents to TDD — first you define what should happen, what behavior you expect, what constraints the code must meet, and only then you write the implementation. It turns out there's a name for this idea taken to its full conclusion: **spec-driven development** (SDD).

The concept isn't new — it was [academically formalized in 2004](https://en.wikipedia.org/wiki/Spec-driven_development) as a synergy between TDD and design by contract. But it's seen a massive renaissance with the arrival of AI agents. The core idea is simple: the specification stops being passive documentation and becomes the primary development artifact. You don't write code and then document. You write the spec first — what problem is being solved, what constraints exist, what behavior is expected, what architecture must be respected — and the agent generates the code from that.

[ThoughtWorks describes it](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices) as a middle ground between pure vibe coding and waterfall rigidity: structured specs that feed agents, but with short, iterative feedback loops. It's not writing a 50-page document before touching code. It's defining things with enough clarity that the agent can execute well — exactly what I've been describing throughout this article.

[GitHub formalized this with spec-kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/), an open-source toolkit that structures the flow into four phases: specify, plan, break into tasks, and implement. Each task is scoped tightly enough that the agent can implement and validate it in isolation — almost like an individual test in TDD. The spec becomes the shared source of truth between you and the agent.

[Birgitta Böckeler on Martin Fowler's site](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) analyzes three levels of adoption: **spec-first** (write the spec, use it, discard it), **spec-anchored** (keep it as a living reference), and **spec-as-source** (the spec is the primary artifact, the code is generated and never touched). She also raises real risks — agents sometimes ignore parts of the spec, review overhead can grow, and taking the concept to its extreme can combine the worst of inflexibility with the non-determinism of LLMs. It's a balanced take and worth reading.

What I find most interesting is that spec-driven development puts a name on something many of us were already doing intuitively. When I document my project's architecture in an `AGENTS.md`, when I define conventions, constraints, and patterns before asking the agent to write code — that's spec-driven development. It's TDD elevated to the level of direction: instead of defining tests that validate code behavior, you define specs that validate agent behavior.

---

## The Hidden Job

If there's one thread connecting everything I described in this article — from framing, to a playing field that didn't level but shifted, to judgment multipliers, to spec-driven development — it's this: human value is no longer in the execution. It's in the direction. In knowing what to ask the agent, how to ask it, and when what it gave you back is actually what you needed.

That's the hidden job of the AI era. It's not glamorous. It doesn't show up in benchmarks. It's not measured in lines of code or response speed. But it's what separates a result that works from one that actually serves. And the better the agents get, the more your judgment becomes the bottleneck — not your typing speed.

What's interesting is that this isn't something you learn once and you're done. It's a living skill that gets refined with every task, every mistake, every time you undo something you shouldn't have delegated that way. And I think the people who will go the farthest with these tools won't be the ones with access to the best models, but the ones who learn to direct them better than anyone else.

Let's keep building.

---

## Resources

- [Andrej Karpathy on Code Agents, AutoResearch, and the Loopy Era of AI](https://www.youtube.com/watch?v=kwSVtQ7dziU) — The No Priors interview where Sarah Guo describes "expressing her will" to agents, Karpathy sums it up as "Manifest", and why everything feels like a skill issue
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — Covers context, constraints, and success criteria design for working with Claude
- [METR: AI Task Time Horizons](https://metr.org/time-horizons/) — The "new Moore's Law" tracking how AI agent capabilities double every few months
- [Spec-Driven Development — ThoughtWorks](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices) — Why SDD is the middle ground between vibe coding and waterfall, and how structured specs feed agents
- [Spec-Driven Development with AI — GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) — GitHub's open-source spec-kit toolkit and the four-phase flow: specify, plan, break into tasks, implement
- [Understanding Spec-Driven Development: Kiro, spec-kit, and Tessl — Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) — Balanced analysis of three SDD tools: adoption levels, real risks, and lessons from Model-Driven Development
