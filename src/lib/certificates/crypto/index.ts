export { canonicalizeForSigning } from '@/lib/certificates/crypto/canonicalize';
export {
  CRYPTO_SUITE,
  EVENT_ATTENDANCE_CONTEXT,
  PROOF_TYPE,
  PTT_DID_DOCUMENT_PATH,
  PTT_ISSUER_DID,
  PTT_VERIFICATION_METHOD_ID,
  VC_CONTEXT,
} from '@/lib/certificates/crypto/constants';
export {
  decodeBase64Url,
  decodePrivateKeyBase64,
  encodeBase64Url,
  publicKeyToJwkX,
} from '@/lib/certificates/crypto/encoding';
export type { SignCredentialOptions } from '@/lib/certificates/crypto/sign';
export {
  derivePublicKeyJwkX,
  signCredential,
} from '@/lib/certificates/crypto/sign';
export type {
  DataIntegrityProof,
  DidWebDocument,
  EventAttendanceCredential,
} from '@/lib/certificates/crypto/vc';
export {
  buildDidDocument,
  buildUnsignedCredential,
  credentialArtifactUrl,
  credentialSubjectId,
} from '@/lib/certificates/crypto/vc';
export type { CryptoVerificationResult } from '@/lib/certificates/crypto/verify';
export {
  fetchDidDocument,
  fetchSignedCredential,
  resolveCredentialStatus,
  verifyCredential,
  verifyCredentialSignature,
} from '@/lib/certificates/crypto/verify';
