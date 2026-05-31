<script lang="ts">
import { onMount } from 'svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import type { Language } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

export let lang: Language = 'en';
export let currentChapter: number;
export let totalChapters: number;
export let seriesTitle: string;

$: t = getTranslations(lang);
$: buttonText = t.seriesChapterOf(currentChapter, totalChapters);
$: chapterBadge = `${currentChapter}/${totalChapters}`;

let visible = false;

function scrollToSeries() {
  trackEvent(EVENTS.SERIES_INDICATOR_CLICK);
  const el = document.getElementById('series-navigation');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

onMount(() => {
  const el = document.getElementById('series-navigation');
  if (!el) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = !entry.isIntersecting && entry.boundingClientRect.top > 0;
    },
    { threshold: 0 }
  );

  observer.observe(el);

  return () => observer.disconnect();
});
</script>

{#if visible}
  <button
    on:click={scrollToSeries}
    class="series-indicator flex items-center gap-3 rounded-full bg-white/95 pl-1.5 pr-4 py-1.5 text-sm font-medium shadow-lg ring-1 ring-blue-200 backdrop-blur-sm hover:shadow-xl dark:bg-gray-800/95 dark:ring-blue-700 transition-all duration-200 hover:-translate-y-0.5"
    aria-label="{buttonText} — {seriesTitle}"
  >
    <span
      class="inline-flex shrink-0 items-center rounded-full border-2 border-blue-300 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
      aria-hidden="true"
      title={`${seriesTitle} · ${buttonText}`}
    >
            {chapterBadge}
    </span>
    <!-- Label -->
    <span class="flex flex-col items-start leading-tight">
      <span class="text-xs text-gray-900 dark:text-white">{buttonText}</span>
      <span class="text-[10px] text-gray-600 dark:text-gray-300">{t.seriesToC} &darr;</span>
    </span>
  </button>
{/if}

<style>
  .series-indicator {
    animation: slideInRight 0.3s ease-out;
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(1rem);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
