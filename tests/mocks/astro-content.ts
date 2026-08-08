/**
 * Mock for astro:content module.
 * Provides stubs for imports used by src/lib/ files.
 * Only the pure functions are tested — async functions using getCollection are out of scope.
 */

export function getCollection() {
  throw new Error(
    'getCollection is not available in tests. Only test pure functions.'
  );
}

export type CollectionEntry<T extends string> = {
  id: string;
  data: Record<string, unknown>;
  body?: string;
  collection: T;
};
