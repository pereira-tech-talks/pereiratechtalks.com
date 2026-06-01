# Contact Form Backend (v3)

The site exposes a single contact form on `/contact` (and `/es/contact`). The
**Call for Speakers** (`/call-for-speakers`) and **Sponsor Us** (`/sponsor-us`)
landing pages link to this form with prefilled `reason` and `subject` query
parameters, so they all share the same backend.

## Architecture

Two transports are supported. Pick one — they cannot run simultaneously per
deploy environment.

### 1. Cloudflare Pages Function + Resend (preferred)

- Endpoint: `functions/api/contact.ts` (mounted at `POST /api/contact`).
- The Svelte form (`src/components/contact/ContactForm.svelte`) POSTs a JSON
  payload to that endpoint.
- The function validates, sanitises, applies a small spam guard
  (honeypot + length limits + suspicious link heuristic) and forwards the
  message via [Resend](https://resend.com/) using the v1 emails API.

Enable it by setting:

| Variable                    | Where               | Notes                                                       |
| --------------------------- | ------------------- | ----------------------------------------------------------- |
| `PUBLIC_CONTACT_API_ENDPOINT` | Build-time (Astro) | e.g. `/api/contact`. Empty disables the backend.            |
| `RESEND_API_KEY`            | Cloudflare secret   | Server-side only. Never expose with the `PUBLIC_` prefix.    |
| `CONTACT_TO_EMAIL`          | Cloudflare env      | Inbox that receives form submissions.                       |
| `CONTACT_FROM_EMAIL`        | Cloudflare env      | Verified Resend sender (e.g. `PTT <hello@pereiratechtalks.org>`). |
| `CONTACT_ALLOWED_ORIGINS`   | Cloudflare env      | Optional comma list (defaults to request origin).           |

Add the secrets via the Cloudflare dashboard or:

```bash
wrangler pages secret put RESEND_API_KEY --project-name pereira-tech-talks
wrangler pages secret put CONTACT_TO_EMAIL --project-name pereira-tech-talks
wrangler pages secret put CONTACT_FROM_EMAIL --project-name pereira-tech-talks
```

### 2. Google Forms fallback (legacy / static-only)

If `PUBLIC_CONTACT_API_ENDPOINT` is empty, the Svelte form POSTs directly to
the Google Forms endpoint configured in `src/lib/constances.ts`. This keeps the
form working on static deploys without server functions, at the cost of
losing server-side validation and Resend's deliverability.

## Anti-spam

The Pages Function applies several layers:

1. **Honeypot field** (`website`). Hidden via `position: absolute; left: -9999px`
   and `aria-hidden`. Bots that fill every visible-looking input trigger an
   immediate fake-success response.
2. **Server-side validation** of `name`, `email` (regex), `reason` (allowlist),
   `subject`, and `message` (≥10 chars, ≤2000 chars).
3. **Link heuristic**: rejects messages whose name contains a URL or whose body
   contains more than six links.
4. **Length caps** at every field to bound payload size.

When a submission is flagged as spam, the function returns `200 OK` so the
bot's success-detection logic doesn't retry against another transport.

## Form UX

- Loading state with disabled submit button (`Sending…`).
- Inline field errors with `aria-live="polite"`.
- Generic error banner (`aria-live="assertive"`) when the API endpoint
  returns a non-2xx response — copy lives in `t.contactPage.submitError`.
- Success state focuses a `role="status"` block for screen readers.
- Optional query-param prefill (`?reason=…&subject=…&message=…`) used by the
  CFS and Sponsor Us pages.

## Testing locally

```bash
pnpm run build
PUBLIC_CONTACT_API_ENDPOINT=/api/contact \
RESEND_API_KEY=…                          \
CONTACT_TO_EMAIL=you@example.com          \
CONTACT_FROM_EMAIL='PTT <hello@example.com>' \
npx wrangler pages dev dist --port 8788
```

Then visit `http://localhost:8788/contact` and submit the form. Without the
secrets the function returns `503 backend_not_configured` and the Svelte form
surfaces the generic error banner.
