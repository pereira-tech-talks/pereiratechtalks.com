<script lang="ts">
import { EVENTS, trackEvent } from '@/lib/analytics';
import type { Language } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

export let lang: Language = 'en';
export let href: string;
export let postTitle: string;

$: t = getTranslations(lang);

function trackClick() {
  trackEvent(EVENTS.POST_INDICATOR_CLICK, { href });
}
</script>

<a
  href={href}
  on:click={trackClick}
  class="post-indicator flex items-center gap-3 rounded-full bg-white/95 pl-1.5 pr-4 py-1.5 text-sm font-medium shadow-lg ring-1 ring-amber-200 backdrop-blur-sm hover:shadow-xl dark:bg-gray-800/95 dark:ring-amber-700 transition-all duration-200 hover:-translate-y-0.5"
  aria-label="{t.postIndicator.ariaLabel} — {postTitle}"
  title="{t.postIndicator.ariaLabel}: {postTitle}"
>
  <span
    class="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-amber-300 bg-amber-50 p-1 text-amber-700 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="14" y2="17" />
    </svg>
  </span>
  <span class="flex flex-col items-start leading-tight">
    <span class="text-xs text-gray-900 dark:text-white">{t.postIndicator.label}</span>
    <span class="text-[10px] text-gray-600 dark:text-gray-300">{t.postIndicator.subtitle}</span>
  </span>
</a>

<style>
  .post-indicator {
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
