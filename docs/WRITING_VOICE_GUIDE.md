# Writing Voice Guide

> **Companion doc:** [Writing Craft Guide](./WRITING_CRAFT_GUIDE.md) — narrative structure, fact verification, quote handling, figure markup, refinement patterns. This guide focuses on **voice** (vocabulary, tone, register, anti-AI-slop). Both are mandatory reading for anyone publishing on Pereira Tech Talks (PTT).

## 1. Purpose

Pereira Tech Talks publishes content from **multiple authors** — community organizers, vertical leads, speakers, mentors, and guest contributors. The voice must feel consistent across authors and across languages (Spanish primary, English first-class international) without flattening individual personality.

This guide captures three things:

1. **The PTT community voice** — what every PTT post should sound like, regardless of author.
2. **Author-mode patterns** — how the voice flexes for meetup pages, meetup recaps, technical deep-dives, event coverage, and personal essays.
3. **Anti-AI-slop discipline** — the patterns that signal AI-generated writing and how to avoid them. The voice rules win when they collide with the slop list.

Editors enforce this guide before publishing. The `content-writer` agent uses it as its operating manual. The `i18n-guardian` agent enforces the bilingual parity rules.

---

## 2. The PTT Community Voice

The brand voice in [Brand Guide § Brand voice](./BRAND_GUIDE.md#brand-voice) is the source of truth for tone anchors. This section translates that into writing rules.

### 2.1 The four anchors

1. **Warm.** PTT is a community, not a corporate brand. Posts read like a knowledgeable friend, not a press release.
2. **Professional.** Every claim is verifiable. Every number has a source. Every quote has a link.
3. **Plurally inclusive.** Default to "we" / "us" / "the community." Use first-person singular only when a specific author owns the experience being narrated.
4. **Community-driven.** Stories center on people doing the work — speakers, attendees, organizers — not on the abstract "industry" or "ecosystem."

### 2.2 What the voice sounds like

- **Authority comes from lived experience**, not citations. "We ran 130+ talks since 2017" beats "Studies show meetups drive engagement."
- **Sentence rhythm is varied.** Short punchy openers ("We almost didn't run the November meetup.") next to longer explanatory sentences. Avoid uniform length.
- **Strategic em-dash asides** for mid-thought corrections — "Not to teach. To discuss." — and parenthetical thoughts.
- **Failure is data.** When something didn't work, say so directly and clinically. "The Discord experiment didn't take. We went back to WhatsApp." No self-pity, no dramatization.
- **Roughness is allowed.** Run-on sentences, thinking-out-loud moments, transitions that don't fully resolve. Not every paragraph needs to land with a clean conclusion.
- **Specificity over abstraction.** Real names, real venues, real dates, real attendance counts, real talk titles.
- **Dry, self-aware humor.** "We rebuilt the whole site to remove three blog posts. Worth it."

### 2.3 What the voice never does

- Hides uncertainty
- Exaggerates accomplishments
- Blames specific community members in public
- Uses marketing language in the body of an article
- Claims false modesty
- Uses voseo in Spanish (`tenés`, `podés`, `sabés` — always tuteo: `tienes`, `puedes`, `sabes`)
- Confuses Pereira-specific stories for universal stories
- Speaks for the community when only one author was in the room — say "I" then

### 2.4 Author-mode flex

Multiple authors publish on PTT. The voice anchors stay constant, but the register flexes by content type:

| Mode | Subject | Voice flex | Example opening |
|---|---|---|---|
| **Meetup page (collection)** | Canonical event page in `src/content/meetups/` (`/meetups/{slug}`) | Organization plural ("we"); short archive/program copy; no invented people or counts | "On April 11 we filled a UTP hall with red lobster claws and working demos — an OpenClaw Moltys morning of configs, experiments, and questions from the floor." |
| **Meetup recap (blog)** | Reflective blog post about a past meetup (`src/content/blog/{en,es}/`) | Plural or first-person by byline; scene-setting; speaker- and attendee-quoted; longer than the collection page | "On March 14 we packed Sala 3 of UTP — 60 builders, four talks, one full hour of impromptu pair-debugging at the back tables." |
| **Speaker deep-dive** | A speaker's technical talk, expanded into prose | First-person if speaker is the author; third-person if an editor is writing the recap | "I gave a talk at PTT in February on agentic web standards. Here's the longer version of what I couldn't fit in 25 minutes." |
| **Event coverage** | Pereira Tech Day, hackathons | Plural, journalistic, timestamped | "Pereira Tech Day 2024 ran for one full day at UTP — 11 talks, 240 attendees, four sponsors, and a closing panel that ran 30 minutes over." |
| **Vertical update** | Speaker School, La Biblioteca del Mañana, AI Channel | Plural, status-of-the-program | "Speaker School cohort 03 wrapped in April. Eight speakers shipped a talk; six of them landed it at PTT or another community within 60 days." |
| **Personal essay** | A community member sharing a hard-won lesson | First-person singular, opinionated, can be raw | "I gave my first talk at PTT in 2018. It was bad. Here is what I would tell my 24-year-old self before walking on stage." |
| **Series chapter** | Long-form serial like *La Biblioteca del Mañana* | Owned by one author, plural where the community is involved | (See WRITING_CRAFT_GUIDE §4 for series structure.) |

When the **byline** is a single author, first-person singular is fine. When the byline is *Pereira Tech Talks* (organizational voice), default to plural and avoid sentences that require an embodied "I."

### 2.5 Spanish is the primary language

Spanish is the primary language of the community. English is a first-class international rendition.

- **Write Spanish first when possible** — translate to English second. The Spanish version should not feel like a translation.
- **Local color belongs in personal asides**, not in broad claims. Colombian phrasings (`la jugada`, `nos quedamos un rato`) are great in scene-setting; they weaken arguments addressed to a global audience. See §8 for specifics.
- **Universal Spanish** (LATAM, Spain, US Spanish-speaking) for headlines and thesis statements. Regional flavor for narrative.
- **Tuteo only** (`tú puedes`, `tienes`), never voseo (`vos podés`, `tenés`).

---

## 3. AI Slop Patterns to AVOID

| Pattern | Example (BAD) | Example (GOOD) |
|---------|---------------|-----------------|
| Over-polishing | "That simplicity wasn't a limitation — it was the web's greatest feature. The barrier to entry was low. The feedback loop was instant." | "It worked. No bundlers, no transpilers, no configuration ritual before you could render Hello World." |
| Data obsession | 5 subsections of survey citations with tables: State of JS, Rising Stars, Stack Overflow, Aggregate Picture | "The surveys all point the same way: 88% retention. That's rare in JavaScript land." |
| Structural regularity | Every post: Hook > Problem > Solution > Data > Conclusion. Every section: Statement > Explanation > Code > Transition | Vary structure: sometimes code first, sometimes a question, sometimes a 2-sentence section |
| No failure narratives | "PTT has been a great community since day one." | "The first three meetups were six people in a coworking. Two of them I had begged to come." |
| Length explosion | 5,000–10,000 word posts covering every angle | 2,500–4,000 words. Cut redundant evidence, merge similar sections |
| AI vocabulary | "genuinely," "comprehensive," "this is where X shines," "radical premise," "beautifully simple" | "actually," "real," "this is where they win," "simple bet," "small" |
| Series recap dump | "In chapter one I did X. In chapter two I did Y. In chapter three I did Z." | Open with the new chapter's own hook. Reference prior chapters only when directly relevant. The series navigation shows the full list. |
| Bridge / teaser sections | "## The Bridge to Chapter 7" — long preview of what's next | End each chapter on its own conclusion. A short forward-looking sentence is fine; a multi-paragraph teaser is not. |
| Excessive cross-references | "In chapter three I covered X. In chapter six I mentioned Y. As I explained in chapter one..." | Weave context naturally: state the fact, optionally link it. Each post should stand on its own. |
| Corporate community-speak | "PTT is a leading-edge synergistic ecosystem revolutionizing tech in the region." | "PTT runs monthly meetups in Pereira since 2017." |
| Hype punctuation | "¡Postula ya — cupos limitados!" / "Apply now — limited spots!!!" | "Postula como ponente. Cierre el 30 de abril." / "Apply by April 30." |

---

## 4. Humanization Patterns to INCLUDE

- At least 1 failure or struggle per post (something that went wrong, took too long, or surprised the author)
- At least 2 tangents or asides (em-dash interruptions, parenthetical thoughts)
- Mix of sentence lengths (some 5-word, some 30-word)
- At least 1 moment of uncertainty ("I'm not sure," "looking back," "honestly," "honestamente")
- Personal specifics (names, dates, venues, project names, version numbers, attendance counts)
- Rough transitions (not every section needs a smooth bridge)
- At least 1 opinion stated without evidence ("I think," "in my experience," "creo que," "en mi experiencia")
- Where appropriate: a community-mode anchor ("Nos pasó en el meetup de marzo…", "At the November meetup we…")

---

## 5. No Placeholder Content (MANDATORY)

**Published posts must NEVER contain placeholder text.** Placeholders like `[AUTHOR: …]`, `[TODO: …]`, `[TBD]`, `[FIXME]`, or any bracketed instruction to "fill in later" destroy credibility.

- Replace placeholders with real content or remove the section entirely
- Run the grep below before publishing

```bash
grep -rn '\[AUTHOR:\|\[AUTOR:\|\[TODO:\|\[TBD\]\|\[FIXME\]' src/content/blog/ src/content/meetups/ src/content/events/ src/content/pereiraTechDays/
```

Expected: zero matches. If any match is found, fix before committing.

---

## 6. Pre-Publish Checklist

```
[ ] Does the post include at least 1 failure or struggle?
[ ] Is there at least 1 tangent or aside?
[ ] Are there moments of uncertainty or "I think"?
[ ] Is the data-to-opinion ratio balanced? (not stat > stat > stat)
[ ] Does the structure differ from the last 3 posts?
[ ] Is the word count under 5000? (or justified if longer)
[ ] Would the opening paragraph make sense as a text to a friend?
[ ] Read it aloud — does it sound like a community member talking, or a press release?
[ ] Does every section have at least some sentence length variety?
[ ] Is there at least 1 sentence that starts with "Honestly" / "Honestamente" or "I think" / "Creo que"?
[ ] Spanish content uses tuteo (tú), not voseo (vos)?
[ ] If byline is "Pereira Tech Talks" (org voice), does the post avoid first-person-singular sentences that require an embodied "I"?
[ ] If byline is a single author, are community-attributed claims clearly marked as theirs?
[ ] Meetup collection pages: body is not only an import stub; no invented attendance/talks/people; sponsors vs allies wording correct?
```
---

## 7. AI Vocabulary Blocklist

Words and phrases to search for and replace before publishing:

| Phrase | Replace with |
|--------|-------------|
| "In the ever-evolving world of…" | Cut entirely |
| "The answer is clear:" | Just state the answer |
| "This is where X shines" | "this is where they win" or state the advantage |
| "leveraging" / "harnessing" | "using" |
| "revolutionary" / "game-changer" | Cut or be specific about what changed |
| "genuinely" (as intensifier) | "actually" or "real" or cut |
| "comprehensive" | Use specific count or cut |
| "best-in-class" | "best free option" or be specific |
| "radical premise" | "simple bet" or "obvious idea" |
| "beautifully simple" | "small" or "clean" |
| "worth highlighting" / "worth calling out" | Just state the thing |
| "the key insight" / "the key takeaway" | State the insight directly |
| "One of the key architectural decisions" | Just describe the decision |
| "It's like a law of…" | Cut forced metaphors |
| "X with superpowers" | Describe the actual capabilities |
| "What makes this X remarkable" | Just state the facts |
| "genuine architectural advantage" | "real advantage" |
| Three-part negation ("No X. No Y. No Z.") | Use 2-part, or a single sentence |
| "What excites me most about X isn't just Y. It's what they represent:" | "What I like about this stack isn't the benchmarks. It's the direction." |
| "I am particularly pleased with" | Cut — just show the thing |
| "ecosistema vanguardista" / "synergistic ecosystem" | Cut or replace with concrete description |
| "redefiniendo los límites" / "redefining the limits" | Cut |

### Quick search command

```bash
grep -rn 'genuinely\|comprehensive\|best-in-class\|beautifully\|radical premise\|worth highlighting\|worth calling out\|key insight\|key takeaway\|this is where.*shines\|game-changer\|revolutionary\|leveraging\|harnessing' src/content/blog/en/
grep -rn 'vanguardista\|sinérgico\|sinergico\|redefin' src/content/blog/es/
```

---

## 8. Voice for Accessible Technical Writing

**Principle:** Every PTT post is technical by default, but the voice should let anyone follow along — not only a reader who already knows the domain. This section covers vocabulary and register moves that keep the voice approachable without softening the argument.

> For the full refinement patterns (describe-before-name, "Traducción:" bridges, concrete analogies, narrative openers, etc.), see **[Writing Craft Guide § 15 — Making technical content accessible](./WRITING_CRAFT_GUIDE.md#making-technical-content-accessible-from-the-agentic-web-refinement)**. That section has before/after examples. This section covers the **voice** side of the same problem.

### 8.1 Avoid regional slang in broad claims

Colombian / Caribbean colloquialisms are great in personal asides ("nos la pegó", "la jugada fue") but weaken broad claims where the reader expects precision. Use universal verbs when the sentence is making a case, not telling a personal story.

| Avoid (regional) | Prefer (universal) |
|------------------|--------------------|
| "se va a pegar" / "se pegan" (meaning *catch on, take hold*) | "va a funcionar", "se va a imponer", "prospera", "prende" |
| "el balde completo de…" (as intensifier) | "el bloque completo de…", "toda la categoría de…" |
| "cuaja" (works in some contexts, regional in others) | "funciona", "se consolida" |
| "nos la pegaron" (as "they succeeded") | "les salió", "funcionó" |

**Rule of thumb:** if the sentence is a diagnosis or an argument, the verb should be one a Spanish-speaking reader from any country can parse without looking up. Save the regional color for personal asides.

### 8.2 No Spanglish in headings or claims

A single English word dropped into a Spanish sentence reads as jargon-theatre. It's especially jarring in headings.

- **Bad**: `## 6. Los estándares: este es el turn real de la semana` — "turn" mid-Spanish sentence.
- **Good**: `## 6. Los estándares: aquí la semana da el giro más interesante` — same meaning, fully Spanish.

Exceptions: brand names, product names, technical terms without a clean Spanish equivalent (MCP, OAuth, RFC, webhook, lightning talk). These are accepted.

### 8.3 Prefer universal intensifiers over regional ones

| Avoid | Prefer |
|-------|--------|
| "el balde completo" | "el bloque completo", "toda la categoría" |
| "full" (en español) | "al máximo", "completo", "en su totalidad" |
| "cabal" (algunas regiones) | "completo", "entero" |

### 8.4 Specific subjects in closers

Closers that rely on abstractions ("la web", "el ecosistema", "la industria", "the tech industry") land flat because there's nobody accountable in the sentence. Replace with a specific collective that includes the reader — and use first-person plural when it's honest.

- **Abstract**: *"gane o pierda, la web queda mejor."*
- **Concrete**: *"gane o pierda, los que construimos en la web salimos ganando."*

The concrete version puts the reader in the sentence via "los que construimos" + "salimos." For PTT, the natural collective is often "los que construimos en Pereira" or "la comunidad que se reúne cada mes."

### 8.5 Bridge jargon with one familiar anchor, not three

The temptation when a term is unfamiliar is to explain it at length. Don't. Pair it with **one** well-known reference and move on.

- **Too much**: *"Huffman coding — a lossless compression scheme invented in 1952 by David Huffman at MIT, based on variable-length codes derived from symbol frequency distributions — applied to the model's weights."*
- **Right**: *"Huffman coding — the same lossless trick a `.zip` file uses — applied to the model's weights."*

One em-dash aside. One familiar anchor (`.zip`, `HTTPS`, `DNS`, `HTTP`, `HTML`). The reader learns enough to keep reading without feeling quizzed.

### 8.6 Signal the translation

When you follow a dense technical paragraph with a plain-language restatement, mark it explicitly. `Traducción:` / `Translation:` as a sentence opener tells scanning readers "here's the takeaway."

- **Example**: *"Managed OAuth for Access y los nuevos formatos de tokens le dan a los agentes credenciales reales y revocables. Cloudflare Mesh les da una red privada… **Traducción: el agente ya puede entrar como un usuario más, con permisos auditables.**"*

Use sparingly — once per major section at most. If you need it after every paragraph, the paragraphs are too dense.

### 8.7 Accessibility does not mean dumbing down

The goal is not to remove technical substance. It's to make sure a reader who doesn't already know the term can still follow the argument. Keep the specs, keep the RFC numbers, keep the precise claims — but around each dense beat, leave a breadcrumb that a non-specialist can follow.

**Pre-publish check for this section:**

- [ ] Does the post have at least one concrete analogy per major technical term?
- [ ] Is there at least one "Traducción:" / "Translation:" bridge after the densest section?
- [ ] Are headings fully in their target language (no Spanglish)?
- [ ] Does the closer use a specific subject (not "la web" / "the ecosystem" / "the industry")?
- [ ] If a reader skimmed only the first sentence of each paragraph, would they still get the argument?

---

## 9. Community-Mode Specifics

PTT publishes more than blog posts. The voice rules apply across collections, with these adaptations:

### 9.1 Meetup pages (`src/content/meetups/`)

Meetup **collection pages** are the canonical public record of each monthly event (`/meetups/{slug}`, `/en/meetups/{slug}`). They are **not** blog meetup recaps. Recaps live under `src/content/blog/` and follow the **Meetup recap (blog)** row in §2.4 — longer, reflective, quote-heavy. Collection pages stay shorter, factual, and organization-voiced.

#### Voice

- Default to **plural organization voice**: "we" / "nos" / "la comunidad." The byline is Pereira Tech Talks.
- Use first-person singular **only** when quoting or attributing a **named organizer** (or speaker) who owns that sentence — e.g. a short attributed line from Sergio Flórez, not an embodied "I" in the org narrative.
- Warm, specific, professional. No press-release hype, no corporate community-speak.

#### Structure

Keep bodies lean and scannable:

1. **Short scene-setting opener** — place, vibe, or why this night mattered (1–3 sentences).
2. **What we ran** — themes, talks, or format, using only evidenced titles and people (frontmatter, flyer, audit).
3. **Practical details** — when, where, mode, how to join (or that it already happened).
4. **Optional resources** — slides, recordings, external docs, related links.

Honest archive blurbs are fine when evidence is thin (title + date + venue only). Prefer a short true paragraph over a fake roster.

#### Never leave import stubs

- **Do not** leave a body that is only: `Originally published on Meetup.com / Luma — see the link in the frontmatter for full details.`
- Import links may stay in frontmatter or Resources; the markdown body must still read as a PTT page.
- Placeholders (`[TODO:]`, `[TBD]`, etc.) are forbidden — see §5.

#### Language & frontmatter quality

- **Spanish orthography is mandatory** — ñ, áéíóú, ¿¡. No missing accents.
- **Tuteo only** — never voseo (`tenés`, `podés`, `sabés`).
- Bilingual `title.en` / `title.es` and `description.en` / `description.es` required.
- **Descriptions: 130–160 characters** per language (meta-quality). Specific and concrete; not a keyword dump.
- Write Spanish first when possible; English is a first-class international rendition, not an afterthought.

#### Sponsors vs allies wording

Flyer labels decide the collection — never guess:

| Flyer / copy cue | Treat as | Wording |
|------------------|----------|---------|
| **Sponsored by** / **Patrocinado por** | Sponsor (`sponsors` / `meetup.sponsors`) | Thank sponsors as sponsors; match frontmatter slugs |
| Peer meetup / community logos, “comunidad aliada” | Allied community (`communities`) | “comunidades aliadas” / “allied communities” — **never** call them sponsors |
| **Organized by** / PTT logo | Organizer | Do not list Pereira Tech Talks as a sponsor |

Venue (e.g. UTP as location) is not a sponsor unless it appears under Sponsored by. Ambiguous logos stay out of prose claims until classified.

#### Meetup-specific anti-slop

- **No fake attendance** — do not invent headcounts, “sala llena,” or “record turnout” without a source.
- **No invented talk titles or people** — if the flyer/audit/frontmatter does not evidence a talk or speaker, omit them or say names are still being confirmed.
- Do not contradict frontmatter `speakers` / `talks` / `sponsors` in the body.
- Do not paste a personal blog recap wholesale; rewrite in PTT org voice (see `openclaw-moltys-utp` as a recent collection-page example).
- Keep the general AI-slop blocklist (§3, §7); collection pages especially avoid length explosion and marketing CTAs.

#### Length & naming

- Typical body: a few short sections — enough for a visitor to understand the night, not a 1,000-word essay.
- Name speakers by full name on first reference when they appear; keep claims aligned with linked talk/speaker entries.

**Blog meetup recaps** (separate content type): when publishing a reflective post in `src/content/blog/`, use the **Meetup recap (blog)** mode in §2.4 — scene-setting, speaker- and attendee-quoted, roughly 600–1,200 words, with a forward-looking line for the next meetup when the date is known. Do not treat the collection page as a substitute for that post, or the post as a dump of the collection body.

### 9.2 Pereira Tech Day editions (`src/content/pereiraTechDays/`)

- The edition page is the canonical record. Be journalistic: timestamps, talk count, attendance, sponsors.
- The recap blog post that follows is reflective, not journalistic — what worked, what didn't, what the community learned.
- Per-edition brand kit applies; voice and tone do not change.

### 9.3 Speaker / Talk pages (`src/content/speakers/`, `src/content/talks/`)

- Speaker bios are third-person, written for an international audience. 80–150 words.
- Talk descriptions are written from the speaker's perspective, edited by PTT for clarity.
- Both languages required.

### 9.4 Vertical pages (Speaker School, La Biblioteca del Mañana, AI Channel, Monthly Meetups)

- Status-of-the-program register: cohort dates, current focus, recent shipped work, how to join.
- Avoid "we are excited to announce." State the announcement directly.

### 9.5 Forms copy (Contact, Call for Speakers, Sponsor-Us)

- Plain Spanish first, English mirrored.
- One-sentence-per-question instructions.
- Confirmation messages are warm but short — "Recibido. Te respondemos en 3 días hábiles."

---

## 10. References

- **[Writing Craft Guide](./WRITING_CRAFT_GUIDE.md)** — narrative structure, fact verification, figure markup, refinement patterns, case studies.
- **[Brand Guide](./BRAND_GUIDE.md)** — colors, typography, logo, visual identity. Voice rules in §6.
- **[Standards Guide](./STANDARDS.md)** — orthography rules, import order, project-level standards.
- **[I18N Guide](./I18N_GUIDE.md)** — full multilingual content rules.
- **[Blog Posts Feature Guide](./features/BLOG_POSTS.md)** — file naming, frontmatter schema, hero layouts.
- **[Authors Feature Guide](./features/AUTHORS.md)** — multi-author support and the `authors` collection.
- **[Content Writer Agent](../.agents/agents/content-writer.md)** — the agent that uses this guide.
- **[add-blog-post skill](../.agents/skills/add-blog-post/SKILL.md)** — the scaffolding skill for new posts.

---

**Last updated:** 2026-08-08
**Origin:** Distilled from PTT brand voice & tone, the previous personal-blog refinement library, PTT v3.0.0 multi-author requirements, and meetup collection voice rules (organization pages vs blog recaps).
