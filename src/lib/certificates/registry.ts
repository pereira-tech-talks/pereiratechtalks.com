import { DEMO_CERTIFICATE_FIXTURES } from '@/data/certificates/demo-fixtures';
import {
  assertCertificateFixture,
  type CertificateFixture,
  type CertificatePayload,
  type CertificateStatus,
} from '@/lib/certificates/types';
import type { Language } from '@/lib/i18n';

/**
 * Demo fixture registry for certificate diploma UX.
 * Production CSV / signed issuance will replace this module later
 * (see PLAN_certificate_generation_system handoff).
 */

const fixtures: CertificateFixture[] = (() => {
  for (const item of DEMO_CERTIFICATE_FIXTURES) {
    assertCertificateFixture(item);
  }
  return DEMO_CERTIFICATE_FIXTURES;
})();

export function getAllCertificateFixtures(): CertificateFixture[] {
  return fixtures;
}

export function getCertificateById(id: string): CertificateFixture | undefined {
  return fixtures.find((f) => f.id === id);
}

export function getCertificatesByYear(year: number): CertificateFixture[] {
  return fixtures.filter((f) => f.eventYear === year);
}

export function toCertificatePayload(
  fixture: CertificateFixture,
  lang: Language
): CertificatePayload {
  return {
    id: fixture.id,
    type: 'EventAttendanceCertificate',
    issuer: {
      name: fixture.issuerName[lang],
      id: 'https://pereiratechtalks.org',
    },
    subject: {
      name: fixture.subjectName,
      role: fixture.role,
    },
    event: {
      name: fixture.eventName[lang],
      date: fixture.eventDate,
      location: fixture.location[lang],
      year: fixture.eventYear,
    },
    issuedAt: fixture.issuedAt,
    status: fixture.status,
  };
}

export type VerifyResult = {
  valid: boolean;
  status: CertificateStatus;
  reasons: string[];
  payload?: CertificatePayload;
  verifiedAt: string;
};

export function verifyCertificateId(
  id: string | null | undefined,
  lang: Language
): VerifyResult {
  const verifiedAt = new Date().toISOString();
  if (!id || typeof id !== 'string') {
    return {
      valid: false,
      status: 'unknown',
      reasons: ['missing_id'],
      verifiedAt,
    };
  }
  const fixture = getCertificateById(id);
  if (!fixture) {
    return {
      valid: false,
      status: 'unknown',
      reasons: ['not_found'],
      verifiedAt,
    };
  }
  const payload = toCertificatePayload(fixture, lang);
  if (fixture.status === 'valid') {
    return { valid: true, status: 'valid', reasons: [], payload, verifiedAt };
  }
  return {
    valid: false,
    status: fixture.status,
    reasons: [fixture.status],
    payload,
    verifiedAt,
  };
}

export function certificateDiplomaPath(
  year: number,
  id: string,
  lang: Language
): string {
  const prefix = lang === 'en' ? '/en' : '';
  return `${prefix}/pereira-tech-days/${year}/certificates/${id}`;
}

export function certificateVerifyPath(id: string, lang: Language): string {
  const prefix = lang === 'en' ? '/en' : '';
  return `${prefix}/certificates/verify?id=${encodeURIComponent(id)}`;
}
