import { afterEach, describe, expect, it, vi } from 'vitest';
import { CFS_FORMATS } from '@/lib/contact-form';
import { CFS_FORMATS as INTAKE_CFS_FORMATS } from '../../../functions/_lib/intake-helpers';
import {
  booleanToDailyBot,
  CFS_FORMAT_VALUES,
  CFS_Q,
  CONTACT_FORM_UUID,
  CONTACT_TOPIC_VALUES,
  EXPERIENCE_LEVEL_VALUES,
  LANG_VALUES,
  lookupChoice,
  meetupUrlFromSlug,
  normalizePagePath,
  SPONSOR_TIER_VALUES,
  slugify,
  submitFormResponse,
} from '../../../functions/api/_dailybot';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('normalizePagePath', () => {
  it('falls back for non-strings and empty', () => {
    expect(normalizePagePath(undefined)).toBe('/');
    expect(normalizePagePath('')).toBe('/');
    expect(normalizePagePath('   ')).toBe('/');
  });

  it('ensures a leading slash', () => {
    expect(normalizePagePath('contact')).toBe('/contact');
    expect(normalizePagePath('/en/contact')).toBe('/en/contact');
  });

  it('rejects over-long paths', () => {
    expect(normalizePagePath(`/${'a'.repeat(201)}`)).toBe('/');
  });
});

describe('slugify', () => {
  it('lowercases and collapses whitespace', () => {
    expect(slugify('The Library of Tomorrow')).toBe('the-library-of-tomorrow');
  });
});

describe('lookupChoice (label values for PTT org)', () => {
  it('maps internal slugs and labels to canonical DailyBot labels', () => {
    expect(lookupChoice('general', CONTACT_TOPIC_VALUES)).toBe('General');
    expect(lookupChoice('General', CONTACT_TOPIC_VALUES)).toBe('General');
    expect(lookupChoice('the-library-of-tomorrow', CONTACT_TOPIC_VALUES)).toBe(
      'The Library of Tomorrow'
    );
    expect(lookupChoice('es', LANG_VALUES)).toBe('Spanish');
    expect(lookupChoice('en', LANG_VALUES)).toBe('English');
    expect(lookupChoice('beginner', EXPERIENCE_LEVEL_VALUES)).toBe('Beginner');
    expect(lookupChoice('gold', SPONSOR_TIER_VALUES)).toBe('Gold');
  });

  it('returns null for unknown choices', () => {
    expect(lookupChoice('not-a-topic', CONTACT_TOPIC_VALUES)).toBeNull();
  });
});

describe('booleanToDailyBot', () => {
  it('maps booleans and common strings to JSON true/false', () => {
    expect(booleanToDailyBot(true)).toBe(true);
    expect(booleanToDailyBot(false)).toBe(false);
    expect(booleanToDailyBot('sí')).toBe(true);
    expect(booleanToDailyBot('no')).toBe(false);
  });
});

describe('submitFormResponse', () => {
  it('returns AUTH when API key missing', async () => {
    const result = await submitFormResponse(CONTACT_FORM_UUID, {}, {});
    expect(result).toEqual({
      ok: false,
      error: 'AUTH',
      status: 503,
      detail: 'missing_api_key',
    });
  });

  it('POSTs automation payload and returns response uuid', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ uuid: 'resp-abc' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await submitFormResponse(
      CONTACT_FORM_UUID,
      { q1: 'hello' },
      { DAILYBOT_API_KEY: 'test-key' }
    );

    expect(result).toEqual({ ok: true, uuid: 'resp-abc' });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      `https://api.dailybot.com/v1/forms/${CONTACT_FORM_UUID}/responses/`
    );
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      'X-API-KEY': 'test-key',
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(init.body as string)).toEqual({
      content: { q1: 'hello' },
      automation: true,
    });
  });

  it('maps invalid choice body to INVALID_CHOICE', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(['response is not valid']), {
          status: 400,
        })
      )
    );
    const result = await submitFormResponse(
      CONTACT_FORM_UUID,
      {},
      { DAILYBOT_API_KEY: 'k' }
    );
    expect(result).toEqual({
      ok: false,
      error: 'INVALID_CHOICE',
      status: 400,
    });
  });
});

/**
 * The four Call for Speakers formats are declared three times — the content
 * schema (`cfsFormat` in src/content.config.ts), the client validator
 * (`CFS_FORMATS` in src/lib/contact-form.ts) and the Dailybot choice lookup
 * (`CFS_FORMAT_VALUES` here). They cannot share one declaration: the
 * Cloudflare Pages Functions bundle is built separately and cannot import from
 * `src/`. This test is what keeps the three from drifting — drift would mean
 * the UI offering a format Dailybot rejects as an invalid choice.
 *
 * PLAN_meetup_programming_and_call_for_speakers, Task 2.
 */
describe('CFS formats stay in lockstep across the three declarations', () => {
  const EXPECTED = ['regular', 'lightning', 'panel', 'workshop'] as const;

  it('the client validator declares exactly these four', () => {
    expect([...CFS_FORMATS].sort()).toEqual([...EXPECTED].sort());
  });

  it('the Functions-side copy declares exactly these four', () => {
    // functions/_lib/intake-helpers.ts carries a fourth copy. Nothing imports
    // it today, but it is exported, so it is covered here rather than left to
    // drift silently until something picks it up.
    expect([...INTAKE_CFS_FORMATS].sort()).toEqual([...EXPECTED].sort());
  });

  it('the Dailybot lookup resolves every one of them to a canonical label', () => {
    for (const format of EXPECTED) {
      expect(lookupChoice(format, CFS_FORMAT_VALUES)).toBeTruthy();
    }
  });

  it('the Dailybot lookup rejects a format none of the three declares', () => {
    expect(lookupChoice('keynote', CFS_FORMAT_VALUES)).toBeNull();
  });
});

describe('CFS_Q.MEETUP', () => {
  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  it('is a real UUID, not a placeholder', () => {
    expect(CFS_Q.MEETUP).toMatch(UUID_RE);
  });

  it('does not collide with any other CFS question', () => {
    const uuids = Object.values(CFS_Q);
    expect(new Set(uuids).size).toBe(uuids.length);
  });

  it('meetupUrlFromSlug builds the canonical URL, and empty for no meetup', () => {
    expect(meetupUrlFromSlug('november-meetup-2026')).toBe(
      'https://pereiratechtalks.org/meetups/november-meetup-2026/'
    );
    expect(meetupUrlFromSlug('')).toBe('');
  });
});
