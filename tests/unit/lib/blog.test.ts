import { describe, expect, it } from 'vitest';

import {
  getPostLanguage,
  getPostSlug,
  getReadingTimeFromContent,
  getWordCount,
  isDemoPost,
  isDraftPost,
  isScheduledPost,
} from '@/lib/blog';
import { SITE_TIMEZONE } from '@/lib/constances';

import {
  demoEnglishPost,
  demoSpanishPost,
  draftPost,
  draftScheduledPost,
  emptyContent,
  longContent,
  minimalPost,
  publishedEnglishPost,
  publishedSpanishPost,
  sampleMarkdownContent,
  scheduledPost,
  shortContent,
} from '../../fixtures/posts';

// ─── getPostSlug ────────────────────────────────────────

describe('getPostSlug', () => {
  it('strips language prefix and date prefix from post ID', () => {
    expect(getPostSlug('en/2024-03-15_my-awesome-post')).toBe(
      'my-awesome-post'
    );
  });

  it('strips Spanish language prefix and date prefix', () => {
    expect(getPostSlug('es/2024-03-15_mi-post-increible')).toBe(
      'mi-post-increible'
    );
  });

  it('handles post IDs without date prefix (backwards compatibility)', () => {
    expect(getPostSlug('en/old-post-no-date')).toBe('old-post-no-date');
  });

  it('handles demo post paths with _demo/ subfolder', () => {
    // Extracts clean slug from demo posts (strips _demo/ prefix and date)
    expect(getPostSlug('en/_demo/2024-01-01_demo-post')).toBe('demo-post');
  });

  it('handles post ID without language prefix', () => {
    expect(getPostSlug('2024-03-15_some-post')).toBe('some-post');
  });

  it('returns the full slug for a post with no prefix at all', () => {
    expect(getPostSlug('simple-post')).toBe('simple-post');
  });
});

// ─── getPostLanguage ────────────────────────────────────

describe('getPostLanguage', () => {
  it('extracts "en" from English post ID', () => {
    expect(getPostLanguage('en/2024-03-15_my-post')).toBe('en');
  });

  it('extracts "es" from Spanish post ID', () => {
    expect(getPostLanguage('es/2024-03-15_mi-post')).toBe('es');
  });

  it('extracts "en" from demo post path', () => {
    expect(getPostLanguage('en/_demo/2024-01-01_demo-post')).toBe('en');
  });

  it('returns "en" as default when no language prefix present', () => {
    expect(getPostLanguage('some-post')).toBe('en');
  });
});

// ─── isDemoPost ─────────────────────────────────────────

describe('isDemoPost', () => {
  it('returns true for English demo posts', () => {
    expect(isDemoPost(demoEnglishPost as never)).toBe(true);
  });

  it('returns true for Spanish demo posts', () => {
    expect(isDemoPost(demoSpanishPost as never)).toBe(true);
  });

  it('returns false for regular published posts', () => {
    expect(isDemoPost(publishedEnglishPost as never)).toBe(false);
  });

  it('returns false for draft posts', () => {
    expect(isDemoPost(draftPost as never)).toBe(false);
  });

  it('returns false for minimal posts', () => {
    expect(isDemoPost(minimalPost as never)).toBe(false);
  });
});

// ─── isScheduledPost ────────────────────────────────────

describe('isScheduledPost', () => {
  it('returns true for posts with future pubDate', () => {
    expect(isScheduledPost(scheduledPost as never)).toBe(true);
  });

  it('returns true for another future-dated post', () => {
    expect(isScheduledPost(draftScheduledPost as never)).toBe(true);
  });

  it('returns false for posts with past pubDate', () => {
    expect(isScheduledPost(publishedEnglishPost as never)).toBe(false);
  });

  it("returns false for today's pubDate", () => {
    // Simulate how Astro parses a frontmatter date: "2026-03-04" → midnight UTC.
    // Use today's date in the site timezone so the test stays valid regardless
    // of the UTC offset when it runs.
    const todayInTz = new Date().toLocaleDateString('en-CA', {
      timeZone: SITE_TIMEZONE,
    });
    const todayPost = {
      id: 'en/2024-01-01_today-post',
      data: {
        title: 'Today Post',
        description: 'A post published today',
        pubDate: new Date(`${todayInTz}T00:00:00.000Z`),
        tags: ['tech'],
      },
    };
    expect(isScheduledPost(todayPost as never)).toBe(false);
  });

  it('returns false for demo posts (past date)', () => {
    expect(isScheduledPost(demoEnglishPost as never)).toBe(false);
  });
});

// ─── isDraftPost ────────────────────────────────────────

describe('isDraftPost', () => {
  it('returns true when frontmatter sets draft: true', () => {
    expect(isDraftPost(draftPost as never)).toBe(true);
  });

  it('returns true for a draft that is also scheduled', () => {
    expect(isDraftPost(draftScheduledPost as never)).toBe(true);
  });

  it('returns false for a published post without the draft flag', () => {
    expect(isDraftPost(publishedEnglishPost as never)).toBe(false);
  });

  it('returns false for a scheduled post without the draft flag', () => {
    expect(isDraftPost(scheduledPost as never)).toBe(false);
  });

  it('returns false for a minimal post (no draft field)', () => {
    expect(isDraftPost(minimalPost as never)).toBe(false);
  });
});

// ─── getWordCount ───────────────────────────────────────

describe('getWordCount', () => {
  it('returns 0 for empty content', () => {
    expect(getWordCount(emptyContent)).toBe(0);
  });

  it('counts words in short content', () => {
    expect(getWordCount(shortContent)).toBe(2);
  });

  it('counts words in long content', () => {
    expect(getWordCount(longContent)).toBe(500);
  });

  it('strips markdown formatting from word count', () => {
    const count = getWordCount(sampleMarkdownContent);
    expect(count).toBeGreaterThan(0);
    // Should not count markdown syntax as words
    expect(count).toBeLessThan(sampleMarkdownContent.split(/\s+/).length);
  });

  it('strips code blocks from word count', () => {
    const withCode = '```\nconst x = 1;\n```\nOne two three.';
    expect(getWordCount(withCode)).toBe(3);
  });

  it('strips inline code from word count', () => {
    const withInline = 'Use `const` to declare.';
    const count = getWordCount(withInline);
    expect(count).toBeGreaterThanOrEqual(2);
  });

  it('handles content with only whitespace', () => {
    expect(getWordCount('   \n\n  ')).toBe(0);
  });
});

// ─── getReadingTimeFromContent ──────────────────────────

describe('getReadingTimeFromContent', () => {
  it('returns minimum of 1 minute for short content', () => {
    expect(getReadingTimeFromContent(shortContent)).toBe(1);
  });

  it('returns minimum of 1 minute for empty content', () => {
    expect(getReadingTimeFromContent(emptyContent)).toBe(1);
  });

  it('returns correct reading time for long content (500 words = 3 min)', () => {
    // 500 words / 240 WPM = 2.083, ceil = 3
    expect(getReadingTimeFromContent(longContent)).toBe(3);
  });

  it('returns correct reading time for 240 words (1 minute)', () => {
    const oneMinuteWorth = Array(240).fill('word').join(' ');
    expect(getReadingTimeFromContent(oneMinuteWorth)).toBe(1);
  });

  it('returns correct reading time for 241 words (2 minutes)', () => {
    const justOverOneMinute = Array(241).fill('word').join(' ');
    expect(getReadingTimeFromContent(justOverOneMinute)).toBe(2);
  });
});

// ─── normalizeContentForWordCount via getWordCount ──────

describe('getWordCount normalization', () => {
  it('strips frontmatter', () => {
    const withFm = '---\ntitle: foo\ndraft: false\n---\nOne two three.';
    expect(getWordCount(withFm)).toBe(3);
  });

  it('strips the Resources section', () => {
    const withResources =
      'One two three.\n\n## Resources\n- [Link](https://example.com)\n- Another reference here';
    expect(getWordCount(withResources)).toBe(3);
  });

  it('strips the Spanish Recursos section', () => {
    const withRecursos =
      'Uno dos tres.\n\n## Recursos\n- [Enlace](https://example.com)\n- Otra referencia';
    expect(getWordCount(withRecursos)).toBe(3);
  });

  it('preserves visible text inside markdown links', () => {
    const withLink = 'See [the report](https://example.com) for details.';
    // 'See the report for details.' -> 5 words
    expect(getWordCount(withLink)).toBe(5);
  });

  it('strips entire HTML figure blocks (alt text and figcaption)', () => {
    const withFigure =
      'Before figure.\n<figure>\n<img alt="lots of words here describing the image" />\n<figcaption>extra caption words</figcaption>\n</figure>\nAfter figure.';
    // 'Before figure. After figure.' -> 4 words
    expect(getWordCount(withFigure)).toBe(4);
  });

  it('strips bare HTML tags', () => {
    const withTags = 'Hello <span class="x">world</span> here.';
    expect(getWordCount(withTags)).toBe(3);
  });
});
