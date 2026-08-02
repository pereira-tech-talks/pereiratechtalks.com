# Certificates — Diploma Experience

Individual attendance diplomas for Pereira Tech Days (and future events): personal URL → print-grade diploma → Print/PDF, JSON, share → QR verification.

## URL surface

| Surface | Path |
|---------|------|
| Diploma (ES) | `/pereira-tech-days/{year}/certificates/{opaqueId}` |
| Diploma (EN) | `/en/pereira-tech-days/{year}/certificates/{opaqueId}` |
| Verify (ES) | `/certificates/verify?id={opaqueId}` |
| Verify (EN) | `/en/certificates/verify?id={opaqueId}` |
| Internal showcase | `/internal/certificates` (dev-only) |

See ADR: `.dwp/plans/PLAN_certificates_diploma_experience/analysis_results/02_ADR_URL_SURFACE.md`.

## Demo fixtures

Source: `src/data/certificates/demo-fixtures.ts`  
Registry: `src/lib/certificates/registry.ts`

- Opaque IDs (`ptd26_demo_*`); fictional `* Demo` names
- Roles: attendee, speaker, volunteer (+ revoked sample)
- **Never** commit real attendee emails or PII
- Production CSV / signed issuance lands via `PLAN_certificate_generation_system`

Demo attendee link:

`/pereira-tech-days/2026/certificates/ptd26_demo_a7k3m9qx`

## Components

| File | Role |
|------|------|
| `DiplomaDocument.astro` | Print-grade canvas |
| `CertificateActions.svelte` | Print / JSON / copy / share |
| `CertificateVerify.svelte` | Client verify (query `id`) |
| `CertificateLayout.astro` | Slim layout + `noindex` |
| `src/styles/certificates.css` | Screen + `@media print` A4 landscape |

Edition accents: wrap diploma in `EditionScope` on PTD routes.

## Download / print

1. **Primary:** browser Print → Save as PDF (`window.print()`; chrome/actions hidden in print CSS)
2. **Secondary:** Download JSON payload
3. Copy link / Web Share API when available

## SEO & privacy

- Diploma + verify: `noindex, nofollow`
- Sitemap excludes `/certificates/`
- No public attendee index

## i18n

All UI strings under `certificates` in `src/lib/translations/{en,es}.ts`.

## Handoff to crypto plan

This UX slice keeps URL shapes and status enum (`valid` / `revoked` / `replaced` / `expired` / `unknown`) stable for signing, VC payloads, and CI in `PLAN_certificate_generation_system`.
