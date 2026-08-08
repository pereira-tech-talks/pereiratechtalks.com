/**
 * RFC 9728 OAuth Protected Resource Metadata — origin-aware.
 * Static public/.well-known/oauth-protected-resource remains a build-time
 * fallback; this Function wins on Cloudflare Pages so v3 vs apex scans pass.
 */

import {
  buildOAuthProtectedResourceMetadata,
  getRequestOrigin,
  jsonResponse,
} from '../_lib/oauth-metadata';

interface EventContext {
  request: Request;
}

export async function onRequestGet(context: EventContext): Promise<Response> {
  const origin = getRequestOrigin(context.request.url);
  return jsonResponse(buildOAuthProtectedResourceMetadata(origin));
}

export async function onRequestHead(context: EventContext): Promise<Response> {
  const origin = getRequestOrigin(context.request.url);
  const body = jsonResponse(buildOAuthProtectedResourceMetadata(origin));
  return new Response(null, { status: 200, headers: body.headers });
}

export async function onRequest(context: EventContext): Promise<Response> {
  const method = context.request.method.toUpperCase();
  if (method === 'HEAD') return onRequestHead(context);
  if (method === 'GET') return onRequestGet(context);
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'GET, HEAD' },
  });
}
