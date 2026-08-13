<script lang="ts">
import { onMount } from 'svelte';

import { EVENTS, trackEvent } from '@/lib/analytics';
import {
  consumeNotificationAutoOpen,
  isAutomatedLabBrowser,
  markNotificationAutoOpenShown,
  scheduleAfterLargestContentfulPaint,
} from '@/lib/notification-modal-autoopen';

interface LocalizedNotification {
  id: string;
  severity: 'info' | 'important' | 'success' | 'warning';
  title: string;
  summary: string;
  body?: string;
  image?: { src: string; alt: string };
  ctaLabel?: string;
  ctaHref?: string;
  modalEnabled: boolean;
}

interface Props {
  lang: string;
  notifications: LocalizedNotification[];
}

let { lang, notifications }: Props = $props();

let openModalId = $state<string | null>(null);
let dialogEl = $state<HTMLDivElement | undefined>(undefined);
/** Visible only while the page is scrolled near the top. */
let atTop = $state(true);
let lastFocusedEl: HTMLElement | null = null;
/** Non-reactive — read inside scroll rAF without re-subscribing the effect. */
let modalLocked = false;

function canOpenDetailModal(n: LocalizedNotification): boolean {
  return n.modalEnabled && !!(n.body || n.image);
}

/**
 * Hysteresis prevents sticky-bar layout feedback:
 * collapsing the bar shrinks sticky chrome → scrollY drops → bar
 * re-expands → oscillates. Hide past HIDE_AT; re-show only ≤ SHOW_AT.
 */
const SHOW_AT = 8;
const HIDE_AT = 48;

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function readScrollY(): number {
  return Math.max(
    window.scrollY || 0,
    window.pageYOffset || 0,
    document.documentElement.scrollTop || 0,
    document.body?.scrollTop || 0
  );
}

/** Native-like focus trap: keeps Tab/Shift+Tab cycling inside the dialog. */
function trapFocus(e: KeyboardEvent): void {
  if (e.key !== 'Tab' || !dialogEl) return;
  const focusable = Array.from(
    dialogEl.querySelectorAll<HTMLElement>(focusableSelector)
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function openModal(id: string, source: 'click' | 'auto' = 'click'): void {
  lastFocusedEl = document.activeElement as HTMLElement | null;
  modalLocked = true;
  openModalId = id;
  trackEvent(EVENTS.NOTIFICATION_MODAL_OPEN, { id, source });
}

function closeModal(): void {
  modalLocked = false;
  openModalId = null;
  lastFocusedEl?.focus();
  lastFocusedEl = null;
}

/**
 * Parked: do not auto-open the detail modal. The bar + click-to-open is
 * enough for now (postponement notice). Flip to `true` to restore the
 * first-visit / every-Nth-reload policy in `@/lib/notification-modal-autoopen`.
 */
const AUTO_OPEN_MODAL = false;

/**
 * Auto-open policy (once per mount on any non-PTD page that renders this bar):
 * first session navigate per lang → open; later navigates quiet; reloads every 5th.
 * Deferred until after LCP settles so the modal hero does not steal LCP.
 * Skipped in Lighthouse / lab UAs (bar still works on click).
 * MainLayout omits this island on all /pereira-tech-day(s) routes.
 */
onMount(() => {
  if (!AUTO_OPEN_MODAL) return;
  const n = notifications[0];
  if (!n || !canOpenDetailModal(n)) return;
  if (isAutomatedLabBrowser()) return;

  let shouldOpen = false;
  try {
    shouldOpen = consumeNotificationAutoOpen({ id: n.id, lang });
  } catch {
    // Private mode / blocked storage — skip auto-open, bar still works.
    return;
  }
  if (!shouldOpen) return;

  const cancel = scheduleAfterLargestContentfulPaint(() => {
    if (openModalId != null) return;
    try {
      markNotificationAutoOpenShown(n.id, lang);
    } catch {
      // ignore storage failures — still show the modal
    }
    openModal(n.id, 'auto');
  });

  return cancel;
});

$effect(() => {
  if (openModalId && dialogEl) {
    dialogEl.focus();
  }
});

/** Lock background scroll while the detail modal is open. */
$effect(() => {
  if (typeof document === 'undefined') return;
  if (!openModalId) return;
  const previous = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = previous;
  };
});

/**
 * Collapse / expand the bar from scroll position.
 * Uses a local `visible` mirror so this effect does NOT re-subscribe when
 * `atTop` flips (reading `$state` inside `$effect` would tear down listeners).
 */
$effect(() => {
  if (typeof window === 'undefined') return;

  let raf = 0;
  // Local mirror — never read `atTop` here (avoids effect re-entry).
  let visible = readScrollY() <= HIDE_AT;
  atTop = visible;

  const syncAtTop = (): void => {
    raf = 0;
    // Ignore scroll while modal is open (body lock + iOS rubber-band noise).
    if (modalLocked) return;
    const y = readScrollY();
    if (visible && y > HIDE_AT) {
      visible = false;
      atTop = false;
    } else if (!visible && y <= SHOW_AT) {
      visible = true;
      atTop = true;
    }
  };

  const onScroll = (): void => {
    if (raf) return;
    raf = requestAnimationFrame(syncAtTop);
  };

  syncAtTop();
  window.addEventListener('scroll', onScroll, { passive: true, capture: true });
  document.addEventListener('scroll', onScroll, {
    passive: true,
    capture: true,
  });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('pageshow', onScroll);
  document.addEventListener('visibilitychange', onScroll);

  return () => {
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('scroll', onScroll, { capture: true });
    document.removeEventListener('scroll', onScroll, { capture: true });
    window.removeEventListener('resize', onScroll);
    window.removeEventListener('pageshow', onScroll);
    document.removeEventListener('visibilitychange', onScroll);
  };
});

/**
 * Sticky chrome shows one bar at a time (highest priority). Avoids stacking
 * two full-width bars on every page.
 */
const visibleBar = $derived(notifications.slice(0, 1));

const openEntry = $derived(
  openModalId ? notifications.find((n) => n.id === openModalId) : undefined
);

const moreLabel = lang === 'es' ? 'Ver más' : 'Learn more';
const closeLabel = lang === 'es' ? 'Cerrar' : 'Close';
const importantLabel = lang === 'es' ? 'IMPORTANTE' : 'IMPORTANT';

function severityClass(severity: LocalizedNotification['severity']): string {
  switch (severity) {
    case 'important':
      // Pin light-mode teal — `bg-ptt-primary` flips to #3FA8AD under `.dark`.
      return 'bg-[#1f6f73] text-white';
    case 'warning':
      return 'bg-ptt-bg-elevated text-ptt border-b border-ptt-border';
    case 'success':
      return 'bg-ptt-bg-elevated text-ptt border-b border-ptt-border';
    default:
      return 'bg-ptt-bg-elevated text-ptt border-b border-ptt-border';
  }
}
</script>

{#if visibleBar.length > 0}
  {@const bar = visibleBar[0]}
  <!--
    grid 0fr/1fr collapses height without max-height guessing (avoids
    mid-animation clipping when the row is taller than max-h-12/16).
    Paint the severity surface on the collapsing wrapper so the hero/
    page behind never flashes through while rows animate to 0fr.
  -->
  <div
    class="grid w-full transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none {severityClass(
      bar.severity
    )} {atTop ? '' : 'pointer-events-none'}"
    style="grid-template-rows: {atTop ? '1fr' : '0fr'}"
    data-testid="top-notification-bar"
    data-collapsed={atTop ? 'false' : 'true'}
    aria-hidden={!atTop}
  >
    <div class="min-h-0 overflow-hidden">
      {#each visibleBar as n (n.id)}
        <!--
          Full-bleed surface; inner row matches Header / `.main-container`
          width (max-w-7xl + mx-auto + px-4 md:px-6).
          Mid-height bar (~36–40px). Touch targets stay ≥44px via
          invisible hit-area expanders, not min-h on the row.
          Non-dismissible — hides on scroll, returns at top.
          No opacity fade: collapsing a transparent row would flash the
          dark sticky/hero behind; the grid height animation alone hides it.
        -->
        {@const opensModal = n.modalEnabled && !!(n.body || n.image)}
        {@const opensCta = !opensModal && !!(n.ctaHref && n.ctaLabel)}
        {@const actionLabel = opensModal
          ? moreLabel
          : opensCta
            ? n.ctaLabel
            : undefined}
        <!--
          Whole bar is the hit target (cursor:pointer) when it opens a
          modal or CTA — avoids a tiny "Ver más" target on mobile.
        -->
        <div class="pointer-events-auto" role="region" aria-label={n.title}>
          {#snippet barInner(label: string | undefined)}
            <div
              class="mx-auto flex w-full min-w-0 max-w-7xl items-center justify-start gap-2 px-4 py-1.5 text-xs leading-snug overflow-hidden sm:gap-2.5 md:px-6"
            >
              {#if n.severity === 'important'}
                <span
                  class="hidden min-[360px]:inline shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide leading-none bg-white text-ptt-bg-dark"
                >
                  {importantLabel}
                </span>
              {/if}
              <p class="min-w-0 flex-1 truncate overflow-hidden text-left">
                <span class="font-medium">{n.title}</span>
                <span class="mx-1 opacity-70">—</span>
                <span class="opacity-95">{n.summary}</span>
              </p>
              {#if label}
                <span
                  class="shrink-0 underline underline-offset-2 font-medium px-1.5 py-0.5 transition-[text-decoration-color,opacity] duration-200 group-hover:opacity-100 group-hover:decoration-2 opacity-90 motion-reduce:transition-none"
                >
                  {label}
                </span>
              {/if}
            </div>
          {/snippet}
          {#if opensModal}
            <button
              type="button"
              class="group block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-inherit appearance-none transition-colors duration-200 hover:bg-white/10 active:bg-white/15 motion-reduce:transition-none"
              tabindex={atTop ? 0 : -1}
              onclick={() => openModal(n.id)}
            >
              {@render barInner(actionLabel)}
            </button>
          {:else if opensCta}
            <a
              href={n.ctaHref}
              class="group block w-full cursor-pointer text-left text-inherit no-underline transition-colors duration-200 hover:bg-white/10 active:bg-white/15 motion-reduce:transition-none"
              tabindex={atTop ? 0 : -1}
              onclick={() => trackEvent(EVENTS.NOTIFICATION_CTA, { id: n.id })}
            >
              {@render barInner(actionLabel)}
            </a>
          {:else}
            {@render barInner(undefined)}
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}

{#if openEntry}
  <!--
    Responsive modal shell:
    - max-h + internal scroll for short / landscape viewports
    - safe-area padding for notched phones
    - sticky actions so CTA stays reachable while content scrolls
    - hero capped with max-h so image doesn't dominate short screens
  -->
  <div
    class="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-[2px] sm:items-center p-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]"
    role="presentation"
    onclick={(e) => {
      if (e.target === e.currentTarget) closeModal();
    }}
    onkeydown={(e) => {
      if (e.key === 'Escape') closeModal();
      else trapFocus(e);
    }}
  >
    <div
      bind:this={dialogEl}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`notify-title-${openEntry.id}`}
      aria-describedby={`notify-desc-${openEntry.id}`}
      tabindex="-1"
      class="relative flex w-full max-w-md max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-t-2xl rounded-b-2xl bg-ptt-bg-elevated text-ptt shadow-2xl ring-1 ring-ptt-border focus:outline-none sm:max-h-[calc(100dvh-2rem)]"
    >
      <button
        type="button"
        class="absolute right-2.5 top-2.5 z-20 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-3 sm:top-3"
        aria-label={closeLabel}
        onclick={closeModal}
      >
        <svg
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
          />
        </svg>
      </button>

      {#if openEntry.image}
        <div
          class="relative w-full shrink-0 overflow-hidden bg-[#F6EFE4] aspect-[16/9] max-h-[min(36dvh,12.5rem)] sm:max-h-[min(40dvh,14rem)]"
        >
          <img
            src={openEntry.image.src}
            alt={openEntry.image.alt}
            width="640"
            height="360"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            sizes="(max-width: 448px) 100vw, 448px"
            class="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      {/if}

      <div
        class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 {openEntry.image
          ? 'pt-2'
          : 'pt-5 sm:pt-6'}"
      >
        {#if openEntry.severity === 'important'}
          <p
            class="text-[11px] font-bold uppercase tracking-[0.16em] text-ptt-primary dark:text-ptt-primary-dark"
          >
            {importantLabel}
          </p>
        {/if}
        <h2
          id={`notify-title-${openEntry.id}`}
          class="mt-1.5 text-xl font-bold tracking-tight text-balance sm:text-2xl"
        >
          {openEntry.title}
        </h2>
        <p
          id={`notify-desc-${openEntry.id}`}
          class="mt-2 text-sm font-medium leading-snug text-ptt-secondary sm:text-base"
        >
          {openEntry.summary}
        </p>
        {#if openEntry.body}
          <p
            class="mt-2.5 text-sm leading-relaxed text-ptt-secondary whitespace-pre-line sm:mt-3"
          >
            {openEntry.body}
          </p>
        {/if}
      </div>

      <div
        class="shrink-0 border-t border-ptt-border/70 bg-ptt-bg-elevated px-4 py-3 sm:px-6 sm:py-4"
      >
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          {#if openEntry.ctaHref && openEntry.ctaLabel}
            <a
              href={openEntry.ctaHref}
              class="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-full bg-ptt-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ptt-primary-strong sm:flex-1 dark:bg-ptt-primary-dark dark:text-ptt-bg dark:hover:opacity-90"
              onclick={() =>
                trackEvent(EVENTS.NOTIFICATION_CTA, { id: openEntry.id })}
            >
              {openEntry.ctaLabel}
            </a>
          {/if}
          <button
            type="button"
            class="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-full border border-ptt-border px-5 py-2.5 text-sm font-semibold text-ptt-secondary transition hover:border-ptt-primary hover:text-ptt sm:w-auto"
            onclick={closeModal}
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
