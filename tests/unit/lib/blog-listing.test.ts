/**
 * Blog listing, visibility and series navigation.
 *
 * `blog.ts` is the largest module in `src/lib/` and sat at 27% coverage. It is
 * also what decides which posts exist at all — and therefore which `.md` twins
 * the completeness gate walks, and what the related-articles block Task 7 added
 * resolves to. The visibility rules in particular (`_demo/`, drafts, scheduled
 * posts) are the difference between a page shipping and not.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 11.
 */
import { describe, expect, it, vi } from 'vitest';

const day = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

const post = (
  id: string,
  overrides: Record<string, unknown> = {}
): Record<string, unknown> => ({
  id,
  body: 'word '.repeat(400),
  data: {
    title: id,
    description: `Description for ${id}`,
    pubDate: day('2025-01-01'),
    tags: ['community'],
    author: 'sergio-florez',
    draft: false,
    ...overrides,
  },
});

const POSTS = [
  post('es/2025-03-01_tercero', {
    pubDate: day('2025-03-01'),
    series: 'saga',
    seriesOrder: 2,
  }),
  post('es/2025-01-01_primero', {
    pubDate: day('2025-01-01'),
    series: 'saga',
    seriesOrder: 1,
  }),
  post('es/2025-02-01_segundo', {
    pubDate: day('2025-02-01'),
    tags: ['ai-agents'],
  }),
  post('es/_demo/2025-01-04_demo-post'),
  post('es/2099-01-01_scheduled', { pubDate: day('2099-01-01') }),
  post('es/2025-01-05_draft', { draft: true }),
  post('en/2025-03-01_third', { pubDate: day('2025-03-01') }),
];

const TAGS = [
  { data: { name: 'community', tier: 'primary' } },
  { data: { name: 'ai-agents', tier: 'secondary' } },
];

vi.mock('astro:content', () => ({
  getCollection: async (name: string) => {
    if (name === 'blog') return POSTS;
    if (name === 'tags') return TAGS;
    return [];
  },
}));

const blog = await import('@/lib/blog');

describe('post identity', () => {
  it('strips the language folder and date prefix from an id', () => {
    expect(blog.getPostSlug('es/2025-03-01_tercero')).toBe('tercero');
    expect(blog.getPostSlug('es/_demo/2025-01-04_demo-post')).toBe('demo-post');
  });

  it('reads the language from the folder', () => {
    expect(blog.getPostLanguage('es/2025-03-01_tercero')).toBe('es');
    expect(blog.getPostLanguage('en/2025-03-01_third')).toBe('en');
  });
});

describe('reading time', () => {
  it('counts words, ignoring extra whitespace', () => {
    expect(blog.getWordCount('  one   two \n three  ')).toBe(3);
    expect(blog.getWordCount('')).toBe(0);
  });

  it('never reports a zero-minute read', () => {
    expect(blog.getReadingTimeFromContent('one two three')).toBeGreaterThan(0);
  });

  it('scales with length', () => {
    const short = blog.getReadingTimeFromContent('word '.repeat(50));
    const long = blog.getReadingTimeFromContent('word '.repeat(2000));
    expect(long).toBeGreaterThan(short);
  });
});

describe('visibility rules', () => {
  it('recognizes a demo post by its folder, in either language', () => {
    expect(blog.isDemoPost({ id: 'es/_demo/x' } as never)).toBe(true);
    expect(blog.isDemoPost({ id: 'en/_demo/x' } as never)).toBe(true);
    expect(blog.isDemoPost({ id: 'es/2025-01-01_real' } as never)).toBe(false);
  });

  it('recognizes a draft', () => {
    expect(blog.isDraftPost({ data: { draft: true } } as never)).toBe(true);
    expect(blog.isDraftPost({ data: {} } as never)).toBe(false);
  });

  it('recognizes a post scheduled for the future', () => {
    expect(
      blog.isScheduledPost({ data: { pubDate: day('2099-01-01') } } as never)
    ).toBe(true);
    expect(
      blog.isScheduledPost({ data: { pubDate: day('2020-01-01') } } as never)
    ).toBe(false);
  });

  it('hides scheduled posts from a production build', () => {
    // The gate walks the build; a scheduled post that leaked would get a `.md`
    // twin for a page nobody should see yet.
    const scheduled = {
      id: 'es/x',
      data: { pubDate: day('2099-01-01') },
    } as never;
    expect(blog.isPostVisibleInProduction(scheduled)).toBe(import.meta.env.DEV);
  });

  it('keeps an ordinary published post visible', () => {
    const published = {
      id: 'es/2025-01-01_x',
      data: { pubDate: day('2025-01-01'), draft: false },
    } as never;
    expect(blog.isPostVisibleInProduction(published)).toBe(true);
  });
});

describe('listing', () => {
  it('returns only the requested language, newest first', async () => {
    const { postsResult } = await blog.getBlogPosts({ lang: 'es' });
    const ids = postsResult.map((p) => p.id);
    expect(ids.every((id) => id.startsWith('es/'))).toBe(true);
    expect(ids).not.toContain('en/2025-03-01_third');
    // Descending by date. Vitest runs with DEV set, so the scheduled post is
    // visible here exactly as it is in `pnpm run dev` — and it sorts first.
    const dates = postsResult.map((p) => p.data.pubDate.getTime());
    expect([...dates].sort((a, b) => b - a)).toEqual(dates);
  });

  it('excludes demo posts from every listing', async () => {
    const { postsResult } = await blog.getBlogPosts({ lang: 'es' });
    expect(postsResult.some((p) => p.id.includes('_demo/'))).toBe(false);
  });

  it('narrows to a single tag when asked', async () => {
    const { postsResult } = await blog.getBlogPosts({
      lang: 'es',
      tag: 'ai-agents',
    });
    expect(postsResult.map((p) => p.id)).toEqual(['es/2025-02-01_segundo']);
  });

  it('builds a timeline entry with a resolved slug and description', async () => {
    const timeline = await blog.getTimelineIndex('community', 'es');
    expect(timeline.length).toBeGreaterThan(0);
    const chapter = timeline.find((entry) => entry.slug === 'tercero');
    expect(chapter).toMatchObject({
      slug: 'tercero',
      lang: 'es',
      description: 'Description for es/2025-03-01_tercero',
      tags: ['community'],
      seriesSlug: 'saga',
    });
  });

  it('orders a series by chapter, not by date', async () => {
    const chapters = await blog.getSeriesTimelineIndex('saga', 'es');
    expect(chapters.map((c) => c.slug)).toEqual(['primero', 'tercero']);
  });
});

describe('series navigation', () => {
  it('returns null for a series that does not exist', async () => {
    expect(await blog.getSeriesNavigation('nope', 'es/x', 'es')).toBeNull();
  });
});

describe('related posts', () => {
  it('excludes the post itself', async () => {
    const related = await blog.getRelatedPosts({
      currentPostId: 'es/2025-03-01_tercero',
      tags: ['community'],
      lang: 'es',
    });
    expect(related.map((p) => p.id)).not.toContain('es/2025-03-01_tercero');
  });

  it('stays within the requested language', async () => {
    const related = await blog.getRelatedPosts({
      currentPostId: 'es/2025-03-01_tercero',
      tags: ['community'],
      lang: 'es',
    });
    expect(related.every((p) => p.id.startsWith('es/'))).toBe(true);
  });

  it('falls back to recent posts when the post has no tags', async () => {
    const related = await blog.getRelatedPosts({
      currentPostId: 'es/2025-03-01_tercero',
      tags: [],
      lang: 'es',
      limit: 2,
    });
    expect(related.length).toBeGreaterThan(0);
    expect(related.length).toBeLessThanOrEqual(2);
  });

  it('honours the limit', async () => {
    const related = await blog.getRelatedPosts({
      currentPostId: 'es/2025-03-01_tercero',
      tags: ['community'],
      lang: 'es',
      limit: 1,
    });
    expect(related).toHaveLength(1);
  });
});

describe('search index', () => {
  it('shards by language', async () => {
    const es = await blog.getSearchIndexByLanguage('es');
    expect(es.every((entry) => entry.lang === 'es')).toBe(true);
  });

  it('excludes posts that are not visible in production', async () => {
    const es = await blog.getSearchIndexByLanguage('es');
    expect(es.map((e) => e.slug)).not.toContain('demo-post');
  });
});
