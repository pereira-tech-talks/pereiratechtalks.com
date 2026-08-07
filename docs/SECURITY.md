# Security Guide

Security best practices for Pereira Tech Talks v3.0.0, a static site built with Astro.

## Overview

As a static site, Pereira Tech Talks has a different security profile than dynamic web applications. The main concerns are:

1. **Build-time secrets** - Protecting sensitive data during build
2. **Client-side exposure** - What data reaches the browser
3. **Third-party dependencies** - Supply chain security
4. **Content security** - Protecting against XSS in user-generated content

## Security Principles

### 1. No Secrets in Client Code

Static sites ship all client-side code to users. Never include secrets in:

- Astro component scripts
- Svelte component logic
- Client-side JavaScript

```typescript
// ❌ BAD - Secret exposed to client
const API_KEY = 'sk_live_xxxxx';

// ✅ GOOD - Only public data on client
const SITE_URL = import.meta.env.PUBLIC_SITE_URL;
```

### 2. Build-Time vs Runtime

Astro runs code at build time (server-side) and optionally at runtime (API routes). Understand the difference:

| Context | Secrets Safe? | Example |
|---------|---------------|---------|
| Build-time (`.astro` frontmatter) | ⚠️ Careful | Fetching data for static pages |
| API Routes (`src/pages/api/`) | ✅ Yes | Server-side endpoints |
| Client-side (Svelte with `client:*`) | ❌ No | Interactive components |

### 3. Minimal Attack Surface

As a static site:
- No database to protect
- No user authentication
- No session management
- Limited server-side logic

## Environment Variables

### Configuration

Use `.env` files for environment variables:

```bash
# .env (local development - DO NOT COMMIT)
PUBLIC_SITE_URL=http://localhost:8888
PRIVATE_API_KEY=sk_xxxxx

# .env.production
PUBLIC_SITE_URL=https://v3.pereiratechtalks.org
```

### Naming Convention

- `PUBLIC_*` - Safe to expose to client (e.g., `PUBLIC_SITE_URL`)
- No prefix - Server-only, never reaches client

```typescript
// Server-side only (build time or API routes)
const privateKey = import.meta.env.PRIVATE_API_KEY;

// Available on client
const siteUrl = import.meta.env.PUBLIC_SITE_URL;
```

### Security Rules

- [ ] Never commit `.env` files with secrets
- [ ] Use `.env.example` for documentation
- [ ] Rotate secrets if accidentally exposed
- [ ] Use CI/CD environment variables for builds

## Analytics Privacy

Umami analytics on pereiratechtalks.org is **cookieless** and **PII-free** by policy:

- **No GA4** — Umami Cloud only, with optional first-party proxy at `/api/umami/*`
- **No consent banner** — no cookies set by the analytics stack
- **Public env vars only** — `PUBLIC_UMAMI_WEBSITE_ID` and related `PUBLIC_UMAMI_*` flags; no Umami API secrets on the client
- **PII stripping** — `sanitizeEventData()` in `src/lib/analytics.ts` blocks payload keys matching `email`, `name`, `message`, etc.; enforced by `tests/unit/lib/analytics-privacy.test.ts`
- **Proxy hardening** — `functions/api/umami/[[path]].ts` allowlists only `script.js` and `api/send`; no arbitrary upstream forwarding
- **Server events** — AI bot and markdown analytics send bot name + path only; request bodies are never logged

See `docs/ANALYTICS.md` for the full event catalog and operator runbook (`.dwp/plans/PLAN_world_class_umami_analytics/analysis_results/UMAMI_OPERATOR_RUNBOOK.md`).

### Agent Tooling Secrets (DeepWorkPlan addons)

The repo vendors opt-in AI-agent tooling (DeepWorkPlan v2.17.0 + the AI Diff Reviewer and design-system addons). None of it ships to the production site — it is developer/agent-only — and its secrets are **never committed**:

- **AI Diff Reviewer:** installed in **Flow A (local-only)** — no CI workflow, no provider secret required. If Flow B (CI review) is ever adopted, the provider secret (typical: `CURSOR_API_KEY`) is set **only** in GitHub → Settings → Secrets and variables → Actions, never in the repo.
- **Skill installs** use the checksummed `npx skills add … -y` path (content hashes recorded in `skills-lock.json`) — no remote-installer-piped-to-shell.

## Content Security

### User-Generated Content

Blog posts are authored in Markdown/MDX. While you control the content, follow these practices:

```markdown
<!-- ✅ Safe - standard markdown -->
# My Post
This is safe content.

<!-- ⚠️ Careful with raw HTML in MDX -->
<script>alert('This would execute!')</script>
```

### Content Collection Validation

Zod schemas validate content at build time:

```typescript
// src/content.config.ts
const blog = defineCollection({
  schema: z.object({
    title: z.string().max(200),  // Limit length
    description: z.string().max(500),
    // Validates structure, prevents malformed data
  }),
});
```

### Top notifications / alerts

Site-wide `TopNotificationBar` reads from the `notifications` content collection (YAML). Rules:

- **Plain text only** in title/summary/body — no HTML rendering of notification fields.
- **Date window** (`startsAt`/`endsAt`) + `active` flag filter via `src/lib/notifications.ts`.
- **CTA hrefs** validated by Zod (`notificationSafeHref`): internal paths (`/…`) or absolute `http(s)://` only.
- **Non-dismissible** — the bar has no close control; it only collapses while the page is scrolled away from the top.
- **Modal** focus trap is client UX only — content remains author-controlled YAML.

### PTD subscribe (`functions/api/ptd-subscribe.ts`)

Cloudflare Pages Function for Pereira Tech Day interest signups:

- Email validated and length-capped; year/lang bounded.
- Forwards to `PTD_SUBSCRIBE_SHEETS_URL` (server env only — never `PUBLIC_*`).
- CORS origin allowlist via `CONTACT_ALLOWED_ORIGINS`.
- Returns generic errors; no secrets or sheet contents in responses.

### Community calendar feeds

The `/calendar` page embeds **public** Google Calendar IDs from the `communityCalendars` content collection. Security rules:

- **No Google API keys** in the repo or client bundle — only embeddable public calendar IDs (`googleCalendarId`).
- **HTTPS only** for `website` and `lumaUrl` fields (enforced by Zod at build time).
- **Calendar ID validation** rejects URL-shaped values (`http://`, `https://`) so embed `src` params cannot be hijacked to third-party origins.
- **ICS subscribe links** are built server-side from validated IDs; users leave the site only to `calendar.google.com`.
- **iframe** loads Google-hosted content only; no `sandbox` attribute (breaks Google Calendar UI). Rely on Google origin isolation.

To add a calendar, organizers must make the Google Calendar public and share the ID via the contact form — never share service-account credentials.

### Contact form (`/contact`)

The contact form (`ContactForm.svelte` + optional Cloudflare Pages Function at `/api/contact`) follows this threat model:

| Control | Implementation |
|---------|----------------|
| Honeypot | Hidden `website` field — submissions with any value are rejected client-side (`validateContactForm`) and should be dropped server-side |
| Reason allowlist | Only values from `t.contactPage.reasonOptions` are accepted |
| Input bounds | Subject ≤ 140 chars, message ≤ 2000 chars (`sanitizeContactText`) |
| Email format | Basic pattern check before submit |
| No secrets in client | API keys for Resend live only in Cloudflare env vars, never in the Astro bundle |
| Rate limiting | Isolate-local sliding window on `functions/api/contact.ts` (default 8 / 10 min via `CONTACT_RATE_LIMIT` / `CONTACT_RATE_WINDOW_MS`). Not a global Durable Object — best-effort per isolate. |
| Turnstile | Deferred — `CONTACT_TURNSTILE_SECRET` reserved; not enforced until wired |
| Auto-ack | Resend best-effort to submitter after inbox send; ack failure does not fail the request |
| Validation tests | `tests/unit/lib/contact-form.test.ts` covers topics, CFS/sponsor, honeypot, rate-limit helper, ack copy |

Prefill query params (`topic` preferred, legacy `reason` alias, plus `subject`, `message`) are sanitized on mount; never render raw query strings as HTML.

### External Links

When linking to external sites:

```astro
<!-- Add rel attributes for security -->
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>
```

## API Route Security

### Current Endpoints

The site has minimal API routes:

| Endpoint | Purpose | Security |
|----------|---------|----------|
| `/api/posts-en.json` | Blog search index (EN shard) | Public, cached |
| `/api/posts-es.json` | Blog search index (ES shard) | Public, cached |
| `/api/posts.json` | Blog search index (compatibility) | Public, cached |
| `/rss.xml` | RSS feed | Public |

### API Route Best Practices

```typescript
// src/pages/api/posts-en.json.ts (same pattern for posts-es.json)
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // Validate and sanitize any inputs
    // Return only necessary data
    const data = await getPublicPosts();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    // Don't expose error details
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    });
  }
};
```

## Dependency Security

### Regular Audits

```bash
# Check for known vulnerabilities
npm audit

# Fix automatically where safe
npm audit fix

# Check for outdated packages
pnpm run ncu:check
```

### Package Selection

When adding dependencies:

- [ ] Check package popularity and maintenance
- [ ] Review recent security advisories
- [ ] Prefer well-maintained packages
- [ ] Minimize dependencies when possible

### Lock Files

Always commit `pnpm-lock.yaml` to ensure reproducible builds. The lockfile is consumed by `corepack pnpm install --frozen-lockfile` in CI and Cloudflare Pages.

## Build Security

### Cloudflare Pages Deployment

The site deploys to Cloudflare Pages from the `dist/` folder:

```bash
pnpm run build
```

Security considerations:

- [ ] Build output (`docs/`) contains only public content
- [ ] No `.env` files in build output
- [ ] No source maps with sensitive paths
- [ ] HTTPS enforced by Cloudflare

### Build-Time Secrets

If you need secrets during build (e.g., fetching from a CMS):

```bash
# In CI/CD, set environment variables
PRIVATE_CMS_TOKEN=xxx pnpm run build
```

The secret is used at build time but not included in output.

## Headers and CSP

Cloudflare Pages allows custom headers. For enhanced security, consider:

### Meta Tags

```astro
<!-- src/components/BaseHead.astro -->
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
```

### Future Consideration

If moving to a host with header control (Vercel, Netlify):

```
# Example _headers file
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline';
```

## Security Checklist

### Before Committing

- [ ] No secrets in code
- [ ] No `.env` files committed
- [ ] External links have `rel="noopener noreferrer"`
- [ ] No unnecessary data exposed

### Before Deployment

- [ ] `npm audit` shows no critical vulnerabilities
- [ ] Build output contains only public content
- [ ] Environment variables properly configured
- [ ] Dependencies are up to date

### Periodic Review

- [ ] Audit dependencies monthly
- [ ] Review API routes for data exposure
- [ ] Check for new security best practices
- [ ] Update packages regularly

## Incident Response

If a secret is accidentally committed:

1. **Rotate immediately** - Generate new credentials
2. **Remove from history** - Use `git filter-branch` or BFG Repo-Cleaner
3. **Audit usage** - Check if secret was used maliciously
4. **Update documentation** - Prevent recurrence

## Event Certificates (W3C VC Level 2)

Static attendance diplomas use Ed25519 signing at build time — never in the browser.

| Secret / asset | Handling |
|----------------|----------|
| `CERT_SIGNING_PRIVATE_KEY` | CI/Cloudflare secret only; base64 32-byte Ed25519 seed |
| `public/.well-known/did.json` | Public key only — safe to commit |
| `tests/fixtures/cert-test-signing-key.json` | TEST ONLY — never use in production |
| Attendee CSV | `tmp/` only; emails stripped at import |
| `src/data/certificates/registry.json` | Names + opaque IDs; no emails |

Scripts: `pnpm run certs:import`, `certs:sign`, `certs:verify`. See `docs/features/CERTIFICATES.md` and operator runbook in plan `analysis_results/CERT_OPERATOR_RUNBOOK.md`.

Signing library (`src/lib/certificates/crypto/sign.ts`) must not be imported from client bundles. Verification uses browser-safe `verify.ts` only.

## Resources

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Astro Security Documentation](https://docs.astro.build/en/guides/security/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
