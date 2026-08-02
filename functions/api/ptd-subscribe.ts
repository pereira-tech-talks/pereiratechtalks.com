/**
 * Cloudflare Pages Function — PTD registration interest subscribe endpoint.
 * Stores email + year in Google Sheets via server-side proxy (no client secrets).
 */

interface Env {
  PTD_SUBSCRIBE_SHEETS_URL?: string;
  CONTACT_ALLOWED_ORIGINS?: string;
}

interface EventContext {
  request: Request;
  env: Env;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(data: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
      'Cache-Control': 'no-store',
    },
  });
}

function resolveAllowedOrigin(request: Request, env: Env): string {
  const requestOrigin = request.headers.get('Origin') || '';
  const allowlist = (env.CONTACT_ALLOWED_ORIGINS || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  if (allowlist.length === 0) return requestOrigin || '*';
  if (requestOrigin && allowlist.includes(requestOrigin)) return requestOrigin;
  return allowlist[0];
}

export async function onRequestOptions(context: EventContext): Promise<Response> {
  const origin = resolveAllowedOrigin(context.request, context.env);
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    },
  });
}

export async function onRequestPost(context: EventContext): Promise<Response> {
  const origin = resolveAllowedOrigin(context.request, context.env);
  const sheetsUrl = context.env.PTD_SUBSCRIBE_SHEETS_URL;

  if (!sheetsUrl) {
    return jsonResponse({ ok: false, error: 'backend_not_configured' }, 503, origin);
  }

  let raw: unknown;
  try {
    raw = await context.request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400, origin);
  }

  if (!raw || typeof raw !== 'object') {
    return jsonResponse({ ok: false, error: 'invalid_payload' }, 400, origin);
  }

  const data = raw as Record<string, unknown>;
  const website =
    typeof data.website === 'string' ? data.website.trim() : '';
  if (website) {
    // Honeypot — pretend success
    return jsonResponse({ ok: true }, 200, origin);
  }
  const email =
    typeof data.email === 'string' ? data.email.trim().toLowerCase().slice(0, 254) : '';
  const year = typeof data.year === 'number' ? data.year : 2026;
  const lang = typeof data.lang === 'string' ? data.lang.slice(0, 8) : 'es';

  if (!email || !EMAIL_REGEX.test(email)) {
    return jsonResponse({ ok: false, error: 'email_invalid' }, 400, origin);
  }

  try {
    await fetch(sheetsUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        year,
        lang,
        timestamp: new Date().toISOString(),
      }),
    });
    return jsonResponse({ ok: true }, 200, origin);
  } catch {
    return jsonResponse({ ok: false, error: 'forward_failed' }, 502, origin);
  }
}

export async function onRequest(context: EventContext): Promise<Response> {
  if (context.request.method === 'OPTIONS') return onRequestOptions(context);
  if (context.request.method === 'POST') return onRequestPost(context);
  const origin = resolveAllowedOrigin(context.request, context.env);
  return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405, origin);
}
