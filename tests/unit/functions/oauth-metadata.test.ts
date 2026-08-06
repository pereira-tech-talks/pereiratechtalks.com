import { describe, expect, it } from 'vitest';
import {
  buildOAuthAuthorizationServerMetadata,
  buildOAuthProtectedResourceMetadata,
  getRequestOrigin,
} from '../../../functions/_lib/oauth-metadata';

describe('oauth metadata helpers', () => {
  describe('getRequestOrigin', () => {
    it('strips path and query', () => {
      expect(
        getRequestOrigin(
          'https://v3.pereiratechtalks.org/.well-known/oauth-protected-resource'
        )
      ).toBe('https://v3.pereiratechtalks.org');
    });
  });

  describe('buildOAuthProtectedResourceMetadata', () => {
    it('matches request origin for apex and v3', () => {
      const apex = buildOAuthProtectedResourceMetadata(
        'https://pereiratechtalks.org'
      );
      expect(apex.resource).toBe('https://pereiratechtalks.org');
      expect(apex.authorization_servers).toEqual([
        'https://pereiratechtalks.org',
      ]);
      expect(apex.bearer_methods_supported).toContain('header');
      expect(apex.scopes_supported).toContain('public:read');

      const v3 = buildOAuthProtectedResourceMetadata(
        'https://v3.pereiratechtalks.org'
      );
      expect(v3.resource).toBe('https://v3.pereiratechtalks.org');
      expect(v3.authorization_servers).toEqual([
        'https://v3.pereiratechtalks.org',
      ]);
    });
  });

  describe('buildOAuthAuthorizationServerMetadata', () => {
    it('includes agent_auth with register_uri and anonymous method', () => {
      const origin = 'https://v3.pereiratechtalks.org';
      const meta = buildOAuthAuthorizationServerMetadata(origin);
      expect(meta.issuer).toBe(origin);
      expect(meta.agent_auth.skill).toBe(`${origin}/auth.md`);
      expect(meta.agent_auth.register_uri).toBe(`${origin}/agent/register`);
      expect(meta.agent_auth.identity_types_supported).toContain('anonymous');
      expect(meta.agent_auth.anonymous.claim_uri).toBe(`${origin}/agent/claim`);
      expect(meta.bearer_methods_supported).toContain('header');
    });
  });
});
