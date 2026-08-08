import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CALENDAR_FORM_UUID,
  CALENDAR_Q,
  CONDUCT_FORM_UUID,
  CONDUCT_Q,
  CONTACT_FORM_UUID,
  CONTACT_Q,
  SPEAKER_SCHOOL_FORM_UUID,
  SPEAKER_SCHOOL_Q,
  SPONSORS_FORM_UUID,
  SPONSORS_Q,
} from '../../../functions/api/_dailybot';
import { onRequestPost } from '../../../functions/api/contact';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function createContext(
  body: unknown,
  env: { DAILYBOT_API_KEY?: string } = { DAILYBOT_API_KEY: 'test-key' }
) {
  const request = new Request('https://pereiratechtalks.org/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://pereiratechtalks.org',
    },
    body: JSON.stringify(body),
  });
  return {
    request,
    env,
    waitUntil: vi.fn((p: Promise<unknown>) => {
      p.catch(() => {});
    }),
  };
}

describe('POST /api/contact → Dailybot', () => {
  it('returns 503 when DAILYBOT_API_KEY is missing', async () => {
    const res = await onRequestPost(createContext({}, {}));
    expect(res.status).toBe(503);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe('backend_not_configured');
  });

  it('maps contact payload and posts automation content', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ uuid: 'resp-1' }), { status: 201 })
      );
    vi.stubGlobal('fetch', fetchMock);

    const res = await onRequestPost(
      createContext({
        _form: 'contact',
        name: 'Ada',
        email: 'ada@example.com',
        topic: 'general',
        subject: 'Hello',
        message: 'Community question about meetups',
        lang: 'en',
        page_path: '/en/contact',
        website: '',
      })
    );

    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      recordUuid: string;
      formType: string;
    };
    expect(json).toMatchObject({
      ok: true,
      recordUuid: 'resp-1',
      formType: 'contact',
    });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(CONTACT_FORM_UUID);
    const body = JSON.parse(init.body as string) as {
      automation: boolean;
      content: Record<string, string>;
    };
    expect(body.automation).toBe(true);
    expect(body.content[CONTACT_Q.TOPIC]).toBe('General');
    expect(body.content[CONTACT_Q.LANG]).toBe('English');
    expect(body.content[CONTACT_Q.PAGE_PATH]).toBe('/en/contact');
  });

  it('maps legacy reason tech-talk to cfs', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ uuid: 'resp-cfs' }), { status: 201 })
      );
    vi.stubGlobal('fetch', fetchMock);

    const res = await onRequestPost(
      createContext({
        reason: 'tech-talk',
        name: 'Grace',
        email: 'grace@example.com',
        subject: 'Talk proposal',
        message: 'Notes',
        talkTitle: 'Building with Astro',
        format: 'regular',
        abstract: 'A long enough abstract about Astro islands and DX.',
        takeaways: 'Learn islands',
        socialUrl: 'https://example.com',
        firstTime: true,
        speakerSchool: false,
        lang: 'es',
        website: '',
      })
    );

    expect(res.status).toBe(200);
    const json = (await res.json()) as { formType: string };
    expect(json.formType).toBe('cfs');
  });

  it('silently accepts honeypot spam', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = await onRequestPost(
      createContext({
        _form: 'contact',
        name: 'Bot',
        email: 'bot@example.com',
        topic: 'general',
        subject: 'Spam',
        message:
          'Buy now https://x.com https://y.com https://z.com https://a.com https://b.com https://c.com https://d.com',
        website: 'https://spam.example',
        lang: 'en',
      })
    );
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('maps speaker-school experience level labels', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ uuid: 'resp-ss' }), { status: 201 })
      );
    vi.stubGlobal('fetch', fetchMock);

    const res = await onRequestPost(
      createContext({
        _form: 'speaker-school',
        name: 'Ada',
        email: 'ada@example.com',
        experienceLevel: 'beginner',
        goals: 'First meetup talk',
        topicsOfInterest: 'Rust',
        availability: 'Weeknights',
        lang: 'es',
        page_path: '/verticals/speaker-school',
        website: '',
      })
    );

    expect(res.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(SPEAKER_SCHOOL_FORM_UUID);
    const body = JSON.parse(init.body as string) as {
      content: Record<string, string>;
    };
    expect(body.content[SPEAKER_SCHOOL_Q.EXPERIENCE_LEVEL]).toBe('Beginner');
    expect(body.content[SPEAKER_SCHOOL_Q.GOALS]).toBe('First meetup talk');
  });

  it('maps sponsor tier and contribution labels', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ uuid: 'resp-sp' }), { status: 201 })
      );
    vi.stubGlobal('fetch', fetchMock);

    const res = await onRequestPost(
      createContext({
        _form: 'sponsor',
        name: 'Ada',
        email: 'ada@example.com',
        company: 'Acme',
        contactRole: 'CMO',
        tierInterest: 'gold',
        contributionType: 'in-kind',
        message: 'Interested in PTD support',
        lang: 'en',
        website: '',
      })
    );

    expect(res.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(SPONSORS_FORM_UUID);
    const body = JSON.parse(init.body as string) as {
      content: Record<string, string>;
    };
    expect(body.content[SPONSORS_Q.TIER]).toBe('Gold');
    expect(body.content[SPONSORS_Q.CONTRIBUTION]).toBe('In-kind');
  });

  it('maps calendar intake fields', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ uuid: 'resp-cal' }), { status: 201 })
      );
    vi.stubGlobal('fetch', fetchMock);

    const res = await onRequestPost(
      createContext({
        _form: 'calendar',
        name: 'Ada',
        email: 'ada@example.com',
        communityName: 'Pereira JS',
        googleCalendarId: 'pereirajs@group.calendar.google.com',
        shortDescription: 'Monthly JS meetups',
        publicCalendarUrl: 'https://calendar.google.com/calendar/u/0?cid=abc',
        communityWebsite: 'https://example.com',
        lang: 'es',
        website: '',
      })
    );

    expect(res.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(CALENDAR_FORM_UUID);
    const body = JSON.parse(init.body as string) as {
      content: Record<string, string>;
    };
    expect(body.content[CALENDAR_Q.COMMUNITY]).toBe('Pereira JS');
    expect(body.content[CALENDAR_Q.CALENDAR_ID]).toBe(
      'pereirajs@group.calendar.google.com'
    );
  });

  it('maps anonymous conduct reports without identity', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ uuid: 'resp-coc' }), { status: 201 })
      );
    vi.stubGlobal('fetch', fetchMock);

    const ctx = createContext({
      _form: 'conduct',
      anonymous: true,
      incidentDescription:
        'Enough detail about a confidential incident for organizers to review.',
      incidentDate: 'Last meetup',
      peopleInvolved: '',
      name: 'ShouldClear',
      // Sneaked email must not reach Dailybot or trigger Resend ack.
      email: 'sneak@example.com',
      lang: 'es',
      website: '',
    });

    const res = await onRequestPost(ctx);

    expect(res.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(CONDUCT_FORM_UUID);
    const body = JSON.parse(init.body as string) as {
      content: Record<string, string>;
    };
    expect(body.content[CONDUCT_Q.ANONYMOUS]).toBe(true);
    expect(body.content[CONDUCT_Q.REPORTER_NAME]).toBe('');
    expect(body.content[CONDUCT_Q.REPORTER_EMAIL]).toBe('');
    expect(body.content[CONDUCT_Q.INCIDENT]).toContain('confidential incident');
    expect(ctx.waitUntil).not.toHaveBeenCalled();
  });

  it('returns 502-style client error when Dailybot rejects', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ detail: 'unauthorized' }), {
        status: 401,
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const res = await onRequestPost(
      createContext({
        _form: 'contact',
        name: 'Ada',
        email: 'ada@example.com',
        topic: 'general',
        subject: 'Hello',
        message: 'Community question about meetups',
        lang: 'en',
        website: '',
      })
    );

    expect(res.status).toBeGreaterThanOrEqual(400);
    const json = (await res.json()) as { ok: boolean };
    expect(json.ok).toBe(false);
  });
});
