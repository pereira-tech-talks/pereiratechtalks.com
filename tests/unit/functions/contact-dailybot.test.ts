import { afterEach, describe, expect, it, vi } from 'vitest';

import { CONTACT_FORM_UUID, CONTACT_Q } from '../../../functions/api/_dailybot';
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
});
