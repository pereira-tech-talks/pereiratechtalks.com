/**
 * Agent claim-complete stub — advertised by agent_auth.claim_complete_uri.
 * No OTP ceremony is required for public:read content.
 */

interface EventContext {
  request: Request;
}

export async function onRequest(context: EventContext): Promise<Response> {
  const origin = new URL(context.request.url).origin;
  const body = {
    status: 'not_applicable',
    message:
      'No claim-complete ceremony is required for public:read access on Pereira Tech Talks. See /auth.md.',
    skill: `${origin}/auth.md`,
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, must-revalidate',
    },
  });
}
