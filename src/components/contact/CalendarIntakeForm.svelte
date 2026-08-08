<script>
import { EVENTS, trackEvent } from '@/lib/analytics';
import { validateCalendarIntakeForm } from '@/lib/contact-form';
import { focusFirstInvalidField } from '@/lib/form-ui';
import { getTranslations } from '@/lib/translations';

export let lang = 'es';
export let apiEndpoint = '/api/contact';

$: t = getTranslations(lang);
$: f = t.calendarForm;
$: cp = t.contactPage;

let formState = 'idle';
let name = '';
let email = '';
let communityName = '';
let googleCalendarId = '';
let publicCalendarUrl = '';
let communityWebsite = '';
let shortDescription = '';
let website = '';
let errors = {
  name: '',
  email: '',
  communityName: '',
  googleCalendarId: '',
  shortDescription: '',
};
let submitError = '';
let successRef;

const inputClass =
  'w-full min-h-[44px] text-base p-3 rounded-lg border border-ptt-border bg-ptt-bg-elevated text-ptt focus:outline-none focus:ring-2 focus:ring-ptt-primary/30 focus:border-ptt-primary transition-colors';
const labelClass = 'block text-sm font-medium text-ptt-secondary mb-2';
const errorClass = 'mt-1 text-sm text-red-600 dark:text-red-400';
const hintClass = 'mt-1 text-sm text-ptt-secondary';

async function handleSubmit() {
  submitError = '';
  const result = validateCalendarIntakeForm(
    {
      name,
      email,
      communityName,
      googleCalendarId,
      shortDescription,
      publicCalendarUrl,
      communityWebsite,
      website,
    },
    {
      requiredField: cp.requiredField,
      invalidEmail: cp.invalidEmail,
    }
  );
  errors = result.errors;
  if (!result.valid) {
    const failedCount = Object.values(errors).filter(Boolean).length;
    trackEvent(EVENTS.CONTACT_FORM_ERROR, {
      field_count: failedCount,
      topic: 'calendar',
    });
    focusFirstInvalidField(
      [
        { key: 'name', id: 'cal-name' },
        { key: 'email', id: 'cal-email' },
        { key: 'communityName', id: 'cal-community' },
        { key: 'googleCalendarId', id: 'cal-id' },
        { key: 'shortDescription', id: 'cal-description' },
      ],
      errors
    );
    return;
  }
  if (!apiEndpoint) {
    submitError = cp.submitError;
    return;
  }

  formState = 'submitting';

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _form: 'calendar',
        name,
        email,
        communityName,
        googleCalendarId,
        publicCalendarUrl,
        communityWebsite,
        shortDescription,
        lang,
        website,
        page_path:
          typeof window !== 'undefined' ? window.location.pathname : '/',
      }),
    });
    if (!response.ok) throw new Error('fail');
    formState = 'success';
    trackEvent(EVENTS.CALENDAR_INTAKE_SUBMIT);
    setTimeout(() => successRef?.focus(), 100);
  } catch {
    submitError = cp.submitError;
    formState = 'idle';
    trackEvent(EVENTS.CONTACT_FORM_ERROR, { reason: 'submit_failed' });
  }
}

function resetForm() {
  name = '';
  email = '';
  communityName = '';
  googleCalendarId = '';
  publicCalendarUrl = '';
  communityWebsite = '';
  shortDescription = '';
  website = '';
  errors = {
    name: '',
    email: '',
    communityName: '',
    googleCalendarId: '',
    shortDescription: '',
  };
  submitError = '';
  formState = 'idle';
}
</script>

{#if formState === 'success'}
  <div
    bind:this={successRef}
    tabindex="-1"
    class="text-center py-12"
    role="status"
    aria-live="polite"
  >
    <div class="mb-4 text-5xl" aria-hidden="true">✓</div>
    <h3 class="text-2xl font-bold text-ptt mb-3">{f.successTitle}</h3>
    <p class="text-ptt-secondary mb-6">{f.successMessage}</p>
    <button
      type="button"
      on:click={resetForm}
      class="inline-flex min-h-[44px] items-center px-6 py-2 rounded-full border border-ptt-primary text-ptt-primary font-semibold hover:bg-ptt-primary hover:text-white transition-colors"
    >
      {cp.sendAnotherButton}
    </button>
  </div>
{:else}
  <form class="space-y-6" on:submit|preventDefault={handleSubmit} novalidate>
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
      <label for="cal-website-hp">Website</label>
      <input
        id="cal-website-hp"
        type="text"
        tabindex="-1"
        autocomplete="off"
        bind:value={website}
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="cal-name" class={labelClass}>{cp.nameLabel}</label>
        <input
          id="cal-name"
          class={inputClass}
          class:border-red-500={errors.name}
          bind:value={name}
          disabled={formState === 'submitting'}
          aria-describedby={errors.name ? 'cal-name-error' : undefined}
          aria-invalid={errors.name ? 'true' : undefined}
        />
        {#if errors.name}<p id="cal-name-error" class={errorClass} aria-live="polite">{errors.name}</p>{/if}
      </div>
      <div>
        <label for="cal-email" class={labelClass}>{cp.emailLabel}</label>
        <input
          id="cal-email"
          type="email"
          inputmode="email"
          class={inputClass}
          class:border-red-500={errors.email}
          bind:value={email}
          disabled={formState === 'submitting'}
          aria-describedby={errors.email ? 'cal-email-error' : undefined}
          aria-invalid={errors.email ? 'true' : undefined}
        />
        {#if errors.email}<p id="cal-email-error" class={errorClass} aria-live="polite">{errors.email}</p>{/if}
      </div>
    </div>

    <div>
      <label for="cal-community" class={labelClass}>{f.communityLabel}</label>
      <input
        id="cal-community"
        class={inputClass}
        class:border-red-500={errors.communityName}
        placeholder={f.communityPlaceholder}
        bind:value={communityName}
        disabled={formState === 'submitting'}
        aria-describedby={errors.communityName ? 'cal-community-error' : undefined}
        aria-invalid={errors.communityName ? 'true' : undefined}
      />
      {#if errors.communityName}<p id="cal-community-error" class={errorClass} aria-live="polite">{errors.communityName}</p>{/if}
    </div>

    <div>
      <label for="cal-id" class={labelClass}>{f.calendarIdLabel}</label>
      <input
        id="cal-id"
        class={inputClass}
        class:border-red-500={errors.googleCalendarId}
        placeholder={f.calendarIdPlaceholder}
        bind:value={googleCalendarId}
        disabled={formState === 'submitting'}
        aria-describedby={errors.googleCalendarId ? 'cal-id-error' : 'cal-id-hint'}
        aria-invalid={errors.googleCalendarId ? 'true' : undefined}
      />
      <p id="cal-id-hint" class={hintClass}>{f.calendarIdHint}</p>
      {#if errors.googleCalendarId}<p id="cal-id-error" class={errorClass} aria-live="polite">{errors.googleCalendarId}</p>{/if}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="cal-public-url" class={labelClass}>{f.publicUrlLabel}</label>
        <input
          id="cal-public-url"
          type="url"
          class={inputClass}
          placeholder={f.publicUrlPlaceholder}
          bind:value={publicCalendarUrl}
          disabled={formState === 'submitting'}
        />
      </div>
      <div>
        <label for="cal-site" class={labelClass}>{f.websiteLabel}</label>
        <input
          id="cal-site"
          type="url"
          class={inputClass}
          placeholder={f.websitePlaceholder}
          bind:value={communityWebsite}
          disabled={formState === 'submitting'}
        />
      </div>
    </div>

    <div>
      <label for="cal-description" class={labelClass}>{f.descriptionLabel}</label>
      <textarea
        id="cal-description"
        rows="4"
        class="{inputClass} resize-none"
        class:border-red-500={errors.shortDescription}
        placeholder={f.descriptionPlaceholder}
        bind:value={shortDescription}
        disabled={formState === 'submitting'}
        aria-describedby={errors.shortDescription ? 'cal-description-error' : undefined}
        aria-invalid={errors.shortDescription ? 'true' : undefined}
      ></textarea>
      {#if errors.shortDescription}<p id="cal-description-error" class={errorClass} aria-live="polite">{errors.shortDescription}</p>{/if}
    </div>

    <div class="text-center">
      <button
        type="submit"
        disabled={formState === 'submitting'}
        class="inline-flex min-h-[44px] items-center px-8 py-3 bg-ptt-primary text-white font-semibold rounded-full hover:bg-ptt-primary-strong transition-colors disabled:opacity-60"
      >
        {formState === 'submitting' ? cp.sendingButton : f.submitButton}
      </button>
    </div>
  </form>
{/if}
