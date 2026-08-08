# Testing Guide

Guide for testing in Pereira Tech Talks v3.0.0.

## Overview

This project uses **Vitest** for unit and component testing. The testing infrastructure covers:

- **Utility function tests** for all pure functions in `src/lib/`
- **Svelte component tests** for key interactive components using `@testing-library/svelte`
- **Coverage enforcement** at 80%+ on `src/lib/` code

E2E testing (Playwright) is not yet configured.

## Running Tests

```bash
# Run all tests (single run)
pnpm run test

# Watch mode (re-runs on file changes)
pnpm run test:watch

# Run with coverage report
pnpm run test:coverage
```

## Test Structure

```
tests/
├── unit/
│   ├── lib/                    # Utility function tests
│   │   ├── blog.test.ts        # Blog utility functions (41 tests)
│   │   ├── i18n.test.ts        # i18n utility functions (46 tests)
│   │   ├── search.test.ts      # Search/Fuse.js functions (26 tests)
│   │   └── translations.test.ts # Translation system (14 tests)
│   └── components/             # Svelte component tests
│       ├── BlogCard.test.ts    # Blog card rendering (14 tests)
│       └── BlogPagination.test.ts # Pagination logic (17 tests)
├── fixtures/
│   └── posts.ts                # Mock blog post data
├── helpers/
│   └── setup.ts                # Test setup (jest-dom matchers)
└── mocks/
    └── astro-content.ts        # Mock for astro:content virtual module
```

## Writing New Tests

### File Naming

- Use `*.test.ts` for all test files
- Place in `tests/unit/lib/` for utility tests
- Place in `tests/unit/components/` for component tests

### Utility Function Tests

```typescript
import { describe, expect, it } from 'vitest';
import { myFunction } from '@/lib/myModule';

describe('myFunction', () => {
  it('returns expected result for valid input', () => {
    expect(myFunction('input')).toBe('expected');
  });

  it('handles edge case', () => {
    expect(myFunction('')).toBe('default');
  });
});
```

### Svelte Component Tests

```typescript
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import MyComponent from '@/components/MyComponent.svelte';

describe('MyComponent', () => {
  it('renders content', () => {
    render(MyComponent, { props: { title: 'Hello' } });
    expect(screen.getByText('Hello')).toBeDefined();
  });
});
```

### Using Fixtures

Import mock data from `tests/fixtures/posts.ts`:

```typescript
import { publishedEnglishPost, demoEnglishPost } from '../../fixtures/posts';

// Use `as never` for CollectionEntry type compatibility
render(BlogCard, { props: { post: publishedEnglishPost as never } });
```

## Configuration

### `vitest.config.ts`

Key configuration:

- **Environment:** `happy-dom` (lightweight DOM for tests)
- **Path aliases:** `@/` maps to `src/` (matches tsconfig)
- **Svelte support:** `@sveltejs/vite-plugin-svelte` (plain `svelte()` — the `hot` option was removed in v7; HMR is already off outside dev)
- **Browser resolve:** `conditions: ['browser']` required for Svelte 5 component tests
- **astro:content mock:** Aliased to `tests/mocks/astro-content.ts` since Vitest cannot resolve Astro virtual modules

### Coverage

- **Provider:** V8
- **Target:** 80%+ on statements, branches, functions, and lines for `src/lib/`
- **Excludes:** `src/lib/types.ts`, `src/lib/enum.ts` (type-only files)
- **Reporters:** text, text-summary, html

### Svelte 5 Compatibility

Svelte 5 components require `resolve.conditions: ['browser']` in the Vitest config. Without this, `@testing-library/svelte` throws a `lifecycle_function_unavailable` error because Svelte resolves to server-side exports.

## Test Conventions

- Use descriptive `describe`/`it` blocks: `describe('getPostSlug')` + `it('strips date prefix from post ID')`
- Prefer `expect().toBe()` for primitives, `expect().toEqual()` for objects
- Test edge cases: empty strings, undefined values, boundary conditions
- Do **not** test async functions that depend on `astro:content` (e.g., `getBlogPosts`, `getRelatedPosts`)
- Import order: vitest > testing-library > source modules > fixtures

## Testing Best Practices

### Do

- Test user-visible behavior, not implementation details
- Use meaningful test descriptions that explain the expected behavior
- Keep tests independent (no shared mutable state)
- Use test fixtures for mock data
- Test edge cases and error conditions

### Don't

- Test Astro/Svelte framework internals
- Over-mock to the point tests are meaningless
- Write flaky tests that depend on timing
- Skip running tests before committing

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Svelte](https://testing-library.com/docs/svelte-testing-library/intro)
- [Astro Testing Recipes](https://docs.astro.build/en/recipes/testing/)
