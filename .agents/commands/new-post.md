---
description: Create a new blog post (interactive guided flow)
---

# New Blog Post - Interactive Creator

You are an interactive orchestrator that guides users through creating complete multilingual blog posts for Pereira Tech Talks v3.0.0. You gather information step by step, then delegate the actual writing and file creation.

## Philosophy

**The goal is a delightful, guided experience.** The user provides information step by step, and you handle everything: gathering requirements, image setup, delegating content creation, and validation. The user should never need to think about file paths, frontmatter fields, or directory structure.

## Delegation Chain

This command orchestrates a chain of specialized resources:

```
/new-post (this command)        → Gathers info interactively from user
  └─ content-writer agent       → Provides voice, tone, narrative structure
      └─ add-blog-post skill    → Handles file creation, frontmatter, multilingual versions
          └─ docs/features/     → Source of truth for all conventions
```

**You orchestrate the interaction. You do NOT duplicate rules that live elsewhere.**

### Source of Truth References

Before creating any files, consult these (in order of priority):

1. **[content-writer agent](../agents/content-writer.md)** — Voice & tone, article structure, multilingual quality, Spanish phrasing
2. **[add-blog-post skill](../skills/add-blog-post/SKILL.md)** — File creation, frontmatter, slug generation, translation, validation
3. **[Blog Posts Feature Guide](../../docs/features/BLOG_POSTS.md)** — File naming, directory structure, frontmatter schema, hero layouts, image organization
4. **[Blog Content Lifecycle](../../docs/features/BLOG_CONTENT_LIFECYCLE.md)** — Published and demo post visibility
5. **[Image Optimization Guide](../../docs/features/IMAGE_OPTIMIZATION.md)** — Staging workflow, optimization presets

## Parameter Reference

| Input | Mode | Behavior | Example |
|-------|------|----------|---------|
| (none) | guided | Ask all questions step by step | `/new-post` |
| `{topic}` | quick | Use topic, ask remaining questions | `/new-post my experience with Astro` |
| `{topic} trust` | trust | Use topic, minimize confirmations | `/new-post my experience with Astro trust` |
| `trust` | trust | Ask questions but skip confirmations | `/new-post trust` |

## Modes

### Guided Mode (default)
- Asks questions one at a time
- Shows preview before creating files
- Asks confirmation before writing

### Trust Mode (`trust`)
- Asks essential questions only
- Creates files without intermediate confirmations
- Perfect when user knows what they want

---

## Workflow

### Step 0: Parse Input & Determine Mode

**0.1 Detect trust mode:**
- If the LAST word is `trust`, remove it and set `trust_mode = true`

**0.2 Classify remaining input:**

| Condition | Classification | Behavior |
|-----------|---------------|----------|
| No remaining text | **no input** | Full guided flow (all questions) |
| Short text (topic/title) | **topic provided** | Skip title/topic question, ask the rest |

---

### Step 1: Introduction

**Show brief intro:**

```
New Blog Post Creator

I'll guide you through creating a multilingual blog post (EN + ES).
Let's start!
```

---

### Step 2: Gather Information

Ask these questions one at a time. Wait for each answer before asking the next. If user provides extra info in any answer, use it and skip the relevant questions.

**2.1 Topic / Title** (skip if provided as parameter)

```
What's the topic or title of your post?
(e.g., "My experience building a CI/CD pipeline", "Personal branding journey")
```

**2.2 Mode detection** — Based on the answer, determine:
- If user gave a **topic/brief** → Topic mode (you'll write the content)
- If user says they have **content ready** → Content mode (ask for the content)

```
Should I write the article from this topic, or do you have content ready to use?

1. Write it for me (I'll provide context/details)
2. I have content ready (paste or provide the markdown)
```

**2.3 Description**

```
Write a brief description (1-2 sentences) for the post excerpt.
Or press Enter and I'll generate one from the content.
```

**2.4 Tags** — Show available tags and let user pick.

First, read `src/content/tags/` to get current tags, then ask:

```
Which tags apply? (comma-separated or numbers)

Available tags:
1. tech - Technical content
2. personal - Personal posts
3. talks - Conference talks
4. trading - Trading content
5. portfolio - Portfolio/branding

Example: 1,2 or tech, personal
```

**2.5 Series** (optional) — Check if this post belongs to a series.

First, check if any series exist in `src/content/series/`. If series exist, ask:

```
Does this post belong to a series?

Available series:
1. the-library-of-tomorrow - "The Library of Tomorrow" (PTT vertical, ongoing)

0. No, it's a standalone post

Which series? (Enter for standalone)
```

**If user selects a series:**
- Determine the next `seriesOrder` by checking existing posts: `grep -r 'series: "{slug}"' src/content/blog/en/`
- Confirm: `This will be Chapter {n} in "{series title}". Correct?`
- Add `series` and `seriesOrder` to frontmatter

**If no series exist** in the project, skip this question entirely.

**2.6 Hero Image** — Ask about the hero image.

```
Do you have a hero image for this post?

1. Yes, I have an image file (provide the path)
2. No hero image (text-only post)
```

**If user provides an image path:**
- Determine if the image needs optimization
- Auto-detect aspect ratio using metadata or filename hints
- Suggest the appropriate `heroLayout` (see Blog Posts Feature Guide for layout details):
  - Square-ish (aspect ratio 0.8-1.2) → `side-by-side`
  - Landscape/wide → `banner`
  - Small/icon-like → `minimal`

```
I detected this is a {square/landscape} image. I recommend the "{layout}" layout.

1. banner - Full-width image above title (landscape)
2. side-by-side - Title left, image right (square)
3. minimal - Small thumbnail (secondary image)
4. none - No hero image area

Which layout? (Enter for recommended: {layout})
```

**If image is not already in the correct location** (`public/images/blog/posts/{slug}/hero.{ext}`):
- Copy/move the image to the correct location
- Run `pnpm run images:optimize` if the image is placed in staging (see Image Optimization Guide)
- Inform the user about the optimization results

**2.7 Publication date**

```
Publication date? (Enter for today: {today's date YYYY-MM-DD})
```

**2.8 Language**

```
What's the primary language of this post?

1. English (I'll translate to Spanish)
2. Spanish (I'll translate to English)
```

**2.9 Additional context (Topic mode only)**

If in topic mode, ask for additional context to write a better article:

```
Any additional context to help me write the article?
(References, links, key points to cover, specific experiences to mention)
Press Enter to skip.
```

---

### Step 3: Preview & Confirm (Guided mode only)

**Show a preview of what will be created:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Blog Post Preview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: {title}
Slug: {slug}
Date: {pubDate}
Tags: {tags}
Series: {series name + chapter number, or "standalone"}
Hero: {heroImage or "none"} ({heroLayout})
Mode: {topic → "Writing from scratch" | content → "Using provided content"}
Primary language: {lang}

Files to create:
  - src/content/blog/en/{date}_{slug}.md
  - src/content/blog/es/{date}_{slug}.md
{if image:}
  - public/images/blog/posts/{slug}/hero.{ext}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to create?

1. Yes, create the post
2. I want to change something
3. Cancel
```

**Handle response:**
- **Option 1:** Proceed to Step 4
- **Option 2:** Ask what to change, update values, show preview again
- **Option 3:** Cancel with message

---

### Step 4: Create Blog Post (Delegate to Agent + Skill)

This is where you delegate. Pass all gathered information to the execution layer.

**4.1 Handle image (if provided):**
- If image is not in the correct location, copy it to `public/images/blog/posts/{slug}/hero.{ext}`
- If image was placed in `_staging/`, run `pnpm run images:optimize` (see Image Optimization Guide for presets)
- Report optimization results

**4.2 Write the blog post — Delegate to content-writer agent:**

Adopt the **[content-writer agent](../agents/content-writer.md)** persona and follow the **[add-blog-post skill](../skills/add-blog-post/SKILL.md)** procedure to create the post files. Specifically:

- **Topic mode:** The content-writer agent's voice & tone guidelines, article structure convention, and Spanish voice specifics define HOW to write the article. The add-blog-post skill defines WHERE files go and WHAT frontmatter to use.
- **Content mode:** The add-blog-post skill handles scaffolding the provided content into proper files with frontmatter and multilingual versions.

Pass these parameters to the skill:
- `$TOPIC` or `$CONTENT` (based on mode)
- `$TITLE`, `$DESCRIPTION`, `$TAGS`, `$SLUG`
- `$HERO_IMAGE`, `$PUB_DATE`, `$LANG`

**Show progress while creating:**

```
Creating your blog post...

[1/5] Setting up image... done
[2/5] Writing {primary lang} version... done
[3/5] Writing {other lang} version... done
[4/5] Validating... done (build passed)
[5/5] Done!
```

**4.3 Validate:**
- Run `pnpm run build`
- Verify both files exist
- Verify image paths are correct

---

### Step 5: Completion

**Show success message:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Blog Post Created!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title (EN): {title_en}
Title (ES): {title_es}

Files:
  - src/content/blog/en/{date}_{slug}.md
  - src/content/blog/es/{date}_{slug}.md
{if image:}
  - public/images/blog/posts/{slug}/hero.{ext}

Preview URLs:
  - EN: /blog/{slug}/
  - ES: /es/blog/{slug}/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do?

1. Preview it (start dev server)
2. Commit the changes
3. Done for now
```

**Handle response:**
- **Option 1:** Run `pnpm run dev` and show the URL
- **Option 2:** Create a commit with message `content: add blog post "{title}" (en + es)`
- **Option 3:** End with reminder about uncommitted changes

---

## Error Handling

**Slug already exists:**
```
A post with slug "{slug}" already exists.

1. Use a different slug (suggest one)
2. Overwrite existing post
3. Cancel
```

**Image file not found:**
```
Image not found at: {path}

1. Provide a different path
2. Continue without hero image
3. Cancel
```

**Build fails:**
```
Build failed. Let me check what went wrong...
{error details}

I'll fix the issue and retry.
```

**Tag doesn't exist:**
```
Tag "{tag}" doesn't exist. Available tags: {list}

1. Choose from existing tags
2. Continue without this tag
```

---

## Quick Examples

**1. No input (fully guided):**
```
User: /new-post

Agent: New Blog Post Creator
       I'll guide you through creating a multilingual blog post (EN + ES).
       Let's start!

       What's the topic or title of your post?

User: My experience setting up the Speaker School at Pereira Tech Talks

Agent: Should I write the article from this topic, or do you have content ready?
       1. Write it for me
       2. I have content ready

User: 1

Agent: Write a brief description (1-2 sentences)...

[continues through all questions: description, tags, hero image, date, language, context]
[shows preview, asks confirmation]
[delegates to content-writer agent + add-blog-post skill]
[validates with pnpm run build]
```

**2. Topic provided:**
```
User: /new-post my experience migrating from Next.js to Astro

Agent: New Blog Post Creator

       Got it! I'll write about: "My experience migrating from Next.js to Astro"

       Write a brief description...

[skips topic question, asks the rest: description, tags, hero image, date, language, context]
```

**3. Trust mode (minimal confirmations):**
```
User: /new-post my CI/CD pipeline setup trust

Agent: New Blog Post Creator (Trust Mode)

       Topic: "My CI/CD pipeline setup"

       Quick questions:
       - Tags? (tech/personal/talks/trading/portfolio)

User: tech

Agent: - Hero image? (path or "none")

User: none

Agent: - Publication date? (Enter for today)
       - Primary language? (en/es)

       Creating your blog post...
       [1/4] Writing English version... done
       [2/4] Writing Spanish version... done
       [3/4] Validating... done (build passed)
       [4/4] Done!

       Blog Post Created!
       ...
```
