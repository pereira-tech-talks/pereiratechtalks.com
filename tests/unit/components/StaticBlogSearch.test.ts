import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import StaticBlogSearch from '@/components/blog/StaticBlogSearch.svelte';

const postsResult = [
  {
    id: 'en/2026-01-01_astro-post',
    slug: 'astro-post',
    lang: 'en',
    title: 'Astro Performance Guide',
    description: 'Static-first architecture tips',
    pubDate: '2026-01-01T00:00:00.000Z',
    tags: ['tech'],
    topics: ['web-development'],
    heroImage: undefined,
  },
  {
    id: 'en/2026-01-02_vue-post',
    slug: 'vue-post',
    lang: 'en',
    title: 'Vue Patterns',
    description: 'Reactivity patterns overview',
    pubDate: '2026-01-02T00:00:00.000Z',
    tags: ['tech'],
    topics: ['javascript'],
    heroImage: undefined,
  },
];

describe('StaticBlogSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('loads EN shard and filters search results', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => postsResult,
    });
    vi.stubGlobal('fetch', fetchMock);

    render(StaticBlogSearch, {
      props: {
        postsResult,
        currentTag: undefined,
        totalPages: 1,
        currentPage: 1,
        tagsResult: [],
        totalPostsAvailable: 2,
        lang: 'en',
      },
    });

    const input = screen.getByRole('searchbox');
    await fireEvent.input(input, { target: { value: 'astro' } });
    await vi.advanceTimersByTimeAsync(300);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/posts-en.json');
    });
    expect(
      screen.getByRole('link', { name: /astro performance guide/i })
    ).toBeInTheDocument();
    expect(screen.queryByText('Vue Patterns')).not.toBeInTheDocument();
  });

  it('falls back to /api/posts.json when shard is unavailable', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => postsResult });
    vi.stubGlobal('fetch', fetchMock);

    render(StaticBlogSearch, {
      props: {
        postsResult,
        currentTag: undefined,
        totalPages: 1,
        currentPage: 1,
        tagsResult: [],
        totalPostsAvailable: 2,
        lang: 'en',
      },
    });

    const input = screen.getByRole('searchbox');
    await fireEvent.input(input, { target: { value: 'astro' } });
    await vi.advanceTimersByTimeAsync(300);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/posts-en.json');
      expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/posts.json');
    });
  });
});
