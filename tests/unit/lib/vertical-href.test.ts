/**
 * A vertical is two things at once: a **taxonomy term** that meetups, events
 * and talks point at, and a **page** describing the programme. Usually one
 * entry serves both.
 *
 * `monthly-meetups` is the exception. `/meetups` carries the full archive, the
 * programming board and the open calls — everything a generated vertical page
 * could say and more — so the page was retired and the term kept: 95 meetups
 * and several events reference that slug.
 *
 * The risk that comes with that split is a link outliving the page it points
 * at. It nearly happened: the meetup twins composed `/verticals/{slug}.md` from
 * the slug, so 95 of them would have linked a file the build no longer emits.
 * These tests pin the rule at its source.
 */
import { describe, expect, it } from 'vitest';

import {
  hasGeneratedVerticalPage,
  resolveVerticalHref,
  resolveVerticalTwinHref,
  type Vertical,
} from '@/lib/vertical';

const vertical = (id: string, href?: string): Vertical =>
  ({ id, data: { ...(href ? { href } : {}) } }) as unknown as Vertical;

describe('a vertical that owns its page', () => {
  const speakerSchool = vertical('speaker-school');

  it('gets a generated page', () => {
    expect(hasGeneratedVerticalPage(speakerSchool)).toBe(true);
  });

  it('links to /verticals/{slug} in both languages', () => {
    expect(resolveVerticalHref(speakerSchool, 'es')).toBe(
      '/verticals/speaker-school/'
    );
    expect(resolveVerticalHref(speakerSchool, 'en')).toBe(
      '/en/verticals/speaker-school/'
    );
  });

  it('links its twin beside its page', () => {
    expect(resolveVerticalTwinHref(speakerSchool, 'es')).toBe(
      '/verticals/speaker-school.md'
    );
    expect(resolveVerticalTwinHref(speakerSchool, 'en')).toBe(
      '/en/verticals/speaker-school.md'
    );
  });
});

describe('a vertical whose home lives elsewhere', () => {
  const monthlyMeetups = vertical('monthly-meetups', '/meetups');

  it('gets no generated page — that is the point of the field', () => {
    expect(hasGeneratedVerticalPage(monthlyMeetups)).toBe(false);
  });

  it('sends readers to its real home, prefixed for their language', () => {
    expect(resolveVerticalHref(monthlyMeetups, 'es')).toBe('/meetups/');
    expect(resolveVerticalHref(monthlyMeetups, 'en')).toBe('/en/meetups/');
  });

  it('sends agents to the twin of that home, not to a file that is gone', () => {
    expect(resolveVerticalTwinHref(monthlyMeetups, 'es')).toBe('/meetups.md');
    expect(resolveVerticalTwinHref(monthlyMeetups, 'en')).toBe(
      '/en/meetups.md'
    );
  });

  it('never points at /verticals/{slug} in any form', () => {
    for (const lang of ['es', 'en'] as const) {
      expect(resolveVerticalHref(monthlyMeetups, lang)).not.toContain(
        '/verticals/'
      );
      expect(resolveVerticalTwinHref(monthlyMeetups, lang)).not.toContain(
        '/verticals/'
      );
    }
  });
});

describe('the page and its twin agree', () => {
  it('for every vertical, the twin is the page path plus .md', () => {
    for (const v of [vertical('ai-channel'), vertical('x', '/meetups')]) {
      for (const lang of ['es', 'en'] as const) {
        const page = resolveVerticalHref(v, lang).replace(/\/$/, '');
        expect(resolveVerticalTwinHref(v, lang)).toBe(`${page}.md`);
      }
    }
  });
});
