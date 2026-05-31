<script lang="ts">
import { EVENTS, trackEvent } from '@/lib/analytics';
import type { Language } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

export let lang: Language = 'en';
export let href: string;
export let deckTitle: string;

$: t = getTranslations(lang);

function trackClick() {
  trackEvent(EVENTS.SLIDE_INDICATOR_CLICK, { href });
}
</script>

<a
  href={href}
  on:click={trackClick}
  class="slide-indicator flex items-center gap-3 rounded-full bg-white/95 pl-1.5 pr-4 py-1.5 text-sm font-medium shadow-lg ring-1 ring-emerald-200 backdrop-blur-sm hover:shadow-xl dark:bg-gray-800/95 dark:ring-emerald-700 transition-all duration-200 hover:-translate-y-0.5"
  aria-label="{t.slideIndicator.ariaLabel} — {deckTitle}"
  title="{t.slideIndicator.ariaLabel}: {deckTitle}"
>
  <span
    class="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-emerald-300 bg-emerald-50 p-1 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
    aria-hidden="true"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="4" width="18" height="13" rx="1.5" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <line x1="12" y1="17" x2="12" y2="20" />
      <line x1="7" y1="9" x2="17" y2="9" />
      <line x1="7" y1="13" x2="13" y2="13" />
    </svg>
  </span>
  <span class="flex flex-col items-start leading-tight">
    <span class="text-xs text-gray-900 dark:text-white">{t.slideIndicator.label}</span>
    <span class="text-[10px] text-gray-600 dark:text-gray-300">{t.slideIndicator.subtitle}</span>
  </span>
</a>

<style>
  .slide-indicator {
    animation: slideInRight 0.4s ease-out;
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
