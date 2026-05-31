---
name: security-check
description: Quick security checklist for a PR or set of files (secrets, input, logging). Use proactively for security reviews.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Glob, Grep, Bash
model: haiku
# === Documentation (ignored by tools, useful for humans) ===
tier: 1
intent: review
---

# Skill: Security Check

## Objective

Run a quick, checklist-based security pass on changed files or a PR: no hardcoded secrets, proper input handling, no sensitive data in logs, no obvious OWASP issues. Lightweight; for deeper review escalate to **security-auditor** agent. Follow docs/SECURITY.md.

## Non-Goals

- Does NOT perform full security audit
- Does NOT fix code (review only; report findings)
- Does NOT assess infrastructure security
- Does NOT replace security-auditor for auth/crypto/data flows

## Tier Classification

**Tier: 1** - Light/Cheap

**Reasoning:** Checklist-based; read-only; pattern matching (secrets, sanitization). Escalate to security-auditor when issues found.

## Inputs

### Required Parameters

- `$TARGET`: PR diff, or list of files to check (e.g., paths or "current PR")

### Optional Parameters

- `$FOCUS`: Focus area (default: all) — e.g., "secrets", "input", "logging"

## Prerequisites

- [ ] Target files or PR diff are accessible

## Steps

### Step 1: Get Scope

- List changed files or read PR diff

### Step 2: Run Checklist

**Secrets & config:**
- [ ] No hardcoded API keys, tokens, or passwords
- [ ] Secrets via environment variables (`.env`)
- [ ] No secrets in client-side code (Astro/Svelte)
- [ ] No secrets committed to repository

**Input & sanitization:**
- [ ] User input validated or sanitized where used
- [ ] No raw input in API responses without sanitization
- [ ] Search/filter inputs properly escaped

**Logging:**
- [ ] No sensitive data (tokens, PII) in log messages
- [ ] Console logs appropriate for static site context

**Static site considerations:**
- [ ] No sensitive data in build output
- [ ] API routes don't expose sensitive information
- [ ] Environment variables use proper PUBLIC_ prefix for client-side

**Obvious risks:**
- [ ] No eval() or unsafe dynamic code on user input
- [ ] No obvious XSS patterns in user-generated content

### Step 3: Report

- List findings by severity (blocking / suggestion)
- If any blocking or auth/data issues: recommend **security-auditor** agent

## Output Format

### Success Output

```
## ✅ Security Check Complete

### Scope
{Files or PR checked}

### Checklist
- Secrets: ✅
- Input/sanitization: ✅ / ⚠️ / ❌
- Logging: ✅ / ⚠️ / ❌
- Static site risks: ✅

### Findings
**Blocking:** {count} — {brief list}
**Suggestions:** {count} — {brief list}

### Recommendation
{Pass / Request changes / Escalate to security-auditor}
```

### Escalation

When sensitive data handling is involved and issues found:

```
## 🔄 Escalate to security-auditor

### Reason
{Why deeper review is needed}

### Findings so far
- {Finding 1}
- {Finding 2}

### Next step
Run security-auditor agent for full review (docs/SECURITY.md).
```

## Guardrails

### Scope Limits

- Read-only; no code changes
- Focus on checklist; for design/OWASP depth use security-auditor

### Stop Conditions

**Escalate to security-auditor** if:

- Auth or user data handling involved
- Any blocking finding on secrets
- Complex data flow requiring deeper analysis

## Definition of Done

- [ ] Checklist completed for target scope
- [ ] Findings listed with severity
- [ ] Clear recommendation (pass / request changes / escalate)

## Static Site Specific Checks

For Astro static sites:

1. **Build output** - Ensure `docs/` doesn't contain sensitive data
2. **API routes** - Check `src/pages/api/` endpoints for data exposure
3. **Environment variables** - Only `PUBLIC_*` vars available on client
4. **Content** - Blog posts don't accidentally include sensitive info

## Related

- [security-auditor](../../agents/security-auditor.md) - Full security review
- [pr-review-lite](../pr-review-lite/SKILL.md) - General PR checklist
- docs/SECURITY.md - Security standards
