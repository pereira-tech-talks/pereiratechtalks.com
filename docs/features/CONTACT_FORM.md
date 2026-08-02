# Contact & community intake (v3)

The site uses a **shared Cloudflare Pages Function** at `POST /api/contact`
(`functions/api/contact.ts`) for:

| Surface | Route | Topic (`reason`) |
|---------|-------|------------------|
| General contact | `/contact` | any allowlisted topic |
| Call for Speakers | `/call-for-speakers` (embedded form) | `tech-talk` |
| Sponsor us | `/sponsor-us` (embedded form) | `sponsorship` |

Prefill on `/contact` uses **`?topic=`** (legacy `?reason=` still accepted as an
alias). Sponsor/CFS deep links should use `topic`.

## Architecture

### Resend (preferred)

Env (Cloudflare secrets / vars):

| Variable | Notes |
|----------|-------|
| `PUBLIC_CONTACT_API_ENDPOINT` | Build-time, e.g. `/api/contact` |
| `RESEND_API_KEY` | Server secret |
| `CONTACT_TO_EMAIL` | Default inbox |
| `CONTACT_FROM_EMAIL` | Verified Resend sender |
| `CONTACT_TO_SPEAKERS` | Optional override for `tech-talk` |
| `CONTACT_TO_SPONSORS` | Optional override for `sponsorship` |
| `CONTACT_TO_PRESS` / `CONTACT_TO_CONDUCT` | Optional overrides |
| `CONTACT_ALLOWED_ORIGINS` | Optional CORS allowlist |
| `CONTACT_RATE_LIMIT` | Default `8` per window |
| `CONTACT_RATE_WINDOW_MS` | Default `600000` (10 min) |
| `CONTACT_TURNSTILE_SECRET` | Reserved — Turnstile deferred until wired |

After a successful inbox send, the function **best-effort** sends a bilingual
auto-ack to the submitter (`pickAckCopy`). Ack failure does not fail the request.

### Google Forms fallback

If `PUBLIC_CONTACT_API_ENDPOINT` is empty, the general `ContactForm` can POST to
Google Forms (`src/lib/constances.ts`). Structured CFS/Sponsor fields are
**Resend-path only**.

## Anti-spam

1. Honeypot `website` (contact, CFS, sponsor, newsletter, PTD)
2. Allowlisted topics + length caps + URL heuristic
3. Isolate-local rate limit on `/api/contact` (best-effort per Worker isolate)
4. Turnstile: **deferred** until `CONTACT_TURNSTILE_SECRET` is configured

## Topics allowlist

`general` · `tech-talk` · `sponsorship` · `collaboration` ·
`the-library-of-tomorrow` · `press` · `conduct` · `other`

Aliases: `project`/`sponsor` → `sponsorship`; `speaker`/`cfs` → `tech-talk`.

## Client modules

- Validators: `src/lib/contact-form.ts`
- UI: `ContactForm.svelte`, `SpeakersApplicationForm.svelte`,
  `SponsorInquiryForm.svelte`
- Tests: `tests/unit/lib/contact-form.test.ts`
