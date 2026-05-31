<script lang="ts">
import { onDestroy, onMount, tick } from 'svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import type { TimelineCardEntry } from '@/lib/blog';
import { SITE_TIMEZONE } from '@/lib/constances';
import { getUrlPrefix, type Language } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

export let initialPosts: TimelineCardEntry[] = [];
export let totalCount: number = 0;
export let apiEndpoint: string;
export let lang: Language = 'en';
export let topicTagNames: string[] = [];
export let subtopicTagNames: string[] = [];
export let subtopicAccentByName: Record<string, string> = {};
export let pageSize: number = 30;
/** Page identifier for analytics events (e.g. "techtalks", "dailybot") */
export let pageName: string = 'timeline';
/** Localised empty-state message passed from the parent page component */
export let emptyStateMessage: string = '';

$: t = getTranslations(lang);
$: prefix = getUrlPrefix(lang);

let renderedPosts: TimelineCardEntry[] = [...initialPosts];
/** Full dataset fetched from apiEndpoint — null until first fetch */
let allPosts: TimelineCardEntry[] | null = null;
let loading = false;
let fetchError = false;
$: allLoaded = renderedPosts.length >= totalCount;

let sentinel: HTMLElement;
let observer: IntersectionObserver | null = null;

onMount(() => {
  if (allLoaded) return;
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading && !allLoaded) {
        loadMore();
      }
    },
    { rootMargin: '200px' }
  );
  if (sentinel) observer.observe(sentinel);
});

onDestroy(() => {
  observer?.disconnect();
});

async function loadMore() {
  if (loading || allLoaded) return;
  loading = true;
  fetchError = false;
  try {
    if (!allPosts) {
      const res = await fetch(apiEndpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      allPosts = data.posts as TimelineCardEntry[];
    }
    const nextBatch = allPosts.slice(
      renderedPosts.length,
      renderedPosts.length + pageSize
    );
    renderedPosts = [...renderedPosts, ...nextBatch];
  } catch {
    fetchError = true;
  } finally {
    loading = false;
    await tick();
    reobserveSentinel();
  }
}

function reobserveSentinel(): void {
  if (!observer || !sentinel || allLoaded) return;
  observer.unobserve(sentinel);
  observer.observe(sentinel);
}

function isPostScheduled(pubDate: string): boolean {
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return false;
  const todayInTz = new Date().toLocaleDateString('en-CA', {
    timeZone: SITE_TIMEZONE,
  });
  return pubDate.slice(0, 10) > todayInTz;
}

function formatDate(pubDate: string): string {
  return new Date(pubDate).toLocaleDateString(t.dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getYear(pubDate: string): string {
  return new Date(pubDate).getFullYear().toString();
}

function getYearMonth(pubDate: string): string {
  const d = new Date(pubDate);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function getMonthName(pubDate: string): string {
  return new Date(pubDate).toLocaleDateString(t.dateLocale, { month: 'long' });
}

function buildSeriesBadgeLabel(
  current: number,
  total: number,
  title?: string
): string {
  const chapter = t.seriesChapterOf(current, total);
  return title ? `${title} · ${chapter}` : chapter;
}
</script>

{#if renderedPosts.length === 0 && !loading}
  <div class="text-center py-16">
    <p class="text-gray-600 dark:text-gray-300 text-lg">
      {emptyStateMessage || (lang === 'es' ? 'Aún no hay posts disponibles.' : 'No posts available yet.')}
    </p>
  </div>
{:else}
  <div class="relative py-8">
    <!-- Timeline line: left on mobile, centered on desktop -->
    <div class="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>

    {#each renderedPosts as post, index}
      {@const isLeft = index % 2 === 0}
      {@const year = getYear(post.pubDate)}
      {@const prevPost = index > 0 ? renderedPosts[index - 1] : null}
      {@const showYear = index === 0 || getYear(prevPost?.pubDate ?? '') !== year}
      {@const yearMonth = getYearMonth(post.pubDate)}
      {@const showMonth = index === 0 || getYearMonth(prevPost?.pubDate ?? '') !== yearMonth}

      <!-- Year marker -->
      {#if showYear}
        <div class="relative flex items-center h-8 mb-6 mt-4">
          <div class="absolute left-10 md:left-1/2 md:-translate-x-1/2 z-10">
            <span class="inline-block px-4 py-1.5 bg-secondary text-white text-sm font-bold rounded-full shadow-md">
              {year}
            </span>
          </div>
        </div>
      {/if}

      <!-- Month marker -->
      {#if showMonth}
        <div class="relative flex items-center h-6 mb-6 mt-4">
          <div class="absolute left-10 md:left-1/2 md:-translate-x-1/2 z-10">
            <span class="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full capitalize translate-y-1">
              {getMonthName(post.pubDate)}
            </span>
          </div>
        </div>
      {/if}

      <!-- Timeline item -->
      <div class="relative flex items-start mb-12 group">
        <!-- Dot on the line: left on mobile, centered on desktop -->
        <div class="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 mt-6">
          <div class="w-4 h-4 bg-secondary rounded-full border-4 border-white dark:border-gray-900 shadow-sm group-hover:scale-125 transition-transform duration-200"></div>
        </div>

        <!-- Card: always right of line on mobile (ml-14), alternating on desktop -->
        <div class={`ml-14 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}>
          <article class="relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-secondary/30 dark:hover:border-secondary/30 hover:-translate-y-1">
            <!-- Full-card clickable link (background layer) -->
            <!-- svelte-ignore a11y-click-events-have-key-events a11y-interactive-supports-focus -->
            <a
              href={`${prefix}/blog/${post.slug}/`}
              class="absolute inset-0 z-0"
              aria-label={post.title}
              on:click={() => trackEvent(EVENTS.TIMELINE_CLICK, { page: pageName, slug: post.slug })}
            ></a>

            {#if post.heroImage}
              <div>
                <img
                  src={post.heroImage}
                  alt={post.title}
                  class="w-full h-44 object-cover"
                  loading="lazy"
                  width="800"
                  height="176"
                />
              </div>
            {/if}

            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-secondary transition-colors">
                {post.title}
              </h3>

              <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                {post.description}
              </p>

              <div class="relative z-10 flex flex-wrap items-center gap-2">
                <time class="text-xs text-gray-600 dark:text-gray-300">
                  {formatDate(post.pubDate)}
                </time>

                {#if isPostScheduled(post.pubDate)}
                  <span class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    {t.scheduledBadge}
                  </span>
                {/if}

                {#if post.isDraft}
                  <span class="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    {t.draftBadge}
                  </span>
                {/if}

                {#if post.seriesCurrent && post.seriesTotal}
                  {@const localizedSeriesTitle = (post.seriesSlug && t.seriesNames[post.seriesSlug]) || post.seriesTitle}
                  {@const seriesBadgeLabel = buildSeriesBadgeLabel(post.seriesCurrent, post.seriesTotal, localizedSeriesTitle)}
                  {#if post.seriesSlug}
                    <a
                      href={`${prefix}/blog/series/${post.seriesSlug}/`}
                      class="inline-flex items-center rounded-full border-2 border-blue-300 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 transition-colors hover:bg-blue-100 hover:border-blue-400 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60 dark:hover:border-blue-600"
                      title={seriesBadgeLabel}
                    >
                      {post.seriesCurrent}/{post.seriesTotal}
                    </a>
                  {:else}
                    <span
                      class="inline-flex items-center rounded-full border-2 border-blue-300 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                      title={seriesBadgeLabel}
                    >
                      {post.seriesCurrent}/{post.seriesTotal}
                    </span>
                  {/if}
                {/if}

                {#if post.tags && post.tags.length > 0}
                  {#each post.tags.filter((tag) => !topicTagNames.includes(tag)) as tag}
                    <a
                      href={`${prefix}/blog/tag/${tag}/`}
                      class="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      #{t.tagNames[tag] || tag}
                    </a>
                  {/each}
                  {#each post.tags.filter((tag) => topicTagNames.includes(tag) && !subtopicTagNames.includes(tag)) as topic}
                    <a
                      href={`${prefix}/blog/tag/${topic}/`}
                      class="text-xs px-2 py-0.5 rounded border border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-gray-100 transition-colors"
                    >
                      {t.tagNames[topic] || topic}
                    </a>
                  {/each}
                  {#each post.tags.filter((tag) => subtopicTagNames.includes(tag)) as sub}
                    <a
                      href={`${prefix}/blog/tag/${sub}/`}
                      class="inline-flex items-center text-xs px-2 py-1 rounded bg-gray-50 text-gray-700 border border-dashed border-gray-300 hover:bg-gray-100 hover:border-gray-500 hover:text-gray-900 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:border-gray-400 dark:hover:text-gray-100 transition-colors"
                    >
                      <span class={`mr-1 ${subtopicAccentByName[sub] || 'text-gray-600 dark:text-gray-300'}`} aria-hidden="true">›</span>{t.tagNames[sub] || sub}
                    </a>
                  {/each}
                {/if}
              </div>
            </div>
          </article>
        </div>
      </div>
    {/each}

    <!-- Sentinel for IntersectionObserver (only when more posts to load) -->
    {#if !allLoaded}
      <div bind:this={sentinel} aria-hidden="true" class="h-1 w-full"></div>
    {/if}

    <!-- Loading spinner -->
    {#if loading}
      <div role="status" class="flex justify-center py-8">
        <span class="sr-only">
          {lang === 'es' ? 'Cargando más posts…' : 'Loading more posts…'}
        </span>
        <div
          aria-hidden="true"
          class="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
    {/if}

    <!-- Error state -->
    {#if fetchError}
      <div role="alert" class="text-center py-8">
        <p class="text-gray-600 dark:text-gray-300 mb-3">
          {lang === 'es' ? 'Error al cargar más posts.' : 'Failed to load more posts.'}
        </p>
        <button
          on:click={loadMore}
          class="px-4 py-2 text-sm bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
        >
          {lang === 'es' ? 'Reintentar' : 'Retry'}
        </button>
      </div>
    {/if}

  </div>

  <!-- Timeline end cap — outside the line container so the line terminates cleanly -->
  {#if allLoaded && renderedPosts.length > 0}
    <div class="flex flex-col items-center gap-4 pb-6">
      <div class="w-12 h-12 rounded-full bg-secondary shadow-lg shadow-secondary/25 flex items-center justify-center ring-4 ring-secondary/10 dark:ring-secondary/20">
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div class="bg-white dark:bg-gray-800 px-8 py-4 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 text-center">
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {lang === 'es' ? 'Has llegado al inicio' : "You've reached the beginning"}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {renderedPosts.length} {lang === 'es' ? 'posts en total' : 'total posts'}
        </p>
      </div>
    </div>
  {/if}
{/if}
