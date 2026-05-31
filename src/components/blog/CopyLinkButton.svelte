<script lang="ts">
import { EVENTS, trackEvent } from '@/lib/analytics';

let { url, label, copiedLabel } = $props<{
  url: string;
  label: string;
  copiedLabel: string;
}>();

let copied = $state(false);

async function copyLink() {
  try {
    await navigator.clipboard.writeText(url);
    copied = true;
    trackEvent(EVENTS.COPY_LINK);
    setTimeout(() => {
      copied = false;
    }, 2000);
  } catch {
    // Clipboard API not available — silent fail
  }
}
</script>

<button
  onclick={copyLink}
  class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
  aria-label={label}
>
  {#if copied}
    <svg class="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    <span class="text-green-600 dark:text-green-400">{copiedLabel}</span>
  {:else}
    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
    <span>{label}</span>
  {/if}
</button>
