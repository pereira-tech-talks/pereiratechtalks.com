import {
  CRYPTO_SUITE,
  EVENT_ATTENDANCE_CONTEXT,
  PROOF_TYPE,
  PTT_ISSUER_DID,
  PTT_VERIFICATION_METHOD_ID,
  VC_CONTEXT,
} from '@/lib/certificates/crypto/constants';
import type {
  CertificateRegistryEvent,
  CertificateRegistryRecord,
} from '@/lib/certificates/registry-schema';
import type { Language } from '@/lib/i18n';

export type EventAttendanceCredential = {
  '@context': string[];
  id: string;
  type: ['VerifiableCredential', 'EventAttendanceCredential'];
  issuer: string;
  validFrom: string;
  credentialSubject: {
    id: string;
    name: string;
    role: string;
    event: {
      name: string;
      startDate: string;
      location?: string;
    };
  };
  credentialStatus: {
    type: 'CertificateStatus';
    status: string;
    replacedBy?: string;
  };
  proof?: DataIntegrityProof;
};

export type DataIntegrityProof = {
  type: typeof PROOF_TYPE;
  cryptosuite: typeof CRYPTO_SUITE;
  created: string;
  verificationMethod: string;
  proofPurpose: 'assertionMethod';
  proofValue: string;
};

export type DidWebDocument = {
  '@context': string | string[];
  id: string;
  verificationMethod: Array<{
    id: string;
    type: 'Ed25519VerificationKey2020';
    controller: string;
    publicKeyJwk: {
      kty: 'OKP';
      crv: 'Ed25519';
      x: string;
    };
  }>;
  authentication: string[];
  assertionMethod: string[];
};

export function credentialArtifactUrl(
  eventId: string,
  certificateId: string
): string {
  return `https://pereiratechtalks.org/certificates/${eventId}/${certificateId}.json`;
}

export function credentialSubjectId(
  eventId: string,
  certificateId: string
): string {
  return `https://pereiratechtalks.org/certificates/${eventId}/${certificateId}`;
}

export function buildUnsignedCredential(
  record: CertificateRegistryRecord,
  event: CertificateRegistryEvent,
  lang: Language = 'en'
): EventAttendanceCredential {
  const artifactUrl = credentialArtifactUrl(event.id, record.id);
  return {
    '@context': [VC_CONTEXT, EVENT_ATTENDANCE_CONTEXT],
    id: artifactUrl,
    type: ['VerifiableCredential', 'EventAttendanceCredential'],
    issuer: PTT_ISSUER_DID,
    validFrom: record.issuedAt,
    credentialSubject: {
      id: credentialSubjectId(event.id, record.id),
      name: record.subjectName,
      role: record.role,
      event: {
        name: event.name[lang],
        startDate: event.date,
        location: event.location[lang],
      },
    },
    credentialStatus: {
      type: 'CertificateStatus',
      status: record.status,
      ...(record.replacedBy ? { replacedBy: record.replacedBy } : {}),
    },
  };
}

export function buildDidDocument(publicKeyJwkX: string): DidWebDocument {
  return {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: PTT_ISSUER_DID,
    verificationMethod: [
      {
        id: PTT_VERIFICATION_METHOD_ID,
        type: 'Ed25519VerificationKey2020',
        controller: PTT_ISSUER_DID,
        publicKeyJwk: {
          kty: 'OKP',
          crv: 'Ed25519',
          x: publicKeyJwkX,
        },
      },
    ],
    authentication: [PTT_VERIFICATION_METHOD_ID],
    assertionMethod: [PTT_VERIFICATION_METHOD_ID],
  };
}
