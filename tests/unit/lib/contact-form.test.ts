import { describe, expect, it } from 'vitest';

import {
  isValidContactEmail,
  sanitizeContactText,
  validateContactForm,
} from '@/lib/contact-form';

describe('contact-form', () => {
  const messages = {
    requiredField: 'Required',
    invalidEmail: 'Invalid email',
  };

  it('sanitizes and truncates text', () => {
    expect(sanitizeContactText('  hello  ', 10)).toBe('hello');
    expect(sanitizeContactText('abcdefghijklmnop', 5)).toBe('abcde');
  });

  it('validates email format', () => {
    expect(isValidContactEmail('user@example.com')).toBe(true);
    expect(isValidContactEmail('not-an-email')).toBe(false);
  });

  it('accepts a complete valid form', () => {
    const allowed = new Set(['general', 'tech-talk']);
    const result = validateContactForm(
      {
        name: 'Ada',
        email: 'ada@example.com',
        reason: 'general',
        subject: 'Hello',
        message: 'Testing',
      },
      allowed,
      messages
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({
      name: '',
      email: '',
      reason: '',
      subject: '',
      message: '',
    });
  });

  it('rejects honeypot submissions', () => {
    const allowed = new Set(['general']);
    const result = validateContactForm(
      {
        name: 'Bot',
        email: 'bot@example.com',
        reason: 'general',
        subject: 'Spam',
        message: 'Spam',
        website: 'https://spam.test',
      },
      allowed,
      messages
    );
    expect(result.valid).toBe(false);
  });

  it('rejects unknown reason values', () => {
    const allowed = new Set(['general']);
    const result = validateContactForm(
      {
        name: 'Ada',
        email: 'ada@example.com',
        reason: 'unknown',
        subject: 'Hello',
        message: 'Testing',
      },
      allowed,
      messages
    );
    expect(result.valid).toBe(false);
    expect(result.errors.reason).toBe('Required');
  });
});
