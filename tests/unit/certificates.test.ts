import { describe, expect, it } from 'vitest';

import { DEMO_CERTIFICATE_FIXTURES } from '@/data/certificates/demo-fixtures';
import {
  assertCertificateFixture,
  certificateDiplomaPath,
  certificateVerifyPath,
  getCertificateById,
  getCertificatesByYear,
  isCertificateFixture,
  toCertificatePayload,
  verifyCertificateId,
} from '@/lib/certificates';

describe('certificate fixtures', () => {
  it('validates all demo fixtures', () => {
    for (const fixture of DEMO_CERTIFICATE_FIXTURES) {
      expect(() => assertCertificateFixture(fixture)).not.toThrow();
      expect(isCertificateFixture(fixture)).toBe(true);
    }
  });

  it('includes attendee, speaker, and volunteer roles', () => {
    const roles = new Set(DEMO_CERTIFICATE_FIXTURES.map((f) => f.role));
    expect(roles.has('attendee')).toBe(true);
    expect(roles.has('speaker')).toBe(true);
    expect(roles.has('volunteer')).toBe(true);
  });

  it('uses opaque ids without emails', () => {
    for (const fixture of DEMO_CERTIFICATE_FIXTURES) {
      expect(fixture.id).toMatch(/^ptd26_demo_/);
      expect(JSON.stringify(fixture).toLowerCase()).not.toMatch(/@/);
      expect(fixture.subjectName.toLowerCase()).toContain('demo');
    }
  });

  it('loads PTD 2026 certificates by year', () => {
    expect(getCertificatesByYear(2026).length).toBeGreaterThanOrEqual(3);
  });
});

describe('certificate registry', () => {
  it('resolves known id and builds localized payload', () => {
    const fixture = getCertificateById('ptd26_demo_a7k3m9qx');
    expect(fixture).toBeDefined();
    if (!fixture) {
      throw new Error('expected fixture');
    }
    const payload = toCertificatePayload(fixture, 'es');
    expect(payload.subject.name).toBe('Alex Rivera Demo');
    expect(payload.event.year).toBe(2026);
    expect(payload.type).toBe('EventAttendanceCertificate');
  });

  it('builds diploma and verify paths', () => {
    expect(certificateDiplomaPath(2026, 'ptd26_demo_a7k3m9qx', 'es')).toBe(
      '/pereira-tech-days/2026/certificates/ptd26_demo_a7k3m9qx'
    );
    expect(certificateDiplomaPath(2026, 'ptd26_demo_a7k3m9qx', 'en')).toBe(
      '/en/pereira-tech-days/2026/certificates/ptd26_demo_a7k3m9qx'
    );
    expect(certificateVerifyPath('ptd26_demo_a7k3m9qx', 'es')).toBe(
      '/certificates/verify?id=ptd26_demo_a7k3m9qx'
    );
  });
});

describe('verifyCertificateId', () => {
  it('returns valid for demo attendee', () => {
    const result = verifyCertificateId('ptd26_demo_a7k3m9qx', 'en');
    expect(result.valid).toBe(true);
    expect(result.status).toBe('valid');
  });

  it('returns revoked for revoked fixture', () => {
    const result = verifyCertificateId('ptd26_demo_revoked01', 'en');
    expect(result.valid).toBe(false);
    expect(result.status).toBe('revoked');
  });

  it('returns unknown for missing id', () => {
    const result = verifyCertificateId('does_not_exist_xx', 'es');
    expect(result.valid).toBe(false);
    expect(result.status).toBe('unknown');
    expect(result.reasons).toContain('not_found');
  });
});
