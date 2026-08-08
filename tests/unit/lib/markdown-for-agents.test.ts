import { describe, expect, it } from 'vitest';

import {
  serializeBlogIndexToMarkdown,
  serializePageToAgentMarkdown,
  serializePostToAgentMarkdown,
} from '@/lib/markdown-for-agents';

// ─── Mock Data ─────────────────────────────────────────

const mockPost = {
  id: 'en/2024-03-15_my-awesome-post',
  data: {
    title: 'My Awesome Post',
    description: 'A test post about Astro and Markdown.',
    pubDate: new Date('2024-03-15'),
    updatedDate: new Date('2024-04-01'),
    tags: ['tech', 'astro'],
  },
  body: '## Introduction\n\nThis is a test post.\n\n```js\nconsole.log("hello");\n```\n',
};

const mockPostNoOptionals = {
  id: 'en/2024-05-01_minimal-post',
  data: {
    title: 'Minimal Post',
    description: 'A post with no optional fields.',
    pubDate: new Date('2024-05-01'),
  },
  body: 'Just some text.',
};

const mockPostEmptyBody = {
  id: 'es/2024-06-01_empty-body',
  data: {
    title: 'Empty Body Post',
    description: 'This post has no body content.',
    pubDate: new Date('2024-06-01'),
    tags: ['personal'],
  },
  body: undefined,
};

const mockPage = {
  id: 'en/about',
  data: {
    title: 'About — Pereira Tech Talks',
    description: 'The bilingual technology community of Pereira, Colombia.',
    lastUpdated: new Date('2026-03-09'),
  },
  body: '## Who We Are\n\nWe are Pereira Tech Talks, a bilingual community of builders.',
};

const mockPageNoLastUpdated = {
  id: 'es/contact',
  data: {
    title: 'Contacto — Pereira Tech Talks',
    description: 'Conectemos y construyamos algo juntos.',
  },
  body: '## Ponte en Contacto\n\nSiempre abierto a conversaciones.',
};

// ─── serializePostToAgentMarkdown ──────────────────────

describe('serializePostToAgentMarkdown', () => {
  it('should produce correct output with all fields', () => {
    const result = serializePostToAgentMarkdown(mockPost as any, {
      slug: 'my-awesome-post',
      lang: 'en',
    });

    expect(result).toContain('# My Awesome Post');
    expect(result).toContain('> A test post about Astro and Markdown.');
    expect(result).toContain('Published: 2024-03-15');
    expect(result).toContain('Updated: 2024-04-01');
    expect(result).toContain('Language: en');
    expect(result).toContain(
      'Canonical: https://pereiratechtalks.org/en/blog/my-awesome-post'
    );
    expect(result).toContain('Tags: tech, astro');
    expect(result).toContain('---');
    expect(result).toContain('## Introduction');
    expect(result).toContain('```js');
    expect(result).toContain('console.log("hello");');
  });

  it('should format date as YYYY-MM-DD', () => {
    const result = serializePostToAgentMarkdown(mockPost as any, {
      slug: 'my-awesome-post',
      lang: 'en',
    });

    expect(result).toMatch(/Published: \d{4}-\d{2}-\d{2}/);
    expect(result).toMatch(/Updated: \d{4}-\d{2}-\d{2}/);
  });

  it('should omit updatedDate and tags when not present', () => {
    const result = serializePostToAgentMarkdown(mockPostNoOptionals as any, {
      slug: 'minimal-post',
      lang: 'en',
    });

    expect(result).not.toContain('Updated:');
    expect(result).not.toContain('Tags:');
    expect(result).toContain('Published: 2024-05-01');
  });

  it('should handle ES language with correct canonical URL', () => {
    const result = serializePostToAgentMarkdown(mockPostEmptyBody as any, {
      slug: 'empty-body',
      lang: 'es',
    });

    expect(result).toContain('Language: es');
    expect(result).toContain(
      'Canonical: https://pereiratechtalks.org/blog/empty-body'
    );
  });

  it('should handle empty/undefined body gracefully', () => {
    const result = serializePostToAgentMarkdown(mockPostEmptyBody as any, {
      slug: 'empty-body',
      lang: 'es',
    });

    expect(result).toContain('---');
    expect(result).toContain('# Empty Body Post');
    // Should not crash, should end cleanly
    expect(result.endsWith('\n')).toBe(true);
  });

  it('should preserve code blocks in body', () => {
    const result = serializePostToAgentMarkdown(mockPost as any, {
      slug: 'my-awesome-post',
      lang: 'en',
    });

    expect(result).toContain('```js\nconsole.log("hello");\n```');
  });

  it('should end with a trailing newline', () => {
    const result = serializePostToAgentMarkdown(mockPost as any, {
      slug: 'my-awesome-post',
      lang: 'en',
    });

    expect(result.endsWith('\n')).toBe(true);
  });
});

// ─── serializeBlogIndexToMarkdown ──────────────────────

describe('serializeBlogIndexToMarkdown', () => {
  const entries = [
    {
      title: 'First Post',
      slug: 'first-post',
      description: 'The first post.',
      pubDate: new Date('2024-06-01'),
      tags: ['tech'],
    },
    {
      title: 'Second Post',
      slug: 'second-post',
      description: 'The second post.',
      pubDate: new Date('2024-05-15'),
    },
  ];

  it('should produce correct index structure', () => {
    const result = serializeBlogIndexToMarkdown(entries, {
      lang: 'en',
      title: 'Pereira Tech Talks Blog',
      description: 'A technical blog.',
    });

    expect(result).toContain('# Pereira Tech Talks Blog');
    expect(result).toContain('> A technical blog.');
    expect(result).toContain('Language: en');
    expect(result).toContain('Canonical: https://pereiratechtalks.org/en/blog');
    expect(result).toContain('Total posts: 2');
    expect(result).toContain('## Posts');
  });

  it('should include post links with .md URLs', () => {
    const result = serializeBlogIndexToMarkdown(entries, {
      lang: 'en',
      title: 'Blog',
      description: 'Test.',
    });

    expect(result).toContain('[First Post](/en/blog/first-post.md)');
    expect(result).toContain('[Second Post](/en/blog/second-post.md)');
  });

  it('should use no prefix for the Spanish (default) index', () => {
    const result = serializeBlogIndexToMarkdown(entries, {
      lang: 'es',
      title: 'Blog de Pereira Tech Talks',
      description: 'Blog técnico.',
    });

    expect(result).toContain('Language: es');
    expect(result).toContain('Canonical: https://pereiratechtalks.org/blog');
    expect(result).toContain('/blog/first-post.md');
  });

  it('should handle empty entries list', () => {
    const result = serializeBlogIndexToMarkdown([], {
      lang: 'en',
      title: 'Empty Blog',
      description: 'No posts yet.',
    });

    expect(result).toContain('Total posts: 0');
    expect(result).toContain('## Posts');
  });
});

// ─── serializePageToAgentMarkdown ──────────────────────

describe('serializePageToAgentMarkdown', () => {
  it('should produce correct output with all fields', () => {
    const result = serializePageToAgentMarkdown(mockPage as any, {
      slug: 'about',
      lang: 'en',
    });

    expect(result).toContain('# About — Pereira Tech Talks');
    expect(result).toContain(
      '> The bilingual technology community of Pereira, Colombia.'
    );
    expect(result).toContain('Language: en');
    expect(result).toContain(
      'Canonical: https://pereiratechtalks.org/en/about'
    );
    expect(result).toContain('Last Updated: 2026-03-09');
    expect(result).toContain('## Who We Are');
  });

  it('should handle index slug with correct canonical URL', () => {
    const indexPage = {
      ...mockPage,
      id: 'en/index',
      data: { ...mockPage.data, title: 'Home' },
    };
    const result = serializePageToAgentMarkdown(indexPage as any, {
      slug: 'index',
      lang: 'en',
    });

    expect(result).toContain('Canonical: https://pereiratechtalks.org');
    // Should not be https://pereiratechtalks.org/en/index
    expect(result).not.toContain('/index');
  });

  it('should handle ES language', () => {
    const result = serializePageToAgentMarkdown(mockPageNoLastUpdated as any, {
      slug: 'contact',
      lang: 'es',
    });

    expect(result).toContain('Language: es');
    expect(result).toContain('Canonical: https://pereiratechtalks.org/contact');
    expect(result).not.toContain('Last Updated:');
  });

  it('should omit lastUpdated when not present', () => {
    const result = serializePageToAgentMarkdown(mockPageNoLastUpdated as any, {
      slug: 'contact',
      lang: 'es',
    });

    expect(result).not.toContain('Last Updated:');
  });
});
