#!/usr/bin/env tsx
/**
 * Import attendee CSV into the certificate registry (opaque IDs, no emails in output).
 *
 * Usage:
 *   pnpm run certs:import -- --csv tmp/attendees.csv --event ptd-2026
 *   pnpm run certs:import -- --help
 *
 * CSV columns: name (required), role (optional), certificate_id (optional)
 * Emails are ignored if present — never written to the registry JSON.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  findDuplicateNames,
  generateOpaqueCertificateId,
  normalizeSubjectName,
} from '@/lib/certificates/ids';
import {
  type CertificateRegistry,
  type CertificateRegistryRecord,
  parseCertificateRegistry,
} from '@/lib/certificates/registry-schema';
import { CERTIFICATE_ROLES } from '@/lib/certificates/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const DEFAULT_REGISTRY = resolve(ROOT, 'src/data/certificates/registry.json');

type CliOptions = {
  csvPath: string;
  eventId: string;
  registryPath: string;
  dryRun: boolean;
};

function printHelp(): void {
  console.log(`certs:import — build certificate registry from CSV

Options:
  --csv <path>       Input CSV file (required)
  --event <id>       Event id in registry (default: ptd-2026)
  --registry <path>  Output registry JSON (default: src/data/certificates/registry.json)
  --dry-run          Parse and validate without writing
  --help             Show this help

CSV columns: name, role (attendee|speaker|volunteer), certificate_id (optional)
Email columns are stripped and never stored.`);
}

function parseArgs(argv: string[]): CliOptions | null {
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return null;
  }

  const csvIdx = argv.indexOf('--csv');
  if (csvIdx === -1 || !argv[csvIdx + 1]) {
    console.error('Error: --csv <path> is required');
    printHelp();
    process.exit(1);
  }

  const eventIdx = argv.indexOf('--event');
  const registryIdx = argv.indexOf('--registry');

  return {
    csvPath: resolve(argv[csvIdx + 1]),
    eventId:
      eventIdx !== -1 && argv[eventIdx + 1] ? argv[eventIdx + 1] : 'ptd-2026',
    registryPath:
      registryIdx !== -1 && argv[registryIdx + 1]
        ? resolve(argv[registryIdx + 1])
        : DEFAULT_REGISTRY,
    dryRun: argv.includes('--dry-run'),
  };
}

function parseCsv(content: string): Array<Record<string, string>> {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length < 2) {
    return [];
  }
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const rows: Array<Record<string, string>> = [];
  for (const line of lines.slice(1)) {
    const cells = line.split(',').map((c) => c.trim());
    const row: Record<string, string> = {};
    for (let i = 0; i < headers.length; i += 1) {
      row[headers[i]] = cells[i] ?? '';
    }
    rows.push(row);
  }
  return rows;
}

function parseRole(
  value: string | undefined
): CertificateRegistryRecord['role'] {
  const role = (value ?? 'attendee').toLowerCase();
  if ((CERTIFICATE_ROLES as readonly string[]).includes(role)) {
    return role as CertificateRegistryRecord['role'];
  }
  return 'attendee';
}

async function loadRegistry(path: string): Promise<CertificateRegistry> {
  const raw = await readFile(path, 'utf8');
  return parseCertificateRegistry(JSON.parse(raw));
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (!options) {
    return;
  }

  const csvContent = await readFile(options.csvPath, 'utf8');
  const rows = parseCsv(csvContent);
  if (rows.length === 0) {
    console.error('No data rows found in CSV');
    process.exit(1);
  }

  const registry = await loadRegistry(options.registryPath);
  const event = registry.events.find((e) => e.id === options.eventId);
  if (!event) {
    console.error(`Event not found in registry: ${options.eventId}`);
    process.exit(1);
  }

  const names = rows.map((row) => row.name ?? '');
  const duplicates = findDuplicateNames(names);
  if (duplicates.size > 0) {
    console.warn('Warning: duplicate names detected (review manually):');
    for (const [name, count] of duplicates) {
      console.warn(`  - ${name} (${count} rows)`);
    }
  }

  const existingIds = new Set(registry.certificates.map((c) => c.id));
  const issuedAt = new Date().toISOString();
  const newRecords: CertificateRegistryRecord[] = [];

  for (const row of rows) {
    const rawName = row.name ?? '';
    if (!rawName) {
      continue;
    }
    const subjectName = normalizeSubjectName(rawName);
    let id = row.certificate_id?.trim();
    if (!id) {
      do {
        id = generateOpaqueCertificateId(event.year);
      } while (existingIds.has(id));
    }
    if (existingIds.has(id)) {
      console.warn(`Skipping duplicate certificate_id: ${id}`);
      continue;
    }
    existingIds.add(id);
    newRecords.push({
      id,
      eventId: event.id,
      subjectName,
      role: parseRole(row.role),
      issuedAt,
      status: 'valid',
    });
  }

  const updated: CertificateRegistry = {
    ...registry,
    certificates: [...registry.certificates, ...newRecords],
  };
  parseCertificateRegistry(updated);

  console.log(`Imported ${newRecords.length} certificate(s) for ${event.id}`);

  if (options.dryRun) {
    console.log('Dry run — registry not written');
    return;
  }

  await writeFile(
    options.registryPath,
    `${JSON.stringify(updated, null, 2)}\n`
  );
  console.log(`Wrote ${options.registryPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
