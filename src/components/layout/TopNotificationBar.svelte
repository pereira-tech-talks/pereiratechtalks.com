<script lang="ts">
import { EVENTS, trackEvent } from '@/lib/analytics';

interface LocalizedNotification {
  id: string;
  severity: 'info' | 'important' | 'success' | 'warning';
  title: string;
  summary: string;
  body?: string;
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

function openModal(id: string): void {
  lastFocusedEl = document.activeElement as HTMLElement | null;
  modalLocked = true;
  openModalId = id;
  trackEvent(EVENTS.NOTIFICATION_MODAL_OPEN, { id });
}

function closeModal(): void {
  modalLocked = false;
  openModalId = null;
  lastFocusedEl?.focus();
  lastFocusedEl = null;
}

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
  <!--
    grid 0fr/1fr collapses height without max-height guessing (avoids
    mid-animation clipping when the row is taller than max-h-12/16).
  -->
  <div
    class="grid w-full transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
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
        -->
        <div
          class="{severityClass(n.severity)} {atTop
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'} transition-opacity duration-200 ease-out motion-reduce:transition-none"
          role="region"
          aria-label={n.title}
        >
          <div
            class="mx-auto flex w-full min-w-0 max-w-7xl items-center gap-2 px-4 py-1.5 text-xs leading-snug overflow-hidden sm:gap-2.5 md:px-6"
          >
            {#if n.severity === 'important'}
              <span
                class="hidden min-[360px]:inline shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide leading-none bg-white text-ptt-bg-dark"
              >
                {importantLabel}
              </span>
            {/if}
            <p class="min-w-0 flex-1 truncate overflow-hidden">
              <span class="font-medium">{n.title}</span>
              <span class="mx-1 opacity-70">—</span>
              <span class="opacity-95">{n.summary}</span>
            </p>
            <div class="flex shrink-0 items-center gap-0.5">
              {#if n.modalEnabled && n.body}
                <button
                  type="button"
                  class="relative cursor-pointer underline underline-offset-2 font-medium px-1.5 py-0.5 text-xs before:absolute before:content-[''] before:inset-y-[-8px] before:inset-x-[-4px]"
                  tabindex={atTop ? 0 : -1}
                  onclick={() => openModal(n.id)}
                >
                  {moreLabel}
                </button>
              {:else if n.ctaHref && n.ctaLabel}
                <a
                  href={n.ctaHref}
                  class="relative inline-flex cursor-pointer items-center underline underline-offset-2 font-medium px-1.5 py-0.5 text-xs before:absolute before:content-[''] before:inset-y-[-8px] before:inset-x-[-4px]"
                  tabindex={atTop ? 0 : -1}
                  onclick={() => trackEvent(EVENTS.NOTIFICATION_CTA, { id: n.id })}
                >
                  {n.ctaLabel}
                </a>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

{#if openEntry}
  <div
    class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50"
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
      tabindex="-1"
      class="w-full max-w-lg rounded-xl bg-ptt-bg-elevated text-ptt border border-ptt-border p-6 shadow-xl focus:outline-none"
    >
      <h2
        id={`notify-title-${openEntry.id}`}
        class="text-xl font-bold tracking-tight"
      >
        {openEntry.title}
      </h2>
      <p class="mt-2 text-ptt-secondary">{openEntry.summary}</p>
      {#if openEntry.body}
        <p class="mt-4 whitespace-pre-line leading-relaxed">{openEntry.body}</p>
      {/if}
      <div class="mt-6 flex flex-wrap gap-3 justify-end">
        {#if openEntry.ctaHref && openEntry.ctaLabel}
          <a
            href={openEntry.ctaHref}
            class="inline-flex min-h-[44px] cursor-pointer items-center rounded-full bg-ptt-primary px-5 py-2 text-sm font-semibold text-white dark:bg-ptt-primary-dark dark:text-ptt-bg"
            onclick={() =>
              trackEvent(EVENTS.NOTIFICATION_CTA, { id: openEntry.id })}
          >
            {openEntry.ctaLabel}
          </a>
        {/if}
        <button
          type="button"
          class="inline-flex min-h-[44px] cursor-pointer items-center rounded-full border border-ptt-border px-5 py-2 text-sm font-semibold"
          onclick={closeModal}
        >
          {closeLabel}
        </button>
      </div>
    </div>
  </div>
{/if}
