# Refined Draft — PLAN_certificate_generation_system

**Rigor tier:** `deep` — new product surface (credentials), cryptography, PII, public verification, visual diploma system, bilingual routes, CI secrets. Not micro; warrants a full Deep Work Plan.

**Mode:** trust / full-context (user provided PR #297 + static-site constraint + ambitious quality bar).

**Reference:** [PR #297 Feature/cert](https://github.com/pereira-tech-talks/pereiratechtalks.com/pull/297) on legacy AstroWind site — visual `CertificateDocument`, preview/verify mocks, `qrcode`, and `PLAN-CERTIFICADOS-NIVEL-2-ESTATICO.md` (W3C VC 2.0 + `did:web` + Ed25519 at build time). Local fetch: `tmp/pr297-cert-branch`.

---

## Objective

Ship a **world-class, fully static certificate system** for Pereira Tech Talks v3 so attendees of flagship events (especially **Pereira Tech Day**) receive a beautiful, printable, cryptographically verifiable diploma — generated at build time from an attendee registry, with public verification via QR, bilingual pages, and per-edition brand kits — without any runtime backend.

## Context

- **Repo:** `/app` — Astro 7 SSG, Svelte 5, Tailwind 4 PTT tokens, Biome, Vitest, Cloudflare Pages.
- **i18n:** Spanish primary at `/`, English at `/en`; Page Wrapper pattern; `getTranslations` / `getUrlPrefix`.
- **Theming:** Global PTT + per-edition `brandKit` via `EditionScope` / `[data-edition-theme]`.
- **Constraint:** No DB/API for issuance. Registry in git → sign at build/CI → static HTML + JSON-LD + `/.well-known/did.json`.
- **Legacy approach to elevate:** PR #297 preview UI + Nivel-2 static VC plan. Adapt paths, collections, middleware allowlist, orthography, a11y, and visual craft to v3.
- **Privacy:** Names are public on opaque URLs; no email/document IDs; no public directory listing; certificate pages `noindex`; opaque non-sequential IDs.
- **Ops:** Post-event CSV/Sheets → `certs:import` → human review → `certs:sign` (secret) → deploy → share personal URLs (email outside site).
- **Hosting note:** Legacy plan said GitHub Pages; v3 is **Cloudflare Pages** — CI secrets for `CERT_SIGNING_PRIVATE_KEY` must target the actual pipeline.

### Product north star (visual + trust)

1. **Diploma that looks museum-grade** — landscape A4 (297×210), edition palette, refined typography, subtle motifs (not generic AI-certificate kitsch), print/PDF via CSS `@media print`, QR that survives print.
2. **Trust Level 2** — W3C Verifiable Credentials 2.0 JSON-LD + `did:web:pereiratechtalks.org` + Ed25519Signature2020 (or Data Integrity equivalent justified in ADR); browser verification without backend.
3. **Roles** — attendance default; extensible types: `attendee` | `speaker` | `volunteer` | `organizer` (copy + layout variants).
4. **Event-scoped** — first ship for PTD editions; architecture reusable for other flagship events later.
5. **Pro verify UX** — valid / revoked / replaced / invalid signature / not found, with downloadable credential.
6. **Internal design lab** — `/internal/` showcase for certificate templates (dev-only).

## Tasks (user-defined → then mandatory finals)

### Phase A — Discovery & Architecture
1. Extract PR #297 reference workspace + visual/crypto inventory
2. Architecture Decision Record (static VC system for v3)
3. Privacy, ID strategy, and public URL surface design

### Phase B — Data, Crypto & Pipelines
4. Zod schemas + certificate registry content model
5. Opaque ID generation + CSV import pipeline (`certs:import`)
6. Dev Ed25519 keypair + `did:web` document scaffolding
7. Canonicalize + sign (Node/build) library
8. Verify library (Node CLI + browser-safe path)
9. npm scripts: import / sign / verify / revoke + build wiring
10. Security hardening (secrets, CI, registry git hygiene)

### Phase C — World-class Visual System
11. Certificate design tokens + print stylesheet (edition-aware)
12. `CertificateDocument` Astro component (bilingual, role-aware)
13. Certificate page chrome (print, download JSON-LD, share)
14. Verification result UI (pro states, a11y)
15. Internal hub certificate showcase

### Phase D — Routes, Artifacts & i18n
16. Static certificate pages (ES/EN) via `getStaticPaths`
17. Verify pages + middleware allowlist + SEO robots
18. Public JSON-LD artifacts + JSON-LD schema context
19. Translation keys + agent Markdown endpoints
20. Seed demo/fixture registry (safe sample names)

### Phase E — Product Integration & Quality
21. PTD edition integration (FAQ, CTA, event cert landing — no person index)
22. Documentation (`docs/features/CERTIFICATES.md`, SECURITY, ARCHITECTURE, AGENTS index)
23. Skill: `/issue-certificates` (batch issue workflow)
24. Comprehensive unit tests (import, sign, verify, ID, status)
25. Full browser QA (print, QR, verify, light/dark, mobile, a11y)
26. CI: conditional sign when secret present; docs for operators

### Mandatory finals
27. Security Review (+ AI Diff Reviewer local pass — Flow A installed)
28. Skills & Agents Discovery
29. Executive Report

## Guidelines

- Branch: cut from `pertechtalks_v3` (e.g. `feature/certificates`).
- Conventional commits: `type(scope): description - Task N of PLAN_certificate_generation_system` (scope often `certs` / `ptd` / `security`).
- Validation per behavior task: `pnpm run biome:check && pnpm run astro:check && pnpm run test`.
- Never commit private keys; public `did.json` only.
- Registry may contain PII (names) — document handling; use opaque IDs; prefer git-ignored production registries or restricted access notes in SECURITY.md.
- Bilingual sync mandatory; Spanish orthography; zero placeholders.
- Prefer CSS print over heavy PDF libraries; QR via build-time generation.
- Do not invent production attendee lists — fixtures only until organizers supply CSV.
- Elevate PR #297 visuals; do not blindly copy Roboto/emoji UI into v3 PTT design system.
- New top-level routes → `src/middleware.ts` allowlists.
- Team-agents: after Task 4, Groups C (11–15 visual) and D-partial crypto finish can be reasoned; default sequential is always valid. Parallel groups: A(1–3 discovery after 1), C(11–15 after 10), E-docs(22–23 after 21).

## Out of scope (explicit)

- Blockchain / Merkle Level 3
- Real-time check-in app
- Admin web UI / auth portal
- Automatic email delivery (document external tools only)
- Runtime revocation API (revocation = edit registry + redeploy)

## Success definition

An organizer can import a CSV of PTD attendees, CI signs credentials, deploy publishes personal diploma + verify URLs with working QR crypto verification, print looks premium under edition brand, and docs/skills let the next agent re-issue for future editions.
