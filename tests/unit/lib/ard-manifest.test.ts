/**
 * The ARD capability manifest, `/.well-known/ai-catalog.json`.
 *
 * A capability manifest is a promise: it tells a registry what this origin
 * offers, and a registry that indexes a 404 has been lied to. So this suite
 * checks two different things — that the file satisfies the spec, and that
 * **every URL it advertises actually exists in the build**.
 *
 * The second half is the one that matters over time. The manifest is a static
 * file, so nothing else notices when an endpoint it names is renamed or
 * dropped.
 *
 * Spec: https://agenticresourcediscovery.org/ ·
 * https://isitagentready.com/.well-known/agent-skills/ard/SKILL.md
 *
 * Part of PLAN_branch_audit_and_pr Task 5.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const MANIFEST_PATH = join(ROOT, 'public', '.well-known', 'ai-catalog.json');
const ORIGIN = 'https://pereiratechtalks.org';

type Entry = {
  identifier: string;
  displayName: string;
  description?: string;
  type: string;
  url?: string;
  data?: unknown;
  representativeQueries: string[];
};

type Manifest = {
  specVersion: string;
  host: { displayName: string; identifier: string };
  entries: Entry[];
};

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8')) as Manifest;

describe('ai-catalog.json — shape required by the ARD spec', () => {
  it('declares a non-empty specVersion', () => {
    expect(typeof manifest.specVersion).toBe('string');
    expect(manifest.specVersion.trim().length).toBeGreaterThan(0);
  });

  it('names its host with a stable identifier', () => {
    expect(manifest.host.displayName.trim().length).toBeGreaterThan(0);
    // `did:web` resolves through /.well-known/did.json, which this origin
    // already serves — so the identifier is verifiable, not decorative.
    expect(manifest.host.identifier).toBe('did:web:pereiratechtalks.org');
    expect(existsSync(join(ROOT, 'public', '.well-known', 'did.json'))).toBe(
      true
    );
  });

  it('carries at least one entry', () => {
    expect(Array.isArray(manifest.entries)).toBe(true);
    expect(manifest.entries.length).toBeGreaterThan(0);
  });

  it('gives every entry a well-formed urn:air identifier', () => {
    const pattern = /^urn:air:pereiratechtalks\.org:[a-z0-9-]+:[a-z0-9-]+$/;
    for (const entry of manifest.entries) {
      expect(entry.identifier, entry.displayName).toMatch(pattern);
    }
  });

  it('gives every entry a unique identifier', () => {
    const ids = manifest.entries.map((e) => e.identifier);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every entry a display name and a media type', () => {
    for (const entry of manifest.entries) {
      expect(
        entry.displayName?.trim().length,
        entry.identifier
      ).toBeGreaterThan(0);
      // A media type, not a bare word.
      expect(entry.type, entry.identifier).toMatch(/^[a-z]+\/[a-z0-9.+-]+$/i);
    }
  });

  it('gives every entry exactly one of url or data', () => {
    for (const entry of manifest.entries) {
      const has = [entry.url !== undefined, entry.data !== undefined];
      expect(has.filter(Boolean).length, entry.identifier).toBe(1);
    }
  });

  it('gives every entry between two and five representative queries', () => {
    for (const entry of manifest.entries) {
      const q = entry.representativeQueries;
      expect(Array.isArray(q), entry.identifier).toBe(true);
      expect(q.length, entry.identifier).toBeGreaterThanOrEqual(2);
      expect(q.length, entry.identifier).toBeLessThanOrEqual(5);
      for (const one of q) {
        // Registries embed these. A vague query makes the entry unfindable.
        expect(one.trim().split(/\s+/).length, one).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('addresses every url absolutely, on this origin, over https', () => {
    for (const entry of manifest.entries) {
      if (!entry.url) continue;
      expect(entry.url, entry.identifier).toMatch(
        new RegExp(`^${ORIGIN.replace('.', '\\.')}/`)
      );
    }
  });

  it('asks agents questions in both site languages', () => {
    // Spanish is the community's primary language; a manifest indexed only in
    // English would be found only by English speakers.
    const all = manifest.entries.flatMap((e) => e.representativeQueries);
    const spanishMarkers = /[áéíóúñ¿]|\b(qué|cuándo|cómo|cuál|los|las|del)\b/i;
    expect(all.some((q) => spanishMarkers.test(q))).toBe(true);
    expect(all.some((q) => !spanishMarkers.test(q))).toBe(true);
  });
});

/**
 * The half that rots. Every advertised resource must be something this repo
 * actually publishes — checked against `public/` and `src/pages/`, so it holds
 * without needing a build.
 */
describe('ai-catalog.json — everything it advertises exists', () => {
  /** Where a public URL comes from in this repo, if anywhere. */
  function sourceFor(url: string): string | null {
    const path = url.slice(ORIGIN.length);
    const candidates = [
      join(ROOT, 'public', path),
      // `/api/x.json` → `src/pages/api/x.json.ts`
      join(ROOT, 'src', 'pages', `${path.replace(/^\//, '')}.ts`),
      // `/index.md` → `src/pages/index.md.ts`
      join(ROOT, 'src', 'pages', `${path.replace(/^\//, '')}.ts`),
    ];
    return candidates.find((c) => existsSync(c)) ?? null;
  }

  for (const entry of manifest.entries) {
    if (!entry.url) continue;
    it(`${entry.identifier} points at something this repo publishes`, () => {
      expect(
        sourceFor(entry.url as string),
        `${entry.url} has no source in public/ or src/pages/`
      ).not.toBeNull();
    });
  }

  it('serves the manifest with the headers the spec requires', () => {
    const headers = readFileSync(join(ROOT, 'public', '_headers'), 'utf-8');
    const block = headers
      .split(/\n(?=\S)/)
      .find((b) => b.startsWith('/.well-known/ai-catalog.json'));
    expect(block, 'no _headers rule for the manifest').toBeTruthy();
    expect(block).toMatch(/Content-Type:\s*application\/json/i);
    // Required, not optional: a registry indexes this cross-origin.
    expect(block).toMatch(/Access-Control-Allow-Origin:\s*\*/i);
  });

  it('is not disallowed by robots.txt, nor is anything it advertises', () => {
    const robots = readFileSync(join(ROOT, 'public', 'robots.txt'), 'utf-8');
    expect(robots).toContain('/.well-known/ai-catalog.json');
    // The open-calls manifest sits under the blanket `Disallow: /api/`, so it
    // needs its own Allow — advertising a path we tell crawlers to skip is a
    // contradiction.
    const advertisesOpenCalls = manifest.entries.some((e) =>
      e.url?.includes('/api/cfs-open.json')
    );
    if (advertisesOpenCalls) {
      expect(robots).toMatch(/^Allow:\s*\/api\/cfs-open\.json/m);
    }
  });
});
