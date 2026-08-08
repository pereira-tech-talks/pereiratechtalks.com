<script lang="ts">
import {
  EVENTS,
  getAnalyticsContext,
  trackEventWithContext,
} from '@/lib/analytics';
import type { Language } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

interface Props {
  lang: Language;
  year: number;
}

let { lang, year }: Props = $props();
const t = getTranslations(lang).ptdPage.subscribe;

let email = $state('');
let website = $state('');
let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
let statusMessage = $state('');

async function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  if (website.trim()) {
    status = 'success';
    statusMessage = t.success;
    return;
  }
  if (!email.trim()) return;
  status = 'submitting';
  statusMessage = '';
  try {
    const response = await fetch('/api/ptd-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim(),
        year,
        lang,
        website: website.trim(),
      }),
    });
    if (!response.ok) throw new Error('submit_failed');
    status = 'success';
    statusMessage = t.success;
    trackEventWithContext(
      EVENTS.PTD_SUBSCRIBE,
      { year },
      getAnalyticsContext(lang, window.location.pathname)
    );
    email = '';
    setTimeout(() => {
      status = 'idle';
      statusMessage = '';
    }, 4000);
  } catch {
    status = 'error';
    statusMessage = t.error;
    setTimeout(() => {
      status = 'idle';
      statusMessage = '';
    }, 4000);
  }
}
</script>

<div class="ptd-subscribe">
  <p class="text-sm italic text-[var(--ptt-text-muted)]">{t.copy}</p>
  <form class="mt-3 flex flex-col gap-3 sm:flex-row" onsubmit={handleSubmit}>
    <div
      style="position:absolute;left:-9999px;height:0;overflow:hidden;"
      aria-hidden="true"
    >
      <label for="ptd-subscribe-website">Website</label>
      <input
        id="ptd-subscribe-website"
        type="text"
        tabindex="-1"
        autocomplete="off"
        bind:value={website}
      />
    </div>
    <label class="sr-only" for="ptd-subscribe-email">{t.emailLabel}</label>
    <input
      id="ptd-subscribe-email"
      type="email"
      name="email"
      required
      placeholder={t.emailPlaceholder}
      bind:value={email}
      disabled={status === 'submitting'}
      class="min-h-[44px] min-w-0 flex-1 rounded-xl border border-[var(--ptt-border)] bg-[var(--ptt-bg-elevated)] px-4 py-3 text-base text-[var(--ptt-text)] placeholder:text-[var(--ptt-text-muted)] shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ptt-primary)] disabled:opacity-60"
    />
    <button
      type="submit"
      disabled={status === 'submitting'}
      class="min-h-[44px] rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ptt-primary)]"
      style="background: linear-gradient(135deg, #3ab9c9 0%, var(--ptt-primary) 100%);"
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
  <p class="sr-only" aria-live="polite">{statusMessage}</p>
</div>
