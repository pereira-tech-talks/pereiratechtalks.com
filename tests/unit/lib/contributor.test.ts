import { describe, expect, it } from 'vitest';

import type { Contributor } from '@/lib/contributor';
import {
  filterActiveContributors,
  filterPastContributors,
  sortContributors,
} from '@/lib/contributor';

const makeContributor = (
  id: string,
  overrides: Partial<Contributor['data']> = {}
): Contributor =>
  ({
    id,
    collection: 'contributors',
    data: {
      name: id,
      avatar: '/avatar.png',
      roles: ['contributor'],
      role: { en: 'Contributor', es: 'Contribuidor' },
      bio: { en: 'bio', es: 'bio' },
      order: 0,
      ...overrides,
    },
  }) as Contributor;

describe('contributor helpers', () => {
  it('sorts contributors by order then name', () => {
    const contributors = sortContributors([
      makeContributor('beta', { order: 1 }),
      makeContributor('alpha', { order: 1 }),
      makeContributor('first', { order: 0 }),
    ]);

    expect(contributors.map((c) => c.id)).toEqual(['first', 'alpha', 'beta']);
  });

  it('splits current and past contributors by inactiveSince', () => {
    const contributors = [
      makeContributor('current'),
      makeContributor('past', {
        inactiveSince: new Date('2023-01-01'),
      }),
    ];

    const current = filterActiveContributors(contributors);
    const past = filterPastContributors(contributors);

    expect(current.map((c) => c.id)).toEqual(['current']);
    expect(past.map((c) => c.id)).toEqual(['past']);
  });
});
