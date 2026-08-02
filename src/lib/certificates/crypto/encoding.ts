/** Decode a base64 or base64url private key into 32-byte Ed25519 secret key bytes. */
export function decodePrivateKeyBase64(value: string): Uint8Array {
  const normalized = value.trim().replace(/-/g, '+').replace(/_/g, '/');
  const bytes = Uint8Array.from(Buffer.from(normalized, 'base64'));
  if (bytes.length !== 32) {
    throw new Error(
      `CERT_SIGNING_PRIVATE_KEY must decode to 32 bytes, got ${bytes.length}`
    );
  }
  return bytes;
}

/** Encode bytes as base64url (no padding) for proof values. */
export function encodeBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64url');
}

/** Decode base64url proof value. */
export function decodeBase64Url(value: string): Uint8Array {
  return Uint8Array.from(Buffer.from(value, 'base64url'));
}

/** Build OKP JWK `x` parameter from an Ed25519 public key. */
export function publicKeyToJwkX(publicKey: Uint8Array): string {
  return encodeBase64Url(publicKey);
}
