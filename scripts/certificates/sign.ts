#!/usr/bin/env tsx
/**
 * Sign certificate registry records into public JSON-LD artifacts.
 *
 * Usage:
 *   CERT_SIGNING_PRIVATE_KEY=<base64> pnpm run certs:sign
 *   pnpm run certs:sign -- --demo   # uses tests/fixtures cert-test-signing-key.json
 *   pnpm run certs:sign -- --help
 *
 * Writes: public/certificates/{eventId}/{certificateId}.json
 * Never logs private key material.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  derivePublicKeyJwkX,
  signCredential,
} from '@/lib/certificates/crypto/sign';
import {
  buildDidDocument,
  buildUnsignedCredential,
} from '@/lib/certificates/crypto/vc';
import {
  type CertificateRegistry,
  parseCertificateRegistry,
} from '@/lib/certificates/registry-schema';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const DEFAULT_REGISTRY = resolve(ROOT, 'src/data/certificates/registry.json');
const PUBLIC_CERTS = resolve(ROOT, 'public/certificates');
const DID_PATH = resolve(ROOT, 'public/.well-known/did.json');
const DEMO_KEY_PATH = resolve(
  ROOT,
  'tests/fixtures/cert-test-signing-key.json'
);

type CliOptions = {
  registryPath: string;
  eventId: string | null;
  useDemoKey: boolean;
  syncDid: boolean;
};

function printHelp(): void {
  console.log(`certs:sign — sign registry records into public VC JSON-LD files

Options:
  --registry <path>  Registry JSON (default: src/data/certificates/registry.json)
  --event <id>       Sign only one event (default: all events in registry)
  --demo             Use tests/fixtures cert-test-signing-key.json (dev only)
  --no-sync-did      Skip updating public/.well-known/did.json from public key
  --help             Show this help

Requires CERT_SIGNING_PRIVATE_KEY (base64, 32 bytes) unless --demo.`);
}

function parseArgs(argv: string[]): CliOptions | null {
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return null;
  }

  const registryIdx = argv.indexOf('--registry');
  const eventIdx = argv.indexOf('--event');

  return {
    registryPath:
      registryIdx !== -1 && argv[registryIdx + 1]
        ? resolve(argv[registryIdx + 1])
        : DEFAULT_REGISTRY,
    eventId: eventIdx !== -1 && argv[eventIdx + 1] ? argv[eventIdx + 1] : null,
    useDemoKey: argv.includes('--demo'),
    syncDid: !argv.includes('--no-sync-did'),
  };
}

async function resolvePrivateKey(useDemo: boolean): Promise<string> {
  if (useDemo) {
    const raw = await readFile(DEMO_KEY_PATH, 'utf8');
    const parsed = JSON.parse(raw) as { privateKeyBase64: string };
    return parsed.privateKeyBase64;
  }
  const fromEnv = process.env.CERT_SIGNING_PRIVATE_KEY?.trim();
  if (!fromEnv) {
    console.warn(
      'certs:sign skipped — CERT_SIGNING_PRIVATE_KEY not set (use --demo for local dev)'
    );
    process.exit(0);
  }
  return fromEnv;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (!options) {
    return;
  }

  const privateKeyBase64 = await resolvePrivateKey(options.useDemoKey);
  const registry: CertificateRegistry = parseCertificateRegistry(
    JSON.parse(await readFile(options.registryPath, 'utf8'))
  );

  if (options.syncDid) {
    const publicKeyJwkX = await derivePublicKeyJwkX(privateKeyBase64);
    const did = buildDidDocument(publicKeyJwkX);
    await mkdir(dirname(DID_PATH), { recursive: true });
    await writeFile(DID_PATH, `${JSON.stringify(did, null, 2)}\n`);
    console.log('Updated public/.well-known/did.json');
  }

  const eventsById = new Map(registry.events.map((event) => [event.id, event]));
  let signed = 0;

  for (const record of registry.certificates) {
    if (options.eventId && record.eventId !== options.eventId) {
      continue;
    }
    const event = eventsById.get(record.eventId);
    if (!event) {
      console.warn(`Skipping ${record.id}: unknown event ${record.eventId}`);
      continue;
    }

    const unsigned = buildUnsignedCredential(record, event, 'en');
    const signedCredential = await signCredential(unsigned, {
      privateKeyBase64,
      createdAt: record.issuedAt,
    });

    const outDir = resolve(PUBLIC_CERTS, record.eventId);
    await mkdir(outDir, { recursive: true });
    const outPath = resolve(outDir, `${record.id}.json`);
    await writeFile(outPath, `${JSON.stringify(signedCredential, null, 2)}\n`);
    signed += 1;
  }

  console.log(
    `Signed ${signed} credential artifact(s) under public/certificates/`
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
