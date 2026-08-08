import { describe, expect, it } from 'vitest';

import { extractYouTubeId } from '@/lib/youtube';

describe('extractYouTubeId', () => {
  it('parses watch, short, and embed URLs', () => {
    expect(
      extractYouTubeId('https://www.youtube.com/watch?v=5BWnHA-vBvg')
    ).toBe('5BWnHA-vBvg');
    expect(extractYouTubeId('https://youtu.be/5BWnHA-vBvg')).toBe(
      '5BWnHA-vBvg'
    );
    expect(extractYouTubeId('https://www.youtube.com/embed/5BWnHA-vBvg')).toBe(
      '5BWnHA-vBvg'
    );
  });

  it('returns null for non-youtube URLs', () => {
    expect(extractYouTubeId('https://example.com')).toBeNull();
  });
});
