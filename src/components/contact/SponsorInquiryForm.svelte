<script>
import { EVENTS, trackEvent } from '@/lib/analytics';
import { composeSponsorMessage, validateSponsorForm } from '@/lib/contact-form';
import { getTranslations } from '@/lib/translations';

export let lang = 'es';
export let apiEndpoint = '';

$: t = getTranslations(lang);
$: f = t.sponsorForm;
$: cp = t.contactPage;

let formState = 'idle';
let name = '';
let email = '';
let company = '';
let contactRole = '';
let tierInterest = '';
let contributionType = '';
let message = '';
let website = '';
let errors = {
  name: '',
  email: '',
  reason: '',
  subject: '',
  message: '',
  company: '',
  contactRole: '',
  tierInterest: '',
  contributionType: '',
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
  const result = validateSponsorForm(
    {
      name,
      email,
      reason: 'sponsorship',
      subject,
      message,
      website,
      company,
      contactRole,
      tierInterest,
      contributionType,
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
      topic: 'sponsorship',
    });
    return;
  }
  if (!apiEndpoint) {
    submitError = cp.submitError;
    return;
  }

  formState = 'submitting';
  const composed = composeSponsorMessage({
    name,
    email,
    reason: 'sponsorship',
    subject,
    message,
    website,
    company,
    contactRole,
    tierInterest,
    contributionType,
  });

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        reason: 'sponsorship',
        subject,
        message: composed,
        lang,
        website,
        company,
        contactRole,
        tierInterest,
        contributionType,
      }),
    });
    if (!response.ok) throw new Error('fail');
    formState = 'success';
    trackEvent(EVENTS.CONTACT_FORM_SUBMIT, { reason: 'sponsorship' });
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
  company = '';
  contactRole = '';
  tierInterest = '';
  contributionType = '';
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
      <label for="sponsor-website">Website</label>
      <input
        id="sponsor-website"
        type="text"
        tabindex="-1"
        autocomplete="off"
        bind:value={website}
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="sponsor-name" class={labelClass}>{cp.nameLabel}</label>
        <input
          id="sponsor-name"
          class={inputClass}
          class:border-red-500={errors.name}
          bind:value={name}
          disabled={formState === 'submitting'}
        />
        {#if errors.name}<p class={errorClass}>{errors.name}</p>{/if}
      </div>
      <div>
        <label for="sponsor-email" class={labelClass}>{cp.emailLabel}</label>
        <input
          id="sponsor-email"
          type="email"
          inputmode="email"
          class={inputClass}
          class:border-red-500={errors.email}
          bind:value={email}
          disabled={formState === 'submitting'}
        />
        {#if errors.email}<p class={errorClass}>{errors.email}</p>{/if}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="sponsor-company" class={labelClass}>{f.companyLabel}</label>
        <input
          id="sponsor-company"
          class={inputClass}
          class:border-red-500={errors.company}
          placeholder={f.companyPlaceholder}
          bind:value={company}
          disabled={formState === 'submitting'}
        />
        {#if errors.company}<p class={errorClass}>{errors.company}</p>{/if}
      </div>
      <div>
        <label for="sponsor-role" class={labelClass}>{f.roleLabel}</label>
        <input
          id="sponsor-role"
          class={inputClass}
          class:border-red-500={errors.contactRole}
          placeholder={f.rolePlaceholder}
          bind:value={contactRole}
          disabled={formState === 'submitting'}
        />
        {#if errors.contactRole}<p class={errorClass}>{errors.contactRole}</p
          >{/if}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="sponsor-tier" class={labelClass}>{f.tierLabel}</label>
        <select
          id="sponsor-tier"
          class={inputClass}
          class:border-red-500={errors.tierInterest}
          bind:value={tierInterest}
          disabled={formState === 'submitting'}
        >
          {#each f.tierOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
        {#if errors.tierInterest}<p class={errorClass}>{errors.tierInterest}</p
          >{/if}
      </div>
      <div>
        <label for="sponsor-contrib" class={labelClass}
          >{f.contributionLabel}</label
        >
        <select
          id="sponsor-contrib"
          class={inputClass}
          class:border-red-500={errors.contributionType}
          bind:value={contributionType}
          disabled={formState === 'submitting'}
        >
          {#each f.contributionOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
        {#if errors.contributionType}<p class={errorClass}
            >{errors.contributionType}</p
          >{/if}
      </div>
    </div>

    <div>
      <label for="sponsor-message" class={labelClass}>{f.messageLabel}</label>
      <textarea
        id="sponsor-message"
        rows="5"
        class="{inputClass} resize-none"
        class:border-red-500={errors.message}
        placeholder={f.messagePlaceholder}
        bind:value={message}
        disabled={formState === 'submitting'}
      ></textarea>
      {#if errors.message}<p class={errorClass}>{errors.message}</p>{/if}
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
