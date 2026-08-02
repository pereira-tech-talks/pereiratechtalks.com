import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EVENTS, PII_DENYLIST_KEYS } from '@/lib/analytics';

const SRC_ROOT = join(process.cwd(), 'src');

/** Recursively collect .ts, .svelte, .astro files under src/ */
function collectSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(full));
      continue;
    }
    if (/\.(ts|svelte|astro)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

describe('analytics privacy lint', () => {
  it('EVENTS values do not contain email-like strings', () => {
    for (const value of Object.values(EVENTS)) {
      expect(value).not.toMatch(/@/);
      expect(value.toLowerCase()).not.toContain('email');
    }
  });

  it('trackEvent calls in src/ do not pass obvious PII keys', () => {
    const piiPattern = new RegExp(
      `trackEvent\\([^)]+\\{[^}]*\\b(${PII_DENYLIST_KEYS.join('|')})\\s*:`,
      'i'
    );

    const offenders: string[] = [];
    for (const file of collectSourceFiles(SRC_ROOT)) {
      const content = readFileSync(file, 'utf8');
      if (piiPattern.test(content)) {
        offenders.push(file.replace(`${process.cwd()}/`, ''));
      }
    }

    expect(offenders).toEqual([]);
  });

  it('data-umami-event-* attributes do not use PII key names', () => {
    const attrPattern = /data-umami-event-(\w+)/g;
    const offenders: string[] = [];

    for (const file of collectSourceFiles(SRC_ROOT)) {
      const content = readFileSync(file, 'utf8');
      let match: RegExpExecArray | null = attrPattern.exec(content);
      while (match !== null) {
        const key = match[1].toLowerCase();
        if (PII_DENYLIST_KEYS.some((denied) => key.includes(denied))) {
          offenders.push(`${file}: data-umami-event-${match[1]}`);
        }
        match = attrPattern.exec(content);
      }
    }

    expect(offenders).toEqual([]);
  });
});
