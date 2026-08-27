import { describe, expect, it } from 'vitest';
import type { CfsFormFields } from '@/lib/contact-form';
import {
  checkRateLimit,
  composeCfsMessage,
  isHttpUrl,
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
        slidesUrl: 'https://slides.example.com/ada/rust-edge',
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

/**
 * A meetup-scoped Call for Speakers form offers only the formats that meetup
 * accepts. The client mirrors the server's `format_not_allowed_for_meetup`
 * rule so a speaker sees the problem in the form rather than as a 400 after
 * writing an abstract.
 *
 * PLAN_meetup_programming_and_call_for_speakers, Task 5.
 */
describe('validateCfsForm — meetup scoping', () => {
  const MESSAGES = {
    requiredField: 'Required',
    invalidEmail: 'Invalid email',
    formatNotAllowed: 'This meetup does not take that format.',
    slidesUrlInvalid: 'Add the link to your slides.',
  };

  const validFields = (over: Partial<CfsFormFields> = {}): CfsFormFields => ({
    name: 'Grace',
    email: 'grace@example.com',
    reason: 'tech-talk',
    subject: 'Call for Speakers submission',
    // The component sends `message || abstract`, so the base contact
    // validation always sees a non-empty message.
    message: 'A short, concrete tour of how we ship a compiler every week.',
    website: '',
    talkTitle: 'Compilers in production',
    format: 'lightning',
    abstract: 'A short, concrete tour of how we ship a compiler every week.',
    takeaways: 'How to stage a risky release',
    socialUrl: 'https://example.com/grace',
    slidesUrl: 'https://slides.example.com/grace/compilers',
    firstTime: false,
    speakerSchool: false,
    ...over,
  });

  it('accepts a format the meetup takes', () => {
    const result = validateCfsForm(validFields(), MESSAGES, ['lightning']);
    expect(result.valid).toBe(true);
    expect(result.errors.format).toBe('');
  });

  it('rejects a format the meetup does not take, with its own message', () => {
    const result = validateCfsForm(
      validFields({ format: 'workshop' }),
      MESSAGES,
      ['lightning']
    );
    expect(result.valid).toBe(false);
    expect(result.errors.format).toBe(MESSAGES.formatNotAllowed);
  });

  it('falls back to the required-field message when none was supplied', () => {
    const { formatNotAllowed, ...withoutMessage } = MESSAGES;
    void formatNotAllowed;
    const result = validateCfsForm(
      validFields({ format: 'workshop' }),
      withoutMessage,
      ['lightning']
    );
    expect(result.valid).toBe(false);
    expect(result.errors.format).toBe(MESSAGES.requiredField);
  });

  it('behaves exactly as before when no allowedFormats is given', () => {
    // The regression that protects /call-for-speakers.
    for (const format of ['regular', 'lightning', 'panel', 'workshop']) {
      const result = validateCfsForm(validFields({ format }), MESSAGES);
      expect(result.valid).toBe(true);
    }
    const bad = validateCfsForm(validFields({ format: 'keynote' }), MESSAGES);
    expect(bad.valid).toBe(false);
    expect(bad.errors.format).toBe(MESSAGES.requiredField);
  });

  it('still reports an unknown format as required, not as not-allowed', () => {
    // An unknown format is a broken client, not a meetup mismatch — the
    // distinction matters for what the speaker is told to do next.
    const result = validateCfsForm(
      validFields({ format: 'keynote' }),
      MESSAGES,
      ['lightning']
    );
    expect(result.errors.format).toBe(MESSAGES.requiredField);
  });

  it('treats meetupSlug as optional', () => {
    expect(validateCfsForm(validFields(), MESSAGES).valid).toBe(true);
    expect(
      validateCfsForm(
        validFields({ meetupSlug: 'november-meetup-2026' }),
        MESSAGES
      ).valid
    ).toBe(true);
  });

  it('keeps every pre-existing CFS rule intact', () => {
    expect(
      validateCfsForm(validFields({ talkTitle: '' }), MESSAGES).valid
    ).toBe(false);
    expect(
      validateCfsForm(validFields({ abstract: 'too short' }), MESSAGES).valid
    ).toBe(false);
    expect(
      validateCfsForm(validFields({ takeaways: '' }), MESSAGES).valid
    ).toBe(false);
    expect(
      validateCfsForm(validFields({ socialUrl: '' }), MESSAGES).valid
    ).toBe(false);
    expect(
      validateCfsForm(validFields({ email: 'not-an-email' }), MESSAGES).valid
    ).toBe(false);
    // Honeypot.
    expect(
      validateCfsForm(validFields({ website: 'http://spam' }), MESSAGES).valid
    ).toBe(false);
  });
});

/**
 * The slides link became required in the branch audit
 * (PLAN_branch_audit_and_pr Task 4).
 *
 * It asks for something many speakers do not have yet — the talk is an idea,
 * the deck comes later — so the copy carries the weight: a draft, an outline or
 * a previous deck all satisfy it. What the validator enforces is only that a
 * *link* is there and that it is `http(s)`.
 *
 * The scheme check is the point, not a formality. `new URL()` happily accepts
 * `javascript:alert(1)`, and the server drops any non-http(s) value, so a form
 * that let one through would lose the field in silence.
 */
describe('the slides link is required', () => {
  const MESSAGES = {
    requiredField: 'Required',
    invalidEmail: 'Invalid email',
    slidesUrlInvalid: 'Add the link to your slides.',
  };

  const fields = (slidesUrl: string | undefined): CfsFormFields => ({
    name: 'Grace',
    email: 'grace@example.com',
    reason: 'tech-talk',
    subject: 'Call for Speakers submission',
    message: 'A short, concrete tour of how we ship a compiler every week.',
    website: '',
    talkTitle: 'Compilers in production',
    format: 'lightning',
    abstract: 'A short, concrete tour of how we ship a compiler every week.',
    takeaways: 'How to stage a risky release',
    socialUrl: 'https://example.com/grace',
    slidesUrl,
    firstTime: false,
    speakerSchool: false,
  });

  it('accepts an https link', () => {
    const r = validateCfsForm(fields('https://slides.example.com/x'), MESSAGES);
    expect(r.valid).toBe(true);
    expect(r.errors.slidesUrl).toBe('');
  });

  it('accepts a plain http link — the rule is the scheme, not the cert', () => {
    expect(
      validateCfsForm(fields('http://old.example.com/deck'), MESSAGES).valid
    ).toBe(true);
  });

  it('rejects an empty field with its own message, not "required"', () => {
    const r = validateCfsForm(fields(''), MESSAGES);
    expect(r.valid).toBe(false);
    expect(r.errors.slidesUrl).toBe(MESSAGES.slidesUrlInvalid);
  });

  it('rejects an absent field', () => {
    expect(validateCfsForm(fields(undefined), MESSAGES).valid).toBe(false);
  });

  it('rejects prose, however reasonable it sounds', () => {
    // "I do not have them yet" is a real answer, and the help text says a draft
    // link counts — so this has to fail, or the field means nothing.
    for (const prose of ['todavía no las tengo', 'ask me later', 'n/a']) {
      expect(validateCfsForm(fields(prose), MESSAGES).valid).toBe(false);
    }
  });

  it('rejects a non-http scheme, which new URL() would otherwise accept', () => {
    for (const hostile of [
      'javascript:alert(1)',
      'data:text/html,<script>x</script>',
      'file:///etc/passwd',
      'ftp://example.com/deck.pdf',
    ]) {
      expect(
        validateCfsForm(fields(hostile), MESSAGES).valid,
        `${hostile} must not pass`
      ).toBe(false);
    }
  });

  it('falls back to the generic required message when no specific one is given', () => {
    const r = validateCfsForm(fields(''), {
      requiredField: 'Required',
      invalidEmail: 'Invalid email',
    });
    expect(r.errors.slidesUrl).toBe('Required');
  });
});

describe('isHttpUrl', () => {
  it('accepts http and https', () => {
    expect(isHttpUrl('http://a.example')).toBe(true);
    expect(isHttpUrl('https://a.example/deck?x=1#p2')).toBe(true);
  });

  it('tolerates surrounding whitespace', () => {
    expect(isHttpUrl('  https://a.example  ')).toBe(true);
  });

  it('rejects everything else', () => {
    for (const v of [
      '',
      '   ',
      'a.example',
      'javascript:alert(1)',
      'mailto:a@b.c',
    ]) {
      expect(isHttpUrl(v), v).toBe(false);
    }
  });
});
