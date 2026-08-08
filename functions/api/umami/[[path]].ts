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
  resolveUmamiPath,
} from '../../_lib/umami-proxy';

interface EventContext {
  request: Request;
  params: { path?: string | string[] };
}

const ALLOWED_METHODS = new Set(['GET', 'POST']);

export async function onRequest(context: EventContext): Promise<Response> {
  try {
    const path = resolveUmamiPath(context.params?.path);

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
      // Avoid holding a live upstream stream across the isolate boundary
      // (CF 1101 when streaming bodies fail mid-transfer).
      redirect: 'follow',
    };

    if (method === 'POST') {
      init.body = await context.request.arrayBuffer();
    }

    const upstream = await fetch(upstreamUrl, init);
    const body = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get('Content-Type') ?? 'application/octet-stream';

    return new Response(body, {
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
