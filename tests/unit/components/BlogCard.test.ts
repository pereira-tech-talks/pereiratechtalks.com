import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import BlogCard from '@/components/blog/BlogCard.svelte';

import {
  minimalPost,
  publishedEnglishPost,
  publishedSpanishPost,
} from '../../fixtures/posts';

// ─── Basic rendering ───────────────────────────────────

describe('BlogCard', () => {
  describe('basic rendering', () => {
    it('renders post title', () => {
      render(BlogCard, {
        props: { post: publishedEnglishPost as never },
      });
      expect(screen.getByText('My Awesome Post')).toBeDefined();
    });

    it('renders post description', () => {
      render(BlogCard, {
        props: { post: publishedEnglishPost as never },
      });
      expect(
        screen.getByText('A published English blog post for testing')
      ).toBeDefined();
    });

    it('generates correct link URL for English post', () => {
      render(BlogCard, {
        props: { post: publishedEnglishPost as never, lang: 'en' },
      });
      const link = screen.getByLabelText('My Awesome Post');
      expect(link?.getAttribute('href')).toBe('/blog/my-awesome-post/');
    });

    it('generates correct link URL for Spanish post', () => {
      render(BlogCard, {
        props: { post: publishedSpanishPost as never, lang: 'es' },
      });
      const link = screen.getByLabelText('Mi Post Increible');
      expect(link?.getAttribute('href')).toBe('/es/blog/mi-post-increible/');
    });

    it('renders the post date', () => {
      const { container } = render(BlogCard, {
        props: { post: publishedEnglishPost as never },
      });
      const timeEl = container.querySelector('time');
      expect(timeEl).toBeDefined();
      expect(timeEl?.textContent).toBeTruthy();
    });
  });

  // ─── Hero image ────────────────────────────────────

  describe('hero image', () => {
    it('renders hero image when heroImage is provided', () => {
      const { container } = render(BlogCard, {
        props: { post: publishedEnglishPost as never },
      });
      const img = container.querySelector('img');
      expect(img).toBeDefined();
      expect(img?.getAttribute('alt')).toBe('');
      expect(img?.getAttribute('src')).toBe(
        '/images/blog/posts/my-awesome-post/hero.jpg'
      );
    });

    it('does not render img element when heroImage is not provided', () => {
      const { container } = render(BlogCard, {
        props: { post: minimalPost as never },
      });
      expect(container.querySelector('img')).toBeNull();
    });
  });

  // ─── Tags ──────────────────────────────────────────

  describe('tags', () => {
    it('renders tag links when tags are provided', () => {
      render(BlogCard, {
        props: { post: publishedEnglishPost as never },
      });
      // Tags are rendered as links with # prefix; translation may capitalize.
      const tagLinks = screen.getAllByText(/#(tech|astro)/i);
      expect(tagLinks.length).toBeGreaterThan(0);
    });

    it('does not render tag elements when no tags', () => {
      const { container } = render(BlogCard, {
        props: { post: minimalPost as never },
      });
      // Tag links have href containing /blog/tag/
      const tagLinks = container.querySelectorAll('a[href*="/blog/tag/"]');
      expect(tagLinks).toHaveLength(0);
    });
  });
});
