<script>
import { onMount } from 'svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import { getTranslations } from '@/lib/translations';

const STORAGE_KEY = 'newsletter-subscribed';

export let lang = 'es';
/** Reserved for a future API path. No Google Forms backend. */
export let apiEndpoint = '';

$: t = getTranslations(lang);

// Form state: 'idle' | 'submitting' | 'success' | 'subscribed'
let formState = 'idle';
let email = '';
let emailError = '';
let submitError = '';
let website = '';
let successRef;

onMount(() => {
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    formState = 'subscribed';
  }
});

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function handleSubmit() {
  emailError = '';
  submitError = '';

  if (website.trim()) {
    // Honeypot — pretend success
    formState = 'success';
    return;
  }

  if (!email.trim() || !validateEmail(email)) {
    emailError = t.engagement.newsletterInvalidEmail;
    return;
  }

  if (!apiEndpoint) {
    submitError = t.contactPage.submitError;
    return;
  }

  formState = 'submitting';

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, lang, website }),
    });
    if (!response.ok) throw new Error('fail');

    localStorage.setItem(STORAGE_KEY, 'true');
    formState = 'success';
    trackEvent(EVENTS.NEWSLETTER_SUBSCRIBE);
    setTimeout(() => successRef?.focus(), 100);
  } catch {
    submitError = t.contactPage.submitError;
    formState = 'idle';
  }
}
</script>

<div class="rounded-2xl border border-ptt-border bg-ptt-bg-elevated p-6">
  {#if formState === 'success'}
    <div
      bind:this={successRef}
      tabindex="-1"
      class="text-center"
      role="status"
      aria-live="polite"
    >
      <h3 class="text-lg font-bold text-ptt">
        {t.engagement.newsletterSuccessTitle}
      </h3>
      <p class="mt-1 text-sm text-ptt-secondary">
        {t.engagement.newsletterSuccessMessage}
      </p>
      <button
        type="button"
        on:click={() => { localStorage.removeItem(STORAGE_KEY); email = ''; emailError = ''; formState = 'idle'; }}
        class="mt-3 text-sm font-medium text-ptt-primary underline-offset-2 hover:underline"
      >
        {t.engagement.newsletterResubscribe}
      </button>
    </div>
  {:else if formState === 'subscribed'}
    <div class="text-center" role="status">
      <h3 class="text-lg font-bold text-ptt">
        {t.engagement.newsletterSuccessTitle}
      </h3>
      <p class="mt-1 text-sm text-ptt-secondary">
        {t.engagement.newsletterAlreadySubscribed}
      </p>
      <button
        type="button"
        on:click={() => { localStorage.removeItem(STORAGE_KEY); email = ''; emailError = ''; formState = 'idle'; }}
        class="mt-3 text-sm font-medium text-ptt-primary underline-offset-2 hover:underline"
      >
        {t.engagement.newsletterResubscribe}
      </button>
    </div>
  {:else}
    <h3 class="text-lg font-bold text-ptt">
      {t.engagement.newsletterTitle}
    </h3>
    <p class="mt-1 text-sm text-ptt-secondary">
      {t.engagement.newsletterDescription}
    </p>
    <form
      on:submit|preventDefault={handleSubmit}
      class="mt-4 flex flex-col gap-3 sm:flex-row"
      novalidate
    >
      <div
        style="position:absolute;left:-9999px;height:0;overflow:hidden;"
        aria-hidden="true"
      >
        <label for="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          type="text"
          tabindex="-1"
          autocomplete="off"
          bind:value={website}
        />
      </div>
      <div class="flex flex-1 flex-col">
        <label for="newsletter-email" class="sr-only">
          {t.engagement.newsletterPlaceholder}
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder={t.engagement.newsletterPlaceholder}
          required
          bind:value={email}
          disabled={formState === 'submitting'}
          aria-describedby={emailError ? 'newsletter-email-error' : undefined}
          aria-invalid={emailError ? 'true' : undefined}
          class="min-h-[44px] flex-1 rounded-lg border bg-ptt-bg-elevated px-4 py-2.5 text-base text-ptt placeholder-ptt-muted transition-colors focus:border-ptt-primary focus:outline-none focus:ring-2 focus:ring-ptt-primary/20 disabled:opacity-60 disabled:cursor-not-allowed {emailError ? 'border-ptt-danger' : 'border-ptt-border'}"
        />
        {#if emailError}
          <p id="newsletter-email-error" class="mt-1 text-sm text-ptt-danger" aria-live="polite">
            {emailError}
          </p>
        {/if}
        {#if submitError}
          <p class="mt-1 text-sm text-ptt-danger" role="alert">
            {submitError}
          </p>
        {/if}
      </div>
      <button
        type="submit"
        disabled={formState === 'submitting'}
        class="shrink-0 rounded-lg bg-ptt-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ptt-primary-strong focus:outline-none focus:ring-2 focus:ring-ptt-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {#if formState === 'submitting'}
          {t.engagement.newsletterSubmitting}
        {:else}
          {t.engagement.newsletterButton}
        {/if}
      </button>
    </form>
    <p class="mt-2 text-xs text-ptt-secondary">
      {t.engagement.newsletterPrivacy}
    </p>
  {/if}
</div>
