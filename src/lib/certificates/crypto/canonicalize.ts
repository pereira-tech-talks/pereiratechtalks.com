/**
 * RFC 8785-inspired JSON canonicalization for deterministic signing.
 * Sorts object keys recursively; arrays preserve order.
 */

function canonicalizeValue(value: unknown): unknown {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => canonicalizeValue(item));
  }
  const record = value as Record<string, unknown>;
  const sortedKeys = Object.keys(record).sort();
  const out: Record<string, unknown> = {};
  for (const key of sortedKeys) {
    out[key] = canonicalizeValue(record[key]);
  }
  return out;
}

/** Returns a deterministic UTF-8 byte payload for signing. */
export function canonicalizeForSigning(
  document: Record<string, unknown>
): Uint8Array {
  const canonical = canonicalizeValue(document);
  const json = JSON.stringify(canonical);
  return new TextEncoder().encode(json);
}
