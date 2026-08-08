import { describe, expect, it } from 'vitest';
import type { SearchablePost, SearchResult } from '@/lib/search';
import {
  createSearchIndex,
  getHighlightedField,
  highlightMatches,
  searchPosts,
} from '@/lib/search';

// ─── Test Data ─────────────────────────────────────────

const mockPosts: SearchablePost[] = [
  {
    id: '1',
    slug: 'astro-guide',
    lang: 'en',
    title: 'Complete Guide to Astro',
    description: 'Learn Astro from scratch with this comprehensive tutorial',
    tags: ['astro', 'web', 'tutorial'],
    pubDate: '2024-03-15',
  },
  {
    id: '2',
    slug: 'svelte-basics',
    lang: 'en',
    title: 'Svelte Basics',
    description: 'Getting started with Svelte framework',
    tags: ['svelte', 'frontend'],
    pubDate: '2024-03-10',
  },
  {
    id: '3',
    slug: 'typescript-tips',
    lang: 'en',
    title: 'TypeScript Tips and Tricks',
    description: 'Advanced TypeScript patterns for production apps',
    tags: ['typescript', 'tips'],
    pubDate: '2024-02-20',
  },
  {
    id: '4',
    slug: 'guia-astro',
    lang: 'es',
    title: 'Guia Completa de Astro',
    description: 'Aprende Astro desde cero',
    tags: ['astro', 'web'],
    pubDate: '2024-03-15',
  },
];

// ─── highlightMatches ──────────────────────────────────

describe('highlightMatches', () => {
  const markOpen =
    '<mark class="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">';
  const markClose = '</mark>';

  it('highlights a substring match', () => {
    const result = highlightMatches('hello world', 'hello');
    expect(result).toBe(`${markOpen}hello${markClose} world`);
  });

  it('highlights multiple occurrences of the query', () => {
    const result = highlightMatches(
      'Astro is great. Learn Astro now.',
      'Astro'
    );
    expect(result).toBe(
      `${markOpen}Astro${markClose} is great. Learn ${markOpen}Astro${markClose} now.`
    );
  });

  it('is case-insensitive', () => {
    const result = highlightMatches('Learn ASTRO framework', 'astro');
    expect(result).toContain(`${markOpen}ASTRO${markClose}`);
  });

  it('returns escaped text when query is empty', () => {
    expect(highlightMatches('hello world', '')).toBe('hello world');
  });

  it('returns escaped text when query is too short', () => {
    expect(highlightMatches('hello world', 'h')).toBe('hello world');
  });

  it('returns escaped text when query has no match in text', () => {
    expect(highlightMatches('hello world', 'xyz')).toBe('hello world');
  });

  it('escapes HTML special characters in non-matched text', () => {
    const result = highlightMatches('<script>alert("xss")</script>', 'zzz');
    expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('escapes ampersand and quotes', () => {
    const result = highlightMatches('Tom & Jerry\'s "adventure"', 'zzz');
    expect(result).toContain('&amp;');
    expect(result).toContain('&#39;');
    expect(result).toContain('&quot;');
  });

  it('escapes HTML in matched text too', () => {
    const result = highlightMatches('<b>bold</b>', 'bold');
    expect(result).toContain(`${markOpen}bold${markClose}`);
    expect(result).toContain('&lt;b&gt;');
  });

  it('handles query with regex special characters', () => {
    const result = highlightMatches('Use file.ts for TypeScript', 'file.ts');
    expect(result).toContain(`${markOpen}file.ts${markClose}`);
  });
});

// ─── getHighlightedField ───────────────────────────────

describe('getHighlightedField', () => {
  const mockResult: SearchResult = {
    item: mockPosts[0],
    score: 0.1,
    matches: [
      {
        key: 'title',
        value: 'Complete Guide to Astro',
        indices: [[18, 22]],
      },
    ],
  };

  it('returns highlighted text when query matches field content', () => {
    const result = getHighlightedField(
      mockResult,
      'title',
      'Complete Guide to Astro',
      'Astro'
    );
    expect(result).toContain('<mark');
    expect(result).toContain('Astro');
  });

  it('returns escaped original value when query is empty', () => {
    const result = getHighlightedField(
      mockResult,
      'description',
      'Some description',
      ''
    );
    expect(result).toBe('Some description');
    expect(result).not.toContain('<mark');
  });

  it('returns escaped original value when query does not match', () => {
    const result = getHighlightedField(
      mockResult,
      'title',
      'Complete Guide to Astro',
      'zzz'
    );
    expect(result).toBe('Complete Guide to Astro');
    expect(result).not.toContain('<mark');
  });

  it('escapes HTML in original value when query is empty', () => {
    const result = getHighlightedField(
      mockResult,
      'description',
      '<script>alert("xss")</script>',
      ''
    );
    expect(result).toContain('&lt;script&gt;');
    expect(result).not.toContain('<script>');
  });
});

// ─── createSearchIndex ─────────────────────────────────

describe('createSearchIndex', () => {
  it('returns posts as a search index array', () => {
    const index = createSearchIndex(mockPosts);
    expect(index).toEqual(mockPosts);
  });

  it('handles empty array', () => {
    const index = createSearchIndex([]);
    expect(index).toEqual([]);
  });

  it('created index works with searchPosts', () => {
    const index = createSearchIndex(mockPosts);
    const results = searchPosts(index, 'Astro');
    expect(results.length).toBeGreaterThan(0);
  });
});

// ─── searchPosts ───────────────────────────────────────

describe('searchPosts', () => {
  const index = createSearchIndex(mockPosts);

  it('returns matching results for a known query', () => {
    const results = searchPosts(index, 'Astro');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.title).toContain('Astro');
  });

  it('respects the limit parameter', () => {
    const results = searchPosts(index, 'Astro', 1);
    expect(results).toHaveLength(1);
  });

  it('returns empty array for no matches', () => {
    const results = searchPosts(index, 'zzzznonexistent');
    expect(results).toEqual([]);
  });

  it('returns empty array for empty query string', () => {
    expect(searchPosts(index, '')).toEqual([]);
  });

  it('returns empty array for query shorter than 2 characters', () => {
    expect(searchPosts(index, 'a')).toEqual([]);
  });

  it('returns empty array for whitespace-only query', () => {
    expect(searchPosts(index, '   ')).toEqual([]);
  });

  it('results have correct shape', () => {
    const results = searchPosts(index, 'Svelte');
    expect(results.length).toBeGreaterThan(0);

    const result = results[0];
    expect(result).toHaveProperty('item');
    expect(result).toHaveProperty('score');
    expect(typeof result.score).toBe('number');
    expect(result.item).toHaveProperty('id');
    expect(result.item).toHaveProperty('slug');
    expect(result.item).toHaveProperty('title');
  });

  it('does not return posts that lack the search term', () => {
    const results = searchPosts(index, 'TypeScript');
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      const text =
        `${r.item.title} ${r.item.description} ${r.item.tags.join(' ')}`.toLowerCase();
      expect(text).toContain('typescript');
    }
  });

  it('prioritizes title matches over description matches', () => {
    const results = searchPosts(index, 'Astro');
    expect(results.length).toBeGreaterThanOrEqual(2);
    // Posts with "Astro" in title should have score 0.0
    expect(results[0].score).toBe(0.0);
  });

  it('searches across title, description, and tags', () => {
    // Search by tag
    const tagResults = searchPosts(index, 'tutorial');
    expect(tagResults.length).toBeGreaterThan(0);

    // Search by description content
    const descResults = searchPosts(index, 'comprehensive');
    expect(descResults.length).toBeGreaterThan(0);
  });

  it('trims whitespace from query before searching', () => {
    const results = searchPosts(index, '  Astro  ');
    expect(results.length).toBeGreaterThan(0);
  });
});
