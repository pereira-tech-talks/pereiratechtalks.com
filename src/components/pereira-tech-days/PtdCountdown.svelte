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
  <!-- Hub variant: discrete cards on cream featured stage (uses --ptd-hub-* when present) -->
  <div
    class="ptd-countdown-hub"
    role="timer"
    aria-live="polite"
    aria-label={lang === 'es' ? 'Cuenta regresiva' : 'Countdown'}
  >
    {#if ended}
      <p
        class="text-sm font-semibold text-[color:var(--ptd-hub-teal,var(--color-ptt-primary))]"
      >
        {t.ended}
      </p>
    {:else}
      <div
        class="grid w-full max-w-full grid-cols-4 gap-1.5 sm:gap-2.5"
      >
        {#each units as unit}
          <div
            class="min-w-0 rounded-2xl bg-white px-1.5 py-2.5 text-center shadow-md shadow-[color:var(--ptd-hub-navy,#1f3f59)]/8 ring-1 ring-[color:var(--ptd-hub-border,#eadcd4)] sm:px-3 sm:py-3 dark:bg-[color:var(--ptd-hub-cream-dark,#1a2a38)] dark:ring-white/15"
          >
            <span
              class="block text-2xl font-bold tabular-nums leading-none text-[color:var(--ptd-hub-teal,var(--color-ptt-primary))] sm:text-3xl lg:text-4xl dark:text-[color:var(--ptd-hub-cyan,#3ab9c9)]"
              style="font-family: Bebas Neue, 'Arial Black', sans-serif; letter-spacing: 0.04em;"
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span
              class="mt-1.5 block text-[9px] font-semibold uppercase tracking-wider text-[color:var(--ptd-hub-muted,var(--color-ptt-secondary))] sm:mt-2 sm:text-xs sm:tracking-widest"
            >
              {unit.label}
            </span>
          </div>
        {/each}
      </div>
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
      <div
        class="grid w-full max-w-full grid-cols-4 gap-1.5 sm:flex sm:flex-wrap sm:items-end sm:gap-3"
      >
        {#each units as unit, i}
          {#if i > 0}
            <span
              class="mb-6 hidden text-2xl font-bold text-[var(--ptt-text-muted)] sm:mb-7 sm:inline"
              aria-hidden="true">:</span
            >
          {/if}
          <div
            class="min-w-0 rounded-2xl bg-[var(--ptt-bg-elevated)] px-1.5 py-2.5 text-center shadow-md shadow-[var(--ptt-text)]/5 ring-1 ring-[var(--ptt-border)] sm:min-w-[4.75rem] sm:px-4 sm:py-3"
          >
            <span
              class="block text-2xl font-bold tabular-nums leading-none text-[var(--ptt-primary)] sm:text-4xl"
              style="font-family: Bebas Neue, 'Arial Black', sans-serif; letter-spacing: 0.04em;"
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span
              class="mt-1.5 block text-[9px] font-semibold uppercase tracking-wider text-[var(--ptt-text-muted)] sm:mt-2 sm:text-xs sm:tracking-widest"
            >
              {unit.label}
            </span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
