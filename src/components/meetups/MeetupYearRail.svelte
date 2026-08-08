<script lang="ts">
/**
 * Sticky year jump rail for the meetups archive with scroll-spy active state.
 * Desktop: vertical sticky nav. Mobile: horizontal chip scroll.
 *
 * Scroll-spy only updates the active chip styles — it never scrolls the
 * document or the chip row. Auto-scrolling either surface was fighting the
 * user's attempt to leave the archive (jumping back to 2026).
 */
import { onMount } from 'svelte';

interface Props {
  years: number[];
  label: string;
}

let { years, label }: Props = $props();

/** null while the user is still above the first year section */
let activeYear = $state<number | null>(null);

/** Ignore scroll-spy while a click-driven year jump is animating. */
let ignoreSpyUntil = 0;

function yearId(year: number): string {
  return `year-${year}`;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clearYearHash(): void {
  if (/^#year-\d+$/.test(window.location.hash)) {
    const path = `${window.location.pathname}${window.location.search}`;
    history.replaceState(null, '', path);
  }
}

function scrollToYear(year: number): void {
  const el = document.getElementById(yearId(year));
  if (!el) return;
  const headerOffset = 112;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
  ignoreSpyUntil = performance.now() + 800;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
}

function handleClick(event: MouseEvent, year: number): void {
  event.preventDefault();
  activeYear = year;
  scrollToYear(year);
  history.replaceState(null, '', `#${yearId(year)}`);
}

function resolveActiveFromScroll(): void {
  if (performance.now() < ignoreSpyUntil) return;

  // Sticky header + year heading offset (~scroll-mt-28).
  const anchor = 112;
  let current: number | null = null;

  for (const year of years) {
    const el = document.getElementById(yearId(year));
    if (!el) continue;
    if (el.getBoundingClientRect().top <= anchor) {
      current = year;
    }
  }

  activeYear = current;

  // Drop the fragment when the user leaves the archive so the browser
  // cannot keep re-anchoring to #year-2026 while they scroll up.
  if (current == null) {
    clearYearHash();
  }
}

onMount(() => {
  if (years.length === 0) return;

  const hashYear = Number.parseInt(
    window.location.hash.replace(/^#year-/, ''),
    10
  );
  if (years.includes(hashYear)) {
    activeYear = hashYear;
  } else {
    resolveActiveFromScroll();
  }

  let ticking = false;
  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      resolveActiveFromScroll();
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
});
</script>

<nav aria-label={label} class="meetup-year-rail min-w-0 max-w-full">
  <ul
    class="flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch] lg:flex-col lg:overflow-visible lg:pb-0 lg:sticky lg:top-24"
  >
    {#each years as year (year)}
      <li class="shrink-0">
        <a
          href={`#${yearId(year)}`}
          aria-current={activeYear === year ? 'true' : undefined}
          class={[
            'inline-flex min-h-9 min-w-[3.75rem] items-center justify-center rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary sm:min-h-10 sm:min-w-16 sm:px-3 sm:text-sm',
            activeYear === year
              ? 'border-ptt-primary bg-ptt-primary text-white shadow-sm dark:border-ptt-primary-dark dark:bg-ptt-primary-dark dark:text-ptt-bg-dark'
              : 'border-ptt-border bg-ptt-bg-elevated text-ptt-secondary hover:border-ptt-primary hover:text-ptt-primary dark:hover:border-ptt-primary-dark dark:hover:text-ptt-primary-dark',
          ].join(' ')}
          onclick={(e) => handleClick(e, year)}
        >
          {year}
        </a>
      </li>
    {/each}
  </ul>
</nav>
