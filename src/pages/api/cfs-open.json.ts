import type { APIRoute } from 'astro';

import { getCalendarDateString } from '@/lib/dates';
import { getOpenCallsForSpeakers } from '@/lib/meetup';

/**
 * The meetups accepting talk proposals right now.
 *
 * Built at build time from `getOpenCallsForSpeakers()`, which applies the
 * auto-close rule — a call whose meetup date or `closesAt` has passed never
 * appears here, whatever its frontmatter says.
 *
 * Two consumers:
 *   1. The UI (the programming rail, the global open-calls list, the form's
 *      meetup selector) — via the derivation directly, at build time.
 *   2. `functions/api/contact.ts` — over HTTP, to validate that a submitted
 *      `meetupSlug` names a meetup that is genuinely open, and that the chosen
 *      format is one that meetup accepts.
 *
 * One endpoint serves both languages: the payload carries both titles and the
 * consumer picks. Dates are `YYYY-MM-DD` calendar strings, not ISO instants —
 * they are calendar dates, and serializing them as instants invites a timezone
 * bug at the consumer.
 *
 * Public data only. Drafts are already excluded by `getMeetups()` in
 * production; nothing here is organizer-private.
 */
export const GET: APIRoute = async () => {
  const calls = await getOpenCallsForSpeakers();

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    calls: calls.map((call) => ({
      slug: call.slug,
      url: call.url,
      title: call.title,
      date: getCalendarDateString(call.date),
      dateConfidence: call.dateConfidence,
      formats: call.formats,
      // Omitted rather than null when unset — a consumer checking presence
      // should not have to distinguish "absent" from "explicitly nothing".
      ...(call.closesAt
        ? { closesAt: getCalendarDateString(call.closesAt) }
        : {}),
      ...(typeof call.slots === 'number' ? { slots: call.slots } : {}),
      ...(call.note ? { note: call.note } : {}),
    })),
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
