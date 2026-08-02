import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { canonicalizeForSigning } from '@/lib/certificates/crypto/canonicalize';
import {
  derivePublicKeyJwkX,
  signCredential,
} from '@/lib/certificates/crypto/sign';
import {
  buildDidDocument,
  buildUnsignedCredential,
} from '@/lib/certificates/crypto/vc';
import {
  verifyCredential,
  verifyCredentialSignature,
} from '@/lib/certificates/crypto/verify';
import {
  certificateRegistryRecordSchema,
  parseCertificateRegistry,
} from '@/lib/certificates/registry-schema';

const TEST_KEY_PATH = resolve(
  process.cwd(),
  'tests/fixtures/cert-test-signing-key.json'
);

async function loadTestPrivateKey(): Promise<string> {
  const raw = await readFile(TEST_KEY_PATH, 'utf8');
  return (JSON.parse(raw) as { privateKeyBase64: string }).privateKeyBase64;
}

describe('certificate registry schema', () => {
  it('validates registry.json', async () => {
    const raw = await readFile(
      resolve(process.cwd(), 'src/data/certificates/registry.json'),
      'utf8'
    );
    const registry = parseCertificateRegistry(JSON.parse(raw));
    expect(registry.certificates.length).toBeGreaterThanOrEqual(4);
  });

  it('rejects invalid status', () => {
    expect(() =>
      certificateRegistryRecordSchema.parse({
        id: 'ptd26_test_abcd1234',
        eventId: 'ptd-2026',
        subjectName: 'Test User',
        role: 'attendee',
        issuedAt: '2026-08-25T15:00:00.000Z',
        status: 'bogus',
      })
    ).toThrow();
  });
});

describe('sign and verify round-trip', () => {
  it('produces deterministic proofs for fixed inputs', async () => {
    const privateKeyBase64 = await loadTestPrivateKey();
    const registry = parseCertificateRegistry(
      JSON.parse(
        await readFile(
          resolve(process.cwd(), 'src/data/certificates/registry.json'),
          'utf8'
        )
      )
    );
    const record = registry.certificates[0];
    const event = registry.events[0];
    const unsigned = buildUnsignedCredential(record, event, 'en');

    const signedA = await signCredential(unsigned, {
      privateKeyBase64,
      createdAt: record.issuedAt,
    });
    const signedB = await signCredential(unsigned, {
      privateKeyBase64,
      createdAt: record.issuedAt,
    });

    expect(signedA.proof?.proofValue).toBe(signedB.proof?.proofValue);
  });

  it('verifies a signed credential against did:web', async () => {
    const privateKeyBase64 = await loadTestPrivateKey();
    const publicKeyJwkX = await derivePublicKeyJwkX(privateKeyBase64);
    const did = buildDidDocument(publicKeyJwkX);

    const registry = parseCertificateRegistry(
      JSON.parse(
        await readFile(
          resolve(process.cwd(), 'src/data/certificates/registry.json'),
          'utf8'
        )
      )
    );
    const record = registry.certificates[0];
    const event = registry.events[0];
    const signed = await signCredential(
      buildUnsignedCredential(record, event, 'en'),
      { privateKeyBase64, createdAt: record.issuedAt }
    );

    const result = await verifyCredential(signed, did);
    expect(result.signatureValid).toBe(true);
    expect(result.status).toBe('valid');
  });

  it('detects tampered proof', async () => {
    const privateKeyBase64 = await loadTestPrivateKey();
    const publicKeyJwkX = await derivePublicKeyJwkX(privateKeyBase64);
    const did = buildDidDocument(publicKeyJwkX);

    const registry = parseCertificateRegistry(
      JSON.parse(
        await readFile(
          resolve(process.cwd(), 'src/data/certificates/registry.json'),
          'utf8'
        )
      )
    );
    const record = registry.certificates[0];
    const event = registry.events[0];
    const signed = await signCredential(
      buildUnsignedCredential(record, event, 'en'),
      { privateKeyBase64, createdAt: record.issuedAt }
    );

    if (!signed.proof) {
      throw new Error('expected proof');
    }
    signed.credentialSubject.name = 'Tampered Name';

    const check = await verifyCredentialSignature(signed, did);
    expect(check.valid).toBe(false);
    expect(check.reasons).toContain('invalid_signature');
  });

  it('canonicalize is stable for key order', () => {
    const a = canonicalizeForSigning({ z: 1, a: 2, m: { b: 1, a: 2 } });
    const b = canonicalizeForSigning({ a: 2, m: { a: 2, b: 1 }, z: 1 });
    expect(Buffer.from(a).equals(Buffer.from(b))).toBe(true);
  });
});

describe('signed public artifacts', () => {
  it('has demo signed JSON for attendee fixture', async () => {
    const raw = await readFile(
      resolve(
        process.cwd(),
        'public/certificates/ptd-2026/ptd26_demo_a7k3m9qx.json'
      ),
      'utf8'
    );
    const credential = JSON.parse(raw);
    expect(credential.proof?.proofValue).toBeTruthy();
    expect(credential.credentialSubject.name).toBe('Alex Rivera Demo');
  });
});
