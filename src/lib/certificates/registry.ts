import registryData from '@/data/certificates/registry.json';
import {
  type CertificateRegistry,
  parseCertificateRegistry,
  registryRecordToFixture,
} from '@/lib/certificates/registry-schema';
import {
  assertCertificateFixture,
  type CertificateFixture,
  type CertificatePayload,
  type CertificateStatus,
} from '@/lib/certificates/types';
import type { Language } from '@/lib/i18n';

/**
 * Certificate registry backed by validated JSON (no emails).
 * Demo fixtures are derived from registry records for diploma UX.
 */

const registry: CertificateRegistry = parseCertificateRegistry(registryData);

const fixtures: CertificateFixture[] = (() => {
  const eventsById = new Map(registry.events.map((e) => [e.id, e]));
  const list: CertificateFixture[] = [];
  for (const record of registry.certificates) {
    const event = eventsById.get(record.eventId);
    if (!event) {
      throw new Error(`Unknown event for certificate ${record.id}`);
    }
    const fixture = registryRecordToFixture(record, event);
    assertCertificateFixture(fixture);
    list.push(fixture);
  }
  return list;
})();

export function getRegistry(): CertificateRegistry {
  return registry;
}

export function getAllCertificateFixtures(): CertificateFixture[] {
  return fixtures;
}

export function getCertificateById(id: string): CertificateFixture | undefined {
  return fixtures.find((f) => f.id === id);
}

export function getCertificatesByYear(year: number): CertificateFixture[] {
  return fixtures.filter((f) => f.eventYear === year);
}

export function getCertificateEventId(
  certificateId: string
): string | undefined {
  return registry.certificates.find((c) => c.id === certificateId)?.eventId;
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
  crypto?: {
    checked: boolean;
    signatureValid: boolean;
    provider?: string;
    mode: 'signed' | 'unsigned' | 'demo';
  };
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

export function signedCredentialPublicPath(
  eventId: string,
  certificateId: string
): string {
  return `/certificates/${eventId}/${certificateId}.json`;
}
