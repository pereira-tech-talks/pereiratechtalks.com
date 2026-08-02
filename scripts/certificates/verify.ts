#!/usr/bin/env tsx
/**
 * Verify signed credential JSON-LD artifacts against did:web public key.
 *
 * Usage:
 *   pnpm run certs:verify
 *   pnpm run certs:verify -- --dir public/certificates/ptd-2026
 *   pnpm run certs:verify -- --help
 */

import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { derivePublicKeyJwkX } from '@/lib/certificates/crypto/sign';
import type { EventAttendanceCredential } from '@/lib/certificates/crypto/vc';
import { buildDidDocument } from '@/lib/certificates/crypto/vc';
import { verifyCredential } from '@/lib/certificates/crypto/verify';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const DEFAULT_DIR = resolve(ROOT, 'public/certificates');
const DID_PATH = resolve(ROOT, 'public/.well-known/did.json');
const DEMO_KEY_PATH = resolve(
  ROOT,
  'tests/fixtures/cert-test-signing-key.json'
);

function printHelp(): void {
  console.log(`certs:verify — verify signed credential JSON-LD artifacts

Options:
  --dir <path>   Directory to scan (default: public/certificates)
  --demo         Rebuild DID from demo test key instead of reading did.json
  --help         Show this help

Exits 1 if any credential fails signature or status checks.`);
}

async function loadDidDocument(useDemo: boolean) {
  if (useDemo) {
    const raw = await readFile(DEMO_KEY_PATH, 'utf8');
    const parsed = JSON.parse(raw) as { privateKeyBase64: string };
    const publicKeyJwkX = await derivePublicKeyJwkX(parsed.privateKeyBase64);
    return buildDidDocument(publicKeyJwkX);
  }
  return JSON.parse(await readFile(DID_PATH, 'utf8'));
}

async function collectJsonFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectJsonFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return;
  }

  const dirIdx = argv.indexOf('--dir');
  const targetDir =
    dirIdx !== -1 && argv[dirIdx + 1] ? resolve(argv[dirIdx + 1]) : DEFAULT_DIR;
  const useDemo = argv.includes('--demo');

  const didDocument = await loadDidDocument(useDemo);
  const files = await collectJsonFiles(targetDir);
  if (files.length === 0) {
    console.warn(`No JSON files found under ${targetDir}`);
    process.exit(0);
  }

  let failures = 0;
  for (const file of files) {
    const credential = JSON.parse(
      await readFile(file, 'utf8')
    ) as EventAttendanceCredential;
    const result = await verifyCredential(credential, didDocument);
    const ok = result.signatureValid && result.status === 'valid';
    const status = ok ? 'OK' : 'FAIL';
    console.log(
      `${status} ${file} — sig=${result.signatureValid} status=${result.status}`
    );
    if (!ok && result.status !== 'revoked') {
      failures += 1;
    }
    if (result.status === 'revoked' && result.signatureValid) {
      console.log(`  (revoked credential — signature OK, lifecycle invalid)`);
    }
  }

  if (failures > 0) {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
