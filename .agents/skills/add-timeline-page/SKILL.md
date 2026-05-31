---
name: add-timeline-page
description: Add a new tag-filtered infinite-scroll timeline page (e.g. /trading, /entrepreneur). Use proactively when adding a new page that displays a vertical timeline of blog posts filtered by a specific tag.
# === Universal fields ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: haiku
tier: 1
intent: create
max-files: 8
max-loc: 300
---

# Skill: Add Timeline Page

## Objective

Add a new tag-filtered timeline page (like `/tech-talks` or `/dailybot`) that displays blog posts in an infinite-scroll vertical timeline. Covers: page component, EN+ES thin wrappers, translations, and AEO markdown files.

## Non-Goals

- Does NOT create blog posts or tags for the new page
- Does NOT modify the shared `TagTimelineInfiniteScroll.svelte` component
- Does NOT modify the API endpoint (`/api/timeline/[lang]/[tag].json`) — it auto-discovers all tags
- Does NOT add navigation links to the new page (handled separately)

## Tier Classification

**Tier: 1** — Light

**Reasoning:** Pattern-following task. The architecture is established by `TechTalksPage.astro` and `DailybotPage.astro`. This skill copies the pattern with new tag/content.

## Inputs

### Required Parameters

- `$TAG`: The blog tag slug that filters posts for this timeline (e.g. `trading`, `entrepreneur`)
- `$SLUG`: The URL slug for the page (e.g. `trading`, `my-journey`) — usually same as `$TAG`
- `$PAGE_KEY`: The translation key name — must be a valid JS property (e.g. `tradingPage`, `entrepreneurPage`). Used as `t.$PAGE_KEY.title`, `t.$PAGE_KEY.description`, etc.
- `$PAGE_TITLE_EN`: English page title (e.g. "Trading Journal")
- `$PAGE_TITLE_ES`: Spanish page title (e.g. "Diario de Trading")

### Optional Parameters

- `$ANALYTICS_PAGE_NAME`: Name used in analytics events (default: `$SLUG`)

## Prerequisites

Before running this skill, ensure:

- [ ] The tag `$TAG` already exists in `src/content/tags/` (or posts already use it)
- [ ] Translation keys for the new page exist in `src/lib/translations/en.ts` and `es.ts` (add them first if missing)
- [ ] `TagTimelineInfiniteScroll.svelte` exists at `src/components/blog/TagTimelineInfiniteScroll.svelte`
- [ ] `getTimelineIndex` is exported from `src/lib/blog.ts`

## Steps

### Step 1: Read existing page components for reference

Read `src/components/pages/TechTalksPage.astro` in full. Use it as the template for the new page component.

### Step 2: Create the page component

Create `src/components/pages/{PageName}Page.astro` modeled on `TechTalksPage.astro`:

```astro
---
import { getCollection } from 'astro:content';
import TagTimelineInfiniteScroll from '@/components/blog/TagTimelineInfiniteScroll.svelte';
import JsonLd from '@/components/JsonLd.astro';
import PageHero from '@/components/pages/PageHero.astro';
import ScrollToTimeline from '@/components/pages/ScrollToTimeline.svelte';
import MainLayout from '@/layouts/MainLayout.astro';
import { getTimelineIndex } from '@/lib/blog';
import { BLOG_PAGE_SIZE } from '@/lib/constances';
import { getUrlPrefix, type Language } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

interface Props { lang: Language; }
const { lang } = Astro.props;
const t = getTranslations(lang);
const prefix = getUrlPrefix(lang);
const siteUrl = Astro.site?.href?.replace(/\/$/, '') ?? '';

const allPosts = await getTimelineIndex('$TAG', lang);
const initialPosts = allPosts.slice(0, BLOG_PAGE_SIZE);
const totalCount = allPosts.length;
const timelineApiEndpoint = `/api/timeline/${lang}/$TAG.json`;

const allTags = await getCollection('tags');
const topicTagNames = allTags
  .filter((tag) => tag.data.tier === 'secondary' || tag.data.tier === 'subtopic')
  .map((tag) => tag.data.name);

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}${prefix}/` },
    { '@type': 'ListItem', position: 2, name: t.$PAGE_KEY.title, item: `${siteUrl}${prefix}/$SLUG` },
  ],
};
---

<MainLayout
  lang={lang}
  title={t.$PAGE_KEY.title}
  description={t.$PAGE_KEY.description}
  keywords={lang === 'en'
    ? ['keyword1 en', 'keyword2 en']
    : ['keyword1 es', 'keyword2 es']}
>
  <Fragment slot="head"><JsonLd data={breadcrumbSchema} /></Fragment>
  <PageHero title={t.$PAGE_KEY.title} subtitle={t.$PAGE_KEY.subtitle} description={t.$PAGE_KEY.heroDescription} image="/images/$SLUG.png" />

  <!-- Add page-specific content sections here -->

  <section id="timeline" class="py-12 md:py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="main-container">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        {t.$PAGE_KEY.timelineTitle}
      </h2>
      <TagTimelineInfiniteScroll
        client:visible
        {initialPosts}
        {totalCount}
        apiEndpoint={timelineApiEndpoint}
        {lang}
        {topicTagNames}
        pageSize={BLOG_PAGE_SIZE}
        pageName="$ANALYTICS_PAGE_NAME"
        emptyStateMessage={t.$PAGE_KEY.emptyState}
      />
    </div>
  </section>
  <ScrollToTimeline client:load lang={lang} targetLabel={t.$PAGE_KEY.timelineTitle} />
</MainLayout>
```

### Step 3: Create thin page wrappers (EN + ES)

**`src/pages/$SLUG.astro`** (3 lines):
```astro
---
import {PageName}Page from '@/components/pages/{PageName}Page.astro';
---
<{PageName}Page lang="en" />
```

**`src/pages/es/$SLUG.astro`** (3 lines):
```astro
---
import {PageName}Page from '@/components/pages/{PageName}Page.astro';
---
<{PageName}Page lang="es" />
```

### Step 4: Add translation keys

Add the new page's translation keys to BOTH `src/lib/translations/en.ts` and `es.ts`. Required keys (where `$PAGE_KEY` is a valid JS property like `tradingPage`):
- `$PAGE_KEY.title`
- `$PAGE_KEY.subtitle`
- `$PAGE_KEY.description`
- `$PAGE_KEY.heroDescription`
- `$PAGE_KEY.timelineTitle`
- `$PAGE_KEY.emptyState`

Also update `src/lib/translations/types.ts` with the new interface.

### Step 5: Create AEO markdown files

Create `src/content/pages/en/$SLUG.md` and `src/content/pages/es/$SLUG.md` following the format from `docs/aeo/MARKDOWN_FOR_AGENTS.md`. Include a note about infinite scroll loading.

### Step 6: Validate

```bash
pnpm run biome:check
pnpm run astro:check
pnpm run build
```

Verify the new page appears in the build and the AEO `.md` endpoint is generated.

## Output Format

### Success Output

```
✅ New timeline page created: /$SLUG (EN) and /es/$SLUG (ES)
Files created:
  - src/components/pages/{PageName}Page.astro
  - src/pages/$SLUG.astro
  - src/pages/es/$SLUG.astro
  - src/content/pages/en/$SLUG.md
  - src/content/pages/es/$SLUG.md
Files modified:
  - src/lib/translations/en.ts
  - src/lib/translations/es.ts
  - src/lib/translations/types.ts
Build: ✅ | Biome: ✅ | TypeScript: ✅
```

### Failure Output

```
❌ Blocked: {reason}
Missing prerequisite: {description}
```

## Guardrails

### Scope Limits

- **Maximum files:** 8
- **Allowed directories:** `src/components/pages/`, `src/pages/`, `src/pages/es/`, `src/lib/translations/`, `src/content/pages/`
- **Forbidden:** Modifying `TagTimelineInfiniteScroll.svelte`, `blog.ts`, or the API endpoint

### Safety Checks

Before creating files:

- [ ] Tag `$TAG` exists in `src/content/tags/` or is used in posts
- [ ] Translation key `$PAGE_KEY` doesn't conflict with existing keys
- [ ] Page slug `$SLUG` doesn't conflict with existing pages

### Stop Conditions

**Stop immediately** and report if:

- Tag `$TAG` has zero posts (nothing to show in timeline)
- Translation types.ts would require architectural changes
- Page slug conflicts with an existing route

## Definition of Done

This skill is **complete** when ALL of the following are true:

- [ ] Page component created at `src/components/pages/{PageName}Page.astro`
- [ ] EN wrapper at `src/pages/$SLUG.astro`
- [ ] ES wrapper at `src/pages/es/$SLUG.astro`
- [ ] Translation keys in both `en.ts` and `es.ts` and `types.ts`
- [ ] AEO markdown in both `en/$SLUG.md` and `es/$SLUG.md`
- [ ] Spanish content has correct diacritical marks
- [ ] `pnpm run biome:check` passes
- [ ] `pnpm run astro:check` passes
- [ ] `pnpm run build` succeeds
- [ ] New page appears at `/$SLUG` in the build output

## Escalation Conditions

**Escalate to a higher tier** (or ask user) if:

- The page requires custom interactive components beyond the standard timeline
- Translation types.ts needs structural changes (new nested interfaces)
- The page layout diverges significantly from the TechTalksPage pattern

**Escalation Path:**

1. First: Check if `add-page` skill is more appropriate
2. Then: If timeline-specific but complex, escalate to Tier 2 with `architect` agent
3. Finally: Ask user for guidance

## Examples

### Example 1: Add /trading page

**Input:**
```
$TAG: trading
$SLUG: trading
$PAGE_KEY: tradingPage
$PAGE_TITLE_EN: Trading Journal
$PAGE_TITLE_ES: Diario de Trading
```

**Output:** Creates `/trading` and `/es/trading` pages showing all posts tagged `trading` in a `TradingPage.astro` component with `t.tradingPage.*` translations.

### Example 2: Add /entrepreneur page

**Input:**
```
$TAG: entrepreneur
$SLUG: entrepreneur
$PAGE_KEY: entrepreneurPage
$PAGE_TITLE_EN: Entrepreneurship Journey
$PAGE_TITLE_ES: Viaje Emprendedor
```

**Output:** Creates `/entrepreneur` and `/es/entrepreneur` pages in an `EntrepreneurPage.astro` component.

## Related Skills/Agents

- [`add-page`](../add-page/SKILL.md) - Generic page creation (no timeline pattern)
- [`translate-sync`](../translate-sync/SKILL.md) - For syncing translation content
- [`add-component`](../add-component/SKILL.md) - For creating the page component

## Changelog

> **Policy:** Keep only the 3 most recent entries. When adding a new entry, remove the oldest.

| Version | Date       | Changes         |
| ------- | ---------- | --------------- |
| 1.1.0   | 2026-03-09 | Added `$PAGE_KEY` param, `keywords` SEO prop, Escalation Conditions section |
| 1.0.0   | 2026-03-09 | Initial version — extracted from PLAN_timeline_infinite_scroll_pagination |
