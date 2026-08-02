import * as ed from '@noble/ed25519';

import { canonicalizeForSigning } from '@/lib/certificates/crypto/canonicalize';
import { PTT_VERIFICATION_METHOD_ID } from '@/lib/certificates/crypto/constants';
import { decodeBase64Url } from '@/lib/certificates/crypto/encoding';
import type {
  DidWebDocument,
  EventAttendanceCredential,
} from '@/lib/certificates/crypto/vc';
import type { CertificateStatus } from '@/lib/certificates/types';

export type CryptoVerificationResult = {
  signatureValid: boolean;
  status: CertificateStatus;
  reasons: string[];
  provider: string;
  verifiedAt: string;
  credential?: EventAttendanceCredential;
};

function resolvePublicKeyFromDid(did: DidWebDocument): Uint8Array {
  const method = did.verificationMethod.find(
    (entry) => entry.id === PTT_VERIFICATION_METHOD_ID
  );
  if (!method?.publicKeyJwk?.x) {
    throw new Error('DID document missing Ed25519 public key');
  }
  return decodeBase64Url(method.publicKeyJwk.x);
}

export async function verifyCredentialSignature(
  credential: EventAttendanceCredential,
  didDocument: DidWebDocument
): Promise<{ valid: boolean; reasons: string[] }> {
  const reasons: string[] = [];
  if (!credential.proof?.proofValue) {
    return { valid: false, reasons: ['missing_proof'] };
  }
  if (credential.proof.verificationMethod !== PTT_VERIFICATION_METHOD_ID) {
    reasons.push('wrong_verification_method');
  }

  try {
    const publicKey = resolvePublicKeyFromDid(didDocument);
    const unsigned = { ...credential };
    delete unsigned.proof;
    const message = canonicalizeForSigning(
      unsigned as unknown as Record<string, unknown>
    );
    const signature = decodeBase64Url(credential.proof.proofValue);
    const valid = await ed.verifyAsync(signature, message, publicKey);
    if (!valid) {
      reasons.push('invalid_signature');
    }
    return { valid, reasons };
  } catch {
    return { valid: false, reasons: ['verify_error', ...reasons] };
  }
}

export function resolveCredentialStatus(
  credential: EventAttendanceCredential
): CertificateStatus {
  const status = credential.credentialStatus?.status;
  if (
    status === 'valid' ||
    status === 'revoked' ||
    status === 'replaced' ||
    status === 'expired'
  ) {
    return status;
  }
  return 'unknown';
}

export async function verifyCredential(
  credential: EventAttendanceCredential,
  didDocument: DidWebDocument
): Promise<CryptoVerificationResult> {
  const verifiedAt = new Date().toISOString();
  const status = resolveCredentialStatus(credential);
  const { valid: signatureValid, reasons } = await verifyCredentialSignature(
    credential,
    didDocument
  );

  const allReasons = [...reasons];
  if (status !== 'valid') {
    allReasons.push(status);
  }

  return {
    signatureValid,
    status,
    reasons: allReasons,
    provider: didDocument.id,
    verifiedAt,
    credential,
  };
}

export async function fetchDidDocument(
  baseUrl = ''
): Promise<DidWebDocument | null> {
  try {
    const response = await fetch(`${baseUrl}/.well-known/did.json`);
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as DidWebDocument;
  } catch {
    return null;
  }
}

export async function fetchSignedCredential(
  eventId: string,
  certificateId: string,
  baseUrl = ''
): Promise<EventAttendanceCredential | null> {
  try {
    const response = await fetch(
      `${baseUrl}/certificates/${eventId}/${certificateId}.json`
    );
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as EventAttendanceCredential;
  } catch {
    return null;
  }
}
