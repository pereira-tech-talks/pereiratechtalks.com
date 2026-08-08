import { describe, expect, it } from 'vitest';

import {
  getDeckSlug,
  getDeckTypeBadgeKey,
  isExternalDeck,
  isNativeDeck,
} from '@/lib/slides';

import {
  draftNativeDeck,
  externalEnglishDeck,
  externalSpanishDeck,
  nativeEnglishDeck,
  nativeSpanishDeck,
} from '../../fixtures/slides';

// ─── getDeckSlug ────────────────────────────────────────

describe('getDeckSlug', () => {
  it('strips language prefix and date prefix from deck ID', () => {
    expect(getDeckSlug('en/2026-04-25_demo-revealjs-features')).toBe(
      'demo-revealjs-features'
    );
  });

  it('strips Spanish language prefix and date prefix', () => {
    expect(getDeckSlug('es/2026-04-25_demo-revealjs-features')).toBe(
      'demo-revealjs-features'
    );
  });

  it('handles deck IDs without date prefix', () => {
    expect(getDeckSlug('en/my-deck')).toBe('my-deck');
  });

  it('handles deck ID without language prefix', () => {
    expect(getDeckSlug('2026-04-25_some-deck')).toBe('some-deck');
  });

  it('returns the full slug for a deck with no prefix at all', () => {
    expect(getDeckSlug('simple-deck')).toBe('simple-deck');
  });

  it('handles deeply nested paths', () => {
    expect(getDeckSlug('en/subfolder/2026-01-01_nested-deck')).toBe(
      'nested-deck'
    );
  });

  it('preserves slug with multiple hyphens', () => {
    expect(getDeckSlug('en/2026-04-25_my-long-deck-slug-here')).toBe(
      'my-long-deck-slug-here'
    );
  });

  it('handles edge case: only date prefix', () => {
    expect(getDeckSlug('en/2026-04-25_')).toBe('');
  });
});

// ─── isNativeDeck ───────────────────────────────────────

describe('isNativeDeck', () => {
  it('returns true for native deck (EN)', () => {
    expect(isNativeDeck(nativeEnglishDeck as never)).toBe(true);
  });

  it('returns true for native deck (ES)', () => {
    expect(isNativeDeck(nativeSpanishDeck as never)).toBe(true);
  });

  it('returns true for draft native deck', () => {
    expect(isNativeDeck(draftNativeDeck as never)).toBe(true);
  });

  it('returns false for external deck', () => {
    expect(isNativeDeck(externalEnglishDeck as never)).toBe(false);
  });
});

// ─── isExternalDeck ─────────────────────────────────────

describe('isExternalDeck', () => {
  it('returns true for external deck (EN)', () => {
    expect(isExternalDeck(externalEnglishDeck as never)).toBe(true);
  });

  it('returns true for external deck (ES)', () => {
    expect(isExternalDeck(externalSpanishDeck as never)).toBe(true);
  });

  it('returns false for native deck', () => {
    expect(isExternalDeck(nativeEnglishDeck as never)).toBe(false);
  });
});

// ─── getDeckTypeBadgeKey ────────────────────────────────

describe('getDeckTypeBadgeKey', () => {
  it('returns "native" for native deck', () => {
    expect(getDeckTypeBadgeKey(nativeEnglishDeck as never)).toBe('native');
  });

  it('returns "external" for external deck', () => {
    expect(getDeckTypeBadgeKey(externalEnglishDeck as never)).toBe('external');
  });

  it('returns correct key for Spanish native deck', () => {
    expect(getDeckTypeBadgeKey(nativeSpanishDeck as never)).toBe('native');
  });

  it('returns correct key for Spanish external deck', () => {
    expect(getDeckTypeBadgeKey(externalSpanishDeck as never)).toBe('external');
  });

  it('returns correct key for draft deck', () => {
    expect(getDeckTypeBadgeKey(draftNativeDeck as never)).toBe('native');
  });
});
