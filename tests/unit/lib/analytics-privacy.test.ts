import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EVENTS, PII_DENYLIST_KEYS, sanitizeEventData } from '@/lib/analytics';

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

/**
 * The Call for Speakers funnel must be measurable without ever carrying a
 * speaker's identity or their proposal text. Same standard as
 * `conduct_report_submit`, which sends `{ anonymous }` and nothing else.
 *
 * PLAN_meetup_programming_and_call_for_speakers, Task 11.
 */
describe('Call for Speakers funnel events', () => {
  it('are in the catalog with the documented names', () => {
    expect(EVENTS.MEETUP_CFS_SUBMIT).toBe('meetup_cfs_submit');
    expect(EVENTS.CFS_OPEN_CALL_CLICK).toBe('cfs_open_call_click');
    expect(EVENTS.CFS_MEETUP_SELECT).toBe('cfs_meetup_select');
  });

  it('keep the pre-existing submit event, rather than replacing it', () => {
    // meetup_cfs_submit fires IN ADDITION to speaker_application_submit, so the
    // existing funnel keeps its continuity across this change.
    expect(EVENTS.SPEAKER_APPLICATION_SUBMIT).toBe(
      'speaker_application_submit'
    );
  });

  it('carry only a slug, a format and a source through the sanitizer', () => {
    expect(
      sanitizeEventData({
        meetup_slug: 'september-meetup-2026',
        format: 'lightning',
        source: 'rail',
      })
    ).toEqual({
      meetup_slug: 'september-meetup-2026',
      format: 'lightning',
      source: 'rail',
    });
  });

  it('would strip a speaker identity if one were ever added by mistake', () => {
    const sanitized = sanitizeEventData({
      meetup_slug: 'september-meetup-2026',
      name: 'Grace Hopper',
      email: 'grace@example.com',
      message: 'my abstract',
    });
    expect(sanitized).toEqual({ meetup_slug: 'september-meetup-2026' });
  });
});
