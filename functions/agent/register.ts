/**
 * Agent registration discovery stub — advertised by agent_auth.register_uri.
 * Public site content needs no credentials; this endpoint documents that.
 */

interface EventContext {
  request: Request;
}

export async function onRequest(context: EventContext): Promise<Response> {
  const origin = new URL(context.request.url).origin;
  const method = context.request.method.toUpperCase();

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const body = {
    status: 'public_no_auth_required',
    message:
      'Pereira Tech Talks public content (blog, meetups, slides, Pereira Tech Day) is readable without registration. Agents should use /.well-known/api-catalog, /llms.txt, and Markdown twin endpoints. Contact the community for privileged write access.',
    skill: `${origin}/auth.md`,
    resource_metadata: `${origin}/.well-known/oauth-protected-resource`,
    scopes: ['public:read'],
    contact: `${origin}/contact/`,
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: method === 'POST' ? 200 : 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, must-revalidate',
    },
  });
}
