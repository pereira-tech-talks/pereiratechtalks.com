<script lang="ts">
import type { CollectionEntry } from 'astro:content';
import { EVENTS, trackEvent } from '@/lib/analytics';
import { SITE_TIMEZONE } from '@/lib/constances';
import { getUrlPrefix, type Language } from '@/lib/i18n';
import { getHighlightedField, type SearchResult } from '@/lib/search';
import { getTranslations } from '@/lib/translations';

export let post: CollectionEntry<'blog'>;
export let lang: Language = 'en';
export let searchQuery: string = '';
export let searchResult: SearchResult | undefined = undefined;
export let topicTagNames: string[] = [];
export let subtopicTagNames: string[] = [];
export let subtopicAccentByName: Record<string, string> = {};
let postData: {
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
  topics: string[];
  subtopics: string[];
  heroImage?: string;
};
let postSlug = '';
let seriesCurrent: number | undefined;
let seriesTotal: number | undefined;
let seriesTitle: string | undefined;
let seriesBadgeLabel = '';

$: t = getTranslations(lang);
$: prefix = getUrlPrefix(lang);

// Helper function to get post slug without language prefix or date prefix
// e.g., "en/2022-07-08_first-post" -> "first-post"
function getPostSlug(): string {
  const id = post.id || post.slug || '';
  // Remove language prefix if present (en/, es/)
  let slug = id;
  if (slug.startsWith('en/') || slug.startsWith('es/')) {
    slug = slug.substring(3);
  }
  // Remove date prefix (YYYY-MM-DD.) if present
  slug = slug.replace(/^\d{4}-\d{2}-\d{2}_/, '');
  return slug;
}

// Helper function to get post data regardless of structure
function getPostData() {
  // If post has data property (CollectionEntry structure)
  if (post.data) {
    // Split unified tags array using tier name lookups
    const allTags: string[] = post.data.tags || [];
    const subtopic = allTags.filter((t) => subtopicTagNames.includes(t));
    const secondary = allTags.filter(
      (t) => topicTagNames.includes(t) && !subtopicTagNames.includes(t)
    );
    const primary = allTags.filter((t) => !topicTagNames.includes(t));
    return {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      tags: primary,
      topics: secondary,
      subtopics: subtopic,
      heroImage: post.data.heroImage,
    };
  }
  // If post is flat structure (search index) — already pre-grouped by API
  return {
    title: post.title,
    description: post.description,
    pubDate: new Date(post.pubDate),
    tags: post.tags || [],
    topics: post.topics || [],
    subtopics: post.subtopics || [],
    heroImage: post.heroImage,
  };
}

// Reference reactive inputs so Svelte re-runs when they change
$: {
  post;
  topicTagNames;
  subtopicTagNames;
  postData = getPostData();
}
$: postSlug = getPostSlug();
$: {
  const seriesCurrentValue = (post as any).seriesCurrent;
  const seriesTotalValue = (post as any).seriesTotal;
  seriesCurrent =
    typeof seriesCurrentValue === 'number' &&
    Number.isFinite(seriesCurrentValue)
      ? seriesCurrentValue
      : undefined;
  seriesTotal =
    typeof seriesTotalValue === 'number' && Number.isFinite(seriesTotalValue)
      ? seriesTotalValue
      : undefined;
  const seriesTitleValue = (post as any).seriesTitle;
  const rawSeriesTitle =
    typeof seriesTitleValue === 'string' ? seriesTitleValue : undefined;
  const seriesSlugForTitle =
    (post as any).seriesSlug ?? post.data?.series ?? (post as any).series;
  seriesTitle =
    (typeof seriesSlugForTitle === 'string' &&
      t.seriesNames[seriesSlugForTitle]) ||
    rawSeriesTitle;
}
let seriesSlug: string | undefined;
$: {
  const slug =
    (post as any).seriesSlug ?? post.data?.series ?? (post as any).series;
  seriesSlug = typeof slug === 'string' ? slug : undefined;
}
$: seriesBadgeLabel =
  seriesCurrent && seriesTotal
    ? seriesTitle
      ? `${seriesTitle} · ${t.seriesChapterOf(seriesCurrent, seriesTotal)}`
      : t.seriesChapterOf(seriesCurrent, seriesTotal)
    : '';
// Compute isScheduled client-side using SITE_TIMEZONE (America/Bogota) so it matches
// the server build — consistent regardless of Cloudflare/local or user location
$: isScheduled = (() => {
  const serverVal = (post as any).isScheduled;
  const pub = postData?.pubDate;
  if (!pub) return !!serverVal;
  const pubDate = typeof pub === 'string' ? new Date(pub) : pub;
  if (Number.isNaN(pubDate.getTime())) return !!serverVal;
  const todayInTz = new Date().toLocaleDateString('en-CA', {
    timeZone: SITE_TIMEZONE,
  });
  // pubDate is a calendar date, not a UTC moment — extract directly
  const pubDateStr = pubDate.toISOString().slice(0, 10);
  return pubDateStr > todayInTz;
})();

// Draft flag is server-computed (we pass it through the lightweight payload).
// A draft post that slipped into the client means we're on dev or a preview
// branch — the production build filters it upstream.
$: isDraft = !!(post as any).isDraft || post.data?.draft === true;

// Get highlighted title and description if search result is available
$: displayTitle = searchQuery
  ? getHighlightedField(
      searchResult as SearchResult,
      'title',
      postData.title,
      searchQuery
    )
  : postData.title;
$: displayDescription = searchQuery
  ? getHighlightedField(
      searchResult as SearchResult,
      'description',
      postData.description,
      searchQuery
    )
  : postData.description;
</script>

<article class="article-card group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
  <!-- Full-card clickable link (background layer) -->
  <a
    href={`${prefix}/blog/${postSlug}/`}
    class="absolute inset-0 z-0"
    aria-label={postData.title}
    on:click={() => trackEvent(EVENTS.BLOG_CARD_CLICK, { slug: postSlug })}
  ></a>
  {#if postData.heroImage}
    <div class="bg-gray-100 dark:bg-gray-700">
      <img
        src={postData.heroImage}
        alt=""
        width={400}
        height={192}
        class="w-full h-48 object-cover"
        loading="lazy"
      />
    </div>
  {/if}
  <div class="p-6">
    <h2 class="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
      {@html displayTitle}
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      {@html displayDescription}
    </p>
    <div class="relative z-10 flex flex-wrap justify-between items-center gap-2">
      <div class="flex flex-wrap items-center gap-2">
        <time class="text-sm text-gray-600 dark:text-gray-300">
          {postData.pubDate.toLocaleDateString(t.dateLocale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC'
          })}
        </time>
        {#if isScheduled}
          <span class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            {t.scheduledBadge}
          </span>
        {/if}
        {#if isDraft}
          <span class="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            {t.draftBadge}
          </span>
        {/if}
        {#if seriesCurrent && seriesTotal}
          <div class="group/series relative inline-flex items-center">
            {#if seriesSlug}
              <a
                href={`${prefix}/blog/series/${seriesSlug}/`}
                class="inline-flex items-center rounded-full border-2 border-blue-200 bg-blue-50/70 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 transition-colors hover:bg-blue-100 hover:border-blue-300 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50 dark:hover:border-blue-700"
                title={seriesBadgeLabel}
              >
                {seriesCurrent}/{seriesTotal}
              </a>
            {:else}
              <span
                class="inline-flex items-center rounded-full border-2 border-blue-200 bg-blue-50/70 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                title={seriesBadgeLabel}
              >
                {seriesCurrent}/{seriesTotal}
              </span>
            {/if}
            {#if seriesTitle}
              <span
                class="pointer-events-none absolute top-full left-1/2 z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover/series:opacity-100 group-focus-within/series:opacity-100 dark:bg-gray-100 dark:text-gray-900"
                role="tooltip"
              >
                {seriesTitle}
              </span>
            {/if}
          </div>
        {/if}
      </div>
      {#if (postData.tags && postData.tags.length > 0) || (postData.topics && postData.topics.length > 0) || (postData.subtopics && postData.subtopics.length > 0)}
        <div class="flex flex-wrap gap-1.5">
          {#each postData.tags as tag}
            <a
              href={`${prefix}/blog/tag/${tag}/`}
              class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              #{t.tagNames[tag] || tag}
            </a>
          {/each}
          {#each postData.topics as topic}
            <a
              href={`${prefix}/blog/tag/${topic}/`}
              class="text-xs px-2 py-1 rounded border border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              {t.tagNames[topic] || topic}
            </a>
          {/each}
          {#each postData.subtopics as sub}
            <a
              href={`${prefix}/blog/tag/${sub}/`}
              class="inline-flex items-center text-xs px-2 py-1 rounded bg-gray-50 text-gray-700 border border-dashed border-gray-300 hover:bg-gray-100 hover:border-gray-500 hover:text-gray-900 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:border-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              <span class={`mr-1 ${subtopicAccentByName[sub] || 'text-gray-600 dark:text-gray-300'}`} aria-hidden="true">›</span>{t.tagNames[sub] || sub}
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</article>