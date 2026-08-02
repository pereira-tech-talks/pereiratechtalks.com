<script lang="ts">
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

let dismissed = $state<Record<string, boolean>>({});
let openModalId = $state<string | null>(null);
let dialogEl = $state<HTMLDivElement | undefined>(undefined);
let lastFocusedEl: HTMLElement | null = null;

const storageKey = (id: string): string => `ptt:notify-dismiss:${id}`;

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

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
  openModalId = id;
}

function closeModal(): void {
  openModalId = null;
  lastFocusedEl?.focus();
  lastFocusedEl = null;
}

$effect(() => {
  if (openModalId && dialogEl) {
    dialogEl.focus();
  }
});

$effect(() => {
  if (typeof sessionStorage === 'undefined') return;
  const next: Record<string, boolean> = {};
  for (const n of notifications) {
    next[n.id] = sessionStorage.getItem(storageKey(n.id)) === '1';
  }
  dismissed = next;
});

/** All non-dismissed alerts (priority order preserved from server). */
const visible = $derived(notifications.filter((n) => !dismissed[n.id]));

/**
 * Sticky chrome shows one bar at a time (highest priority). Dismissing it
 * reveals the next — avoids stacking two full-width bars on every page.
 */
const visibleBar = $derived(visible.slice(0, 1));

const openEntry = $derived(
  openModalId ? visible.find((n) => n.id === openModalId) : undefined
);

const dismissLabel = lang === 'es' ? 'Cerrar aviso' : 'Dismiss notice';
const moreLabel = lang === 'es' ? 'Ver más' : 'Learn more';
const importantLabel = lang === 'es' ? 'IMPORTANTE' : 'IMPORTANT';

function dismiss(id: string): void {
  dismissed = { ...dismissed, [id]: true };
  try {
    sessionStorage.setItem(storageKey(id), '1');
  } catch {
    /* private mode */
  }
  if (openModalId === id) closeModal();
}

function severityClass(severity: LocalizedNotification['severity']): string {
  switch (severity) {
    case 'important':
      return 'bg-ptt-primary text-white dark:bg-ptt-primary-dark dark:text-ptt-bg';
    case 'warning':
      return 'bg-ptt-bg-elevated text-ptt border-b border-ptt-border';
    case 'success':
      return 'bg-ptt-bg-elevated text-ptt border-b border-ptt-border';
    default:
      return 'bg-ptt-bg-elevated text-ptt border-b border-ptt-border dark:bg-ptt-bg';
  }
}
</script>

{#if visibleBar.length > 0}
  <div class="w-full" data-testid="top-notification-bar">
    {#each visibleBar as n (n.id)}
      <!--
        Mid-height bar (~36–40px). Touch targets stay ≥44px via
        invisible hit-area expanders, not min-h on the row.
      -->
      <div
        class={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 text-xs leading-snug ${severityClass(n.severity)}`}
        role="region"
        aria-label={n.title}
      >
        {#if n.severity === 'important'}
          <span
            class="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide leading-none bg-white text-ptt-bg-dark dark:bg-ptt-bg-dark dark:text-ptt-primary-dark"
          >
            {importantLabel}
          </span>
        {/if}
        <p class="min-w-0 flex-1 truncate">
          <span class="font-medium">{n.title}</span>
          <span class="mx-1 opacity-70">—</span>
          <span class="opacity-95">{n.summary}</span>
        </p>
        <div class="flex shrink-0 items-center gap-0.5">
          {#if n.modalEnabled && n.body}
            <button
              type="button"
              class="relative underline underline-offset-2 font-medium px-1.5 py-0.5 text-xs before:absolute before:content-[''] before:inset-y-[-8px] before:inset-x-[-4px]"
              onclick={() => openModal(n.id)}
            >
              {moreLabel}
            </button>
          {:else if n.ctaHref && n.ctaLabel}
            <a
              href={n.ctaHref}
              class="relative inline-flex items-center underline underline-offset-2 font-medium px-1.5 py-0.5 text-xs before:absolute before:content-[''] before:inset-y-[-8px] before:inset-x-[-4px]"
            >
              {n.ctaLabel}
            </a>
          {/if}
          <button
            type="button"
            class="relative inline-flex h-6 w-6 items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 before:absolute before:content-[''] before:inset-[-10px]"
            aria-label={dismissLabel}
            onclick={() => dismiss(n.id)}
          >
            <span aria-hidden="true" class="text-sm leading-none">×</span>
          </button>
        </div>
      </div>
    {/each}
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
            class="inline-flex min-h-[44px] items-center rounded-full bg-ptt-primary px-5 py-2 text-sm font-semibold text-white dark:bg-ptt-primary-dark dark:text-ptt-bg"
          >
            {openEntry.ctaLabel}
          </a>
        {/if}
        <button
          type="button"
          class="inline-flex min-h-[44px] items-center rounded-full border border-ptt-border px-5 py-2 text-sm font-semibold"
          onclick={() => {
            if (openEntry) dismiss(openEntry.id);
          }}
        >
          {dismissLabel}
        </button>
      </div>
    </div>
  </div>
{/if}
