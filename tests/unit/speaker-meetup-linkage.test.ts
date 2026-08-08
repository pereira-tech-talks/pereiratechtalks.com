import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const MEETUPS = join(ROOT, 'src/content/meetups');
const SPEAKERS = join(ROOT, 'src/content/speakers');
const TALKS = join(ROOT, 'src/content/talks');
const PTD = join(ROOT, 'src/content/pereiraTechDays');

function frontmatter(text: string): string {
  const parts = text.split(/^---$/m);
  return parts.length >= 3 ? parts[1] : '';
}

function listBlock(fm: string, key: string): string[] {
  const re = new RegExp(`^${key}:\\n((?:  - .+\\n)*)`, 'm');
  const match = fm.match(re);
  if (!match?.[1]?.trim()) return [];
  return match[1]
    .split('\n')
    .map((line) => line.match(/^\s+- (.+)/)?.[1]?.trim())
    .filter((v): v is string => Boolean(v));
}

describe('speaker / meetup / talk linkage invariants', () => {
  it('every meetup speakers[] slug resolves to a speaker YAML file', () => {
    const dangling: string[] = [];
    for (const file of readdirSync(MEETUPS).filter((f) => f.endsWith('.md'))) {
      const fm = frontmatter(readFileSync(join(MEETUPS, file), 'utf8'));
      for (const slug of listBlock(fm, 'speakers')) {
        if (!existsSync(join(SPEAKERS, `${slug}.yaml`))) {
          dangling.push(`${file} → ${slug}`);
        }
      }
    }
    expect(dangling, dangling.join('\n')).toEqual([]);
  });

  it('every talk speakers[] slug resolves to a speaker YAML file', () => {
    const dangling: string[] = [];
    for (const file of readdirSync(TALKS).filter((f) =>
      /\.(md|mdx|yaml)$/.test(f)
    )) {
      const text = readFileSync(join(TALKS, file), 'utf8');
      const fm = frontmatter(text) || text;
      for (const slug of listBlock(fm, 'speakers')) {
        if (!existsSync(join(SPEAKERS, `${slug}.yaml`))) {
          dangling.push(`${file} → ${slug}`);
        }
      }
    }
    expect(dangling, dangling.join('\n')).toEqual([]);
  });

  it('PTD lightning/keynote speaker: fields resolve to speaker YAML files', () => {
    const dangling: string[] = [];
    for (const file of readdirSync(PTD).filter((f) => /\.ya?ml$/.test(f))) {
      const text = readFileSync(join(PTD, file), 'utf8');
      for (const match of text.matchAll(/^\s+- speaker:\s*(\S+)/gm)) {
        const slug = match[1];
        if (!existsSync(join(SPEAKERS, `${slug}.yaml`))) {
          dangling.push(`${file} → ${slug}`);
        }
      }
    }
    expect(dangling, dangling.join('\n')).toEqual([]);
  });

  it('speaker roster is at least the exhaustive-census success floor (80)', () => {
    const count = readdirSync(SPEAKERS).filter((f) =>
      f.endsWith('.yaml')
    ).length;
    expect(count).toBeGreaterThanOrEqual(80);
  });
});
