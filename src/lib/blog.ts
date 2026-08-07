import { type CollectionEntry, getCollection } from 'astro:content';

import { BLOG_PAGE_SIZE } from './constances';
import { isFutureCalendarDate } from './dates';
import type { BlogParamsType, BlogPostsResultType, SeriesInfo } from './types';

const WORDS_PER_MINUTE = 240;

export interface SearchIndexEntry {
  id: string;
  slug: string;
  lang: string;
  title: string;
  description: string;
  pubDate: string;
  /** Primary-tier tag slugs only. */
  tags: string[];
  /** Secondary-tier tag slugs only (no longer merged with subtopic). */
  topics: string[];
  /** Subtopic-tier tag slugs (tier 3). */
  subtopics: string[];
  heroImage?: string;

  series?: string;
  seriesOrder?: number;
  seriesCurrent?: number;
  seriesTotal?: number;
  seriesTitle?: string;
}

/** Minimal post schema for timeline card rendering — leaner than SearchIndexEntry. */
export interface TimelineCardEntry {
  slug: string;
  lang: string;
  title: string;
  description: string;
  pubDate: string;
  /** All post tag slugs (every tier). Callers derive tier groups client-side via topicTagNames + subtopicTagNames. */
  tags: string[];
  heroImage?: string;

  seriesSlug?: string;
  seriesCurrent?: number;
  seriesTotal?: number;
  seriesTitle?: string;

  /** Draft flag — true when the post has draft: true in frontmatter. Only carried into payloads on dev/preview (prod builds filter drafts out upstream). */
  isDraft?: boolean;
}

interface SeriesPosition {
  current: number;
  total: number;
}

let _seriesTitleCache: Map<string, string> | null = null;

async function getSeriesTitleMap(): Promise<Map<string, string>> {
  if (_seriesTitleCache) return _seriesTitleCache;
  const allSeries = await getCollection('series');
  _seriesTitleCache = new Map(
    allSeries.map((seriesEntry) => [
      seriesEntry.data.name,
      seriesEntry.data.title,
    ])
  );
  return _seriesTitleCache;
}

function getSeriesPositionById(
  posts: CollectionEntry<'blog'>[]
): Map<string, SeriesPosition> {
  const seriesGroups = new Map<string, CollectionEntry<'blog'>[]>();

  for (const post of posts) {
    if (!post.data.series) continue;
    const lang = getPostLanguage(post.id);
    const key = `${lang}:${post.data.series}`;
    const group = seriesGroups.get(key);
    if (group) {
      group.push(post);
    } else {
      seriesGroups.set(key, [post]);
    }
  }

  const positions = new Map<string, SeriesPosition>();

  for (const [, groupPosts] of seriesGroups) {
    const ordered = [...groupPosts].sort((a, b) => {
      const orderA = a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
    });

    const total = ordered.length;
    for (const [index, post] of ordered.entries()) {
      positions.set(post.id, { current: index + 1, total });
    }
  }

  return positions;
}

/**
 * Get the slug from a post ID (removes language prefix, _demo/ prefix, and date prefix).
 * e.g., "en/2022-07-08_first-post" -> "first-post"
 * e.g., "es/2020-12-31_personal-branding-tips" -> "personal-branding-tips"
 * e.g., "en/_demo/2025-01-01_demo-hero-banner" -> "demo-hero-banner"
 * e.g., "en/first-post" -> "first-post" (backwards compatible)
 */
export function getPostSlug(postId: string): string {
  const parts = postId.split('/');
  // Get the last segment (filename) — handles both "en/file" and "en/_demo/file"
  const filename = parts[parts.length - 1];
  // Strip date prefix (YYYY-MM-DD_) if present
  return filename.replace(/^\d{4}-\d{2}-\d{2}_/, '');
}

/**
 * Get the language from a post ID
 * e.g., "en/first-post" -> "en"
 */
export function getPostLanguage(postId: string): string {
  const parts = postId.split('/');
  return parts.length > 1 ? parts[0] : 'en';
}

/**
 * Look up a blog post by its public slug (no language/date prefix).
 * Used for cross-content references (e.g., a slide deck pointing back to its companion post).
 * Returns undefined if no post matches the slug in the given language.
 */
export async function getPostBySlug(
  slug: string,
  lang: string
): Promise<CollectionEntry<'blog'> | undefined> {
  const all = await getCollection('blog');
  return all.find(
    (post) => post.id.startsWith(`${lang}/`) && getPostSlug(post.id) === slug
  );
}

/**
 * Remove markdown/HTML/non-reading content and normalize for word counting.
 *
 * Excludes from the count:
 *  - Frontmatter block
 *  - Everything from the trailing `## Recursos` / `## Resources` heading
 *    onward (citations are skim, not prose)
 *  - Fenced and inline code blocks (skim/copy, not read)
 *  - Markdown image syntax `![alt](url)`
 *  - HTML `<figure>` blocks entirely (alt text and figcaption are
 *    author-aid / accessibility, not reader time)
 *  - All other HTML tags
 *  - Markdown formatting characters (#, *, _, etc.)
 *
 * Preserves:
 *  - Visible text inside markdown links `[text](url)` -> `text`
 *  - Hyphenated compounds (counted as one word)
 */
function normalizeContentForWordCount(content: string): string {
  return content
    .replace(/^---\n[\s\S]*?\n---\n?/, '')
    .replace(/\n## (Recursos|Resources)\b[\s\S]*$/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/<figure[\s\S]*?<\/figure>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Count words in markdown/MDX content.
 */
export function getWordCount(content: string): number {
  const normalized = normalizeContentForWordCount(content);
  return normalized.length > 0 ? normalized.split(' ').length : 0;
}

/**
 * Estimate reading time in minutes from markdown/MDX content.
 */
export function getReadingTimeFromContent(content: string): number {
  const wordCount = getWordCount(content);
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/**
 * Check if a post is a demo post (stored in _demo/ folder).
 * Demo posts are excluded from listings and only accessible via direct URL in dev mode.
 */
export function isDemoPost(post: CollectionEntry<'blog'>): boolean {
  return post.id.includes('/_demo/');
}

/**
 * Branches that deploy to the public production site. Override with the
 * PRODUCTION_BRANCHES env var (comma-separated) if the deployment topology
 * changes. `master` is included as a safe default for forks.
 */
const PRODUCTION_BRANCHES: readonly string[] = (
  process.env.PRODUCTION_BRANCHES ?? 'main,master'
)
  .split(',')
  .map((b) => b.trim())
  .filter(Boolean);

/**
 * Check if a post is marked as a draft. Drafts are visible in the dev server
 * and on Cloudflare Pages preview branches, but hidden from the production
 * build. Mark a post with `draft: true` in its frontmatter.
 */
export function isDraftPost(post: CollectionEntry<'blog'>): boolean {
  return post.data.draft === true;
}

/**
 * True when the current build should hide draft posts.
 *
 * Drafts are shown in the dev server and on any Cloudflare Pages preview
 * branch (so reviewers can read work-in-progress before it ships), and
 * hidden on production branches and in local production builds. Set
 * `SHOW_DRAFTS=true` to force drafts into any build.
 */
export function shouldHideDrafts(): boolean {
  if (import.meta.env.DEV) return false;
  if (process.env.SHOW_DRAFTS === 'true') return false;
  const cfBranch = process.env.CF_PAGES_BRANCH;
  if (cfBranch) return PRODUCTION_BRANCHES.includes(cfBranch);
  // No Cloudflare branch info (local `npm run build`): treat as production.
  return true;
}

/**
 * Unified visibility predicate used by every blog-listing consumer. Keeps
 * the filter rules (demo / scheduled / draft) in one place so listings,
 * tag pages, series pages, search, RSS, sitemap, and agent Markdown
 * endpoints stay in sync.
 */
export function isPostVisibleInProduction(
  post: CollectionEntry<'blog'>
): boolean {
  if (isDemoPost(post)) return false;
  if (!import.meta.env.DEV && isScheduledPost(post)) return false;
  if (isDraftPost(post) && shouldHideDrafts()) return false;
  return true;
}

/**
 * Check if a post is scheduled for the future (pubDate date > today's date).
 * Uses SITE_TIMEZONE (America/Bogota) so scheduling is consistent regardless
 * of where the build runs (Cloudflare, local, etc.). A post dated "March 4"
 * is scheduled until it's March 4 in Colombia.
 * Scheduled posts are excluded from production builds but visible in dev mode.
 */
export function isScheduledPost(post: CollectionEntry<'blog'>): boolean {
  return isFutureCalendarDate(post.data.pubDate);
}

/**
 * Build a lookup map of tag name -> tier from the tags collection.
 * Cached per call to avoid repeated collection queries within the same build.
 */
let _tagTierCache: Map<string, string> | null = null;
let _hierarchyValidated = false;

/**
 * Validate tag hierarchy integrity at build time.
 * Rules:
 *  - parent must resolve to a known tag
 *  - primary tags must NOT have a parent
 *  - secondary tags must parent to a primary tag
 *  - subtopic tags should have a parent (warns if missing)
 *  - subtopic tags should parent to a secondary tag (parenting to primary is allowed but flagged)
 * Runs once per build — does NOT throw (warnings only).
 */
async function validateTagHierarchy(): Promise<void> {
  if (_hierarchyValidated) return;
  _hierarchyValidated = true;

  const allTags = await getCollection('tags');
  const tagNames = new Set(allTags.map((t) => t.data.name));
  const tierByName = new Map<string, string>(
    allTags.map((t) => [t.data.name, t.data.tier])
  );

  for (const tag of allTags) {
    const { name, tier, parent } = tag.data;

    if (parent && !tagNames.has(parent)) {
      console.warn(
        `[tag-validation] Tag "${name}" has parent "${parent}" which does not exist`
      );
      continue;
    }

    if (tier === 'primary' && parent) {
      console.warn(
        `[tag-validation] Primary tag "${name}" should not have a parent`
      );
      continue;
    }

    if (tier === 'secondary' && parent) {
      const parentTier = tierByName.get(parent);
      if (parentTier !== 'primary') {
        console.warn(
          `[tag-validation] Secondary tag "${name}" has parent "${parent}" which is not a primary tag (tier: ${parentTier})`
        );
      }
    }

    if (tier === 'subtopic') {
      if (!parent) {
        console.warn(
          `[tag-validation] Subtopic tag "${name}" has no parent — subtopic tags should parent to a secondary or primary tag`
        );
        continue;
      }
      const parentTier = tierByName.get(parent);
      if (parentTier !== 'secondary' && parentTier !== 'primary') {
        console.warn(
          `[tag-validation] Subtopic tag "${name}" has parent "${parent}" which is not a secondary or primary tag (tier: ${parentTier})`
        );
      } else if (parentTier === 'primary') {
        console.warn(
          `[tag-validation] Subtopic tag "${name}" parents directly to primary tag "${parent}" — consider parenting to a secondary tag instead`
        );
      }
    }
  }
}

/**
 * Per-domain accent colors for subtopic tag chevrons. Each subtopic inherits
 * its parent secondary tag's domain color, creating a visual "this belongs to
 * that family" cue. Class strings are kept literal so Tailwind's content
 * scanner picks them up.
 */
const SUBTOPIC_ACCENT_BY_PARENT: Record<string, string> = {
  'web-development': 'text-blue-500 dark:text-blue-400',
  javascript: 'text-yellow-500 dark:text-yellow-400',
  devops: 'text-orange-500 dark:text-orange-400',
  python: 'text-amber-500 dark:text-amber-400',
  ai: 'text-violet-500 dark:text-violet-400',
  'ai-agents': 'text-fuchsia-500 dark:text-fuchsia-400',
  mobile: 'text-emerald-500 dark:text-emerald-400',
  blockchain: 'text-green-500 dark:text-green-400',
  design: 'text-pink-500 dark:text-pink-400',
  iot: 'text-cyan-500 dark:text-cyan-400',
  database: 'text-indigo-500 dark:text-indigo-400',
  university: 'text-rose-500 dark:text-rose-400',
};

const SUBTOPIC_ACCENT_FALLBACK = 'text-gray-600 dark:text-gray-300';

let _subtopicAccentCache: Record<string, string> | null = null;

/**
 * Build a subtopic-slug → tailwind chevron color class map. Only includes tags
 * whose tier is `subtopic`. Cached once per build.
 */
export async function getSubtopicAccentMap(): Promise<Record<string, string>> {
  if (_subtopicAccentCache) return _subtopicAccentCache;
  const allTags = await getCollection('tags');
  const map: Record<string, string> = {};
  for (const tag of allTags) {
    if (tag.data.tier !== 'subtopic') continue;
    const parent = tag.data.parent;
    map[tag.data.name] =
      (parent && SUBTOPIC_ACCENT_BY_PARENT[parent]) || SUBTOPIC_ACCENT_FALLBACK;
  }
  _subtopicAccentCache = map;
  return map;
}

async function getTagTierMap(): Promise<Map<string, string>> {
  if (_tagTierCache) return _tagTierCache;
  const allTags = await getCollection('tags');
  _tagTierCache = new Map(allTags.map((tag) => [tag.data.name, tag.data.tier]));
  await validateTagHierarchy();
  return _tagTierCache;
}

/**
 * Get the tier of a tag by name. Returns 'primary' if tag is not found in the collection.
 */
export async function getTagTier(
  tagName: string
): Promise<'primary' | 'secondary' | 'subtopic'> {
  const tierMap = await getTagTierMap();
  return (
    (tierMap.get(tagName) as 'primary' | 'secondary' | 'subtopic') || 'primary'
  );
}

/**
 * Split a post's tags into primary, secondary, and subtopic groups using the tags collection.
 * Tags whose tier cannot be resolved fall back to `primaryTags`.
 */
export async function groupPostTags(tags: string[]): Promise<{
  primaryTags: string[];
  secondaryTags: string[];
  subtopicTags: string[];
}> {
  const tierMap = await getTagTierMap();
  const primaryTags: string[] = [];
  const secondaryTags: string[] = [];
  const subtopicTags: string[] = [];
  for (const tag of tags) {
    const tier = tierMap.get(tag) || 'primary';
    if (tier === 'secondary') {
      secondaryTags.push(tag);
    } else if (tier === 'subtopic') {
      subtopicTags.push(tag);
    } else {
      primaryTags.push(tag);
    }
  }
  return { primaryTags, secondaryTags, subtopicTags };
}

/**
 * Build the search index for client-side blog search.
 * Same structure as /api/posts.json — used to inline the index at build time
 * so search works without a runtime fetch (fixes 404 on some deployments).
 */
let _searchIndexCache: Promise<SearchIndexEntry[]> | null = null;

async function buildSearchIndex(): Promise<SearchIndexEntry[]> {
  const allPosts = await getCollection('blog');
  const visiblePosts = allPosts.filter(isPostVisibleInProduction);
  const seriesPositionById = getSeriesPositionById(visiblePosts);
  const seriesTitleBySlug = await getSeriesTitleMap();

  return Promise.all(
    visiblePosts.map(async (post) => {
      const allTags = post.data.tags || [];
      const { primaryTags, secondaryTags, subtopicTags } =
        await groupPostTags(allTags);
      const seriesPosition = seriesPositionById.get(post.id);
      const seriesSlug = post.data.series;
      return {
        id: post.id,
        slug: getPostSlug(post.id),
        lang: getPostLanguage(post.id),
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate.toISOString(),
        tags: primaryTags,
        topics: secondaryTags,
        subtopics: subtopicTags,
        heroImage: post.data.heroImage,
        series: seriesSlug,
        seriesOrder: post.data.seriesOrder,
        seriesCurrent: seriesPosition?.current,
        seriesTotal: seriesPosition?.total,
        seriesTitle: seriesSlug ? seriesTitleBySlug.get(seriesSlug) : undefined,
      };
    })
  );
}

export async function getSearchIndex(): Promise<SearchIndexEntry[]> {
  if (!_searchIndexCache) {
    _searchIndexCache = buildSearchIndex();
  }
  return _searchIndexCache;
}

export async function getSearchIndexByLanguage(
  lang: string
): Promise<SearchIndexEntry[]> {
  const searchIndex = await getSearchIndex();
  return searchIndex.filter((post) => post.lang === lang);
}

/**
 * Build a full timeline index for a specific tag and language.
 * Returns ALL matching posts as TimelineCardEntry[] (no pagination) — callers paginate client-side.
 * Reuses getBlogPosts for consistent filtering, sorting, and series enrichment.
 */
export async function getTimelineIndex(
  tag: string,
  lang: string
): Promise<TimelineCardEntry[]> {
  // pageSize: 9999 ensures all matching posts are returned (no actual pagination)
  const { postsResult } = await getBlogPosts({ lang, tag, pageSize: 9999 });

  return postsResult.map((post) => {
    const enriched = post as CollectionEntry<'blog'> & {
      seriesCurrent?: number;
      seriesTotal?: number;
      seriesTitle?: string;
    };
    return {
      slug: getPostSlug(post.id),
      lang: getPostLanguage(post.id),
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate.toISOString(),
      tags: post.data.tags ?? [],
      heroImage: post.data.heroImage,
      seriesSlug: post.data.series,
      seriesCurrent: enriched.seriesCurrent,
      seriesTotal: enriched.seriesTotal,
      seriesTitle: enriched.seriesTitle,
      isDraft: isDraftPost(post),
    };
  });
}

/**
 * Build a full timeline index for a specific series and language.
 * Returns ALL matching posts as TimelineCardEntry[] sorted by seriesOrder ascending (chapter order).
 * Callers paginate client-side.
 */
export async function getSeriesTimelineIndex(
  seriesSlug: string,
  lang: string
): Promise<TimelineCardEntry[]> {
  const allPosts = await getCollection('blog');
  const seriesTitleBySlug = await getSeriesTitleMap();

  const filteredPosts = allPosts.filter(
    (post) =>
      post.id.startsWith(`${lang}/`) &&
      post.data.series === seriesSlug &&
      isPostVisibleInProduction(post)
  );

  const seriesPositionById = getSeriesPositionById(filteredPosts);

  // Sort by seriesOrder ascending (chapter 1 first, then 2, 3...)
  const sorted = [...filteredPosts].sort((a, b) => {
    const orderA = a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
  });

  return sorted.map((post) => {
    const position = seriesPositionById.get(post.id);
    return {
      slug: getPostSlug(post.id),
      lang: getPostLanguage(post.id),
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate.toISOString(),
      tags: post.data.tags ?? [],
      heroImage: post.data.heroImage,
      seriesSlug: post.data.series,
      seriesCurrent: position?.current,
      seriesTotal: position?.total,
      seriesTitle: seriesTitleBySlug.get(seriesSlug),
      isDraft: isDraftPost(post),
    };
  });
}

export async function getBlogPosts(
  params: BlogParamsType
): Promise<BlogPostsResultType> {
  const allPosts: CollectionEntry<'blog'>[] = await getCollection('blog');
  const tagsResult: CollectionEntry<'tags'>[] = await getCollection('tags');

  // Filter by language first (based on folder structure: en/, es/)
  const lang = params.lang || 'en';
  const langPosts = allPosts.filter(
    (post) => post.id.startsWith(`${lang}/`) && isPostVisibleInProduction(post)
  );
  const seriesPositionById = getSeriesPositionById(langPosts);
  const seriesTitleBySlug = await getSeriesTitleMap();
  let posts: CollectionEntry<'blog'>[] = [...langPosts];

  // Get all unique tags that are actually used in visible posts for this language
  const usedTags = Array.from(
    new Set(posts.flatMap((post) => post.data.tags ?? []))
  );

  // Filter tagsResult to only include tags that are used in posts
  const filteredTags = tagsResult.filter((tag) =>
    usedTags.includes(tag.data.name)
  );

  // Filter by tag if specified (works for both primary and secondary tags)
  if (params.tag) {
    posts = posts.filter((post) =>
      post.data.tags?.includes(params.tag as string)
    );
  }

  // Sort by publication date (newest first)
  posts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  // Calculate total pages based on filtered posts
  const totalPages = Math.ceil(
    posts.length / (params.pageSize ?? BLOG_PAGE_SIZE)
  );

  // Apply pagination
  if (params.page) {
    const startIndex = (params.page - 1) * (params.pageSize ?? BLOG_PAGE_SIZE);
    const endIndex = params.page * (params.pageSize ?? BLOG_PAGE_SIZE);
    posts = posts.slice(startIndex, endIndex);
  } else {
    posts = posts.slice(0, params.pageSize ?? BLOG_PAGE_SIZE);
  }

  // Enrich posts with series position for BlogCard
  const enrichedPosts = posts.map((post) => ({
    ...post,
    seriesCurrent: seriesPositionById.get(post.id)?.current,
    seriesTotal: seriesPositionById.get(post.id)?.total,
    seriesTitle: post.data.series
      ? seriesTitleBySlug.get(post.data.series)
      : undefined,
  }));

  const result: BlogPostsResultType = {
    tagsResult: filteredTags,
    postsResult: enrichedPosts,
    currentPage: params.page ?? 1,
    pageSize: params.pageSize ?? BLOG_PAGE_SIZE,
    totalPages: totalPages,
    totalPostsAvailable: langPosts.length,
  };
  return result;
}

/**
 * Get series navigation info for a post that belongs to a series.
 * Returns series metadata, all posts in order, and prev/next navigation.
 */
export async function getSeriesNavigation(
  seriesSlug: string,
  currentPostId: string,
  lang: string
): Promise<SeriesInfo | null> {
  const allSeries = await getCollection('series');
  const seriesEntry = allSeries.find((s) => s.data.name === seriesSlug);
  if (!seriesEntry) return null;

  const allPosts = await getCollection('blog');
  const seriesPosts = allPosts
    .filter(
      (post) =>
        post.id.startsWith(`${lang}/`) &&
        post.data.series === seriesSlug &&
        post.data.seriesOrder != null &&
        isPostVisibleInProduction(post)
    )
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));

  const currentIndex = seriesPosts.findIndex(
    (post) => post.id === currentPostId
  );
  if (currentIndex === -1) return null;

  return {
    name: seriesEntry.data.name,
    title: seriesEntry.data.title,
    description: seriesEntry.data.description,
    posts: seriesPosts.map((post) => ({
      post,
      seriesOrder: post.data.seriesOrder ?? 0,
    })),
    currentIndex,
    previousPost: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
    nextPost:
      currentIndex < seriesPosts.length - 1
        ? seriesPosts[currentIndex + 1]
        : null,
  };
}

interface RelatedPostsParams {
  currentPostId: string;
  tags: string[];
  lang: string;
  limit?: number;
}

/**
 * Find related posts based on shared tags (primary weighted 2x, secondary 1x), with latest-post fallback.
 */
export async function getRelatedPosts(
  params: RelatedPostsParams
): Promise<CollectionEntry<'blog'>[]> {
  const { currentPostId, tags, lang, limit = 3 } = params;
  const allPosts = await getCollection('blog');
  const tierMap = await getTagTierMap();

  const candidates = allPosts
    .filter(
      (post) =>
        post.id.startsWith(`${lang}/`) &&
        post.id !== currentPostId &&
        isPostVisibleInProduction(post)
    )
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  if (!tags || tags.length === 0) {
    return candidates.slice(0, limit);
  }

  const scoredPosts = candidates
    .map((post) => {
      const postTags = post.data.tags ?? [];
      let score = 0;
      for (const tag of postTags) {
        if (tags.includes(tag)) {
          const tier = tierMap.get(tag) || 'primary';
          // Primary tag match = 2 points, secondary/subtopic = 1 point
          score += tier === 'primary' ? 2 : 1;
        }
      }
      return { post, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf();
    });

  const related = scoredPosts
    .filter((item) => item.score > 0)
    .slice(0, limit)
    .map((item) => item.post);

  if (related.length === limit) {
    return related;
  }

  const alreadyIncluded = new Set(related.map((post) => post.id));
  const fallback = candidates.filter((post) => !alreadyIncluded.has(post.id));

  return [...related, ...fallback].slice(0, limit);
}
