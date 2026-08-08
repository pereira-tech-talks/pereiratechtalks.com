# Environment setup

Developer and Cloudflare Pages environment variables for Pereira Tech Talks v3.

## Local Docker

Copy `docker/local/pertechtalks/.env.example` → `.env` inside the same directory (or your compose env file). Never commit real secrets.

## Community intake forms (Dailybot)

| Variable | Required | Notes |
|----------|----------|-------|
| `DAILYBOT_API_KEY` | Yes (Functions) | Personal API key from Dailybot user settings. Server-only. See [FORMS.md](./features/FORMS.md). |
| `PUBLIC_CONTACT_API_ENDPOINT` | Optional | Defaults to `/api/contact` in code. Override only if the Function is mounted elsewhere. |
| `RESEND_API_KEY` | Optional | Submitter ack after Dailybot success |
| `CONTACT_FROM_EMAIL` | Optional with Resend | Verified sender |
| `CONTACT_RATE_LIMIT` / `CONTACT_RATE_WINDOW_MS` | Optional | Defaults 8 / 600000 |
| `CONTACT_ALLOWED_ORIGINS` | Recommended in prod | Comma-separated Origins for CORS (e.g. `https://pereiratechtalks.org`). When empty, the Function reflects the request Origin — tighten for production. |

**Key rotation:** Revoke the key in Dailybot → user settings → API keys, set the new value in Cloudflare Pages secrets (Production + Preview) and local `.env`, redeploy / restart Functions.

**Local Functions:** `pnpm run dev` (Astro) does not execute `functions/`. Use Wrangler Pages Dev against a build output with bindings, or deploy a Preview environment for end-to-end form smoke.

## Analytics

See [ANALYTICS.md](./ANALYTICS.md) for `PUBLIC_UMAMI_*` and Bing verification. Do not add Google site-verification meta tags.
