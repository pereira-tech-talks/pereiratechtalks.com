/** Certificate role variants used on diplomas and fixtures. */
export const CERTIFICATE_ROLES = ['attendee', 'speaker', 'volunteer'] as const;

/** Verification / lifecycle status — aligned with crypto plan handoff. */
export const CERTIFICATE_STATUSES = [
  'valid',
  'revoked',
  'replaced',
  'expired',
  'unknown',
] as const;

export type CertificateRole = (typeof CERTIFICATE_ROLES)[number];
export type CertificateStatus = (typeof CERTIFICATE_STATUSES)[number];

export type LocalizedString = {
  en: string;
  es: string;
};

export type CertificateFixture = {
  id: string;
  eventYear: number;
  eventSlug: string;
  subjectName: string;
  role: CertificateRole;
  issuedAt: string;
  status: CertificateStatus;
  eventName: LocalizedString;
  eventDate: string; // YYYY-MM-DD
  location: LocalizedString;
  issuerName: LocalizedString;
};

export type CertificatePayload = {
  id: string;
  type: 'EventAttendanceCertificate';
  issuer: { name: string; id: string };
  subject: { name: string; role: CertificateRole };
  event: {
    name: string;
    date: string;
    location?: string;
    year: number;
  };
  issuedAt: string;
  status: CertificateStatus;
};

const OPAQUE_ID = /^[a-z0-9_]+$/i;

export function assertCertificateFixture(
  value: unknown
): asserts value is CertificateFixture {
  if (!value || typeof value !== 'object') {
    throw new Error('Certificate fixture must be an object');
  }
  const f = value as Record<string, unknown>;
  if (typeof f.id !== 'string' || f.id.length < 8 || !OPAQUE_ID.test(f.id)) {
    throw new Error(`Invalid opaque certificate id: ${String(f.id)}`);
  }
  if (typeof f.eventYear !== 'number' || f.eventYear < 2017) {
    throw new Error('Invalid eventYear');
  }
  if (typeof f.subjectName !== 'string' || f.subjectName.length < 2) {
    throw new Error('Invalid subjectName');
  }
  if (
    typeof f.role !== 'string' ||
    !(CERTIFICATE_ROLES as readonly string[]).includes(f.role)
  ) {
    throw new Error(`Invalid role: ${String(f.role)}`);
  }
  if (
    typeof f.status !== 'string' ||
    !(CERTIFICATE_STATUSES as readonly string[]).includes(f.status)
  ) {
    throw new Error(`Invalid status: ${String(f.status)}`);
  }
  if (typeof f.issuedAt !== 'string' || Number.isNaN(Date.parse(f.issuedAt))) {
    throw new Error('Invalid issuedAt');
  }
  for (const key of ['eventName', 'location', 'issuerName'] as const) {
    const loc = f[key] as LocalizedString | undefined;
    if (!loc?.en || !loc?.es) {
      throw new Error(`Missing localized field: ${key}`);
    }
  }
}

export function isCertificateFixture(
  value: unknown
): value is CertificateFixture {
  try {
    assertCertificateFixture(value);
    return true;
  } catch {
    return false;
  }
}
