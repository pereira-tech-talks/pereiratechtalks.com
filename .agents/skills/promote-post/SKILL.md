---
name: promote-post
description: Generate ready-to-paste social media content for any blog post across multiple platforms (Twitter/X, LinkedIn, Hacker News, dev.to, Reddit, Facebook). Use proactively when promoting blog posts.
disable-model-invocation: false
allowed-tools: Read, Glob, Grep
model: sonnet
argument-hint: "<slug> [--platforms x,linkedin,hn,devto,reddit,facebook] [--lang en|es]"
tier: 2
intent: create
max-files: 0
max-loc: 0
---

# Skill: Promote Post

## Objective

Generate ready-to-paste social media content for a specific blog post, tailored to each platform's tone, format, and audience. The output is text that the user can copy and paste directly into each platform — no files are created or modified.

## Non-Goals

- Does NOT publish or post to any platform (user handles publishing manually)
- Does NOT create or modify any files in the repository
- Does NOT generate images or visual assets
- Does NOT schedule posts or manage posting timing
- Does NOT translate — generates content in the requested language only

## Tier Classification

**Tier: 2** - Standard

**Reasoning:** Requires reading and understanding blog post content, then generating high-quality creative text adapted to multiple platform formats. No code changes, no risk, but needs good reasoning for platform-specific adaptation.

## Inputs

### Required Parameters

- `$SLUG`: Blog post slug or URL. Accepts any of these formats:
  - Slug: `how-we-got-into-y-combinator`
  - Local URL: `http://localhost:8888/blog/how-we-got-into-y-combinator/` or `http://localhost:8888/es/blog/how-we-got-into-y-combinator/`
  - Production URL: `https://pereiratechtalks.org/blog/how-we-got-into-y-combinator/` or `https://pereiratechtalks.org/es/blog/how-we-got-into-y-combinator/`

### Optional Parameters

- `$PLATFORMS`: Comma-separated list of platforms (default: `x,linkedin` — Tier 1 platforms)
  - Valid values: `x`, `linkedin`, `hn`, `devto`, `reddit`, `facebook`, `all`
  - `all` = all 6 platforms
  - Tiers for reference: Tier 1 (`x,linkedin`), Tier 2 (`hn,devto,reddit`), Tier 3 (`facebook`)
- `$LANG`: Language for the generated content (default: `en`). Use `en` or `es`.

## Prerequisites

Before running this skill, ensure:

- [ ] The blog post exists in `src/content/blog/{lang}/` (matching the slug)
- [ ] The post is a published post (not in `_demo/` folder)

## Steps

### Step 1: Find and Read the Blog Post

1. **Parse input** — detect if `$SLUG` is a URL or a plain slug:
   - If it matches `http(s)://.*/blog/{slug}/` → extract the slug from the URL path
   - If the URL contains `/es/blog/` → auto-set `$LANG` to `es` (unless explicitly overridden)
   - If the URL contains `/blog/` without `/es/` → auto-set `$LANG` to `en`
   - Otherwise, treat the input as a plain slug

2. Search for the post file using the extracted slug:
   ```
   Glob: src/content/blog/{lang}/*_{slug}.{md,mdx}
   ```
   - If `$LANG` is `en`, search in `en/`. If `es`, search in `es/`.
   - If not found, try the other language directory as fallback.
   - If still not found, report error.

2. Read the full post content — frontmatter (title, description, tags, pubDate, heroImage) and body.

3. Identify post characteristics:
   - **Type**: technical, startup/business, personal, tutorial
   - **Primary tags**: from frontmatter `tags` array (cross-reference with `src/content/tags/` for tier)
   - **Key topics**: extract 3-5 main talking points from the content
   - **Hook**: identify the most compelling angle for social media

### Step 2: Determine Target Platforms

- If `$PLATFORMS` not specified, default to Tier 1: `x,linkedin`
- If `all`, generate for all 6 platforms
- Otherwise, parse the comma-separated list

Platform selection guidance based on post tags:
- Posts tagged `tech`, `web-development`, `javascript`, `ai`, `devops`, `python` → suggest `devto`, `reddit`
- Posts tagged `portfolio`, `dailybot`, `talks` → suggest `linkedin`
- Posts with strong narrative/story → suggest `hn`
- All posts → always recommend `x`, `linkedin`

### Step 3: Generate Platform-Specific Content

Generate content for each requested platform following these formats:

---

#### Twitter/X Thread

**Format:** 3-5 tweet thread (each tweet ≤ 280 characters)

**Structure:**
- **Tweet 1 (Hook):** Attention-grabbing opener. Start with a bold statement, surprising fact, or compelling question from the post. No hashtags here.
- **Tweets 2-4 (Key points):** One insight/takeaway per tweet. Use short sentences. Can include numbers, quotes from the post.
- **Final Tweet (CTA):** Link to the full post + 2-3 relevant hashtags.

**Tone:** Conversational, first-person, direct. Like talking to a friend who's also a developer.

**Rules:**
- Each tweet must work standalone (someone might only see one via retweet)
- Use "🧵" emoji in first tweet to signal thread
- Include the post URL only in the last tweet
- Use line breaks within tweets for readability
- Hashtags only in the last tweet (max 3)

---

#### LinkedIn Post

**Format:** Single post, 150-300 words

**Structure:**
- **Hook line** (first line visible before "see more" — make it count, max 150 chars)
- **Blank line**
- **Context/Story** (2-3 short paragraphs, personal angle)
- **Key takeaway or lesson**
- **CTA** (link to post + engagement question)
- **3-5 hashtags** at the end

**Tone:** Professional but personal. Storytelling format. "Here's what I learned..." or "We did X and here's what happened..."

**Rules:**
- First line is CRITICAL — LinkedIn truncates after ~150 chars
- Use short paragraphs (1-2 sentences each)
- Include personal experience/opinion, not just a summary
- End with a question to drive comments

---

#### Hacker News

**Format:** Title only (+ optional first comment)

**Structure:**
- **Title:** Max 80 characters. Factual, no clickbait. Follow HN norms:
  - Use "Show HN:" prefix if the post showcases something built
  - No emojis, no ALL CAPS, no exclamation marks
  - Prefer specific over vague: "How we got 100/100 Lighthouse scores with Astro" > "Making a fast website"
- **First Comment (optional):** 2-3 sentences of context if the title needs explanation. Written as the author providing background.

**Tone:** Understated, technical, matter-of-fact. HN audience is skeptical of hype.

**Rules:**
- Title should spark curiosity without being clickbait
- If the post is about a personal project, use "Show HN:"
- If the post tells a story, lead with the most interesting outcome
- Never use marketing language

---

#### dev.to Cross-Post

**Format:** Frontmatter + adapted intro (first 3-4 paragraphs)

**Structure:**
```markdown
---
title: "{post title}"
published: true
description: "{post description}"
tags: {up to 4 dev.to tags, comma-separated}
canonical_url: https://pereiratechtalks.org/blog/{slug}/
cover_image: https://pereiratechtalks.org{heroImage path}
---

{Adapted intro — first 3-4 paragraphs of the post, slightly rewritten to work standalone on dev.to}

---

*This post was originally published on the [Pereira Tech Talks blog](https://pereiratechtalks.org/blog/{slug}/). Read the full version there for the complete experience.*
```

**Tone:** Same as the blog post — first person, technical, conversational.

**Rules:**
- `canonical_url` is MANDATORY — prevents SEO competition with the original
- dev.to tags: max 4, lowercase, no spaces (use existing dev.to tags like `javascript`, `webdev`, `ai`, `productivity`, `startup`)
- Only include the intro + redirect, not the full post
- Cover image uses the post's heroImage URL

---

#### Reddit

**Format:** Title + body text for a relevant subreddit

**Structure:**
- **Suggested subreddit(s):** Based on post content:
  - Technical/web: r/webdev, r/programming, r/javascript, r/reactjs
  - AI: r/artificial, r/MachineLearning
  - Startup: r/startups, r/SaaS, r/Entrepreneur
  - YC: r/ycombinator
  - General tech: r/technology
- **Title:** Descriptive, no clickbait. Can be a question or statement.
- **Body:** 3-5 sentences of context/summary + link at the end. Reddit users expect you to participate, not just drop links.

**Tone:** Casual, community-oriented. "Hey, I wrote about X and wanted to share..." Not promotional.

**Rules:**
- Always suggest 1-2 specific subreddits
- Body should add value beyond just linking — share a key insight
- Mention it's your own content (Reddit appreciates transparency)
- Don't be salesy — provide value first

---

#### Facebook (Group Post)

**Format:** Short post for tech/developer groups

**Structure:**
- **Opening:** 1-2 sentences, conversational hook
- **Context:** 2-3 sentences about what the post covers and why it matters
- **Link** to the full post
- **Question** to drive engagement

**Tone:** Casual, friendly, community-oriented. Like sharing with colleagues.

**Rules:**
- Keep it short (under 100 words before the link)
- No hashtags (Facebook groups don't use them effectively)
- Frame as sharing knowledge, not self-promotion
- Include a question to encourage comments

---

### Step 4: Present Output

Present all generated content in a clear, structured format:

1. Show a summary header with post info
2. For each platform, use a clear separator and label
3. Each section should be easily copy-pasteable (no extra formatting that would break on paste)

## Output Format

### Success Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📣 Social Media Content: {Post Title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Post: {title}
URL: https://pereiratechtalks.org/blog/{slug}/
Tags: {tags}
Language: {lang}
Platforms: {list}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🐦 TWITTER/X THREAD
━━━━━━━━━━━━━━━━━━━

[Tweet 1]
{content}

[Tweet 2]
{content}

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💼 LINKEDIN
━━━━━━━━━━

{full post content}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{... more platforms ...}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Content generated for {N} platforms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Failure Output

```
❌ Post not found: {slug}

Available posts matching "{partial}":
- {suggestion 1}
- {suggestion 2}

Usage: /promote-post <slug> [--platforms x,linkedin,hn,devto,reddit,facebook]
```

## Guardrails

### Scope Limits

- **Maximum files:** 0 (read-only, no files created or modified)
- **Maximum LOC:** 0 (no code changes)
- **Allowed directories:** `src/content/blog/`, `src/content/tags/` (read-only)
- **Forbidden directories:** All others (this skill only reads blog content)

### Safety Checks

Before generating content:

- [ ] Post exists and is not a demo post
- [ ] Post has a title, description, and body content
- [ ] Generated tweet lengths are each ≤ 280 characters
- [ ] HN title is ≤ 80 characters
- [ ] `canonical_url` is included in dev.to output
- [ ] No confidential or private information is included in social content

### Stop Conditions

**Stop immediately** and report if:

- Blog post slug not found in either language directory
- Post is a demo post (in `_demo/` folder)
- User requests publishing to platforms (out of scope)

## Definition of Done

This skill is **complete** when ALL of the following are true:

- [ ] Blog post was read and analyzed successfully
- [ ] Content generated for all requested platforms
- [ ] Each platform's content follows its specific format rules
- [ ] Tweet character limits respected (≤ 280 each)
- [ ] HN title character limit respected (≤ 80)
- [ ] dev.to includes `canonical_url`
- [ ] All content presented in copy-pasteable format
- [ ] Post URL (https://pereiratechtalks.org/blog/{slug}/) included in all platform outputs

## Escalation Conditions

**Escalate to user** if:

- Post content is too short or lacks substance for meaningful social content
- Post is in a language not supported (neither EN nor ES)
- User requests platforms not in the supported list

**Escalation Path:**

1. First: Try to generate with available content
2. Then: Ask user for additional context or talking points
3. Finally: Generate partial output for platforms that work

## Examples

### Example 1: Default (Tier 1 platforms only)

**Context:** User wants to promote their YC story post.

**Input:**

```
/promote-post how-we-got-into-y-combinator
```

**Execution:**
Reads the post, generates content for Twitter/X and LinkedIn (default Tier 1 platforms).

**Output:**

```
📣 Social Media Content: How We Got Into Y Combinator
Platforms: x, linkedin

🐦 TWITTER/X THREAD

[Tweet 1]
🧵 Getting into Y Combinator changed everything for DailyBot.

But the application process? Way more intense than I expected.

Here's what actually happened:

[Tweet 2]
We applied 3 times before getting in.

The first two rejections taught us more than the acceptance did — we learned to focus on metrics that matter, not features that impress.

[Tweet 3]
The YC interview is 10 minutes.

10 minutes to convince some of the smartest people in tech that your startup is worth betting on.

Here's what they actually asked us...

[Tweet 4]
Full story on the Pereira Tech Talks blog — every detail from application to Demo Day:

https://pereiratechtalks.org/blog/how-we-got-into-y-combinator/

#YCombinator #startups #SaaS

💼 LINKEDIN

Getting into Y Combinator changed the trajectory of DailyBot.

But here's what nobody tells you...
{...}
```

### Example 2: All platforms + Spanish

**Context:** User wants full coverage in Spanish.

**Input:**

```
/promote-post how-we-got-into-y-combinator --platforms all --lang es
```

**Execution:**
Reads the ES version of the post, generates content for all 6 platforms in Spanish.

### Example 3: Technical post with platform suggestions

**Context:** User promotes a technical web development post.

**Input:**

```
/promote-post lighthouse-perfect-scores --platforms x,hn,devto,reddit
```

**Execution:**
Reads the post, notes it's deeply technical (Astro, Lighthouse, performance). Generates:
- Twitter thread with specific performance numbers
- HN title: "Show HN: Achieving 100/100 Lighthouse scores with Astro and Svelte"
- dev.to with frontmatter and canonical URL
- Reddit post for r/webdev with technical context

### Example 4: Post not found

**Context:** User provides a wrong slug.

**Input:**

```
/promote-post my-awesome-post
```

**Result:**

```
❌ Post not found: my-awesome-post

Available posts with similar names:
- my-awesome-project (2024-05-15)
- awesome-tools-roundup (2024-03-10)

Usage: /promote-post <slug> [--platforms x,linkedin,hn,devto,reddit,facebook]
```

## Related Skills/Agents

- [`add-blog-post`](../add-blog-post/SKILL.md) - Creates the blog posts that this skill promotes
- [`content-writer`](../../agents/content-writer.md) - Can help refine or expand generated social content

## Changelog

| Version | Date       | Changes         |
| ------- | ---------- | --------------- |
| 1.0.0   | 2026-03-03 | Initial version |
