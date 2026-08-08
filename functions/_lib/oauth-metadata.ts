/**
 * OAuth Protected Resource Metadata (RFC 9728) and Authorization Server
 * Metadata (RFC 8414) builders for agent-readiness discovery.
 *
 * `resource` / `issuer` MUST match the request origin — isitagentready.com
 * rejects PRM when `resource` origin ≠ scanned host (e.g. apex vs v3).
 *
 * auth.md scanners require top-level `agent_auth.claim_uri` when
 * `identity_types_supported` includes `anonymous` (nested-only fails with
 * "anonymous registration requires claim_uri").
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
    /** WorkOS / clawhub alias for register_uri */
    identity_endpoint: string;
    /** Required at top level for anonymous by isitagentready authMd check */
    claim_uri: string;
    /** WorkOS / clawhub alias for claim_uri */
    claim_endpoint: string;
    claim_complete_uri: string;
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
  const registerUri = `${origin}/agent/register`;
  const claimUri = `${origin}/agent/claim`;
  const claimCompleteUri = `${origin}/agent/claim/complete`;
  const revocationUri = `${origin}/oauth/revoke`;

  return {
    issuer: origin,
    authorization_endpoint: `${origin}/oauth/authorize`,
    token_endpoint: `${origin}/oauth/token`,
    revocation_endpoint: revocationUri,
    registration_endpoint: registerUri,
    jwks_uri: `${origin}/.well-known/jwks.json`,
    grant_types_supported: ['authorization_code', 'client_credentials'],
    response_types_supported: ['code'],
    scopes_supported: ['public:read'],
    token_endpoint_auth_methods_supported: ['none'],
    bearer_methods_supported: ['header'],
    agent_auth: {
      skill: `${origin}/auth.md`,
      register_uri: registerUri,
      identity_endpoint: registerUri,
      claim_uri: claimUri,
      claim_endpoint: claimUri,
      claim_complete_uri: claimCompleteUri,
      identity_types_supported: ['anonymous'],
      anonymous: {
        credential_types_supported: ['access_token'],
        claim_uri: claimUri,
      },
      events_supported: [
        'https://schemas.openid.net/secevent/oauth/event-type/token-revoked',
      ],
      revocation_uri: revocationUri,
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
