/**
 * Meta descriptions must land in the 130–160 band `CLAUDE.md` requires, without
 * inventing text to get there.
 *
 * Task 10 of PLAN_sitewide_language_seo_aeo_audit found 284 of 482 URLs outside
 * the band. The cause was structural — pages handed the layout a field authored
 * for a different job — so the fix is a composer, and these are its contract.
 */
import { describe, expect, it } from 'vitest';

import {
  buildMetaDescription,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  metaPhrases,
  truncateToBand,
} from '@/lib/meta-description';

const LONG =
  'How to contribute to Pereira Tech Talks — from giving a talk to writing for the blog to maintaining the open-source website. Every kind of contribution has a clear path and a real impact for the community.';

describe('truncateToBand', () => {
  it('leaves text already inside the band alone', () => {
    expect(truncateToBand('short text', DESCRIPTION_MAX)).toBe('short text');
  });

  it('never exceeds the maximum', () => {
    expect(truncateToBand(LONG, DESCRIPTION_MAX).length).toBeLessThanOrEqual(
      DESCRIPTION_MAX
    );
  });

  it('never cuts a word in half', () => {
    const out = truncateToBand(LONG, DESCRIPTION_MAX);
    const tail = out.replace(/…$/, '').split(' ').pop() ?? '';
    expect(LONG.split(/\s+/)).toContain(tail);
  });

  it('prefers a sentence boundary when one leaves enough text', () => {
    const out = truncateToBand(LONG, DESCRIPTION_MAX, 0);
    expect(out.endsWith('.')).toBe(true);
    expect(out).not.toContain('…');
  });

  it('REGRESSION: does not cut back below the minimum to find a full stop', () => {
    // The first version preferred the sentence boundary unconditionally, so
    // appending a clause to a 126-char lead and then trimming returned the
    // 126-char lead — a silent no-op on 131 pages.
    const lead =
      'Pereira Tech Talks meetup — Internal programming marathon at UTP. Community archive page with the program.';
    const extended = `${lead} Part of the Pereira Tech Talks community archive in Pereira, Risaralda, Colombia.`;
    const out = truncateToBand(extended, DESCRIPTION_MAX, DESCRIPTION_MIN);
    expect(out.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
    expect(out.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    expect(out).not.toBe(lead);
  });
});

describe('buildMetaDescription', () => {
  const phrases = metaPhrases('en');

  it('returns a short lead unchanged when there is nothing true to add', () => {
    expect(buildMetaDescription({ lead: 'A short bio.', lang: 'en' })).toBe(
      'A short bio.'
    );
  });

  it('extends a short lead into the band using the given facts', () => {
    const out = buildMetaDescription({
      lead: 'Electrical engineer and researcher.',
      clauses: [phrases.speakerTalks(3), phrases.community],
      lang: 'en',
    });
    expect(out.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
    expect(out.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    expect(out.startsWith('Electrical engineer and researcher.')).toBe(true);
  });

  it('stops adding clauses once the minimum is reached', () => {
    const lead = 'x'.repeat(DESCRIPTION_MIN + 5);
    expect(
      buildMetaDescription({ lead, clauses: [phrases.community], lang: 'en' })
    ).toBe(lead);
  });

  it('never repeats a clause the lead already states', () => {
    const clause = phrases.community;
    const out = buildMetaDescription({
      lead: `A short intro. ${clause}`,
      clauses: [clause],
      lang: 'en',
    });
    expect(out.split('Part of the Pereira Tech Talks').length - 1).toBe(1);
  });

  it('skips a clause that would overshoot and tries the next', () => {
    const out = buildMetaDescription({
      lead: 'A lead of moderate length that needs a little more to reach the band.',
      clauses: [
        'x'.repeat(200),
        'A compact and entirely true closing clause here.',
      ],
      lang: 'en',
    });
    expect(out).not.toContain('xxxxx');
    expect(out).toContain('compact and entirely true');
  });

  it('caps at the maximum no matter what it is given', () => {
    const out = buildMetaDescription({
      lead: LONG,
      clauses: [phrases.community],
      lang: 'en',
    });
    expect(out.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
  });

  it('adds nothing when no clauses are supplied — never invents text', () => {
    const lead = 'Too short.';
    expect(buildMetaDescription({ lead, lang: 'en' })).toBe(lead);
  });

  it('carries Spanish phrasing on Spanish pages', () => {
    const es = metaPhrases('es');
    expect(es.community).toContain('Parte del archivo');
    expect(es.talkCount(2)).toBe('2 charlas esa noche');
    expect(es.talkCount(1)).toBe('1 charla esa noche');
  });

  it('pluralizes English clauses correctly', () => {
    expect(phrases.talkCount(1)).toBe('1 talk on the night');
    expect(phrases.talkCount(4)).toBe('4 talks on the night');
  });
});
