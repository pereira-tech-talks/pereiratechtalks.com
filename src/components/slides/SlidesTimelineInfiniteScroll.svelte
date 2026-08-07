<script lang="ts">
import { onDestroy, onMount, tick } from 'svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import {
  formatCalendarDateLocale,
  getCalendarYear,
  getCalendarYearMonth,
  isFutureCalendarDate,
} from '@/lib/dates';
import { getUrlPrefix, type Language } from '@/lib/i18n';
import type { SlideTimelineCardEntry } from '@/lib/slides';
import { getTranslations } from '@/lib/translations';

export let initialDecks: SlideTimelineCardEntry[] = [];
export let totalCount: number = 0;
export let apiEndpoint: string;
export let lang: Language = 'en';
export let pageSize: number = 30;
/** Page identifier for analytics events. */
export let pageName: string = 'slides';
/** Localised empty-state message passed from the parent page component. */
export let emptyStateMessage: string = '';

$: t = getTranslations(lang);
$: prefix = getUrlPrefix(lang);

let renderedDecks: SlideTimelineCardEntry[] = [...initialDecks];
let allDecks: SlideTimelineCardEntry[] | null = null;
let loading = false;
let fetchError = false;
$: allLoaded = renderedDecks.length >= totalCount;

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
    if (!allDecks) {
      const res = await fetch(apiEndpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      allDecks = data.decks as SlideTimelineCardEntry[];
    }
    const nextBatch = allDecks.slice(
      renderedDecks.length,
      renderedDecks.length + pageSize
    );
    renderedDecks = [...renderedDecks, ...nextBatch];
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

function isDeckScheduled(pubDate: string): boolean {
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

function getTypeBadgeLabel(type: SlideTimelineCardEntry['type']): string {
  switch (type) {
    case 'native':
      return t.slides.typeBadge.native;
    case 'external':
      return t.slides.typeBadge.external;
  }
}

function getTypeBadgeClasses(type: SlideTimelineCardEntry['type']): string {
  switch (type) {
    case 'native':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200';
    case 'external':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200';
  }
}
</script>

{#if renderedDecks.length === 0 && !loading}
  <div class="text-center py-16">
    <p class="text-ptt-secondary text-lg">
      {emptyStateMessage || (lang === 'es' ? 'Aún no hay slides disponibles.' : 'No slides available yet.')}
    </p>
  </div>
{:else}
  <div class="relative py-8">
    <!-- Timeline line: left on mobile, centered on desktop -->
    <div class="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-ptt-border"></div>

    {#each renderedDecks as deck, index}
      {@const isLeft = index % 2 === 0}
      {@const year = getYear(deck.pubDate)}
      {@const prevDeck = index > 0 ? renderedDecks[index - 1] : null}
      {@const showYear = index === 0 || getYear(prevDeck?.pubDate ?? '') !== year}
      {@const yearMonth = getYearMonth(deck.pubDate)}
      {@const showMonth = index === 0 || getYearMonth(prevDeck?.pubDate ?? '') !== yearMonth}
      {@const deckHref = `${prefix}/slides/${deck.slug}/`}

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
              {getMonthName(deck.pubDate)}
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
              href={deckHref}
              class="absolute inset-0 z-0 cursor-pointer"
              aria-label={deck.title}
              on:click={() => trackEvent(EVENTS.TIMELINE_CLICK, { page: pageName, slug: deck.slug })}
            ></a>

            {#if deck.heroImage}
              <div class="relative pointer-events-none">
                <img
                  src={deck.heroImage}
                  alt={deck.title}
                  class="w-full h-44 object-cover"
                  loading="lazy"
                  width="800"
                  height="176"
                />
                <span
                  class={`absolute top-2 right-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${getTypeBadgeClasses(deck.type)}`}
                >
                  {getTypeBadgeLabel(deck.type)}
                </span>
              </div>
            {/if}

            <div class="p-5 pointer-events-none">
              {#if !deck.heroImage}
                <div class="mb-3">
                  <span
                    class={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${getTypeBadgeClasses(deck.type)}`}
                  >
                    {getTypeBadgeLabel(deck.type)}
                  </span>
                </div>
              {/if}

              <h3 class="text-lg font-bold text-ptt mb-2 group-hover:text-ptt-primary transition-colors">
                {deck.title}
              </h3>

              {#if deck.eventName}
                <p class="text-sm text-ptt-secondary mb-2">
                  {deck.eventName}
                  {#if deck.eventDate}
                    <span> · {getCalendarYear(deck.eventDate)}</span>
                  {/if}
                </p>
              {/if}

              <p class="text-sm text-ptt-secondary mb-3 line-clamp-3">
                {deck.description}
              </p>

              <div class="flex flex-wrap items-center gap-2">
                <time class="text-xs text-ptt-secondary">
                  {formatDate(deck.pubDate)}
                </time>

                {#if isDeckScheduled(deck.pubDate)}
                  <span class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    {t.scheduledBadge}
                  </span>
                {/if}

                {#if deck.isDraft}
                  <span class="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    {t.draftBadge}
                  </span>
                {/if}

                {#if deck.provider}
                  <span class="text-xs px-2 py-0.5 rounded border border-ptt-border text-ptt-secondary">
                    {deck.provider}
                  </span>
                {/if}
              </div>
            </div>
          </article>
        </div>
      </div>
    {/each}

    <!-- Sentinel for IntersectionObserver (only when more decks to load) -->
    {#if !allLoaded}
      <div bind:this={sentinel} aria-hidden="true" class="h-1 w-full"></div>
    {/if}

    <!-- Loading spinner -->
    {#if loading}
      <div role="status" class="flex justify-center py-8">
        <span class="sr-only">
          {lang === 'es' ? 'Cargando más slides…' : 'Loading more slides…'}
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
          {lang === 'es' ? 'Error al cargar más slides.' : 'Failed to load more slides.'}
        </p>
        <button
          on:click={loadMore}
          class="px-4 py-2 text-sm bg-ptt-primary text-white rounded-lg hover:bg-ptt-primary/90 transition-colors"
        >
          {lang === 'es' ? 'Reintentar' : 'Retry'}
        </button>
      </div>
    {/if}
  </div>

  <!-- Timeline end cap — outside the line container so the line terminates cleanly -->
  {#if allLoaded && renderedDecks.length > 0}
    <div class="flex flex-col items-center gap-4 pb-6">
      <div class="w-12 h-12 rounded-full bg-ptt-primary shadow-lg shadow-ptt-primary/25 flex items-center justify-center ring-4 ring-ptt-primary/10 dark:ring-ptt-primary/20">
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div class="bg-ptt-bg-elevated px-8 py-4 rounded-2xl shadow-md border border-ptt-border text-center">
        <p class="text-sm font-semibold text-ptt">
          {lang === 'es' ? 'Has llegado al inicio' : "You've reached the beginning"}
        </p>
        <p class="text-sm text-ptt-secondary mt-1">
          {renderedDecks.length} {lang === 'es' ? 'slides en total' : 'total slides'}
        </p>
      </div>
    </div>
  {/if}
{/if}
