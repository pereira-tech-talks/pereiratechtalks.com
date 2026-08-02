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

const storageKey = (id: string): string => `ptt:notify-dismiss:${id}`;

$effect(() => {
  if (typeof sessionStorage === 'undefined') return;
  const next: Record<string, boolean> = {};
  for (const n of notifications) {
    next[n.id] = sessionStorage.getItem(storageKey(n.id)) === '1';
  }
  dismissed = next;
});

const visible = $derived(notifications.filter((n) => !dismissed[n.id]));

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
  if (openModalId === id) openModalId = null;
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

{#if visible.length > 0}
  <div class="w-full" data-testid="top-notification-bar">
    {#each visible as n (n.id)}
      <div
        class={`flex items-center gap-3 px-3 sm:px-4 py-2 text-sm ${severityClass(n.severity)}`}
        role="region"
        aria-label={n.title}
      >
        {#if n.severity === 'important'}
          <span
            class="shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide bg-white/20"
          >
            {importantLabel}
          </span>
        {/if}
        <p class="min-w-0 flex-1 truncate">
          <span class="font-medium">{n.title}</span>
          <span class="mx-1 opacity-70">—</span>
          <span class="opacity-95">{n.summary}</span>
        </p>
        <div class="flex shrink-0 items-center gap-2">
          {#if n.modalEnabled && n.body}
            <button
              type="button"
              class="underline underline-offset-2 font-medium min-h-[44px] px-1"
              onclick={() => {
                openModalId = n.id;
              }}
            >
              {moreLabel}
            </button>
          {:else if n.ctaHref && n.ctaLabel}
            <a
              href={n.ctaHref}
              class="underline underline-offset-2 font-medium min-h-[44px] inline-flex items-center px-1"
            >
              {n.ctaLabel}
            </a>
          {/if}
          <button
            type="button"
            class="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10"
            aria-label={dismissLabel}
            onclick={() => dismiss(n.id)}
          >
            <span aria-hidden="true" class="text-lg leading-none">×</span>
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
      if (e.target === e.currentTarget) openModalId = null;
    }}
    onkeydown={(e) => {
      if (e.key === 'Escape') openModalId = null;
    }}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`notify-title-${openEntry.id}`}
      class="w-full max-w-lg rounded-xl bg-ptt-bg-elevated text-ptt border border-ptt-border p-6 shadow-xl"
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
