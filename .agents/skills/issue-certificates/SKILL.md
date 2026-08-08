---
name: issue-certificates
description: Batch-issue Pereira Tech Talks event attendance certificates from CSV through import, sign, verify, and build. Use when post-event diploma issuance is needed.
disable-model-invocation: false
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
argument-hint: "[event-id, csv-path]"
tier: 2
intent: create
max-files: 10
max-loc: 400
---

# Skill: Issue Certificates

## Objective

Safely issue a batch of static, signed attendance certificates for a flagship event (e.g. Pereira Tech Day) using the v3 certificate pipeline.

## Mandatory policy

- **Never** commit `CERT_SIGNING_PRIVATE_KEY`, `*.pem`, or raw attendee CSV files
- **Never** store emails in `registry.json` or `public/certificates/**/*.json`
- Use opaque IDs only (`certs:import` generates them when missing)
- Production signing uses CI secret; local dev uses `--demo` test key only on fictional data

## Prerequisites

- Post-event CSV with columns: `name` (required), `role` (optional: attendee|speaker|volunteer), `certificate_id` (optional)
- Event entry exists in `src/data/certificates/registry.json` under `events[]`
- `pnpm install` completed

## Workflow

### 1. Stage CSV (gitignored)

Place CSV in `tmp/` — e.g. `tmp/attendees-ptd-2026.csv`. Do not commit.

### 2. Import

```bash
pnpm run certs:import -- --csv tmp/attendees-ptd-2026.csv --event ptd-2026
```

Review warnings for duplicate names. Inspect `src/data/certificates/registry.json`.

### 3. Sign

```bash
# Production (CI or local with real secret):
CERT_SIGNING_PRIVATE_KEY=<base64> pnpm run certs:sign

# Dev/demo only:
pnpm run certs:sign -- --demo
```

Outputs: `public/certificates/{eventId}/{certificateId}.json` and updates `public/.well-known/did.json` when syncing DID.

### 4. Verify

```bash
pnpm run certs:verify
# or with demo key:
pnpm run certs:verify -- --demo
```

### 5. Build & validate

```bash
pnpm run biome:check && pnpm run astro:check && pnpm run test && pnpm run build
```

### 6. Share URLs

Diploma: `https://pereiratechtalks.org/pereira-tech-days/{year}/certificates/{id}`  
Verify (QR): `https://pereiratechtalks.org/certificates/verify?id={id}`

## Revocation

Set `status: "revoked"` on the registry record, re-run `certs:sign`, redeploy.

## References

- `docs/features/CERTIFICATES.md`
- `.dwp/plans/PLAN_certificate_generation_system/analysis_results/CERT_OPERATOR_RUNBOOK.md`
- `.dwp/plans/PLAN_certificate_generation_system/analysis_results/CERT_KEY_ROTATION.md`

## Non-goals

- Does not send email to attendees
- Does not create diploma UI components (already shipped)
- Does not add new events to registry — ensure event metadata exists first
