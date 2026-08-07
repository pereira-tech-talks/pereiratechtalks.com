<script lang="ts">
import type { Language } from '@/lib/i18n';

interface Props {
  lang: Language;
  targetDate: string;
  endDate?: string;
  variant?: 'edition' | 'hub';
}

let { lang, targetDate, endDate, variant = 'edition' }: Props = $props();

const labels = {
  en: {
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    ended: 'Event started',
  },
  es: {
    days: 'Días',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    ended: 'El evento comenzó',
  },
};
const t = labels[lang];

let remaining = $state({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let ended = $state(false);

function tick() {
  const now = Date.now();
  const target = new Date(targetDate).getTime();
  const end = endDate ? new Date(endDate).getTime() : target;
  if (now >= end) {
    ended = true;
    return;
  }
  const diff = Math.max(0, target - now);
  remaining = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

$effect(() => {
  tick();
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
});

const units = $derived([
  { value: remaining.days, label: t.days },
  { value: remaining.hours, label: t.hours },
  { value: remaining.minutes, label: t.minutes },
  { value: remaining.seconds, label: t.seconds },
]);
</script>

{#if variant === 'hub'}
  <!-- Hub variant: PTT global tokens on dark stage background -->
  <div
    class="grid grid-cols-4 divide-x divide-white/20 rounded-2xl bg-white/10 py-3 ring-1 ring-white/20 backdrop-blur-sm sm:py-4"
    role="timer"
    aria-live="polite"
    aria-label={lang === 'es' ? 'Cuenta regresiva' : 'Countdown'}
  >
    {#if ended}
      <p class="col-span-4 px-4 text-sm font-semibold text-white">{t.ended}</p>
    {:else}
      {#each units as unit}
        <div class="px-1 text-center sm:px-2">
          <span class="block text-2xl font-bold tabular-nums text-white sm:text-3xl">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span
            class="mt-1 block text-[10px] font-semibold uppercase tracking-widest text-white/70 sm:text-xs"
          >
            {unit.label}
          </span>
        </div>
      {/each}
    {/if}
  </div>
{:else}
  <!-- Edition variant: 2026 photocopy discrete cards (Bebas numerals) -->
  <div
    class="ptd-countdown-block"
    role="timer"
    aria-live="polite"
    aria-label={lang === 'es' ? 'Cuenta regresiva' : 'Countdown'}
  >
    {#if ended}
      <p class="text-sm font-semibold text-[var(--ptt-primary)]">{t.ended}</p>
    {:else}
      <div class="flex flex-wrap items-end gap-2 sm:gap-3">
        {#each units as unit, i}
          {#if i > 0}
            <span
              class="mb-6 hidden text-2xl font-bold text-[var(--ptt-text-muted)] sm:mb-7 sm:inline"
              aria-hidden="true">:</span
            >
          {/if}
          <div
            class="min-w-[4.25rem] rounded-2xl bg-[var(--ptt-bg-elevated)] px-3 py-3 text-center shadow-md shadow-[var(--ptt-text)]/5 ring-1 ring-[var(--ptt-border)] sm:min-w-[4.75rem] sm:px-4"
          >
            <span
              class="block text-3xl font-bold tabular-nums leading-none text-[var(--ptt-primary)] sm:text-4xl"
              style="font-family: Bebas Neue, 'Arial Black', sans-serif; letter-spacing: 0.04em;"
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span
              class="mt-2 block text-[10px] font-semibold uppercase tracking-widest text-[var(--ptt-text-muted)] sm:text-xs"
            >
              {unit.label}
            </span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
