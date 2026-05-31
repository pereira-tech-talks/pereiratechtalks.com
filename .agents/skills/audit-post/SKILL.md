---
name: audit-post
description: Pre-publication audit for blog posts — comprehensive final review of SEO, AEO, accessibility, images, content quality, i18n parity, and project conventions before publishing. Use proactively before publishing any blog post.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Glob, Grep, Bash
model: sonnet
argument-hint: "[slug]"
# === Documentation (ignored by tools, useful for humans) ===
tier: 2
intent: review
max-files: 0
max-loc: 0
---

# Skill: Audit Blog Post

## Objective

Run a comprehensive pre-publication audit on a blog post, checking SEO, AEO, accessibility, images, content quality, i18n parity, and project conventions. Produces a structured PASS/FAIL/WARN report with a final verdict: **READY TO PUBLISH** or **NEEDS FIXES**.

This skill audits **individual posts**. For series-level validation (ordering, cross-post consistency, series definition), use [`/audit-series`](../audit-series/SKILL.md).

This is a **read-only** skill. It inspects files and reports findings. It does not modify any files.

## Non-Goals

- Does NOT fix issues (use `/quick-fix`, `/fix-lint`, `/translate-sync`, or manual edits)
- Does NOT create or modify blog posts (use `/add-blog-post`)
- Does NOT optimize images (use `/optimize-image`)
- Does NOT modify translations (use `/translate-sync`)
- Does NOT create new tags or series

## Tier Classification

**Tier: 2** - Standard

**Reasoning:** Requires reading multiple files, running validation commands, cross-referencing frontmatter against conventions, counting characters, and checking file existence. Moderate reasoning for interpreting results and producing a structured report.

## Inputs

### Required Parameters

- `$SLUG`: Blog post slug (the kebab-case identifier, without date prefix or language prefix). If omitted, the skill MUST ask the user which post to audit before proceeding.

### Optional Parameters

- `$LANG`: Language to audit — `both` (default), `en`, or `es`. Default audits both versions.

## Prerequisites

Before running this skill, ensure:

- [ ] Blog post files exist (at least one language version)
- [ ] Node modules are installed (`node_modules/` exists)

## Reference Documentation

- **[Blog Posts Guide](../../../docs/features/BLOG_POSTS.md)** — Frontmatter schema, file naming, hero layouts, tags, series
- **[SEO Guide](../../../docs/SEO.md)** — Meta tags, keywords, JSON-LD, character limits
- **[Accessibility Guide](../../../docs/ACCESSIBILITY.md)** — Contrast, alt text, heading hierarchy, ARIA
- **[AEO / Markdown for Agents](../../../docs/aeo/MARKDOWN_FOR_AGENTS.md)** — Agent-friendly Markdown endpoints
- **[Writing Voice Guide](../../../docs/WRITING_VOICE_GUIDE.md)** — AI slop blocklist, voice patterns, placeholder checks
- **[Writing Craft Guide](../../../docs/WRITING_CRAFT_GUIDE.md)** — Narrative structure, fact verification, quote handling, figure markup, refinement patterns
- **[Blog Content Lifecycle](../../../docs/features/BLOG_CONTENT_LIFECYCLE.md)** — Published, scheduled, demo visibility

## Steps

### Step 0: Resolve Post Files

1. If `$SLUG` is not provided, list recent posts and ask the user which post to audit. Stop until they respond.
2. Find the post files by searching for `*_${SLUG}.md` or `*_${SLUG}.mdx` in `src/content/blog/en/` and `src/content/blog/es/`.
3. If no files are found, report an error and stop.
4. Read both the EN and ES post files completely.

```bash
# Find post files
find src/content/blog/en/ -name "*_${SLUG}.md" -o -name "*_${SLUG}.mdx" | head -5
find src/content/blog/es/ -name "*_${SLUG}.md" -o -name "*_${SLUG}.mdx" | head -5
```

### Step 1: Frontmatter Validation

Check the following in BOTH EN and ES versions:

| Check | Rule | Severity |
|-------|------|----------|
| `title` | Present, non-empty, compelling | FAIL if missing |
| `description` | Present, 130-160 characters (count exact) | FAIL if missing; FAIL if outside range |
| `pubDate` | Valid date format (YYYY-MM-DD or ISO) | FAIL if missing or invalid |
| `heroImage` | Path starts with `/images/`, referenced file exists in `public/` | WARN if missing; FAIL if path is set but file does not exist |
| `heroLayout` | One of: `banner`, `side-by-side`, `minimal`, `none` | WARN if missing (defaults to banner); FAIL if invalid value |
| `tags` | Present, array, max 5 total (≥1 primary + 0-3 secondary + 0-3 subtopic, ≤3 subtopics), every tag exists in `src/content/tags/` | FAIL if tag does not exist; WARN if >5 tags or >3 subtopics; WARN if no primary tag. See [Tag governance](../../../docs/features/BLOG_POSTS.md#tag-taxonomy-unified-collection) |
| `keywords` | Present, array, 5-8 entries per language | WARN if missing; WARN if outside 5-8 range |
| Structure match | EN and ES have the same frontmatter fields (tags, pubDate, heroLayout match) | WARN if mismatch |

**Character counting for description:**
```bash
# Count exact characters (EN)
echo -n "DESCRIPTION_TEXT_HERE" | wc -c
```

Report the exact character count for each language's description.

### Step 2: SEO Checks

| Check | Rule | Severity |
|-------|------|----------|
| Title length | Under 60 chars ideal | WARN if over 60 |
| Description length | 130-160 chars | FAIL if outside range (already checked in Step 1, confirm here) |
| Keywords in content | At least 2-3 keywords from the `keywords` array appear naturally in the body (headings or first paragraphs) | WARN if fewer than 2 found |
| Heading hierarchy | `##` for sections, `###` for subsections, no skipped levels (e.g., no `##` followed by `####`) | FAIL if skipped levels |
| Internal links | Any `](/blog/` or `](/es/blog/` links use correct language prefix for their file | WARN if EN file has `/es/` links or vice versa |
| External links | All `](http` links have both text and URL | WARN if malformed |
| JSON-LD readiness | Frontmatter has `title`, `description`, `pubDate`, `tags` (minimum for BlogPosting schema) | FAIL if any missing |

**Heading hierarchy check:**
```bash
# Extract headings from the post body
grep -n '^#' src/content/blog/en/*_${SLUG}.md
```

### Step 3: AEO Checks

| Check | Rule | Severity |
|-------|------|----------|
| `.md` endpoint | Blog posts auto-generate `.md` endpoints — no manual file needed. Verify no manual `.md` endpoint file exists for this post. | PASS (informational) |
| `keywords` array | Present in frontmatter for structured data | WARN if missing |
| Content structure | Post has clear `##` section headings for AI extraction | WARN if fewer than 2 `##` headings |

### Step 4: Image Audit

**4a. Image location and format:**

```bash
# Check images in the post's directory
ls -la public/images/blog/posts/${SLUG}/ 2>/dev/null
```

| Check | Rule | Severity |
|-------|------|----------|
| Image directory | All post images are in `public/images/blog/posts/${SLUG}/` | FAIL if images referenced from elsewhere |
| WebP format | All images are `.webp` (exceptions: when conversion is impossible) | WARN if non-WebP images found |
| File size | No image over 250KB | WARN if any image exceeds 250KB |
| File names | Descriptive, lowercase, kebab-case (not random strings like `IMG_20210314.webp`) | WARN if names are not descriptive |

**4b. Image tags in content:**

```bash
# Find all img tags and markdown images
grep -n '<img\|!\[' src/content/blog/en/*_${SLUG}.md
```

| Check | Rule | Severity |
|-------|------|----------|
| `alt` attribute | Every `<img>` has a descriptive `alt` (not empty for content images) | FAIL if missing alt on content images |
| `width` and `height` | Every `<img>` tag has both attributes | WARN if missing (markdown images exempt) |
| `loading="lazy"` | Inline images (not hero) should have `loading="lazy"` | WARN if missing on `<img>` tags |
| Markdown images | `![alt text](/path)` — alt text is present and descriptive | WARN if empty alt text |
| `<figure>` + `<figcaption>` | Every inline image wrapped in `<figure>` with a short `<figcaption>` | WARN if missing figcaption |

**4c. Iframes:**

```bash
grep -n '<iframe' src/content/blog/en/*_${SLUG}.md
```

| Check | Rule | Severity |
|-------|------|----------|
| `loading="lazy"` | Every `<iframe>` has `loading="lazy"` | WARN if missing |
| `title` attribute | Every `<iframe>` has a `title` attribute | FAIL if missing |

**4d. Hero image:**

| Check | Rule | Severity |
|-------|------|----------|
| File exists | If `heroImage` is set, the file exists at `public${heroImage}` | FAIL if missing |
| ES variant | If hero contains text, check for `hero-es.webp` variant | INFO (manual check needed) |

### Step 5: Accessibility

| Check | Rule | Severity |
|-------|------|----------|
| Heading hierarchy | No skipped levels in the post body | FAIL if skipped (also in Step 2) |
| Image alt text | All content images have meaningful alt (not empty, not "image", not "photo") | FAIL if generic or missing |
| Decorative images | Images with `alt=""` must be truly decorative | INFO (manual review) |
| Banned text colors | No `text-gray-400`, `text-gray-500`, `dark:text-gray-400`, `dark:text-gray-500` in inline styles or class attributes within the post | FAIL if found |
| Iframe title | Every `<iframe>` has `title` | FAIL if missing (also in Step 4) |
| Inline styles | Flag any `style="..."` attributes (prefer Tailwind classes) | WARN if found (exception: dark background containers for transparent images are allowed) |

```bash
# Check for banned colors in post content
grep -n 'text-gray-400\|text-gray-500\|dark:text-gray-400\|dark:text-gray-500' src/content/blog/en/*_${SLUG}.md src/content/blog/es/*_${SLUG}.md
```

### Step 6: Content Quality

**6a. Placeholder content:**

```bash
# MUST return zero matches
grep -rn '\[AUTHOR:\|\[AUTOR:\|\[TODO:\|\[TBD\]\|\[FIXME\]' src/content/blog/en/*_${SLUG}.md src/content/blog/es/*_${SLUG}.md
```

| Check | Rule | Severity |
|-------|------|----------|
| No placeholders | Zero matches for `[AUTHOR:`, `[AUTOR:`, `[TODO:`, `[TBD]`, `[FIXME]` | FAIL if any found |

**6b. Markdown syntax:**

| Check | Rule | Severity |
|-------|------|----------|
| Unclosed brackets | No orphaned `[` without matching `]` in link syntax | WARN if found |
| Malformed links | All `[text](url)` links have both text and URL portions | WARN if malformed |
| Broken images | All `![alt](path)` references point to existing files | FAIL if file missing |

**6c. Spanish orthography (ES version only):**

```bash
# Check for missing diacritical marks
grep -rn 'pequeno\|tamano\|diseno\|espanol\|manana\|analisis\|numero\|codigo\|ejecucion\|version\|pagina\|titulo\|introduccion\|informacion\|tambien\|asi\b\|mas\b' src/content/blog/es/*_${SLUG}.md
```

| Check | Rule | Severity |
|-------|------|----------|
| Diacritical marks | Spanish text uses proper accents (ñ, á, é, í, ó, ú) | FAIL if common words missing accents |
| Tuteo only | No voseo forms: `tenés`, `podés`, `sabés`, `querés`, `hacés`, `buscás`, `necesitás`, `decís` | FAIL if voseo found |

```bash
# Check for voseo
grep -rn 'tenés\|podés\|sabés\|querés\|hacés\|buscás\|necesitás\|decís' src/content/blog/es/*_${SLUG}.md
```

**6d. AI slop vocabulary:**

```bash
# Check for AI vocabulary blocklist
grep -rni 'genuinely\|comprehensive\|best-in-class\|beautifully\|radical premise\|worth highlighting\|worth calling out\|key insight\|key takeaway\|this is where.*shines\|game-changer\|revolutionary\|leveraging\|harnessing' src/content/blog/en/*_${SLUG}.md src/content/blog/es/*_${SLUG}.md
```

| Check | Rule | Severity |
|-------|------|----------|
| AI slop words | No words from the AI vocabulary blocklist | WARN if found (list each occurrence) |

**6e. Writing voice & personal tone:**

Read BOTH the **[Writing Voice Guide](../../../docs/WRITING_VOICE_GUIDE.md)** (voice, vocabulary, AI-slop blocklist) and the **[Writing Craft Guide](../../../docs/WRITING_CRAFT_GUIDE.md)** (narrative structure, fact verification, quote handling, figure markup, refinement patterns) completely before evaluating. The author's voice has specific characteristics that must be present:

**Authority style — hard-won, not assumed:**
- Uses "I learned...", "I noticed...", "In my experience..." — NOT "Studies show...", "Research indicates..."
- Authority comes from lived experience and real anecdotes, not abstract citations

**Sentence rhythm — high variance:**
- Mix of short punchy sentences ("We applied. And got rejected.") with longer explanatory ones
- NOT every sentence the same length or structure

**Tangents and asides:**
- Em-dash interruptions for mid-thought corrections ("Not to pitch. To listen.")
- Parenthetical thinking-out-loud moments
- At least 2-3 instances per post

**Failure/struggle voice:**
- Direct, clinical, not self-pitying. Failure = data
- At least 1 failure or struggle narrative per post
- "Most of them went nowhere." — stated matter-of-factly

**Specificity:**
- Uses real names, products, dates, places, metrics
- NOT vague references ("a certain tool", "some companies")

**Uncertainty/humility:**
- At least 1 moment of admitted uncertainty ("I think", "I'm not sure", "honestly", "nobody knows")
- Never bluffs past what he knows

**Signature patterns:**
- "The problem:" diagnostic framing
- "Let's keep building." or similar as closer
- Grounded optimism — not hype, not alarmist

**Things the voice NEVER does:**
- Hides uncertainty or exaggerates accomplishments
- Uses marketing language in the body
- Claims false modesty
- Uses structural regularity (every section identical pattern)

| Check | Rule | Severity |
|-------|------|----------|
| Authority from experience | Post uses first-person lived experience, not abstract citations | WARN if mostly impersonal |
| Sentence rhythm variety | Mix of short and long sentences throughout | WARN if monotonous |
| Tangents/asides present | At least 2 em-dash interruptions or parenthetical asides | WARN if none found |
| Failure/struggle narrative | At least 1 honest moment of difficulty or uncertainty | WARN if absent |
| Specificity | Uses real names, numbers, places — not vague references | WARN if too generic |
| Uncertainty moments | At least 1 admission of not knowing ("I think", "nobody knows") | WARN if absent |
| No marketing language | Body text avoids sales-pitch tone | WARN if detected |
| Structural variety | Sections vary in structure (not all identical pattern) | INFO |
| Closer matches style | Ends with action-oriented closer aligned with author voice | INFO |

### Step 7: i18n Parity

| Check | Rule | Severity |
|-------|------|----------|
| Both files exist | EN and ES versions both exist with same filename | FAIL if one missing |
| Same `pubDate` | Both versions have identical `pubDate` | FAIL if different |
| Same `tags` | Both versions have identical `tags` array | FAIL if different |
| Same `heroLayout` | Both versions have identical `heroLayout` | WARN if different |
| Same images | Both versions reference the same images (except hero-es variant) | WARN if different |
| Section parity | Both versions have same number and structure of `##` headings | WARN if different heading count |
| Link prefixes | EN uses `/blog/` links, ES uses `/es/blog/` links | FAIL if wrong prefix |

```bash
# Compare heading structure
echo "=== EN headings ===" && grep '^##' src/content/blog/en/*_${SLUG}.md
echo "=== ES headings ===" && grep '^##' src/content/blog/es/*_${SLUG}.md
```

### Step 8: Resources Section

If the post has a Resources / Recursos section:

| Check | Rule | Severity |
|-------|------|----------|
| Links format | All resource links have both text and URL | WARN if malformed |
| No series self-references | If post belongs to a series, Resources does NOT list other posts in the same series | WARN if series posts found in Resources |
| Referenced in body | Resources listed are actually referenced or relevant to the article content | INFO (manual review) |

### Step 9: Build Validation

```bash
pnpm run build 2>&1 | tail -20
```

| Check | Rule | Severity |
|-------|------|----------|
| Build passes | `pnpm run build` exits with code 0 | FAIL if build fails |
| No warnings for this post | No build warnings mentioning the post slug | WARN if warnings found |

### Step 10: Final Report

Generate a summary report using the format below.

## Output Format

### Success Output (READY TO PUBLISH)

```
## Blog Post Audit: {slug}

### Files Audited
- EN: `src/content/blog/en/YYYY-MM-DD_{slug}.md`
- ES: `src/content/blog/es/YYYY-MM-DD_{slug}.md`

### Audit Summary

| Category              | Status | Details                          |
|-----------------------|--------|----------------------------------|
| Frontmatter           | PASS   |                                  |
| SEO                   | PASS   | Title: 45 chars, Desc: 148 chars |
| AEO                   | PASS   | Keywords present, structured     |
| Images                | PASS   | 3 images, all WebP, all <250KB  |
| Accessibility         | PASS   | Headings OK, alt text OK         |
| Content Quality       | PASS   | No placeholders, no AI slop      |
| i18n Parity           | PASS   | Both versions in sync            |
| Resources             | PASS   | All links valid                  |
| Build                 | PASS   | Build succeeded                  |

### Blocking Issues (FAIL)
None

### Warnings (WARN)
None

### Suggestions (INFO)
- Consider adding 1 more tangent/aside for voice authenticity

### Verdict: READY TO PUBLISH
```

### Failure Output (NEEDS FIXES)

```
## Blog Post Audit: {slug}

### Files Audited
- EN: `src/content/blog/en/YYYY-MM-DD_{slug}.md`
- ES: `src/content/blog/es/YYYY-MM-DD_{slug}.md`

### Audit Summary

| Category              | Status | Details                                |
|-----------------------|--------|----------------------------------------|
| Frontmatter           | FAIL   | ES description: 172 chars (max 160)   |
| SEO                   | WARN   | Title: 67 chars (ideal <60)            |
| AEO                   | PASS   | Keywords present                       |
| Images                | FAIL   | hero.webp missing from disk            |
| Accessibility         | PASS   |                                        |
| Content Quality       | FAIL   | [TODO: add conclusion] found in ES     |
| i18n Parity           | WARN   | EN has 8 headings, ES has 7            |
| Resources             | PASS   |                                        |
| Build                 | FAIL   | Build failed (missing image)           |

### Blocking Issues (FAIL) -- Must fix before publishing
1. **Frontmatter:** ES description is 172 characters (must be 130-160)
2. **Images:** `public/images/blog/posts/{slug}/hero.webp` does not exist
3. **Content Quality:** Placeholder `[TODO: add conclusion]` found in ES file at line 142
4. **Build:** Build failed due to missing image reference

### Warnings (WARN) -- Should fix
1. **SEO:** EN title is 67 characters (ideal under 60)
2. **i18n Parity:** EN has 8 `##` headings, ES has 7

### Suggestions (INFO)
- Writing voice: no failure narrative detected — consider adding one

### Verdict: NEEDS FIXES (4 blocking, 2 warnings)
```

## Guardrails

### Scope Limits

- **Maximum files:** 0 (read-only, no modifications)
- **Maximum LOC:** 0 (no code changes)
- **Allowed directories:** `src/content/blog/`, `public/images/blog/`, `src/content/tags/`, `src/content/series/` (read-only)
- **Forbidden actions:** Creating, editing, or deleting any files

### Safety Checks

- [ ] This skill is read-only — it MUST NOT modify any files
- [ ] Build validation runs against the entire project, not just the post
- [ ] Report clearly distinguishes FAIL (blocking) from WARN (non-blocking) from INFO (suggestions)

### Stop Conditions

**Stop immediately** and report if:

- Post files cannot be found for the given slug
- Slug matches a demo post in `_demo/` (demo posts are not published — auditing is not applicable)
- User has not provided a slug and has not responded to the prompt asking for one

## Definition of Done

This skill is **complete** when ALL of the following are true:

- [ ] All 10 steps have been executed
- [ ] Every check has a clear PASS, FAIL, WARN, or INFO status
- [ ] The final report is generated with the summary table
- [ ] All blocking issues are listed with specific file locations and line numbers
- [ ] A final verdict is rendered (READY TO PUBLISH or NEEDS FIXES)
- [ ] No files have been modified

## Escalation Conditions

**Escalate to user** if:

- Build fails for reasons unrelated to the audited post
- Post uses MDX with custom components that cannot be statically analyzed
- Frontmatter contains fields not in the standard schema

## Examples

### Example 1: Clean Post

**Input:**
```
$SLUG: march-2026-meetup-recap
```

**Result:** All 10 steps pass. Verdict: READY TO PUBLISH.

### Example 2: Post with Issues

**Input:**
```
$SLUG: from-programmer-to-orchestrator
```

**Result:** 2 FAILs (description too long, missing accent in ES), 1 WARN (title over 60 chars). Verdict: NEEDS FIXES (2 blocking, 1 warning).

### Example 3: No Slug Provided

**Input:**
```
/audit-post
```

**Result:** Skill lists recent posts and asks: "Which post would you like to audit? Provide the slug (e.g., `march-2026-meetup-recap`)."

### Example 4: Post Not Found

**Input:**
```
$SLUG: nonexistent-post
```

**Result:** Error — no files found matching `*_nonexistent-post.md` in either `en/` or `es/`. Stopped.

## Related Skills/Agents

- [`audit-series`](../audit-series/SKILL.md) — **Series-level audit.** While audit-post checks individual posts, audit-series validates the series as a whole: series definition, post ordering, cross-post consistency, and navigation. Use `/audit-series {slug}` when auditing a post that belongs to a series.
- [`add-blog-post`](../add-blog-post/SKILL.md) — Creates blog posts (run audit-post after creation)
- [`translate-sync`](../translate-sync/SKILL.md) — Fix i18n parity issues found by audit
- [`optimize-image`](../optimize-image/SKILL.md) — Fix image format/size issues found by audit
- [`quick-fix`](../quick-fix/SKILL.md) — Fix small issues found by audit
- [`fix-lint`](../fix-lint/SKILL.md) — Fix formatting issues
- [`content-writer`](../../agents/content-writer.md) — Rewrite content to fix voice/quality issues
- [`i18n-guardian`](../../agents/i18n-guardian.md) — Verify translation quality for issues found by audit
- [`reviewer`](../../agents/reviewer.md) — Broader code review (audit-post is blog-specific)

## Changelog

> **Policy:** Keep only the 3 most recent entries. When adding a new entry, remove the oldest.

| Version | Date       | Changes |
| ------- | ---------- | ------- |
| 1.0.0   | 2026-03-23 | Initial version — 10-step comprehensive blog post audit covering frontmatter, SEO, AEO, images, accessibility, content quality, i18n parity, resources, build validation, and final report. |
