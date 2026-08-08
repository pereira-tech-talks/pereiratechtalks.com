import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getMeetups } from '@/lib/meetup';
import { getEditions } from '@/lib/pereiraTechDay';
import { getSpeakers } from '@/lib/speaker';
import { getActiveSponsors } from '@/lib/sponsor';
import { getTalks } from '@/lib/talk';

export interface CommunityStats {
  meetups: number;
  talks: number;
  speakers: number;
  editions: number;
  sponsorsActive: number;
  sinceYear: number;
  attendeesApproximate: number | null;
  display: {
    meetups: string;
    talks: string;
    speakers: string;
    attendees: string;
    sinceYear: string;
  };
}

interface CommunityMetricsOverride {
  attendeesApproximate?: number;
  attendeesDisplay?: string;
}

function loadOverrides(): CommunityMetricsOverride {
  try {
    const raw = readFileSync(
      resolve(process.cwd(), 'src/data/community-metrics.yaml'),
      'utf8'
    );
    const out: CommunityMetricsOverride = {};
    const approx = raw.match(/attendeesApproximate:\s*(\d+)/);
    const display = raw.match(/attendeesDisplay:\s*"([^"]+)"/);
    if (approx) out.attendeesApproximate = Number(approx[1]);
    if (display) out.attendeesDisplay = display[1];
    return out;
  } catch {
    return {};
  }
}

function formatCount(n: number): string {
  return String(n);
}

/**
 * Build-time community counters derived from Content Collections.
 * Attendees stay override-only (not stored per meetup yet).
 */
export async function getCommunityStats(): Promise<CommunityStats> {
  const [meetups, talks, speakers, editions, sponsorsActive] =
    await Promise.all([
      getMeetups(),
      getTalks(),
      getSpeakers(),
      getEditions(),
      getActiveSponsors(),
    ]);

  const publishedMeetups = meetups.filter((m) => !m.data.draft);
  const years = publishedMeetups
    .map((m) => new Date(m.data.date).getUTCFullYear())
    .filter((y) => Number.isFinite(y));
  const sinceYear = years.length ? Math.min(...years) : 2014;

  const overrides = loadOverrides();
  const attendeesApproximate = overrides.attendeesApproximate ?? null;

  return {
    meetups: publishedMeetups.length,
    talks: talks.length,
    speakers: speakers.length,
    editions: editions.length,
    sponsorsActive: sponsorsActive.length,
    sinceYear,
    attendeesApproximate,
    display: {
      meetups: formatCount(publishedMeetups.length),
      talks: formatCount(talks.length),
      speakers: formatCount(speakers.length),
      attendees:
        overrides.attendeesDisplay ??
        (attendeesApproximate != null
          ? formatCount(attendeesApproximate)
          : '—'),
      sinceYear: String(sinceYear),
    },
  };
}
