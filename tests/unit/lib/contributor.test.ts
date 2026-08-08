import { describe, expect, it } from 'vitest';

import type { Contributor } from '@/lib/contributor';
import {
  filterActiveContributors,
  filterCurrentTeamOrganizers,
  filterPastContributors,
  filterPastTeamMembers,
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

  it('filterCurrentTeamOrganizers keeps active organizers only', () => {
    const contributors = [
      makeContributor('sergio', {
        roles: ['organizer'],
        order: 0,
        name: 'Sergio',
      }),
      makeContributor('mentor-only', {
        roles: ['mentor'],
        order: 1,
        name: 'Mentor',
      }),
      makeContributor('past-org', {
        roles: ['alumni', 'organizer'],
        inactiveSince: new Date('2025-12-31'),
        order: 2,
        name: 'Past',
      }),
      makeContributor('founder-compat', {
        roles: ['founding-organizer'],
        order: 3,
        name: 'Legacy',
      }),
    ];

    expect(filterCurrentTeamOrganizers(contributors).map((c) => c.id)).toEqual([
      'sergio',
      'founder-compat',
    ]);
  });

  it('filterPastTeamMembers returns everyone with inactiveSince sorted', () => {
    const contributors = [
      makeContributor('b', {
        inactiveSince: new Date('2025-01-01'),
        order: 2,
        name: 'B',
      }),
      makeContributor('a', {
        inactiveSince: new Date('2025-01-01'),
        order: 1,
        name: 'A',
      }),
      makeContributor('active', { order: 0, name: 'Active' }),
    ];

    expect(filterPastTeamMembers(contributors).map((c) => c.id)).toEqual([
      'a',
      'b',
    ]);
  });
});
