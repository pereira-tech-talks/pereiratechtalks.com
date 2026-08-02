import * as ed from '@noble/ed25519';

import { canonicalizeForSigning } from '@/lib/certificates/crypto/canonicalize';
import {
  CRYPTO_SUITE,
  PROOF_TYPE,
  PTT_VERIFICATION_METHOD_ID,
} from '@/lib/certificates/crypto/constants';
import {
  decodePrivateKeyBase64,
  encodeBase64Url,
} from '@/lib/certificates/crypto/encoding';
import type {
  DataIntegrityProof,
  EventAttendanceCredential,
} from '@/lib/certificates/crypto/vc';

export type SignCredentialOptions = {
  privateKeyBase64: string;
  createdAt?: string;
};

/** Node/build-only signing. Never import this module from client bundles. */
export async function signCredential(
  credential: EventAttendanceCredential,
  options: SignCredentialOptions
): Promise<EventAttendanceCredential> {
  const secretKey = decodePrivateKeyBase64(options.privateKeyBase64);
  const created = options.createdAt ?? new Date().toISOString();
  const unsigned = { ...credential };
  delete unsigned.proof;

  const message = canonicalizeForSigning(
    unsigned as unknown as Record<string, unknown>
  );
  const signature = await ed.signAsync(message, secretKey);

  const proof: DataIntegrityProof = {
    type: PROOF_TYPE,
    cryptosuite: CRYPTO_SUITE,
    created,
    verificationMethod: PTT_VERIFICATION_METHOD_ID,
    proofPurpose: 'assertionMethod',
    proofValue: encodeBase64Url(signature),
  };

  return { ...unsigned, proof };
}

export async function derivePublicKeyJwkX(
  privateKeyBase64: string
): Promise<string> {
  const secretKey = decodePrivateKeyBase64(privateKeyBase64);
  const publicKey = await ed.getPublicKeyAsync(secretKey);
  return encodeBase64Url(publicKey);
}
