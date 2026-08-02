import { describe, expect, it } from 'vitest';

import {
  findDuplicateNames,
  generateOpaqueCertificateId,
  normalizeSubjectName,
} from '@/lib/certificates/ids';

describe('opaque certificate ids', () => {
  it('generates unique opaque ids', () => {
    const ids = new Set(
      Array.from({ length: 20 }, () => generateOpaqueCertificateId(2026))
    );
    expect(ids.size).toBe(20);
    for (const id of ids) {
      expect(id).toMatch(/^ptd26_[a-z0-9]+$/);
    }
  });

  it('normalizes subject names', () => {
    expect(normalizeSubjectName('  Ana   Pérez  ')).toBe('Ana Pérez');
  });

  it('flags duplicate normalized names', () => {
    const dupes = findDuplicateNames(['Ana Pérez', 'ana pérez', 'Sam Demo']);
    expect(dupes.size).toBe(1);
    expect(dupes.get('ana pérez')).toBe(2);
  });
});
