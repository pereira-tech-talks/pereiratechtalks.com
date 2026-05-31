import { render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import BlogPagination from '@/components/blog/BlogPagination.svelte';

// ─── Basic rendering ───────────────────────────────────

describe('BlogPagination', () => {
  describe('basic rendering', () => {
    it('does not render when totalPages is 1', () => {
      const { container } = render(BlogPagination, {
        props: { currentPage: 1, totalPages: 1 },
      });
      expect(container.querySelector('nav')).toBeNull();
    });

    it('renders page numbers for a simple pagination', () => {
      render(BlogPagination, {
        props: { currentPage: 1, totalPages: 5 },
      });
      expect(screen.getByLabelText('Page 1')).toBeDefined();
      expect(screen.getByLabelText('Page 5')).toBeDefined();
    });

    it('marks current page with aria-current="page"', () => {
      render(BlogPagination, {
        props: { currentPage: 3, totalPages: 5 },
      });
      const currentPageEl = screen.getByLabelText('Page 3');
      expect(currentPageEl.getAttribute('aria-current')).toBe('page');
    });

    it('does not mark non-current pages with aria-current', () => {
      render(BlogPagination, {
        props: { currentPage: 3, totalPages: 5 },
      });
      const otherPage = screen.getByLabelText('Page 1');
      expect(otherPage.getAttribute('aria-current')).toBeNull();
    });
  });

  // ─── Ellipsis logic ────────────────────────────────

  describe('ellipsis logic', () => {
    it('shows all pages when totalPages <= 7', () => {
      render(BlogPagination, {
        props: { currentPage: 4, totalPages: 7 },
      });
      for (let i = 1; i <= 7; i++) {
        expect(screen.getByLabelText(`Page ${i}`)).toBeDefined();
      }
    });

    it('shows ellipsis for many pages', () => {
      const { container } = render(BlogPagination, {
        props: { currentPage: 10, totalPages: 20 },
      });
      const ellipses = container.querySelectorAll('[aria-hidden="true"]');
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it('always shows first and last page', () => {
      render(BlogPagination, {
        props: { currentPage: 10, totalPages: 20 },
      });
      expect(screen.getByLabelText('Page 1')).toBeDefined();
      expect(screen.getByLabelText('Page 20')).toBeDefined();
    });
  });

  // ─── Previous/Next ─────────────────────────────────

  describe('previous/next navigation', () => {
    it('does not show Previous on first page', () => {
      render(BlogPagination, {
        props: { currentPage: 1, totalPages: 5 },
      });
      expect(screen.queryByText('Previous')).toBeNull();
    });

    it('does not show Next on last page', () => {
      render(BlogPagination, {
        props: { currentPage: 5, totalPages: 5 },
      });
      expect(screen.queryByText('Next')).toBeNull();
    });

    it('shows both Previous and Next on middle pages', () => {
      render(BlogPagination, {
        props: { currentPage: 3, totalPages: 5 },
      });
      expect(screen.getByText('Previous')).toBeDefined();
      expect(screen.getByText('Next')).toBeDefined();
    });
  });

  // ─── URL generation ────────────────────────────────

  describe('URL generation', () => {
    it('generates correct blog page URLs', () => {
      render(BlogPagination, {
        props: { currentPage: 1, totalPages: 3 },
      });
      const page2Link = screen.getByLabelText('Page 2');
      expect(page2Link.getAttribute('href')).toBe('/blog/page/2/');
    });

    it('generates page 1 URL as /blog/', () => {
      render(BlogPagination, {
        props: { currentPage: 2, totalPages: 3 },
      });
      const page1Link = screen.getByLabelText('Page 1');
      expect(page1Link.getAttribute('href')).toBe('/blog/');
    });

    it('includes tag in URL when currentTag is set', () => {
      render(BlogPagination, {
        props: { currentPage: 1, totalPages: 3, currentTag: 'tech' },
      });
      const page2Link = screen.getByLabelText('Page 2');
      expect(page2Link.getAttribute('href')).toBe('/blog/tag/tech/page/2/');
    });

    it('generates Spanish URLs with /es prefix', () => {
      render(BlogPagination, {
        props: { currentPage: 1, totalPages: 3, lang: 'es' },
      });
      const page2Link = screen.getByLabelText('Page 2');
      expect(page2Link.getAttribute('href')).toBe('/es/blog/page/2/');
    });
  });

  // ─── Search mode ───────────────────────────────────

  describe('search mode', () => {
    it('uses buttons instead of links in search mode', () => {
      render(BlogPagination, {
        props: {
          currentPage: 1,
          totalPages: 3,
          isSearchMode: true,
          onPageChange: vi.fn(),
        },
      });
      const page2 = screen.getByLabelText('Page 2');
      expect(page2.tagName).toBe('BUTTON');
    });

    it('uses links (anchor tags) in non-search mode', () => {
      render(BlogPagination, {
        props: { currentPage: 1, totalPages: 3 },
      });
      const page2 = screen.getByLabelText('Page 2');
      expect(page2.tagName).toBe('A');
    });
  });
});
