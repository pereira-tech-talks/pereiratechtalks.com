# ARD capability manifest — `/.well-known/ai-catalog.json`

**Specs:** [agenticresourcediscovery.org](https://agenticresourcediscovery.org/) ·
[ards-project/ard-spec](https://github.com/ards-project/ard-spec) ·
[Agent-Card/ai-catalog](https://github.com/Agent-Card/ai-catalog) ·
[Skill](https://isitagentready.com/.well-known/agent-skills/ard/SKILL.md)

---

## What it is, and why this site has one

Agentic Resource Discovery is a single, predictable place an agent can look to
find out **what an origin offers it**: MCP servers, API schemas, machine-readable
corpora, A2A agents.

This site had spent a release making itself readable by agents — 492 Markdown
twins, an Agent Skills index, an MCP server card, an OpenAPI schema, a
`did:web` identity — and announced none of it in one place. An agent had to
already know each convention to find each surface. The manifest is the index
that makes the rest discoverable.

It was the last missing point on `isitagentready.com`, which scored the origin
**93/100 (Level 5, Agent-Native)** on 2026-08-27: Discoverability 4/4, Content
1/1, Bot Access Control 2/2, and API/Auth/MCP & Skill Discovery **7/8** for want
of exactly this file.

## The one rule

> **An entry is added only when the resource exists and returns 200.**

A capability manifest is a promise. A registry that indexes a 404 has been lied
to, and a manifest padded to raise a score is worse than no manifest. Never add
an entry for something planned, partial, or aspirational — this origin has no
A2A agent, so the manifest claims none.

`tests/unit/lib/ard-manifest.test.ts` enforces this: every advertised URL must
resolve to a real source under `public/` or `src/pages/`.

## Where it lives

| Piece | File |
|---|---|
| The manifest | `public/.well-known/ai-catalog.json` |
| Content type + CORS | `public/_headers` |
| Discovery pointers | `public/_headers` (`Link:`), `public/robots.txt`, `src/components/BaseHead.astro` (`<link rel="ai-catalog">`) |
| Tests | `tests/unit/lib/ard-manifest.test.ts` |

A **static file**, like the six `.well-known` resources beside it. That is this
repo's settled convention for `.well-known`, and the test covers the drift a
generated endpoint would otherwise protect against.

## Required shape

Top level: `specVersion` (non-empty string), `host`, `entries` (non-empty).

`host`: `displayName`, `identifier`. Ours is `did:web:pereiratechtalks.org`,
which resolves through the `/.well-known/did.json` this origin already serves —
so the identity is verifiable rather than decorative.

Each entry:

| Field | Rule |
|---|---|
| `identifier` | `urn:air:pereiratechtalks.org:<namespace>:<name>`, lowercase kebab, unique |
| `displayName` | human-readable |
| `type` | a real media type |
| `url` **or** `data` | **exactly one** — mutual exclusivity is enforced by the spec |
| `representativeQueries` | **2–5**, what a person would really ask |

## HTTP requirements

```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

The CORS header is **required, not optional**: a registry indexes the manifest
from another origin, and without it the fetch fails.

## What we advertise

| Entry | Points at |
|---|---|
| `mcp:site` | `/.well-known/mcp/server-card.json` |
| `feed:open-calls` | `/api/cfs-open.json` |
| `schema:openapi` | `/openapi.json` |
| `catalog:agent-skills` | `/.well-known/agent-skills/index.json` |
| `corpus:markdown` | `/index.md` (the twin corpus's entry point) |
| `index:llms` | `/llms.txt` |
| `feed:posts` | `/api/posts.json` |

## `representativeQueries` are the discovery surface

Registries turn these into semantic embeddings, so they are how the entry gets
found at all. Two consequences:

1. **Write real questions**, not labels. "which Pereira Tech Talks meetups have
   an open call for speakers" finds the entry; "open calls" does not.
2. **Write them in both languages across the set.** Spanish is the community's
   primary language; a manifest indexed only in English would be found only by
   English speakers. The test asserts both are present.

## When you add or remove a capability

1. Add or remove its entry — and only if it returns 200 today.
2. If it sits under a `Disallow` in `robots.txt`, add a specific `Allow`.
   Advertising a path we tell crawlers to skip is a contradiction; that is why
   `/api/cfs-open.json` has its own `Allow` line under the blanket
   `Disallow: /api/`.
3. Document it in `openapi.json` too if it is an HTTP endpoint.
4. Run `pnpm run test` — the manifest suite fails on a broken promise.
