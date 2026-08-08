import { describe, expect, it } from 'vitest';
import {
  ALLOWED_UMAMI_PATHS,
  buildUmamiProxyRequestHeaders,
  buildUmamiUpstreamUrl,
  getUmamiProxyCacheControl,
  isAllowedUmamiPath,
  resolveUmamiPath,
} from '../../../functions/_lib/umami-proxy';

describe('umami proxy helpers', () => {
  describe('isAllowedUmamiPath', () => {
    it('allows script.js and api/send only', () => {
      expect(isAllowedUmamiPath('script.js')).toBe(true);
      expect(isAllowedUmamiPath('api/send')).toBe(true);
      expect(isAllowedUmamiPath('api/stats')).toBe(false);
      expect(isAllowedUmamiPath('../etc/passwd')).toBe(false);
    });

    it('documents the allowlist contract', () => {
      expect([...ALLOWED_UMAMI_PATHS].sort()).toEqual([
        'api/send',
        'script.js',
      ]);
    });
  });

  describe('resolveUmamiPath', () => {
    it('defaults and normalizes string / array catch-all params', () => {
      expect(resolveUmamiPath(undefined)).toBe('script.js');
      expect(resolveUmamiPath('script.js')).toBe('script.js');
      expect(resolveUmamiPath('/api/send')).toBe('api/send');
      expect(resolveUmamiPath(['api', 'send'])).toBe('api/send');
    });
  });

  describe('buildUmamiUpstreamUrl', () => {
    it('points to Umami Cloud origin', () => {
      expect(buildUmamiUpstreamUrl('script.js')).toBe(
        'https://cloud.umami.is/script.js'
      );
      expect(buildUmamiUpstreamUrl('api/send')).toBe(
        'https://cloud.umami.is/api/send'
      );
    });
  });

  describe('buildUmamiProxyRequestHeaders', () => {
    it('forwards client IP and user agent', () => {
      const request = new Request(
        'https://pereiratechtalks.org/api/umami/api/send',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CF-Connecting-IP': '203.0.113.10',
            'User-Agent': 'Mozilla/5.0 Test',
          },
        }
      );

      const headers = buildUmamiProxyRequestHeaders(request);
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('x-forwarded-for')).toBe('203.0.113.10');
      expect(headers.get('User-Agent')).toBe('Mozilla/5.0 Test');
    });
  });

  describe('getUmamiProxyCacheControl', () => {
    it('caches script, not collect', () => {
      expect(getUmamiProxyCacheControl('script.js')).toContain('max-age');
      expect(getUmamiProxyCacheControl('api/send')).toBe('no-store');
    });
  });
});
