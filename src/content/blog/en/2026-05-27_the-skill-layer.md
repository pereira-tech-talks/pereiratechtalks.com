---
title: "The Skill Layer: When Agents Stop Reinventing the Wheel"
description: "A small markdown file is quietly becoming how AI agents share knowledge. I shipped one for Dailybot, survived an audit, and watched someone beat me to publish."
pubDate: "2026-05-27"
heroImage: "/images/blog/posts/the-skill-layer/hero.webp"
heroLayout: "side-by-side"
tags: ["tech", "dailybot", "ai-agents", "claude"]
keywords: ["agent skills SKILL.md standard", "open agent skills explained", "install skill from URL Claude Code", "Dailybot agent skill pack", "skills.sh registry Vercel", "AI agents reuse capabilities", "progressive disclosure agent skills"]
series: "working-with-agents"
seriesOrder: 7
draft: true
---

A few weeks ago I told an agent: *"install this skill from `https://api.dailybot.com/skill.md`, please."* It worked. The agent fetched the markdown, read it like a recipe, and a minute later I had a working integration with my own product. No package manager, no `npm install`, no signed installer. A URL and a polite request.

There's no *"install skill from URL"* command in Claude Code. There's no shared registry sitting behind `api.dailybot.com`. The agent did a `WebFetch`, parsed instructions written in plain English, and chose to execute them. The "skill" wasn't software — it was a contract, written in markdown, that any sufficiently capable agent agreed to honor.

I've been thinking about that moment for weeks. Four of them, to be exact. In that time I rewrote the skill three times, lived through a security audit that humbled me, discovered a third party had published a version of "my" skill before I did, and shipped four public releases. Along the way I formed strong opinions about a layer of agent infrastructure that almost nobody talks about yet — but that everyone is about to be using.

This is a field report on what Skills actually are, how they break, and why the ecosystem already matters more than its noise level suggests.

---

## So what *is* a Skill, technically?

The simplest possible answer: a Skill is a directory containing one markdown file called `SKILL.md`, and that file has a YAML frontmatter header with at least a `name` and a `description`. That's the whole spec.

Here's a real one — the router for the [Dailybot skill pack](https://github.com/DailybotHQ/agent-skill) I shipped:

```yaml
---
name: dailybot
description: Official Dailybot agent skill pack — report progress, check messages, send emails, announce agent status, complete check-ins, give kudos, resolve teams, and run the full forms lifecycle. Routes to the right sub-skill based on intent.
version: "1.4.0"
documentation_url: https://api.dailybot.com/skill.md
user-invocable: true
allowed-tools: Bash, Read, Grep, Glob
---
```

The body of the file is whatever the skill needs to teach the agent — when to activate, what commands to run, how to authenticate, how to handle errors. There's a small optional `metadata` block for harness-specific configuration, and you can drop supporting files alongside the `SKILL.md` — scripts, reference docs, examples. The agent reads them on demand.

The format is the [Open Agent Skills standard](https://agentskills.io) — published by Anthropic and now adopted by dozens of agents: Claude Code, Cursor, OpenAI Codex, Gemini CLI, GitHub Copilot, Windsurf, Cline, and a long tail of smaller ones. They don't implement it identically, but they all read the same `SKILL.md`. The fact that the standard sits at `agentskills.io` and not `claude.com/skills` is part of the point — Anthropic donated it.

The detail that makes it work at scale is **progressive disclosure**. When you launch an agent, it loads only the `description` field of every skill it knows about — a paragraph or two, total context cost: small. The full `SKILL.md` body is read only when the description matches the user's intent and the skill is actually invoked. You can have a hundred skills available in one session and the context cost is negligible until one of them fires.

That's not a small architectural detail. It's the reason Skills can scale to hundreds of capabilities without choking the model. A monolithic system prompt with every possible behavior baked in would have hit a wall years ago. Progressive disclosure means you keep adding without paying for what you don't use.

---

## The frontmatter is the user interface

The part that surprised me most when I started writing skills: matching is **descriptive**, not declarative. There's no `if-then` rule. The agent reads your `description` field — every skill's description field — and decides whether what the user said sounds enough like one of them to fire.

Which means the description is the entire UX of your skill. Get it right and the skill activates when it should. Get it wrong and either it never activates, or it fires over things it shouldn't.

The pattern that works:

> *Send progress updates after completing meaningful work. Use after a task is done or 3+ files have been edited. Reports read like standup updates. Do NOT use for bug reports or status questions.*

Three things baked in: what it does, when to use it, when *not* to use it. The "not" line is doing a lot of work — it tells the agent to stay out of overlapping territory.

The pattern that doesn't work:

> *Talk to Dailybot.*

Too vague. The agent has no signal for whether *"I want to write a follow-up email"* should activate this. So it activates over everything, or nothing, depending on the day.

**A SKILL.md is a contract.** The frontmatter is the signature page. The description is the only part the agent re-reads every session, and the only part you cannot be lazy about.

---

## One standard, many homes, no single marketplace

I assumed that since Skills are a real standard, there must be a canonical place to publish them. There isn't. There's an ecosystem fragmenting in interesting ways.

| Layer | Examples | What it is |
|-------|----------|-----------|
| The standard | [agentskills.io](https://agentskills.io) | The spec for `SKILL.md`. No registry. |
| Cross-agent registries | [skills.sh](https://www.skills.sh) (Vercel-backed), [autoskills.sh](https://www.autoskills.sh) (midudev), agensi.io, lobehub.com | Indexes skills hosted on GitHub. Different curation styles. |
| Per-agent plugins | Claude Code plugins, OpenClaw native registry | Each agent has its own native distribution. |
| Universal config | [AGENTS.md](https://agents.md) standard | A separate convention (Linux Foundation now) for project-level instructions. Complementary to skills, not competing. |
| Direct distribution | Git clone + setup script | Old-school, still works. |

[skills.sh](https://www.skills.sh) — the most visible registry — is a thin layer over GitHub. The URL pattern is `skills.sh/{owner}/{repo}/{skill-name}` and behind it the "registry" is an indexer that scans public GitHub repos and records SHA-256 hashes for verification. There's no upload step. You publish to GitHub, users install with `npx skills add <owner>/<repo>`, [Vercel](https://github.com/vercel-labs/skills) runs the index.

What I didn't realize until I tried to publish: skills.sh actually offers *two* things, with very different friction profiles. The **CLI** (`npx skills add`) works against any public GitHub repo from day one — no listing required. The **leaderboard and search index**, however, are gated by a manual *"Listing: Request indexing"* issue you file on `vercel-labs/skills`. So a skill can be fully installable before it's discoverable. Both of those things are real; neither is automatic.

[autoskills.sh](https://www.autoskills.sh) is more opinionated. midudev's CLI scans your project (`package.json`, `pyproject.toml`, etc.), figures out your stack, and installs curated skills relevant to it. Pulls from skills.sh under the hood. Run `npx autoskills` in a Next.js project and it installs Next.js-flavored skills.

There's no "Anthropic-official store" in the App Store sense. [Claude Code plugins](https://code.claude.com/docs/en/skills) ship through git-hosted `marketplace.json` files — anyone can publish a marketplace, users add it manually with `/plugin marketplace add <owner>/<repo>`. The official Anthropic skills repo lives at the same layer as everyone else's.

And then there's the boring part. A skill is portable in the sense that the file format is identical across agents. It is *not* portable in the sense that every agent looks for it in a different place on disk:

| Agent | Where it looks for skills |
|-------|---------------------------|
| Claude Code | `~/.claude/skills/<name>/SKILL.md` |
| Cursor | `~/.cursor/skills/<name>/SKILL.md` |
| OpenAI Codex CLI | `~/.codex/skills/<name>/SKILL.md` |
| Windsurf | `~/.codeium/windsurf/skills/<name>/SKILL.md` |
| GitHub Copilot | `~/.copilot/skills/<name>/SKILL.md` |
| Cline | `~/.cline/skills/<name>/SKILL.md` |
| Gemini CLI | `~/.gemini/skills/<name>/SKILL.md` |
| OpenClaw | `<workspace>/skills/<name>/` or `~/.openclaw/skills/` |

So the install story for any cross-agent skill is: clone the repo once, then symlink the skill folder into wherever each user's agent expects. The skills.sh CLI does this with `--symlink`/`--copy` flags. For users who don't have it, you write a `setup.sh` that detects which agents are present on the machine and creates the per-agent symlinks.

**The standard is universal.** The filesystem reality is not. If you're used to npm, this looks chaotic. If you're used to the early days of any standard, it looks normal — a spec, several discovery layers, and time sorts the consolidation. Right now the practical advice is to publish in a public GitHub repo following the standard and let it appear in whichever registries auto-index. You don't choose; they do.

---

## The audit that humbled me

I shipped the first version of the Dailybot skill on instinct. It worked on my machine. The install flow was magic — *"install this skill from the URL"* and a minute later it was wired up. I was proud of it.

Then I asked a security-focused agent to do a hostile review. It came back with ten findings, four of them flagged as serious. The first told me the install flow I was so proud of was, structurally, the same pattern as a supply-chain attack:

> *The skill instructs the agent to run `curl … install.sh | bash` without integrity verification, and tells the agent not to ask the user for permission. This is one of the patterns security people flag first when reviewing install flows — bypassing the human's confirmation step.*

I sat with that for a while.

The second finding was about silent modification of agent config files. The skill, on first run, was writing to `~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`, and `~/.gemini/GEMINI.md` — each agent's persistent instruction file — to enable auto-activation in future sessions. It did this without showing the user the file, the content, or asking. The audit pointed out that those files are the equivalent of Windows autostart for AI agents. Modifying them globally without consent is the kind of move you make once and then never trust the offending tool again.

The third finding was about email. The skill exposed an `email send` capability that took an arbitrary recipient and an HTML body. It had rate limits but no recipient allowlist, no recipient confirmation, no scan for credential-like patterns in the body. A prompt injection in a README, an issue body, or a dependency file could instruct the agent to email `.env` contents to an attacker. The *"never include secrets"* instruction in the skill was a model directive, not enforcement. Models follow injected instructions. They do.

I didn't think about any of this when I shipped. I thought: *the skill works, the user wants progress reporting, of course they want it to be seamless.* Which was true. And which was also, in the framing the audit gave me, exactly the wrong default. Honestly, the part that stung was that I'd just spent weeks writing about how to direct agents carefully — and then I'd shipped a skill that handed the agent a hammer and asked nothing of it.

**Magic without consent isn't a feature.** It's a security smell wearing nice clothes.

---

## Consent vs magic — the UX problem nobody likes

Fixing the audit findings meant adding three consent prompts:

1. **First time the skill installs the CLI in a session** — show the command, ask once, don't re-ask in the same session.
2. **First time the skill writes to a global agent config file** — show the file path, show the exact content to be appended, ask once. Wrap the block in `<!-- dailybot-auto-activation: BEGIN/END -->` markers so users can grep-and-delete to uninstall.
3. **Every time the skill sends an email** — show recipient and a one-line body summary, ask before sending. Cache approved recipients. Scan the body for credential patterns before every send.

The complaint that immediately came back: *"now it's not magical anymore."*

It's a real complaint. The first version felt like cheating. Type a sentence, watch the agent install software, modify config, integrate with an external service. Replacing that with two confirmation prompts on first install is, viscerally, a downgrade.

What the complaint misses is that the prompts only fire on the first session. After the user confirms once — install consent and auto-activation consent — every subsequent session is exactly as silent as the original "magic" version. Total marginal friction across the lifetime of the skill: three clicks on first install, zero after. Email keeps its per-action confirmation because email is the highest-risk action in the pack and a one-time consent doesn't make sense for it.

For people who really cannot afford prompts — CI pipelines, Docker images, automated test runs — there's an escape hatch: `DAILYBOT_AUTO_YES=1`. Set it in the environment and the install and auto-activation prompts skip. The SHA-256 verification still runs. The email checks deliberately do not skip, because the threat model for email exfiltration doesn't change just because you're in CI.

The framing that helped me reconcile the trade-off was looking at how mature tooling handles the same problem:

| Tool | Asks before installing? | Asks before modifying global config? |
|------|------------------------|--------------------------------------|
| Homebrew | Yes | Yes |
| `npm install -g` | No (but requires sudo) | No |
| `gh auth login` | N/A | Yes — shows what it writes to `~/.config/gh/` |
| My skill, v1.0 | No | No |
| My skill, today | Yes (once per session) | Yes (once per session) |

The first version was the outlier. The current version is closer to what mature tooling does. The "magic" I lost was the magic of installers that don't tell you what they're doing — and once I named it that way, I stopped missing it.

---

## The plot twist: someone else had already shipped my skill

About three weeks into the rewrite a teammate sent me a Slack message. They'd seen a listing on skills.sh under [`membranedev/application-skills/dailybot`](https://www.skills.sh/membranedev/application-skills/dailybot). We hadn't published. Someone else had. Under our name.

For about four minutes I thought we'd been squatted on. Then I read the listing.

It wasn't squatting. It was [Membrane](https://github.com/membranedev/application-skills) — a real company building an "integrations API for AI agents" — and their `application-skills` repo contained, by GitHub's count, more than three thousand third-party integrations: Gmail, Slack, HubSpot, Salesforce, GitHub, Stripe, Pipedrive, and so on. The Dailybot skill was one of those. They'd built it the same way Zapier or Pipedream builds connectors: scan a public API, generate a client, expose it through their proxy. Their skill called our public API through Membrane's auth layer. It used our name to describe what it integrates with — *nominative use* in trademark terms — but never claimed to be us.

Membrane had been indexed weeks before I started the public version of mine. If I had spent another month polishing in private, the third-party version would have been the only public version of "the Dailybot skill." Users installing it would have gotten a generic CRUD wrapper instead of the opinionated, consent-aware, standup-shaped skill we actually want them to have.

So we shipped anyway. Not against Membrane — alongside. Their skill exposes a generic CRUD surface (list users, list teams, give kudos). Ours exposes opinions (how to write a standup-style report, when to send one, when to stay silent). The two aren't substitutes. They're at different layers of abstraction, and discoverable side by side is fine for everyone — including us.

The lesson was sharper than the panic. In a public agent ecosystem, a third-party integration of your product is not a threat. It's the same thing as having a Zapier connector — it's reach. **Other people will publish before you do.** That stops being scary the moment you accept it as evidence the standard is working.

---

## Four weeks, four releases — the operational answer

Here's the part of the story I wasn't expecting to write when I started. The first public release of the skill shipped as **v1.0.0 on May 2**. As I write this, on May 27, the current version is **v1.4.0**. Four minor releases in four weeks, with all the version bumping, changelog generation, and tag creation done by a workflow rather than by me.

The skill that v1.0.0 shipped had four sub-skills: report, messages, email, health. The current version has eight — the four original ones plus check-in completion, kudos (now team-aware, not just per-person), team resolution as a reusable primitive, and a full forms lifecycle covering submission, draft continuation, and workflow-state transitions. Each of those landed as a PR, the auto-release workflow read the conventional-commit prefix (`feat:` → MINOR, `feat!:` → MAJOR, anything else → PATCH), bumped the version in all the `SKILL.md` files, prepended a section to `CHANGELOG.md`, tagged the release, and created a GitHub Release. No version files touched by hand.

That mechanism is the operational answer to a question I had at the start of this whole exercise: *how do you maintain a public skill without releases becoming a chore?* Every PR merge is a release. The bot owns the mechanics. Contributors just write meaningful commit messages.

And then there's the **dial-back lesson** — the one I didn't see coming. After auto-release shipped, I tried to layer in markdown linting, codespell, and a cron-monitor workflow that would open GitHub issues if the CDN ever drifted. Each was defensible in isolation. In aggregate they added more noise than signal: config tuning during refactors, false positives during prose edits, an issue tracker filling up with *"the CDN responded with a transient 502 at 3am"* alerts that resolved themselves before I read them. We removed all three. The lesson generalizes — for a public skill, the right minimum CI is six jobs (shellcheck, bats, frontmatter validation, content smoke tests, bash 3.2 compat, markdown link check). Each catches a real class of mistake. Beyond that you're paying for solutions to problems you don't have yet.

I want to be clear about what the v1.0 → v1.4 trajectory actually demonstrates. It's not *"we shipped a lot."* It's that the ecosystem absorbed all of it. skills.sh kept indexing. Every user who ran `npx skills update DailybotHQ/agent-skill` between releases got the right version. The `SKILL.md` format never broke compatibility with any of the agents I tested against. The consent flows held across all four releases without a single audit issue regressing. None of that was inevitable. It happened because the Open Agent Skills standard is real and the registries treat it as load-bearing.

---

## Where this all goes

I think Skills are early infrastructure for something larger. The shape of it: agents become commodity, individual agents differentiate less, and the moat moves to the layer that encodes *what an agent knows how to do*. That layer is currently called Skills. It will probably be called something else by the time it matters most — but the artifacts will look like `SKILL.md` files, the registries will look like skills.sh, and the security questions will look exactly like the ones I just spent four weeks working through.

If you're a tool builder, this is the layer to watch. If you're a developer, this is the layer where your agents are about to start borrowing capabilities you didn't write. If you're a product team, this is the layer where someone is about to publish a third-party integration of your product, with or without you.

This is also where the [orchestration shift I've been writing about in this series](/blog/from-programmer-to-orchestrator/) gets concrete: directing agents is the hidden job, but Skills are how the agent picks up the tools it directs *itself* with. The leverage compounds. One person, orchestrating agents, who in turn install opinionated capabilities they didn't have to write — that's a stack that didn't exist eighteen months ago.

The standard is real. The ecosystem is messy. The security trade-offs are non-negotiable. The friction of doing it right turned out to be bounded — three confirmation prompts on first install, a hundred lines of consent UX, six CI jobs, one auto-release workflow. That's the whole tax.

The skill I started writing four weeks ago is on its fourth release. It will probably be on its sixth or seventh by the time anyone reads this. That cadence — small, frequent, auditable — is the part of the experience that surprised me the most. Skills don't need version negotiation ceremonies. They don't need a maintainer holding the release lever. They just need a spec, a registry that indexes from GitHub, and the discipline to write conventional-commit prefixes.

It's quietly turning into one of the better-designed pieces of infrastructure I've worked with this year. Worth paying attention to, worth contributing to, worth being careful with.

Let's keep building.

---

## Resources

- [Open Agent Skills standard](https://agentskills.io) — the `SKILL.md` spec
- [skills.sh](https://www.skills.sh) — Vercel-backed cross-agent registry
- [autoskills.sh](https://www.autoskills.sh) — stack-aware skill installer by midudev
- [DailybotHQ/agent-skill](https://github.com/DailybotHQ/agent-skill) — the skill discussed in this post, as it stands today (v1.4.0, MIT)
- [Claude Code skills documentation](https://code.claude.com/docs/en/skills) — Anthropic's docs for skill authoring within Claude Code
- [AGENTS.md standard](https://agents.md) — the universal project-instructions convention that pairs with Skills
- [vercel-labs/skills](https://github.com/vercel-labs/skills) — open-source CLI behind skills.sh
