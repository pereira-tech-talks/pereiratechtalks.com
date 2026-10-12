/**
 * Lockfile hygiene: `pnpm-lock.yaml` is the only lockfile in this repository.
 *
 * Cloudflare Pages selects the package manager from the lockfiles it finds in
 * the repository root. In 2026-10 a stale `bun.lock` (left behind months
 * earlier, never regenerated) made every production build run
 * `bun install --frozen-lockfile`, which fails in seconds with "lockfile had
 * changes, but lockfile is frozen" — while GitHub Actions, which installs with
 * pnpm explicitly, stayed green. Nothing else notices a second lockfile, so
 * this suite does: it fails the unit suite (and CI "Code Check") the moment
 * one comes back.
 *
 * Part of PLAN_001_cloudflare_pages_build_fix.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();

/** Lockfiles of the package managers Cloudflare Pages can auto-select. */
const FOREIGN_LOCKFILES = [
  'bun.lock',
  'bun.lockb',
  'yarn.lock',
  'package-lock.json',
  'npm-shrinkwrap.json',
];

describe('lockfile hygiene (Cloudflare Pages package-manager detection)', () => {
  it('keeps pnpm-lock.yaml as the lockfile', () => {
    expect(existsSync(join(ROOT, 'pnpm-lock.yaml'))).toBe(true);
  });

  it.each(FOREIGN_LOCKFILES)('has no %s next to pnpm-lock.yaml', (name) => {
    expect(
      existsSync(join(ROOT, name)),
      `${name} must not be committed: Cloudflare Pages would install with that package manager instead of pnpm`
    ).toBe(false);
  });

  it('pins pnpm as the package manager in package.json', () => {
    const pkg = JSON.parse(
      readFileSync(join(ROOT, 'package.json'), 'utf8')
    ) as { packageManager?: string };
    expect(pkg.packageManager).toMatch(/^pnpm@\d+\.\d+\.\d+$/);
  });

  it('ignores the foreign lockfiles so a local install cannot bring one back', () => {
    const ignored = readFileSync(join(ROOT, '.gitignore'), 'utf8')
      .split('\n')
      .map((line) => line.trim());
    for (const name of [
      'bun.lock',
      'bun.lockb',
      'yarn.lock',
      'package-lock.json',
    ]) {
      expect(ignored, `.gitignore must list ${name}`).toContain(name);
    }
  });
});
