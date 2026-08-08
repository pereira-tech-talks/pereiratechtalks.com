/**
 * Regression: meetup/blog filename date prefix must match frontmatter dates.
 * Part of PLAN_audit_meetup_blog_date_parity Task 12.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = join(process.cwd(), 'src/content');
const DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})_/;

function listContentFiles(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter(
        (f) => (f.endsWith('.md') || f.endsWith('.mdx')) && !f.startsWith('.')
      )
      .map((f) => join(dir, f));
  } catch {
    return [];
  }
}

function frontmatterBlock(text: string): string {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  return m?.[1] ?? '';
}

function fieldDate(fm: string, key: string): string | null {
  const m = fm.match(
    new RegExp(`^${key}:\\s*['"]?(\\d{4}-\\d{2}-\\d{2})`, 'm')
  );
  return m?.[1] ?? null;
}

describe('content date parity (filename ↔ frontmatter)', () => {
  it('meetups: filename date equals date and pubDate', () => {
    const files = listContentFiles(join(ROOT, 'meetups')).filter(
      (p) =>
        !p.includes(`${join('meetups', 'en')}`) &&
        !p.includes(`${join('meetups', 'es')}`)
    );
    expect(files.length).toBeGreaterThan(50);

    const mismatches: string[] = [];
    for (const path of files) {
      const name = path.split('/').pop() ?? '';
      const prefix = name.match(DATE_PREFIX)?.[1];
      if (!prefix) {
        mismatches.push(`${name}: missing YYYY-MM-DD_ prefix`);
        continue;
      }
      const fm = frontmatterBlock(readFileSync(path, 'utf8'));
      const date = fieldDate(fm, 'date');
      const pubDate = fieldDate(fm, 'pubDate');
      if (date && date !== prefix) {
        mismatches.push(`${name}: date ${date} ≠ filename ${prefix}`);
      }
      if (pubDate && pubDate !== prefix) {
        mismatches.push(`${name}: pubDate ${pubDate} ≠ filename ${prefix}`);
      }
      if (date && pubDate && date !== pubDate) {
        mismatches.push(`${name}: date ${date} ≠ pubDate ${pubDate}`);
      }
    }
    expect(mismatches).toEqual([]);
  });

  it('blog EN/ES: filename date equals pubDate (non-demo)', () => {
    const mismatches: string[] = [];
    for (const lang of ['en', 'es'] as const) {
      const dir = join(ROOT, 'blog', lang);
      const files = listContentFiles(dir).filter((p) => !p.includes('_demo'));
      expect(files.length).toBeGreaterThan(5);
      for (const path of files) {
        const name = path.split('/').pop() ?? '';
        const prefix = name.match(DATE_PREFIX)?.[1];
        if (!prefix) {
          mismatches.push(`${lang}/${name}: missing date prefix`);
          continue;
        }
        const fm = frontmatterBlock(readFileSync(path, 'utf8'));
        const pubDate = fieldDate(fm, 'pubDate') ?? fieldDate(fm, 'date');
        if (pubDate && pubDate !== prefix) {
          mismatches.push(
            `${lang}/${name}: pubDate ${pubDate} ≠ filename ${prefix}`
          );
        }
      }
    }
    expect(mismatches).toEqual([]);
  });
});
