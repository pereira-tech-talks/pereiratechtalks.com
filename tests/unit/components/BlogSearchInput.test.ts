import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import BlogSearchInput from '@/components/blog/BlogSearchInput.svelte';

describe('BlogSearchInput', () => {
  it('renders search input with English placeholder by default', () => {
    render(BlogSearchInput, {
      props: {
        searchQuery: '',
        isSearching: false,
        resultsCount: 0,
      },
    });

    const input = screen.getByRole('searchbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search articles...');
    expect(input).toHaveAttribute('aria-label', 'Search articles...');
  });

  it('renders translated placeholder when lang is Spanish', () => {
    render(BlogSearchInput, {
      props: {
        searchQuery: '',
        isSearching: false,
        resultsCount: 0,
        lang: 'es',
      },
    });

    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('placeholder', 'Buscar artículos...');
  });

  it('calls onSearch with the typed value on input', async () => {
    const onSearch = vi.fn();
    render(BlogSearchInput, {
      props: {
        searchQuery: '',
        isSearching: false,
        resultsCount: 0,
        onSearch,
      },
    });

    const input = screen.getByRole('searchbox');
    await fireEvent.input(input, { target: { value: 'astro' } });

    expect(onSearch).toHaveBeenCalledWith('astro');
  });

  it('calls onFocus when input receives focus', async () => {
    const onFocus = vi.fn();
    render(BlogSearchInput, {
      props: {
        searchQuery: '',
        isSearching: false,
        resultsCount: 0,
        onFocus,
      },
    });

    const input = screen.getByRole('searchbox');
    await fireEvent.focus(input);

    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('shows clear button when query is present and clears on click', async () => {
    const onSearch = vi.fn();
    render(BlogSearchInput, {
      props: {
        searchQuery: 'astro',
        isSearching: false,
        resultsCount: 0,
        onSearch,
      },
    });

    const clearButton = screen.getByRole('button', { name: 'Clear' });
    expect(clearButton).toBeInTheDocument();

    await fireEvent.click(clearButton);
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('clears search when Escape key is pressed', async () => {
    const onSearch = vi.fn();
    render(BlogSearchInput, {
      props: {
        searchQuery: 'svelte',
        isSearching: false,
        resultsCount: 0,
        onSearch,
      },
    });

    const input = screen.getByRole('searchbox');
    await fireEvent.keyDown(input, { key: 'Escape' });

    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('renders results count and aria-describedby when searching', () => {
    render(BlogSearchInput, {
      props: {
        searchQuery: 'astro',
        isSearching: true,
        resultsCount: 2,
      },
    });

    expect(screen.getByText('2 results found')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveAttribute(
      'aria-describedby',
      'search-results-count'
    );
  });

  it('does not render results count when not searching', () => {
    render(BlogSearchInput, {
      props: {
        searchQuery: '',
        isSearching: false,
        resultsCount: 3,
      },
    });

    expect(screen.queryByText(/results found/)).not.toBeInTheDocument();
    expect(screen.getByRole('searchbox')).not.toHaveAttribute(
      'aria-describedby'
    );
  });
});
