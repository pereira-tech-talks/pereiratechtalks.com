/**
 * Cloudflare Pages Function — Contact / CFS / Sponsor intake backend.
 *
 * Topic-discriminated JSON POST → Resend (inbox + optional submitter ack).
 *
 * Env (required for Resend path):
 *   RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
 * Optional:
 *   CONTACT_TO_SPEAKERS, CONTACT_TO_SPONSORS, CONTACT_TO_PRESS, CONTACT_TO_CONDUCT
 *   CONTACT_ALLOWED_ORIGINS
 *   CONTACT_RATE_LIMIT (default 8), CONTACT_RATE_WINDOW_MS (default 600000)
 *   CONTACT_TURNSTILE_SECRET — reserved; when unset Turnstile is not enforced
 */

import {
  CANONICAL_TOPICS,
  CFS_FORMATS,
  CONTRIBUTION_TYPES,
  SPONSOR_TIERS,
  checkRateLimit,
  looksLikeSpamPayload,
  normalizeTopic,
  pickAckCopy,
} from '../_lib/intake-helpers';

const MAX_NAME_LENGTH = 120;
const MAX_SUBJECT_LENGTH = 140;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_TALK_TITLE_LENGTH = 160;
const MAX_ABSTRACT_LENGTH = 2000;
const MAX_TAKEAWAYS_LENGTH = 800;
const MAX_SOCIAL_LENGTH = 300;
const MAX_COMPANY_LENGTH = 160;

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_SPEAKERS?: string;
  CONTACT_TO_SPONSORS?: string;
  CONTACT_TO_PRESS?: string;
  CONTACT_TO_CONDUCT?: string;
  CONTACT_ALLOWED_ORIGINS?: string;
  CONTACT_RATE_LIMIT?: string;
  CONTACT_RATE_WINDOW_MS?: string;
  CONTACT_TURNSTILE_SECRET?: string;
}

interface EventContext {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<unknown>) => void;
}

interface IntakePayload {
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
  lang: string;
  website: string;
  talkTitle: string;
  format: string;
  abstract: string;
  takeaways: string;
  socialUrl: string;
  firstTime: boolean;
  speakerSchool: boolean;
  company: string;
  contactRole: string;
  tierInterest: string;
  contributionType: string;
}

const ALLOWED_REASONS = new Set<string>(CANONICAL_TOPICS);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

/** Isolate-local rate limit store (best-effort on CF Workers). */
const rateLimitStore = new Map<string, number[]>();

function jsonResponse(
  data: unknown,
  status: number,
  origin: string,
  extraHeaders?: Record<string, string>
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
      ...(extraHeaders || {}),
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

function asBool(value: unknown): boolean {
  return value === true || value === 'true' || value === '1' || value === 'on';
}

function routeInbox(env: Env, reason: string): string {
  const fallback = env.CONTACT_TO_EMAIL || '';
  switch (reason) {
    case 'tech-talk':
      return env.CONTACT_TO_SPEAKERS || fallback;
    case 'sponsorship':
      return env.CONTACT_TO_SPONSORS || fallback;
    case 'press':
      return env.CONTACT_TO_PRESS || fallback;
    case 'conduct':
      return env.CONTACT_TO_CONDUCT || fallback;
    default:
      return fallback;
  }
}

function validate(payload: IntakePayload): string | null {
  if (!payload.name) return 'name_required';
  if (!payload.email) return 'email_required';
  if (!EMAIL_REGEX.test(payload.email)) return 'email_invalid';
  if (!payload.reason || !ALLOWED_REASONS.has(payload.reason)) {
    return 'reason_invalid';
  }
  if (!payload.subject) return 'subject_required';
  if (!payload.message) return 'message_required';
  if (payload.message.length < 10) return 'message_too_short';

  if (payload.reason === 'tech-talk') {
    if (!payload.talkTitle) return 'talk_title_required';
    if (!(CFS_FORMATS as readonly string[]).includes(payload.format)) {
      return 'format_invalid';
    }
    if (payload.abstract.length < 20) return 'abstract_too_short';
    if (!payload.takeaways) return 'takeaways_required';
    if (!payload.socialUrl) return 'social_required';
  }

  if (payload.reason === 'sponsorship') {
    if (!payload.company) return 'company_required';
    if (!payload.contactRole) return 'role_required';
    if (!(SPONSOR_TIERS as readonly string[]).includes(payload.tierInterest)) {
      return 'tier_invalid';
    }
    if (
      !(CONTRIBUTION_TYPES as readonly string[]).includes(
        payload.contributionType
      )
    ) {
      return 'contribution_invalid';
    }
  }

  return null;
}

function buildBodies(
  payload: IntakePayload,
  meta: { ip: string; userAgent: string; lang: string }
): { text: string; html: string; subject: string } {
  const subjectPrefix = `[PTT · ${payload.reason}]`;
  const safeSubject = `${subjectPrefix} ${payload.subject}`.slice(0, 200);

  const extraLines: string[] = [];
  if (payload.reason === 'tech-talk') {
    extraLines.push(
      `Talk title: ${payload.talkTitle}`,
      `Format: ${payload.format}`,
      `First-time: ${payload.firstTime ? 'yes' : 'no'}`,
      `Speaker School: ${payload.speakerSchool ? 'yes' : 'no'}`,
      `Social: ${payload.socialUrl}`,
      '',
      'Abstract:',
      payload.abstract,
      '',
      'Takeaways:',
      payload.takeaways
    );
  }
  if (payload.reason === 'sponsorship') {
    extraLines.push(
      `Company: ${payload.company}`,
      `Role: ${payload.contactRole}`,
      `Tier: ${payload.tierInterest}`,
      `Contribution: ${payload.contributionType}`
    );
  }

  const textBody = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Reason: ${payload.reason}`,
    `Language: ${meta.lang}`,
    `Subject: ${payload.subject}`,
    '',
    ...extraLines,
    '',
    'Message:',
    payload.message,
    '',
    '---',
    `IP: ${meta.ip}`,
    `User-Agent: ${meta.userAgent}`,
  ].join('\n');

  const extraHtml =
    payload.reason === 'tech-talk'
      ? `<h3>Talk</h3>
         <p><strong>${escapeHtml(payload.talkTitle)}</strong> (${escapeHtml(payload.format)})</p>
         <p>First-time: ${payload.firstTime ? 'yes' : 'no'} · Speaker School: ${payload.speakerSchool ? 'yes' : 'no'}</p>
         <p>Social: ${escapeHtml(payload.socialUrl)}</p>
         <h4>Abstract</h4><pre style="white-space:pre-wrap;background:#f3f4f6;padding:16px;border-radius:8px;">${escapeHtml(payload.abstract)}</pre>
         <h4>Takeaways</h4><pre style="white-space:pre-wrap;background:#f3f4f6;padding:16px;border-radius:8px;">${escapeHtml(payload.takeaways)}</pre>`
      : payload.reason === 'sponsorship'
        ? `<h3>Sponsorship</h3>
           <p>Company: ${escapeHtml(payload.company)}<br>
           Role: ${escapeHtml(payload.contactRole)}<br>
           Tier: ${escapeHtml(payload.tierInterest)}<br>
           Contribution: ${escapeHtml(payload.contributionType)}</p>`
        : '';

  const htmlBody = `
    <div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #111827;">
      <h2 style="margin: 0 0 16px;">New PTT intake · ${escapeHtml(payload.reason)}</h2>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Name</strong></td><td>${escapeHtml(payload.name)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Email</strong></td><td>${escapeHtml(payload.email)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Reason</strong></td><td>${escapeHtml(payload.reason)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Language</strong></td><td>${escapeHtml(meta.lang)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Subject</strong></td><td>${escapeHtml(payload.subject)}</td></tr>
      </table>
      ${extraHtml}
      <h3 style="margin: 24px 0 8px;">Message</h3>
      <pre style="white-space: pre-wrap; background: #f3f4f6; padding: 16px; border-radius: 8px;">${escapeHtml(payload.message)}</pre>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        IP: ${escapeHtml(meta.ip)}<br>
        User-Agent: ${escapeHtml(meta.userAgent)}
      </p>
    </div>
  `;

  return { text: textBody, html: htmlBody, subject: safeSubject };
}

async function resendSend(
  env: Env,
  args: {
    to: string[];
    replyTo?: string;
    subject: string;
    text: string;
    html?: string;
  }
): Promise<{ ok: boolean; status: number; error?: string }> {
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL) {
    return { ok: false, status: 503, error: 'backend_not_configured' };
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: args.to,
        reply_to: args.replyTo,
        subject: args.subject,
        text: args.text,
        html: args.html,
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
  const reason = normalizeTopic(sanitiseText(data.reason ?? data.topic, 32));

  const payload: IntakePayload = {
    name: sanitiseText(data.name, MAX_NAME_LENGTH),
    email: sanitiseText(data.email, MAX_EMAIL_LENGTH).toLowerCase(),
    reason,
    subject: sanitiseText(data.subject, MAX_SUBJECT_LENGTH),
    message: sanitiseText(data.message, MAX_MESSAGE_LENGTH),
    lang: sanitiseText(data.lang, 8) || 'en',
    website: sanitiseText(data.website, 200),
    talkTitle: sanitiseText(data.talkTitle, MAX_TALK_TITLE_LENGTH),
    format: sanitiseText(data.format, 32),
    abstract: sanitiseText(data.abstract, MAX_ABSTRACT_LENGTH),
    takeaways: sanitiseText(data.takeaways, MAX_TAKEAWAYS_LENGTH),
    socialUrl: sanitiseText(data.socialUrl, MAX_SOCIAL_LENGTH),
    firstTime: asBool(data.firstTime),
    speakerSchool: asBool(data.speakerSchool),
    company: sanitiseText(data.company, MAX_COMPANY_LENGTH),
    contactRole: sanitiseText(data.contactRole, 120),
    tierInterest: sanitiseText(data.tierInterest, 32),
    contributionType: sanitiseText(data.contributionType, 32),
  };

  // Turnstile: reserved. When CONTACT_TURNSTILE_SECRET is unset, skip (documented defer).
  void context.env.CONTACT_TURNSTILE_SECRET;

  const ip =
    context.request.headers.get('CF-Connecting-IP') ||
    context.request.headers.get('X-Forwarded-For') ||
    'unknown';

  const limit = Number(context.env.CONTACT_RATE_LIMIT || '8');
  const windowMs = Number(context.env.CONTACT_RATE_WINDOW_MS || '600000');
  const rl = checkRateLimit(rateLimitStore, ip, limit, windowMs);
  if (!rl.allowed) {
    return jsonResponse(
      { ok: false, error: 'rate_limited' },
      429,
      origin,
      { 'Retry-After': String(rl.retryAfterSec) }
    );
  }

  if (
    looksLikeSpamPayload({
      name: payload.name,
      message: `${payload.message}\n${payload.abstract}`,
      website: payload.website,
    })
  ) {
    return jsonResponse({ ok: true }, 200, origin);
  }

  const validationError = validate(payload);
  if (validationError) {
    return jsonResponse({ ok: false, error: validationError }, 400, origin);
  }

  const to = routeInbox(context.env, payload.reason);
  if (!to || !context.env.RESEND_API_KEY || !context.env.CONTACT_FROM_EMAIL) {
    return jsonResponse(
      { ok: false, error: 'backend_not_configured' },
      503,
      origin
    );
  }

  const meta = {
    ip,
    userAgent: context.request.headers.get('User-Agent') || 'unknown',
    lang: payload.lang || 'en',
  };

  const bodies = buildBodies(payload, meta);
  const result = await resendSend(context.env, {
    to: [to],
    replyTo: payload.email,
    subject: bodies.subject,
    text: bodies.text,
    html: bodies.html,
  });

  if (!result.ok) {
    return jsonResponse(
      { ok: false, error: result.error || 'send_failed' },
      result.status,
      origin
    );
  }

  // Auto-ack — best-effort; never fail the primary submission.
  const ackLang = payload.lang === 'es' ? 'es' : 'en';
  const ack = pickAckCopy(payload.reason, ackLang);
  context.waitUntil(
    resendSend(context.env, {
      to: [payload.email],
      subject: ack.subject,
      text: ack.text,
    }).then(() => undefined)
  );

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
