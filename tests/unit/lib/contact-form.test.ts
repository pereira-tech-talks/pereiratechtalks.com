import { describe, expect, it } from 'vitest';

import {
  checkRateLimit,
  composeCfsMessage,
  isValidContactEmail,
  looksLikeGoogleCalendarId,
  normalizeTopic,
  pickAckCopy,
  resolveTopicFromSearchParams,
  sanitizeContactText,
  validateCalendarIntakeForm,
  validateCfsForm,
  validateConductReportForm,
  validateContactForm,
  validateSpeakerSchoolForm,
  validateSponsorForm,
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

  it('normalizes topic aliases', () => {
    expect(normalizeTopic('project')).toBe('sponsorship');
    expect(normalizeTopic('speaker')).toBe('tech-talk');
    expect(normalizeTopic('REASON')).toBe('reason');
    expect(normalizeTopic('press')).toBe('press');
  });

  it('resolves topic from topic or legacy reason query params', () => {
    const allowed = new Set(['tech-talk', 'sponsorship', 'general']);
    expect(
      resolveTopicFromSearchParams(
        new URLSearchParams('topic=tech-talk'),
        allowed
      )
    ).toBe('tech-talk');
    expect(
      resolveTopicFromSearchParams(
        new URLSearchParams('reason=project'),
        allowed
      )
    ).toBe('sponsorship');
  });

  it('accepts a complete valid form', () => {
    const allowed = new Set(['general', 'tech-talk', 'sponsorship']);
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
  });

  it('accepts sponsorship alias project when allowlist has sponsorship', () => {
    const allowed = new Set(['sponsorship']);
    const result = validateContactForm(
      {
        name: 'Ada',
        email: 'ada@example.com',
        reason: 'project',
        subject: 'Sponsor',
        message: 'We want to help',
      },
      allowed,
      messages
    );
    expect(result.valid).toBe(true);
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

  it('validates CFS payloads', () => {
    const ok = validateCfsForm(
      {
        name: 'Ada',
        email: 'ada@example.com',
        reason: 'tech-talk',
        subject: 'CFS',
        message: 'notes',
        talkTitle: 'Rust at the edge',
        format: 'regular',
        abstract: 'A long enough abstract about shipping Rust in production.',
        takeaways: 'When to choose Rust',
        socialUrl: 'https://linkedin.com/in/ada',
        firstTime: true,
        speakerSchool: true,
      },
      messages
    );
    expect(ok.valid).toBe(true);

    const bad = validateCfsForm(
      {
        name: 'Ada',
        email: 'ada@example.com',
        reason: 'tech-talk',
        subject: 'CFS',
        message: '',
        talkTitle: '',
        format: 'nope',
        abstract: 'short',
        takeaways: '',
        socialUrl: '',
        firstTime: false,
        speakerSchool: false,
      },
      messages
    );
    expect(bad.valid).toBe(false);
    expect(bad.errors.talkTitle).toBe('Required');
  });

  it('validates sponsor payloads and composes CFS message', () => {
    const ok = validateSponsorForm(
      {
        name: 'Ada',
        email: 'ada@example.com',
        reason: 'sponsorship',
        subject: 'Sponsor',
        message: 'We want Diamond support for PTD.',
        company: 'Acme',
        contactRole: 'CMO',
        tierInterest: 'gold',
        contributionType: 'cash',
      },
      messages
    );
    expect(ok.valid).toBe(true);

    const composed = composeCfsMessage({
      name: 'Ada',
      email: 'ada@example.com',
      reason: 'tech-talk',
      subject: 'CFS',
      message: 'Extra',
      talkTitle: 'Title',
      format: 'lightning',
      abstract: 'Abstract body here for the talk proposal.',
      takeaways: 'Takeaway',
      socialUrl: 'https://x.com/ada',
      firstTime: false,
      speakerSchool: false,
    });
    expect(composed).toContain('Talk title: Title');
    expect(composed).toContain('Additional notes:');
  });

  it('validates conduct reports with anonymity rules', () => {
    const anonymousOk = validateConductReportForm(
      {
        incidentDescription:
          'Enough detail about a confidential incident for organizers.',
        anonymous: true,
      },
      messages
    );
    expect(anonymousOk.valid).toBe(true);

    const identifiedMissingEmail = validateConductReportForm(
      {
        incidentDescription:
          'Enough detail about a confidential incident for organizers.',
        anonymous: false,
        name: 'Ada',
        email: '',
      },
      messages
    );
    expect(identifiedMissingEmail.valid).toBe(false);
    expect(identifiedMissingEmail.errors.email).toBe('Required');
  });

  it('validates calendar intake payloads', () => {
    expect(
      looksLikeGoogleCalendarId('community@group.calendar.google.com')
    ).toBe(true);
    expect(looksLikeGoogleCalendarId('short')).toBe(false);

    const ok = validateCalendarIntakeForm(
      {
        name: 'Ada',
        email: 'ada@example.com',
        communityName: 'Pereira JS',
        googleCalendarId: 'pereirajs@group.calendar.google.com',
        shortDescription: 'Monthly JS meetups in Pereira',
      },
      messages
    );
    expect(ok.valid).toBe(true);

    const bad = validateCalendarIntakeForm(
      {
        name: '',
        email: 'bad',
        communityName: '',
        googleCalendarId: 'x',
        shortDescription: '',
      },
      messages
    );
    expect(bad.valid).toBe(false);
    expect(bad.errors.googleCalendarId).toBe('Required');
  });

  it('validates Speaker School payloads', () => {
    const ok = validateSpeakerSchoolForm(
      {
        name: 'Ada',
        email: 'ada@example.com',
        experienceLevel: 'beginner',
        goals: 'Ship my first meetup talk',
        topicsOfInterest: 'Rust, platforms',
        availability: 'Weeknight evenings',
      },
      messages
    );
    expect(ok.valid).toBe(true);

    const bad = validateSpeakerSchoolForm(
      {
        name: '',
        email: 'not-an-email',
        experienceLevel: 'expert',
        goals: '',
        topicsOfInterest: '',
        availability: '',
      },
      messages
    );
    expect(bad.valid).toBe(false);
    expect(bad.errors.name).toBe('Required');
    expect(bad.errors.email).toBe('Invalid email');
    expect(bad.errors.experienceLevel).toBe('Required');
  });

  it('picks bilingual ack copy and rate-limits', () => {
    const es = pickAckCopy('tech-talk', 'es');
    expect(es.subject.toLowerCase()).toContain('postulación');
    const en = pickAckCopy('sponsorship', 'en');
    expect(en.subject.toLowerCase()).toContain('sponsorship');

    const store = new Map<string, number[]>();
    expect(checkRateLimit(store, '1.1.1.1', 2, 60_000).allowed).toBe(true);
    expect(checkRateLimit(store, '1.1.1.1', 2, 60_000).allowed).toBe(true);
    expect(checkRateLimit(store, '1.1.1.1', 2, 60_000).allowed).toBe(false);
  });
});
