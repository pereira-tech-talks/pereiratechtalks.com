# Writing Craft Guide

**Companion to [WRITING_VOICE_GUIDE.md](./WRITING_VOICE_GUIDE.md).**

Where the Writing Voice Guide covers **what the voice sounds like** (vocabulary, tone, anti-AI-slop patterns), this guide covers **how to build an article** — narrative structure, fact verification, refinement patterns, and the craft decisions that separate a rough draft from a publishable piece.

This guide was distilled from refinement sessions on actual long-form posts (particularly the extensive refinement of `2026-04-11_openclaw-your-assistant-your-machine-your-rules`) plus pattern analysis across the 10 most recent blog posts in the previous personal-blog era. Every rule here has a concrete origin in work that was accepted or rejected by an editor.

> **PTT v3.0.0 context:** Pereira Tech Talks now hosts content from multiple authors — community organizers, speakers, vertical leads, mentors, and guests. The craft principles here are **transferable** across authors: verification, narrative structure, pacing, redundancy detection, source attribution, and the bilingual quote pattern apply equally to a meetup recap, a Pereira Tech Day editorial, a Speaker School cohort update, and a personal essay. Where a section is specific to long-form personal essays (e.g., the OpenClaw case study in §19), read it as the canonical refinement playbook — the same moves apply when a community member writes a deep-dive. For community-mode adaptations (meetup recaps, edition recaps, speaker pages), see §21 below.

---

## 1. The Verification Principle (Non-Negotiable)

**Every factual claim must be verifiable. Every quote must have a source.** This is the single most important rule, and it's the one most likely to blow up a draft if ignored.

### What this means in practice

- **Every number** (stars, dates, revenue, user counts, percentages) needs to trace back to a source — a tweet, article, podcast transcript, official blog post, or public benchmark.
- **Every quote** (in italics or blockquotes) needs a link, either inline or in the sentence that introduces it.
- **Every historical claim** (Peter was born in 1986 in rural Austria; PSPDFKit was bootstrapped for 10 years) needs to be checkable against a primary source.
- **Every attributed opinion** (what Jensen Huang said, what Sam Altman announced) needs the exact quote verified against the original.

### The verification workflow

When drafting or refining:

1. **Draft first, verify second** — write the idea down, then go verify before shipping.
2. **Use web search aggressively** — treat any unverified fact as suspect until searched.
3. **Prefer primary sources** — the original tweet beats a blog post about the tweet; the podcast transcript beats a summary article; the official docs beat a third-party description.
4. **When sources conflict, cite the strongest one** — major outlets (TechCrunch, Bloomberg, Fortune, CNBC, VentureBeat, Wikipedia) over random SEO blogs.
5. **When a fact can't be verified, either soften the claim or remove it.** Never leave speculation disguised as fact.

### Real examples from the OpenClaw refinement

- **Removed an unverifiable number**: "44,000 skills on ClawHub" — couldn't confirm to the exact figure, softened to "over 15,000 skills as of March" (which was verifiable).
- **Corrected a date**: "August 2024" tweet → actually "November 2024" after checking the archive.
- **Corrected a false claim**: "The Agent Economy article was written before OpenClaw exploded" — user caught it, the article was after. Reworded to "an article that took shape precisely because OpenClaw was accelerating the curve."
- **Removed Anthropic from bidding war**: The article said Peter had competing offers from OpenAI, Meta, and Anthropic. Verification showed only OpenAI and Meta were bidding. Anthropic was the antagonist in the story, not a suitor.

### Signals a claim needs verification

- A specific number you "remember reading somewhere"
- A quote you can't produce the exact source for
- A date, dollar amount, or percentage
- A "X said Y" attribution
- A "for the first time" or "biggest ever" superlative
- Any claim that would make a reader say "really?"

---

## 2. Source Attribution Patterns

How to introduce facts and quotes so the reader knows they're real.

### Inline link attribution

The default. Fact stated in the sentence, link embedded in the key phrase:

> In [November 2024](https://steipete.me/posts/2025/finding-my-spark-again), he tweeted "We are so back" — his way of announcing that the burnout was over.

> In October 2021, [Insight Partners put EUR 100 million into PSPDFKit](https://techcrunch.com/2021/10/01/...).

### Named source + link

For quotes, name the source in the sentence and link:

> In his [interview with Lex Fridman](https://lexfridman.com/peter-steinberger/), he said: *"If you wake up in the morning, and you have nothing to look forward to, that gets very boring, very fast."*

> Peter [summed it up with a bitter line on X](https://x.com/steipete/status/2040209434019082522): *"Funny how timings match up..."*

### Multiple sources for heavy claims

When a claim is doing a lot of work, cite multiple sources by embedding links on different phrases:

> Lo más preocupante fue [ClawHavoc](https://www.koi.ai/...): una campaña coordinada donde [341 Skills maliciosos se distribuyeron a través de ClawHub](https://thehackernews.com/...) disfrazados como herramientas legítimas. [Eran malware puro — específicamente Atomic macOS Stealer](https://www.trendmicro.com/...), un programa diseñado para robar información sensible...

Three independent sources back up one claim about a security incident. Each link is on a different phrase, so the prose still reads naturally.

### Figure captions

Always cite sources in the `<figcaption>`, never just in the alt text:

```html
<figure>
<img src="/images/..." alt="..." width="..." height="..." loading="lazy" />
<figcaption>Peter Steinberger on X, January 27, 2026 — <a href="https://x.com/steipete/status/...">Original tweet</a>.</figcaption>
</figure>
```

Format: **[Author] [on Platform], [Date] — [Link]**.

---

## 3. Quote Handling

### The bilingual quote pattern (Spanish articles)

When quoting someone in English inside a Spanish article, keep the English original in italics and follow with the Spanish translation in parentheses:

> *"If you wake up in the morning, and you have nothing to look forward to, that gets very boring, very fast"* ("Si te levantas en la mañana y no tienes nada que esperar, te vuelves muy aburrido, muy rápido")

> *"I don't do this for the money. I want to have fun and have impact."* ("No hago esto por el dinero. Quiero divertirme y tener impacto.")

**Why this pattern**: it preserves the authenticity of the original (so the reader knows exactly what the person said) while making it accessible to readers who don't speak English. It also implicitly respects the reader's intelligence — you're not hiding the original.

### When to NOT translate in parentheses

- **Taglines and brand phrases** that are better left in English because they're part of an identity. Example: "Your assistant. Your machine. Your rules." — when used as a brand motif, keep it in English. Only translate when explicitly framing it as a translation.
- **Technical terms** that have no clean Spanish equivalent (LLM, MCP, agentic, harness). Use them in English as-is.
- **Short catchphrases** that work in English (don't translate "open source" or "skill").

### Quote placement

- **Inline italics for short quotes** (one sentence or less).
- **Blockquotes (`>`) sparingly** — reserve for quotes that are the central argument of a paragraph, not for every quotation.
- **Never invent a quote.** If you can't find the exact words, paraphrase and don't use quotation marks.

### Quote length

Keep quotes as short as possible while preserving meaning. If a quote has filler words, use ellipses (`...`) to trim. Don't rewrite someone's words — cut them or leave them.

---

## 4. Narrative Structure

### The bookend pattern

Strong long-form posts open and close with the same image, phrase, or idea. This transforms the article from a text that ends into a composition that culminates.

**Example from the OpenClaw post:**

- **Opening**: *"Your assistant. Your machine. Your rules."* — positioned as the project's tagline, with the thesis that "those six words captured something millions of people didn't know they wanted."
- **Closing**: The same six words appear again, this time without the English framing, as a mantra the reader has earned through the journey of the article.

**How to build one:**

1. Identify a phrase, metaphor, or image that captures the article's thesis.
2. Introduce it in the opening with full context (who said it, what it means).
3. Let the article do its work without repeating it.
4. Return to it in the closing — stripped of explanation, standing on its own. The reader completes the circle.

### The three-act structure (for narrative articles)

Long-form pieces work well as three acts:

- **Act 1 — The setup**: establishes the characters, the world, the problem. Personal anchors (memory, meetup conversation, observation). Ends with the inciting incident.
- **Act 2 — The exploration**: the middle, where the actual thing is explained. Technical content, examples, context. The longest act.
- **Act 3 — The meaning**: what this actually means. Author's opinion, stakes, call to curiosity.

The OpenClaw post uses this: origin story → what OpenClaw actually is + ecosystem → security and philosophical stakes → closing.

### Section transitions

Avoid abrupt jumps between sections. Use bridging sentences that acknowledge where we're going:

- "But the architecture is only half the story. The other half is..."
- "Strip away the hype and the star count and the drama, and what is OpenClaw?"
- "That's the context you need for what happened next."

These transitions function like scene cuts in a film — they tell the reader the perspective is shifting without forcing them to figure it out.

### Causal flow (effects after explanations, not before)

When an event has a cause, explain the cause BEFORE describing the effect. Otherwise the reader gets confused and has to re-read.

**Wrong order** (confusing):

> Peter paid $10K for a Twitter business account. [Then describes the scam.]

**Right order** (clear):

> [Describes the scam, the harassment, the impersonation.] The fix came at a price: $10,000 for an X business account.

Same facts, but the second version earns the "$10K" payoff because the reader already knows why it was necessary.

### Bridging after a narrative break

When you introduce a new beat, tie it back to what just happened:

> Y en medio de todo ese caos, Peter se dio cuenta de algo peor: Moltbot, como nombre, ya no tenía salvación.

"Y en medio de todo ese caos" is the bridge. It tells the reader: "I'm not changing subjects — I'm zooming in on the consequence of what we were just discussing."

---

## 5. Pacing and Rhythm

### Slow-build then explosion

When a story has a slow start and then a dramatic pivot, don't flatten the curve for the sake of the hook. Show the slow part, then let the explosion land.

**Real example from OpenClaw:**

The lazy draft said: *"Peter published it on GitHub, went to sleep, woke up with 9,000 stars."* That's false — the project was quiet for two months before going viral. The corrected version preserves the actual arc:

> At first, nothing extraordinary happened. A few hundred developers found it, tried it, starred it. Two weeks in, it had barely 2,000 stars — good for an indie project, nothing earth-shattering. Two months of slow, organic, almost silent growth.
>
> And then, in late January 2026, something snapped. The project went from niche curiosity to GitHub's dominant trend in a matter of days.

The correct arc is MORE interesting than the dramatized one. Never trade accuracy for momentum — the accurate version usually has better pacing anyway.

### Mixing sentence lengths

Short-punchy sentences next to longer-flowing ones create rhythm. Don't lock into one length.

> Nine thousand GitHub stars on day one. Sixty thousand in three days. Over 180,000 in two weeks. I've watched open-source projects grow for years, and I've never seen a trajectory even remotely close to this.

Four short declaratives, then one long sentence that extends breath and signals the author's reaction. The contrast is the rhythm.

### Em-dash usage

Em-dashes are a signature of this voice. Use them 1–2 times per 500 words. They serve three functions:

1. **Apposition / elaboration** — defines or clarifies a term: *"Codex, el agente de programación de OpenAI"*
2. **Contrast / correction** — signals a turn: *"Más de 500 libros publicados en su vida — pero la calidad y la visión."*
3. **Parenthetical aside** — inserts a thought without breaking flow: *"Y en medio de todo ese caos — con los estafadores acosándolo — Peter se dio cuenta..."*

Never decorative. Every em-dash should earn its place.

### Fragments for emphasis

Sentence fragments are allowed — in moderation — to land a point:

> Nine thousand GitHub stars on day one. Sixty thousand in three days. Over 180,000 in two weeks.

> Mac, Windows o Linux. No en los servidores de alguien más. Es open source, es gratis, y es tuyo.

> Bootstrapped desde el día uno. Sin inversión externa. Sin pitch decks. Sin rondas de financiación.

The fragment pattern works because the full context is in the surrounding sentences. A fragment in isolation feels broken; a fragment after setup feels punchy.

---

## 6. First-Person Voice

### Honesty over polish

The voice owns mistakes, uncertainty, and changing views. This is non-negotiable:

- **Own being wrong**: *"No estoy 100% seguro de que sea exactamente el 80%."* / *"I was right about the direction. I was wrong about the actors."*
- **Confess uncertainty**: *"I don't know where this goes. Nobody does."*
- **Admit compulsion**: *"I've caught myself on a weekend starting a personal project..."*
- **Share the moment of doubt**: *"when I first heard this described, I thought it sounded too simple."*

### The "I think" / "honestly" anchors

Some first-person anchors that appear repeatedly across posts:

- "I think..." (opinion, not claim)
- "Honestly..." (signaling vulnerability)
- "I'll be honest..." (same)
- "Looking back..." (retrospective framing)
- "I've been calling..." (labeling your own ongoing thought)
- "I remember..." (memoir mode)
- "I'm not sure..." (genuine uncertainty)

Use these to punctuate strong claims with humility. They work because they're earned — the rest of the article shows the author knows their stuff, so the admissions of doubt feel honest rather than false modesty.

### Vulnerability earns trust

The strongest hooks come from moments of genuine vulnerability. Peter's burnout, the confession of addiction to AI agents, the admission that "I didn't get it" about PreTeXt — these moments make the reader trust the narrator. Analytical voice is cheap; vulnerable voice is rare.

When writing about someone else, find the moment of vulnerability in their story and dwell there. Don't rush past it.

---

## 7. Internal Linking

### Link to your own posts organically

Internal links should feel like a conversation with a friend who knows their own back catalog. Not SEO, not footnotes — just natural reference.

**Good phrasings:**

- *"I wrote about this in [an article on Markdown as the agent lingua franca](/blog/aeo-markdown-for-agents)"*
- *"Escribí sobre esto en [La Economía de los Agentes](/es/blog/the-agent-economy) — un artículo que tomó forma porque OpenClaw estaba acelerando la curva"*
- *"Ya había escrito sobre OpenClaw en mi serie [Working with Agents](/es/blog/series/working-with-agents)"*
- *"As I mentioned [earlier in this series](/blog/from-programmer-to-orchestrator/)"*

**Bad phrasings (avoid):**

- "Check out my other article..." (feels like a plug)
- "See also: [link]" (footnote voice)
- "Read more here" (CTA voice)

### Link placement

Place internal links where the argument demands context that only the previous post supplies. Don't link for the sake of linking. If the reader can follow your argument without clicking, the link is decorative.

### Spanish vs English paths

- English posts link to `/blog/{slug}`
- Spanish posts link to `/es/blog/{slug}`
- Series pages: `/blog/series/{slug}` and `/es/blog/series/{slug}`

Never cross-link across languages. A Spanish post should only link to Spanish versions.

---

## 8. Images and Figures

### Always use `<figure>` + `<figcaption>`

Never use plain Markdown image syntax (`![alt](src)`) for in-body images. Always use the full figure pattern:

```html
<figure>
<img src="/images/blog/posts/{slug}/{filename}.webp"
     alt="Descriptive alt text that a screen reader would read aloud"
     width="1200"
     height="800"
     loading="lazy" />
<figcaption>Short caption with context — <a href="https://source-url">Source link</a>.</figcaption>
</figure>
```

Required attributes:
- `src` — relative path to optimized WebP
- `alt` — descriptive, not decorative; different from the caption
- `width` / `height` — actual dimensions, for CLS prevention
- `loading="lazy"` — for below-the-fold images

### The caption formula

**Figure captions are NOT alt text repetition.** They add context, attribution, or a pointed observation:

- *"Peter Steinberger on X, May 2025: 'When you get your spark back.' — [Original tweet](...)"*
- *"Google Trends, January 27, 2026: 'clawdbot' overtakes 'claude code' and 'codex.' Source: [The Pragmatic Engineer](...)"*
- *"Star history: OpenClaw vs React vs Linux. Source: [star-history.com](...)"*
- *"An agent demo needs 3 components. A production agent needs at least 11 engineering layers."*

Format varies, but every caption has:
1. A short descriptive anchor (who, what, when)
2. A source link when the image comes from somewhere else
3. Sometimes a pointed observation that reframes the image

### Figure tags need blank lines

A Markdown parser won't render links or italics inside HTML blocks without a blank line break. Always put a blank line BEFORE and AFTER a `<figure>` block:

```
Some prose that introduces the image.

<figure>
...
</figure>

More prose continuing the narrative.
```

Otherwise markdown in the next paragraph won't render correctly. This is a recurring bug — check it explicitly before publishing.

### Image conversion workflow

1. Drop the source image in the project root (e.g., `image.png`).
2. Copy it to the post directory: `public/images/blog/posts/{slug}/{descriptive-name}.png`.
3. Convert to WebP: `pnpm exec sharp-cli -i {input}.png -o {output}.webp --format webp`.
4. Remove the source PNG (keep only WebP).
5. Get dimensions: `node -e "const sharp=require('sharp'); sharp('{path}').metadata().then(m=>console.log(m.width,m.height))"`.
6. Write the figure tag with the actual width/height.

---

## 9. Redundancy Detection

After the first complete draft, read back specifically looking for redundancy. Sections that say the same thing twice are the single most common quality issue.

### Common redundancy patterns

1. **The meta-comment that duplicates the beat** — a paragraph that explains what the article is about, followed by the article actually doing that thing. Remove the meta.
2. **Acknowledging flaws twice** — "it's not perfect because X, Y, Z" in one section, then "it's not perfect because X, Y, Z" in another. Keep one.
3. **The recap that's already covered** — summarizing what we just said. If the reader just read it, they don't need the summary.
4. **The pivot repeated** — "but the direction is right" said once, then said again in different words. Once is enough.
5. **The quote said twice** — the same quote appearing in both the main body and in a callout. Pick one.

### How to fix

- Delete the weaker instance.
- If both have unique value, merge them into one stronger section.
- Move content to a different section if it serves the narrative better elsewhere.

### Real example

In the OpenClaw article, the original closing had TWO paragraphs acknowledging the flaws:

1. "Por eso existe esta serie. Porque creo que OpenClaw — con todas sus fallas, sus dramas, sus vulnerabilidades..."
2. "OpenClaw no es perfecto. Los problemas de seguridad son reales..."

Both were saying the same thing. Removed the first one (the meta-comment) because it broke narrative flow. The second did the job better because it was followed by a pivot.

---

## 10. Atemporal References

### Avoid time-anchored phrases that will age

Phrases like "last week," "yesterday," "this morning" age badly. Someone reading the article a month later hits a temporal dissonance.

**Bad:**
- *"Justo la semana pasada escribí sobre..."*
- *"Yesterday I saw..."*
- *"This morning I was reading..."*
- *"Just the other day..."*

**Good:**
- *"Escribí sobre esto en..."* (present perfect, timeless)
- *"I wrote about this in..."*
- *"I've been thinking about..."*
- *"When I was building X..."* (anchored to a specific project, not a specific day)

### When a date is load-bearing

If the date IS the point, use the actual date, not a relative one:

- *"On April 4, 2026, Anthropic blocked..."*
- *"The announcement came on February 14, 2026..."*

Absolute dates age fine. Relative dates ("recently", "last month") age badly.

### Tense for events that changed

When discussing something that was true at one point but has since changed, use past tense explicitly:

> OpenClaw **has had** serious security problems — and it still does, though fewer every week.

> The key difference from something like ChatGPT or Claude.ai — at least as they **were** back then — is that OpenClaw **had** "eyes and hands."

The tense signals that the landscape has shifted. It's a small word choice that saves the article from sounding out of date.

---

## 11. Spanish-Specific Craft

### Tuteo only, never voseo

The author uses Colombian Spanish with tuteo:

- ✅ "tú puedes", "tienes", "sabes", "vas"
- ❌ "vos podés", "tenés", "sabés", "vas"

### Words to avoid

These words feel too casual/unprofessional for this voice:

- **"Un tipo"** — too colloquial. Use "un desarrollador," "un ingeniero," "un founder" depending on context.
- **"Relay"** (when describing WhatsApp bridge) — use "bot de WhatsApp" or "puente con WhatsApp".
- **"Gigs"** (freelance tasks) — either translate ("trabajos cortos") or keep and explain ("gigs — trabajos cortos y puntuales, al estilo freelance").

### Foreign technical terms

When introducing an English technical term for the first time in Spanish, provide a brief Spanish explanation:

- *"un infostealer, un programa diseñado para robar información sensible de tu máquina"* (explaining infostealer)
- *"un cease-and-desist"* — this one is accepted in tech Spanish, but in more formal contexts use "una carta de cese y desista"

After first introduction, you can use the English term directly.

### Orthography is non-negotiable

All Spanish text MUST use correct diacritical marks. Before every publish, grep for common errors:

```bash
grep -rn 'pequeno\|tamano\|diseno\|espanol\|manana' src/content/blog/es/
grep -rn 'analisis\|numero\|codigo\|ejecucion\|version\|pagina\|titulo' src/content/blog/es/
```

Zero matches expected. If any are found, fix before publishing.

### English brand names and personal names

Never translate:
- Product names (OpenClaw, ChatGPT, Cursor, Claude Code)
- Brand taglines used as motifs ("Your assistant. Your machine. Your rules.")
- Personal names (Peter Steinberger, Sam Altman)
- Company names (Anthropic, OpenAI)

---

## 12. The Signature Closer

Almost every post ends with some variant of **"Let's keep building"** / **"A seguir construyendo"**.

### Canonical variants

- *"Let's keep building."* / *"A seguir construyendo."* (most common)
- *"Let's keep building. Carefully."* / *"A seguir construyendo. Con cuidado."* (when there's a warning)
- *"Let's keep building. Eyes open."* / *"A seguir construyendo. Con los ojos abiertos."* (when there's tension)
- *"Let's keep reading."* / *"A seguir leyendo."* (for book/literature posts)

### Why this works

- It's a **ritual**. Regular readers recognize it and feel included.
- It's **forward-looking**, not sentimental.
- It's **action-oriented** without being a marketing CTA.
- It's **short**, so it doesn't compete with the thematic climax.

### How to land it

Place it as the **final line of the article**, after the thematic punchline. The punchline does the emotional work; the closer does the ritual work. Don't combine them — give each its own beat.

**Structure:**

```
[Main argument / thesis paragraph]

[Short paragraph or single line with thematic punchline]

[Let's keep building / A seguir construyendo]
```

Example from the OpenClaw closing:

> ...The question now is how open we're going to let them be.
>
> Your assistant. Your machine. Your rules.
>
> Let's keep building.

Three beats. Question → mantra → ritual. Each stands alone; each lifts the next.

---

## 13. Article Openings

### What works

Analyzing the 10 most recent posts, openings fall into a few repeatable patterns:

1. **Personal memory anchor**: *"I didn't come to Isaac Asimov through books. I came through the movies."* (Asimov)
2. **Meetup / community scene**: *"One day we were chatting in the Pereira Tech Talks community..."* (Library of Tomorrow) / *"Recently, I was at a great Pereira Tech Talks meetup..."* (Permanent Hackathon)
3. **Observation statement**: *"In the last few months, I've noticed something..."* (Art of Directing Agents)
4. **Thesis + backstory**: *"At the end of 2025, during the last meetup of the year, I gave a talk..."* (Programmer to Orchestrator)
5. **Reaction to news**: *"It seemed like a normal day until I checked my feeds..."* (Claude Mythos)
6. **Callback to past work**: *"In 2018, I wrote an article about blockchain..."* (Agent Economy)
7. **Concept-first hook**: *"'Your assistant. Your machine. Your rules.' Six words..."* (OpenClaw) — this one uses a quoted phrase as the hook, then unpacks it.

### What to avoid

- **Generic hooks** like "In the ever-evolving world of AI..." or "Have you ever wondered...".
- **"Why I'm writing this" intros** that don't introduce the topic.
- **Conference-talk openings** like "Today I want to talk about..."
- **Long scene-setting** before getting to the point (two paragraphs is usually the max before the thesis).
- **Abstract propositions** without a concrete anchor — every opening should have a person, place, or moment.

### The first-paragraph test

After drafting the opening, read the first paragraph in isolation. Ask:

1. Would this make sense as a text to a friend?
2. Does it have a specific person, place, or moment?
3. Does it hint at the thesis without stating it explicitly?
4. Is there a hook that makes me want to read paragraph 2?

If any answer is no, rewrite.

---

## 14. Section Headers

### The pattern

Headers are **statements, not questions** in 80% of cases. When questions appear, they're genuine queries (*"Who was Isaac Asimov?"*), not rhetorical hooks (*"What Is Docker?"*).

### Good header formulas

- **"What X actually is"**: "What OpenClaw Actually Is" / "What Anthropic Actually Built"
- **"The X of Y"**: "The Art of Directing Agents" / "The Three Laws of Robotics"
- **"Why X matters"**: "Why This Matters" / "Why Asimov Is My Favorite Author"
- **Metaphors**: "The Pace Nobody Expected" / "The Shield: Defense Before the Attack"
- **Narrative beats**: "The Birth: From WhatsApp Bridge to Viral Phenomenon" / "The Triple Rebrand"
- **Direct labels**: "The Elephant in the Room: Security" / "The Corporate Wars"

### Headers should tease the content, not spoil it

*"The Triple Rebrand"* is better than *"Anthropic Forces a Name Change Due to Trademark Concerns"* — the first makes you want to read, the second gives away the punchline.

### Keep them short

Most headers are 2–5 words. Longer headers (up to ~10 words) are allowed when they contain a hook, but avoid anything that feels like a subtitle.

---

## 15. Refinement Patterns

These are the specific moves that came up repeatedly during the OpenClaw refinement.

### Turn vague metaphors into specific ones

- **Before**: *"OpenClaw se volvio viral"*
- **After**: *"El proyecto pasó de curiosidad de nicho a tendencia dominante de GitHub en cuestión de días"*

Specific verbs and comparisons beat abstract ones.

### Turn lists into rhythm

- **Before**: *"La mayoría de las apps solo gestionan datos. Si tu agente ya sabe qué comiste..."*
- **After**: *"¿Para qué abrir una app del clima cuando tu agente ya revisó el pronóstico...? ¿Para qué un gestor de tareas cuando tu agente ya lleva el control de todo lo que prometiste hacer? ¿Para qué abrir la app del banco cuando tu agente ya movió el dinero para cubrir el arriendo?"*

Three rhetorical questions in parallel create rhythm that a flat statement can't match.

### Turn hedging into conviction

- **Before**: *"No estoy 100% seguro de que sea exactamente el 80%."*
- **After**: *"Y si miras con atención todo lo que ya está pasando, la dirección apunta a que no va a ser el 80%. Probablemente va a ser más."*

The second version reverses the hedge into a stronger claim. Use this when the evidence actually supports the stronger version.

### Add "según" / "according to" for attribution

Any time you cite a number or fact, name the source in the prose:

- *"según los reportes del proyecto, OpenClaw pasó los 3 millones de usuarios activos mensuales"*
- *"according to the project's own reporting, over 3 million monthly active users"*

This is stronger than just linking because it tells the reader the source is the project itself, not an independent claim.

### Break abstract claims with concrete details

- **Before**: *"OpenClaw tiene buenos números de adopción."*
- **After**: *"70,000 forks. 14,000 commits. 1,200+ contribuidores. La gente no forkea un repo por moda. Lo forkea porque lo usa."*

Specific numbers + a declarative follow-up beat any general claim.

### Replace clichés with fresh imagery

Clichés to watch for:
- "El genio salió de la botella" (used this, then replaced)
- "Un antes y un después"
- "La punta del iceberg"
- "El elefante en la habitación" (sometimes acceptable, often lazy)
- "Cambiar el juego" / "game-changer"
- "La fórmula mágica"

When you catch yourself reaching for one, try to describe the thing specifically instead.

---

### Making technical content accessible (from the agentic-web refinement)

The posts on this blog are technical by default. But the target reader isn't only a Cloudflare employee or an agent-standards spec author — it's anyone curious enough to open the post. These are the patterns that came out of refining the agentic-web post so that a dense 31-product roundup reads as a story, not as vendor documentation.

#### Describe-before-name for technical lists

When listing products by name, describe what each one *does* before naming it. The product name becomes the label, not the definition.

- **Before**: *"Los agentes ahora tienen un computador (Sandboxes), un motor de orquestación (Workflows v2), una capa de inferencia (AI Platform + Infire + Unweight), memoria persistente (Agent Memory)..."*
- **After**: *"Ahora el agente tiene casi todo lo que tendría un humano frente a un computador: un espacio donde instalar cosas y ejecutarlas (Sandboxes), un motor que coordina sus tareas (Workflows v2, Project Think), una capa para pensar (AI Platform + Infire + Unweight), memoria que persiste entre conversaciones (Agent Memory)..."*

The "Before" version asks the reader to already know what "orchestration engine" or "inference layer" mean. The "After" version translates each into a human-scale action first, then names the product.

#### "Traducción:" bridge after technical paragraphs

After a dense technical paragraph, add a one-sentence restatement in human language. Start it with `Traducción:` / `Translation:` as an explicit signal.

- **Example**: *"Managed OAuth for Access y los nuevos formatos de tokens le dan a los agentes credenciales reales y revocables. Cloudflare Mesh les da una red privada… Enterprise MCP + Code Mode muestra el patrón para colapsar 52 herramientas en 2 portales. **Traducción: el agente ya puede entrar como un usuario más, con permisos auditables.**"*

The Traducción line lets the reader skip the density if they want, while still understanding the consequence. It also serves readers who are scanning — they catch the takeaway without parsing every term.

#### Concrete analogies for unavoidable jargon

When you can't avoid a jargon term (Huffman coding, OAuth, RDMA), pair it with a familiar analogy inline. Don't make the reader jump to a definition.

- **Before**: *"La técnica es codificación Huffman aplicada a la representación interna de los pesos del modelo (el formato BF16, que es el que usan la mayoría de LLMs actuales)."*
- **After**: *"La técnica es codificación Huffman — el mismo truco de compresión sin pérdida que usa un `.zip` — aplicada a la representación interna de los pesos del modelo (el formato BF16, que es el que usan la mayoría de LLMs actuales)."*

One em-dash aside with a universal reference (`.zip`, `HTTPS`, `DNS`) is enough. The reader who knows Huffman skims it; the reader who doesn't walks away with a mental hook.

Other examples from the same post:
- *"plomería pública de la web — como el HTTPS, como el DNS"* (instead of leaving "plomería pública" abstract)
- *"credenciales reales y revocables, del mismo tipo que usa un humano"* (instead of leaving OAuth implicit)
- *"sin necesitar un servidor puente"* (explains Mesh's value in 4 words)

#### Credit known standards bodies with familiar anchors

When citing formal bodies like IETF, WHATWG, or W3C, add a short reminder of what those bodies are famous for. The reader who knows skips it; the reader who doesn't gets anchored.

- **Before**: *"estándares reales que pertenecen a los organismos oficiales de la web (IETF y WHATWG)"*
- **After**: *"estándares reales que pertenecen a los organismos oficiales de la web (IETF y WHATWG) — los mismos que en su día definieron HTTP y HTML"*

The appositive ("los mismos que…") costs six words and buys universal readability.

#### Specific subjects in closers

Closers that rely on abstract subjects ("the web", "the ecosystem", "the industry") land flat. Replace with a specific collective that includes the reader.

- **Before**: *"gane o pierda, la web queda mejor."*
- **After**: *"gane o pierda, los que construimos en la web salimos ganando."*

"La web" is a concept. "Los que construimos en la web" is a group the reader belongs to — and uses the first-person plural to pull them into the sentence.

#### "Why this matters" closer per section

After a long technical list, add a short sentence that tells the reader what to take away. One line is enough. It changes the list from a dump into a claim.

- **Section 1 closer**: *"Es un stack entero, no un feature suelto."* — names the thesis after the list.
- **Section 3 closer**: *"Si estos estándares funcionan, dejan de ser producto de Cloudflare y pasan a ser plomería pública de la web — como el HTTPS, como el DNS."* — makes the consequence concrete.

Without these, the reader finishes the list and doesn't know what you wanted them to think. With them, the list has a point.

#### Narrative openers over imperative jargon

Section openers that sound like API commands ("Apila la semana en tres capas") are efficient but cold. An inviting framing costs 5–10 extra words and lets the reader in.

- **Before**: *"Apila la semana en tres capas."*
- **After**: *"Si miras la semana en conjunto, no son 31 productos sueltos. Son tres movimientos encadenados."*

The "After" version does three things the "Before" doesn't: frames the perspective, sets up a contrast ("no son X, son Y"), and establishes stakes ("encadenados" implies logic). A one-sentence upgrade changes the voice of the whole section.

---

## 16. Paridad EN/ES (Mandatory)

Every edit applies to BOTH language versions. This is mandatory per project conventions.

### The paridad workflow

1. When refining a section, apply the change to ES first.
2. Immediately grep for the equivalent phrase in EN.
3. Apply the matching change.
4. Verify both sections are structurally identical (same paragraph count, same figures, same headers).

### When they diverge temporarily

If one version has content the other doesn't yet (a new section, a new quote, a new figure), mark it explicitly and add to the other within the same session. Never ship with paridad broken.

### Translation guidance

- Translate **ideas**, not words. A literal translation often reads awkwardly.
- Spanish is **not a second-class version**. It should read natively, not like a translation.
- Use Colombian phrasings where they feel natural.
- Technical terms stay in English (LLM, API, framework).
- Quoted English phrases stay in English with a Spanish translation in parens (see Quote Handling section).

---

## 17. Pre-Publish Craft Checklist

Before marking an article as done, run through this:

### Content quality
- [ ] Every factual claim has a source or is clearly the author's opinion
- [ ] Every quote has an attribution link
- [ ] No temporal references that will age ("last week", "yesterday")
- [ ] No unverified numbers
- [ ] No clichés slipped through
- [ ] Every specific number has context or comparison

### Structure
- [ ] Opening hook passes the "text to a friend" test
- [ ] Sections don't repeat the same beat
- [ ] Causal flow is right (cause before effect)
- [ ] Closing includes the signature closer
- [ ] Bookend connection if applicable (opening and closing mirror)

### Markup
- [ ] All images use `<figure>` + `<figcaption>` with alt, width, height, loading="lazy"
- [ ] Blank lines before and after every `<figure>` block
- [ ] Internal links use relative paths (`/blog/slug` or `/es/blog/slug`)
- [ ] External links use full URLs

### Paridad
- [ ] EN and ES versions have matching structure
- [ ] Same figures in both
- [ ] Same headings (translated)
- [ ] Spanish diacritical marks verified
- [ ] Spanish uses tuteo throughout
- [ ] No "un tipo" in ES (use "desarrollador" etc.)

### Verification
- [ ] All sources are reachable (no broken links)
- [ ] Primary sources preferred over summaries
- [ ] Dates verified against original announcements

### Build
- [ ] `pnpm run biome:check` passes
- [ ] `pnpm run build` succeeds
- [ ] No placeholder content (`[TODO:`, `[AUTHOR:`, etc.)

---

## 18. How to Handle Corrections Mid-Refinement

When the author points out a factual error or a voice issue:

1. **Never defend the draft** — accept the correction and move on.
2. **Apply the change to both EN and ES in the same edit session**.
3. **Check for ripple effects** — if a fact is wrong, it might be wrong in multiple places.
4. **Re-verify the corrected version** — don't just replace one wrong claim with another.
5. **Note it for the pre-publish checklist** — "verify Madrid ticket" etc.

Corrections usually reveal a pattern. If the author says "this sounds too colloquial," don't just fix the one instance — grep the article for similar issues and fix all of them in one pass.

---

## 19. Case Study: The OpenClaw Refinement

This article went through ~80 rounds of refinement before shipping. The specific issues that came up, and how they were resolved, are the source material for much of this guide. Key lessons:

1. **Facts drift if not verified** — initial draft said "Peter had offers from OpenAI, Meta, and Anthropic" — Anthropic was never a suitor. Verification caught it.

2. **The opening needs several iterations** — started with a personal "I got a GitHub notification" hook, changed to a philosophy-first hook ("Your assistant. Your machine. Your rules."). The second version was better because it made the article feel about the idea, not about the author discovering the idea.

3. **Redundancy shows up everywhere** — two sections acknowledging flaws, two mentions of Jensen Huang, two mentions of Sam Altman, an entire section ("Los números que cuentan la historia") that duplicated content already in other sections. All removed or consolidated.

4. **Temporal accuracy matters** — "he published it and went to sleep and woke up with 9,000 stars" sounds great but was false. The actual timeline — two months of slow growth, then explosion — turned out to be MORE interesting than the compressed version.

5. **Images earn their place** — every image added (star-history charts, tweets, Google Trends) came with a clear narrative purpose. The images aren't decoration; they're evidence.

6. **Spanish required active maintenance** — words like "un tipo", "relay", "gigs" kept appearing in early drafts and had to be replaced. "Colloquial but accurate" became the mental model.

7. **The closing went through 4 versions** — the original was a sentimental recap, the second tried a "genie out of the bottle" metaphor, the third used a statistical anchor ("hundreds of thousands of machines running OpenClaw"), and the final landed on a bookend to the opening. Each version was stronger than the last.

8. **The user's feedback is the signal** — when something "didn't feel right" but the user couldn't articulate why, the issue was usually either redundancy, a temporal reference, a cliché, or a factual drift. Check those four first.

---

## 20. When to Break These Rules

All of this is guidance, not law. Reasons to deliberately break a rule:

- **Pacing** — sometimes a cliché is the right choice because it's familiar shorthand.
- **Voice consistency** — if the rule would make the article sound less like the author, ignore the rule.
- **Reader experience** — if a fact check takes the reader out of the narrative flow, move the source to the Resources section instead of inline.

The rules exist because they come from concrete mistakes that had to be fixed. But the goal is always a good article, not a compliant one.

---

## 21. Community-Content Adaptations (PTT v3.0.0)

The principles above were forged on long-form personal essays. Most PTT content is shorter, faster, and community-attributed. Here is how the same craft applies, adapted.

### 21.1 Meetup recap (600–1,200 words)

- **Verification is the same**: every speaker name, attendee name, attendance count, and venue must be checkable.
- **Opening**: a scene, one sentence. Not a roster. ("On March 14 we packed Sala 3 of UTP — 60 builders, four talks.")
- **Structure**: Scene → talks (one paragraph each, with the speaker's actual claim, not a topic label) → impromptu moments → forward-looking close.
- **Quotes**: one speaker quote and one attendee quote. Short. Linked to source if from social media after the meetup.
- **Figures**: optional, but if used, follow the `<figure>` + `<figcaption>` pattern from §8 with photo credit in the caption.
- **Closer**: forward-looking, concrete date for next meetup if known. The `Let's keep building` ritual closer (§12) is optional for recaps.

### 21.2 Pereira Tech Day edition recap (1,500–3,000 words)

- The edition page (`/pereira-tech-days/{year}`) is the **journalistic record**: timestamps, talks, attendance, sponsors. Not a narrative.
- The blog recap that follows is **reflective**: what worked, what broke, what we learned. Three-act structure (§4) applies cleanly.
- The bookend pattern (§4) works well: open with the moment that captured the day; close on the same moment one year later when announcing the next edition.
- Use the per-edition brand kit only **inside** the edition route. Recaps that live on the blog use the global PTT voice and brand.

### 21.3 Speaker deep-dive (long-form, single author)

- The speaker writes their own deep-dive in their voice, with full first-person singular.
- All the long-form craft applies: verification (§1), source attribution (§2), three-act structure (§4), pacing (§5), figures (§8), redundancy detection (§9), atemporal references (§10), Spanish-specific craft (§11), the signature closer (§12), opening patterns (§13), header patterns (§14), refinement patterns (§15), accessible technical writing (§15.x), bilingual parity (§16), pre-publish checklist (§17).
- Editor's role: enforce the checklist, not rewrite the voice.

### 21.4 Vertical update (Speaker School, La Biblioteca del Mañana, AI Channel)

- Status-of-the-program register: cohort dates, focus, shipped work, how to join.
- 400–800 words.
- Plural voice ("we ran cohort 03"). First-person singular only when one organizer is sharing their experience running the program.
- Closer: a concrete next step for the reader (apply for cohort 04, register for the next session).

### 21.5 Personal essay (single author, opinion-led)

- Long-form personal essays follow the full craft guide as written. The OpenClaw case study (§19) is the canonical example.
- The byline must be the individual author, not Pereira Tech Talks. This is how the reader knows it's first-person opinion and not the community speaking.
- Hot takes are allowed; unverified facts are not.

### 21.6 Editor's adaptation rule

When an editor receives a draft from a community contributor:

1. **Verify first** (§1). Every claim, every number, every quote.
2. **Voice second** (see [WRITING_VOICE_GUIDE.md](./WRITING_VOICE_GUIDE.md)). Do not flatten the author's voice. Apply only the anti-AI-slop blocklist and the orthography rules.
3. **Bilingual parity third** (§16). Spanish first if possible.
4. **Figures and markup last**. The author writes prose; the editor adds the `<figure>` markup and image dimensions.

The editor's job is to make the post publishable, not to rewrite it.

---

## References

- **[Writing Voice Guide](./WRITING_VOICE_GUIDE.md)** — The voice companion to this craft guide. Covers vocabulary, anti-AI-slop patterns, and tone.
- **[Standards Guide](./STANDARDS.md)** — Orthography rules, import order, and project-level standards.
- **[I18N Guide](./I18N_GUIDE.md)** — Full multilingual content rules.
- **[Blog Posts Feature Guide](./features/BLOG_POSTS.md)** — File naming, frontmatter schema, hero layouts.
- **[Content Writer Agent](../.agents/agents/content-writer.md)** — The agent that uses this guide.
- **[add-blog-post skill](../.agents/skills/add-blog-post/)** — The scaffolding skill for new posts.

---

**Last updated:** 2026-05-31
**Origin:** Distilled from the OpenClaw refinement session + pattern analysis across 10 recent posts. Adapted for Pereira Tech Talks v3.0.0 multi-author community context (§21).
