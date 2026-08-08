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
| Call for Speakers | `SpeakersApplicationForm.svelte` | `/call-for-speakers` | `cfs` | PTT Call for Speakers |
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
