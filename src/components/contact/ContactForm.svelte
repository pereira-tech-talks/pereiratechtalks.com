<script>
import { onMount } from 'svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import { getTranslations } from '@/lib/translations';

export let lang = 'en';
export let formUrl = '';
export let entries = {
  name: '',
  email: '',
  reason: '',
  subject: '',
  message: '',
};

$: t = getTranslations(lang);

// Form state: 'idle' | 'submitting' | 'success'
let formState = 'idle';

// Form data
let name = '';
let email = '';
let reason = '';
let subject = '';
let message = '';

// Validation errors
let errors = { name: '', email: '', reason: '', subject: '', message: '' };

// Reference for focus management
let successRef;

const inputClass =
  'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors';
const labelClass =
  'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2';
const errorClass = 'mt-1 text-sm text-red-600 dark:text-red-400';

const MAX_SUBJECT_LENGTH = 140;
const MAX_MESSAGE_LENGTH = 2000;

function sanitizeText(value, maxLength) {
  return value.trim().slice(0, maxLength);
}

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
  const topicParam = params.get('topic');
  const subjectParam = params.get('subject');
  const messageParam = params.get('message');

  if (topicParam) {
    const allowedValues = getAllowedReasonValues();
    if (allowedValues.has(topicParam)) {
      reason = topicParam;
    }
  }

  if (subjectParam) {
    subject = sanitizeText(subjectParam, MAX_SUBJECT_LENGTH);
  }

  if (messageParam) {
    message = sanitizeText(messageParam, MAX_MESSAGE_LENGTH);
  }
}

onMount(() => {
  applyPrefillFromQueryParams();
});

function focusFirstInvalidField() {
  const fieldOrder = [
    { key: 'name', id: 'contact-name' },
    { key: 'email', id: 'contact-email' },
    { key: 'reason', id: 'contact-reason' },
    { key: 'subject', id: 'contact-subject' },
    { key: 'message', id: 'contact-message' },
  ];

  const firstInvalid = fieldOrder.find((field) => errors[field.key]);
  if (firstInvalid) {
    const el = document.getElementById(firstInvalid.id);
    el?.focus();
  }
}

function validate() {
  let valid = true;
  errors = { name: '', email: '', reason: '', subject: '', message: '' };

  if (!name.trim()) {
    errors.name = t.contactPage.requiredField;
    valid = false;
  }
  if (!email.trim()) {
    errors.email = t.contactPage.requiredField;
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = t.contactPage.invalidEmail;
    valid = false;
  }
  if (!subject.trim()) {
    errors.subject = t.contactPage.requiredField;
    valid = false;
  }
  if (!reason.trim()) {
    errors.reason = t.contactPage.requiredField;
    valid = false;
  }
  if (!message.trim()) {
    errors.message = t.contactPage.requiredField;
    valid = false;
  }

  return valid;
}

async function handleSubmit() {
  if (!validate()) {
    const failedCount = Object.values(errors).filter(Boolean).length;
    trackEvent(EVENTS.CONTACT_FORM_ERROR, { field_count: failedCount });
    focusFirstInvalidField();
    return;
  }
  formState = 'submitting';

  try {
    const formData = new FormData();
    formData.append(entries.name, name);
    formData.append(entries.email, email);
    formData.append(entries.reason, reason);
    formData.append(entries.subject, subject);
    formData.append(entries.message, message);

    await fetch(formUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData),
    });

    formState = 'success';
    trackEvent(EVENTS.CONTACT_FORM_SUBMIT, { reason: reason || 'unspecified' });
    // Focus success message for screen readers
    setTimeout(() => successRef?.focus(), 100);
  } catch (error) {
    // With no-cors, fetch only throws on network errors
    // Still show success since we can't confirm either way
    formState = 'success';
    trackEvent(EVENTS.CONTACT_FORM_SUBMIT, { reason: reason || 'unspecified' });
    setTimeout(() => successRef?.focus(), 100);
  }
}

function resetForm() {
  name = '';
  email = '';
  reason = '';
  subject = '';
  message = '';
  errors = { name: '', email: '', reason: '', subject: '', message: '' };
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
    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
      {t.contactPage.successTitle}
    </h3>
    <p class="text-gray-600 dark:text-gray-300 mb-6">
      {t.contactPage.successMessage}
    </p>
    <button
      type="button"
      on:click={resetForm}
      class="px-6 py-2 rounded-full border border-secondary text-secondary font-semibold hover:bg-secondary hover:text-white transition-colors"
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="contact-name" class={labelClass}>
          {t.contactPage.nameLabel}
        </label>
        <input
          id="contact-name"
          type="text"
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
        class="px-8 py-3 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-colors shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {#if formState === 'submitting'}
          {t.contactPage.sendingButton}
        {:else}
          {t.contactPage.sendButton}
        {/if}
      </button>
      <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
        {t.contactPage.formNote}
      </p>
    </div>
  </form>
{/if}
