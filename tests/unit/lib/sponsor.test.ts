import { describe, expect, it } from 'vitest';

import type { Sponsor } from '@/lib/sponsor';
import {
  filterSponsorsByStatus,
  sortSponsors,
  sortSponsorsByOrder,
} from '@/lib/sponsor';

const makeSponsor = (
  id: string,
  overrides: Partial<Sponsor['data']> = {}
): Sponsor =>
  ({
    id,
    collection: 'sponsors',
    data: {
      name: id,
      logo: { light: '/logo.png', dark: '/logo.png', alt: id },
      url: 'https://example.com',
      description: { en: 'desc', es: 'desc' },
      tier: 'gold',
      sponsoredEditions: [],
      status: 'active',
      order: 0,
      ...overrides,
    },
  }) as Sponsor;

describe('sponsor helpers', () => {
  it('sorts sponsors by tier then order (PTD path)', () => {
    const sponsors = sortSponsors([
      makeSponsor('silver', { tier: 'silver', order: 1 }),
      makeSponsor('gold', { tier: 'gold', order: 5 }),
      makeSponsor('gold-first', { tier: 'gold', order: 0 }),
    ]);

    expect(sponsors.map((s) => s.id)).toEqual(['gold-first', 'gold', 'silver']);
  });

  it('sorts community catalog by order then name', () => {
    const sponsors = sortSponsorsByOrder([
      makeSponsor('zeta', { order: 2, name: 'Zeta', tier: 'diamond' }),
      makeSponsor('alpha', { order: 1, name: 'Alpha', tier: 'bronze' }),
      makeSponsor('beta', { order: 1, name: 'Beta', tier: 'diamond' }),
    ]);

    expect(sponsors.map((s) => s.id)).toEqual(['alpha', 'beta', 'zeta']);
  });

  it('filters sponsors by status without overlap', () => {
    const sponsors = [
      makeSponsor('active-one', { status: 'active' }),
      makeSponsor('past-one', { status: 'past' }),
    ];

    const active = filterSponsorsByStatus(sponsors, 'active');
    const past = filterSponsorsByStatus(sponsors, 'past');

    expect(active.map((s) => s.id)).toEqual(['active-one']);
    expect(past.map((s) => s.id)).toEqual(['past-one']);
  });
});
