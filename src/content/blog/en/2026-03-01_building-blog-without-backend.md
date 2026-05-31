---
title: 'Architecture of a Scalable Blog Without a Backend'
description: 'How this blog scales without a backend: Content Collections, tag taxonomy, client search, series navigation, and bilingual builds.'
pubDate: '2026-03-01'
heroImage: '/images/blog/posts/building-blog-without-backend/hero.webp'
heroLayout: 'side-by-side'
tags: ["tech", "web-development", "astro", "svelte"]
keywords: ["static blog architecture Astro", "Astro Content Collections scalable blog", "blog tag taxonomy system", "client-side search static JSON", "Fuse.js blog search", "Astro blog series navigation", "bilingual blog Astro architecture"]
series: "building-xergioalex"
seriesOrder: 5
---

Running a blog is not the same as running a site. A site is a set of pages. A blog is a system — posts that need to be discovered, filtered, searched, grouped, related to each other, and served to readers in multiple languages. With a handful of posts, that is trivial. As the library grows, you start feeling the structure. At hundreds of posts, the architecture either holds or it doesn't.

The site was [built](/blog/building-xergioalex-website/), [fast](/blog/lighthouse-perfect-scores/), and [measured](/blog/measuring-what-matters-free-analytics/). Now it needed a blog engine that could scale without a server.

This is how I built it.

---

## Content Collections: The Blog's Data Layer

Content Collections is the backbone. Simple concept: instead of raw Markdown files you parse manually, posts are entries in a typed, schema-validated collection that Astro queries at build time.

Here is what the schema looks like:

```typescript
// src/content.config.ts
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroLayout: z.enum(['banner', 'side-by-side', 'minimal', 'none'])
      .default('banner')
      .optional(),
    tags: z.array(z.string()).optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
  }),
});
```

[Zod](https://zod.dev/) validates every post at build time. If a post is missing `title`, or if `pubDate` is malformed, or if `heroLayout` gets a value that is not in the enum, the build fails immediately with a clear error message. No runtime surprises. No posts with broken dates making it to production because nobody noticed.

Querying posts looks like this:

```typescript
import { getCollection } from 'astro:content';

const posts = await getCollection('blog', ({ id }) => !id.includes('/_demo/'));
```

The result is a typed array. Every element has `post.data.title`, `post.data.pubDate`, `post.data.tags` — all properly typed based on the Zod schema. TypeScript will catch a typo like `post.data.titel` at compile time, not at runtime on a live page.

And that's why it works at scale — the structure doesn't let you slip up.

### File naming as metadata

Posts use a date-prefix naming convention: `YYYY-MM-DD_slug.md`. The `2026-03-01_building-blog-without-backend.md` file you are reading right now is a direct example.

This was not an arbitrary choice. I needed files to have a natural sort order in the filesystem — when I open the `en/` directory, I want to see posts in chronological order without thinking about it. But more importantly, I needed a naming scheme that would not break as the blog grew.

The obvious alternative was numeric prefixes: `001_first-post.md`, `002_second-post.md`, and so on. That works at ten posts. At fifty, it still works. But what happens when I want to backfill a post from 2015 between two existing entries? I would need to renumber every file that comes after it. At a hundred posts, that is annoying. At a thousand, it is insanity. And every rename means updating references, breaking git history, and potentially introducing errors.

Dates solve this completely. A post from November 2015 is `2015-11-27_music-library-php-my-first-website.md`. A post from March 2026 is `2026-03-01_building-blog-without-backend.md`. They sort themselves. If I publish three posts on the same day, I just pick the right date and the slug does the rest. If I backfill an old post, it slots into the correct position automatically. No renaming, no cascading changes, no coordination.

A utility function called `getPostSlug()` strips the date prefix to generate clean URLs — so `/blog/building-blog-without-backend/` is what readers see, not `/blog/2026-03-01_building-blog-without-backend/`. The date is metadata for the filesystem, not for the reader.

The bilingual directory structure mirrors this exactly:

```
src/content/blog/
├── en/
│   └── 2026-03-01_building-blog-without-backend.md
└── es/
    └── 2026-03-01_building-blog-without-backend.md
```

Same slug, same date, two languages. I will come back to how the bilingual side works in a later section.

---

## The Blog System: What Gets Computed at Build Time

The blog system is made up of several interconnected pieces. All of them have one thing in common: every computation happens at build time, and the browser receives pre-rendered HTML.

### Listing, pagination, and filtering

The blog listing page displays posts sorted by publication date, newest first. Pagination splits them into groups of nine. Tag filtering lets readers see all posts under a given tag — `/blog/tag/python/` shows only Python posts. Related articles at the bottom of each post shows the three most topically similar posts based on shared tags.

None of this involves a server query. When you hit `/blog/page/2/`, Astro pre-generated that page at build time. When you hit `/blog/tag/python/`, Astro already ran the filter and generated that page. Dynamic routes in Astro are a build-time concept — the `[page]` and `[tag]` in file names tell Astro to generate one static page per value, computed by `getStaticPaths()`.

```typescript
// src/pages/blog/tag/[tag].astro
export async function getStaticPaths() {
  const posts = await getPublishedBlogPosts();
  const allTags = [...new Set(posts.flatMap((p) => p.data.tags ?? []))];
  return allTags.map((tag) => ({ params: { tag } }));
}
```

Every tag that exists in any post gets a page. If I publish a post tomorrow with a new tag, the next deploy generates that tag's page. Zero configuration needed.

### Reading time

Each post header shows an estimated reading time. This is computed at build time by counting words in the post body and dividing by an average reading speed. By the time the HTML reaches a browser, it is just a string: "8 min read." No client-side computation, no JavaScript required.

### Hero image layouts

Posts support four hero layouts: `banner` (full-width image above the title), `side-by-side` (image right, title left, responsive stacking), `minimal` (small thumbnail), and `none` (text-only, like this post). The layout is a frontmatter field that components read at build time. Choosing the right layout for a post's image aspect ratio — landscape images get `banner`, square images get `side-by-side` — makes every post look intentional rather than awkward.

### Related posts

At the bottom of every post, three related articles appear. The selection is not random and it is not "latest posts" — it uses a weighted scoring algorithm that understands the tag taxonomy:

```typescript
for (const tag of postTags) {
  if (tags.includes(tag)) {
    const tier = tierMap.get(tag) || 'primary';
    // Primary tag match = 2 points, secondary/subtopic = 1 point
    score += tier === 'primary' ? 2 : 1;
  }
}
```

A primary tag match (like `tech`) is worth twice as much as a secondary tag match (like `python`). Two posts sharing `tech` and `python` score higher than two posts sharing only `python` — section-level similarity carries more weight than topic-level overlap. The top three by score, falling back to newest-first for ties, appear as related posts.

Like everything else in this system, the scoring runs at build time. The browser receives three pre-selected HTML cards. No API call, no recommendation engine, no tracking cookies.

### Demo posts

One more piece of the content system worth mentioning: demo posts. These are structural reference posts stored in `_demo/` directories (`src/content/blog/en/_demo/`, `src/content/blog/es/_demo/`) that showcase blog features — hero layout variations, MDX capabilities, rich formatting, code highlighting across languages.

Demo posts are never shown in blog listings, tag pages, RSS feeds, or search results. They are filtered out at the query level with a single `!id.includes('/_demo/')` check. In production, they are completely invisible. In local dev, they are accessible by direct URL only. They exist so that I — and any AI agent contributing to this site — can verify how a specific feature renders without polluting the real blog with test content.

---

## Organizing Content: The Tag Taxonomy

Here is where things get interesting. When I launched the blog, I started with a handful of top-level tags: `tech`, `personal`, `portfolio`, `talks`, `trading`, `dailybot`. Six drawers. Clear enough.

As the content grew, every technical post ended up tagged `tech`. That included Django, MongoDB, Webpack, WebVR, GraphQL, Golang, Meteor.js, Docker, blockchain, TensorFlow, Spark, and the Astro site itself. Clicking `tech` returned everything I had ever written on any technical topic. Which is about as useful as a library that shelves every book under "Nonfiction."

At hundreds of posts, that flat structure becomes genuinely unusable.

### First attempt: a separate `topics` field

The obvious fix was obvious: add a second frontmatter field.

```yaml
# Early approach — separate fields
tags: ["tech"]
topics: ["python", "database"]
```

I updated the schema with a validated enum for topic values, migrated all existing posts, and updated the components to render topic badges differently from primary tag badges. It worked. A post tagged `python` was now discoverable by anyone looking for Python content, even if the word "python" did not appear in the title.

For a small blog, this is completely fine. But I kept thinking about where it was going.

As the blog evolved, I started seeing the cracks.

The first problem was extensibility. With the enum approach, adding a new topic meant editing `content.config.ts` — a code change, not a content change. For a system built around content-as-data, that felt wrong.

The second problem was metadata poverty. Each topic was just a string in an enum. There was nowhere to store a description, a display order, or a parent relationship. If I wanted to build a `/blog/tag/python/` page with a curated description and a list of related topics, I had nowhere to put that information.

The third problem was the deeper architectural one: tier information lived in the wrong place. Whether `python` was primary or secondary was encoded in which array it appeared in on each individual post. Understand the taxonomy structure? Read thousands of frontmatter files. That kind of distributed definition diverges silently over time.

At 1000 posts, a migration because I added a new enum value is a real cost. I went back to the drawing board.

### The unified collection architecture

Tag tier is a property of the tag, not a property of the post.

`python` is a secondary topic not because of how any individual post uses it, but because that is what `python` *is* in this taxonomy. The tier definition should live with the tag's own definition, not distributed across every post that uses it.

This is the architecture I have now. Every blog post uses a single `tags` array:

```yaml
# src/content/blog/en/2018-12-01_django-multiple-databases-university.md
---
tags: ["tech", "portfolio", "python", "database", "university"]
---
```

The post does not know or care which tier each tag belongs to. It just lists the labels that describe it.

The tier information lives in a separate `tags` Content Collection — one markdown file per tag:

```yaml
# src/content/tags/python.md
---
name: "python"
description: "Python ecosystem — Django, TensorFlow, MyPy, Spark."
tier: secondary
order: 6
parent: "tech"
---
```

```yaml
# src/content/tags/tech.md
---
name: "tech"
description: "Tutorials, guides, and technical articles."
tier: primary
order: 1
---
```

The collection schema validates the structure:

```typescript
const tags = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    tier: z.enum(['primary', 'secondary', 'subtopic']).default('primary'),
    parent: z.string().optional(),
    order: z.number().default(0),
  }),
});
```

Three tiers: `primary` for sections (tech, personal, portfolio), `secondary` for topics (python, database, web-development, devops), `subtopic` for future granularity (django, tensorflow, mongodb — wired into the schema but not yet populated). Adding a new tag means creating one file. No migrations. No enum changes. No code review for a content decision.

### Splitting tags at build time

Components need to distinguish primary tags from secondary ones to render them differently. That split happens at build time via `groupPostTags()` in `src/lib/blog.ts`:

```typescript
export async function groupPostTags(
  tags: string[]
): Promise<{ primaryTags: string[]; topicTags: string[] }> {
  const tierMap = await getTagTierMap();
  const primaryTags: string[] = [];
  const topicTags: string[] = [];
  for (const tag of tags) {
    const tier = tierMap.get(tag) || 'primary';
    if (tier === 'secondary' || tier === 'subtopic') {
      topicTags.push(tag);
    } else {
      primaryTags.push(tag);
    }
  }
  return { primaryTags, topicTags };
}
```

The tier map is built once per build and cached in memory — `getCollection('tags')` runs once at startup, and every subsequent call returns the in-memory map. O(1) lookup. Components receive `primaryTags` and `topicTags` as pre-sorted arrays.

### Build-time taxonomy validation

One thing I did not want was silent drift — a tag's parent gets renamed and posts quietly end up with orphaned relationships. `validateTagHierarchy()` catches these at build time:

```typescript
async function validateTagHierarchy(): Promise<void> {
  if (_hierarchyValidated) return;
  _hierarchyValidated = true;

  const allTags = await getCollection('tags');
  const tagNames = new Set(allTags.map((t) => t.data.name));

  for (const tag of allTags) {
    if (tag.data.parent && !tagNames.has(tag.data.parent)) {
      console.warn(
        `[tag-validation] Tag "${tag.data.name}" has parent "${tag.data.parent}" which does not exist`
      );
    }
    if (tag.data.tier === 'primary' && tag.data.parent) {
      console.warn(
        `[tag-validation] Primary tag "${tag.data.name}" should not have a parent`
      );
    }
    if (tag.data.parent) {
      const parentTag = allTags.find((t) => t.data.name === tag.data.parent);
      if (parentTag && parentTag.data.tier !== 'primary') {
        console.warn(
          `[tag-validation] Tag "${tag.data.name}" has parent "${tag.data.parent}" which is not a primary tag`
        );
      }
    }
  }
}
```

A tag can't reference a nonexistent parent, primary tags shouldn't have parents, and parent tags must be primary. Warnings, not errors — visible and fixable, but not blocking a deploy.

### Visual hierarchy

The visual distinction between primary and secondary tags needs to communicate hierarchy without requiring a legend. The convention I settled on:

**Primary tags** — filled blue badges with a `#` prefix:

```html
<a class="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800
          hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200
          dark:hover:bg-blue-800">
  #tech
</a>
```

**Secondary tags (topics)** — smaller, bordered gray badges without prefix:

```html
<a class="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-600
          hover:border-gray-400 hover:text-gray-800 dark:border-gray-600
          dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-gray-100">
  python
</a>
```

Size, weight, color, and border treatment all work together to make the hierarchy scannable. No tooltip. No "Tags vs Topics" label. The visual difference is self-evident, and it is consistent across blog cards, post headers, and related articles.

---

## Search Without a Server

The search system needed to treat topics as real search targets, not metadata. A reader searching for "python" should surface Python posts even if "python" does not appear in the title. And all of it needed to work without a backend.

The approach: a static JSON search index generated at build time, queried client-side.

The search index is generated at build time and exposed as static language shards (`/api/posts-en.json`, `/api/posts-es.json`). This is where `groupPostTags()` gets called so tags are pre-split:

```typescript
const { primaryTags, topicTags } = await groupPostTags(allTags);
return {
  id: post.id,
  slug: getPostSlug(post.id),
  lang: getPostLanguage(post.id),
  title: post.data.title,
  description: post.data.description,
  pubDate: post.data.pubDate.toISOString(),
  tags: primaryTags,
  topics: topicTags,
  heroImage: post.data.heroImage,
  heroWebpExists: heroWebpExists(post.data.heroImage),
};
```

The search scoring reflects the taxonomy hierarchy:

```typescript
// Score: lower is better (title > primary tags > topics > description)
const score = titleMatch
  ? 0.0
  : tagsMatch
    ? 0.1
    : topicsMatch
      ? 0.15
      : 0.2;
```

A title match is the strongest signal. A primary tag match is next. A topic match is slightly weaker than a primary tag — `python` might appear in a description for context without being the post's focus. A description match is the weakest signal.

All of this runs client-side from static JSON shards. The user types, JavaScript filters an in-memory index, and results appear instantly. There is no backend service or database query at request time — only static asset fetches from the CDN. The search UI is a Svelte island hydrated with `client:load`.

---

## Bilingual Content Architecture

The blog is fully bilingual in English and Spanish. Every post I write exists in both languages. This creates some architectural constraints worth explaining.

The routing model is language-prefix based. English posts are at `/blog/{slug}/`, Spanish posts are at `/es/blog/{slug}/`. Both use the same slug. The language switch in the header navigates between the two versions of the same post.

The key architectural decision is that pages in `src/pages/` are ultra-thin routing wrappers — about three lines each — and the real logic lives inside shared `*Page.astro` components:

```astro
---
// src/pages/blog/[...slug].astro — English wrapper
import BlogPostPage from '@/components/pages/blog/BlogPostPage.astro';
---
<BlogPostPage lang="en" />
```

```astro
---
// src/pages/es/blog/[...slug].astro — Spanish wrapper
import BlogPostPage from '@/components/pages/blog/BlogPostPage.astro';
---
<BlogPostPage lang="es" />
```

One component handles both languages. The `lang` prop drives which content collection subdirectory to query, which translation strings to use, and which URL prefix to apply to internal links.

Tag names are language-agnostic identifiers. A post in `en/` and its counterpart in `es/` use the same tags array. The tag collection is not duplicated per language — `python.md` is one file, and both English and Spanish posts reference it by the same identifier. This means I never have tag definitions drifting between languages.

The translation strings for the UI (pagination labels, "published on," "related posts," search placeholder) live in `src/lib/translations/en.ts` and `src/lib/translations/es.ts`. When a component needs user-visible text, it calls `getTranslations(lang)` and gets back the right object. Never hardcoded strings.

---

## Series: Connecting Posts Into a Narrative

Some posts are standalone. Others are chapters in a story. The posts in this "Building XergioAleX.com" series are a clear example — each builds on the last, and reading them in order gives you the full picture. The blog system needs to understand that relationship.

The architecture follows the same pattern as tags: a Content Collection for metadata, frontmatter fields on posts, and build-time resolution.

### The series collection

Each series is a markdown file in `src/content/series/`:

```yaml
# src/content/series/building-xergioalex.md
---
name: "building-xergioalex"
title: "Building XergioAleX.com"
description: "The complete story of building a modern personal website."
order: 1
---
```

Posts opt into a series with two frontmatter fields:

```yaml
series: "building-xergioalex"
seriesOrder: 5
```

That is it — one identifier and a position number. The system does the rest.

### Build-time series navigation

At build time, `getSeriesNavigation()` in `src/lib/blog.ts` collects all posts in the same series for the same language, sorts them by `seriesOrder`, and returns a typed `SeriesInfo` object with the table of contents, the current position, and previous/next references.

The `SeriesNavigation` component renders this as a blue-bordered panel at the bottom of each post: the series title, a numbered table of contents with the current chapter highlighted, and previous/next links. Like the tag taxonomy, all of this is pre-rendered HTML. No client-side queries, no JavaScript required.

### The visibility problem

But here is the thing — the series navigation panel sits at the very end of the post, after all the content. On a long article like this one, a reader might spend twenty minutes reading without ever scrolling past the content to discover that there are three other chapters. The information is there, but the UX hides it.

I ran into this same pattern on the portfolio and tech-talks pages, where timeline content lives below the fold. The solution there was a floating scroll-to-timeline button — a red pill that sits in the bottom-right corner and says "jump down to the timeline."

For series posts, I built `SeriesIndicator` — a floating button that appears in the bottom-right corner whenever the series navigation is below the viewport. It shows a circular progress ring with the current chapter position (e.g., "2/4"), the text "Chapter 2 of 4," and a "All chapters" call-to-action. Click it, and the page smooth-scrolls to the series navigation panel.

The indicator uses an `IntersectionObserver` to track whether the series navigation is visible. When the reader scrolls the navigation into view, the indicator disappears — it has done its job. The styling uses glassmorphism (`backdrop-blur`, subtle ring border) to feel present but not intrusive, and it slides in from the right with a CSS animation.

This is the kind of detail that separates "the feature works" from "the feature is discoverable." A reader landing on chapter three of a series immediately sees the floating indicator and knows there are other chapters. Without it, they might finish the post without ever realizing the series exists.

---

## Performance: Everything at Build Time

I want to be explicit about the common thread running through all of this, because it is the architectural insight that makes the whole system work.

Here's the thing: all of this runs at build time. By the time any HTML reaches a browser, the work is done.

The browser does not receive a JavaScript application that fetches posts from an API, resolves tag tiers, and renders everything dynamically. It receives static HTML pages, each one fully pre-rendered with the correct content, the correct tags split into their correct tiers, the correct pagination, the correct related posts. The only JavaScript that runs in the browser is for interactive islands: the search component, the mobile menu, the theme toggle.

The architecture flow:

```
Build time:
  Markdown files + tag collection + series collection
    → Zod validation (build fails on schema errors)
    → getCollection() queries
    → groupPostTags() (cached, O(1) after first call)
    → getSeriesNavigation() (series TOC, prev/next)
    → Reading time computation
    → Search index generation
    → Static HTML for every page, tag, pagination step
    → Static search shards (posts-en.json, posts-es.json)

Runtime (browser):
  Receives pre-rendered HTML
  Loads language-specific search shard on demand
  Svelte islands hydrate: search, menu, theme toggle, series indicator
  Zero collection queries
  Zero tier resolution logic
```

The result is what you see in the Lighthouse scores: Performance, Accessibility, Best Practices, and SEO all at 100 on mobile and desktop. Adding a complete tag taxonomy system — collection files, tier resolution, hierarchy validation, search integration — had zero impact on those scores. The complexity lives in the build. The browser gets clean HTML.

This is the promise of Astro's build-time model, and the blog system is a clean demonstration of it. You can build arbitrarily rich content architecture — multi-tier taxonomies, cross-reference systems, reading time, search indexes — and none of it costs the user anything at runtime. The work happens once, at deploy time, and the result ships everywhere, fast.

---

## Adding a New Tag: How It Works Now

I want to show concretely what the current system costs at the content-author level, because the architecture sounds more complex than it is to use.

Adding a new secondary tag — say, `golang` — takes exactly this:

```yaml
# src/content/tags/golang.md
---
name: "golang"
description: "Go language — services, CLIs, and backend projects."
tier: secondary
order: 12
parent: "tech"
---
```

That is one file. The next build automatically:
- Makes `golang` a valid tag for any post
- Routes it to `topicTags` instead of `primaryTags` in every component
- Generates a `/blog/tag/golang/` page
- Includes it in the search index with the correct tier
- Validates that `tech` (its parent) exists and is a primary tag

No schema changes. No post migrations. No component updates. One file, and the taxonomy is extended.

At 1000 posts, this matters enormously. You do not want to migrate a thousand files because you decided `golang` deserves its own tag. You create one file and move on.

---

## Reflecting on This Chapter

Every chapter in this series has been about making a decision that costs something now in exchange for a simpler path later. Chapter one: build with Astro's constraints and get performance for free. Chapter two: invest in visual identity and give the site a soul. Chapter three: invest in accessibility and get a passing grade from every audit tool. Chapter four: choose lightweight analytics tools and keep the scores you worked for. Chapter five: design the content architecture correctly before the content outgrows the container.

The taxonomy system I built handles hundreds or thousands of posts without any structural changes — just new content files. The series system connects related posts into a navigable narrative with a floating indicator that makes the connection discoverable. The search runs client-side from a static JSON index with no backend infrastructure to maintain. The bilingual system scales to any new post as a natural workflow, not a chore. Every page is pre-rendered static HTML with zero runtime cost to the user.

The best time to build a scalable blog system is before the content makes it hard. The second-best time is when you can feel the structure starting to strain. I caught it early enough that the migration was a few days of careful work and a satisfying diff — not a month-long rewrite.

Let's keep building.

---

## Resources

- **[Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)** — Official documentation for the collection and schema system used throughout this post.
- **[Zod Schema Validation](https://zod.dev/)** — The schema library used in `content.config.ts` for validating tag and blog post frontmatter.
- **[xergioalex.com source code](https://github.com/xergioalex/pereiratechtalks)** — The full repository where all of the code described here lives.
