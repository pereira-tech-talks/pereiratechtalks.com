# Community stats

Build-time counters for About and marketing surfaces.

## API

`getCommunityStats()` in `src/lib/community-stats.ts` derives:

| Metric | Source |
|--------|--------|
| meetups | non-draft `meetups` collection |
| talks | `talks` collection |
| speakers | `speakers` collection |
| editions | `pereiraTechDays` |
| sponsorsActive | sponsors with `status: active` |
| sinceYear | min meetup calendar year |
| attendees | override only — `src/data/community-metrics.yaml` |

Display prefers exact integers for collection counts. Attendees keep `attendeesDisplay` (e.g. `6.5K+`) until per-event attendance is stored.

## Updating numbers

Add content under `src/content/` and rebuild — meetup/talk/speaker totals update automatically. Edit `community-metrics.yaml` only for attendee approximations.
