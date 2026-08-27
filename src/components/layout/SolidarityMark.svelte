<script lang="ts">
/**
 * Colombia flag + mourning ribbon for site chrome.
 * Renders on a light chip in every theme so the black ribbon stays visible
 * on dark headers (ribbon-on-charcoal has near-zero contrast).
 * Links to the solidarity announcement; hover/focus shows what the mark means.
 */
export let label: string;
/** Localized href to the solidarity blog post (optional for non-link contexts). */
export let href: string | undefined = undefined;
/** Compact for sticky header; slightly larger in mobile drawer. */
export let size: 'sm' | 'md' = 'sm';
/** Called when the link is activated (e.g. close the mobile menu). */
export let onNavigate: (() => void) | undefined = undefined;

$: flagClass = size === 'md' ? 'h-4 w-6' : 'h-3.5 w-[1.35rem]';
$: ribbonClass = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
$: chipClass =
  'solidarity-mark group relative inline-flex shrink-0 items-center gap-1 rounded-md bg-white px-1.5 py-1 shadow-sm ring-1 ring-black/10 transition-[box-shadow,ring-color] dark:bg-white dark:ring-white/25';
$: interactiveClass = href
  ? 'cursor-pointer hover:ring-ptt-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary'
  : '';

function handleClick(): void {
  onNavigate?.();
}
</script>

{#if href}
  <a
    href={href}
    class="{chipClass} {interactiveClass}"
    aria-label={label}
    on:click={handleClick}
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
    <span
      role="tooltip"
      class="pointer-events-none absolute left-0 top-[calc(100%+0.4rem)] z-[60] w-max max-w-[9rem] sm:max-w-[14rem] rounded-md bg-ptt-bg-dark px-2.5 py-1.5 text-left text-[11px] font-medium leading-snug text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none dark:bg-ptt-bg-elevated dark:text-ptt dark:ring-ptt-border"
    >
      {label}
    </span>
  </a>
{:else}
  <span class={chipClass} role="img" aria-label={label} title={label}>
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
{/if}
