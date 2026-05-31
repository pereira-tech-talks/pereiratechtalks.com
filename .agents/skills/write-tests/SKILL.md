---
name: write-tests
description: Add or expand unit/integration tests for existing code (when testing is configured). Use proactively when tests need to be added or expanded.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
# === Documentation (ignored by tools, useful for humans) ===
tier: 2
intent: tests
max-files: 10
max-loc: 500
---

# Skill: Write Tests

## Objective

Add or expand tests for existing code. This skill creates or extends test files with meaningful cases, edge cases, and mocks.

## Current Status

- **Testing Framework:** Vitest 4.x (configured and active)
- **Component Testing:** @testing-library/svelte 5.x
- **DOM Environment:** happy-dom
- **Coverage:** V8 provider, 80%+ threshold on `src/lib/`
- **Test file naming:** `*.test.ts`

## Non-Goals

- Does NOT implement new production code
- Does NOT refactor production logic
- Does NOT change function signatures for the sake of testability without agreement
- Does NOT set up E2E tests (Playwright not configured)

## Tier Classification

**Tier: 2** - Standard

**Reasoning:** Writing tests requires moderate reasoning (understanding behavior, edge cases, mocks). Scope typically 1-10 files, 100-500 LOC; standard development work.

## Inputs

### Required Parameters

- `$TARGET`: File(s) or module to add tests for (e.g., `src/components/blog/BlogCard.svelte`)
- `$SCOPE`: What to cover (e.g., "unit for props", "interaction tests", "edge cases for null")

### Optional Parameters

- `$EXISTING`: Path to existing test file to extend

## Prerequisites

- [ ] Target code is stable (no pending refactors)
- [ ] Test fixtures understood (`tests/fixtures/posts.ts`)
- [ ] Vitest config reviewed if testing new module types

## Test Infrastructure

### Configuration

- **Config:** `vitest.config.ts` at project root
- **Environment:** happy-dom
- **Path aliases:** `@/` maps to `src/` (matches tsconfig)
- **Svelte:** `@sveltejs/vite-plugin-svelte` with `hot: false`
- **Browser resolve:** `conditions: ['browser']` for Svelte 5 component tests
- **astro:content mock:** `tests/mocks/astro-content.ts` (aliased in vitest config)

### Test File Structure

```
tests/
├── unit/
│   ├── lib/                    # Utility function tests
│   │   ├── blog.test.ts
│   │   ├── i18n.test.ts
│   │   ├── search.test.ts
│   │   └── translations.test.ts
│   └── components/             # Svelte component tests
│       ├── BlogCard.test.ts
│       └── BlogPagination.test.ts
├── fixtures/
│   └── posts.ts                # Mock blog post data
├── helpers/
│   └── setup.ts                # Test setup (jest-dom matchers)
└── mocks/
    └── astro-content.ts        # Mock for astro:content virtual module
```

### Key Patterns

**Utility function tests:**
```typescript
import { describe, expect, it } from 'vitest';
import { getPostSlug } from '@/lib/blog';

describe('getPostSlug', () => {
  it('strips date prefix from post ID', () => {
    expect(getPostSlug('en/2024-03-15_my-post')).toBe('my-post');
  });
});
```

**Svelte component tests:**
```typescript
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import BlogCard from '@/components/blog/BlogCard.svelte';
import { publishedEnglishPost } from '../../fixtures/posts';

describe('BlogCard', () => {
  it('renders post title', () => {
    render(BlogCard, { props: { post: publishedEnglishPost as never } });
    expect(screen.getByText('My Awesome Post')).toBeDefined();
  });
});
```

**Important notes:**
- Use `as never` cast for mock posts passed to functions expecting `CollectionEntry<'blog'>`
- Svelte 5 components require `resolve.conditions: ['browser']` in vitest config
- Do NOT test async functions that depend on `astro:content` (e.g., `getBlogPosts`)

## Steps

### Step 1: Understand Target

- Read the target file(s) and identify public behavior to test
- Check for existing tests in `tests/unit/`
- Review testing patterns in existing test files

### Step 2: Plan Cases

- List unit cases (happy path, edge cases, errors)
- Identify dependencies to mock
- Decide: new file or extend existing test

### Step 3: Implement Tests

- Create or update test file in `tests/unit/`
- Use Vitest (describe, it, expect)
- Import fixtures from `tests/fixtures/` when applicable
- Keep tests focused; avoid testing implementation details

### Step 4: Validate

```bash
pnpm run test           # Run tests
pnpm run biome:check    # Lint check
```

## Output Format

### Success Output

```
## Tests Added/Updated

### Target
{What was tested}

### Files
- `tests/.../foo.test.ts`: {created|updated} — {brief description}

### Coverage
- {list of cases covered}

### Validation
- pnpm run test: pass
- pnpm run biome:check: pass

### Commit Message
test: add|expand tests for {target}
```

## Guardrails

### Scope Limits

- **Maximum files:** 10 (test files + any small test helpers)
- **Maximum LOC:** 500 (test code)
- **Naming:** `*.test.ts`

### Stop Conditions

**Stop and escalate** if:

- Target is auth/security-critical (coordinate with team)
- Requires new test infrastructure not in project
- Scope exceeds 10 files or 500 LOC
- Need to mock `astro:content` beyond the existing stub

## Definition of Done

- [ ] New or updated test files
- [ ] All tests pass (`pnpm run test`)
- [ ] `pnpm run biome:check` passes
- [ ] Tests are meaningful (not only coverage padding)

## Escalation Conditions

**Escalate to Tier 3** if: integration/E2E design needed, or test architecture decisions.

## Related

- [quick-fix](../quick-fix/SKILL.md) - Small fixes
- [reviewer](../../agents/reviewer.md) - Review test quality
- docs/TESTING_GUIDE.md - Full testing conventions and setup

## Changelog

- **2026-02-17:** Updated from placeholder to actual Vitest setup. Removed "NOT CONFIGURED" status. Added real patterns, config details, and Svelte 5 compatibility notes.
