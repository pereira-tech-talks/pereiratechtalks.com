<script lang="ts">
/**
 * Colombia flag + mourning ribbon for site chrome.
 * Renders on a light chip in every theme so the black ribbon stays visible
 * on dark headers (ribbon-on-charcoal has near-zero contrast).
 */
export let label: string;
/** Compact for sticky header; slightly larger in mobile drawer. */
export let size: 'sm' | 'md' = 'sm';

$: flagClass = size === 'md' ? 'h-4 w-6' : 'h-3.5 w-[1.35rem]';
$: ribbonClass = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
</script>

<span
  class="solidarity-mark inline-flex shrink-0 items-center gap-1 rounded-md bg-white px-1.5 py-1 shadow-sm ring-1 ring-black/10 dark:bg-white dark:ring-white/25"
  role="img"
  aria-label={label}
>
  <img
    src="/images/community/solidarity/flag-colombia.svg"
    alt=""
    width="24"
    height="16"
    class="{flagClass} rounded-[2px] object-cover"
    loading="eager"
    decoding="async"
  />
  <img
    src="/images/community/solidarity/mourning-ribbon.png"
    alt=""
    width="20"
    height="20"
    class="{ribbonClass} object-contain"
    loading="eager"
    decoding="async"
  />
</span>
