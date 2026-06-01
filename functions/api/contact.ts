/**
 * Cloudflare Pages Function — Contact form backend
 *
 * Accepts a JSON POST from `ContactForm.svelte`, validates and sanitises the
 * payload, applies a small spam guard (honeypot + length limits + suspicious
 * link heuristic) and forwards the message via Resend.
 *
 * The same endpoint serves the Contact, Call for Speakers, and Sponsor Us
 * forms (the latter two link to /contact with a prefilled `reason`/`subject`).
 *
 * Required Cloudflare Pages environment variables:
 *   - RESEND_API_KEY         — Resend API key (server-side secret)
 *   - CONTACT_TO_EMAIL       — Inbox that receives form submissions
 *   - CONTACT_FROM_EMAIL     — Verified Resend sender (e.g. "PTT <hello@…>")
 *
 * Optional:
 *   - CONTACT_ALLOWED_ORIGINS — Comma-separated origin allowlist for CORS.
 *                               Defaults to the request origin (single-page
 *                               app, same-origin POSTs).
 *
 * Behaviour when secrets are missing:
 *   - Returns 503 in production-like requests so the form surfaces an error
 *     instead of silently dropping submissions.
 *   - Local `wrangler pages dev` without env vars also returns 503 (the
 *     Svelte form falls back to its legacy Google Forms path when the
 *     `apiEndpoint` prop is empty).
 */

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_ALLOWED_ORIGINS?: string;
}

interface EventContext {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<unknown>) => void;
}

interface ContactPayload {
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
  lang?: string;
  /** Honeypot — must be empty for a real submission */
  website?: string;
}

const ALLOWED_REASONS = new Set([
  'general',
  'speaking',
  'sponsor',
  'media',
  'feedback',
  'other',
]);

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 140;
const MAX_MESSAGE_LENGTH = 2000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(
  data: unknown,
  status: number,
  origin: string
): Response {
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
    .map((value) => value.trim())
    .filter(Boolean);

  if (allowlist.length === 0) {
    return requestOrigin || '*';
  }

  if (requestOrigin && allowlist.includes(requestOrigin)) {
    return requestOrigin;
  }

  // First entry is the canonical origin; fall back to that.
  return allowlist[0];
}

function sanitiseText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function looksLikeSpam(payload: ContactPayload): boolean {
  if (payload.website && payload.website.trim().length > 0) return true;

  const urlPattern = /https?:\/\//gi;
  const nameUrlMatches = payload.name.match(urlPattern);
  if (nameUrlMatches && nameUrlMatches.length > 0) return true;

  const messageUrlMatches = payload.message.match(urlPattern);
  if (messageUrlMatches && messageUrlMatches.length > 6) return true;

  return false;
}

function validate(payload: ContactPayload): string | null {
  if (!payload.name) return 'name_required';
  if (!payload.email) return 'email_required';
  if (!EMAIL_REGEX.test(payload.email)) return 'email_invalid';
  if (!payload.reason || !ALLOWED_REASONS.has(payload.reason)) {
    return 'reason_invalid';
  }
  if (!payload.subject) return 'subject_required';
  if (!payload.message) return 'message_required';
  if (payload.message.length < 10) return 'message_too_short';
  return null;
}

async function sendViaResend(
  env: Env,
  payload: ContactPayload,
  meta: { ip: string; userAgent: string; lang: string }
): Promise<{ ok: boolean; status: number; error?: string }> {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return { ok: false, status: 503, error: 'backend_not_configured' };
  }

  const subjectPrefix = `[PTT contact · ${payload.reason}]`;
  const safeSubject = `${subjectPrefix} ${payload.subject}`.slice(0, 200);

  const textBody = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Reason: ${payload.reason}`,
    `Language: ${meta.lang}`,
    `Subject: ${payload.subject}`,
    '',
    payload.message,
    '',
    '---',
    `IP: ${meta.ip}`,
    `User-Agent: ${meta.userAgent}`,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #111827;">
      <h2 style="margin: 0 0 16px;">New PTT contact submission</h2>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Name</strong></td><td>${escapeHtml(payload.name)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Email</strong></td><td>${escapeHtml(payload.email)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Reason</strong></td><td>${escapeHtml(payload.reason)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Language</strong></td><td>${escapeHtml(meta.lang)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Subject</strong></td><td>${escapeHtml(payload.subject)}</td></tr>
      </table>
      <h3 style="margin: 24px 0 8px;">Message</h3>
      <pre style="white-space: pre-wrap; background: #f3f4f6; padding: 16px; border-radius: 8px;">${escapeHtml(payload.message)}</pre>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        IP: ${escapeHtml(meta.ip)}<br>
        User-Agent: ${escapeHtml(meta.userAgent)}
      </p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: payload.email,
        subject: safeSubject,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        status: 502,
        error: `resend_error_${response.status}`,
      };
    }

    return { ok: true, status: 200 };
  } catch (error) {
    return {
      ok: false,
      status: 502,
      error: error instanceof Error ? error.message : 'unknown_error',
    };
  }
}

export async function onRequestOptions(
  context: EventContext
): Promise<Response> {
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

export async function onRequestPost(
  context: EventContext
): Promise<Response> {
  const origin = resolveAllowedOrigin(context.request, context.env);
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
  const payload: ContactPayload = {
    name: sanitiseText(data.name, MAX_NAME_LENGTH),
    email: sanitiseText(data.email, MAX_EMAIL_LENGTH).toLowerCase(),
    reason: sanitiseText(data.reason, 32),
    subject: sanitiseText(data.subject, MAX_SUBJECT_LENGTH),
    message: sanitiseText(data.message, MAX_MESSAGE_LENGTH),
    lang: sanitiseText(data.lang, 8) || 'en',
    website: sanitiseText(data.website, 200),
  };

  if (looksLikeSpam(payload)) {
    // Pretend success to avoid feedback loops with bots.
    return jsonResponse({ ok: true }, 200, origin);
  }

  const validationError = validate(payload);
  if (validationError) {
    return jsonResponse(
      { ok: false, error: validationError },
      400,
      origin
    );
  }

  const meta = {
    ip:
      context.request.headers.get('CF-Connecting-IP') ||
      context.request.headers.get('X-Forwarded-For') ||
      'unknown',
    userAgent: context.request.headers.get('User-Agent') || 'unknown',
    lang: payload.lang || 'en',
  };

  const result = await sendViaResend(context.env, payload, meta);

  if (!result.ok) {
    return jsonResponse(
      { ok: false, error: result.error || 'send_failed' },
      result.status,
      origin
    );
  }

  return jsonResponse({ ok: true }, 200, origin);
}

export async function onRequest(context: EventContext): Promise<Response> {
  if (context.request.method === 'OPTIONS') {
    return onRequestOptions(context);
  }
  if (context.request.method === 'POST') {
    return onRequestPost(context);
  }
  const origin = resolveAllowedOrigin(context.request, context.env);
  return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405, origin);
}
