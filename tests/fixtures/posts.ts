/**
 * Mock blog post data for testing.
 * Shapes match CollectionEntry<'blog'> from Astro content collections.
 */

interface MockPostData {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  heroImage?: string;
  heroLayout?: 'banner' | 'side-by-side' | 'minimal' | 'none';
  tags?: string[];
  draft?: boolean;
}

interface MockPost {
  id: string;
  data: MockPostData;
  body?: string;
}

// ─── Published Posts ────────────────────────────────────

export const publishedEnglishPost: MockPost = {
  id: 'en/2024-03-15_my-awesome-post',
  data: {
    title: 'My Awesome Post',
    description: 'A published English blog post for testing',
    pubDate: new Date('2024-03-15'),
    heroImage: '/images/blog/posts/my-awesome-post/hero.jpg',
    heroLayout: 'banner',
    tags: ['tech', 'astro'],
  },
};

export const publishedSpanishPost: MockPost = {
  id: 'es/2024-03-15_mi-post-increible',
  data: {
    title: 'Mi Post Increible',
    description: 'Un post publicado en espanol para pruebas',
    pubDate: new Date('2024-03-15'),
    heroImage: '/images/blog/posts/mi-post-increible/hero.jpg',
    heroLayout: 'banner',
    tags: ['tech', 'astro'],
  },
};

// ─── Draft Posts ────────────────────────────────────────

export const draftPost: MockPost = {
  id: 'en/2024-04-01_draft-post',
  data: {
    title: 'Draft Post',
    description: 'A draft post that should not appear in production',
    pubDate: new Date('2024-04-01'),
    tags: ['personal'],
    draft: true,
  },
};

// ─── Scheduled Posts ────────────────────────────────────

export const scheduledPost: MockPost = {
  id: 'en/2099-12-25_scheduled-post',
  data: {
    title: 'Scheduled Post',
    description: 'A scheduled post with a far future pubDate',
    pubDate: new Date('2099-12-25'),
    tags: ['tech'],
  },
};

// ─── Scheduled Posts (Future Date) ─────────────────────

export const draftScheduledPost: MockPost = {
  id: 'en/2099-06-01_draft-scheduled-post',
  data: {
    title: 'Draft and Scheduled',
    description: 'A post with a future pubDate and draft flag set',
    pubDate: new Date('2099-06-01'),
    tags: ['tech'],
    draft: true,
  },
};

// ─── Demo Posts ─────────────────────────────────────────

export const demoEnglishPost: MockPost = {
  id: 'en/_demo/2024-01-01_demo-post',
  data: {
    title: 'Demo Post',
    description: 'A demo post for showcasing blog features',
    pubDate: new Date('2024-01-01'),
    heroImage: '/images/blog/posts/demo-post/hero.jpg',
    heroLayout: 'side-by-side',
    tags: ['demo'],
  },
};

export const demoSpanishPost: MockPost = {
  id: 'es/_demo/2024-01-01_demo-post-es',
  data: {
    title: 'Post de Demo',
    description: 'Un post de demo para mostrar las funciones del blog',
    pubDate: new Date('2024-01-01'),
    tags: ['demo'],
  },
};

// ─── Edge Case Posts ────────────────────────────────────

/** Post with no optional fields */
export const minimalPost: MockPost = {
  id: 'en/2024-05-01_minimal-post',
  data: {
    title: 'Minimal Post',
    description: 'A post with only required fields',
    pubDate: new Date('2024-05-01'),
  },
};

/** Post without date prefix (backwards compatibility) */
export const postWithoutDatePrefix: MockPost = {
  id: 'en/old-post-no-date',
  data: {
    title: 'Old Post Without Date Prefix',
    description: 'Backwards compatible post without YYYY-MM-DD prefix',
    pubDate: new Date('2023-01-01'),
  },
};

/** Post with all optional fields populated */
export const fullyPopulatedPost: MockPost = {
  id: 'en/2024-06-15_full-post',
  data: {
    title: 'Fully Populated Post',
    description: 'A post with every field set',
    pubDate: new Date('2024-06-15'),
    updatedDate: new Date('2024-07-01'),
    heroImage: '/images/blog/posts/full-post/hero.jpg',
    heroLayout: 'minimal',
    tags: ['tech', 'svelte', 'astro'],
  },
};

// ─── All Posts Array ────────────────────────────────────

export const allMockPosts: MockPost[] = [
  publishedEnglishPost,
  publishedSpanishPost,
  draftPost,
  scheduledPost,
  draftScheduledPost,
  demoEnglishPost,
  demoSpanishPost,
  minimalPost,
  postWithoutDatePrefix,
  fullyPopulatedPost,
];

// ─── Sample Content for Word Count Tests ────────────────

export const sampleMarkdownContent = `
# Hello World

This is a **bold** paragraph with some _italic_ text and a [link](https://example.com).

## Code Example

\`\`\`typescript
const x = 42;
console.log(x);
\`\`\`

Here is some \`inline code\` in a sentence.

- List item one
- List item two
- List item three

> A blockquote with some text.
`;

export const emptyContent = '';

export const shortContent = 'Hello world.';

export const longContent = Array(500).fill('word').join(' ');
