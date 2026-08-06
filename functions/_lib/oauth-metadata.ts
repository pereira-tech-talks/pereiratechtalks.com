/**
 * OAuth Protected Resource Metadata (RFC 9728) and Authorization Server
 * Metadata (RFC 8414) builders for agent-readiness discovery.
 *
 * `resource` / `issuer` MUST match the request origin — isitagentready.com
 * rejects PRM when `resource` origin ≠ scanned host (e.g. apex vs v3).
 */

export interface OAuthProtectedResourceMetadata {
  resource: string;
  resource_name: string;
  authorization_servers: string[];
  scopes_supported: string[];
  bearer_methods_supported: string[];
}

export interface OAuthAuthorizationServerMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  revocation_endpoint: string;
  registration_endpoint: string;
  jwks_uri: string;
  grant_types_supported: string[];
  response_types_supported: string[];
  scopes_supported: string[];
  token_endpoint_auth_methods_supported: string[];
  bearer_methods_supported: string[];
  agent_auth: {
    skill: string;
    register_uri: string;
    identity_types_supported: string[];
    anonymous: {
      credential_types_supported: string[];
      claim_uri: string;
    };
    events_supported: string[];
    revocation_uri: string;
  };
}

/** Normalize request URL to a stable origin (no trailing slash). */
export function getRequestOrigin(requestUrl: string): string {
  return new URL(requestUrl).origin;
}

export function buildOAuthProtectedResourceMetadata(
  origin: string
): OAuthProtectedResourceMetadata {
  return {
    resource: origin,
    resource_name: 'Pereira Tech Talks',
    authorization_servers: [origin],
    scopes_supported: ['public:read'],
    bearer_methods_supported: ['header'],
  };
}

export function buildOAuthAuthorizationServerMetadata(
  origin: string
): OAuthAuthorizationServerMetadata {
  return {
    issuer: origin,
    authorization_endpoint: `${origin}/oauth/authorize`,
    token_endpoint: `${origin}/oauth/token`,
    revocation_endpoint: `${origin}/oauth/revoke`,
    registration_endpoint: `${origin}/agent/register`,
    jwks_uri: `${origin}/.well-known/jwks.json`,
    grant_types_supported: ['authorization_code', 'client_credentials'],
    response_types_supported: ['code'],
    scopes_supported: ['public:read'],
    token_endpoint_auth_methods_supported: ['none'],
    bearer_methods_supported: ['header'],
    agent_auth: {
      skill: `${origin}/auth.md`,
      register_uri: `${origin}/agent/register`,
      identity_types_supported: ['anonymous'],
      anonymous: {
        credential_types_supported: ['access_token'],
        claim_uri: `${origin}/agent/claim`,
      },
      events_supported: [
        'https://schemas.openid.net/secevent/oauth/event-type/token-revoked',
      ],
      revocation_uri: `${origin}/oauth/revoke`,
    },
  };
}

export function jsonResponse(body: unknown, maxAge = 300): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${maxAge}, must-revalidate`,
      'Access-Control-Allow-Origin': '*',
    },
  });
}
