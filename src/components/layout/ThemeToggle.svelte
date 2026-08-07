<script lang="ts">
/**
 * Compact theme toggle for the site header / mobile menu.
 * Persists to localStorage['theme'] and tracks Umami theme_toggle.
 */
import { onMount } from 'svelte';

import { EVENTS, trackEvent } from '@/lib/analytics';
import { getTranslations } from '@/lib/translations';

export let lang: string = 'es';
/** `header` sits in the desktop nav; `menu` is a larger mobile control. */
export let placement: 'header' | 'menu' = 'header';

let isDark = false;

$: t = getTranslations(lang);
$: ariaLabel = isDark
  ? t.slides.toolbar.themeToLight
  : t.slides.toolbar.themeToDark;

onMount(() => {
  isDark = document.documentElement.classList.contains('dark');
});

function toggleTheme() {
  isDark = document.documentElement.classList.toggle('dark');
  const newTheme = isDark ? 'dark' : 'light';
  try {
    localStorage.setItem('theme', newTheme);
  } catch {
    // Storage disabled — visual toggle still works for this session.
  }
  trackEvent(EVENTS.THEME_TOGGLE, { theme: newTheme });
}
</script>

<button
  type="button"
  class="theme-toggle group inline-flex cursor-pointer items-center justify-center transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary
    {placement === 'header'
      ? 'h-5 w-5 shrink-0 p-0 text-ptt hover:text-ptt-primary dark:text-white dark:hover:text-white/85'
      : 'min-h-[44px] gap-2.5 rounded-full border border-ptt-border px-4 py-2 text-base text-ptt hover:border-ptt-primary dark:border-white/20 dark:text-white'}"
  aria-label={ariaLabel}
  aria-pressed={isDark}
  on:click={toggleTheme}
>
  {#if isDark}
    <svg
      class="theme-toggle-icon h-5 w-5 text-ptt-accent"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"></circle>
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      ></path>
    </svg>
  {:else}
    <svg
      class="theme-toggle-icon h-5 w-5 text-ptt-primary"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M21 14.3A9 9 0 1 1 9.7 3a7 7 0 1 0 11.3 11.3z"
        opacity="0.95"
      ></path>
    </svg>
  {/if}
  {#if placement === 'menu'}
    <span class="font-medium">{ariaLabel}</span>
  {/if}
</button>
