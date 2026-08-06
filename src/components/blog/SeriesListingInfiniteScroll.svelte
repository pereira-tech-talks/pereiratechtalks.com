<script lang="ts">
import { onDestroy, onMount, tick } from 'svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import { getUrlPrefix, type Language } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

import type { SeriesListingEntry } from '@/pages/api/series/[lang]/index.json';

export let initialSeries: SeriesListingEntry[] = [];
export let totalCount: number = 0;
export let apiEndpoint: string;
export let lang: Language = 'en';
export let pageSize: number = 30;

$: t = getTranslations(lang);
$: prefix = getUrlPrefix(lang);

let renderedSeries: SeriesListingEntry[] = [...initialSeries];
let allSeries: SeriesListingEntry[] | null = null;
let loading = false;
let fetchError = false;
$: allLoaded = renderedSeries.length >= totalCount;

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

async function loadMore(): Promise<void> {
  if (loading || allLoaded) return;
  loading = true;
  fetchError = false;
  try {
    if (!allSeries) {
      const res = await fetch(apiEndpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      allSeries = data.series as SeriesListingEntry[];
    }
    const nextBatch = allSeries.slice(
      renderedSeries.length,
      renderedSeries.length + pageSize
    );
    renderedSeries = [...renderedSeries, ...nextBatch];
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

function getHeroImage(series: SeriesListingEntry): string | null {
  return series.heroImage || series.firstPostHero;
}
</script>

{#if renderedSeries.length === 0 && !loading}
  <div class="text-center py-16">
    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-ptt-primary-soft flex items-center justify-center">
      <svg class="w-8 h-8 text-ptt-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
    <p class="text-ptt-secondary text-lg">
      {t.seriesListingPage.emptyState}
    </p>
  </div>
{:else}
  <!-- Adaptive layout: stack (≤4 series) or grid (5+) -->
  {#if renderedSeries.length <= 4}
    <!-- Stack layout: all cards use premium horizontal layout -->
    <div class="main-container space-y-6">
      {#each renderedSeries as series, index}
        {@const hero = getHeroImage(series)}
        {@const isFirst = index === 0}

        <a
          href={`${prefix}/blog/series/${series.slug}/`}
          class="group block bg-ptt-bg-elevated rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-ptt-border hover:border-ptt-primary/40 hover:-translate-y-1"
          on:click={() => trackEvent(EVENTS.TIMELINE_CLICK, { page: 'series-listing', slug: series.slug })}
        >
          <div class="md:flex md:h-[320px] {index % 2 !== 0 ? 'md:flex-row-reverse' : ''}">
            <!-- Image area -->
            <div class="relative md:w-1/2">
              {#if hero}
                <img
                  src={hero}
                  alt=""
                  class="w-full h-56 md:h-full object-cover"
                  loading={isFirst ? 'eager' : 'lazy'}
                  width="800"
                  height="400"
                />
              {:else}
                <div class="w-full h-56 md:h-full bg-ptt-primary-soft flex items-center justify-center">
                  <svg class="w-16 h-16 text-ptt-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              {/if}
              <!-- Gradient overlay for mobile -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:hidden"></div>
            </div>

            <!-- Content area -->
            <div class="md:w-1/2 p-6 lg:p-8 flex flex-col justify-center overflow-hidden">
              <div class="mb-3">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ptt-primary-soft text-ptt-primary text-xs font-medium">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {t.seriesListingPage.postsCount(series.postCount)}
                </span>
              </div>
              <h2 class="text-xl lg:text-2xl font-bold text-ptt mb-3 group-hover:text-ptt-primary transition-colors line-clamp-2">
                {t.seriesNames[series.slug] || series.title}
              </h2>
              {#if series.description}
                <p class="text-sm lg:text-base text-ptt-secondary mb-5 line-clamp-3">
                  {t.seriesDescriptions[series.slug] || series.description}
                </p>
              {/if}
              <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-ptt-primary group-hover:translate-x-1 transition-transform">
                {t.seriesListingPage.exploreSeries}
                <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </div>
        </a>
      {/each}
    </div>

  {:else}
    <!-- Grid layout: featured first card + grid for 5+ series -->
    <div class="main-container grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each renderedSeries as series, index}
        {@const hero = getHeroImage(series)}
        {@const isFirst = index === 0}

        <a
          href={`${prefix}/blog/series/${series.slug}/`}
          class="group block bg-ptt-bg-elevated rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-ptt-border hover:border-ptt-primary/40 hover:-translate-y-1.5
            {isFirst ? 'sm:col-span-2 lg:col-span-full' : ''}"
          on:click={() => trackEvent(EVENTS.TIMELINE_CLICK, { page: 'series-listing', slug: series.slug })}
        >
          {#if isFirst}
            <!-- Featured first card: horizontal layout -->
            <div class="lg:flex">
              <div class="relative lg:w-1/2 xl:w-3/5">
                {#if hero}
                  <img
                    src={hero}
                    alt=""
                    class="w-full h-56 lg:h-full lg:min-h-[280px] object-cover"
                    loading="eager"
                    width="800"
                    height="400"
                  />
                {:else}
                  <div class="w-full h-56 lg:h-full lg:min-h-[280px] bg-ptt-primary-soft flex items-center justify-center">
                    <svg class="w-16 h-16 text-ptt-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                {/if}
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden"></div>
              </div>
              <div class="lg:w-1/2 xl:w-2/5 p-6 lg:p-8 flex flex-col justify-center">
                <div class="mb-3">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ptt-primary-soft text-ptt-primary text-xs font-medium">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {t.seriesListingPage.postsCount(series.postCount)}
                  </span>
                </div>
                <h2 class="text-xl lg:text-2xl font-bold text-ptt mb-3 group-hover:text-ptt-primary transition-colors">
                  {t.seriesNames[series.slug] || series.title}
                </h2>
                {#if series.description}
                  <p class="text-sm lg:text-base text-ptt-secondary mb-5 line-clamp-3">
                    {t.seriesDescriptions[series.slug] || series.description}
                  </p>
                {/if}
                <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-ptt-primary group-hover:translate-x-1 transition-transform">
                  {t.seriesListingPage.exploreSeries}
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </div>

          {:else}
            <!-- Grid cards -->
            <div class="relative">
              {#if hero}
                <img src={hero} alt="" class="w-full h-48 object-cover" loading="lazy" width="400" height="192" />
              {:else}
                <div class="w-full h-48 bg-ptt-primary-soft flex items-center justify-center">
                  <svg class="w-14 h-14 text-ptt-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              {/if}
              <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
            <div class="p-5">
              <h2 class="text-lg font-bold text-ptt mb-2 group-hover:text-ptt-primary transition-colors">
                {t.seriesNames[series.slug] || series.title}
              </h2>
              {#if series.description}
                <p class="text-sm text-ptt-secondary mb-4 line-clamp-2">
                  {t.seriesDescriptions[series.slug] || series.description}
                </p>
              {/if}
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ptt-primary-soft text-ptt-primary text-xs font-medium">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {t.seriesListingPage.postsCount(series.postCount)}
                </span>
                <span class="text-xs font-semibold text-ptt-primary group-hover:translate-x-1 transition-transform">
                  {t.seriesListingPage.exploreSeries} &rarr;
                </span>
              </div>
            </div>
          {/if}
        </a>
      {/each}
    </div>
  {/if}

  <!-- Sentinel for IntersectionObserver -->
  {#if !allLoaded}
    <div bind:this={sentinel} aria-hidden="true" class="h-1 w-full"></div>
  {/if}

  <!-- Loading spinner -->
  {#if loading}
    <div role="status" class="flex justify-center py-8">
      <span class="sr-only">
        {lang === 'es' ? 'Cargando más series...' : 'Loading more series...'}
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
        {lang === 'es' ? 'Error al cargar más series.' : 'Failed to load more series.'}
      </p>
      <button
        on:click={loadMore}
        class="px-4 py-2 text-sm bg-ptt-primary text-white rounded-lg hover:bg-ptt-primary-strong transition-colors"
      >
        {t.retry}
      </button>
    </div>
  {/if}

  <!-- All loaded end cap -->
  {#if allLoaded && renderedSeries.length > 0}
    <div class="flex flex-col items-center pt-12 pb-6">
      <div class="w-12 h-12 mb-4 rounded-full bg-ptt-primary-soft flex items-center justify-center shadow-sm">
        <svg class="w-6 h-6 text-ptt-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <p class="text-sm font-medium text-ptt mb-1">
        {lang === 'es'
          ? `${renderedSeries.length} ${renderedSeries.length === 1 ? 'serie disponible' : 'series disponibles'}`
          : `${renderedSeries.length} ${renderedSeries.length === 1 ? 'series available' : 'series available'}`}
      </p>
      <p class="text-xs text-ptt-secondary">
        {lang === 'es' ? 'Elige una y comienza a explorar' : 'Pick one and start exploring'}
      </p>
    </div>
  {/if}
{/if}
