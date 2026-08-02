<script lang="ts">
import type { Language } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

interface Props {
  lang: Language;
  year: number;
}

let { lang, year }: Props = $props();
const t = getTranslations(lang).ptdPage.subscribe;

let email = $state('');
let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');

async function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  if (!email.trim()) return;
  status = 'submitting';
  try {
    const response = await fetch('/api/ptd-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), year, lang }),
    });
    if (!response.ok) throw new Error('submit_failed');
    status = 'success';
    email = '';
    setTimeout(() => {
      status = 'idle';
    }, 4000);
  } catch {
    status = 'error';
    setTimeout(() => {
      status = 'idle';
    }, 4000);
  }
}
</script>

<div class="ptd-subscribe mt-6 max-w-xl">
  <p class="text-sm text-[var(--ptt-text-muted)]">{t.copy}</p>
  <form class="mt-3 flex flex-col gap-3 sm:flex-row" onsubmit={handleSubmit}>
    <label class="sr-only" for="ptd-subscribe-email">{t.emailLabel}</label>
    <input
      id="ptd-subscribe-email"
      type="email"
      name="email"
      required
      placeholder={t.emailPlaceholder}
      bind:value={email}
      disabled={status === 'submitting'}
      class="min-w-0 flex-1 rounded-full border border-[var(--ptt-border)] bg-[var(--ptt-bg-elevated)] px-4 py-3 text-sm text-[var(--ptt-text)] placeholder:text-[var(--ptt-text-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ptt-primary)] disabled:opacity-60"
    />
    <button
      type="submit"
      disabled={status === 'submitting'}
      class="rounded-full bg-[var(--ptt-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ptt-primary)]"
    >
      {#if status === 'submitting'}
        {t.submitting}
      {:else if status === 'success'}
        {t.success}
      {:else if status === 'error'}
        {t.error}
      {:else}
        {t.button}
      {/if}
    </button>
  </form>
</div>
