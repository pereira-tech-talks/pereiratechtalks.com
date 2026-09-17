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

## Validation gates — choosing what to run

A Deep Work Plan turns a task's Touched Surface into a validation gate by
reading this section. Every command below was **run in this repository** on
2026-09-17 (pnpm 11.23.0, vitest 4.1.11, Biome 2.5.10, Node 24.18.1); the
evidence column is what a correct run prints. All commands run from the
repository root.

### Full commands

| Gate | Command | Evidence of a correct run | Cost |
|------|---------|---------------------------|------|
| Unit tests | `pnpm run test` | `Test Files 60 passed (60)` · `Tests 961 passed (961)` | ~11 s |
| Lint + format | `pnpm run biome:check` | `Checked N files` with no diagnostics | seconds |
| Type check | `pnpm run astro:check` | `0 errors` | ~1 min |
| Build | `pnpm run build` | runs `astro check` then `astro build`, writes `dist/` | minutes |
| e2e — responsive | `pnpm run test:responsive` | Playwright summary; needs browsers installed | minutes |
| e2e — forms | `pnpm run test:forms` | Playwright summary | minutes |
| Site audits | `pnpm run md:check` · `lang:check` · `seo:check` · `parity:check` | `0 flagged` per audit | needs `dist/` |

> **The unit suite is cheap on purpose.** 961 tests finish in about eleven
> seconds, so `pnpm run test` is the right default even for a one-file change.
> Reach for the scoped forms below when iterating tightly, not to save the gate.

### Scoped invocations

**Unit tests — by file, directory, or name.** Vitest takes positional path
filters and `-t` for a test-name filter:

```bash
pnpm exec vitest run tests/unit/youtube.test.ts   # → Test Files 1 passed (1) · Tests 2 passed (2)
pnpm exec vitest run tests/unit/lib/              # → Test Files 44 passed (44) · Tests 811 passed (811)
pnpm exec vitest run -t "certificate"             # → Test Files 3 passed | 57 skipped (60)
```

**Unit tests — by what changed.** `--changed` walks Vitest's module graph from
the working tree (or from a git ref) and runs only the tests that reach it:

```bash
pnpm exec vitest run --changed                    # vs the working tree
pnpm exec vitest run --changed origin/main        # vs a ref — what a PR touches
```

> **`--related` does not exist in Vitest 4.** It is in older documentation and
> fails here with `CACError: Unknown option --related`. Use `--changed`.

**Lint and format — by path.** Biome scopes to any file or directory:

```bash
pnpm exec biome check src/lib/blog.ts             # → Checked 1 file
pnpm exec biome check src/lib/                    # → Checked 55 files
```

**Type check — no scoping available.** `astro check` exposes only `--root`,
`--tsconfig` and `--minimumSeverity`; there is no path filter. A type check is
always project-wide — run `pnpm run astro:check` or nothing.

**e2e — by file or name.** Playwright takes a path and `-g` for a title filter.
Confirm the selection without launching browsers:

```bash
pnpm exec playwright test --list tests/e2e/responsive/overflow.spec.ts   # → Total: 170 tests in 1 file
pnpm exec playwright test tests/e2e/responsive/overflow.spec.ts
```

**Site audits — no scoping, and they need a build.** `scripts/*.mjs` accept only
`--strict` / `--report` / `--json`, and `md:check` / `seo:check` read `dist/`, so
they run after `pnpm run build` and always cover the whole site. The one cheaper
variant is `pnpm run md:check:existence`, which checks that every page has a
`.md` twin without comparing their content.

### Source-to-test mapping

Tests live in `tests/unit/`, in two shapes:

- `tests/unit/lib/<name>.test.ts` — **25 of 44** of these mirror a module at
  `src/lib/<name>.ts`. The rest are named for a *concern* that spans modules
  (`analytics-privacy`, `agent-markdown-completeness`, `ard-manifest`).
- `tests/unit/<feature>.test.ts` — feature-level suites cutting across modules
  (`certificates`, `community-stats`, `speaker-meetup-linkage`).

**Do not infer the gate from the filename.** Twelve `src/lib` modules have no
same-name test (`talk`, `vertical`, `channel`, `ptd-paths`, `satteri-plugins`,
`community-stats`, …); some are covered by a concern-named or feature suite,
others not at all. The reliable selector is `--changed`, which uses the real
import graph rather than a naming convention.

### Dependent consumers

`pnpm exec vitest run --changed <ref>` is this repository's affected-tests tool:
it resolves importers transitively, so a change to a shared module selects every
suite that reaches it. Verified: `--changed` against a commit touching
`src/lib/` selected all 60 files, which is the correct answer for a module with
that many dependents — and is also why the eleven-second full suite is usually
the cheaper choice.

There is no equivalent for the other layers. Playwright and the audits have no
change-detection, so a change that plausibly reaches a rendered page is
validated by running them in full.

### Blind spots

The unit suite cannot see these; a change touching them needs the wider gate
named in brackets:

- **Content collections** — entries under `src/content/**` are validated by the
  Zod schemas at build time, not by vitest [`pnpm run build`].
- **`.astro` components and layouts** — not unit-tested at all; they are
  exercised only by the build and the e2e suites [`build` + `test:responsive`].
- **Translations** — a missing key in `en.ts`/`es.ts` surfaces as a type error
  or a rendered gap [`astro:check` + `parity:check`].
- **Markdown-for-Agents twins** — `src/content/pages/{en,es}/*.md` drift silently
  [`md:check`].
- **Middleware allowlist** — a new top-level route 404s in production until it is
  in `KNOWN_ROOT_PATHS` / `KNOWN_EN_PATHS`; no unit test covers this [`build` +
  manual route check].
- **Cloudflare Pages Functions** — `functions/**` does not run under `astro dev`
  and has no unit coverage [`wrangler pages dev`, or the `/verify-form-intake`
  skill].
- **Images** — generated WebP under `public/images/**` is checked by the
  generation scripts, not by tests [`pnpm run images:webp`].

### Escalation — when the scoped gate is not enough

Run the **full** unit suite plus `pnpm run build` and the site audits when a
change touches any of:

- `src/lib/**` — shared by most of the site.
- `src/content.config.ts` — the Zod schemas every collection depends on.
- `src/middleware.ts` — the route allowlist.
- `astro.config.mjs` or `src/lib/satteri-plugins.ts` — the Markdown pipeline.
- `src/lib/translations/**` — both locales at once.
- `package.json` / `pnpm-lock.yaml` / any test or build toolchain config.

### Fallback

When a sound scoped gate cannot be derived, do not guess — run:

```bash
pnpm run test
```

and, for anything that reaches a rendered page, `pnpm run build` followed by the
relevant audit. The pre-commit checklist in `AGENTS.md` is the full-fat version
of this fallback.

### Testing posture

- **Unit (base layer)** — `tests/unit/`, Vitest with `happy-dom`. Fast and
  deterministic, asserting observable behavior and boundaries: errors, edge
  cases and regressions. Mock at useful seams; do not assert internal call
  order. Coverage target is 80%+ on `src/lib/`.
- **Integration seams** — the linkage suites (`speaker-meetup-linkage`,
  `talk-event-linkage`, `community-stats`) cover the contracts between content
  collections and the resolvers that read them. A task changing one of those
  contracts is expected to extend them.
- **End-to-end** — `tests/e2e/responsive/` and `tests/e2e/forms/`, Playwright.
  Few, high-value flows: overflow at real viewports, touch targets, form smoke.
  Browsers are not installed in the dev container by default.
- **Fixtures** — `tests/fixtures/` and `tests/mocks/`, deterministic by
  construction; no network, no clock dependence.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Svelte](https://testing-library.com/docs/svelte-testing-library/intro)
- [Astro Testing Recipes](https://docs.astro.build/en/recipes/testing/)
