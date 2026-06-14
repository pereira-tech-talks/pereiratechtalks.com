export type CertificationPayload = {
  id: string;
  type: 'EventAttendanceCertificate';
  issuer: { name: string; id: string };
  subject: { name: string };
  event: { name: string; date: string; location?: string };
  issuedAt: string;
  metadata?: Record<string, unknown>;
};

export type CertificationStatus = 'valid' | 'revoked' | 'replaced' | 'expired' | 'invalid';

export type VerificationResult = {
  valid: boolean;
  status: CertificationStatus;
  reasons: string[];
  payload?: CertificationPayload;
  provider: string;
  verifiedAt: string;
};
