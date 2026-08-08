import { describe, expect, it } from 'vitest';

import type { Community } from '@/lib/communities';
import { filterActiveCommunities, sortCommunities } from '@/lib/communities';

const makeCommunity = (
  id: string,
  overrides: Partial<Community['data']> = {}
): Community =>
  ({
    id,
    collection: 'communities',
    data: {
      name: id,
      logo: { src: '/logo.png', alt: id },
      url: 'https://example.com',
      description: { en: 'desc', es: 'desc' },
      status: 'active',
      order: 0,
      ...overrides,
    },
  }) as Community;

describe('communities helpers', () => {
  it('sorts communities by order then name', () => {
    const communities = sortCommunities([
      makeCommunity('beta', { order: 1 }),
      makeCommunity('alpha', { order: 1 }),
      makeCommunity('first', { order: 0 }),
    ]);

    expect(communities.map((c) => c.id)).toEqual(['first', 'alpha', 'beta']);
  });

  it('returns only active communities', () => {
    const communities = [
      makeCommunity('active', { status: 'active' }),
      makeCommunity('past', { status: 'past' }),
    ];

    const active = filterActiveCommunities(communities);
    expect(active.map((c) => c.id)).toEqual(['active']);
    expect(active.every((c) => c.data.url.startsWith('http'))).toBe(true);
  });
});
