# Community intake forms (Dailybot)

Every public Pereira Tech Talks intake form posts to the Cloudflare Pages
Function `POST /api/contact` (`functions/api/contact.ts`), which forwards
structured responses to the **Dailybot Forms** public API. Dailybot is the
**system of record**. Optional **Resend** auto-ack may run after a successful
Dailybot `201` and must never block success.

There is no local Dailybot mock — exercising Forms against a real
`DAILYBOT_API_KEY` hits the live Pereira Tech Talks org. Prefer unit tests for
mapping; when you must smoke, prefix subjects/messages with `[TEST]` and delete
junk responses afterward.

Canonical UUIDs and choice lookups live in `functions/api/_dailybot.ts`.

## Overview

| Form | UI | Route | `_form` | Dailybot form |
|------|----|-------|---------|---------------|
| Contact | `ContactForm.svelte` | `/contact`, `/en/contact` | `contact` | PTT Contact |
| Call for Speakers (global) | `SpeakersApplicationForm.svelte` (`mode="global"`) | `/call-for-speakers` | `cfs` | PTT Call for Speakers |
| Call for Speakers (per meetup) | `SpeakersApplicationForm.svelte` (`mode="meetup"`) | `/meetups/{slug}#call-for-speakers` | `cfs` | PTT Call for Speakers |
| Speaker School | `SpeakerSchoolForm.svelte` | `/verticals/speaker-school` | `speaker-school` | PTT Speaker School |
| Sponsors | `SponsorInquiryForm.svelte` | `/sponsor-us` | `sponsor` | PTT Sponsors |
| Community calendar | `CalendarIntakeForm.svelte` | `/calendar#calendar-intake` | `calendar` | PTT Community Calendar |
| Code of Conduct | `ConductReportForm.svelte` | `/conduct#conduct-report-form` | `conduct` | PTT Code of Conduct |

Newsletter signup is disabled in the UI and has **no** Google Forms (or other)
backend until a Dailybot form is added for it.

## Environment

| Variable | Where | Notes |
|----------|-------|-------|
| `DAILYBOT_API_KEY` | Cloudflare / local Functions only | **Never** `PUBLIC_*`. Header `X-API-KEY`. |
| `PUBLIC_CONTACT_API_ENDPOINT` | Build | Optional override. Defaults to `/api/contact` in `CONTACT_FORM`. |
| `RESEND_API_KEY` + `CONTACT_FROM_EMAIL` | Optional | Submitter ack after Dailybot success |
| `CONTACT_TO_*` | Optional | Legacy org-mirror inboxes if Resend mirror is enabled |
| `CONTACT_RATE_LIMIT` / `CONTACT_RATE_WINDOW_MS` | Optional | Default 8 / 600000 |
| `CONTACT_ALLOWED_ORIGINS` | Optional | CORS allowlist |

Local stub: `docker/local/pertechtalks/.env.example`.  
Rotation notes: [ENVIRONMENT_SETUP.md](../ENVIRONMENT_SETUP.md).

**Local Functions:** plain `pnpm run dev` does **not** run Cloudflare Pages
Functions. Use `wrangler pages dev` (or a Preview deploy) with
`DAILYBOT_API_KEY` bound for end-to-end form smoke. Operator checklist for
secrets + optional labeled smokes:
`.dwp/plans/PLAN_dailybot_forms_integration/analysis_results/ENV_SMOKE_CHECKLIST.md`
(plan-local; not in git).

## API contract

```json
{
  "_form": "contact",
  "email": "…",
  "lang": "es",
  "page_path": "/contact/",
  "website": "",
  "…formFields": "…"
}
```

- `_form`: `contact` \| `cfs` \| `speaker-school` \| `sponsor` \| `calendar` \| `conduct`
- `slidesUrl` (optional, `cfs` only): link to the deck, or to where it will be
  published. Capped at 300 chars; a non-`http(s)` URI scheme is dropped
- `profilePhoto` (optional, `cfs` only): a photo URL **or** a note like "use my
  LinkedIn photo". Capped at 300 chars; a non-`http(s)` URI scheme is dropped
- `meetupSlug` (optional, `cfs` only): the meetup a proposal targets. Sent by the
  meetup-scoped form; omitted from the global page. The server maps it to the
  canonical `https://pereiratechtalks.org/meetups/{slug}/` and sends `''` when
  absent
- Legacy without `_form`: `reason`/`topic` maps `tech-talk`→`cfs`, `sponsorship`→`sponsor`, `conduct`→`conduct`, else→`contact`
- Honeypot `website` must be empty (fake `200` if filled; never forwarded)
- Dailybot POST: `https://api.dailybot.com/v1/forms/{uuid}/responses/` with `{ content, automation: true }`

### Multiple-choice values

This org’s Dailybot forms use **choice value === label** (e.g. `"General"`).
Server helpers map site slugs (`general`, `lightning`, `gold`) → labels via
`lookupChoice` in `_dailybot.ts`. Do not invent a parallel slugify POST contract.

Booleans send JSON `true` / `false` (Dailybot `boolean` question type).

## Form UUIDs

| Form | UUID |
|------|------|
| PTT Contact | `cd036d4a-2bde-48ef-83da-3fa69d91d971` |
| PTT Call for Speakers | `2a3b568c-9255-4d5a-a29c-8f220ae427ce` |
| PTT Speaker School | `a7bb66f2-082c-4d36-b687-13d4d1c5ed80` |
| PTT Sponsors | `f3469d2d-df7b-4007-8ff8-e8c61de7b80d` |
| PTT Community Calendar | `22f3540c-669d-42b8-8365-abed7bb07cda` |
| PTT Code of Conduct | `ce944b4b-bd99-4836-a14e-c583773952a4` |

Public intakes report to Slack `#all-pereira-tech-talks` (`C0BNTQVCGJ2`).
**Code of Conduct** is `owner_and_admins` only, `--no-public`, **no** Slack
report channel.

### Question UUID map (summary)

Full constants: `CONTACT_Q`, `CFS_Q`, `SPEAKER_SCHOOL_Q`, `SPONSORS_Q`,
`CALENDAR_Q`, `CONDUCT_Q` in `functions/api/_dailybot.ts`.

Every form includes `lang` (Spanish / English) and `page_path` (normalized
pathname metadata).

### Call for Speakers — the `Meetup (URL)` question

`CFS_Q.MEETUP` = `00969219-78f1-442f-a12a-2fa890ab9002` — an **optional** short
text at index 4 (right after `Format`, so the Slack report reads "which meetup /
which format" together). It carries the canonical meetup URL, or `''` for a
proposal submitted from the global `/call-for-speakers` page.

Deliberately **not** a multiple choice. This org's MC values equal their labels,
so a per-meetup choice list would need the remote form edited every time a meetup
is programmed, and any drift would fail real submissions with
`["response is not valid"]`. A URL is stable and clickable in Slack.

Verified live (2026-08): an optional text question accepts `''` — same shape
`CFS_Q.NOTES` already ships.

### Call for Speakers — the `Slides` question

`CFS_Q.SLIDES` = `1e9d72d9-d8d8-4143-862e-cbe8d14f6cc1` — an **optional** short
text at index 7, next to `Abstract` and `Takeaways` because it is talk material,
not contact detail.

It is the field reviewers most want filled: the deck shows the narrative, which
is what separates a good short talk from a list of bullet points. Speakers are
told explicitly that a link to an **unfinished** deck is welcome — the point is
to see it early enough to suggest changes — and that good narrative scores
higher in selection.

Same server-side handling as `profilePhoto`: capped at 300 and passed through
`sanitiseClickableText`, which drops a non-`http(s)` URI scheme. A reviewer
clicks this link.

### Call for Speakers — the `Profile photo` question

`CFS_Q.PROFILE_PHOTO` = `34a40932-c9b9-46ab-a189-2bcc39d64e6d` — an **optional**
short text at index 8, right after `Social / site URL` so the two read together
in the Slack report.

It deliberately accepts **either a URL or prose** ("use my LinkedIn photo"): a
speaker who has already shared a profile link should not have to go and find an
image URL. The client renders it as `type="text"`, not `type="url"`, because a
url input would reject the sentence.

Server-side it is length-capped at 300 and passed through `sanitiseProfilePhoto`,
which drops the value when it looks like a URI with a scheme other than
`http`/`https` — an organiser reads and may click this, so a `javascript:` or
`data:` value is never stored or echoed. Anything without a scheme is kept
verbatim as prose.

### `GET /api/cfs-open.json` — the open-calls manifest

A build-time JSON endpoint listing the meetups accepting proposals right now,
derived from `getOpenCallsForSpeakers()` in `src/lib/meetup.ts` (so the
auto-close rule applies: a call whose meetup date or `closesAt` has passed never
appears). Public data only; drafts are excluded in production.

```jsonc
{
  "version": 1,
  "generatedAt": "2026-08-27T00:00:00.000Z",
  "calls": [
    {
      "slug": "november-meetup-2026",
      "url": "https://pereiratechtalks.org/meetups/november-meetup-2026/",
      "title": { "es": "Meetup de noviembre", "en": "November meetup" },
      "date": "2026-11-18",
      "dateConfidence": "confirmed",
      "formats": ["lightning"],
      "closesAt": "2026-11-04",
      "slots": 3
    }
  ]
}
```

Dates are `YYYY-MM-DD` calendar strings, not ISO instants. `closesAt`, `slots`
and `note` are omitted when unset, never `null`.

### CFS meetup validation — the failure matrix

`functions/api/contact.ts` resolves a submitted `meetupSlug` against that
manifest (`functions/_lib/cfs-manifest.ts`) **after** the honeypot and the rate
limiter, so a bot cannot make the worker fan out.

| Case | Result | Meetup value sent |
|---|---|---|
| No `meetupSlug` | proceeds; no manifest fetch | `''` |
| Slug fails `^[a-z0-9][a-z0-9-]{0,79}$` | proceeds | `''` |
| Manifest unreachable, timed out or malformed | proceeds | `''` |
| Slug well-formed but not in the manifest | proceeds | `''` |
| Slug present, `format` not in that meetup's `formats` | **400 `format_not_allowed_for_meetup`** | — |
| Slug present, format accepted | proceeds | canonical URL |

**The asymmetry is deliberate.** Availability failures are ours and must never
cost a speaker their proposal — Dailybot is the system of record and a human
still sees the submission. A format outside the meetup's allowed set cannot be
produced by the real UI (the control is constrained client-side), so it is
tampering or a bug, and it is refused.

The manifest URL is built from `request.url`, never from request-body content,
so no caller can redirect the fetch. It is `AbortController`-bounded at 3 s and
cached in an isolate-local variable for 60 s.

## Anti-spam & privacy

1. Honeypot `website` on every client form
2. Length caps + email validation (`src/lib/contact-form.ts`)
3. Isolate-local rate limit on `/api/contact`
4. CoC: anonymous mode omits reporter name/email server-side; analytics events
   must never include incident text (`conduct_report_submit` → `{ anonymous }` only)

## Client modules

- Validators / helpers: `src/lib/contact-form.ts`, `src/lib/form-ui.ts`
- Shared UX: idle / submitting / success + submit-another; focus first invalid;
  `aria-invalid` / `aria-describedby` / live regions
- Unit tests: `tests/unit/lib/contact-form.test.ts`,
  `tests/unit/functions/dailybot.test.ts`,
  `tests/unit/functions/contact-dailybot.test.ts`

## Related docs

- [Contact form (legacy note)](./CONTACT_FORM.md) — points here
- [Security](../SECURITY.md) — threat model for intakes + CoC
- [Call for Speakers](../CALL_FOR_SPEAKERS.md)
- [Sponsorship](../SPONSORSHIP.md)
- [Analytics](../ANALYTICS.md) — form submit events
