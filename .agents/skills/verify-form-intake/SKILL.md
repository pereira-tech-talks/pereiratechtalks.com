---
name: verify-form-intake
description: Prove an intake form reaches Dailybot end to end — a real browser, a real Pages Function, and every answer read back by question UUID, then the test data deleted. Use whenever a form field is added, made required, or remapped, or before shipping a change to functions/api/contact.ts.
disable-model-invocation: false
allowed-tools: Read, Glob, Grep, Bash
model: sonnet
argument-hint: "[optional: form name — cfs | contact | sponsor | speaker-school | calendar | conduct]"
tier: 2
intent: verify
max-files: 0
max-loc: 0
---

# Skill: Verify Form Intake

## Objective

Prove that a change to a public form actually **arrives in Dailybot, on the right
question**, before it ships.

This is the gap the ordinary test suite cannot close. The unit tests call
`functions/api/contact.ts` directly. The e2e suites render the form and submit it
against an intercepted endpoint. **Neither crosses the middle** — and the middle
is where a field lands on the wrong question UUID and nobody notices until an
organizer reads a proposal with someone else's slides link in it.

Established in `PLAN_branch_audit_and_pr` Task 4, which found that no test had
ever submitted the Call for Speakers form.

## When to run it

- A field was **added, removed, renamed, or made required**.
- A question UUID in `functions/api/_dailybot.ts` changed.
- Anything in `functions/api/contact.ts` or `functions/_lib/` changed.
- A new form was added.

## Prerequisites

- `DAILYBOT_API_KEY` in the environment.
- The `dailybot` CLI authenticated (`dailybot me`).
- `docs/features/FORMS.md` open — it holds the question-UUID map and the rules
  that make submissions fail (choice value === label, JSON booleans,
  `all_responses_are_required`).

## Procedure

### 1. Stand up a real environment

`astro dev` does **not** serve Cloudflare Pages Functions. The form cannot
actually submit against it, so anything checked there proves nothing about
delivery.

```bash
pnpm run build
npx wrangler pages dev ./dist --port 8788 --ip 127.0.0.1 \
  --binding DAILYBOT_API_KEY="$DAILYBOT_API_KEY"
```

Confirm before going further:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8788/api/cfs-open.json
```

### 2. Drive the form in a real browser

Use Playwright against `http://127.0.0.1:8788`. **Two things will bite you**, and
both cost time the first time:

**The notification modal auto-opens and eats the clicks.** Its lab-browser guard
only recognises Lighthouse user agents, so Playwright — correctly — gets the
modal. Dismissing it at the start is not enough: the open is deferred until
after LCP settles, so it can appear several actions into the run. Pre-set the
flag the component itself checks:

```js
await page.addInitScript(() => {
  try {
    for (const lang of ['es', 'en'])
      sessionStorage.setItem(`ptt:notify-auto:<notification-id>:${lang}`, '1');
  } catch {}
});
```

**The form is a `client:visible` island.** The server-rendered markup looks
interactive before Svelte takes over, and Playwright's actionability checks know
nothing about hydration, so an early `fill()` is silently discarded. Wait for
Astro to drop the `ssr` attribute:

```js
await page.waitForFunction(() => {
  const island = document.querySelector('#cfs-title')?.closest('astro-island');
  return !!island && !island.hasAttribute('ssr');
});
```

Prefix every free-text value with `[TEST]` so the record is unmistakable in the
organizers' inbox if cleanup fails.

Submit **once per mode** the form supports — for Call for Speakers that is
meetup-scoped **and** global-with-no-meetup, because the two are meant to
produce different payloads.

### 3. Read the answers back, by question UUID

A `200` proves the request was accepted. It does **not** prove the answers
landed where they were meant to.

```bash
dailybot form responses <form_uuid> --limit 5 --json
```

Map each answer's key against `CFS_Q` (or the relevant map) in
`functions/api/_dailybot.ts` and check **field by field**. A value on the wrong
question UUID is silent data corruption and is exactly what this step exists to
catch.

Confirm the fields that differ by mode really do differ — e.g. the meetup URL
present when scoped, empty string when not.

### 4. Check the negative paths too

Direct POSTs, **each from its own `CF-Connecting-IP`** — the rate limiter's store
is module-level and shared, so reusing one IP makes later cases fail for the
wrong reason.

```bash
curl -s -X POST http://127.0.0.1:8788/api/contact \
  -H 'Content-Type: application/json' \
  -H 'CF-Connecting-IP: 10.0.0.1' \
  -d '{"_form":"cfs", ... }'
```

Cover at minimum: each required field missing; a `javascript:` and a `data:`
value in every clickable field; prose where a URL is required; a choice the
server should refuse; and the honeypot filled (**must** return `200` with
nothing forwarded).

### 5. Delete the test data — and verify the deletion

```bash
dailybot form delete <form_uuid> <response_uuid> --yes
```

Then **list the responses again and compare the whole set against what was there
before you started**. Do not just confirm yours are gone.

> ⚠️ In the run that established this skill, two responses that were *not* part of
> the test also disappeared across three by-UUID deletes. Cause undetermined.
> **Record the full before/after list**, and if anything else is missing, say so
> rather than assuming the CLI did what it documents.

Never delete a record you did not create without asking.

### 6. Report

- The field-by-field table, per mode.
- The negative-path results.
- The deletion, with before/after counts.
- **Never paste raw Dailybot response bodies** — `docs/features/FORMS.md`
  forbids it; they may echo submitted content, including Code of Conduct
  reports.

## What this does not replace

The persistent suites in `tests/e2e/forms/`, which run on every CI build against
an intercepted endpoint. Those cover the browser half continuously. This skill
covers the half CI cannot: real delivery, on demand, before a risky change ships.
