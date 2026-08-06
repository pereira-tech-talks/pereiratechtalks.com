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

export async function onRequest(context: EventContext): Promise<Response> {
  if (context.request.method.toUpperCase() !== 'GET') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'GET' },
    });
  }
  return onRequestGet(context);
}
