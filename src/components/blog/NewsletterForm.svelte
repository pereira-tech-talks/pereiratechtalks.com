<script>
import { onMount } from 'svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import { getTranslations } from '@/lib/translations';

const STORAGE_KEY = 'newsletter-subscribed';

export let lang = 'en';
export let formUrl = '';
export let entries = { email: '' };

$: t = getTranslations(lang);

// Form state: 'idle' | 'submitting' | 'success' | 'subscribed'
let formState = 'idle';
let email = '';
let emailError = '';
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

  if (!email.trim() || !validateEmail(email)) {
    emailError = t.engagement.newsletterInvalidEmail;
    return;
  }

  formState = 'submitting';

  try {
    const formData = new FormData();
    formData.append(entries.email, email);

    await fetch(formUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData),
    });

    localStorage.setItem(STORAGE_KEY, 'true');
    formState = 'success';
    trackEvent(EVENTS.NEWSLETTER_SUBSCRIBE);
    setTimeout(() => successRef?.focus(), 100);
  } catch {
    // With no-cors, fetch only throws on network errors
    // Still show success since we can't confirm either way
    localStorage.setItem(STORAGE_KEY, 'true');
    formState = 'success';
    trackEvent(EVENTS.NEWSLETTER_SUBSCRIBE);
    setTimeout(() => successRef?.focus(), 100);
  }
}
</script>

<div class="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
  {#if formState === 'success'}
    <div
      bind:this={successRef}
      tabindex="-1"
      class="text-center"
      role="status"
      aria-live="polite"
    >
      <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
        {t.engagement.newsletterSuccessTitle}
      </h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
        {t.engagement.newsletterSuccessMessage}
      </p>
      <button
        type="button"
        on:click={() => { localStorage.removeItem(STORAGE_KEY); email = ''; emailError = ''; formState = 'idle'; }}
        class="mt-3 text-sm font-medium text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
      >
        {t.engagement.newsletterResubscribe}
      </button>
    </div>
  {:else if formState === 'subscribed'}
    <div class="text-center" role="status">
      <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
        {t.engagement.newsletterSuccessTitle}
      </h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
        {t.engagement.newsletterAlreadySubscribed}
      </p>
      <button
        type="button"
        on:click={() => { localStorage.removeItem(STORAGE_KEY); email = ''; emailError = ''; formState = 'idle'; }}
        class="mt-3 text-sm font-medium text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
      >
        {t.engagement.newsletterResubscribe}
      </button>
    </div>
  {:else}
    <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
      {t.engagement.newsletterTitle}
    </h3>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
      {t.engagement.newsletterDescription}
    </p>
    <form
      on:submit|preventDefault={handleSubmit}
      class="mt-4 flex flex-col gap-3 sm:flex-row"
      novalidate
    >
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
          class="flex-1 rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 disabled:opacity-60 disabled:cursor-not-allowed {emailError ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}"
        />
        {#if emailError}
          <p id="newsletter-email-error" class="mt-1 text-sm text-red-600 dark:text-red-400" aria-live="polite">
            {emailError}
          </p>
        {/if}
      </div>
      <button
        type="submit"
        disabled={formState === 'submitting'}
        class="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400/20 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {#if formState === 'submitting'}
          {t.engagement.newsletterSubmitting}
        {:else}
          {t.engagement.newsletterButton}
        {/if}
      </button>
    </form>
    <p class="mt-2 text-xs text-gray-600 dark:text-gray-300">
      {t.engagement.newsletterPrivacy}
    </p>
  {/if}
</div>
