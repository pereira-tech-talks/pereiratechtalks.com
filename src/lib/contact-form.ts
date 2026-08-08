/**
 * Shared contact / CFS / sponsorship intake validators and helpers.
 * Used by Svelte forms and mirrored by functions/api/contact.ts allowlists.
 */

export const MAX_SUBJECT_LENGTH = 140;
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_NAME_LENGTH = 120;
export const MAX_TALK_TITLE_LENGTH = 160;
export const MAX_ABSTRACT_LENGTH = 2000;
export const MAX_TAKEAWAYS_LENGTH = 800;
export const MAX_SOCIAL_LENGTH = 300;
export const MAX_COMPANY_LENGTH = 160;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Canonical topic values (dropdown + API allowlist). */
export const CANONICAL_TOPICS = [
  'general',
  'tech-talk',
  'sponsorship',
  'collaboration',
  'the-library-of-tomorrow',
  'press',
  'conduct',
  'other',
] as const;

export type CanonicalTopic = (typeof CANONICAL_TOPICS)[number];

/** Legacy / alternate query values → canonical topic. */
export const TOPIC_ALIASES: Record<string, CanonicalTopic> = {
  project: 'sponsorship',
  sponsor: 'sponsorship',
  sponsorship: 'sponsorship',
  speaker: 'tech-talk',
  'tech-talk': 'tech-talk',
  cfs: 'tech-talk',
  press: 'press',
  media: 'press',
  conduct: 'conduct',
  coc: 'conduct',
  collaboration: 'collaboration',
  general: 'general',
  other: 'other',
  'the-library-of-tomorrow': 'the-library-of-tomorrow',
};

export const CFS_FORMATS = [
  'regular',
  'lightning',
  'panel',
  'workshop',
] as const;

export type CfsFormat = (typeof CFS_FORMATS)[number];

export const SPONSOR_TIERS = [
  'diamond',
  'gold',
  'silver',
  'bronze',
  'community',
  'unsure',
] as const;

export type SponsorTier = (typeof SPONSOR_TIERS)[number];

export const CONTRIBUTION_TYPES = [
  'cash',
  'in-kind',
  'both',
  'unsure',
] as const;
export type ContributionType = (typeof CONTRIBUTION_TYPES)[number];

export const SPEAKER_SCHOOL_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
] as const;
export type SpeakerSchoolLevel = (typeof SPEAKER_SCHOOL_LEVELS)[number];

export interface ContactFormFields {
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
  website?: string;
}

export interface ContactFormErrors {
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
}

export interface CfsFormFields extends ContactFormFields {
  talkTitle: string;
  format: string;
  abstract: string;
  takeaways: string;
  socialUrl: string;
  firstTime: boolean;
  speakerSchool: boolean;
}

export interface CfsFormErrors extends ContactFormErrors {
  talkTitle: string;
  format: string;
  abstract: string;
  takeaways: string;
  socialUrl: string;
}

export interface SponsorFormFields extends ContactFormFields {
  company: string;
  contactRole: string;
  tierInterest: string;
  contributionType: string;
}

export interface SponsorFormErrors extends ContactFormErrors {
  company: string;
  contactRole: string;
  tierInterest: string;
  contributionType: string;
}

export interface SpeakerSchoolFormFields {
  name: string;
  email: string;
  experienceLevel: string;
  goals: string;
  topicsOfInterest: string;
  availability: string;
  priorSpeaking?: string;
  socialOrLinkedin?: string;
  message?: string;
  website?: string;
}

export interface SpeakerSchoolFormErrors {
  name: string;
  email: string;
  experienceLevel: string;
  goals: string;
  topicsOfInterest: string;
  availability: string;
}

export interface CalendarIntakeFormFields {
  name: string;
  email: string;
  communityName: string;
  googleCalendarId: string;
  shortDescription: string;
  publicCalendarUrl?: string;
  communityWebsite?: string;
  website?: string;
}

export interface CalendarIntakeFormErrors {
  name: string;
  email: string;
  communityName: string;
  googleCalendarId: string;
  shortDescription: string;
}

export interface ConductReportFormFields {
  incidentDescription: string;
  incidentDate?: string;
  peopleInvolved?: string;
  anonymous: boolean;
  name?: string;
  email?: string;
  preferredFollowup?: string;
  website?: string;
}

export interface ConductReportFormErrors {
  incidentDescription: string;
  email: string;
}

export const emptyContactFormErrors = (): ContactFormErrors => ({
  name: '',
  email: '',
  reason: '',
  subject: '',
  message: '',
});

export function sanitizeContactText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export function isValidContactEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

/**
 * Normalize query/API topic strings. Accepts legacy `reason` aliases.
 */
export function normalizeTopic(raw: string | null | undefined): string {
  if (!raw) return '';
  const key = raw.trim().toLowerCase();
  return TOPIC_ALIASES[key] ?? key;
}

export function isCanonicalTopic(value: string): value is CanonicalTopic {
  return (CANONICAL_TOPICS as readonly string[]).includes(value);
}

export function resolveTopicFromSearchParams(
  params: URLSearchParams,
  allowed: Set<string>
): string {
  const raw = params.get('topic') ?? params.get('reason') ?? '';
  const normalized = normalizeTopic(raw);
  if (normalized && allowed.has(normalized)) return normalized;
  return '';
}

export function validateContactForm(
  fields: ContactFormFields,
  allowedReasons: Set<string>,
  messages: {
    requiredField: string;
    invalidEmail: string;
  }
): { valid: boolean; errors: ContactFormErrors } {
  const errors = emptyContactFormErrors();
  let valid = true;
  const reason = normalizeTopic(fields.reason);

  if (!fields.name.trim()) {
    errors.name = messages.requiredField;
    valid = false;
  }
  if (!fields.email.trim()) {
    errors.email = messages.requiredField;
    valid = false;
  } else if (!isValidContactEmail(fields.email)) {
    errors.email = messages.invalidEmail;
    valid = false;
  }
  if (!fields.subject.trim()) {
    errors.subject = messages.requiredField;
    valid = false;
  }
  if (!reason || !allowedReasons.has(reason)) {
    errors.reason = messages.requiredField;
    valid = false;
  }
  if (!fields.message.trim()) {
    errors.message = messages.requiredField;
    valid = false;
  }
  if (fields.website?.trim()) {
    valid = false;
  }

  return { valid, errors };
}

export function validateCfsForm(
  fields: CfsFormFields,
  messages: { requiredField: string; invalidEmail: string }
): { valid: boolean; errors: CfsFormErrors } {
  const base = validateContactForm(
    { ...fields, reason: 'tech-talk' },
    new Set(['tech-talk']),
    messages
  );
  const errors: CfsFormErrors = {
    ...base.errors,
    talkTitle: '',
    format: '',
    abstract: '',
    takeaways: '',
    socialUrl: '',
  };
  let valid = base.valid;

  if (!fields.talkTitle.trim()) {
    errors.talkTitle = messages.requiredField;
    valid = false;
  }
  if (
    !fields.format.trim() ||
    !(CFS_FORMATS as readonly string[]).includes(fields.format)
  ) {
    errors.format = messages.requiredField;
    valid = false;
  }
  if (!fields.abstract.trim() || fields.abstract.trim().length < 20) {
    errors.abstract = messages.requiredField;
    valid = false;
  }
  if (!fields.takeaways.trim()) {
    errors.takeaways = messages.requiredField;
    valid = false;
  }
  if (!fields.socialUrl.trim()) {
    errors.socialUrl = messages.requiredField;
    valid = false;
  }
  if (fields.website?.trim()) {
    valid = false;
  }

  return { valid, errors };
}

export function validateSponsorForm(
  fields: SponsorFormFields,
  messages: { requiredField: string; invalidEmail: string }
): { valid: boolean; errors: SponsorFormErrors } {
  const base = validateContactForm(
    { ...fields, reason: 'sponsorship' },
    new Set(['sponsorship']),
    messages
  );
  const errors: SponsorFormErrors = {
    ...base.errors,
    company: '',
    contactRole: '',
    tierInterest: '',
    contributionType: '',
  };
  let valid = base.valid;

  if (!fields.company.trim()) {
    errors.company = messages.requiredField;
    valid = false;
  }
  if (!fields.contactRole.trim()) {
    errors.contactRole = messages.requiredField;
    valid = false;
  }
  if (
    !fields.tierInterest.trim() ||
    !(SPONSOR_TIERS as readonly string[]).includes(fields.tierInterest)
  ) {
    errors.tierInterest = messages.requiredField;
    valid = false;
  }
  if (
    !fields.contributionType.trim() ||
    !(CONTRIBUTION_TYPES as readonly string[]).includes(fields.contributionType)
  ) {
    errors.contributionType = messages.requiredField;
    valid = false;
  }
  if (fields.website?.trim()) {
    valid = false;
  }

  return { valid, errors };
}

export function validateSpeakerSchoolForm(
  fields: SpeakerSchoolFormFields,
  messages: { requiredField: string; invalidEmail: string }
): { valid: boolean; errors: SpeakerSchoolFormErrors } {
  const errors: SpeakerSchoolFormErrors = {
    name: '',
    email: '',
    experienceLevel: '',
    goals: '',
    topicsOfInterest: '',
    availability: '',
  };
  let valid = true;

  if (!fields.name.trim()) {
    errors.name = messages.requiredField;
    valid = false;
  }
  if (!fields.email.trim()) {
    errors.email = messages.requiredField;
    valid = false;
  } else if (!isValidContactEmail(fields.email.trim())) {
    errors.email = messages.invalidEmail;
    valid = false;
  }
  if (
    !fields.experienceLevel.trim() ||
    !(SPEAKER_SCHOOL_LEVELS as readonly string[]).includes(
      fields.experienceLevel
    )
  ) {
    errors.experienceLevel = messages.requiredField;
    valid = false;
  }
  if (!fields.goals.trim()) {
    errors.goals = messages.requiredField;
    valid = false;
  }
  if (!fields.topicsOfInterest.trim()) {
    errors.topicsOfInterest = messages.requiredField;
    valid = false;
  }
  if (!fields.availability.trim()) {
    errors.availability = messages.requiredField;
    valid = false;
  }
  if (fields.website?.trim()) {
    valid = false;
  }

  return { valid, errors };
}

/** Light check: non-empty calendar ID; prefer email-like Google Calendar IDs. */
export function looksLikeGoogleCalendarId(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes('@')) return isValidContactEmail(trimmed);
  // Public calendar IDs are usually email-shaped; allow short opaque tokens too.
  return trimmed.length >= 8 && !/\s/.test(trimmed);
}

export function validateCalendarIntakeForm(
  fields: CalendarIntakeFormFields,
  messages: { requiredField: string; invalidEmail: string }
): { valid: boolean; errors: CalendarIntakeFormErrors } {
  const errors: CalendarIntakeFormErrors = {
    name: '',
    email: '',
    communityName: '',
    googleCalendarId: '',
    shortDescription: '',
  };
  let valid = true;

  if (!fields.name.trim()) {
    errors.name = messages.requiredField;
    valid = false;
  }
  if (!fields.email.trim()) {
    errors.email = messages.requiredField;
    valid = false;
  } else if (!isValidContactEmail(fields.email.trim())) {
    errors.email = messages.invalidEmail;
    valid = false;
  }
  if (!fields.communityName.trim()) {
    errors.communityName = messages.requiredField;
    valid = false;
  }
  if (!fields.googleCalendarId.trim()) {
    errors.googleCalendarId = messages.requiredField;
    valid = false;
  } else if (!looksLikeGoogleCalendarId(fields.googleCalendarId)) {
    errors.googleCalendarId = messages.requiredField;
    valid = false;
  }
  if (!fields.shortDescription.trim()) {
    errors.shortDescription = messages.requiredField;
    valid = false;
  }
  if (fields.website?.trim()) {
    valid = false;
  }

  return { valid, errors };
}

export function validateConductReportForm(
  fields: ConductReportFormFields,
  messages: { requiredField: string; invalidEmail: string }
): { valid: boolean; errors: ConductReportFormErrors } {
  const errors: ConductReportFormErrors = {
    incidentDescription: '',
    email: '',
  };
  let valid = true;

  if (
    !fields.incidentDescription.trim() ||
    fields.incidentDescription.trim().length < 20
  ) {
    errors.incidentDescription = messages.requiredField;
    valid = false;
  }

  if (!fields.anonymous) {
    const email = (fields.email || '').trim();
    if (!email) {
      errors.email = messages.requiredField;
      valid = false;
    } else if (!isValidContactEmail(email)) {
      errors.email = messages.invalidEmail;
      valid = false;
    }
  } else if (
    fields.email?.trim() &&
    !isValidContactEmail(fields.email.trim())
  ) {
    errors.email = messages.invalidEmail;
    valid = false;
  }

  if (fields.website?.trim()) {
    valid = false;
  }

  return { valid, errors };
}

/** Compose a CFS message body for legacy inbox / ack helpers. */
export function composeCfsMessage(fields: CfsFormFields): string {
  return [
    `Talk title: ${fields.talkTitle.trim()}`,
    `Format: ${fields.format}`,
    `First-time speaker: ${fields.firstTime ? 'yes' : 'no'}`,
    `Speaker School interest: ${fields.speakerSchool ? 'yes' : 'no'}`,
    `Social / portfolio: ${fields.socialUrl.trim()}`,
    '',
    'Abstract:',
    fields.abstract.trim(),
    '',
    'Takeaways:',
    fields.takeaways.trim(),
    fields.message.trim()
      ? `\nAdditional notes:\n${fields.message.trim()}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function composeSponsorMessage(fields: SponsorFormFields): string {
  return [
    `Company: ${fields.company.trim()}`,
    `Role: ${fields.contactRole.trim()}`,
    `Tier interest: ${fields.tierInterest}`,
    `Contribution: ${fields.contributionType}`,
    '',
    fields.message.trim(),
  ].join('\n');
}

export type AckLang = 'en' | 'es';

export function pickAckCopy(
  topic: string,
  lang: AckLang
): { subject: string; text: string } {
  const t = normalizeTopic(topic) || 'general';
  if (lang === 'es') {
    const subjects: Record<string, string> = {
      'tech-talk': 'Recibimos tu postulación — Pereira Tech Talks',
      sponsorship: 'Recibimos tu consulta de patrocinio — Pereira Tech Talks',
      press: 'Recibimos tu consulta de prensa — Pereira Tech Talks',
      conduct: 'Recibimos tu reporte — Pereira Tech Talks',
      general: 'Recibimos tu mensaje — Pereira Tech Talks',
    };
    const bodies: Record<string, string> = {
      'tech-talk':
        'Gracias por postular tu charla. Revisamos propuestas continuamente y te respondemos en un máximo de 7 días hábiles para alinear fecha y formato. Si es tu primera vez, podemos conectarte con la Speaker School.\n\n— Pereira Tech Talks',
      sponsorship:
        'Gracias por tu interés en patrocinar Pereira Tech Talks. Un organizador te contactará en un máximo de 5 días hábiles para conversar sobre niveles y siguientes pasos.\n\n— Pereira Tech Talks',
      press:
        'Gracias por escribirnos. El equipo de prensa revisará tu consulta y responderá lo antes posible.\n\n— Pereira Tech Talks',
      conduct:
        'Gracias por contactarnos. Tu mensaje será tratado con confidencialidad por el equipo de conducta.\n\n— Pereira Tech Talks',
      general:
        'Gracias por escribirnos. Te responderemos tan pronto como podamos.\n\n— Pereira Tech Talks',
    };
    return {
      subject: subjects[t] || subjects.general,
      text: bodies[t] || bodies.general,
    };
  }
  const subjects: Record<string, string> = {
    'tech-talk': 'We received your talk proposal — Pereira Tech Talks',
    sponsorship: 'We received your sponsorship inquiry — Pereira Tech Talks',
    press: 'We received your press inquiry — Pereira Tech Talks',
    conduct: 'We received your report — Pereira Tech Talks',
    general: 'We received your message — Pereira Tech Talks',
  };
  const bodies: Record<string, string> = {
    'tech-talk':
      'Thanks for submitting your talk. We review proposals year-round and reply within 7 business days to align on date and format. First-time speakers can be connected with Speaker School.\n\n— Pereira Tech Talks',
    sponsorship:
      'Thanks for your interest in sponsoring Pereira Tech Talks. An organizer will follow up within 5 business days about tiers and next steps.\n\n— Pereira Tech Talks',
    press:
      'Thanks for reaching out. Our press contacts will review your inquiry and reply as soon as possible.\n\n— Pereira Tech Talks',
    conduct:
      'Thanks for contacting us. Your message will be handled confidentially by the conduct team.\n\n— Pereira Tech Talks',
    general:
      "Thanks for writing. We'll get back to you as soon as we can.\n\n— Pereira Tech Talks",
  };
  return {
    subject: subjects[t] || subjects.general,
    text: bodies[t] || bodies.general,
  };
}

/** Simple sliding-window rate limit helper (pure; store is injected). */
export function checkRateLimit(
  store: Map<string, number[]>,
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): { allowed: boolean; retryAfterSec: number } {
  const cutoff = now - windowMs;
  const prior = (store.get(key) || []).filter((ts) => ts > cutoff);
  if (prior.length >= limit) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((prior[0] + windowMs - now) / 1000)
    );
    store.set(key, prior);
    return { allowed: false, retryAfterSec };
  }
  prior.push(now);
  store.set(key, prior);
  return { allowed: true, retryAfterSec: 0 };
}

export function looksLikeSpamPayload(fields: {
  name: string;
  message: string;
  website?: string;
}): boolean {
  if (fields.website?.trim()) return true;
  const urlPattern = /https?:\/\//gi;
  if (fields.name.match(urlPattern)?.length) return true;
  if ((fields.message.match(urlPattern) || []).length > 6) return true;
  return false;
}
