import { randomBytes } from 'node:crypto';

const OPAQUE_PREFIX = 'ptd';

/** Generate an opaque certificate id: `{prefix}{year}_{random}` */
export function generateOpaqueCertificateId(
  eventYear: number,
  prefix = OPAQUE_PREFIX
): string {
  const random = randomBytes(6)
    .toString('base64url')
    .replace(/[^a-z0-9]/gi, '');
  const suffix = random.slice(0, 8).toLowerCase();
  return `${prefix}${String(eventYear).slice(-2)}_${suffix}`;
}

/** Normalize attendee display names (trim, collapse whitespace, NFC). */
export function normalizeSubjectName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').normalize('NFC');
}

/** Detect duplicate normalized names in a batch (returns normalized → count). */
export function findDuplicateNames(names: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const raw of names) {
    const normalized = normalizeSubjectName(raw).toLowerCase();
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }
  const duplicates = new Map<string, number>();
  for (const [name, count] of counts) {
    if (count > 1) {
      duplicates.set(name, count);
    }
  }
  return duplicates;
}
