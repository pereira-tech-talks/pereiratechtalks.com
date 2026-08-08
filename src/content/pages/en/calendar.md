---
title: Community calendar
description: Shared calendar for Pereira's tech community — Pereira Tech Talks meetups and allied community events across Risaralda.
lastUpdated: 2026-08-07
---

## Community calendar hub

The `/calendar` page aggregates **public Google Calendar** feeds from Pereira Tech Talks and allied Pereira tech communities. It is a static page on Cloudflare Pages — no API keys, only embeddable public calendar IDs configured in `src/content/communityCalendars/`.

### Features

- **Month and agenda views** via Google Calendar embed
- **Community filters** to show or hide individual calendar feeds
- **ICS subscribe links** per active community
- **Luma RSVP** for Pereira Tech Talks primary events (`https://luma.com/pertechtalks`)
- **Proposal form** on the same page (`#calendar-intake`) for allied organizers to submit a public Google Calendar ID

### Routes

- Spanish (primary): [/calendar](/calendar)
- English: [/en/calendar](/en/calendar)

### Configuration

Each community calendar is a YAML file under `src/content/communityCalendars/` with:

- `name` / `description` (bilingual `en` + `es`)
- `googleCalendarId` (public embed ID)
- `color` (hex, used in legend and embed)
- `website`, `lumaUrl` (optional, `https://` only)
- `active`, `order`, `primary`

Inactive entries appear under “More communities coming soon” until organizers share a verified public ID.
