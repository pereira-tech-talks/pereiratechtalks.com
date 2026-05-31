import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import SearchResults from '@/components/blog/SearchResults.svelte';

const postA = {
  id: 'en/2026-01-01_alpha-post',
  slug: 'alpha-post',
  title: 'Alpha Post About Astro',
  description: 'First post description',
  pubDate: '2026-01-01T00:00:00.000Z',
  tags: ['tech'],
  topics: [],
  heroImage: undefined,
};

const postB = {
  id: 'en/2026-01-02_beta-post',
  slug: 'beta-post',
  title: 'Beta Post About Svelte',
  description: 'Second post description',
  pubDate: '2026-01-02T00:00:00.000Z',
  tags: ['tech'],
  topics: [],
  heroImage: undefined,
};

const postC = {
  id: 'en/2026-01-03_gamma-post',
  slug: 'gamma-post',
  title: 'Gamma Post About PreTeXt',
  description: 'Third post description',
  pubDate: '2026-01-03T00:00:00.000Z',
  tags: ['tech'],
  topics: [],
  heroImage: undefined,
};

describe('SearchResults', () => {
  it('renders correct links for each post', () => {
    render(SearchResults, {
      props: {
        filteredPosts: [postA, postB, postC],
        searchQuery: '',
        lang: 'en',
        searchResultsWithMatches: [],
        topicTagNames: [],
      },
    });

    const linkA = screen.getByLabelText('Alpha Post About Astro');
    const linkB = screen.getByLabelText('Beta Post About Svelte');
    const linkC = screen.getByLabelText('Gamma Post About PreTeXt');

    expect(linkA.getAttribute('href')).toBe('/blog/alpha-post/');
    expect(linkB.getAttribute('href')).toBe('/blog/beta-post/');
    expect(linkC.getAttribute('href')).toBe('/blog/gamma-post/');
  });

  it('updates links correctly when filtered posts change', async () => {
    const { rerender } = render(SearchResults, {
      props: {
        filteredPosts: [postA, postB, postC],
        searchQuery: '',
        lang: 'en',
        searchResultsWithMatches: [],
        topicTagNames: [],
      },
    });

    // Simulate search filtering: only postB remains
    await rerender({
      filteredPosts: [postB],
      searchQuery: 'svelte',
      lang: 'en',
      searchResultsWithMatches: [],
      topicTagNames: [],
    });

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(1);

    const link = screen.getByLabelText('Beta Post About Svelte');
    expect(link.getAttribute('href')).toBe('/blog/beta-post/');
  });

  it('keeps href in sync with card content after reordering', async () => {
    const { rerender } = render(SearchResults, {
      props: {
        filteredPosts: [postA, postB, postC],
        searchQuery: '',
        lang: 'en',
        searchResultsWithMatches: [],
        topicTagNames: [],
      },
    });

    // Reorder: C first, then A (simulates search relevance reranking)
    await rerender({
      filteredPosts: [postC, postA],
      searchQuery: 'post',
      lang: 'en',
      searchResultsWithMatches: [],
      topicTagNames: [],
    });

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(2);

    // First card should link to gamma-post, not alpha-post
    const firstCardLink = cards[0].querySelector('a');
    expect(firstCardLink?.getAttribute('href')).toBe('/blog/gamma-post/');
    expect(firstCardLink?.getAttribute('aria-label')).toBe(
      'Gamma Post About PreTeXt'
    );

    // Second card should link to alpha-post
    const secondCardLink = cards[1].querySelector('a');
    expect(secondCardLink?.getAttribute('href')).toBe('/blog/alpha-post/');
    expect(secondCardLink?.getAttribute('aria-label')).toBe(
      'Alpha Post About Astro'
    );
  });

  it('shows empty state when no posts match', () => {
    render(SearchResults, {
      props: {
        filteredPosts: [],
        searchQuery: 'nonexistent',
        lang: 'en',
        searchResultsWithMatches: [],
        topicTagNames: [],
      },
    });

    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });
});
