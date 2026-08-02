export const MAX_SUBJECT_LENGTH = 140;
export const MAX_MESSAGE_LENGTH = 2000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  if (!fields.reason.trim() || !allowedReasons.has(fields.reason)) {
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
