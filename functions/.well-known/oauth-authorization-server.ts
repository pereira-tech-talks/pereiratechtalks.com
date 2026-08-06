/**
 * RFC 8414 OAuth Authorization Server Metadata + auth.md agent_auth block.
 * Origin-aware so issuer matches the scanned host (apex or v3).
 */

import {
  buildOAuthAuthorizationServerMetadata,
  getRequestOrigin,
  jsonResponse,
} from '../_lib/oauth-metadata';

interface EventContext {
  request: Request;
}

export async function onRequestGet(context: EventContext): Promise<Response> {
  const origin = getRequestOrigin(context.request.url);
  return jsonResponse(buildOAuthAuthorizationServerMetadata(origin));
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
