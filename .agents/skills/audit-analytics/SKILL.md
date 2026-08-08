---
name: audit-analytics
description: Audit Umami analytics wiring — EVENTS catalog vs docs vs components, privacy lint, proxy config. Use proactively before releases or when adding trackEvent calls.
disable-model-invocation: false
allowed-tools: Read, Glob, Grep, Bash
model: sonnet
argument-hint: "[optional: event name]"
tier: 2
intent: review
max-files: 0
max-loc: 0
---

# Skill: Audit Analytics

## Objective

Produce a PASS/FAIL report on analytics consistency: `EVENTS` constant, `docs/ANALYTICS.md` catalog, component wiring, privacy (no PII keys), and first-party proxy configuration.

**Read-only** unless user asks to fix findings.

## Prerequisites

- [ ] `node_modules/` installed
- [ ] On branch with analytics changes (optional)

## Procedure

### 1. Event catalog parity

```bash
# List all EVENTS values
grep -E "^\s+[A-Z_]+:" src/lib/analytics.ts

# Find trackEvent / data-umami-event usages
rg "trackEvent\(EVENTS\.|data-umami-event" src/ --glob '*.{astro,svelte,ts}'
```

Compare against `docs/ANALYTICS.md` event table. Flag:
- Events in code missing from docs
- Docs entries with no wiring
- Raw string event names (forbidden)

### 2. Privacy lint

```bash
pnpm run test -- tests/unit/lib/analytics-privacy.test.ts
```

Also manual grep:

```bash
rg "trackEvent\([^)]+(email|name|message|phone)" src/ -i
```

### 3. Proxy configuration

Verify:
- `src/lib/constances.ts` → `ANALYTICS.umami.scriptUrl` defaults to `/api/umami/script.js`
- `src/components/BaseHead.astro` → `data-host-url` when proxy enabled
- `functions/api/umami/[[path]].ts` exists
- `functions/_lib/umami-proxy.ts` allowlist = `script.js`, `api/send` only

### 4. Loader guards

- `ANALYTICS.umami.enabled` requires `PROD` or `PUBLIC_UMAMI_ENABLE=true`
- No tracking without `PUBLIC_UMAMI_WEBSITE_ID`

### 5. Run unit tests

```bash
pnpm run test -- tests/unit/lib/analytics.test.ts tests/unit/functions/umami-proxy.test.ts
```

### 6. Optional: proxy smoke (after build)

```bash
pnpm run build
pnpm exec wrangler pages dev dist/ --port 8788 &
sleep 3
curl -sI http://localhost:8788/api/umami/script.js | head -3
```

## Report format

```markdown
## Analytics Audit: {date}

**Verdict:** PASS | NEEDS FIXES

### Catalog drift
- ...

### Privacy
- ...

### Proxy / loader
- ...

### Tests
- ...

### Recommended fixes
1. ...
```

## References

- `docs/ANALYTICS.md`
- `.dwp/plans/PLAN_world_class_umami_analytics/analysis_results/EVENT_TAXONOMY.md`
- `.dwp/plans/PLAN_world_class_umami_analytics/analysis_results/UMAMI_OPERATOR_RUNBOOK.md`

## Adding a new event (quick procedure)

1. Add to `EVENTS` in `src/lib/analytics.ts`
2. Wire via `trackEvent` (Svelte) or `data-umami-event` (Astro)
3. Update `docs/ANALYTICS.md` catalog table
4. Run `pnpm run test` (privacy lint catches PII keys)
5. Re-run this audit skill
