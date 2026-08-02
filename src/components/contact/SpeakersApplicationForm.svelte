<script>
import { EVENTS, trackEvent } from '@/lib/analytics';
import { composeCfsMessage, validateCfsForm } from '@/lib/contact-form';
import { getTranslations } from '@/lib/translations';

export let lang = 'es';
export let apiEndpoint = '';

$: t = getTranslations(lang);
$: f = t.cfsForm;
$: cp = t.contactPage;

let formState = 'idle';
let name = '';
let email = '';
let talkTitle = '';
let format = '';
let abstract = '';
let takeaways = '';
let socialUrl = '';
let firstTime = false;
let speakerSchool = false;
let message = '';
let website = '';
let errors = {
  name: '',
  email: '',
  reason: '',
  subject: '',
  message: '',
  talkTitle: '',
  format: '',
  abstract: '',
  takeaways: '',
  socialUrl: '',
};
let submitError = '';
let successRef;

const inputClass =
  'w-full min-h-[44px] text-base p-3 rounded-lg border border-ptt-border bg-ptt-bg-elevated text-ptt focus:outline-none focus:ring-2 focus:ring-ptt-primary/30 focus:border-ptt-primary transition-colors';
const labelClass = 'block text-sm font-medium text-ptt-secondary mb-2';
const errorClass = 'mt-1 text-sm text-red-600 dark:text-red-400';

async function handleSubmit() {
  submitError = '';
  const subject = f.defaultSubject;
  const result = validateCfsForm(
    {
      name,
      email,
      reason: 'tech-talk',
      subject,
      message: message || abstract,
      website,
      talkTitle,
      format,
      abstract,
      takeaways,
      socialUrl,
      firstTime,
      speakerSchool,
    },
    {
      requiredField: cp.requiredField,
      invalidEmail: cp.invalidEmail,
    }
  );
  errors = result.errors;
  if (!result.valid) {
    trackEvent(EVENTS.CONTACT_FORM_ERROR, {
      field_count: 1,
      topic: 'tech-talk',
    });
    return;
  }
  if (!apiEndpoint) {
    submitError = cp.submitError;
    return;
  }

  formState = 'submitting';
  const composed = composeCfsMessage({
    name,
    email,
    reason: 'tech-talk',
    subject,
    message,
    website,
    talkTitle,
    format,
    abstract,
    takeaways,
    socialUrl,
    firstTime,
    speakerSchool,
  });

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        reason: 'tech-talk',
        subject,
        message: composed,
        lang,
        website,
        talkTitle,
        format,
        abstract,
        takeaways,
        socialUrl,
        firstTime,
        speakerSchool,
      }),
    });
    if (!response.ok) throw new Error('fail');
    formState = 'success';
    trackEvent(EVENTS.SPEAKER_APPLICATION_SUBMIT);
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
  talkTitle = '';
  format = '';
  abstract = '';
  takeaways = '';
  socialUrl = '';
  firstTime = false;
  speakerSchool = false;
  message = '';
  website = '';
  submitError = '';
  formState = 'idle';
}
</script>

{#if formState === 'success'}
  <div
    bind:this={successRef}
    tabindex="-1"
    class="text-center py-8"
    role="status"
    aria-live="polite"
  >
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
      <label for="cfs-website">Website</label>
      <input
        id="cfs-website"
        type="text"
        tabindex="-1"
        autocomplete="off"
        bind:value={website}
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="cfs-name" class={labelClass}>{cp.nameLabel}</label>
        <input
          id="cfs-name"
          class={inputClass}
          class:border-red-500={errors.name}
          bind:value={name}
          disabled={formState === 'submitting'}
          aria-invalid={errors.name ? 'true' : undefined}
        />
        {#if errors.name}<p class={errorClass}>{errors.name}</p>{/if}
      </div>
      <div>
        <label for="cfs-email" class={labelClass}>{cp.emailLabel}</label>
        <input
          id="cfs-email"
          type="email"
          inputmode="email"
          class={inputClass}
          class:border-red-500={errors.email}
          bind:value={email}
          disabled={formState === 'submitting'}
          aria-invalid={errors.email ? 'true' : undefined}
        />
        {#if errors.email}<p class={errorClass}>{errors.email}</p>{/if}
      </div>
    </div>

    <div>
      <label for="cfs-title" class={labelClass}>{f.talkTitleLabel}</label>
      <input
        id="cfs-title"
        class={inputClass}
        class:border-red-500={errors.talkTitle}
        placeholder={f.talkTitlePlaceholder}
        bind:value={talkTitle}
        disabled={formState === 'submitting'}
      />
      {#if errors.talkTitle}<p class={errorClass}>{errors.talkTitle}</p>{/if}
    </div>

    <div>
      <label for="cfs-format" class={labelClass}>{f.formatLabel}</label>
      <select
        id="cfs-format"
        class={inputClass}
        class:border-red-500={errors.format}
        bind:value={format}
        disabled={formState === 'submitting'}
      >
        {#each f.formatOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
      {#if errors.format}<p class={errorClass}>{errors.format}</p>{/if}
    </div>

    <div>
      <label for="cfs-abstract" class={labelClass}>{f.abstractLabel}</label>
      <textarea
        id="cfs-abstract"
        rows="5"
        class="{inputClass} resize-none"
        class:border-red-500={errors.abstract}
        placeholder={f.abstractPlaceholder}
        bind:value={abstract}
        disabled={formState === 'submitting'}
      ></textarea>
      {#if errors.abstract}<p class={errorClass}>{errors.abstract}</p>{/if}
    </div>

    <div>
      <label for="cfs-takeaways" class={labelClass}>{f.takeawaysLabel}</label>
      <textarea
        id="cfs-takeaways"
        rows="3"
        class="{inputClass} resize-none"
        class:border-red-500={errors.takeaways}
        placeholder={f.takeawaysPlaceholder}
        bind:value={takeaways}
        disabled={formState === 'submitting'}
      ></textarea>
      {#if errors.takeaways}<p class={errorClass}>{errors.takeaways}</p>{/if}
    </div>

    <div>
      <label for="cfs-social" class={labelClass}>{f.socialLabel}</label>
      <input
        id="cfs-social"
        type="url"
        class={inputClass}
        class:border-red-500={errors.socialUrl}
        placeholder={f.socialPlaceholder}
        bind:value={socialUrl}
        disabled={formState === 'submitting'}
      />
      {#if errors.socialUrl}<p class={errorClass}>{errors.socialUrl}</p>{/if}
    </div>

    <div class="space-y-3">
      <label class="flex items-start gap-3 min-h-[44px] cursor-pointer">
        <input
          type="checkbox"
          class="mt-1 h-5 w-5 rounded border-ptt-border"
          bind:checked={firstTime}
          disabled={formState === 'submitting'}
        />
        <span class="text-sm text-ptt">{f.firstTimeLabel}</span>
      </label>
      <label class="flex items-start gap-3 min-h-[44px] cursor-pointer">
        <input
          type="checkbox"
          class="mt-1 h-5 w-5 rounded border-ptt-border"
          bind:checked={speakerSchool}
          disabled={formState === 'submitting'}
        />
        <span class="text-sm text-ptt">{f.speakerSchoolLabel}</span>
      </label>
    </div>

    <div>
      <label for="cfs-notes" class={labelClass}>{f.notesLabel}</label>
      <textarea
        id="cfs-notes"
        rows="3"
        class="{inputClass} resize-none"
        placeholder={f.notesPlaceholder}
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
