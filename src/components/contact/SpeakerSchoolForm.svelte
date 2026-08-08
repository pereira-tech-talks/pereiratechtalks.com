<script>
import { EVENTS, trackEvent } from '@/lib/analytics';
import { validateSpeakerSchoolForm } from '@/lib/contact-form';
import { focusFirstInvalidField } from '@/lib/form-ui';
import { getTranslations } from '@/lib/translations';

export let lang = 'es';
export let apiEndpoint = '/api/contact';

$: t = getTranslations(lang);
$: f = t.speakerSchoolForm;
$: cp = t.contactPage;

let formState = 'idle';
let name = '';
let email = '';
let experienceLevel = '';
let goals = '';
let topicsOfInterest = '';
let availability = '';
let priorSpeaking = '';
let socialOrLinkedin = '';
let message = '';
let website = '';
let errors = {
  name: '',
  email: '',
  experienceLevel: '',
  goals: '',
  topicsOfInterest: '',
  availability: '',
};
let submitError = '';
let successRef;

const inputClass =
  'w-full min-h-[44px] text-base p-3 rounded-lg border border-ptt-border bg-ptt-bg-elevated text-ptt focus:outline-none focus:ring-2 focus:ring-ptt-primary/30 focus:border-ptt-primary transition-colors';
const labelClass = 'block text-sm font-medium text-ptt-secondary mb-2';
const errorClass = 'mt-1 text-sm text-red-600 dark:text-red-400';

async function handleSubmit() {
  submitError = '';
  const result = validateSpeakerSchoolForm(
    {
      name,
      email,
      experienceLevel,
      goals,
      topicsOfInterest,
      availability,
      priorSpeaking,
      socialOrLinkedin,
      message,
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
      topic: 'speaker-school',
    });
    focusFirstInvalidField(
      [
        { key: 'name', id: 'ss-name' },
        { key: 'email', id: 'ss-email' },
        { key: 'experienceLevel', id: 'ss-level' },
        { key: 'goals', id: 'ss-goals' },
        { key: 'topicsOfInterest', id: 'ss-topics' },
        { key: 'availability', id: 'ss-availability' },
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
        _form: 'speaker-school',
        name,
        email,
        experienceLevel,
        goals,
        topicsOfInterest,
        availability,
        priorSpeaking,
        socialOrLinkedin,
        message,
        lang,
        website,
        page_path:
          typeof window !== 'undefined' ? window.location.pathname : '/',
      }),
    });
    if (!response.ok) throw new Error('fail');
    formState = 'success';
    trackEvent(EVENTS.SPEAKER_SCHOOL_APPLY_SUBMIT);
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
  experienceLevel = '';
  goals = '';
  topicsOfInterest = '';
  availability = '';
  priorSpeaking = '';
  socialOrLinkedin = '';
  message = '';
  website = '';
  errors = {
    name: '',
    email: '',
    experienceLevel: '',
    goals: '',
    topicsOfInterest: '',
    availability: '',
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
      <label for="ss-website">Website</label>
      <input
        id="ss-website"
        type="text"
        tabindex="-1"
        autocomplete="off"
        bind:value={website}
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="ss-name" class={labelClass}>{cp.nameLabel}</label>
        <input
          id="ss-name"
          class={inputClass}
          class:border-red-500={errors.name}
          bind:value={name}
          disabled={formState === 'submitting'}
          aria-describedby={errors.name ? 'ss-name-error' : undefined}
          aria-invalid={errors.name ? 'true' : undefined}
        />
        {#if errors.name}<p id="ss-name-error" class={errorClass} aria-live="polite">{errors.name}</p>{/if}
      </div>
      <div>
        <label for="ss-email" class={labelClass}>{cp.emailLabel}</label>
        <input
          id="ss-email"
          type="email"
          inputmode="email"
          class={inputClass}
          class:border-red-500={errors.email}
          bind:value={email}
          disabled={formState === 'submitting'}
          aria-describedby={errors.email ? 'ss-email-error' : undefined}
          aria-invalid={errors.email ? 'true' : undefined}
        />
        {#if errors.email}<p id="ss-email-error" class={errorClass} aria-live="polite">{errors.email}</p>{/if}
      </div>
    </div>

    <div>
      <label for="ss-level" class={labelClass}>{f.experienceLabel}</label>
      <select
        id="ss-level"
        class={inputClass}
        class:border-red-500={errors.experienceLevel}
        bind:value={experienceLevel}
        disabled={formState === 'submitting'}
        aria-describedby={errors.experienceLevel ? 'ss-level-error' : undefined}
        aria-invalid={errors.experienceLevel ? 'true' : undefined}
      >
        {#each f.experienceOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
      {#if errors.experienceLevel}<p id="ss-level-error" class={errorClass} aria-live="polite">{errors.experienceLevel}</p>{/if}
    </div>

    <div>
      <label for="ss-goals" class={labelClass}>{f.goalsLabel}</label>
      <textarea
        id="ss-goals"
        rows="4"
        class="{inputClass} resize-none"
        class:border-red-500={errors.goals}
        placeholder={f.goalsPlaceholder}
        bind:value={goals}
        disabled={formState === 'submitting'}
        aria-describedby={errors.goals ? 'ss-goals-error' : undefined}
        aria-invalid={errors.goals ? 'true' : undefined}
      ></textarea>
      {#if errors.goals}<p id="ss-goals-error" class={errorClass} aria-live="polite">{errors.goals}</p>{/if}
    </div>

    <div>
      <label for="ss-topics" class={labelClass}>{f.topicsLabel}</label>
      <textarea
        id="ss-topics"
        rows="3"
        class="{inputClass} resize-none"
        class:border-red-500={errors.topicsOfInterest}
        placeholder={f.topicsPlaceholder}
        bind:value={topicsOfInterest}
        disabled={formState === 'submitting'}
        aria-describedby={errors.topicsOfInterest ? 'ss-topics-error' : undefined}
        aria-invalid={errors.topicsOfInterest ? 'true' : undefined}
      ></textarea>
      {#if errors.topicsOfInterest}<p id="ss-topics-error" class={errorClass} aria-live="polite">{errors.topicsOfInterest}</p>{/if}
    </div>

    <div>
      <label for="ss-availability" class={labelClass}>{f.availabilityLabel}</label>
      <textarea
        id="ss-availability"
        rows="3"
        class="{inputClass} resize-none"
        class:border-red-500={errors.availability}
        placeholder={f.availabilityPlaceholder}
        bind:value={availability}
        disabled={formState === 'submitting'}
        aria-describedby={errors.availability ? 'ss-availability-error' : undefined}
        aria-invalid={errors.availability ? 'true' : undefined}
      ></textarea>
      {#if errors.availability}<p id="ss-availability-error" class={errorClass} aria-live="polite">{errors.availability}</p>{/if}
    </div>

    <div>
      <label for="ss-prior" class={labelClass}>{f.priorSpeakingLabel}</label>
      <textarea
        id="ss-prior"
        rows="3"
        class="{inputClass} resize-none"
        placeholder={f.priorSpeakingPlaceholder}
        bind:value={priorSpeaking}
        disabled={formState === 'submitting'}
      ></textarea>
    </div>

    <div>
      <label for="ss-social" class={labelClass}>{f.socialLabel}</label>
      <input
        id="ss-social"
        type="url"
        class={inputClass}
        placeholder={f.socialPlaceholder}
        bind:value={socialOrLinkedin}
        disabled={formState === 'submitting'}
      />
    </div>

    <div>
      <label for="ss-message" class={labelClass}>{f.messageLabel}</label>
      <textarea
        id="ss-message"
        rows="3"
        class="{inputClass} resize-none"
        placeholder={f.messagePlaceholder}
        bind:value={message}
        disabled={formState === 'submitting'}
      ></textarea>
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
