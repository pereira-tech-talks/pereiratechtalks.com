<script lang="ts">
import { onMount } from 'svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import { getTranslations } from '@/lib/translations';

export let lang: string = 'en';
export let targetLabel = '';

$: t = getTranslations(lang);
$: buttonText = targetLabel ? t.viewLabel(targetLabel) : t.scrollToTimeline;

let visible = false;

function scrollToTimeline() {
  trackEvent(EVENTS.SCROLL_TO_TIMELINE);
  const el = document.getElementById('timeline');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

onMount(() => {
  const el = document.getElementById('timeline');
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
    on:click={scrollToTimeline}
    class="fixed bottom-4 right-[4.5rem] sm:right-[5rem] z-40 flex items-center gap-2 px-4 py-2.5 bg-secondary text-white text-sm font-medium rounded-full shadow-lg hover:bg-secondary/90 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
    aria-label={buttonText}
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" />
    </svg>
    {buttonText}
  </button>
{/if}
