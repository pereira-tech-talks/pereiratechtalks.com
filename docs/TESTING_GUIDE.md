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

## Prove a new test can fail

A test that cannot fail is not coverage, and it is indistinguishable from one
that can until you check.

Two cases from `PLAN_branch_audit_and_pr` (2026-08), a day apart:

- The new modal spec asserts all four month CTAs render at the same width — the
  exact defect that had shipped once already. Restoring the original
  `flex-wrap` layout was run deliberately: two tests failed, seven passed. Only
  then was it coverage.
- A secret scan over some committed binaries reported **zero matches** and was
  briefly believed. `strings` is not installed in this environment, so it had
  returned clean *vacuously*. Redone with `grep -a`.

**Therefore:** after writing an assertion that guards a specific regression,
break the thing it guards, watch it fail, and revert. It costs a minute.

## e2e against Astro islands

Two things reliably make Playwright suites flaky here, and neither is timing
noise you should paper over with a `waitForTimeout`:

**Hydration.** A `client:visible` island's server-rendered markup looks
interactive before Svelte takes over, and Playwright's actionability checks know
nothing about hydration — an early `fill()` is silently discarded. Wait for
Astro to drop the `ssr` attribute:

```ts
await page.waitForFunction(() => {
  const island = document.querySelector('#some-field')?.closest('astro-island');
  return !!island && !island.hasAttribute('ssr');
});
```

**The notification modal.** It auto-opens on a first visit and intercepts every
click. Its lab-browser guard only matches Lighthouse user agents, so Playwright
gets it — correctly, since a real visitor does too. Dismissing it at test start
is not enough: the open is deferred past LCP, so it can appear several actions
in. Pre-set the session flag the component itself checks
(`ptt:notify-auto:<id>:<lang>`) via `page.addInitScript`, which puts the browser
in the state a reader is in on their second navigation rather than disabling the
feature.

## The preview server

`playwright.config.ts` starts `scripts/preview-server.mjs`, **not**
`astro preview`. In Astro 7.2.x the CLI starts a background daemon and the
foreground process exits 0 immediately, which Playwright reports as
`Process from config.webServer exited early` before running a single test.
Locally that hides behind `reuseExistingServer`: the first attempt "fails",
leaves a daemon listening, and every later attempt reuses it — so the failure
reads as a fluke. The script wraps Astro's programmatic `preview()` and holds it
open. Same routing, no daemon.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Svelte](https://testing-library.com/docs/svelte-testing-library/intro)
- [Astro Testing Recipes](https://docs.astro.build/en/recipes/testing/)
