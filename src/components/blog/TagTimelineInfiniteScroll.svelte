<script lang="ts">
import { onDestroy, onMount, tick } from 'svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import type { TimelineCardEntry } from '@/lib/blog';
import {
  formatCalendarDateLocale,
  getCalendarYear,
  getCalendarYearMonth,
  isFutureCalendarDate,
} from '@/lib/dates';
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
  return isFutureCalendarDate(pubDate);
}

function formatDate(pubDate: string): string {
  return formatCalendarDateLocale(pubDate, t.dateLocale);
}

function getYear(pubDate: string): string {
  return getCalendarYear(pubDate).toString();
}

function getYearMonth(pubDate: string): string {
  return getCalendarYearMonth(pubDate);
}

function getMonthName(pubDate: string): string {
  return formatCalendarDateLocale(pubDate, t.dateLocale, { month: 'long' });
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
    <p class="text-ptt-secondary text-lg">
      {emptyStateMessage || (lang === 'es' ? 'Aún no hay posts disponibles.' : 'No posts available yet.')}
    </p>
  </div>
{:else}
  <div class="relative py-8">
    <!-- Timeline line: left on mobile, centered on desktop -->
    <div class="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-ptt-border"></div>

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
            <span class="inline-block px-4 py-1.5 bg-ptt-primary text-white text-sm font-bold rounded-full shadow-md">
              {year}
            </span>
          </div>
        </div>
      {/if}

      <!-- Month marker -->
      {#if showMonth}
        <div class="relative flex items-center h-6 mb-6 mt-4">
          <div class="absolute left-10 md:left-1/2 md:-translate-x-1/2 z-10">
            <span class="inline-block px-3 py-1 bg-ptt-bg-elevated text-ptt-secondary text-xs font-medium rounded-full capitalize translate-y-1 border border-ptt-border">
              {getMonthName(post.pubDate)}
            </span>
          </div>
        </div>
      {/if}

      <!-- Timeline item -->
      <div class="relative flex items-start mb-12 group">
        <!-- Dot on the line: left on mobile, centered on desktop -->
        <div class="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 mt-6">
          <div class="w-4 h-4 bg-ptt-primary rounded-full border-4 border-ptt-bg shadow-sm group-hover:scale-125 transition-transform duration-200"></div>
        </div>

        <!-- Card: always right of line on mobile (ml-14), alternating on desktop -->
        <div class={`ml-14 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}>
          <article class="relative bg-ptt-bg-elevated rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-ptt-border hover:border-ptt-primary/30 hover:-translate-y-1">
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
              <h3 class="text-lg font-bold text-ptt mb-2 group-hover:text-ptt-primary transition-colors">
                {post.title}
              </h3>

              <p class="text-sm text-ptt-secondary mb-3 line-clamp-3">
                {post.description}
              </p>

              <div class="relative z-10 flex flex-wrap items-center gap-2">
                <time class="text-xs text-ptt-secondary">
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
                      class="inline-flex items-center rounded-full border-2 border-ptt-primary/40 bg-ptt-primary-soft px-2 py-0.5 text-[11px] font-medium text-ptt-primary transition-colors hover:bg-ptt-primary/15 hover:border-ptt-primary/60"
                      title={seriesBadgeLabel}
                    >
                      {post.seriesCurrent}/{post.seriesTotal}
                    </a>
                  {:else}
                    <span
                      class="inline-flex items-center rounded-full border-2 border-ptt-primary/40 bg-ptt-primary-soft px-2 py-0.5 text-[11px] font-medium text-ptt-primary"
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
                      class="text-xs px-2 py-0.5 rounded bg-ptt-primary-soft text-ptt-primary hover:bg-ptt-primary/15 transition-colors"
                    >
                      #{t.tagNames[tag] || tag}
                    </a>
                  {/each}
                  {#each post.tags.filter((tag) => topicTagNames.includes(tag) && !subtopicTagNames.includes(tag)) as topic}
                    <a
                      href={`${prefix}/blog/tag/${topic}/`}
                      class="text-xs px-2 py-0.5 rounded border border-ptt-border bg-ptt-bg-elevated text-ptt-secondary hover:border-ptt-border-strong hover:text-ptt transition-colors"
                    >
                      {t.tagNames[topic] || topic}
                    </a>
                  {/each}
                  {#each post.tags.filter((tag) => subtopicTagNames.includes(tag)) as sub}
                    <a
                      href={`${prefix}/blog/tag/${sub}/`}
                      class="inline-flex items-center text-xs px-2 py-1 rounded bg-ptt-bg-elevated text-ptt-secondary border border-dashed border-ptt-border hover:bg-ptt-primary-soft hover:border-ptt-border-strong hover:text-ptt transition-colors"
                    >
                      <span class={`mr-1 ${subtopicAccentByName[sub] || 'text-ptt-secondary'}`} aria-hidden="true">›</span>{t.tagNames[sub] || sub}
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
          class="w-8 h-8 border-4 border-ptt-primary border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
    {/if}

    <!-- Error state -->
    {#if fetchError}
      <div role="alert" class="text-center py-8">
        <p class="text-ptt-secondary mb-3">
          {lang === 'es' ? 'Error al cargar más posts.' : 'Failed to load more posts.'}
        </p>
        <button
          on:click={loadMore}
          class="px-4 py-2 text-sm bg-ptt-primary text-white rounded-lg hover:bg-ptt-primary-strong transition-colors"
        >
          {lang === 'es' ? 'Reintentar' : 'Retry'}
        </button>
      </div>
    {/if}

  </div>

  <!-- Timeline end cap — outside the line container so the line terminates cleanly -->
  {#if allLoaded && renderedPosts.length > 0}
    <div class="flex flex-col items-center gap-4 pb-6">
      <div class="w-12 h-12 rounded-full bg-ptt-primary shadow-lg shadow-ptt-primary/25 flex items-center justify-center ring-4 ring-ptt-primary/15">
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div class="bg-ptt-bg-elevated px-8 py-4 rounded-2xl shadow-md border border-ptt-border text-center">
        <p class="text-sm font-semibold text-ptt-secondary">
          {lang === 'es' ? 'Has llegado al inicio' : "You've reached the beginning"}
        </p>
        <p class="text-sm text-ptt-secondary mt-1">
          {renderedPosts.length} {lang === 'es' ? 'posts en total' : 'total posts'}
        </p>
      </div>
    </div>
  {/if}
{/if}
