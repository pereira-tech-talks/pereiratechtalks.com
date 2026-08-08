import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  booleanToDailyBot,
  CONTACT_FORM_UUID,
  CONTACT_TOPIC_VALUES,
  EXPERIENCE_LEVEL_VALUES,
  LANG_VALUES,
  lookupChoice,
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
