/**
 * First-party Umami proxy — serves script.js and forwards api/send to Umami Cloud.
 * Reduces ad-blocker under-count for the developer audience.
 *
 * Routes:
 *   GET  /api/umami/script.js  → cloud.umami.is/script.js
 *   POST /api/umami/api/send   → cloud.umami.is/api/send
 */

import {
  ALLOWED_UMAMI_PATHS,
  buildUmamiProxyRequestHeaders,
  buildUmamiUpstreamUrl,
  getUmamiProxyCacheControl,
  isAllowedUmamiPath,
} from '../../_lib/umami-proxy';

interface EventContext {
  request: Request;
  params: { path?: string };
}

const ALLOWED_METHODS = new Set(['GET', 'POST']);

export async function onRequest(context: EventContext): Promise<Response> {
  const path = (context.params.path ?? 'script.js').replace(/^\/+/, '');

  if (!isAllowedUmamiPath(path)) {
    return new Response('Not Found', { status: 404 });
  }

  const method = context.request.method.toUpperCase();
  if (!ALLOWED_METHODS.has(method)) {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'GET, POST' },
    });
  }

  if (path === 'script.js' && method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  if (path === 'api/send' && method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const upstreamUrl = buildUmamiUpstreamUrl(path);
  const init: RequestInit = {
    method,
    headers: buildUmamiProxyRequestHeaders(context.request),
  };

  if (method === 'POST') {
    init.body = await context.request.text();
  }

  try {
    const upstream = await fetch(upstreamUrl, init);
    const contentType =
      upstream.headers.get('Content-Type') ?? 'application/octet-stream';

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': getUmamiProxyCacheControl(path),
      },
    });
  } catch {
    return new Response('Bad Gateway', { status: 502 });
  }
}

/** Exported for unit tests — validates path allowlist contract. */
export { ALLOWED_UMAMI_PATHS };
