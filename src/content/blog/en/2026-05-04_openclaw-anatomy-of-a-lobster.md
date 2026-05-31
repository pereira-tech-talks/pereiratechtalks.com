---
title: 'Anatomy of a Lobster: How OpenClaw Actually Works'
description: "Inside OpenClaw: the Gateway, the PI agent, the seven workspace files, skills, MCP servers, heartbeat, and the sandbox layer -- the full anatomy."
draft: true
pubDate: '2026-05-04'
heroImage: '/images/blog/posts/openclaw-anatomy-of-a-lobster/hero.webp'
heroLayout: 'banner'
tags: ["tech", "ai-agents", "openclaw", "claude"]
keywords: ['OpenClaw architecture', 'OpenClaw PI agent', 'OpenClaw workspace files', 'OpenClaw Gateway 18789', 'OpenClaw MCP servers', 'SOUL.md AGENTS.md HEARTBEAT.md MEMORY.md STARTUP.md', 'OpenClaw skills ClawHub', 'OpenClaw pluggable memory Honcho LanceDB']
series: 'mastering-openclaw'
seriesOrder: 2
---

I keep finding myself reaching for body metaphors when I try to explain OpenClaw, so let's just start there.

Peter sent a voice note from Marrakesh and the agent, which had no voice wired in yet, replied anyway -- nine seconds end to end. His line from the TED2026 stage: *"I'm not kidding you, the mad lad figured it out on its own."* The full origin story -- Peter, the burnout, the triple rebrand, why this project exists at all -- lives in [the first chapter of the series](/blog/openclaw-your-assistant-your-machine-your-rules). If you prefer the spoken version it's in [the companion talk for this series](/slides/openclaw-your-assistant-your-machine-your-rules).

A lobster has a carapace, a nervous system, internal organs, two claws, a heartbeat that runs whether or not it's hunting, and a shell it has to molt out of when it outgrows it. So does OpenClaw. The metaphor isn't perfect -- no metaphor is -- but it's good enough to hang the rest of this chapter on. By the end you should be able to point at any part of OpenClaw and tell me which part of the lobster it's playing.

Sorry to the engineers who would have preferred UML.

---

## The carapace: OpenClaw on your machine

Look at this first. Everything else in this post is a tour of what's inside it.

<!-- IMAGE: body-caparazon.webp
     Prompt: see analysis_results/body_part_image_prompts.md → Caparazón section
     Alt (ES): Vista de perfil del caparazón de la langosta OpenClaw, con su superficie escarlata brillando bajo una luz cenital desde la izquierda y el ojo ámbar visible junto al rostrum.
     Alt (EN): Profile view of the OpenClaw lobster's carapace, its scarlet surface catching a warm directional light from the upper left, one amber eye faintly glowing near the rostrum.
     Figcaption (ES): El caparazón: el perímetro. Todo lo demás vive adentro.
     Figcaption (EN): The carapace: the perimeter. Everything else lives inside.
     Drop the .webp file into public/images/blog/posts/openclaw-anatomy-of-a-lobster/_staging/
     and run /optimize-image. -->

OpenClaw runs as a single long-running process per host -- the Gateway -- and that Gateway is the carapace. It owns the channel connections, the sessions, the routing, the embedded agent, and the HTTP server that the dashboard runs on. One Gateway, one host, one trust boundary. OpenClaw is explicitly *not* multi-tenant -- the docs say it plainly: ["one user/trust boundary per gateway"](https://docs.openclaw.ai/gateway/security). Whoever can write to `~/.openclaw/` is the user, full stop.

By default the Gateway binds to `127.0.0.1:18789`. You start it once via `openclaw onboard --install-daemon` and from then on it runs in the background. After that, every channel adapter, the dashboard, every CLI invocation -- they all talk to that one process. If the process dies, the body dies with it.

Inside the Gateway lives the PI agent. The thing I want to make absolutely clear, because I got this wrong the first time I read about it: PI is *not* a separate process. It's not a subprocess the Gateway spawns and pipes to. It's an embedded SDK -- a library the Gateway imports and calls directly via [`createAgentSession()`](https://github.com/openclaw/openclaw/blob/main/docs/pi.md). The Gateway and the PI agent share memory, share state, share the same process. From the operating system's point of view, OpenClaw is one thing.

I don't know whether Peter designed it this way from day one or converged on it after trying a subprocess version. The docs don't say. But the result is the same: no IPC, no JSON-RPC dance between two processes -- just function calls. It's the cleanest architecture decision in the whole project, and I don't think it gets enough credit.

The carapace is one process, on your machine, that owns everything. Hold that picture.

---

## The nervous system: the PI agent, channels, and dashboard

A lobster doesn't have a brain in the way you and I do. What it has is something like a nerve ring of ganglia around its esophagus -- clusters of nerves that handle decisions. OpenClaw is uncomfortably close to that. The PI agent is a ring of decision-making wrapped around the message loop, and it doesn't think between turns. It only thinks when something arrives.

<!-- IMAGE: body-sistema-nervioso.webp
     Prompt: see analysis_results/body_part_image_prompts.md → Sistema nervioso section
     Alt (ES): Vista frontal de la cabeza de la langosta OpenClaw con filamentos luminosos ámbar trazando los caminos neurales desde el interior del caparazón hasta las antenas extendidas.
     Alt (EN): Front-facing view of the OpenClaw lobster's head with luminous amber filaments tracing neural pathways through the carapace edges toward the extended antennae.
     Figcaption (ES): El sistema nervioso: los canales que conectan el mundo exterior con el agente interior.
     Figcaption (EN): The nervous system: the channels that connect the outside world to the agent within.
     Drop the .webp file into public/images/blog/posts/openclaw-anatomy-of-a-lobster/_staging/
     and run /optimize-image. -->

When a message lands, here's what happens, in order:

1. **Channel ingress.** The right adapter for the channel pulls the event off the network -- WhatsApp through Baileys, Telegram through grammY, Slack and Discord and the rest each through their own client -- and turns it into something OpenClaw can read.
2. **Normalize, dedupe, access control.** The Gateway normalizes the message into its internal shape, checks it isn't a duplicate, and runs the DM/group policy: pairing, allowlist, open. For groups it can require an explicit @mention before the agent will respond.
3. **Session resolution and routing.** The Gateway runs a deterministic binding hierarchy to figure out which agent and which session this message belongs to: Peer match → parentPeer match → guildId+roles → guildId → teamId → accountId match → channel-level (`accountId: "*"`) → default agent. There can be more than one agent per Gateway. Honestly, I don't memorize this order either -- that's what the [multi-agent docs](https://docs.openclaw.ai/concepts/multi-agent) are for.
4. **Context assembly.** The PI agent loads the workspace files we'll get to in a minute -- SOUL, AGENTS, USER, today and yesterday's memory logs, MEMORY.md if this is a main DM session, plus the eligible skills snapshot. Empty files are skipped. Big files get trimmed and truncated with a marker so the prompt stays lean.
5. **Model + tool loop.** PI streams to whichever model you've configured. As tool calls come back, they pass through the policy filter, the sandbox, and the schema normalizer before they actually run. Then the result goes back to the model, and the loop continues until the model is done.
6. **Reply + persistence.** Streamed chunks flow back through the channel adapter. The conversation gets written to `~/.openclaw/agents/<agentId>/sessions/`. Any new memory or workspace edits land on disk.

That's it. Six steps, plus a return arrow back to you. The shape is what matters: the agent doesn't run in the background on its own. It runs because something asked it to. Voice notes, heartbeat ticks, button clicks in the dashboard -- all of them reduce to "a message arrived, run the loop." The message loop now has a canonical source in the [agent-loop docs](https://docs.openclaw.ai/concepts/agent-loop).

**The channels.** The Gateway answers the question, *where does input come from?* And the answer is: from anywhere you already type or speak. The repo's README currently lists 23 channels: WhatsApp, Telegram, Slack, Discord, Signal, iMessage, and among the more recognizable additions: Google Chat, Microsoft Teams, and Matrix. Also IRC, Feishu, LINE, Mattermost, and several more. Exactly how many changes with each release -- the README today lists 23, tomorrow could be 25. Most adapters are off by default until you authenticate them.

**The dashboard.** The second entry point. It's officially called the "Control UI" in the architecture docs, and "dashboard" everywhere else, including in the `getting-started` page itself. I'm going to call it the dashboard because that's what I call it and that's what you'll call it. It's a single-page app built with Vite and Lit, served by the Gateway on the same port (`127.0.0.1:18789` by default), and it talks back to the Gateway over a typed WebSocket. Authentication happens during the WebSocket handshake -- token, password, Tailscale identity, or trusted-proxy headers.

What the dashboard taught me is that channels are the loud entry point but they're not the whole story. A lot of what an agent does, especially during heartbeat ticks, never goes to a channel at all -- it shows up only in the dashboard log, like a thought you weren't told about. If you've never opened the dashboard, you've only seen half of what your agent does.

---

## The seven organs: the workspace files

OpenClaw's mind lives in seven Markdown files. Yes -- Markdown. No YAML schemas, no JSON config, no DSL with its own syntax to learn. Plain text that describes how your agent should behave.

The talk and Chapter 1 both name these seven. This is what each one actually does.

<!-- IMAGE: body-siete-organos.webp
     Prompt: see analysis_results/body_part_image_prompts.md → Siete órganos section
     Alt (ES): Vista aérea del interior de la langosta OpenClaw con el caparazón semitransparente revelando siete cámaras internas que brillan en distintos tonos de ámbar y cobre.
     Alt (EN): Aerial view of the OpenClaw lobster's interior, carapace rendered semi-transparent to reveal seven inner chambers glowing in distinct shades of amber and copper.
     Figcaption (ES): Los siete órganos: la mente de texto plano que vive dentro del caparazón.
     Figcaption (EN): The seven organs: the plain-text mind that lives inside the shell.
     Drop the .webp file into public/images/blog/posts/openclaw-anatomy-of-a-lobster/_staging/
     and run /optimize-image. -->

Quick honest aside before I start naming files: there are technically more files in the workspace than seven. There's `STARTUP.md` for optional startup checklists that run when the Gateway restarts. There's `BOOT.md` for the one-time first-run ritual that gets deleted after it runs. There are daily memory logs in `memory/YYYY-MM-DD.md`. There's `skills/` and `canvas/`. The seven I'm about to walk through are the agent's *mind* -- everything else is plumbing or history. I just want to be clear it's a distinction, not a literal count.

Workspace lives at `~/.openclaw/workspace` by default (or `~/.openclaw/workspace-<profile>` if you set `OPENCLAW_PROFILE`). Here's what each file does.

**SOUL.md** -- Persona, tone, boundaries. The voice of the agent. Loaded at the start of every session. Peter has said in interviews that this part of the design was [inspired by Anthropic's constitutional AI work](https://lexfridman.com/peter-steinberger-transcript/) -- a small set of principles that shapes everything the model does without having to repeat itself. The first time I edited SOUL.md, I changed two lines and the agent felt like a different person. Same model, same memory, same skills -- different soul. That was the moment I realized this file is load-bearing.

**IDENTITY.md** -- Name, vibe, emoji. Set during the bootstrap ritual on first run. Distinct from SOUL.md in a way that took me a beat to internalize: SOUL is *how I behave*. IDENTITY is *what I'm called*. Two separate concerns, two separate files.

**USER.md** -- Who you are. Timezone, work context, communication preferences, things the agent should know about you. Loaded every session. It's the file I revise the most, because every time I change jobs or move countries the agent needs the update.

**TOOLS.md** -- Notes about your local tools and conventions. Important caveat the docs are very clear about: this file is *reference*, not control. It does not decide which tools the agent has -- that lives in `openclaw.json` and the policy filter. TOOLS.md is for telling the agent things like "we use ripgrep, not grep" or "always run prettier before committing." Misnamed, historically.

**HEARTBEAT.md** -- An optional checklist the agent works through on its own schedule, every 30 minutes by default (or every hour if you're authenticated to Anthropic via OAuth). It's read only on heartbeat runs. It supports a simple bullet list or a structured `tasks:` block with named items and intervals. There's a small piece of behavior worth knowing about: [if HEARTBEAT.md exists but is effectively empty](https://docs.openclaw.ai/gateway/heartbeat) -- only blank lines and headers -- OpenClaw skips the run entirely and logs `reason=empty-heartbeat-file`. It's a kindness. You don't get charged for nothing.

**AGENTS.md** -- Operating instructions. Rules, priorities, escalation paths. This is the file that's quietly become an industry standard. Codex, Cursor, Antigravity all read AGENTS.md when they're in your project. OpenClaw reads it at the start of every session. It's the closest thing OpenClaw has to a "system prompt", and the fact that it's the same filename other tools have converged on is not an accident.

**MEMORY.md** -- Curated long-term memory. Things that matter across weeks and months. Loaded at the start of every main DM session -- not in shared or group chats. The reasoning is sensible (you don't want your private memory leaking into a Slack thread with your team), but it took me a while to notice why my agent suddenly forgot things in a Discord server. The day-to-day stuff lives in a separate place: `memory/YYYY-MM-DD.md`, one file per day, automatically read for "today and yesterday" before each session.

Seven files. Plain text. That's the mind.

---

## The claws: built-in tools, skills, and MCP

OK, that's enough about the brain. Let's talk about the hands.

If the seven files are what the agent thinks with, the claws are what it actually does. And there are three families of them. They feel different, they live in different places, but from the model's point of view they all look the same: a tool call.

<!-- IMAGE: body-pinzas.webp
     Prompt: see analysis_results/body_part_image_prompts.md → Pinzas section
     Alt (ES): Vista desde abajo de las dos pinzas de la langosta OpenClaw extendidas hacia el frente: la pinza trituradora más grande a la izquierda del encuadre, la cortadora más pequeña a la derecha, ambas con reflejos ámbar en los bordes.
     Alt (EN): Low-angle view of the OpenClaw lobster's two claws extended toward the viewer: the larger crusher claw on the left of the frame, the smaller cutter claw on the right, both catching warm amber rim light.
     Figcaption (ES): Las pinzas: herramientas integradas, skills y MCP — tres familias, una misma forma.
     Figcaption (EN): The claws: built-in tools, skills, and MCP — three families, one shape.
     Drop the .webp file into public/images/blog/posts/openclaw-anatomy-of-a-lobster/_staging/
     and run /optimize-image. -->

**Built-in tools.** These ship with OpenClaw. The catalog has grown -- media generation, tool search, and `heartbeat_respond` all live alongside the originals now. The repo's README lists the main categories: browser, canvas, nodes, cron, sessions, and channel actions for Discord/Slack/etc. Plus messaging, the gateway tool, and the read/write/edit trio that PI already has and OpenClaw replaces with sandbox-aware versions. They're the ones you don't have to install. They're already there.

**Skills.** A skill is a directory with a `SKILL.md` file in it -- YAML frontmatter (`name`, `description`), Markdown body with instructions. That's a skill. No code, unless the skill itself wants to call something. The agent reads it when it decides the skill is relevant. Skills can come from six places, and the [precedence order](https://docs.openclaw.ai/tools/skills) matters because workspace skills win over everything else by name:

1. `<workspace>/skills`
2. `<workspace>/.agents/skills`
3. `~/.agents/skills`
4. `~/.openclaw/skills`
5. Bundled skills (shipped with install)
6. `skills.load.extraDirs` (lowest)

The community skill registry lives at [ClawHub](https://clawhub.ai/) -- you install a skill with `openclaw skills install <slug>` and update them all with `openclaw skills update --all`. The skills doc itself is unusually direct about security: *"Treat third-party skills as untrusted code. Read them before enabling."* Worth taking seriously, given what happened with ClawHavoc. Chapter 1 covered that. I won't rehash it.

**MCP servers.** This is the part the docs almost hide. OpenClaw speaks the [Model Context Protocol](https://docs.openclaw.ai/cli/mcp) in two directions.

Outbound -- *OpenClaw connects to MCP servers* -- you register a server with `openclaw mcp set <name> <json>` and OpenClaw will manage it for you. Three transports are supported: `stdio` (a local child process), `SSE/HTTP` (a remote server with optional auth headers), and `streamable-HTTP` (bidirectional remote streaming). A real example from the docs:

```bash
openclaw mcp set context7 '{"command":"uvx","args":["context7-mcp"]}'
openclaw mcp set docs    '{"url":"https://mcp.example.com"}'
```

After that, the embedded PI exposes those servers' tools in the standard `coding` and `messaging` profiles. From the model's point of view they're just tools. Session-scoped MCP runtimes get reaped after they go idle, so you're not paying for processes you're not using. I think this is the part that will matter most a year from now -- I'm not sure, but the pattern feels like what happened when webhooks showed up.

Inbound -- *OpenClaw becomes an MCP server* -- run `openclaw mcp serve` and you get a stdio MCP server that bridges your Gateway conversations to MCP clients like Claude Code. Your personal agent becomes a tool another agent can use.

The reason all three families end up shaped the same is that, by the time the model sees them, they're just tool definitions. Same envelope. Same policy filter. Same sandbox. Three families, one shape -- that's the trick.

---

## Metabolism: the heartbeat and the memory underneath it

A lobster's metabolism runs whether or not it's hunting. OpenClaw's metabolism is the heartbeat loop and the memory layer underneath it.

<!-- IMAGE: body-metabolismo.webp
     Prompt: see analysis_results/body_part_image_prompts.md → Metabolismo section
     Alt (ES): Perfil del abdomen segmentado y abanico caudal de la langosta OpenClaw, con una línea de luz ámbar continua recorriendo el centro ventral como un latido.
     Alt (EN): Side profile of the OpenClaw lobster's segmented abdomen and tail fan, with a continuous amber light line running along the ventral midline like a heartbeat trace.
     Figcaption (ES): El metabolismo: el latido que corre haya o no haya presa.
     Figcaption (EN): The metabolism: the heartbeat that runs whether or not there is prey.
     Drop the .webp file into public/images/blog/posts/openclaw-anatomy-of-a-lobster/_staging/
     and run /optimize-image. -->

Heartbeat is the agent waking up periodically to do a check on its own. By default every 30 minutes, or every hour if you're on Anthropic OAuth. You can set it per-agent through `agents.defaults.heartbeat.every`, restrict it to business hours via `activeHours`, or turn it off entirely with `0m`. The crucial thing the [heartbeat doc](https://docs.openclaw.ai/gateway/heartbeat) is loud about: *"Heartbeat is a scheduled main-session turn -- it does not create background task records."* Heartbeat is not cron. They share a vibe, but inside the system they're separate primitives. Cron, the tool, writes `~/.openclaw/cron/jobs.json` -- heartbeat just runs a turn. Subtle, but it's the difference between "the agent checks in on its own" and "the agent has a queue of jobs."

Memory underneath the heartbeat has two layers. The daily log is a Markdown file per day -- `memory/2026-05-04.md`, `memory/2026-05-03.md`, and so on. The default AGENTS.md template tells the agent to read "today and yesterday" before processing requests, so two days of context are always cheap. The curated long-term layer is MEMORY.md, loaded only in main DM sessions, which is where things you want the agent to actually *remember* go. And the underlying memory store is itself pluggable -- Honcho, QMD, and LanceDB are all documented alongside the default SQLite.

Sessions, credentials, and auth profiles live separately under `~/.openclaw/agents/<agentId>/sessions/`. That separation is the trick that makes multi-agent work without anyone leaking into anyone else.

I'm honestly not sure 30 minutes is the right cadence for everyone. For me it's too much in a normal day and not enough at the times I actually need a check-in. I expect the defaults to keep moving as the project learns what people use it for.

---

## Molting: how it grows safely

Lobsters don't grow gradually. They outgrow their shell, walk out of it backwards, and wait for the new one to harden.

<!-- IMAGE: body-muda.webp
     Prompt: see analysis_results/body_part_image_prompts.md → Muda section
     Alt (ES): La langosta OpenClaw a mitad de muda: el torso y la cabeza emergiendo de la concha vieja oscura y desgastada, con el nuevo caparazón escarlata más brillante visible en la parte emergida.
     Alt (EN): The OpenClaw lobster mid-molt: torso and head emerging from the darker, worn old shell, with the brighter new scarlet carapace visible on the emerged portion.
     Figcaption (ES): La muda: para crecer, primero hay que salir de la concha vieja.
     Figcaption (EN): The molt: to grow, you first have to leave the old shell behind.
     Drop the .webp file into public/images/blog/posts/openclaw-anatomy-of-a-lobster/_staging/
     and run /optimize-image. -->

The first version was wild -- Chapter 1 covers what that felt like. The version we have now is what the second shell looks like after it's hardened.

By default in your *main* session, tools run on the host. In any other session, sandboxing kicks in. The default `non-main` mode runs non-main sessions inside a Docker container; SSH and OpenShell are also available. You can switch the mode to `off` or to `all` if you want even your main session sandboxed. Workspace access is configurable too: `none`, `ro` mounted at `/agent` (disables write/edit/apply_patch), or `rw` mounted at `/workspace`.

The list of things the sandbox blocks by default reads like a "the right people thought about this" list: system paths like `docker.sock`, `/etc`, `/proc`, `/sys`, `/dev`, plus the credential directories `~/.aws`, `~/.cargo`, `~/.config`, `~/.docker`, `~/.gnupg`, `~/.netrc`, `~/.npm`, and `~/.ssh`. Three exec security levels: `deny`, `full` (no per-command approval -- the trusted-operator default), and `ask=always`. The source for this list is [the security page](https://docs.openclaw.ai/gateway/security), not the sandboxing doc.

After ClawHavoc, the project also blocked specific tools by default for non-owner senders: `gateway`, `cron`, `sessions_spawn`, `sessions_send`. If someone messages your agent who isn't you, those tools won't run for them no matter what the agent decides.

The hardening keeps shipping. In May 2026 the project added SSRF policy enforcement on browser reads and sender allowlists for ClickClack. And the `openclaw` npm package publishes with `npm-shrinkwrap.json` -- npm's publishable dependency lockfile -- so package installs use the reviewed transitive dependency graph from the release.

It is still not multi-tenant, and it does not pretend to be. I think that's the right call. Trying to retrofit multi-tenancy onto a personal-AI-agent runtime would have killed the project. Saying *no, this is yours, run it where you trust it* is the only honest answer.

---

## What this means for you

Why does any of this matter outside curiosity?

Because once you understand the body, you can edit it. SOUL.md tweaks take two minutes. A new skill is a Markdown file. An MCP server is one CLI command. Most users will never write a new built-in tool -- they don't need to. The architecture is set up so that *configuration* is the surface most people touch. That's the gift. The agent's behavior bends to whoever can write a bullet list, which is most of us.

I've been running OpenClaw for a few months now and the only thing I changed first was SOUL.md, twice. Then I added two skills from ClawHub and wrote one of my own. Then I wired in a context7 MCP server because I got tired of pasting docs. I haven't touched the sandbox. I haven't customized the heartbeat. I run the dashboard maybe once a week. Most of the body, I leave alone. That's the point.

The architecture's gift is that it survives most of its early users not knowing what they're doing.

Let's keep building.

---

## Resources

- [OpenClaw](https://openclaw.ai/) -- Official site
- [OpenClaw documentation](https://docs.openclaw.ai/) -- Concepts, gateway, skills, CLI reference
- [Architecture overview](https://docs.openclaw.ai/concepts/architecture) -- Gateway, sessions, routing
- [Agent loop](https://docs.openclaw.ai/concepts/agent-loop) -- Canonical flow: intake → assembly → model → tools → persistence
- [Agent runtime](https://docs.openclaw.ai/concepts/agent) -- The PI agent and context assembly
- [Memory and backends](https://docs.openclaw.ai/concepts/memory) -- MEMORY.md, daily logs, pluggable backends
- [Workspace files reference](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent-workspace.md) -- The full list, not just the seven
- [Heartbeat](https://docs.openclaw.ai/gateway/heartbeat) -- Periodic agent turns and HEARTBEAT.md
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) -- Modes, blocked sources, security levels
- [Security model](https://docs.openclaw.ai/gateway/security) -- One trust boundary per Gateway, non-owner blocked tools, npm-shrinkwrap
- [Skills](https://docs.openclaw.ai/tools/skills) -- Format, precedence, ClawHub
- [Cron jobs](https://docs.openclaw.ai/automation/cron-jobs) -- Persistence and isolation of scheduled tasks
- [MCP CLI reference](https://docs.openclaw.ai/cli/mcp) -- `openclaw mcp serve` and `openclaw mcp set/list/show/unset`
- [ClawHub](https://clawhub.ai/) -- Community skill registry
- [PI agent SDK](https://github.com/openclaw/openclaw/blob/main/docs/pi.md) -- `createAgentSession()` and the tool wiring pipeline
- [May 2026 release notes](https://github.com/openclaw/openclaw/releases) -- `openclaw 2026.5.26`: SSRF policy, ClickClack allowlists, and more
