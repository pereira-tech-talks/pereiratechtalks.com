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

  it('talk collection floor after exhaustive talk mapping (≥160)', () => {
    const count = readdirSync(TALKS).filter((f) =>
      /\.(md|mdx|yaml)$/.test(f)
    ).length;
    expect(count).toBeGreaterThanOrEqual(160);
  });

  it('every meetup speakers[] slug has a talk for that meetup', () => {
    const talkMeta = readdirSync(TALKS)
      .filter((f) => /\.(md|mdx|yaml)$/.test(f))
      .map((file) => {
        const id = file.replace(/\.(md|mdx|yaml)$/i, '');
        const text = readFileSync(join(TALKS, file), 'utf8');
        const fm = frontmatter(text) || text;
        const slug =
          fm.match(/slug:\s*"([^"]+)"/)?.[1] ||
          fm.match(/slug:\s*([^\n]+)/)?.[1]?.trim();
        return { id, speakers: listBlock(fm, 'speakers'), slug };
      });
    const gaps: string[] = [];
    for (const file of readdirSync(MEETUPS).filter((f) => f.endsWith('.md'))) {
      const fm = frontmatter(readFileSync(join(MEETUPS, file), 'utf8'));
      if (/^draft:\s*true/m.test(fm)) continue;
      const meetupSlug = file
        .replace(/^\d{4}-\d{2}-\d{2}_/, '')
        .replace(/\.md$/, '');
      for (const speaker of listBlock(fm, 'speakers')) {
        const ok = talkMeta.some(
          (t) =>
            t.speakers.includes(speaker) &&
            (t.id.startsWith(`${meetupSlug}--`) || t.slug === meetupSlug)
        );
        if (!ok) gaps.push(`${file} → ${speaker}`);
      }
    }
    expect(gaps, gaps.join('\n')).toEqual([]);
  });

  it('sergio-florez has at least 8 talk files', () => {
    let count = 0;
    for (const file of readdirSync(TALKS).filter((f) =>
      /\.(md|mdx|yaml)$/.test(f)
    )) {
      const text = readFileSync(join(TALKS, file), 'utf8');
      const fm = frontmatter(text) || text;
      if (listBlock(fm, 'speakers').includes('sergio-florez')) count += 1;
    }
    expect(count).toBeGreaterThanOrEqual(8);
  });

  it('PTD 2024 has 10 talk files linked to pereiraTechDays/2024', () => {
    let count = 0;
    for (const file of readdirSync(TALKS).filter((f) =>
      f.startsWith('ptd-2024--')
    )) {
      const text = readFileSync(join(TALKS, file), 'utf8');
      const fm = frontmatter(text) || text;
      if (
        /collection:\s*pereiraTechDays/.test(fm) &&
        /slug:\s*"?2024"?/.test(fm)
      ) {
        count += 1;
      }
    }
    expect(count).toBe(10);
  });

  it('sergio-florez speaker YAML uses personal xergioalex social URLs', () => {
    const text = readFileSync(join(SPEAKERS, 'sergio-florez.yaml'), 'utf8');
    expect(text).toContain('https://xergioalex.com/');
    expect(text).toContain('https://www.linkedin.com/in/xergioalex/');
    expect(text).toContain('https://x.com/XergioAleX');
    expect(text).not.toContain('linkedin.com/company/pereira-tech-talks');
  });
});
