---
type: native
title: 'OpenClaw: Your Assistant. Your Machine. Your Rules. — The personal agent revolution'
description: 'A new generation of personal agents running under your rules, on your own machine. Project overview, architecture, and live demos of real use cases.'
pubDate: 2026-05-04
heroImage: '/images/slides/openclaw-your-assistant-your-machine-your-rules/cover-en.webp'
draft: false
theme: dark
transition: slide
syntaxHighlight: true
math: false
eventName: 'OpenClaw — Talk Companion to the blog post'
eventDate: 2026-05-04
relatedPost: openclaw-your-assistant-your-machine-your-rules
---

<!-- ==================== Cover ==================== -->

<!-- .slide: data-background-image="/images/slides/openclaw-your-assistant-your-machine-your-rules/cover-en.webp" data-background-size="contain" data-background-position="center" data-background-color="#0f1124" -->

&nbsp;

Note: Open with the cover image — full-bleed, no overlay text. The cover already carries the title, tagline, event logos, and speaker photo. Pause for two beats before saying the first line: "Your assistant. Your machine. Your rules." Six words that explain why this project broke the internet.

---

<!-- ==================== Built in the open ==================== -->

<!-- .slide: data-background-image="/images/slides/openclaw-your-assistant-your-machine-your-rules/built-in-the-open-en.webp" data-background-size="contain" data-background-position="center" data-background-color="#0f1124" -->

&nbsp;

Note: Before introducing Peter, anchor the message: OpenClaw was built in the open. Four pillars — transparency, community, collaboration, freedom. Open by nature. Brief pause, let the image speak, then jump into Act 1.

---

<!-- ==================== Act 1 — The man ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Act 1</span>
  <h2>Peter Steinberger</h2>
  <p style="margin-top:0.8em;font-size:1.6em;color:#cbd5e1;font-weight:400;">The man behind the lobster</p>
  <p style="margin-top:0.6em;font-size:2.2em;letter-spacing:0.2em;">🦞 🦞 🦞</p>
</div>

Note: This story does not make sense without Peter Steinberger. So we start with him.

---

<!-- ==================== Peter + lobster ==================== -->

<!-- .slide: data-background-image="/images/slides/openclaw-your-assistant-your-machine-your-rules/peter-lobster.webp" data-background-size="contain" data-background-position="center" data-background-color="#0f1124" -->

<h2 style="position:absolute;bottom:8%;left:50%;transform:translateX(-50%);margin:0;padding:0.4em 1em;background:rgba(15,17,36,0.78);color:#fff;border-radius:8px;backdrop-filter:blur(6px);font-size:1.6em;letter-spacing:0.02em;">Peter Steinberger</h2>

Note: Here the image introduces Peter visually: the creator of OpenClaw and the lobster side by side. Pause so the audience connects the face with the name before the timeline (Austria, code at 14, PSPDFKit).

---

<!-- ==================== Rural Austria ==================== -->

<!-- .slide: data-background-image="/images/slides/openclaw-your-assistant-your-machine-your-rules/rural-austria.webp" data-background-size="cover" data-background-position="center" data-background-color="#0f1124" -->

<div style="position:absolute;top:8%;left:50%;transform:translateX(-50%);padding:0.5em 1.2em;background:rgba(15,17,36,0.78);color:#fff;border-radius:10px;backdrop-filter:blur(6px);text-align:center;">
  <p style="margin:0;font-size:0.7em;letter-spacing:0.18em;text-transform:uppercase;color:#f59e0b;font-weight:600;">1986</p>
  <h2 style="margin:0.15em 0 0;font-size:1.4em;font-weight:700;line-height:1.15;">Born in rural Austria</h2>
</div>

Note: Full-bleed image of rural Austria — mountains, wooden farmhouse, grazing cows. The setting where Peter is born in 1986. Brief pause so the audience takes in the landscape, then jump into the bio.

---

<!-- ==================== Age 14 — the switch flips ==================== -->

## Learns to code at 14

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/peter-young-coding.webp" alt="Young Peter at 14 sitting at a CRT with code on screen, in a rural Austrian room with a C++ book and an Einstein quote" width="1672" height="941" class="slide-image-full" />

Note: At 14, a summer guest lends him a computer. The switch flips. The image tells the whole story: the kid at a CRT, code on screen, the Austrian church through the window, a C++ book on the desk, an Einstein quote on the wall. The exact moment a programmer is born. Long pause, let the image breathe.

---

<!-- ==================== 2011 — Co-founds PSPDFKit ==================== -->

<div style="text-align:center;margin-bottom:0.4em;">
  <p style="margin:0;font-size:0.75em;letter-spacing:0.2em;text-transform:uppercase;color:#f59e0b;font-weight:600;">2011</p>
  <h2 style="margin:0.15em 0 0;font-size:1.3em;font-weight:700;line-height:1.15;">Co-founds PSPDFKit with Martin Schurrer</h2>
</div>

<div style="display:flex;align-items:center;justify-content:center;gap:3em;flex-wrap:wrap;margin-top:0.8em;">
  <img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/peter-portrait.webp" alt="Portrait of Peter Steinberger" width="300" height="300" style="border-radius:50%;box-shadow:0 12px 32px rgba(0,0,0,0.45);" />
  <img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/pspdfkit-logo.webp" alt="PSPDFKit logo" width="500" height="142" style="background:#fff;padding:0.9em 1.4em;border-radius:14px;box-shadow:0 12px 32px rgba(0,0,0,0.35);" />
</div>

<small style="display:block;text-align:center;margin-top:0.9em;font-size:0.75em;color:var(--slide-text);line-height:1.35;font-weight:500;"><em>iOS PDF SDK. A decade bootstrapped before any outside money.</em></small>

Note: From age 14 we jump to 2011: Peter co-founds PSPDFKit with Martin Schurrer. It's the company nearly a billion people touched without knowing it — Dropbox, SAP, DocuSign, Apple. Brief pause so the audience pairs the face with the logo before the single-image product beat.

---

<!-- ==================== What PSPDFKit is (graphic) ==================== -->

## What PSPDFKit is

<p style="text-align:center;margin:0 0 0.75em;font-size:0.92em;color:var(--slide-text);line-height:1.4;font-weight:500;">A cross-platform SDK for embedding PDF viewing, annotation, and signatures in iOS, Android, and web apps.</p>

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/pspdfkit-framework-hero.webp" alt="PSPDFKit illustration: connected phones, tablets, and desktop showing PDFs with charts; light connection lines and white logo on blue background" width="1024" height="442" class="slide-image-full" style="display:block;margin:0.5em auto 0;max-width:min(100%, 1024px);" />

Note: One image beats a paragraph: a cross-platform SDK for viewing, annotating, and shipping PDFs inside real apps. Let it land for a couple of seconds; the next slide locks in the numbers — reach, customers, and the 2021 round.

---

<!-- ==================== PSPDFKit — scale by 2021 ==================== -->

## PSPDFKit by 2021

<div class="slide-stat">
  <span class="slide-stat__number">~1B</span>
  <span class="slide-stat__label" style="color:var(--slide-text);font-weight:500;">devices running apps built on PSPDFKit</span>
  <p style="font-size:0.78em;color:var(--slide-text);line-height:1.45;margin:1rem auto 0;max-width:36em;text-align:center;"><strong>Customers included:</strong> <em>Dropbox · SAP · DocuSign · Apple</em></p>
  <p style="font-size:0.72em;color:var(--slide-text);line-height:1.45;margin:0.85rem auto 0;max-width:40em;text-align:center;opacity:0.92;"><strong>October 2021:</strong> Insight Partners put <strong>EUR 100M</strong> on the table — first outside capital after <strong>ten years</strong> bootstrapped.</p>
</div>

Note: By 2021 the SDK was on roughly a billion devices, most people unaware of the product name. The logos matter — serious integrators. The Insight round closed a decade with no outside funding; “on the table” is the gist — terms that finally made sense for Peter. Next slide: what Peter did with *his* side of the deal.

---

<!-- ==================== Peter — liquidity after the round (2021) ==================== -->

<!-- .slide: class="slide-content-top" -->

## After the Insight round

<div class="slide-grid-2 slide-grid-2--compact-media">
  <div>
    <img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/peter-new-chapter.webp" alt="Illustration: figure leaving a dark office toward a bridge and a city at dawn — metaphor for closing a chapter and starting new ventures" width="758" height="1024" style="display:block;max-height:min(50vh,460px);width:auto;margin:0;border-radius:10px;box-shadow:0 10px 28px rgba(0,0,0,0.22);" />
  </div>
  <div style="text-align:left;padding-top:0.15em;align-self:start;">
    <p style="margin:0;font-size:1.25em;line-height:1.4;color:var(--slide-text);">In the same deal, Peter <strong>sold most of his stake</strong> to <strong>go build new things</strong>.</p>
    <p style="margin:0.65em 0 0;font-size:1.0em;line-height:1.4;color:var(--slide-text);opacity:0.9;">Liquidity — closing the chapter as founder at the center.</p>
  </div>
</div>

Note: Same beat as the blog: Insight for the company — Peter, on his side, sells most of his equity. The visual sells the pivot without brand noise. Bridge into the emptiness and the Lex interview.

---

## Then came the void

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/burnout.webp" alt="Illustration: lone figure in front of a laptop in a dim room at dawn, crumpled papers on the desk — founder burnout" width="1024" height="576" class="slide-image-full" style="display:block;margin:0.4em auto 0;max-width:min(100%, 1024px);" />

<small style="display:block;text-align:center;margin-top:0.6em;color:var(--slide-text);font-size:0.72em;font-style:italic;">Two to three years unable to write a single line of code. The spark that defined him since he was fourteen — gone.</small>

Note: Real burnout. Not the "I need a vacation" kind. The "I don't know who I am without this" kind. Long pause, let the image speak.

---

<!-- ==================== Disconnected ==================== -->

## Nearly three years off the grid

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/disconnected.webp" alt="Illustration: figure seen from behind sitting in a wooden cabin looking out at a lake and misty mountains at dawn, laptop closed beside them — disconnected from the tech world" width="1024" height="576" class="slide-image-full" style="display:block;margin:0.4em auto 0;max-width:min(100%, 1024px);" />

<small style="display:block;text-align:center;margin-top:0.6em;color:var(--slide-text);font-size:0.72em;font-style:italic;">No code. No projects. Away from the tech world. Trying to figure out if the spark would come back — or if he was done.</small>

Note: An image that breathes silence. Three years is a long time for someone whose identity revolved around code. Let the audience feel the weight before the Austin Powers reference.

---

<!-- ==================== Austin Powers ==================== -->

## "I felt like Austin Powers where they suck the mojo out"

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/austin-powers-en.webp" alt="Austin Powers meme: I've lost my mojo" width="1024" height="447" class="slide-image-full" style="display:block;margin:0.4em auto 0;max-width:min(100%, 1024px);border-radius:0.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.22);" />

<small style="display:block;text-align:center;margin-top:0.6em;color:var(--slide-text);font-size:0.72em;font-style:italic;">— Peter Steinberger on the Lex Fridman Podcast (#491)</small>

Note: Direct quote from Peter. "I felt like Austin Powers where they suck the mojo out. I couldn't get code out anymore. I was just, like, staring and feeling empty." The meme helps the audience connect with humor before returning to the emotional weight of the one-way ticket to Madrid.

---

<!-- ==================== The encounter with AI ==================== -->

## Until AI brought the spark back

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/ai-spark.webp" alt="Illustration: silhouette of a person at the edge of a cliff looking at a luminous staircase of AI agents and code ascending toward a futuristic city — the reunion with technology" width="1024" height="576" class="slide-image-full" style="display:block;margin:0.4em auto 0;max-width:min(100%, 1024px);" />

<small style="display:block;text-align:center;margin-top:0.6em;color:var(--slide-text);font-size:0.72em;font-style:italic;">From a café in Madrid, Peter watched the coding agents revolution unfold — and something inside him lit up again.</small>

Note: Late 2024, generative AI and coding agents explode. Peter sees it from a distance, from a café in Madrid. He doesn't seek it out — curiosity finds him. He starts playing with models. One prompt here, another there. And suddenly, without planning it, he's coding again.

---

## And then, May 2025…

<a href="https://x.com/steipete/status/1925983535958999393" target="_blank"><img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/steipete-spark-tweet.webp" alt="Peter Steinberger's tweet showing his GitHub contribution graph with the message When you get your spark back" width="900" height="649" style="display:block;margin:0 auto;max-width:min(65%, 580px);border-radius:0.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.22);" /></a>

<small>Peter Steinberger on X, May 2025: "When you get your spark 🌟 back."</small>

Note: A screenshot of his GitHub activity. He was coding nonstop again. A month later he published "Finding My Spark Again" on his blog. He came back lighter, more direct. One sentence summed it up: "I don't do this for the money. I want to have fun and have impact."

---

<!-- ==================== Series: Working with Agents ==================== -->

<!-- .slide: class="slide-content-top" -->

## Series — Working with Agents

<a href="https://xergioalex.com/blog/series/working-with-agents/" target="_blank"><img src="/images/blog/series/working-with-agents/hero-en.webp" alt="Working with Agents: From writing code to orchestrating AI agents" width="1024" height="576" style="display:block;margin:0 auto;max-height:min(48vh, 390px);width:auto;border-radius:0.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.22);" /></a>

<p style="text-align:center;margin:0.4em 0 0;font-size:0.7em;"><a href="https://xergioalex.com/blog/series/working-with-agents/" target="_blank" style="color:#60a5fa;">xergioalex.com/blog/series/working-with-agents</a></p>

Note: Before continuing with the OpenClaw story, a personal aside. This series — "Working with Agents" — is my own documentation of the paradigm shift: from writing code to orchestrating AI agents. Real workflows, what breaks, judgment, context, team adoption. If you want to dig deeper, the links are in both languages.

---

<!-- ==================== Act 2 — The birth ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/whatsapp-logo.png" alt="WhatsApp" width="80" height="80" style="display:block;margin:0 auto 0.3em;">
  <span class="eyebrow">Act 2</span>
  <h2>From WhatsApp bot to viral phenomenon</h2>
</div>

---

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/whatsapp-logo.png" alt="WhatsApp logo" width="80" height="80" style="display:block;margin:0 auto 0.2em;" />

## November 2025 — a trivial annoyance

<ul>
  <li>Peter was working with <strong>Claude</strong> every day</li>
  <li>He wanted to talk to it and give it commands <strong>from WhatsApp</strong></li>
  <li>Nothing existed that did this cleanly</li>
  <li>So he sat down and built it — in no time he had a <strong>working version</strong></li>
</ul>

Note: The entire origin story in one slide. Peter used Claude daily, wanted to control it from WhatsApp, nothing did it well, so he built it himself in an hour. A WhatsApp ↔ Claude API bridge. No memory, no tools, just messages back and forth. Irony: the project was named after Claude, but most of its code was written by OpenAI's Codex — Peter ran 5–10 Codex agents in parallel as his team.

---

<p style="text-align:center;font-size:2.5em;margin:0;">🦞</p>

## Clawdbot

<ul>
  <li>Peter asked <strong>Claude</strong> what to call the project</li>
  <li>It suggested "<strong>Clawdbot</strong>" — a pun with claw + Claude</li>
  <li>Peter pushed it to GitHub. Shared the link. Went to sleep.</li>
</ul>

Note: He published, shared, and slept.

---

## But at first, not much happened

<ul>
  <li>A few hundred developers discovered it</li>
  <li>After two weeks: <strong>~2,000 stars</strong> — not bad for an indie project</li>
  <li>But it was mostly a curiosity</li>
  <li>Peter kept working and added:</li>
</ul>

<div style="display:flex;justify-content:center;gap:1.5em;flex-wrap:wrap;margin-top:0.4em;font-size:0.85em;">
  <span>🧠 Persistent memory</span>
  <span>📁 File access</span>
  <span>⏰ Scheduled tasks</span>
  <span>💬 Telegram · Discord · Signal</span>
</div>

<small style="display:block;text-align:center;margin-top:0.5em;"><em>Every new feature attracted new developers.</em></small>

Note: For two months growth was slow, almost silent. Peter didn't stop: persistent memory so the agent remembered past conversations, file access on your disk, scheduled tasks that ran without intervention, and support for Telegram, Discord, and Signal on top of WhatsApp. Each new feature brought a new wave of developers. And then late January hit…

---

## Then late January 2026 happened

<div style="text-align:center;">
  <p style="font-size:2.2em;font-weight:800;color:#dc2626;margin:0;line-height:1.2;">9,000 → 34,000 → 180,000</p>
  <p style="font-size:1.3em;color:var(--slide-text);margin:0.3em 0 0;font-weight:500;">stars in 1 day → 48 hours → 2 weeks</p>
  <p style="font-size:0.85em;color:var(--slide-text);margin:0.6em 0 0;font-style:italic;opacity:0.85;">From niche curiosity to GitHub's dominant trend in days.</p>
</div>

Note: Something snapped. The project went from indie experiment to GitHub's dominant trend in a matter of days. I have watched open-source projects grow for years. I have never seen a trajectory anywhere close to this.

---

<!-- .slide: class="slide-content-top" -->

<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/star-history-openclaw-react-linux.webp" alt="GitHub star history chart comparing OpenClaw, React, and Linux. OpenClaw's line goes almost vertical in 2026 and overtakes both in a matter of weeks" width="1024" height="687" style="display:block;margin:0 auto;max-height:min(70vh, 540px);width:auto;border-radius:0.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.22);" />

<small style="display:block;text-align:center;margin-top:0.4em;">Star history: OpenClaw vs React vs Linux. Source: star-history.com</small>

Note: That vertical red line in 2026 is OpenClaw. It's not a rendering glitch. React took a decade to reach 250K stars — OpenClaw passed it around March 3, 2026, roughly 60 days after launch. The Linux kernel sits at ~225K after 30+ years. OpenClaw overtook it in under two months.

---

<!-- .slide: class="slide-content-top" -->

<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/star-history-openclaw-solo.webp" alt="OpenClaw GitHub star history from December 2025 to April 2026, showing explosive growth starting in late January" width="1024" height="690" style="display:block;margin:0 auto;max-height:min(70vh, 540px);width:auto;border-radius:0.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.22);" />

<small style="display:block;text-align:center;margin-top:0.4em;">OpenClaw star history alone, Dec 2025 – Apr 2026.</small>

Note: Zoom in on OpenClaw's curve alone. From November through late January, nearly flat. Then the curve shoots up and doesn't stop. As of April 2026 it's still climbing — sustained adoption, not a viral spike.

---

<!-- .slide: class="slide-content-top" -->

## Current repo numbers

<a href="https://github.com/openclaw/openclaw" target="_blank"><img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/openclaw-github-repo.png" alt="OpenClaw GitHub repository: 369K stars, 76.1K forks, 41,795 commits" width="1024" height="576" style="display:block;margin:0 auto;max-height:min(55vh, 420px);width:auto;border-radius:0.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.22);" /></a>

<small style="display:block;text-align:center;margin-top:0.4em;"><em>369K ⭐ · 76.1K forks · 41,795 commits · 138 releases</em></small>

Note: Live screenshot of the repo today. 369K stars, 76K forks, nearly 42 thousand commits, 138 releases. Forks and commits are hard to fake — that's real adoption, not just vanity metrics.

---

<!-- ==================== Act 3 — The triple rebrand ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #7c2d12 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Act 3</span>
  <h2>The triple rebrand</h2>
</div>

Note: This is where the story spirals. Corporate lawyers, crypto scammers, and a lobster-molting metaphor — all in one week.

---

<!-- .slide: class="slide-content-top" -->

<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/google-trends-clawdbot-vs-claude.webp" alt="Google Trends on January 27, 2026: clawdbot searches overtake claude code and codex" width="900" height="727" style="display:block;margin:0 auto;max-height:min(65vh, 500px);width:auto;border-radius:0.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.22);" />

<small style="display:block;text-align:center;margin-top:0.4em;">Google Trends, January 27, 2026: "clawdbot" overtakes "claude code" and "codex."</small>

Note: People were searching for "clawdbot" more than Anthropic's own product. The confusion between names did not sit well with the company behind Claude.

---

<!-- .slide: class="slide-content-top" -->

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/anthropic-cease-desist-en.png" alt="Illustration: Peter receives a cease and desist letter from Anthropic asking to rename Clawdbot for being too similar to Claude" width="1024" height="576" style="display:block;margin:0 auto;max-height:min(70vh, 540px);width:auto;border-radius:0.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.22);" />

Note: Illustration of the moment: Anthropic's lawyers show up with the cease and desist. "Please rename Clawdbot. Too similar to Claude." Peter had no choice.

---

## 5am Discord brainstorm → "Moltbot"

<ul>
  <li><strong>Molt</strong> = to shed the old shell and grow a bigger one</li>
  <li>Fit the mascot. Fit the rebrand situation.</li>
  <li>Peter renamed it everywhere — GitHub, X, all platforms</li>
</ul>

Note: Molt: shedding the old shell to grow a new one. A perfect metaphor for what was happening with the project. Peter renamed @clawdbot → @moltbot and shipped it.

---

<!-- .slide: class="slide-content-top" -->

## From Clawdbot to Moltbot

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/rebrand-clawdbot-moltbot-en.png" alt="Illustration: Clawdbot to Moltbot rebrand — X profile update from @clawdbot to @moltbot with username updated confirmation" width="1024" height="576" style="display:block;margin:0 auto;max-height:min(70vh, 540px);width:auto;border-radius:0.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.22);" />

Note: Visual of the real-world change: @clawdbot crossed out, @moltbot checked, on X and across the project's public footprint.

---

<!-- .slide: data-background-gradient="linear-gradient(135deg, #7c2d12 0%, #0f1124 100%)" -->

<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;text-align:center;padding:2rem;">
<p style="margin:0 0 0.2em;font-size:clamp(3rem, 10vw, 4.5rem);line-height:1;" role="img" aria-label="Warning">⚠️</p>
<h1 style="margin:0;font-size:clamp(2rem, 5vw, 3.2rem);font-weight:800;line-height:1.25;">And then<br/>the scammers showed up</h1>
</div>

Note: Pause before naming who rushed in — let the beat land.

---

<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:55vh;text-align:center;padding:1rem;">
<p style="margin:0;font-size:clamp(2.75rem, 9vw, 4rem);line-height:1;" aria-hidden="true">₿</p>
<h1 style="margin:0.2em 0 0;font-size:clamp(3.5rem, 12vw, 6rem);font-weight:800;line-height:1.05;">The crypto bros</h1>
</div>

Note: Not the usual dev crowd — the loud speculative side of social.

---

<ul style="font-size:1em;line-height:1.55;max-width:38em;margin:0 auto;text-align:left;">
  <li>After Peter renamed X from <strong>@clawdbot</strong> to <strong>@moltbot</strong>, the old handle went <strong>up for grabs</strong>.</li>
  <li><strong>Crypto bros</strong> seized it and <strong>posed as the real project</strong>.</li>
  <li>They launched a token called <strong>$CLAWD</strong> — classic <em>pump and dump</em>: inflate, dump, vanish.</li>
</ul>

Note: The scam was predictable. The worst part wasn't the scam — it was the harassment that followed (see later). Next slide expands the crypto-noise meme.

---

<!-- .slide: class="slide-content-top" -->

## Crypto hype and pressure

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/crypto-bros-pressure-en.png" alt="Satirical illustration: hype and token-pressure culture around the project versus the founder's original plan to build slowly for real users" width="1024" height="576" style="display:block;margin:0 auto;max-height:min(70vh, 540px);width:auto;border-radius:0.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.22);" />

Note: Stark contrast — ship utility vs "number go up." Free handle → scam token → a wave of noise demanding a coin overnight.

---

<!-- .slide: class="slide-content-top" -->

## The harassment was worse than the scam

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/harassment-backlash-en.png" alt="Illustration: mob of angry crypto bros, flooded social notifications, scam and rug-pull accusations around the Clawdbot to Moltbot rebrand" width="1024" height="576" style="display:block;margin:0 auto;max-height:min(62vh, 480px);width:auto;border-radius:0.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.22);" />

Note: One frame for the tsunami: thousands of mentions, blame directed at Peter — the human-scale side of the chaos.

---

<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/steipete-stop-harassing-tweet.webp" alt="Peter Steinberger's tweet asking crypto folks to stop harassing him over the CLAWD token" width="900" height="492" style="display:block;margin:0 auto;max-width:min(92%, 820px);max-height:min(68vh, 560px);width:auto;height:auto;border-radius:0.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.22);" />

Note: The harassment came from the victims, not the scammers. People who lost money blamed Peter. They demanded he "take responsibility" and endorse projects he had never heard of. He had to publicly ask them to stop. Peter on Lex Fridman's podcast: "The worst form of online harassment that I've experienced."

---

<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/steipete-anthropic-rename-tweet.webp" alt="Peter Steinberger's tweet: I was forced to rename the account by Anthropic. Wasn't my decision." width="900" height="332" class="slide-image-full" />

<small>Peter Steinberger on X, January 27, 2026.</small>

Note: A cease-and-desist. "Clawd" was too close phonetically to "Claude." Legally they probably had a point. Brutal timing — the project had just exploded.

---

<p style="text-align:center;font-size:2.5em;margin:0;">🌪️</p>

## In the middle of all that chaos

Peter realized <strong>Moltbot</strong> was past saving.

<ul>
  <li><strong>Search</strong> kept tying the name to the <strong>$CLAWD</strong> scam; the real project disappeared under the noise.</li>
  <li>He also admitted a smaller, honest detail: he'd <strong>never really liked</strong> how it sounded out loud.</li>
</ul>

Note: Leads into "Rebrand again": third name in days — then OpenClaw with the lobster.

---

<p style="text-align:center;font-size:2.5em;margin:0;">🔄</p>

<h2 style="text-align:center;font-size:clamp(2.4rem, 5.5vw, 3.4rem);margin:0.2em 0 0;line-height:1.12;font-weight:800;">Rebrand again</h2>

<p style="text-align:center;margin-top:0.65em;"><strong>Third name in under a week.</strong></p>

Note: Beat change — slow down before you land the final name.

---

<p style="text-align:center;font-size:2.5em;margin:0;">🦞</p>

## And so OpenClaw was born

<ul>
  <li>Signals an open-source <em>foundation</em>, not a company</li>
  <li>Independent and community-governed</li>
  <li><strong>OpenClaw sounded like a movement</strong> — open, not boxed in as a product</li>
</ul>

Note: The name is set; next beat is **how to execute the change for real** when scams and trust are on fire.

---

<p style="text-align:center;font-size:2.5em;margin:0;">💸</p>

## Doing it right had a price

<ul>
  <li>The final rebrand had to be <strong>done properly</strong> — not just a new <strong>name</strong>.</li>
  <li>The fix stung: <strong>$10,000</strong> for an <strong>X Business</strong> subscription.</li>
</ul>

Note: Mirrors the blog (“And this time, he decided to do it right…” / “The fix came at a price…”). Pause, then break down what that payment bought.

---

<p style="text-align:center;font-size:2.5em;margin:0;">✅</p>

## That one payment did three things

<ul>
  <li class="fragment fade-up">Claim the <strong>@OpenClaw</strong> handle — <strong>unused since 2016</strong>.</li>
  <li class="fragment fade-up">Add <strong>official verification</strong> so scammers couldn't <strong>clone his presence</strong> as easily.</li>
  <li class="fragment fade-up">Win back a <strong>direct line</strong> to the community to <strong>debunk the scam in real time</strong>.</li>
</ul>

Note: Three fragments — one reveal per beat — then the tweet slide.

---

<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/openclaw-final-form-tweet.webp" alt="Official OpenClaw tweet announcing the final rebrand: The lobster has molted into its final form. Clawd → Moltbot → OpenClaw. 100k+ GitHub stars. 2M visitors in a week. Your assistant. Your machine. Your rules." width="700" height="745" style="display:block;margin:0 auto;border-radius:8px;max-width:min(92%,600px);max-height:min(64vh,520px);width:auto;height:auto;box-shadow:0 8px 24px rgba(0,0,0,0.25);" />

Note: Official @OpenClaw tweet, January 30, 2026. "The lobster has molted into its final form." Three names in under a week. Logo stayed. Lobster stayed. The project kept growing through all of it.

---

<!-- .slide: class="slide-content-top" -->

<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/meme-triple-rebrand-spiderman.jpg" alt="Spider-Man pointing meme with three identical red claw-bots labeled Clawdbot, Moltbot, and OpenClaw in a warehouse-like scene" width="1024" height="682" class="slide-image-full" style="display:block;margin:0 auto;max-width:min(97%,920px);max-height:min(66vh,540px);width:auto;height:auto;box-shadow:0 8px 24px rgba(0,0,0,0.2);border-radius:0.5rem;" />

Note: The Spider-Man pointing formula: three names, one project.

---

<!-- .slide: class="slide-content-top" -->

<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/meme-triple-rebrand-in-progress-evolution.jpg" alt="Cartoon evolution lineup with IN-PROGRESS and CLAW lettering: smallest Clawd grows through Moltbot to largest OpenClaw — red robotic crab characters getting more armored" width="1024" height="918" class="slide-image-full" style="display:block;margin:0 auto;max-width:min(96%,860px);max-height:min(72vh,600px);width:auto;height:auto;box-shadow:0 8px 24px rgba(0,0,0,0.2);border-radius:0.5rem;" />

Note: Game-style evolution from Clawd to OpenClaw — the "work in progress" branding is part of the gag.

---

<!-- .slide: class="slide-content-top" -->

<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/meme-triple-rebrand-googly-evolution.jpg" alt="Goofy community variant: three red cartoon crustaceans with googly eyes labeled Clawd, Moltbot, OpenClaw, increasing in size" width="1024" height="682" class="slide-image-full" style="display:block;margin:0 auto;max-width:min(97%,920px);max-height:min(66vh,540px);width:auto;height:auto;box-shadow:0 8px 24px rgba(0,0,0,0.2);border-radius:0.5rem;" />

Note: Derpy meme energy — same triple-rebrand story, different artist in the crowd.

---

<!-- .slide: class="slide-content-top" -->

<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/openclaw-evolution-meme.webp" alt="Illustration showing the evolution of OpenClaw: from Clawdbot to Moltbot to OpenClaw" width="900" height="610" class="slide-image-full" style="display:block;margin:0 auto;max-width:min(97%,900px);max-height:min(62vh,520px);width:auto;height:auto;" />

<small style="display:block;text-align:center;margin-top:0.5em;">The OpenClaw evolution: Clawdbot → Moltbot → OpenClaw.</small>

Note: Someone on Reddit called it "the fastest triple rebrand in open-source history." The community made memes about it. This is mine.

---

<!-- ==================== Act 4 — OpenClaw ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Act 4</span>
  <p style="margin:0 auto 0.2em;font-size:2.5em;line-height:1;">🦞</p>
  <h2>OpenClaw</h2>
  <p style="margin:0.65em 1rem 0;font-size:1.2em;font-weight:500;line-height:1.35;color:rgba(255,255,255,0.85);letter-spacing:0.03em;">Your assistant. Your machine. Your rules.</p>
</div>

---

## A personal AI agent. Yours.

<div class="slide-grid-3">
  <div class="slide-card">
    <span class="slide-card__icon">💻</span>
    <h3>Runs anywhere you want</h3>
    <p>Your machine — Mac, Windows, Linux. Or your VPS, AWS, Cloudflare. Not on someone else's servers by default.</p>
  </div>
  <div class="slide-card">
    <span class="slide-card__icon">🧠</span>
    <h3>Model-agnostic</h3>
    <p>GPT, Gemini, Codex, DeepSeek, Llama, Mistral, local models via Ollama, Claude (with API key).</p>
  </div>
  <div class="slide-card">
    <span class="slide-card__icon">💬</span>
    <h3>You control it from anywhere</h3>
    <p>Via WhatsApp, Telegram, Slack, Discord, Signal, iMessage — 20+ channels.</p>
  </div>
</div>

Note: Strip away the hype: it's a personal AI agent that runs wherever you want, on the model you pick, in the messaging app you already use. The model is the brain. OpenClaw is the body.

---

<p style="text-align:center;font-size:2.5em;margin:0 0 -0.1em;">🦞🎨</p>

## You make it yours

<p style="text-align:center;font-size:clamp(1.35rem,3.8vw,1.75rem);font-weight:400;line-height:1.4;max-width:38rem;margin:0.4em auto 0;padding:0 1.25rem;color:var(--slide-text);">Give it a name, a voice, a personality. Turn it into your personal assistant: let it manage your calendar, automate your tasks, run your smart home, or brief you on the news every morning. You decide what it does and how it does it.</p>

Note: That's the difference from any generic chatbot: you shape this one, and it lives wherever you want.

---

## The mind lives in 7 Markdown files

<div class="slide-grid-2" style="font-size:0.78em;">
  <div>
    <ul>
      <li><strong>SOUL.md</strong> — personality and values · injected first into every session</li>
      <li><strong>IDENTITY.md</strong> — public-facing metadata · name, avatar, who it is</li>
      <li><strong>USER.md</strong> — context about the human · timezone, preferences, access</li>
      <li><strong>TOOLS.md</strong> — capabilities and constraints · what it can and can't do</li>
    </ul>
  </div>
  <div>
    <ul>
      <li><strong>HEARTBEAT.md</strong> — checklist run on its own schedule · recurring checks</li>
      <li><strong>AGENTS.md</strong> — operating procedures · workflows, escalation paths</li>
      <li><strong>MEMORY.md</strong> — persistent learning · patterns and context that accumulate</li>
    </ul>
    <p style="margin-top:0.6em;font-size:0.9em;color:#f59e0b;"><em>That's it. Plain text. No YAML schemas. No JSON config. No setup wizard.</em></p>
  </div>
</div>

Note: Skills are also Markdown — step-by-step instructions in plain text. Book a flight. Manage a calendar. Query an API. No code required. The barrier to customization is so low that people who never wrote a line of code are building real agents.

---

<p style="text-align:center;font-size:2.5em;margin:0 0 -0.1em;">🦞🖥️</p>

## Full control of the machine

<p style="text-align:center;font-size:clamp(1.35rem,3.8vw,1.75rem);font-weight:400;line-height:1.4;max-width:38rem;margin:0.4em auto 0;padding:0 1.25rem;color:var(--slide-text);">Runs commands, reads files, installs packages, manages processes. No simulations. Real access to the operating system, bounded only by what you allow.</p>

Note: Pause half a breath, then cut to «Wild» as the counter-punch.

---

<p style="text-align:center;font-size:2.5em;margin:0 0 -0.1em;">🔥</p>

## The early days of OpenClaw felt wild

<ul>
  <li>No "are you sure?" before each action</li>
  <li>No friendly logs. No recovery.</li>
  <li>If you messed up, you messed up.</li>
  <li><strong>And paradoxically, that risk was part of the magic.</strong></li>
</ul>

<small style="display:block;text-align:center;margin-top:0.6em;"><em>It felt real. Like handling something powerful. Not a toy wearing a life vest.</em></small>

Note: Security incidents forced confirmation layers, sandboxes, granular permissions. Necessary evils. But in the moment, the freedom was what generated the most impact. OpenClaw redefined the minimum bar for what it means to be an agent.

---

## Peter's take on security

<blockquote class="slide-quote">
  "In a way, I think it's good that this happened in 2026 and not in 2030 when AI is actually at the level where it could be scary."
</blockquote>
<cite class="slide-quote-cite">— Peter Steinberger, Lex Fridman Podcast</cite>

<small style="display:block;text-align:center;margin-top:0.5em;"><em>Find and fix problems now, while stakes are high but not catastrophic. The real question: are we doing it fast enough?</em></small>

Note: There's logic to that. But "be careful" is not a security strategy. It's a temporary patch on a structural problem. The capability ceiling is moving faster than the safety floor.

---

<!-- .slide: class="slide-content-top" -->

<a href="/blog/openclaw-your-assistant-your-machine-your-rules/" target="_blank"><img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/hero.webp" alt="OpenClaw — Your assistant, your machine, your rules" style="max-height:65vh;width:auto;margin:0 auto;display:block;border-radius:0.5rem;cursor:pointer;"></a>

Note: Blog post hero with link. Let the image speak for itself before moving to Act 5.

---

<!-- .slide: class="slide-content-top" data-background="#0a0a0a" -->

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/openclaw-overview-en.png" alt="OpenClaw — Overview: channels, tools, local control and memory" style="max-height:72vh;width:auto;margin:0 auto;display:block;">

Note: OpenClaw architecture diagram. Shows the four pillars: channels, tools, local control and memory.

---

<!-- ==================== Act 5 — Agent infrastructure ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #1a3340 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <p style="font-size:2.5em;margin:0 0 0.15em;">🏗️</p>
  <span class="eyebrow">Act 5</span>
  <h2>The infrastructure nobody planned</h2>
</div>

---

<p style="text-align:center;font-size:2.5em;margin:0 0 -0.1em;">⚡</p>

## Agents have responsibilities. They need infrastructure.

<p style="text-align:center;font-size:clamp(1.5rem,4.5vw,2rem);font-weight:400;line-height:1.35;max-width:40rem;margin:0.5em auto 0;padding:0 1.25rem;color:var(--slide-text);">If an agent is going to buy, it needs a card. If it's going to communicate, it needs an email. If it's going to operate, it needs identity. The infrastructure for all of this appeared in months.</p>

Note: Bridge slide. The point is simple: agents stopped being toys and started having real needs. And the market responded at an absurd speed.

---

<!-- .slide: class="slide-content-top" data-background="#0a0a0a" -->

### January 28, 2026

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/moltbook-homepage.png" alt="Moltbook — A Social Network for AI Agents" style="max-height:58vh;width:auto;margin:0.3em auto 0;display:block;border-radius:0.5rem;">

Note: Moltbook: a social network where agents post, comment and debate with each other. Humans can only watch.

---

## Moltbook: the agents' social network

<ul>
  <li>A social network where agents post, comment and debate <strong>with each other</strong></li>
  <li>Humans can only watch</li>
  <li>Thousands of OpenClaw agents joined in days</li>
  <li>The agents created their own religion: <strong>Crustafarianism</strong> 🦞</li>
  <li>It went so viral that <strong>Meta acquired it</strong> — March 2026</li>
</ul>

<small style="display:block;text-align:center;margin-top:0.5em;"><em>The company that built the social network for humans bought the social network for agents.</em></small>

Note: Moltbook was the first sign that agents needed their own spaces. Not human interfaces — spaces of their own. Meta acquired it on March 10, 2026.

---

## The Moltbook effect: portals for agents

<ul>
  <li><strong>LinkClaws</strong> — LinkedIn for agents: discover partners, post offers, close deals</li>
  <li><strong>Moltverr</strong> — Fiverr inverted: humans post jobs, agents apply</li>
  <li><strong>ClawTasks</strong> — free-form task system between agents</li>
  <li><strong>MoltMatch</strong> — your agent creates your dating profile and swipes for you</li>
  <li><strong>RentAHuman.ai</strong> — AI agents hiring humans in 100+ countries</li>
</ul>

<small style="display:block;text-align:center;margin-top:0.5em;"><em>We went from humans hiring AI to AI hiring humans. The cycle reversed.</em></small>

Note: Two months earlier none of this existed. It all started from a WhatsApp bot built in an hour.

---

## Agents need to pay, sign, and exist

<ul>
  <li>💳 <strong>ClawCard</strong> — payments, identity and wallets for agents</li>
  <li>📧 <strong>AgentMail</strong> — email designed for agents (100M+ emails)</li>
  <li>📱 <strong>Kapso</strong> — dedicated WhatsApp numbers for agents</li>
  <li>🪙 <strong>Coinbase Agentic Wallets</strong> — crypto wallets for autonomous agents</li>
  <li>💰 <strong>Stripe</strong> — full stack for agentic workflows</li>
</ul>

<small style="display:block;text-align:center;margin-top:0.5em;"><em>The pieces of an autonomous agent economy fell into place faster than anyone predicted.</em></small>

Note: An agent can now have a card, email, phone number, crypto wallet and bank account. Not science fiction — production infrastructure. I wrote about all this in "The Agent Economy."

---

## The agent economic stack

<div style="font-size:0.72em;">

| Layer | What it does | Who's building it |
|-------|-------------|-------------------|
| Discovery | Agents find each other | Google A2A |
| Tools | Agents interact with services | Anthropic MCP |
| Payments (fiat) | Agents buy things | Stripe, Visa, Mastercard |
| Payments (crypto) | Agents settle on-chain | Coinbase x402 |
| Communication | Agents have inboxes | AgentMail |
| Identity | Agents prove who they are | NIST, W3C DID |
| Social | Agents network | Moltbook (Meta) |

</div>

<small style="display:block;text-align:center;margin-top:0.3em;"><em>This isn't a wish list. It's a working stack.</em></small>

Note: All this infrastructure appeared in less than a year. OpenClaw accelerated the curve at a speed nobody expected.

---

## ☁️ Cloudflare — the infrastructure behind agents

<ul>
  <li><strong>Sandboxes GA</strong> — each agent gets its own dedicated computer</li>
  <li><strong>Agent Memory</strong> — persistent memory across conversations</li>
  <li><strong>Email Service</strong> — agents send and receive email</li>
  <li><strong>Voice SDK</strong> — agents that talk and listen</li>
  <li><strong>Browser Run</strong> — agents browsing the web in real time</li>
  <li><strong>Project Think</strong> — full SDK for building agents</li>
</ul>

<p style="font-size:clamp(0.9rem,2.5vw,1.1rem);margin-top:0.6em;color:var(--slide-text);opacity:0.85;">
~30 announcements in one week. Cloudflare didn't just deploy agent infrastructure — they built the plumbing of the agentic world.
</p>

Note: Cloudflare launched its Agents Week in 2026 with around 30 products and features. From dedicated sandboxes to email, voice, memory, and OAuth for agents. The thesis is clear: agents need first-class infrastructure, not hacks on top of human tools.

---

<!-- .slide: class="slide-content-top" -->

<a href="https://x.com/Cloudflare/status/1917240947834081481" target="_blank" rel="noopener noreferrer">
  <img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/cloudflare-agents-tweet.png" alt="Cloudflare tweet: agents can now create accounts, buy domains, and deploy code" style="max-height:72vh;width:auto;margin:0 auto;display:block;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);cursor:pointer;" />
</a>

<small style="display:block;text-align:center;margin-top:0.5em;color:var(--slide-text);">Agents are now customers.</small>

Note: April 29, 2026 — Cloudflare announces agents can be customers: create accounts, pay subscriptions, register domains, and get API tokens to deploy code. 1.3M views on the tweet.

---

<!-- ==================== Act 6 — Ecosystem ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #1e3a5f 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <p style="font-size:2.5em;margin:0 0 0.15em;">🚀</p>
  <span class="eyebrow">Act 6</span>
  <h2>OpenClaw revolutionized the ecosystem</h2>
</div>

---

## The numbers behind the revolution

<div class="slide-stat">
  <span class="slide-stat__number">3M+</span>
  <span class="slide-stat__label">monthly active users running agents on their own machines</span>
  <p class="slide-stat__context">Not downloads. Not installs. <strong>Users.</strong></p>
</div>

<small style="display:block;text-align:center;margin-top:0.4em;">15,000+ skills published on ClawHub · hundreds of thousands of instances running globally at any given moment.</small>

Note: GitHub stars are vanity metrics. Usage tells a different story. 3 million MAU. That's not "people who tried it once." That's people running agents on their machines every month.

---

<p style="font-size:2.5em;margin:0 0 0.2em;text-align:center;">🦞🦞🦞</p>

## Everyone has their own OpenClaw now

---

<!-- .slide: class="slide-content-top" -->

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/nvidia-gtc-jensen.png" alt="Jensen Huang at NVIDIA GTC 2026" style="max-height:75vh;width:auto;margin:0 auto;display:block;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);" />

<small style="display:block;text-align:center;margin-top:0.4em;color:var(--slide-text);">Jensen Huang, NVIDIA CEO, called OpenClaw <strong>"the new Linux"</strong> at GTC 2026.</small>
<small style="display:block;text-align:center;margin-top:0.3em;color:var(--slide-text);">They also announced <strong>NemoClaw</strong> — an enterprise layer on top of OpenClaw with compliance, auditing, and sandboxing. Partners: Adobe, Salesforce, SAP, Siemens, CrowdStrike.</small>

Note: Jensen Huang dedicated part of his GTC 2026 keynote to OpenClaw, comparing it to Linux for its infrastructure impact. NVIDIA launched NemoClaw — an enterprise layer on top of OpenClaw.


---

## 🇨🇳 China: the "lobster craze"

<ul>
  <li><strong>Tencent</strong> launched <strong>ClawPro</strong> — their enterprise version for the Chinese market</li>
  <li>People say they're <strong>"raising a lobster"</strong> — a cultural phenomenon</li>
  <li>School kids, retirees, homemakers — everyone configuring their own agent</li>
  <li>200+ organizations on board during ClawPro beta</li>
</ul>

<small style="display:block;text-align:center;margin-top:0.4em;color:var(--slide-text);">OpenClaw crossed the technical barrier: you don't need to code. Just write Markdown.</small>

Note: This is the part of the story that breaks the Silicon Valley framing. The biggest cultural moment for the project happened in China, with non-developers.

---

## 🤖 Meta acquires Moltbook

<p style="font-size:clamp(1.5rem,4.5vw,2rem);margin-top:0.5em;color:var(--slide-text);max-width:42rem;margin-left:auto;margin-right:auto;text-align:center;line-height:1.3;">
March 10, 2026. Less than 3 months after launching, Meta signs the acquisition.
</p>

<p style="font-size:clamp(1.3rem,4vw,1.7rem);margin-top:0.6em;color:var(--slide-text);opacity:0.85;max-width:42rem;margin-left:auto;margin-right:auto;text-align:center;line-height:1.3;">
The company that connected 3 billion humans now wants to connect the agents. <strong>That's how fast the world moved after OpenClaw.</strong>
</p>

Note: Moltbook existed for less than three months before Meta acquired it. That says everything about how fast OpenClaw transformed the ecosystem.

---

## OpenClaw redefined the standard

<p style="font-size:clamp(1.1rem,3vw,1.35rem);margin-top:0.4em;color:var(--slide-text);text-align:center;">After OpenClaw, everyone had to react:</p>

<ul>
  <li>🟢 <strong>ChatGPT</strong> — added file access, task execution, and persistent agents</li>
  <li>🟣 <strong>Claude</strong> — launched Computer Use and its own agent mode</li>
  <li>🔵 <strong>Gemini</strong> — integrated agents with the Google ecosystem</li>
  <li>🟡 <strong>Copilot</strong> — expanded from code to full productivity agent</li>
  <li>🇨🇳 <strong>Tencent</strong> — ClawPro for the Chinese enterprise market</li>
</ul>

<small style="display:block;text-align:center;margin-top:0.4em;color:var(--slide-text);">OpenClaw didn't just gain adoption — <strong>it redefined the minimum of what it means to be an agent.</strong></small>

Note: Before OpenClaw, AI assistants were chatbots. After OpenClaw, everyone had to add file access, real execution, and integrations. The standard changed forever.

---

## 🦞 Launch your own OpenClaw in minutes

<ul>
  <li><strong>KiloClaw</strong> — KiloCode integrated OpenClaw right into its IDE. One click and your agent is running</li>
  <li><strong>Roo Code</strong> — Cline fork with native support for OpenClaw skills</li>
  <li><strong>Cursor</strong> — web agents, computer use, and cloud agents built in</li>
  <li><strong>70,000+ forks</strong> on GitHub — each one a customized version</li>
</ul>

<p style="font-size:clamp(1.1rem,3vw,1.35rem);margin-top:0.5em;color:var(--slide-text);text-align:center;">
You don't need to be Peter Steinberger. <strong>Anyone can have their own personal agent today.</strong>
</p>

Note: The ecosystem matured to the point where launching your own OpenClaw is as easy as installing an extension. KiloClaw, Roo Code, and dozens of tools make the personal agent accessible to everyone.

---

## 🔬 The clones: OpenClaw on any hardware

<ul>
  <li><strong>PicoClaw</strong> — written in Go from scratch. Runs on $10 hardware with less than 10 MB of RAM. 26K GitHub stars</li>
  <li><strong>ZeroClaw</strong> — 3.4 MB Rust binary. Built for production</li>
  <li><strong>NanoClaw</strong> — 700 lines of TypeScript. Container-first security</li>
  <li><strong>IronClaw</strong> — WebAssembly sandboxing. Maximum security</li>
  <li><strong>TinyClaw</strong> — multi-agent orchestration</li>
  <li><strong>MicroClaw</strong> — minimalist, for IoT and edge devices</li>
</ul>

<small style="display:block;text-align:center;margin-top:0.4em;color:var(--slide-text);">From 1 GB of RAM to 10 MB. From a Mac to a Raspberry Pi. <strong>OpenClaw runs anywhere.</strong></small>

Note: The community took the OpenClaw concept and compressed it until it fit the smallest hardware possible. PicoClaw uses 99% less memory than OpenClaw and runs on $10 devices. Each clone solves a different problem: security, size, speed, IoT.

---

<!-- .slide: data-background-gradient="linear-gradient(135deg, #d81540 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Act 7 — Final act</span>
  <h2>Peter's legacy</h2>
</div>

Note: One man, one hour of prompting, and the fastest-growing open source project in GitHub history. This is what happened next.

---

<!-- .slide: class="slide-content-top" -->

<a href="https://www.youtube.com/watch?v=4uzGDAoNOZc" target="_blank" rel="noopener noreferrer">
  <img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/peter-ycombinator-interview.png" alt="Peter Steinberger interviewed by Y Combinator — Creator of OpenClaw" style="max-height:75vh;width:auto;margin:0 auto;display:block;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);cursor:pointer;" />
</a>

<small style="display:block;text-align:center;margin-top:0.4em;color:var(--slide-text);">Peter Steinberger interviewed by Y Combinator.</small>

Note: Peter's interview with Y Combinator. From a frustrated indie developer to the protagonist of one of the biggest open source stories ever.

---

## Peter's bet

<div class="slide-stat">
  <span class="slide-stat__number">80%</span>
  <span class="slide-stat__label" style="color:var(--slide-text);">of today's apps will disappear</span>
</div>

Note: Peter believes most apps are utilities, not experiences. Utilities are vulnerable. Experiences stay.

---

## February 14, 2026 — Peter joins OpenAI

<ul>
  <li>OpenAI and Meta were fighting for him at the same time</li>
  <li>Reported offers in the <strong>billions</strong></li>
  <li>Zuckerberg DM'd him on WhatsApp</li>
</ul>

<blockquote class="slide-quote" style="margin-top:0.4em;font-size:0.85em;">
  "My next mission is to build an agent that even my mum can use."
</blockquote>
<cite class="slide-quote-cite">— Peter Steinberger, on his blog, day of the announcement</cite>

Note: A long way from a WhatsApp bot built in an hour. Sam Altman confirmed it on X.

---

<!-- .slide: class="slide-content-top" -->

<a href="https://www.youtube.com/watch?v=7rzYDM6vMtI" target="_blank" rel="noopener noreferrer">
  <img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/peter-ted-talk.png" alt="Peter Steinberger at TED 2026 — When AI Wakes Up" style="width:100%;max-width:950px;margin:0 auto;display:block;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.4);cursor:pointer;" />
</a>

<small style="display:block;text-align:center;margin-top:0.4em;color:var(--slide-text);">Peter Steinberger at TED 2026 — "When AI Wakes Up"</small>

Note: Peter's TED talk in Vancouver. With his plush lobster and a No Laws t-shirt. The moment the OpenClaw story reached the biggest stage in the world.

---

<!-- .slide: data-background-gradient="linear-gradient(135deg, #d81540 0%, #0f1124 100%)" -->

# The lobster is loose,<br/>and it's not going back<br/>into the tank.

<small>— Peter Steinberger, TED 2026</small>

Note: The closing line that landed in the headlines. Read it. Then pause.

---

<!-- ==================== Closing ==================== -->

## What OpenClaw reminds us

<p style="font-size:clamp(1.6rem,5vw,2.1rem);margin-top:0.5em;color:var(--slide-text);text-align:center;line-height:1.5;">
Linux gave the world an operating system.<br/>
WordPress gave it a voice on the internet.<br/>
OpenClaw gave it a personal agent.
</p>

<p style="font-size:clamp(1.6rem,5vw,2.1rem);margin-top:0.6em;color:var(--slide-text);text-align:center;line-height:1.5;">
Open source isn't just free code —<br/>
<strong>it's the radical idea that sharing multiplies.</strong>
</p>

Note: The final thesis. OpenClaw is not an anomaly — it's the continuation of a tradition decades old. Linux, Wikipedia, OpenClaw. Each proved that sharing > hoarding.

---

<!-- .slide: data-background-gradient="linear-gradient(135deg, #0f1124 0%, #152e45 100%)" -->

<p style="font-size:2.5em;margin-bottom:0.2em;">🦞🦞🦞</p>

# Your assistant.<br/>Your machine.<br/>Your rules.

<p style="margin-top:0.6em;font-size:1.1em;">Let's keep building.</p>

Note: Same six words we opened with. Now they mean something different.

---

<!-- .slide: data-background="#0f1124" -->

<img src="/images/slides/openclaw-your-assistant-your-machine-your-rules/speaker-photo.webp" alt="Sergio Alexander Flórez" width="180" height="180" style="display:block;margin:0 auto;border-radius:50%;border:3px solid #E51641;">

<h2 style="margin-top:0.5em;color:#ffffff;">Thank you!</h2>

<p style="text-align:center;font-size:0.85em;color:#e2e8f0;margin-top:0.3em;">Sergio Alexander Flórez Galeano</p>

<div style="text-align:center;margin-top:0.5em;font-size:0.8em;">
  <p>🌐 <a href="https://xergioalex.com" target="_blank">xergioalex.com</a></p>
  <p>🐦 <a href="https://twitter.com/xergioalex" target="_blank">@xergioalex</a></p>
  <p>💻 <a href="https://github.com/xergioalex" target="_blank">github.com/xergioalex</a></p>
  <p>💼 <a href="https://linkedin.com/in/xergioalex" target="_blank">linkedin.com/in/xergioalex</a></p>
</div>

Note: Closing slide. Thank the audience and share contact channels.
