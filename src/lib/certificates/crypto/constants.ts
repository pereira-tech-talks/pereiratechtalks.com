/** Issuer DID for Pereira Tech Talks certificate signing. */
export const PTT_ISSUER_DID = 'did:web:pereiratechtalks.org';

/** Verification method fragment on the DID document. */
export const PTT_VERIFICATION_METHOD_ID = `${PTT_ISSUER_DID}#key-1`;

/** Default path to the public DID document (served statically). */
export const PTT_DID_DOCUMENT_PATH = '/.well-known/did.json';

/** JSON-LD context for event attendance credentials. */
export const EVENT_ATTENDANCE_CONTEXT =
  'https://pereiratechtalks.org/schemas/event-attendance/v1.jsonld';

/** W3C Verifiable Credentials 2.0 context. */
export const VC_CONTEXT = 'https://www.w3.org/ns/credentials/v2';

/** Data Integrity proof type used for Ed25519 signing. */
export const PROOF_TYPE = 'DataIntegrityProof';

/** Cryptosuite identifier for Ed25519 (eddsa-2022). */
export const CRYPTO_SUITE = 'eddsa-2022';
