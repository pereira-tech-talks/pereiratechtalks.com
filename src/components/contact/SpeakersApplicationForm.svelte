<script>
import { EVENTS, trackEvent } from '@/lib/analytics';
import { validateCfsForm } from '@/lib/contact-form';
import { focusFirstInvalidField } from '@/lib/form-ui';
import { getTranslations } from '@/lib/translations';

export let lang = 'es';
export let apiEndpoint = '/api/contact';

/**
 * `global` — the always-open call at /call-for-speakers. Offers an optional
 *   meetup selector built from `openCalls`; with an empty list it renders
 *   exactly as it did before this prop existed.
 * `meetup` — mounted on a meetup page. The meetup is fixed and stated up
 *   front, and only that meetup's formats are offered.
 */
export let mode = 'global';
export let meetupSlug = '';
export let meetupTitle = '';
export let meetupDateLabel = '';
/**
 * The formats this context accepts. `null` means all four.
 * @type {readonly string[] | null}
 */
export let allowedFormats = null;
/**
 * For the global selector.
 * @type {Array<{ slug: string; title: string; dateLabel: string; formats: readonly string[] }>}
 */
export let openCalls = [];

$: t = getTranslations(lang);
$: f = t.cfsForm;
$: cp = t.contactPage;
$: fm = t.cfsForm.meetup;

/** The meetup a submission is tagged with — fixed in `meetup` mode, chosen in `global`. */
let selectedMeetup = '';
$: effectiveMeetupSlug = mode === 'meetup' ? meetupSlug : selectedMeetup;

$: selectedCall = openCalls.find((c) => c.slug === selectedMeetup) ?? null;

/**
 * Which formats the current context accepts. In `meetup` mode that is the
 * meetup's own list; in `global` mode it narrows only once a meetup is picked.
 */
$: activeFormats =
  mode === 'meetup'
    ? (allowedFormats ?? null)
    : (selectedCall?.formats ?? null);

/** `formatOptions` filtered to the active list. The empty "select…" option stays. */
$: formatChoices = activeFormats
  ? f.formatOptions.filter(
      (opt) => opt.value === '' || activeFormats.includes(opt.value)
    )
  : f.formatOptions;

/**
 * A select with one real option is a worse experience than a sentence, so a
 * single accepted format is stated rather than offered.
 */
$: singleFormat =
  activeFormats && activeFormats.length === 1 ? activeFormats[0] : null;
$: singleFormatLabel = singleFormat
  ? (f.formatOptions.find((o) => o.value === singleFormat)?.label ??
    singleFormat)
  : '';

/** Fires only for a real choice — "no preference" is the default, not a signal. */
function onMeetupSelected() {
  if (!selectedMeetup) return;
  trackEvent(EVENTS.CFS_MEETUP_SELECT, { meetup_slug: selectedMeetup });
}

const listSeparator = (parts) => {
  if (parts.length <= 1) return parts.join('');
  const last = parts[parts.length - 1];
  const head = parts.slice(0, -1).join(', ');
  return `${head} ${lang === 'es' ? 'y' : 'and'} ${last}`;
};

$: narrowedNotice =
  mode === 'global' && activeFormats && activeFormats.length > 1
    ? fm.formatsNarrowed.replace(
        '{formats}',
        listSeparator(
          activeFormats.map(
            (v) => f.formatOptions.find((o) => o.value === v)?.label ?? v
          )
        )
      )
    : '';

let formState = 'idle';
let name = '';
let email = '';
let talkTitle = '';
let format = '';
let abstract = '';
let takeaways = '';
let socialUrl = '';
let slidesUrl = '';
let profilePhoto = '';
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
  slidesUrl: '',
};
let submitError = '';
let successRef;

// Declared after the form state it writes to. Locks the format when only one
// is possible, and clears a choice the newly selected meetup cannot stage
// rather than letting the server reject it after the abstract is written.
$: if (singleFormat) {
  format = singleFormat;
} else if (activeFormats && format && !activeFormats.includes(format)) {
  format = '';
}

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
      meetupSlug: effectiveMeetupSlug,
      slidesUrl,
      profilePhoto,
    },
    {
      requiredField: cp.requiredField,
      invalidEmail: cp.invalidEmail,
      formatNotAllowed: fm.formatNotAllowed,
      slidesUrlInvalid: f.slidesUrlInvalid,
    },
    activeFormats ?? undefined
  );
  errors = result.errors;
  if (!result.valid) {
    const failedCount = Object.values(errors).filter(Boolean).length;
    trackEvent(EVENTS.CONTACT_FORM_ERROR, {
      field_count: failedCount,
      topic: 'tech-talk',
    });
    focusFirstInvalidField(
      [
        { key: 'name', id: 'cfs-name' },
        { key: 'email', id: 'cfs-email' },
        { key: 'talkTitle', id: 'cfs-title' },
        { key: 'format', id: 'cfs-format' },
        { key: 'abstract', id: 'cfs-abstract' },
        { key: 'takeaways', id: 'cfs-takeaways' },
        { key: 'slidesUrl', id: 'cfs-slides' },
        { key: 'socialUrl', id: 'cfs-social' },
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
        _form: 'cfs',
        name,
        email,
        reason: 'tech-talk',
        subject,
        message: message || '',
        lang,
        website,
        talkTitle,
        format,
        abstract,
        takeaways,
        socialUrl,
        slidesUrl,
        profilePhoto,
        firstTime,
        speakerSchool,
        meetupSlug: effectiveMeetupSlug,
        page_path:
          typeof window !== 'undefined' ? window.location.pathname : '/',
      }),
    });
    if (!response.ok) throw new Error('fail');
    formState = 'success';
    trackEvent(EVENTS.SPEAKER_APPLICATION_SUBMIT);
    if (effectiveMeetupSlug) {
      trackEvent(EVENTS.MEETUP_CFS_SUBMIT, {
        meetup_slug: effectiveMeetupSlug,
        format,
      });
    }
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
  slidesUrl = '';
  profilePhoto = '';
  firstTime = false;
  speakerSchool = false;
  message = '';
  website = '';
  // The meetup context is a property of where the form is mounted, not of the
  // submission, so `mode="meetup"` keeps it across a submit-another.
  if (mode === 'global') selectedMeetup = '';
  errors = {
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
    slidesUrl: '',
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
  <form
    class="space-y-6"
    on:submit|preventDefault={handleSubmit}
    novalidate
    aria-describedby={mode === 'meetup' && meetupTitle
      ? 'cfs-meetup-context'
      : undefined}
  >
    {#if mode === 'meetup' && meetupTitle}
      <div
        id="cfs-meetup-context"
        class="rounded-xl bg-ptt-primary-soft/60 dark:bg-ptt-bg-elevated ring-1 ring-ptt-border p-4"
      >
        <p class="text-xs font-semibold uppercase tracking-wider text-ptt-primary dark:text-ptt-primary-dark">
          {fm.contextLabel}
        </p>
        <p class="mt-1 font-semibold text-ptt">{meetupTitle}</p>
        {#if meetupDateLabel}
          <p class="text-sm text-ptt-secondary">{meetupDateLabel}</p>
        {/if}
      </div>
    {/if}

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
          aria-describedby={errors.name ? 'cfs-name-error' : undefined}
          aria-invalid={errors.name ? 'true' : undefined}
        />
        {#if errors.name}<p id="cfs-name-error" class={errorClass} aria-live="polite">{errors.name}</p>{/if}
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
          aria-describedby={errors.email ? 'cfs-email-error' : undefined}
          aria-invalid={errors.email ? 'true' : undefined}
        />
        {#if errors.email}<p id="cfs-email-error" class={errorClass} aria-live="polite">{errors.email}</p>{/if}
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
        aria-describedby={errors.talkTitle ? 'cfs-title-error' : undefined}
        aria-invalid={errors.talkTitle ? 'true' : undefined}
      />
      {#if errors.talkTitle}<p id="cfs-title-error" class={errorClass} aria-live="polite">{errors.talkTitle}</p>{/if}
    </div>

    {#if mode === 'global' && openCalls.length > 0}
      <div>
        <label for="cfs-meetup" class={labelClass}>{fm.selectLabel}</label>
        <select
          id="cfs-meetup"
          class={inputClass}
          bind:value={selectedMeetup}
          on:change={onMeetupSelected}
          disabled={formState === 'submitting'}
          aria-describedby="cfs-meetup-help"
        >
          <option value="">{fm.selectNone}</option>
          {#each openCalls as call}
            <option value={call.slug}>
              {fm.selectOption
                .replace('{date}', call.dateLabel)
                .replace('{meetup}', call.title)}
            </option>
          {/each}
        </select>
        <p id="cfs-meetup-help" class="mt-1 text-sm text-ptt-secondary">
          {fm.selectHelp}
        </p>
      </div>
    {/if}

    {#if singleFormat}
      <div>
        <p class={labelClass}>{f.formatLabel}</p>
        <p class="text-ptt">
          {fm.singleFormatNote.replace('{format}', singleFormatLabel)}
        </p>
      </div>
    {:else}
      <div>
        <label for="cfs-format" class={labelClass}>{f.formatLabel}</label>
        <select
          id="cfs-format"
          class={inputClass}
          class:border-red-500={errors.format}
          bind:value={format}
          disabled={formState === 'submitting'}
          aria-describedby={errors.format
            ? 'cfs-format-error'
            : narrowedNotice
              ? 'cfs-format-narrowed'
              : undefined}
          aria-invalid={errors.format ? 'true' : undefined}
        >
          {#each formatChoices as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
        {#if narrowedNotice}
          <p id="cfs-format-narrowed" class="mt-1 text-sm text-ptt-secondary">
            {narrowedNotice}
          </p>
        {/if}
        {#if errors.format}<p id="cfs-format-error" class={errorClass} aria-live="polite">{errors.format}</p>{/if}
      </div>
    {/if}

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
        aria-describedby={errors.abstract ? 'cfs-abstract-error' : undefined}
        aria-invalid={errors.abstract ? 'true' : undefined}
      ></textarea>
      {#if errors.abstract}<p id="cfs-abstract-error" class={errorClass} aria-live="polite">{errors.abstract}</p>{/if}
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
        aria-describedby={errors.takeaways ? 'cfs-takeaways-error' : undefined}
        aria-invalid={errors.takeaways ? 'true' : undefined}
      ></textarea>
      {#if errors.takeaways}<p id="cfs-takeaways-error" class={errorClass} aria-live="polite">{errors.takeaways}</p>{/if}
    </div>

    <div>
      <label for="cfs-slides" class={labelClass}>{f.slidesUrlLabel}</label>
      <!--
        Required, but with no `required` attribute: native constraint validation
        runs before the submit handler and would replace this form's localized
        inline errors with a browser bubble, and skip `focusFirstInvalidField`.
        Every other required field here works the same way.
      -->
      <input
        id="cfs-slides"
        type="url"
        class={inputClass}
        class:border-red-500={errors.slidesUrl}
        placeholder={f.slidesUrlPlaceholder}
        bind:value={slidesUrl}
        disabled={formState === 'submitting'}
        aria-describedby={errors.slidesUrl
          ? 'cfs-slides-error cfs-slides-help'
          : 'cfs-slides-help'}
        aria-invalid={errors.slidesUrl ? 'true' : undefined}
      />
      {#if errors.slidesUrl}<p id="cfs-slides-error" class={errorClass} aria-live="polite">{errors.slidesUrl}</p>{/if}
      <p id="cfs-slides-help" class="mt-1 text-sm text-ptt-secondary">
        {f.slidesUrlHelp}
      </p>
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
        aria-describedby={errors.socialUrl ? 'cfs-social-error' : undefined}
        aria-invalid={errors.socialUrl ? 'true' : undefined}
      />
      {#if errors.socialUrl}<p id="cfs-social-error" class={errorClass} aria-live="polite">{errors.socialUrl}</p>{/if}
    </div>

    <div>
      <label for="cfs-photo" class={labelClass}>{f.profilePhotoLabel}</label>
      <!--
        `type="text"`, not `type="url"`: the field accepts a link OR a sentence
        like "use my LinkedIn photo", and a url input would reject the sentence.
      -->
      <input
        id="cfs-photo"
        type="text"
        class={inputClass}
        placeholder={f.profilePhotoPlaceholder}
        bind:value={profilePhoto}
        disabled={formState === 'submitting'}
        aria-describedby="cfs-photo-help"
      />
      <p id="cfs-photo-help" class="mt-1 text-sm text-ptt-secondary">
        {f.profilePhotoHelp}
      </p>
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
