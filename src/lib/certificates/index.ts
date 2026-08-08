export { buildVerifyQrDataUrl } from '@/lib/certificates/qr';
export type { VerifyResult } from '@/lib/certificates/registry';
export {
  certificateDiplomaPath,
  certificateVerifyPath,
  getAllCertificateFixtures,
  getCertificateById,
  getCertificateEventId,
  getCertificatesByYear,
  getRegistry,
  signedCredentialPublicPath,
  toCertificatePayload,
  verifyCertificateId,
} from '@/lib/certificates/registry';
export type {
  CertificateFixture,
  CertificatePayload,
  CertificateRole,
  CertificateStatus,
} from '@/lib/certificates/types';
export {
  assertCertificateFixture,
  CERTIFICATE_ROLES,
  CERTIFICATE_STATUSES,
  isCertificateFixture,
} from '@/lib/certificates/types';
