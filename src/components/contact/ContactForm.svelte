<script>
import { onMount } from 'svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import {
  MAX_MESSAGE_LENGTH,
  MAX_SUBJECT_LENGTH,
  normalizeTopic,
  resolveTopicFromSearchParams,
  sanitizeContactText,
  validateContactForm,
} from '@/lib/contact-form';
import { focusFirstInvalidField } from '@/lib/form-ui';
import { getTranslations } from '@/lib/translations';

export let lang = 'es';
/**
 * Cloudflare Pages Function endpoint (e.g. `/api/contact`) that submits to
 * Dailybot Forms (optional Resend ack server-side). Required — no third-party
 * form fallback.
 */
export let apiEndpoint = '/api/contact';

$: t = getTranslations(lang);

// Form state: 'idle' | 'submitting' | 'success'
let formState = 'idle';

// Form data
let name = '';
let email = '';
let reason = '';
let subject = '';
let message = '';

// Honeypot — must stay empty for real submissions
let website = '';

// Validation errors
let errors = { name: '', email: '', reason: '', subject: '', message: '' };

// Generic submit error message (rendered above the form)
let submitError = '';

// Reference for focus management
let successRef;

const inputClass =
  'w-full min-h-[44px] text-base p-3 rounded-lg border border-ptt-border bg-ptt-bg-elevated text-ptt focus:outline-none focus:ring-2 focus:ring-ptt-primary/30 focus:border-ptt-primary transition-colors';
const labelClass = 'block text-sm font-medium text-ptt-secondary mb-2';
const errorClass = 'mt-1 text-sm text-red-600 dark:text-red-400';

function getAllowedReasonValues() {
  return new Set(
    t.contactPage.reasonOptions
      .map((option) => option.value)
      .filter((value) => value.length > 0)
  );
}

function applyPrefillFromQueryParams() {
  if (typeof window === 'undefined') {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const allowedValues = getAllowedReasonValues();
  const topic = resolveTopicFromSearchParams(params, allowedValues);
  if (topic) {
    reason = topic;
  }

  const subjectParam = params.get('subject');
  const messageParam = params.get('message');

  if (subjectParam) {
    subject = sanitizeContactText(subjectParam, MAX_SUBJECT_LENGTH);
  }

  if (messageParam) {
    message = sanitizeContactText(messageParam, MAX_MESSAGE_LENGTH);
  }
}

onMount(() => {
  applyPrefillFromQueryParams();
});

function focusInvalid() {
  focusFirstInvalidField(
    [
      { key: 'name', id: 'contact-name' },
      { key: 'email', id: 'contact-email' },
      { key: 'reason', id: 'contact-reason' },
      { key: 'subject', id: 'contact-subject' },
      { key: 'message', id: 'contact-message' },
    ],
    errors
  );
}

function validate() {
  const result = validateContactForm(
    {
      name,
      email,
      reason: normalizeTopic(reason) || reason,
      subject,
      message,
      website,
    },
    getAllowedReasonValues(),
    {
      requiredField: t.contactPage.requiredField,
      invalidEmail: t.contactPage.invalidEmail,
    }
  );
  errors = result.errors;
  if (result.valid) {
    reason = normalizeTopic(reason) || reason;
  }
  return result.valid;
}

async function submitToApi(endpoint) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      _form: 'contact',
      name,
      email,
      reason,
      topic: reason,
      subject,
      message,
      lang,
      website,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
    }),
  });

  if (!response.ok) {
    let payload;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    const errorCode =
      (payload && typeof payload === 'object' && payload?.error) ||
      `http_${response.status}`;
    throw new Error(errorCode);
  }
}

async function handleSubmit() {
  submitError = '';

  if (!validate()) {
    const failedCount = Object.values(errors).filter(Boolean).length;
    trackEvent(EVENTS.CONTACT_FORM_ERROR, { field_count: failedCount });
    focusInvalid();
    return;
  }

  if (!apiEndpoint) {
    submitError = t.contactPage.submitError;
    trackEvent(EVENTS.CONTACT_FORM_ERROR, { reason: 'no_backend_configured' });
    return;
  }

  formState = 'submitting';

  try {
    await submitToApi(apiEndpoint);
    formState = 'success';
    trackEvent(EVENTS.CONTACT_FORM_SUBMIT, { reason: reason || 'unspecified' });
    setTimeout(() => successRef?.focus(), 100);
  } catch {
    submitError = t.contactPage.submitError;
    formState = 'idle';
    trackEvent(EVENTS.CONTACT_FORM_ERROR, { reason: 'submit_failed' });
  }
}

function resetForm() {
  name = '';
  email = '';
  reason = '';
  subject = '';
  message = '';
  website = '';
  errors = { name: '', email: '', reason: '', subject: '', message: '' };
  submitError = '';
  formState = 'idle';
}
</script>

{#if formState === 'success'}
  <div
    bind:this={successRef}
    tabindex="-1"
    class="max-w-2xl mx-auto text-center py-12"
    role="status"
    aria-live="polite"
  >
    <div class="mb-4 text-5xl">✓</div>
    <h3 class="text-2xl font-bold text-ptt mb-3">
      {t.contactPage.successTitle}
    </h3>
    <p class="text-ptt-secondary mb-2">
      {t.contactPage.successMessage}
    </p>
    <p class="text-ptt-secondary mb-6 text-sm">
      {t.contactPage.successNextSteps[reason] ||
        t.contactPage.successNextSteps.general ||
        t.contactPage.formNote}
    </p>
    <button
      type="button"
      on:click={resetForm}
      class="px-6 py-2 rounded-full border border-ptt-primary text-ptt-primary font-semibold hover:bg-ptt-primary hover:text-white transition-colors"
    >
      {t.contactPage.sendAnotherButton}
    </button>
  </div>
{:else}
  <form
    class="max-w-2xl mx-auto space-y-6"
    on:submit|preventDefault={handleSubmit}
    novalidate
  >
    {#if submitError}
      <div
        class="rounded-lg border border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-200 p-4"
        role="alert"
        aria-live="assertive"
      >
        {submitError}
      </div>
    {/if}

    <div
      style="position:absolute;left:-9999px;height:0;overflow:hidden;"
      aria-hidden="true"
    >
      <label for="contact-website">Website</label>
      <input
        id="contact-website"
        name="website"
        type="text"
        autocomplete="off"
        tabindex="-1"
        bind:value={website}
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="contact-name" class={labelClass}>
          {t.contactPage.nameLabel}
        </label>
        <input
          id="contact-name"
          type="text"
          autocomplete="name"
          placeholder={t.contactPage.namePlaceholder}
          class={inputClass}
          class:border-red-500={errors.name}
          bind:value={name}
          disabled={formState === 'submitting'}
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={errors.name ? 'true' : undefined}
        />
        {#if errors.name}
          <p id="name-error" class={errorClass} aria-live="polite">
            {errors.name}
          </p>
        {/if}
      </div>
      <div>
        <label for="contact-email" class={labelClass}>
          {t.contactPage.emailLabel}
        </label>
        <input
          id="contact-email"
          type="email"
          autocomplete="email"
          inputmode="email"
          placeholder={t.contactPage.emailPlaceholder}
          class={inputClass}
          class:border-red-500={errors.email}
          bind:value={email}
          disabled={formState === 'submitting'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={errors.email ? 'true' : undefined}
        />
        {#if errors.email}
          <p id="email-error" class={errorClass} aria-live="polite">
            {errors.email}
          </p>
        {/if}
      </div>
    </div>

    <div>
      <label for="contact-reason" class={labelClass}>
        {t.contactPage.reasonLabel}
      </label>
      <select
        id="contact-reason"
        class={inputClass}
        class:border-red-500={errors.reason}
        bind:value={reason}
        disabled={formState === 'submitting'}
        aria-describedby={errors.reason ? 'reason-error' : undefined}
        aria-invalid={errors.reason ? 'true' : undefined}
        required
      >
        {#each t.contactPage.reasonOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
      {#if errors.reason}
        <p id="reason-error" class={errorClass} aria-live="polite">
          {errors.reason}
        </p>
      {/if}
    </div>

    <div>
      <label for="contact-subject" class={labelClass}>
        {t.contactPage.subjectLabel}
      </label>
      <input
        id="contact-subject"
        type="text"
        placeholder={t.contactPage.subjectPlaceholder}
        class={inputClass}
        class:border-red-500={errors.subject}
        bind:value={subject}
        disabled={formState === 'submitting'}
        aria-describedby={errors.subject ? 'subject-error' : undefined}
        aria-invalid={errors.subject ? 'true' : undefined}
      />
      {#if errors.subject}
        <p id="subject-error" class={errorClass} aria-live="polite">
          {errors.subject}
        </p>
      {/if}
    </div>

    <div>
      <label for="contact-message" class={labelClass}>
        {t.contactPage.messageLabel}
      </label>
      <textarea
        id="contact-message"
        rows="6"
        placeholder={t.contactPage.messagePlaceholder}
        class="{inputClass} resize-none"
        class:border-red-500={errors.message}
        bind:value={message}
        disabled={formState === 'submitting'}
        aria-describedby={errors.message ? 'message-error' : undefined}
        aria-invalid={errors.message ? 'true' : undefined}
      ></textarea>
      {#if errors.message}
        <p id="message-error" class={errorClass} aria-live="polite">
          {errors.message}
        </p>
      {/if}
    </div>

    <div class="text-center">
      <button
        type="submit"
        disabled={formState === 'submitting'}
        class="px-8 py-3 bg-ptt-primary text-white font-semibold rounded-full hover:bg-ptt-primary-strong transition-colors shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {#if formState === 'submitting'}
          {t.contactPage.sendingButton}
        {:else}
          {t.contactPage.sendButton}
        {/if}
      </button>
      <p class="mt-3 text-sm text-ptt-secondary">
        {t.contactPage.formNote}
      </p>
    </div>
  </form>
{/if}
